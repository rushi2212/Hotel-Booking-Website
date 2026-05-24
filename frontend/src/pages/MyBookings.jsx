import React from "react";
import { useEffect, useState } from "react";
import { fetchBookings } from "../api";

export function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings().then(setBookings);
  }, []);

  return (
    <main className="page">
      <div className="page-title">
        <h1>My Bookings</h1>
        <p>{bookings.length ? `${bookings.length} saved bookings` : "No bookings yet"}</p>
      </div>
      <div className="booking-list">
        {bookings.map((booking) => (
          <article className="booking-item" key={booking.reference}>
            <strong>{booking.reference}</strong>
            <span>{booking.room.name}</span>
            <span>{booking.guest}</span>
            <span>{booking.check_in} to {booking.check_out}</span>
          </article>
        ))}
      </div>
    </main>
  );
}

