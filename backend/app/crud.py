import uuid

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models import Task, TaskStatus
from app.schemas import TaskCreate, TaskMove, TaskUpdate


def get_tasks(db: Session) -> list[Task]:
    stmt = select(Task).order_by(Task.status, Task.position)
    return list(db.execute(stmt).scalars().all())


def get_task(db: Session, task_id: uuid.UUID) -> Task | None:
    return db.get(Task, task_id)


def _next_position(db: Session, status: TaskStatus) -> float:
    max_position = db.execute(
        select(func.max(Task.position)).where(Task.status == status)
    ).scalar()
    return (max_position or 0) + 1


def create_task(db: Session, task_in: TaskCreate) -> Task:
    task = Task(
        title=task_in.title,
        description=task_in.description,
        status=task_in.status,
        position=_next_position(db, task_in.status),
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def update_task(db: Session, task: Task, task_in: TaskUpdate) -> Task:
    data = task_in.model_dump(exclude_unset=True)
    for field, value in data.items():
        setattr(task, field, value)
    db.commit()
    db.refresh(task)
    return task


def move_task(db: Session, task: Task, move_in: TaskMove) -> Task:
    task.status = move_in.status
    task.position = move_in.position
    db.commit()
    db.refresh(task)
    return task


def delete_task(db: Session, task: Task) -> None:
    db.delete(task)
    db.commit()
