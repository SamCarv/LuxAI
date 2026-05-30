from collections import defaultdict
from datetime import datetime, timedelta, timezone
from decimal import Decimal
from typing import Any, Dict, List, Optional
from uuid import UUID

from sqlmodel import Session, func, select

from app.enums.transaction_type import TransactionType
from app.models.bank_account import BankAccount
from app.models.category import Category
from app.models.goal import Goal
from app.models.goal_transaction import GoalTransaction
from app.models.transaction import Transaction
from app.models.user import User


async def get_dashboard_data(
    session: Session,
    current_user: User,
    days: int = 30,
) -> Dict[str, Any]:
    account_ids = session.exec(
        select(BankAccount.id).where(BankAccount.user_id == current_user.id)
    ).all()

    if not account_ids:
        return _empty_dashboard_response()

    now = datetime.now(timezone.utc)
    start_date = now - timedelta(days=days + 1)

    transactions = session.exec(
        select(Transaction)
        .where(
            Transaction.account_id.in_(account_ids),
            Transaction.date >= start_date,
        )
        .order_by(Transaction.date.asc())
    ).all()

    older_transactions = session.exec(
        select(Transaction)
        .where(
            Transaction.account_id.in_(account_ids),
            Transaction.date < start_date,
        )
        .order_by(Transaction.date.asc())
    ).all()

    categories = session.exec(
        select(Category).where(Category.user_id == current_user.id)
    ).all()
    category_map = {cat.id: cat.name for cat in categories}

    goals = session.exec(select(Goal).where(Goal.user_id == current_user.id)).all()

    all_transactions = older_transactions + transactions

    charts = _build_charts(transactions, older_transactions, category_map)
    insights = _build_insights(all_transactions, categories, category_map, now, days)
    goals_analysis = _build_goals_analysis(session, goals, all_transactions, now)

    accounts = session.exec(
        select(BankAccount).where(BankAccount.user_id == current_user.id)
    ).all()

    total_balance = sum(account.balance for account in accounts)

    return {
        "summary": {
            "total_balance": float(total_balance),
            "total_accounts": len(accounts),
            "total_transactions": len(all_transactions),
            "period_days": days,
        },
        "charts": charts,
        "insights": insights,
        "goals_analysis": goals_analysis,
    }


def _build_charts(
    transactions: List[Transaction],
    older_transactions: List[Transaction],
    category_map: Dict[UUID, str],
) -> Dict[str, Any]:
    charts: Dict[str, Any] = {}

    income_vs_expense = _build_income_vs_expense_chart(transactions, older_transactions)
    charts["income_vs_expense"] = income_vs_expense

    expense_by_category = _build_expense_by_category_chart(transactions, category_map)
    charts["expense_by_category"] = expense_by_category

    daily_balance_evolution = _build_daily_balance_evolution(transactions)
    charts["daily_balance_evolution"] = daily_balance_evolution

    cumulative_cashflow = _build_cumulative_cashflow(transactions)
    charts["cumulative_cashflow"] = cumulative_cashflow

    return charts


def _build_income_vs_expense_chart(
    transactions: List[Transaction],
    older_transactions: List[Transaction],
) -> Dict[str, Any]:
    daily_income = defaultdict(float)
    daily_expense = defaultdict(float)

    for tx in older_transactions:
        day_key = tx.date.strftime("%Y-%m-%d")
        if tx.type == TransactionType.INCOME:
            daily_income[day_key] += float(tx.amount)
        else:
            daily_expense[day_key] += float(tx.amount)

    for tx in transactions:
        day_key = tx.date.strftime("%Y-%m-%d")
        if tx.type == TransactionType.INCOME:
            daily_income[day_key] += float(tx.amount)
        else:
            daily_expense[day_key] += float(tx.amount)

    all_dates = sorted(set(list(daily_income.keys()) + list(daily_expense.keys())))

    return {
        "labels": all_dates,
        "datasets": [
            {
                "label": "Receitas",
                "data": [daily_income.get(d, 0) for d in all_dates],
                "color": "#4CAF50",
            },
            {
                "label": "Despesas",
                "data": [daily_expense.get(d, 0) for d in all_dates],
                "color": "#F44336",
            },
        ],
    }


def _build_expense_by_category_chart(
    transactions: List[Transaction],
    category_map: Dict[UUID, str],
) -> Dict[str, Any]:
    category_totals = defaultdict(float)

    for tx in transactions:
        if tx.type == TransactionType.EXPENSE:
            cat_name = category_map.get(tx.category_id, "Sem categoria")
            category_totals[cat_name] += float(tx.amount)

    sorted_categories = sorted(
        category_totals.items(), key=lambda x: x[1], reverse=True
    )

    colors = [
        "#FF6384",
        "#36A2EB",
        "#FFCE56",
        "#4BC0C0",
        "#9966FF",
        "#FF9F40",
        "#C9CBCF",
        "#7BC8A4",
        "#E8A87C",
        "#85C1E9",
    ]

    return {
        "labels": [cat for cat, _ in sorted_categories],
        "datasets": [
            {
                "label": "Despesas por Categoria",
                "data": [total for _, total in sorted_categories],
                "colors": colors[: len(sorted_categories)],
            }
        ],
    }


