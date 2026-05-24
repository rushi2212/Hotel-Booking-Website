export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const today = new Date().toISOString().slice(0, 10);
export const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
