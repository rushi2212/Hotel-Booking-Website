from __future__ import annotations

from fastapi import APIRouter

from services.room_service import get_room, list_rooms

router = APIRouter(prefix="/rooms", tags=["rooms"])


@router.get("")
def rooms(city: str = "") -> list[dict]:
    return list_rooms(city)


@router.get("/{room_id}")
def room_details(room_id: str) -> dict:
    return get_room(room_id)
