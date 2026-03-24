from pydantic import BaseModel


class CategoryCreate(BaseModel):
    name: str
    icon: str
    color: str
    user_id: int
