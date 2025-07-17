"use client";
import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Check saved theme in localStorage
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setEnabled(true);
      document.documentElement.classList.add("dark");
    } else {
      setEnabled(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);

    if (newEnabled) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="px-3 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-sm"
    >
      {enabled ? "Light Mode" : "Dark Mode"}
    </button>
  );
}
