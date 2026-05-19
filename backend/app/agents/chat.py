from __future__ import annotations

from typing import Optional
from uuid import UUID

from fastapi import HTTPException
from pydantic_ai import Agent, RunContext
from pydantic_ai.models.google import GoogleModel, GoogleModelSettings
from pydantic_ai.providers.google import GoogleProvider

from app.agents.bank_account import (
    create_bank_account_service,
    delete_bank_account_service,
    get_bank_account_service,
    list_bank_accounts_service,
    update_bank_account_service,
)
from app.agents.category import (
    create_category_service,
    delete_category_service,
    get_category_service,
    list_categories_service,
    update_category_service,
)
from app.agents.deps import AgentDeps
from app.agents.transaction import (
    create_transaction_service,
    delete_transaction_service,
    search_transactions_service,
    update_transaction_service,
)
from app.agents.user import update_user_service
from app.api.v1.schemas.bank_account import (
    BankAccountCreate,
    BankAccountRead,
    BankAccountUpdate,
)
from app.api.v1.schemas.category import CategoryCreate, CategoryRead, CategoryUpdate
from app.api.v1.schemas.document import DocumentChunkResult, DocumentRead
from app.api.v1.schemas.transaction import (
    TransactionCreate,
    TransactionRead,
    TransactionUpdate,
)
from app.api.v1.schemas.user import UserPublic, UserUpdate
from app.services.document_service import list_documents_service, search_document_chunks

SYSTEM_INSTRUCTION = (
    "Você é um assistente financeiro para um aplicativo de finanças pessoais. "
    "Seja claro, objetivo e útil. "
    "Use as tools quando precisar buscar ou alterar dados do usuário. "
    "Quando a pergunta envolver documentos enviados pelo usuário (contas, PDFs, imagens), "
    "use a ferramenta search_documents e responda com base no conteúdo retornado."
)

GEMINI_MODEL = "gemini-3-flash-preview"


