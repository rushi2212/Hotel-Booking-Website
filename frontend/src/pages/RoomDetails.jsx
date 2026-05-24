import React from "react";
import { CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchRoom } from "../api";
import { navigate } from "../router";

export function RoomDetails({ roomId }) {
  const [room, setRoom] = useState(null);

  useEffect(() => {
    fetchRoom(roomId).then(setRoom);
  }, [roomId]);

  if (!room) return <main className="page">Loading room...</main>;

  return (
    <main className="details">
      <img src={room.image} alt={room.name} />
      <section>
        <p className="eyebrow">{room.city}</p>
        <h1>{room.name}</h1>
        <p>{room.description}</p>
        <strong>Rs. {room.price.toLocaleString("en-IN")} / night</strong>
        <div className="amenities">
          {room.amenities.map((item) => <span key={item}>{item}</span>)}
        </div>
        <button className="primary" onClick={() => navigate(`/book/${room.id}`)}>
          <CalendarDays size={18} /> Book Now
        </button>
      </section>
    </main>
  );
}

