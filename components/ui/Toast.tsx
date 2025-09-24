import React from "react";
export const Toast: React.FC<{ message: string; tone?: "success" | "error" }> = ({ message, tone = "success" }) => (
  <div aria-live="polite" className={`fixed right-6 bottom-6 z-50 p-3 rounded shadow-lg ${tone === "success" ? "bg-green-600" : "bg-red-600"} text-white`}>
    {message}
  </div>
);