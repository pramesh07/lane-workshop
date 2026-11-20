import pytest

from app.csv_export import neutralize_formula


@pytest.mark.parametrize("prefix", ["=", "+", "-", "@", "\t", "\r"])
def test_neutralizes_formula_prefixes(prefix):
    assert neutralize_formula(f"{prefix}SUM(A1)") == f"'{prefix}SUM(A1)"


def test_plain_value_is_unchanged():
    assert neutralize_formula("Write docs") == "Write docs"
