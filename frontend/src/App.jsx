import React from "react";
import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { BookingForm } from "./pages/BookingForm";
import { Confirmation } from "./pages/Confirmation";
import { Home } from "./pages/Home";
import { MyBookings } from "./pages/MyBookings";
import { RoomDetails } from "./pages/RoomDetails";
import { SearchResults } from "./pages/SearchResults";

function usePath() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const handler = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);
  return path;
}

export function App() {
  const path = usePath();
  let content = <Home />;
  if (path === "/search") content = <SearchResults />;
  if (path.startsWith("/room/")) content = <RoomDetails roomId={path.split("/").pop()} />;
  if (path.startsWith("/book/")) content = <BookingForm roomId={path.split("/").pop()} />;
  if (path === "/confirmation") content = <Confirmation />;
  if (path === "/bookings") content = <MyBookings />;

  return (
    <>
      <Header />
      {content}
    </>
  );
}