def _build_daily_balance_evolution(
    transactions: List[Transaction],
) -> Dict[str, Any]:
    daily_net = defaultdict(float)

    for tx in transactions:
        day_key = tx.date.strftime("%Y-%m-%d")
        if tx.type == TransactionType.INCOME:
            daily_net[day_key] += float(tx.amount)
        else:
            daily_net[day_key] -= float(tx.amount)

    sorted_dates = sorted(daily_net.keys())

    return {
        "labels": sorted_dates,
        "datasets": [
            {
                "label": "Saldo Líquido Diário",
                "data": [daily_net[d] for d in sorted_dates],
                "color": "#2196F3",
            }
        ],
    }


def _build_cumulative_cashflow(
    transactions: List[Transaction],
) -> Dict[str, Any]:
    daily_net = defaultdict(float)

    for tx in transactions:
        day_key = tx.date.strftime("%Y-%m-%d")
        if tx.type == TransactionType.INCOME:
            daily_net[day_key] += float(tx.amount)
        else:
            daily_net[day_key] -= float(tx.amount)

    sorted_dates = sorted(daily_net.keys())
    cumulative = []
    running_sum = 0.0
    for d in sorted_dates:
        running_sum += daily_net[d]
        cumulative.append(running_sum)

    return {
        "labels": sorted_dates,
        "datasets": [
            {
                "label": "Fluxo de Caixa Acumulado",
                "data": cumulative,
                "color": "#FF9800",
            }
        ],
    }


def _build_insights(
    transactions: List[Transaction],
    categories: List[Category],
    category_map: Dict[UUID, str],
    now: datetime,
    days: int,
) -> List[Dict[str, Any]]:
    insights: List[Dict[str, Any]] = []

    if not transactions:
        insights.append(
            {
                "type": "info",
                "title": "Sem dados suficientes",
                "description": "Adicione transações para receber insights financeiros.",
            }
        )
        return insights

    total_income = sum(
        float(tx.amount) for tx in transactions if tx.type == TransactionType.INCOME
    )
    total_expense = sum(
        float(tx.amount) for tx in transactions if tx.type == TransactionType.EXPENSE
    )
    total_transactions = len(transactions)

    if total_income > 0:
        savings_rate = ((total_income - total_expense) / total_income) * 100
    else:
        savings_rate = 0

    insights.append(
        {
            "type": "savings_rate",
            "title": "Taxa de Poupança",
            "description": f"Sua taxa de poupança é de {savings_rate:.1f}% no período.",
            "value": round(savings_rate, 1),
            "icon": "piggy-bank",
        }
    )

    avg_daily_expense = total_expense / max(days, 1)
    insights.append(
        {
            "type": "daily_average",
            "title": "Média Diária de Gastos",
            "description": f"Você gasta em média R$ {avg_daily_expense:,.2f} por dia.",
            "value": round(avg_daily_expense, 2),
            "icon": "calendar",
        }
    )

    if total_income > 0:
        if savings_rate >= 20:
            insights.append(
                {
                    "type": "positive",
                    "title": "Ótima taxa de poupança!",
                    "description": f"Com {savings_rate:.0f}% de economia, você está no caminho certo para alcançar suas metas financeiras.",
                    "icon": "trending-up",
                }
            )
        elif savings_rate > 0:
            insights.append(
                {
                    "type": "warning",
                    "title": "Poupança moderada",
                    "description": f"Sua taxa de poupança de {savings_rate:.0f}% pode ser melhorada. Tente reduzir gastos não essenciais.",
                    "icon": "alert-circle",
                }
            )
        else:
            insights.append(
                {
                    "type": "danger",
                    "title": "Atenção: Gastos excedem receitas!",
                    "description": "Suas despesas estão maiores que suas receitas. Considere revisar seu orçamento.",
                    "icon": "alert-triangle",
                }
            )

    if categories and transactions:
        category_expenses = defaultdict(float)
        for tx in transactions:
            if tx.type == TransactionType.EXPENSE:
                cat_name = category_map.get(tx.category_id, "Sem categoria")
                category_expenses[cat_name] += float(tx.amount)

        if category_expenses:
            top_category = max(category_expenses, key=category_expenses.get)
            top_pct = (
                (category_expenses[top_category] / total_expense) * 100
                if total_expense > 0
                else 0
            )
            insights.append(
                {
                    "type": "top_category",
                    "title": "Maior Categoria de Gasto",
                    "description": f"'{top_category}' representa {top_pct:.1f}% dos seus gastos. Avalie se esses gastos são realmente necessários.",
                    "value": round(top_pct, 1),
                    "icon": "tag",
                }
            )

    trend = _calculate_spending_trend(transactions, now, days)
    if trend is not None:
        trend_type = "positive" if trend < 0 else "danger"
        trend_word = "diminuindo" if trend < 0 else "aumentando"
        insights.append(
            {
                "type": "trend",
                "title": "Tendência de Gastos",
                "description": f"Seus gastos estão {trend_word} a uma taxa de R$ {abs(trend):,.2f} por dia.",
                "value": round(trend, 2),
                "icon": "trending-up" if trend > 0 else "trending-down",
            }
        )

    return insights


