from __future__ import annotations

import json
from json import JSONDecodeError
from pathlib import Path
from typing import Any

DATA_DIR = Path(__file__).resolve().parents[1] / "data"
BOOKINGS_FILE = DATA_DIR / "bookings.json"


def read_bookings() -> list[dict[str, Any]]:
    if not BOOKINGS_FILE.exists():
        return []

    raw = BOOKINGS_FILE.read_text(encoding="utf-8").strip()
    if not raw:
        return []

    try:
        data = json.loads(raw)
    except JSONDecodeError:
        return []

    return data if isinstance(data, list) else []


def write_bookings(bookings: list[dict[str, Any]]) -> None:
    DATA_DIR.mkdir(exist_ok=True)
    temp_file = BOOKINGS_FILE.with_suffix(".tmp")
    temp_file.write_text(json.dumps(bookings, indent=2), encoding="utf-8")
    temp_file.replace(BOOKINGS_FILE)
