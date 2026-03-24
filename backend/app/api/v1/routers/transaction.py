from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.ai.providers.ollama import get_embedding
from app.api.v1.schemas.transaction import TransactionCreate
from app.db.database import get_session
from app.models.transaction import Transaction


router = APIRouter(
    prefix="/transaction",
    tags=["transaction"],
    responses={404: {"description": "Not found"}},
)


@router.get("/search")
async def search_transactions(
    query: str,
    limit=5,
    session: Session = Depends(get_session),
):
    query_vector = await get_embedding(query, is_search=True)

    statement = (
        select(Transaction)
        .order_by(Transaction.description_vector.op("<=>")(query_vector))  # type: ignore
        .limit(limit)
    )

    results = session.exec(statement).all()

    return results


@router.post("/", response_model=Transaction)
async def create_transaction(
    data: TransactionCreate,
    session: Session = Depends(
        get_session,
    ),
):
    vector = await get_embedding(data.description, is_search=False)

    new_transaction = Transaction(
        description=data.description,
        amount=data.amount,
        type=data.type,
        category_id=data.category_id,
        account_id=data.account_id,
        metadata_info=data.metadata_info,
        description_vector=vector,
    )

    try:
        session.add(new_transaction)
        session.commit()
        session.refresh(new_transaction)
        return new_transaction
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error to save transaction: {str(e)}",
        )
