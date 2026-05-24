from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.bookings import router as bookings_router
from routers.health import router as health_router
from routers.rooms import router as rooms_router

app = FastAPI(title="AI Testing Hotel Booking API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(rooms_router)
app.include_router(bookings_router)
