from __future__ import annotations

import os

import uvicorn


def get_port() -> int:
    return int(os.getenv("PORT", "8000"))


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=get_port())
