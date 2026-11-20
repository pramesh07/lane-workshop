import csv
import io
from collections.abc import Iterable

from app.models import Task

HEADER = ["id", "title", "description", "status", "position", "created_at", "updated_at"]


FORMULA_PREFIXES = ("=", "+", "-", "@", "\t", "\r")


def neutralize_formula(value: str) -> str:
    return "'" + value if value.startswith(FORMULA_PREFIXES) else value


def tasks_to_csv(tasks: Iterable[Task]) -> str:
    out = io.StringIO(newline="")
    writer = csv.writer(out, lineterminator="\r\n")
    writer.writerow(HEADER)
    for t in tasks:
        writer.writerow(
            [
                str(t.id),
                neutralize_formula(t.title),
                "" if t.description is None else neutralize_formula(t.description),
                t.status.value,
                t.position,
                t.created_at.isoformat(),
                t.updated_at.isoformat(),
            ]
        )
    return out.getvalue()
