import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models import TaskStatus


class TaskBase(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str | None = None


class TaskCreate(TaskBase):
    status: TaskStatus = TaskStatus.TODO


class TaskUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = None
    status: TaskStatus | None = None
    position: float | None = None


class TaskMove(BaseModel):
    status: TaskStatus
    position: float


class TaskOut(TaskBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    status: TaskStatus
    position: float
    created_at: datetime
    updated_at: datetime
