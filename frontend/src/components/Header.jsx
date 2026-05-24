import React from "react";
import { Hotel } from "lucide-react";
import { navigate } from "../router";

export function Header() {
  return (
    <header className="topbar">
      <button className="brand" onClick={() => navigate("/")} aria-label="Home">
        <Hotel size={24} />
        <span>StaySure</span>
      </button>
      <nav>
        <button onClick={() => navigate("/search")}>Rooms</button>
        <button onClick={() => navigate("/bookings")}>My Bookings</button>
      </nav>
    </header>
  );
}

