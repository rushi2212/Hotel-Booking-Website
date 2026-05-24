import { API_URL } from "./constants";

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return { detail: response.statusText || "Request failed" };
  }
}

export async function fetchRooms(city = "") {
  const response = await fetch(`${API_URL}/rooms?city=${encodeURIComponent(city)}`);
  return response.json();
}

export async function fetchRoom(roomId) {
  const response = await fetch(`${API_URL}/rooms/${roomId}`);
  return response.json();
}

export async function createBooking(payload) {
  try {
    const response = await fetch(`${API_URL}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return { ok: response.ok, data: await readJson(response) };
  } catch (error) {
    return {
      ok: false,
      data: { detail: error?.message || "Could not connect to booking API" },
    };
  }
}

export async function fetchBookings() {
  const response = await fetch(`${API_URL}/bookings`);
  return response.json();
}
