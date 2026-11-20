import pytest

from app.csv_export import neutralize_formula


@pytest.mark.parametrize("prefix", ["=", "+", "-", "@", "\t", "\r"])
def test_neutralizes_formula_prefixes(prefix):
    assert neutralize_formula(f"{prefix}SUM(A1)") == f"'{prefix}SUM(A1)"


def test_plain_value_is_unchanged():
    assert neutralize_formula("Write docs") == "Write docs"


import csv
import io
import uuid
from datetime import datetime, timezone

from app.csv_export import HEADER, tasks_to_csv
from app.models import Task, TaskStatus


def _task(**kw):
    now = datetime(2026, 11, 20, 8, 0, tzinfo=timezone.utc)
    defaults = dict(
        id=uuid.UUID("00000000-0000-0000-0000-000000000001"),
        title="t",
        description=None,
        status=TaskStatus.IN_REVIEW,
        position=2.5,
        created_at=now,
        updated_at=now,
    )
    defaults.update(kw)
    return Task(**defaults)


def _rows(tasks):
    return list(csv.reader(io.StringIO(tasks_to_csv(tasks), newline="")))


def test_null_description_is_an_empty_cell():
    rows = _rows([_task(description=None)])
    assert rows[0] == HEADER
    assert rows[1][2] == ""


def test_row_values_are_raw_and_other_fields_never_neutralized():
    rows = _rows([_task(title="=1+1", description="+x")])
    assert rows[1] == [
        "00000000-0000-0000-0000-000000000001",
        "'=1+1",
        "'+x",
        "in_review",
        "2.5",
        "2026-11-20T08:00:00+00:00",
        "2026-11-20T08:00:00+00:00",
    ]


def test_quotes_commas_line_breaks_and_non_ascii_round_trip():
    title = 'a, "b"\nc — ünï'
    rows = _rows([_task(title=title, description=title)])
    assert len(rows) == 2 and len(rows[1]) == 7
    assert rows[1][1] == title and rows[1][2] == title


def test_leading_apostrophe_is_left_as_is():
    assert _rows([_task(title="'quoted")])[1][1] == "'quoted"
