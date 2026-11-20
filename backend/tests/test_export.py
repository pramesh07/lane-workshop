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


def test_export_neutralizes_formula_prefixes(client, db):
    db.add(Task(title="=1+1", description="@cmd", status=TaskStatus.TODO, position=1))
    db.commit()

    resp = client.get("/api/tasks/export")

    rows = list(csv.reader(io.StringIO(resp.text, newline="")))
    assert rows[1][1] == "'=1+1"
    assert rows[1][2] == "'@cmd"
    assert rows[1][3] == "todo"


def _parse(text):
    return list(csv.reader(io.StringIO(text, newline="")))


def _seed_all_columns(db):
    specs = [
        ("d2", TaskStatus.DONE, 2),
        ("t2", TaskStatus.TODO, 2),
        ("r1", TaskStatus.IN_REVIEW, 1),
        ("p1", TaskStatus.IN_PROGRESS, 1),
        ("d1", TaskStatus.DONE, 1),
        ("t1", TaskStatus.TODO, 1),
    ]
    for title, status, pos in specs:
        db.add(Task(title=title, status=status, position=pos))
    db.commit()


def test_export_rows_in_board_order(client, db):
    _seed_all_columns(db)
    rows = _parse(client.get("/api/tasks/export").text)
    assert [r[1] for r in rows[1:]] == ["t1", "t2", "p1", "r1", "d1", "d2"]


def test_export_quotes_special_characters(client, db):
    db.add(Task(title='a,b "q"\nline', description='x,"y"\r\nz', status=TaskStatus.TODO, position=1))
    db.add(Task(title="Café 日本", status=TaskStatus.TODO, position=2))
    db.commit()
    rows = _parse(client.get("/api/tasks/export").text)
    assert len(rows) == 3
    assert all(len(r) == 7 for r in rows)
    assert rows[1][1] == 'a,b "q"\nline'
    assert rows[1][2] == 'x,"y"\r\nz'
    assert rows[2][1] == "Café 日本"


def test_export_empty_board_is_header_only(client, db):
    resp = client.get("/api/tasks/export")
    assert resp.status_code == 200
    assert resp.text == HEADER + "\r\n"


def test_export_database_failure_returns_5xx_without_csv(client, db):
    from app.database import get_db
    from app.main import app

    class Broken:
        def execute(self, *a, **k):
            raise RuntimeError("db down")

        def close(self):
            pass

    app.dependency_overrides[get_db] = lambda: Broken()
    try:
        resp = client.get("/api/tasks/export")
    finally:
        app.dependency_overrides.pop(get_db, None)
    assert 500 <= resp.status_code < 600
    assert HEADER not in resp.text


def test_export_round_trip_through_the_app(client, db):
    created = []
    for title, status in [
        ("done one", "done"),
        ("tricky, \"quoted\"\nbreak", "todo"),
        ("review", "in_review"),
        ("prog", "in_progress"),
    ]:
        r = client.post("/api/tasks", json={"title": title, "description": "d", "status": status})
        assert r.status_code == 201
        created.append(r.json())
    order = {"todo": 0, "in_progress": 1, "in_review": 2, "done": 3}
    expected = sorted(created, key=lambda t: (order[t["status"]], t["position"]))
    rows = _parse(client.get("/api/tasks/export").text)
    assert [r[0] for r in rows[1:]] == [t["id"] for t in expected]
    assert [r[1] for r in rows[1:]] == [t["title"] for t in expected]


def test_export_leaves_tasks_untouched_and_by_id_route_works(client, db):
    t = Task(title="keep", description="d", status=TaskStatus.TODO, position=1)
    db.add(t)
    db.commit()
    tid = str(t.id)
    before = client.get(f"/api/tasks/{tid}").json()
    client.get("/api/tasks/export")
    client.get("/api/tasks/export")
    after = client.get(f"/api/tasks/{tid}").json()
    assert after["id"] == tid
    assert after == before
