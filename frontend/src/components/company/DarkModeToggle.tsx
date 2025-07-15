"use client";
import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", enabled);
  }, [enabled]);

  return (
    <button
      onClick={() => setEnabled(!enabled)}
      className="px-3 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-sm"
    >
      {enabled ? "Light Mode" : "Dark Mode"}
    </button>
  );
}