def build_chat_agent(api_key: str) -> Agent[AgentDeps, str]:
    provider = GoogleProvider(api_key=api_key)
    model = GoogleModel(GEMINI_MODEL, provider=provider)
    settings = GoogleModelSettings(
        google_thinking_config={"thinking_level": "low"}  # type: ignore[arg-type]
    )
    agent: Agent[AgentDeps, str] = Agent(
        model,
        deps_type=AgentDeps,
        instructions=SYSTEM_INSTRUCTION,
        model_settings=settings,
    )

    @agent.tool
    def get_current_user(ctx: RunContext[AgentDeps]) -> UserPublic:
        """Retorna o perfil do usuário atual."""
        current_user = ctx.deps.current_user
        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        return UserPublic.model_validate(current_user)

    @agent.tool
    def update_current_user(ctx: RunContext[AgentDeps], data: UserUpdate) -> UserPublic:
        """Atualiza o perfil do usuário atual."""
        current_user = ctx.deps.current_user
        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        updated = update_user_service(ctx.deps.session, current_user.id, data)
        return UserPublic.model_validate(updated)

    @agent.tool
    def list_bank_accounts(
        ctx: RunContext[AgentDeps], limit: int = 5, offset: int = 0
    ) -> list[BankAccountRead]:
        """Lista contas bancárias do usuário."""
        current_user = ctx.deps.current_user
        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        accounts = list_bank_accounts_service(
            ctx.deps.session, current_user, limit=limit, offset=offset
        )
        return [BankAccountRead.model_validate(account) for account in accounts]

    @agent.tool
    def get_bank_account(
        ctx: RunContext[AgentDeps], bank_account_id: UUID
    ) -> BankAccountRead:
        """Busca uma conta bancária por ID."""
        current_user = ctx.deps.current_user
        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        account = get_bank_account_service(
            ctx.deps.session, current_user, bank_account_id
        )
        return BankAccountRead.model_validate(account)

    @agent.tool
    def create_bank_account(
        ctx: RunContext[AgentDeps], data: BankAccountCreate
    ) -> BankAccountRead:
        """Cria uma conta bancária."""
        current_user = ctx.deps.current_user
        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        account = create_bank_account_service(ctx.deps.session, current_user, data)
        return BankAccountRead.model_validate(account)

    @agent.tool
    def update_bank_account(
        ctx: RunContext[AgentDeps],
        bank_account_id: UUID,
        data: BankAccountUpdate,
    ) -> BankAccountRead:
        """Atualiza uma conta bancária."""
        current_user = ctx.deps.current_user
        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        account = update_bank_account_service(
            ctx.deps.session, current_user, bank_account_id, data
        )
        return BankAccountRead.model_validate(account)

    @agent.tool
    def delete_bank_account(
        ctx: RunContext[AgentDeps], bank_account_id: UUID
    ) -> dict[str, str]:
        """Remove uma conta bancária."""
        current_user = ctx.deps.current_user
        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        return delete_bank_account_service(
            ctx.deps.session, current_user, bank_account_id
        )

    @agent.tool
    def list_categories(
        ctx: RunContext[AgentDeps], limit: int = 5, offset: int = 0
    ) -> list[CategoryRead]:
        """Lista categorias do usuário."""
        current_user = ctx.deps.current_user
        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        categories = list_categories_service(
            ctx.deps.session, current_user, limit=limit, offset=offset
        )
        return [CategoryRead.model_validate(category) for category in categories]

    @agent.tool
    def get_category(ctx: RunContext[AgentDeps], category_id: UUID) -> CategoryRead:
        """Busca uma categoria por ID."""
        current_user = ctx.deps.current_user
        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        category = get_category_service(ctx.deps.session, current_user, category_id)
        return CategoryRead.model_validate(category)

    @agent.tool
    def create_category(
        ctx: RunContext[AgentDeps], data: CategoryCreate
    ) -> CategoryRead:
        """Cria uma categoria."""
        current_user = ctx.deps.current_user
        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        category = create_category_service(ctx.deps.session, current_user, data)
        return CategoryRead.model_validate(category)

    @agent.tool
    def update_category(
        ctx: RunContext[AgentDeps], category_id: UUID, data: CategoryUpdate
    ) -> CategoryRead:
        """Atualiza uma categoria."""
        current_user = ctx.deps.current_user
        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        category = update_category_service(
            ctx.deps.session, current_user, category_id, data
        )
        return CategoryRead.model_validate(category)

    @agent.tool
    def delete_category(
        ctx: RunContext[AgentDeps], category_id: UUID
    ) -> dict[str, str]:
        """Remove uma categoria."""
        current_user = ctx.deps.current_user
        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        return delete_category_service(ctx.deps.session, current_user, category_id)

    @agent.tool
    def list_documents(
        ctx: RunContext[AgentDeps], limit: int = 5, offset: int = 0
    ) -> list[DocumentRead]:
        """Lista documentos enviados pelo usuário."""
        current_user = ctx.deps.current_user
        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        documents = list_documents_service(
            ctx.deps.session, current_user, limit=limit, offset=offset
        )
        return [DocumentRead.model_validate(doc) for doc in documents]

    @agent.tool
    async def search_documents(
        ctx: RunContext[AgentDeps],
        query: str,
        limit: int = 5,
        document_id: Optional[UUID] = None,
    ) -> list[DocumentChunkResult]:
        """Busca trechos relevantes nos documentos do usuário."""
        current_user = ctx.deps.current_user
        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        matches = await search_document_chunks(
            ctx.deps.session,
            current_user,
            query,
            limit=limit,
            document_id=document_id,
        )
        return [
            DocumentChunkResult(
                chunk_id=chunk.id,
                document_id=doc.id,
                document_title=doc.title,
                document_filename=doc.filename,
                chunk_index=chunk.chunk_index,
                content=chunk.content,
            )
            for chunk, doc in matches
        ]

    @agent.tool
    async def search_transactions(
        ctx: RunContext[AgentDeps], query: str, limit: int = 5
    ) -> list[TransactionRead]:
        """Busca transações similares por descrição."""
        current_user = ctx.deps.current_user
        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        transactions = await search_transactions_service(
            ctx.deps.session, current_user, query, limit=limit
        )
        return [TransactionRead.model_validate(tx) for tx in transactions]

    @agent.tool
    async def create_transaction(
        ctx: RunContext[AgentDeps], data: TransactionCreate
    ) -> TransactionRead:
        """Cria uma transação."""
        current_user = ctx.deps.current_user
        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        transaction = await create_transaction_service(
            ctx.deps.session, current_user, data
        )
        return TransactionRead.model_validate(transaction)

    @agent.tool
    async def update_transaction(
        ctx: RunContext[AgentDeps],
        transaction_id: UUID,
        data: TransactionUpdate,
    ) -> TransactionRead:
        """Atualiza uma transação."""
        current_user = ctx.deps.current_user
        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        transaction = await update_transaction_service(
            ctx.deps.session, current_user, transaction_id, data
        )
        return TransactionRead.model_validate(transaction)

    @agent.tool
    async def delete_transaction(
        ctx: RunContext[AgentDeps], transaction_id: UUID
    ) -> dict[str, str]:
        """Remove uma transação."""
        current_user = ctx.deps.current_user
        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        return await delete_transaction_service(
            ctx.deps.session, current_user, transaction_id
        )

    return agent
