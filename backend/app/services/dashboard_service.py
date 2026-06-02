import calendar
import os
from datetime import date, datetime, timezone
from decimal import Decimal
from typing import Optional

from fastapi import HTTPException
from pydantic_ai import Agent
from pydantic_ai.models.google import GoogleModel, GoogleModelSettings
from pydantic_ai.providers.google import GoogleProvider
from sqlmodel import Session, select

from app.core.security import decrypt_string
from app.enums.transaction_type import TransactionType
from app.models.bank_account import BankAccount
from app.models.category import Category
from app.models.goal import Goal
from app.models.transaction import Transaction
from app.models.user import User

GEMINI_MODEL = "gemini-3-flash-preview"

DASHBOARD_SYSTEM_PROMPT = (
    "Você é um analista financeiro pessoal altamente qualificado. "
    "Seu trabalho é analisar os dados financeiros de um usuário em um determinado mês "
    "e fornecer uma análise completa, perspicaz e útil em português.\n\n"
    "Sua análise DEVE conter as seguintes seções, formatadas em Markdown:\n\n"
    "## 📊 Visão Geral do Mês\n"
    "Resumo geral: total de receitas, total de despesas, saldo do mês, "
    "e uma análise de como está a saúde financeira. "
    "Comente se a pessoa gastou mais do que ganhou ou se conseguiu poupar.\n\n"
    "## 🏷️ Análise por Categoria\n"
    "Liste cada categoria com seu total de gastos, percentual em relação ao total, "
    "e um comentário sobre se o gasto nessa categoria parece alto, baixo ou razoável. "
    "Destaque a categoria com maior gasto.\n\n"
    "## 🔥 Maiores Consumos e Ritmo de Gastos\n"
    "Identifique os padrões de gasto: quais foram os maiores gastos individuais? "
    "Como está o ritmo de gastos ao longo do mês? "
    "Há alguma tendência preocupante (ex: gastos concentrados em fins de semana, "
    "ou muitos gastos pequenos que somam um valor significativo)?\n\n"
    "## 🎯 Progresso das Metas\n"
    "Para cada meta financeira, calcule o percentual de progresso, "
    "estime quanto tempo falta (se houver prazo), e dê dicas práticas "
    "e personalizadas sobre como acelerar o progresso. "
    "Se não houver metas cadastradas, sugira metas que fariam sentido "
    "com base no perfil de gastos observado.\n\n"
    "## 💡 Recomendações e Intuições\n"
    "Forneça de 3 a 5 recomendações acionáveis e específicas para o usuário "
    "melhorar sua vida financeira no próximo mês. "
    "Seja direto e prático, baseando-se nos dados reais apresentados.\n\n"
    "IMPORTANTE: Seja sempre encorajador e construtivo. "
    "Use emojis com moderação para tornar a leitura agradável. "
    "Números devem ser formatados como moeda brasileira (R$ X.XXX,XX)."
)


def _resolve_api_key(current_user: User) -> str:
    if current_user.encrypted_google_api_key:
        return decrypt_string(current_user.encrypted_google_api_key)

    env_key = os.getenv("GOOGLE_API_KEY", "")
    if not env_key:
        raise HTTPException(status_code=400, detail="Google API Key not configured")
    return env_key


def _get_month_range(month: int, year: int) -> tuple[datetime, datetime]:
    """Retorna o range de datas (início e fim) para o mês/ano especificado."""
    last_day = calendar.monthrange(year, month)[1]

    start_date = datetime(year, month, 1, tzinfo=timezone.utc)
    end_date = datetime(year, month, last_day, 23, 59, 59, 999999, tzinfo=timezone.utc)

    return start_date, end_date


