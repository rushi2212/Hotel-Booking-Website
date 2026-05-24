import React from "react";
import { UserRound } from "lucide-react";
import { navigate } from "../router";

export function Confirmation() {
  const booking = JSON.parse(sessionStorage.getItem("lastBooking") || "null");
  return (
    <main className="page narrow">
      <section className="confirmation">
        <UserRound size={42} />
        <h1>Booking Confirmed</h1>
        <p>Your reference number is <strong>{booking?.reference || "HB-DEMO-000001"}</strong>.</p>
        <button className="primary" onClick={() => navigate("/bookings")}>View My Bookings</button>
      </section>
    </main>
  );
}

