from typing import Optional

from pydantic import BaseModel, Field


class DashboardRequest(BaseModel):
    month: Optional[int] = Field(default=None, ge=1, le=12)
    year: Optional[int] = Field(default=None, ge=2000)


class DashboardResponse(BaseModel):
    analysis: str
    month: int
    year: int
