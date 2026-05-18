from __future__ import annotations

import asyncio
import logging
import os
from calendar import monthrange
from datetime import date, datetime, timedelta, timezone
from decimal import Decimal
from typing import Optional

from sqlmodel import Session, select

from app.db.database import engine
from app.enums.recurrence_frequency import RecurrenceFrequency
from app.enums.transaction_type import TransactionType
from app.models.bank_account import BankAccount
from app.models.transaction import Transaction

logger = logging.getLogger(__name__)


def _signed_amount(amount: Decimal, transaction_type: TransactionType) -> Decimal:
    return amount if transaction_type == TransactionType.INCOME else -amount


def _next_month(year: int, month: int) -> tuple[int, int]:
    if month == 12:
        return year + 1, 1
    return year, month + 1


def _clamped_month_day(year: int, month: int, recurrence_day: int) -> date:
    last_day = monthrange(year, month)[1]
    day = min(recurrence_day, last_day)
    return date(year, month, day)


def _next_due_date_after(
    frequency: RecurrenceFrequency,
    recurrence_day: Optional[int],
    after_date: date,
) -> Optional[date]:
    if frequency == RecurrenceFrequency.DAILY:
        return after_date + timedelta(days=1)

    if frequency == RecurrenceFrequency.WEEKLY:
        if recurrence_day is None:
            return None
        days_ahead = recurrence_day - after_date.isoweekday()
        if days_ahead <= 0:
            days_ahead += 7
        return after_date + timedelta(days=days_ahead)

    if frequency == RecurrenceFrequency.MONTHLY:
        if recurrence_day is None:
            return None
        candidate = _clamped_month_day(
            after_date.year, after_date.month, recurrence_day
        )
        if candidate <= after_date:
            year, month = _next_month(after_date.year, after_date.month)
            candidate = _clamped_month_day(year, month, recurrence_day)
        return candidate

    return None


def _combine_date_with_template_time(
    template_date: datetime, due_date: date
) -> datetime:
    template_time = template_date.timetz()
    return datetime.combine(due_date, template_time)


def generate_recurring_transactions(
    session: Session,
    now: Optional[datetime] = None,
) -> int:
    current_dt = now or datetime.now(timezone.utc)
    today = current_dt.date()

    templates = session.exec(
        select(Transaction).where(
            Transaction.recurrence_frequency != RecurrenceFrequency.NONE,
            Transaction.recurrence_parent_id.is_(None),
        )
    ).all()

    created = 0

    for template in templates:
        if template.recurrence_frequency == RecurrenceFrequency.NONE:
            continue

        last_occurrence = session.exec(
            select(Transaction)
            .where(Transaction.recurrence_parent_id == template.id)
            .order_by(Transaction.date.desc())
            .limit(1)
        ).first()

        last_date_dt = template.date
        if last_occurrence and last_occurrence.date > last_date_dt:
            last_date_dt = last_occurrence.date

        last_date = last_date_dt.date()
        next_due = _next_due_date_after(
            template.recurrence_frequency,
            template.recurrence_day,
            last_date,
        )
        if next_due is None:
            continue

        account = session.get(BankAccount, template.account_id)
        if not account:
            logger.warning(
                "Skipping recurring transaction %s: account %s not found",
                template.id,
                template.account_id,
            )
            continue

        while next_due <= today:
            occurrence_datetime = _combine_date_with_template_time(
                template.date, next_due
            )
            new_transaction = Transaction(
                description=template.description,
                amount=template.amount,
                type=template.type,
                category_id=template.category_id,
                account_id=template.account_id,
                recurrence_frequency=RecurrenceFrequency.NONE,
                recurrence_day=None,
                metadata_info=dict(template.metadata_info or {}),
                description_vector=template.description_vector,
                recurrence_parent_id=template.id,
                date=occurrence_datetime,
            )

            account.balance += _signed_amount(template.amount, template.type)
            session.add(account)
            session.add(new_transaction)
            created += 1

            last_date = next_due
            next_due = _next_due_date_after(
                template.recurrence_frequency,
                template.recurrence_day,
                last_date,
            )
            if next_due is None:
                break

    if created:
        session.commit()

    return created


async def run_recurrence_scheduler() -> None:
    interval_seconds = int(os.getenv("RECURRENCE_SCHEDULER_INTERVAL_SECONDS", "3600"))

    try:
        while True:
            try:
                with Session(engine) as session:
                    created = generate_recurring_transactions(session)
                    if created:
                        logger.info("Generated %s recurring transactions", created)
            except Exception:
                logger.exception("Recurring transaction generation failed")

            await asyncio.sleep(interval_seconds)
    except asyncio.CancelledError:
        logger.info("Recurrence scheduler cancelled")
        raise
