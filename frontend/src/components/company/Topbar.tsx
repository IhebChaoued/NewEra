import { useEffect, useRef, useState } from "react";
import { useCompanyAuthStore } from "../../store/companyAuthStore";
import Image from "next/image";
import { useRouter } from "next/router";

type TopbarProps = {
  onMenuClick?: () => void;
};

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { company, logout } = useCompanyAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Dark mode state
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Derive title from pathname
  const pageTitle =
    router.pathname
      .split("/")
      .filter(Boolean)
      .pop()
      ?.replace(/^\w/, (c) => c.toUpperCase()) || "Dashboard";

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = "/company/login";
  };

  return (
    <header className="flex items-center justify-between p-4 border-b bg-white shadow-sm dark:bg-gray-900 dark:border-gray-700 relative">
      <div className="flex items-center gap-4 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <svg
            className="h-6 w-6 text-gray-800 dark:text-gray-100"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 truncate">
          {pageTitle}
        </h2>
      </div>

      <div
        ref={dropdownRef}
        className="flex items-center gap-4 shrink-0 relative"
      >
        {/* Notifications */}
        <span className="text-lg cursor-pointer text-gray-800 dark:text-gray-100">
          🔔
        </span>
        <span className="text-lg cursor-pointer text-gray-800 dark:text-gray-100">
          ❤️
        </span>

        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-gray-800 dark:text-gray-100 hover:text-green-500 transition"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        <span className="hidden lg:inline font-medium text-gray-800 dark:text-gray-100">
          {company ? company.name : "Guest"}
        </span>

        <div
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-10 h-10 rounded-full overflow-hidden cursor-pointer bg-gray-300 dark:bg-gray-700 flex items-center justify-center"
        >
          {company?.logo ? (
            <Image
              src={company.logo}
              alt="Company logo"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          ) : null}
        </div>

        <div
          className={`absolute right-0 top-14 mt-2 w-48 bg-white dark:bg-gray-800 shadow-md rounded z-50 transition-all duration-300 ease-in-out ${
            isOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        >
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
