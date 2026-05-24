from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any

from fastapi import APIRouter

from models import BookingRequest
from services.booking_store import read_bookings, write_bookings
from services.room_service import get_room

router = APIRouter(prefix="/bookings", tags=["bookings"])


@router.post("")
def create_booking(payload: BookingRequest) -> dict[str, Any]:
    room = get_room(payload.room_id)
    bookings = read_bookings()
    reference = f"HB-{datetime.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
    booking = {
        "reference": reference,
        "room": room,
        "guest": f"{payload.first_name} {payload.last_name}",
        "email": payload.email,
        "phone": payload.phone,
        "check_in": payload.check_in.isoformat(),
        "check_out": payload.check_out.isoformat(),
        "guests": payload.guests,
        "special_requests": payload.special_requests,
        "created_at": datetime.now().isoformat(timespec="seconds"),
    }
    bookings.append(booking)
    write_bookings(bookings)
    return booking


@router.get("")
def list_bookings() -> list[dict[str, Any]]:
    return list(reversed(read_bookings()))
