import csv
import io
import re

from app.models import Task, TaskStatus

HEADER = "id,title,description,status,position,created_at,updated_at"
ISO = re.compile(r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?[+-]\d{2}:\d{2}$")


def test_export_returns_csv_with_header_and_rows(client, db):
    with_desc = Task(title="Write docs", description="Some text", status=TaskStatus.IN_PROGRESS, position=2.5)
    no_desc = Task(title="Ship it", description=None, status=TaskStatus.DONE, position=1)
    db.add_all([with_desc, no_desc])
    db.commit()

    resp = client.get("/api/tasks/export")

    assert resp.status_code == 200
    assert resp.headers["content-type"] == "text/csv; charset=utf-8"
    assert resp.headers["content-disposition"] == 'attachment; filename="tasks.csv"'
    body = resp.text
    assert body.split("\r\n")[0] == HEADER
    assert body.endswith("\r\n")
    assert body.count("\n") == body.count("\r\n") == 3
    rows = list(csv.reader(io.StringIO(body, newline="")))
    by_title = {r[1]: r for r in rows[1:]}
    r = by_title["Write docs"]
    assert r[0] == str(with_desc.id)
    assert r[2] == "Some text"
    assert r[3] == "in_progress"
    assert r[4] == "2.5"
    assert ISO.match(r[5]) and ISO.match(r[6])
    n = by_title["Ship it"]
    assert n[2] == ""
    assert n[3] == "done"
    assert n[4] == "1.0"
