from dataclasses import dataclass

from sqlmodel import Session

from app.models.user import User


@dataclass
class AgentDeps:
    session: Session
    current_user: User | None = None
