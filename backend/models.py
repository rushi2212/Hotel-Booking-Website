from __future__ import annotations

from datetime import date
import re
from typing import Any

from pydantic import BaseModel, EmailStr, Field, field_validator


class SearchQuery(BaseModel):
    city: str = ""
    check_in: date | None = None
    check_out: date | None = None
    guests: int = Field(default=1, ge=1, le=10)


class BookingRequest(BaseModel):
    room_id: str
    first_name: str = Field(min_length=2)
    last_name: str = Field(min_length=2)
    email: EmailStr
    phone: str
    check_in: date
    check_out: date
    guests: int = Field(ge=1, le=10)
    special_requests: str = Field(default="", max_length=500)
    card_number: str
    expiry_date: str
    cvv: str

    @field_validator("phone")
    @classmethod
    def phone_must_be_10_digits(cls, value: str) -> str:
        if not re.fullmatch(r"\d{10}", value):
            raise ValueError("Phone must be exactly 10 digits")
        return value

    @field_validator("card_number")
    @classmethod
    def card_must_be_16_digits(cls, value: str) -> str:
        if not re.fullmatch(r"\d{16}", value):
            raise ValueError("Card number must be exactly 16 digits")
        return value

    @field_validator("expiry_date")
    @classmethod
    def expiry_must_be_valid_future_mm_yy(cls, value: str) -> str:
        if not re.fullmatch(r"(0[1-9]|1[0-2])/\d{2}", value):
            raise ValueError("Expiry date must use MM/YY format")
        month, year = value.split("/")
        expiry = date(2000 + int(year), int(month), 1)
        today_month = date.today().replace(day=1)
        if expiry < today_month:
            raise ValueError("Expiry date must not be expired")
        return value

    @field_validator("cvv")
    @classmethod
    def cvv_must_be_3_digits(cls, value: str) -> str:
        if not re.fullmatch(r"\d{3}", value):
            raise ValueError("CVV must be exactly 3 digits")
        return value

    @field_validator("check_in")
    @classmethod
    def check_in_must_be_today_or_future(cls, value: date) -> date:
        if value < date.today():
            raise ValueError("Check-in date must be today or future")
        return value

    @field_validator("check_out")
    @classmethod
    def check_out_must_be_after_check_in(cls, value: date, info: Any) -> date:
        check_in = info.data.get("check_in")
        if check_in and value <= check_in:
            raise ValueError("Check-out date must be after check-in")
        return value
