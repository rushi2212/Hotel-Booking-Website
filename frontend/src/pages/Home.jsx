import React from "react";
import { Search } from "lucide-react";
import { today, tomorrow } from "../constants";
import { navigate } from "../router";
import { useState } from "react";

export function Home() {
  const [form, setForm] = useState({ city: "Mumbai", checkIn: today, checkOut: tomorrow, guests: "2" });

  function submit(event) {
    event.preventDefault();
    const params = new URLSearchParams(form);
    navigate(`/search?${params.toString()}`);
  }

  return (
    <main className="home">
      <section className="hero">
        <div>
          <p className="eyebrow">Hotel Booking System</p>
          <h1>Find a room, complete a booking, and verify every step.</h1>
          <p className="lead">A compact booking flow built for automated testing, validation checks, and screenshot-based reports.</p>
        </div>
        <form className="search-panel" onSubmit={submit}>
          <label>City<input name="city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></label>
          <label>Check-in<input type="date" name="checkIn" min={today} value={form.checkIn} onChange={(e) => setForm({ ...form, checkIn: e.target.value })} /></label>
          <label>Check-out<input type="date" name="checkOut" min={form.checkIn || today} value={form.checkOut} onChange={(e) => setForm({ ...form, checkOut: e.target.value })} /></label>
          <label>Guests<input type="number" name="guests" min="1" max="10" value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })} /></label>
          <button className="primary" type="submit"><Search size={18} /> Search Rooms</button>
        </form>
      </section>
    </main>
  );
}

