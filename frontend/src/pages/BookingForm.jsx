import React from "react";
import { WalletCards } from "lucide-react";
import { useMemo, useState } from "react";
import { createBooking } from "../api";
import { today, tomorrow } from "../constants";
import { Field } from "../components/Field";
import { navigate } from "../router";
import { validateBooking } from "../validation";

export function BookingForm({ roomId }) {
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    check_in: today,
    check_out: tomorrow,
    guests: "1",
    special_requests: "",
    card_number: "",
    expiry_date: "12/30",
    cvv: "",
  });

  const validation = useMemo(() => validateBooking(form), [form]);

  function update(field, value) {
    setForm({ ...form, [field]: value });
  }

  async function submit(event) {
    event.preventDefault();
    setServerError("");
    const nextErrors = validateBooking(form, true);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const { ok, data } = await createBooking({ ...form, room_id: roomId, guests: Number(form.guests) });
    if (!ok) {
      setServerError(data.detail?.[0]?.msg || data.detail || "Booking failed");
      return;
    }
    sessionStorage.setItem("lastBooking", JSON.stringify(data));
    navigate("/confirmation");
  }

  return (
    <main className="page narrow">
      <div className="page-title">
        <h1>Booking Form</h1>
        <p>Enter guest details and payment information.</p>
      </div>
      <form className="booking-form" onSubmit={submit} noValidate>
        <Field label="First Name" error={errors.first_name || validation.first_name}><input value={form.first_name} onChange={(e) => update("first_name", e.target.value)} /></Field>
        <Field label="Last Name" error={errors.last_name || validation.last_name}><input value={form.last_name} onChange={(e) => update("last_name", e.target.value)} /></Field>
        <Field label="Email" error={errors.email || validation.email}><input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} /></Field>
        <Field label="Phone" error={errors.phone || validation.phone}><input value={form.phone} onChange={(e) => update("phone", e.target.value)} /></Field>
        <Field label="Check-in Date" error={errors.check_in || validation.check_in}><input type="date" min={today} value={form.check_in} onChange={(e) => update("check_in", e.target.value)} /></Field>
        <Field label="Check-out Date" error={errors.check_out || validation.check_out}><input type="date" value={form.check_out} onChange={(e) => update("check_out", e.target.value)} /></Field>
        <Field label="Number of Guests" error={errors.guests || validation.guests}><input type="number" value={form.guests} onChange={(e) => update("guests", e.target.value)} /></Field>
        <Field label="Special Requests" error={errors.special_requests || validation.special_requests}><textarea value={form.special_requests} onChange={(e) => update("special_requests", e.target.value)} /></Field>
        <Field label="Card Number" error={errors.card_number || validation.card_number}><input value={form.card_number} onChange={(e) => update("card_number", e.target.value)} /></Field>
        <Field label="Expiry Date" error={errors.expiry_date || validation.expiry_date}><input placeholder="MM/YY" value={form.expiry_date} onChange={(e) => update("expiry_date", e.target.value)} /></Field>
        <Field label="CVV" error={errors.cvv || validation.cvv}><input value={form.cvv} onChange={(e) => update("cvv", e.target.value)} /></Field>
        {serverError && <p className="error banner">{serverError}</p>}
        <button className="primary full" type="submit"><WalletCards size={18} /> Confirm Booking</button>
      </form>
    </main>
  );
}

