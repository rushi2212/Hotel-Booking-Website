import React from "react";
import { useEffect, useState } from "react";
import { fetchRooms } from "../api";
import { navigate } from "../router";

export function SearchResults() {
  const query = new URLSearchParams(window.location.search);
  const [rooms, setRooms] = useState([]);
  const city = query.get("city") || "";

  useEffect(() => {
    fetchRooms(city).then(setRooms);
  }, [city]);

  return (
    <main className="page">
      <div className="page-title">
        <h1>Available Rooms</h1>
        <p>{rooms.length ? `${rooms.length} rooms match your search` : "No rooms found for this city"}</p>
      </div>
      <div className="room-grid">
        {rooms.map((room) => (
          <article className="room-card" key={room.id} data-testid={`room-${room.id}`}>
            <img src={room.image} alt={room.name} />
            <div>
              <h2>{room.name}</h2>
              <p>{room.city} - {room.rating} rating</p>
              <strong>Rs. {room.price.toLocaleString("en-IN")} / night</strong>
              <button className="secondary" onClick={() => navigate(`/room/${room.id}`)}>View Details</button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