def _calculate_spending_trend(
    transactions: List[Transaction],
    now: datetime,
    days: int,
) -> Optional[float]:
    if len(transactions) < 3:
        return None

    mid_point = days // 2
    cutoff_date = now - timedelta(days=mid_point)

    first_half = sum(
        float(tx.amount)
        for tx in transactions
        if tx.type == TransactionType.EXPENSE and tx.date < cutoff_date
    )
    second_half = sum(
        float(tx.amount)
        for tx in transactions
        if tx.type == TransactionType.EXPENSE and tx.date >= cutoff_date
    )

    if mid_point == 0:
        return None

    first_half_daily = first_half / mid_point
    second_half_daily = second_half / max(days - mid_point, 1)
    return round(second_half_daily - first_half_daily, 2)


def _build_goals_analysis(
    session: Session,
    goals: List[Goal],
    transactions: List[Transaction],
    now: datetime,
) -> List[Dict[str, Any]]:
    goals_analysis: List[Dict[str, Any]] = []

    for goal in goals:
        goal_transactions = session.exec(
            select(GoalTransaction).where(GoalTransaction.goal_id == goal.id)
        ).all()

        total_allocated = float(goal.current_amount)
        remaining = float(goal.target_amount) - total_allocated
        progress_pct = (
            (total_allocated / float(goal.target_amount)) * 100
            if float(goal.target_amount) > 0
            else 100
        )

        days_remaining = (goal.target_date - now).days
        days_remaining = max(days_remaining, 0)

        if goal_transactions:
            first_allocation = min(gt.created_at for gt in goal_transactions)
            days_since_first = (now - first_allocation).days
            days_since_first = max(days_since_first, 1)
        else:
            first_allocation = None
            days_since_first = None

        monthly_income_rate = 0.0
        if goal_transactions and days_since_first and days_since_first > 0:
            monthly_income_rate = (total_allocated / days_since_first) * 30

        estimated_days_to_complete = None
        is_on_track = None
        estimated_completion_date = None

        if remaining > 0 and monthly_income_rate > 0:
            estimated_days_to_complete = (remaining / monthly_income_rate) * 30
            estimated_completion_date = now + timedelta(days=estimated_days_to_complete)
            is_on_track = estimated_days_to_complete <= days_remaining
        elif remaining <= 0:
            is_on_track = True
            estimated_days_to_complete = 0
            estimated_completion_date = now

        goal_analysis = {
            "goal_id": str(goal.id),
            "title": goal.title,
            "target_amount": float(goal.target_amount),
            "current_amount": total_allocated,
            "remaining_amount": remaining,
            "progress_percentage": round(progress_pct, 1),
            "target_date": goal.target_date.isoformat(),
            "days_remaining": days_remaining,
            "is_on_track": is_on_track,
            "total_allocated_transactions": len(goal_transactions),
            "monthly_income_rate": round(monthly_income_rate, 2),
            "estimated_days_to_complete": (
                round(estimated_days_to_complete)
                if estimated_days_to_complete is not None
                else None
            ),
            "estimated_completion_date": (
                estimated_completion_date.isoformat()
                if estimated_completion_date
                else None
            ),
        }

        goals_analysis.append(goal_analysis)

    goals_analysis.sort(
        key=lambda g: (
            0 if g["is_on_track"] is None else (1 if not g["is_on_track"] else 2)
        )
    )

    return goals_analysis


def _empty_dashboard_response() -> Dict[str, Any]:
    return {
        "summary": {
            "total_balance": 0,
            "total_accounts": 0,
            "total_transactions": 0,
            "period_days": 30,
        },
        "charts": {
            "income_vs_expense": {"labels": [], "datasets": []},
            "expense_by_category": {"labels": [], "datasets": []},
            "daily_balance_evolution": {"labels": [], "datasets": []},
            "cumulative_cashflow": {"labels": [], "datasets": []},
        },
        "insights": [
            {
                "type": "info",
                "title": "Sem dados",
                "description": "Adicione contas bancárias e transações para ver seu dashboard.",
            }
        ],
        "goals_analysis": [],
    }
