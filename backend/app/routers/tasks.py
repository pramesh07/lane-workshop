import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud
from app.database import get_db
from app.schemas import TaskCreate, TaskMove, TaskOut, TaskUpdate

router = APIRouter(prefix="/api/tasks", tags=["tasks"])


def _get_task_or_404(db: Session, task_id: uuid.UUID):
    task = crud.get_task(db, task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.get("", response_model=list[TaskOut])
def list_tasks(db: Session = Depends(get_db)):
    return crud.get_tasks(db)


@router.post("", response_model=TaskOut, status_code=201)
def create_task(task_in: TaskCreate, db: Session = Depends(get_db)):
    return crud.create_task(db, task_in)


@router.get("/{task_id}", response_model=TaskOut)
def get_task(task_id: uuid.UUID, db: Session = Depends(get_db)):
    return _get_task_or_404(db, task_id)


@router.put("/{task_id}", response_model=TaskOut)
def update_task(task_id: uuid.UUID, task_in: TaskUpdate, db: Session = Depends(get_db)):
    task = _get_task_or_404(db, task_id)
    return crud.update_task(db, task, task_in)


@router.patch("/{task_id}/move", response_model=TaskOut)
def move_task(task_id: uuid.UUID, move_in: TaskMove, db: Session = Depends(get_db)):
    task = _get_task_or_404(db, task_id)
    return crud.move_task(db, task, move_in)


@router.delete("/{task_id}", status_code=204)
def delete_task(task_id: uuid.UUID, db: Session = Depends(get_db)):
    task = _get_task_or_404(db, task_id)
    crud.delete_task(db, task)
