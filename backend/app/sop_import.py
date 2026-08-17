from __future__ import annotations

import re
from datetime import date
from pathlib import Path
from typing import Any

from sqlalchemy.orm import Session

from . import models

ROOT_DIR = Path(__file__).resolve().parents[2]
SOP_SOURCE_DIR = ROOT_DIR / "docs" / "Lab_SOPs"


def _parse_date(value: str) -> date | None:
    if not value:
        return None

    value = value.strip().replace("\r", "").replace("\n", " ")
    value = re.sub(r"\s+", " ", value)
    value = re.sub(r"(\d)\s+(?=\d)", r"\1", value)
    value = value.strip(" .|,")

    # Support explicit ISO dates and shorthand month/year formats like 04/'25
    if re.match(r"^\d{4}-\d{2}-\d{2}$", value) or re.match(r"^\d{4}/\d{2}/\d{2}$", value):
        try:
            return date.fromisoformat(value.replace('/', '-'))
        except ValueError:
            return None

    m = re.match(r"^(\d{1,2})/'(\d{2})$", value)
    if m:
        month = int(m.group(1))
        year = 2000 + int(m.group(2))
        try:
            return date(year, month, 1)
        except ValueError:
            return None

    try:
        return date.fromisoformat(value)
    except ValueError:
        return None


def _normalize_row_text(row_text: str) -> str:
    row_text = row_text.replace("\r\n", "\n").replace("\n", " ")
    row_text = re.sub(r"\s*\|\s*", "|", row_text)
    row_text = re.sub(r"\s+", " ", row_text)
    row_text = row_text.strip()
    if row_text.endswith("|"):
        row_text = row_text[:-1].strip()
    return row_text


def _parse_book_metadata(text: str) -> dict[str, Any] | None:
    match = re.search(r"^##\s*Book\s*(\d+):\s*(.*?)\s*\(([^)]+)\)", text, re.MULTILINE)
    if not match:
        return None

    return {
        "book_number": int(match.group(1)),
        "name": match.group(2).strip(),
        "code": match.group(3).strip(),
    }


def _extract_inventory_section(text: str) -> str:
    match = re.search(r"###\s*SOP Inventory Table(.*?)(?:^##\s|\Z)", text, re.S | re.M)
    return match.group(1) if match else ""


def _parse_sop_rows(inventory_text: str) -> list[dict[str, str]]:
    row_pattern = re.compile(r"(?m)^\|\s*(\d+)\s*\|")
    starts = [match.start() for match in row_pattern.finditer(inventory_text)]
    rows: list[dict[str, str]] = []

    for index, start in enumerate(starts):
        end = starts[index + 1] if index + 1 < len(starts) else len(inventory_text)
        row_text = inventory_text[start:end].strip()
        normalized = _normalize_row_text(row_text)
        parts = [part.strip() for part in normalized.split("|") if part.strip()]
        if len(parts) < 6:
            continue

        index_code = parts[1]
        title = parts[2]
        version = parts[3] if len(parts) > 3 else ""
        effective_date = parts[4] if len(parts) > 4 else ""
        next_review_date = parts[5] if len(parts) > 5 else ""
        scope_distribution = " ".join(parts[6:]) if len(parts) > 6 else ""

        rows.append({
            "index_code": index_code,
            "title": title,
            "version": version,
            "effective_date": effective_date,
            "next_review_date": next_review_date,
            "scope_distribution": scope_distribution,
        })

    return rows


def import_sop_docs(db: Session) -> dict[str, int]:
    imported_books = 0
    imported_sops = 0

    if not SOP_SOURCE_DIR.exists() or not SOP_SOURCE_DIR.is_dir():
        return {"books": imported_books, "sops": imported_sops}

    for source_path in sorted(SOP_SOURCE_DIR.glob("Book_*")):
        if not source_path.is_file():
            continue

        text = source_path.read_text(encoding="utf-8")
        metadata = _parse_book_metadata(text)
        if metadata is None:
            continue

        inventory_text = _extract_inventory_section(text)
        if not inventory_text:
            continue

        book = db.query(models.SOPBook).filter_by(code=metadata["code"]).first()
        if book is None:
            book = models.SOPBook(
                code=metadata["code"],
                name=metadata["name"],
                description=f"SOP book imported from {source_path.name}",
                book_number=metadata["book_number"],
            )
            db.add(book)
            db.commit()
            db.refresh(book)
            imported_books += 1

        for row in _parse_sop_rows(inventory_text):
            if not row["index_code"]:
                continue

            existing = db.query(models.SOP).filter_by(index_code=row["index_code"]).first()
            if existing:
                continue

            sop = models.SOP(
                book_id=book.id,
                index_code=row["index_code"],
                title=row["title"],
                version=row["version"] or None,
                effective_date=_parse_date(row["effective_date"]),
                next_review_date=_parse_date(row["next_review_date"]),
                scope_distribution=row["scope_distribution"] or None,
                status="active",
                description=row["scope_distribution"] or None,
            )
            db.add(sop)
            imported_sops += 1

        db.commit()

    return {"books": imported_books, "sops": imported_sops}
