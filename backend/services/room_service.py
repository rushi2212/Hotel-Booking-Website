from __future__ import annotations

from fastapi import HTTPException

from rooms_data import ROOMS


def list_rooms(city: str = "") -> list[dict]:
    normalized_city = city.strip().lower()
    if not normalized_city:
        return ROOMS
    return [room for room in ROOMS if normalized_city in room["city"].lower()]


def get_room(room_id: str) -> dict:
    for room in ROOMS:
        if room["id"] == room_id:
            return room
    raise HTTPException(status_code=404, detail="Room not found")
