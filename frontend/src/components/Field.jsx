import React from "react";
export function Field({ label, error, children }) {
  return (
    <label className="field">
      {label}
      {children}
      {error ? <span className="error">{error}</span> : null}
    </label>
  );
}