def _build_dashboard_prompt(
    session: Session,
    current_user: User,
    month: int,
    year: int,
    month_name: str,
) -> str:
    """Coleta todos os dados relevantes e monta o prompt para a IA."""

    start_date, end_date = _get_month_range(month, year)

    # -- Contas bancárias --
    accounts = session.exec(
        select(BankAccount).where(BankAccount.user_id == current_user.id)
    ).all()
    accounts_str = (
        "\n".join(
            f"  - {a.name}: Saldo atual R$ {a.balance:,.2f} ({a.account_type})"
            for a in accounts
        )
        if accounts
        else "  Nenhuma conta cadastrada"
    )

    # -- Transações do mês --
    account_ids = [a.id for a in accounts]

    if not account_ids:
        transactions = []
    else:
        transactions = session.exec(
            select(Transaction)
            .where(
                Transaction.account_id.in_(account_ids),  # type: ignore[attr-defined]
                Transaction.date >= start_date,
                Transaction.date <= end_date,
            )
            .order_by(Transaction.date.desc())  # type: ignore[attr-defined]
        ).all()

    # -- Totais por tipo --
    total_income = sum(
        (tx.amount for tx in transactions if tx.type == TransactionType.INCOME),
        Decimal("0"),
    )
    total_expense = sum(
        (tx.amount for tx in transactions if tx.type == TransactionType.EXPENSE),
        Decimal("0"),
    )
    balance_month = total_income - total_expense

    # -- Totais por categoria --
    categories = session.exec(
        select(Category).where(Category.user_id == current_user.id)
    ).all()
    category_map = {c.id: c for c in categories}

    category_totals: dict[str, Decimal] = {}
    for tx in transactions:
        if tx.type == TransactionType.EXPENSE:
            cat_name = (
                category_map[tx.category_id].name
                if tx.category_id and tx.category_id in category_map
                else "Sem categoria"
            )
            category_totals[cat_name] = (
                category_totals.get(cat_name, Decimal("0")) + tx.amount
            )

    category_lines = []
    for cat_name, total in sorted(
        category_totals.items(), key=lambda x: x[1], reverse=True
    ):
        pct = (total / total_expense * 100) if total_expense > 0 else Decimal("0")
        category_lines.append(f"  - {cat_name}: R$ {total:,.2f} ({pct:.1f}%)")

    categories_str = (
        "\n".join(category_lines)
        if category_lines
        else "  Nenhuma despesa categorizada"
    )

    # -- Maiores gastos individuais --
    expenses = [tx for tx in transactions if tx.type == TransactionType.EXPENSE]
    expenses.sort(key=lambda tx: tx.amount, reverse=True)
    top_expenses = expenses[:10]
    top_expenses_str = (
        "\n".join(
            f"  - {tx.date.strftime('%d/%m')}: {tx.description} - R$ {tx.amount:,.2f}"
            + (
                f" ({category_map[tx.category_id].name})"
                if tx.category_id and tx.category_id in category_map
                else ""
            )
            for tx in top_expenses
        )
        if top_expenses
        else "  Nenhuma despesa registrada"
    )

    # -- Ritmo de gastos (gastos por dia) --
    daily_spending: dict[int, Decimal] = {}
    for tx in expenses:
        day = tx.date.day
        daily_spending[day] = daily_spending.get(day, Decimal("0")) + tx.amount

    daily_lines = []
    for day, total in sorted(daily_spending.items(), key=lambda x: x[1], reverse=True)[
        :10
    ]:
        daily_lines.append(f"  - Dia {day}: R$ {total:,.2f}")
    daily_str = (
        "\n".join(daily_lines) if daily_lines else "  Nenhuma despesa registrada"
    )

    # -- Metas --
    goals = session.exec(select(Goal).where(Goal.user_id == current_user.id)).all()

    goal_lines = []
    for goal in goals:
        pct = (
            (goal.current_amount / goal.target_amount * 100)
            if goal.target_amount > 0
            else Decimal("0")
        )
        remaining = goal.target_amount - goal.current_amount
        line = (
            f"  - {goal.name}: R$ {goal.current_amount:,.2f} / R$ {goal.target_amount:,.2f} "
            f"({pct:.1f}%) - Faltam R$ {remaining:,.2f}"
        )
        if goal.deadline:
            today = date.today()
            days_left = (goal.deadline - today).days
            if days_left >= 0:
                line += f" - Prazo: {goal.deadline.strftime('%d/%m/%Y')} ({days_left} dias restantes)"
            else:
                line += f" - Prazo: {goal.deadline.strftime('%d/%m/%Y')} (VENCIDO há {abs(days_left)} dias)"
        goal_lines.append(line)

    goals_str = "\n".join(goal_lines) if goal_lines else "  Nenhuma meta cadastrada"

    # -- Transações recorrentes (assinaturas/parcelamentos) --
    recurring_transactions = [
        tx for tx in transactions if tx.recurrence_parent_id is not None
    ]
    recurring_str = (
        "\n".join(
            f"  - {tx.description}: R$ {tx.amount:,.2f}"
            + (
                f" ({category_map[tx.category_id].name})"
                if tx.category_id and tx.category_id in category_map
                else ""
            )
            for tx in recurring_transactions
        )
        if recurring_transactions
        else "  Nenhuma transação recorrente identificada"
    )

    prompt = f"""Analise os seguintes dados financeiros do mês de {month_name} de {year}:

## Dados do Mês

### Contas Bancárias
{accounts_str}

### Resumo Financeiro
- Total de Receitas: R$ {total_income:,.2f}
- Total de Despesas: R$ {total_expense:,.2f}
- Saldo do Mês: R$ {balance_month:,.2f}
- Número total de transações: {len(transactions)}

### Gastos por Categoria
{categories_str}

### Top 10 Maiores Gastos
{top_expenses_str}

### Dias com Maiores Gastos
{daily_str}

### Transações Recorrentes (Assinaturas/Parcelamentos)
{recurring_str}

### Metas Financeiras
{goals_str}

---

Por favor, forneça uma análise completa seguindo a estrutura definida.
Lembre-se: formate valores em reais (R$), use emojis com moderação,
e seja encorajador e construtivo."""

    return prompt


async def run_dashboard_analysis(
    session: Session,
    current_user: User,
    month: Optional[int] = None,
    year: Optional[int] = None,
) -> tuple[str, int, int]:
    """
    Executa a análise de dashboard usando IA.
    Retorna (texto_da_analise, mes, ano).
    """
    now = datetime.now(timezone.utc)

    if month is None:
        month = now.month
    if year is None:
        year = now.year

    month_names = [
        "",
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
    ]
    month_name = month_names[month]

    api_key = _resolve_api_key(current_user)

    prompt = _build_dashboard_prompt(session, current_user, month, year, month_name)

    provider = GoogleProvider(api_key=api_key)
    model = GoogleModel(GEMINI_MODEL, provider=provider)
    settings = GoogleModelSettings(
        google_thinking_config={"thinking_level": "low"}  # type: ignore[arg-type]
    )

    agent: Agent[None, str] = Agent(
        model,
        instructions=DASHBOARD_SYSTEM_PROMPT,
        model_settings=settings,
    )

    result = await agent.run(prompt)

    return result.output, month, year
