import { today } from "./constants";

export function validateBooking(form, requireAll = false) {
  const errors = {};
  if (requireAll && form.first_name.trim().length === 0) errors.first_name = "First name is required";
  if (form.first_name.length > 0 && form.first_name.trim().length < 2) errors.first_name = "First name must be at least 2 characters";
  if (requireAll && form.last_name.trim().length === 0) errors.last_name = "Last name is required";
  if (form.last_name.length > 0 && form.last_name.trim().length < 2) errors.last_name = "Last name must be at least 2 characters";
  if (requireAll && form.email.trim().length === 0) errors.email = "Email is required";
  if (form.email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Enter a valid email address";
  if (requireAll && form.phone.trim().length === 0) errors.phone = "Phone is required";
  if (form.phone.length > 0 && !/^\d{10}$/.test(form.phone)) errors.phone = "Phone must be exactly 10 digits";
  if (requireAll && !form.check_in) errors.check_in = "Check-in date is required";
  if (form.check_in && form.check_in < today) errors.check_in = "Check-in date must be today or future";
  if (requireAll && !form.check_out) errors.check_out = "Check-out date is required";
  if (form.check_out && form.check_in && form.check_out <= form.check_in) errors.check_out = "Check-out date must be after check-in";
  if (requireAll && form.guests === "") errors.guests = "Number of guests is required";
  if (form.guests !== "" && (Number(form.guests) < 1 || Number(form.guests) > 10)) errors.guests = "Guests must be between 1 and 10";
  if (form.special_requests.length > 500) errors.special_requests = "Special requests must be 500 characters or fewer";
  if (requireAll && form.card_number.trim().length === 0) errors.card_number = "Card number is required";
  if (form.card_number.length > 0 && !/^\d{16}$/.test(form.card_number)) errors.card_number = "Card number must be exactly 16 digits";
  if (requireAll && form.expiry_date.trim().length === 0) errors.expiry_date = "Expiry date is required";
  if (form.expiry_date.length > 0 && !/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiry_date)) errors.expiry_date = "Expiry date must use MM/YY format";
  if (form.expiry_date.length === 5 && /^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiry_date)) {
    const [month, year] = form.expiry_date.split("/");
    const expiry = new Date(2000 + Number(year), Number(month) - 1, 1);
    const current = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    if (expiry < current) errors.expiry_date = "Expiry date must not be expired";
  }
  if (requireAll && form.cvv.trim().length === 0) errors.cvv = "CVV is required";
  if (form.cvv.length > 0 && !/^\d{3}$/.test(form.cvv)) errors.cvv = "CVV must be exactly 3 digits";
  return errors;
}
