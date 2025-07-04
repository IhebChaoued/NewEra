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
    <header className="flex items-center justify-between p-4 border-b bg-white shadow-sm relative">
      <div className="flex items-center gap-4 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded hover:bg-gray-100"
        >
          <svg
            className="h-6 w-6 text-gray-800"
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
        <h2 className="text-xl font-bold text-gray-800 truncate">
          {pageTitle}
        </h2>
      </div>

      <div
        ref={dropdownRef}
        className="flex items-center gap-4 shrink-0 relative"
      >
        <span className="text-lg cursor-pointer">🔔</span>
        <span className="text-lg cursor-pointer">❤️</span>

        <span className="hidden lg:inline font-medium">
          {company ? company.name : "Guest"}
        </span>

        <div
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-10 h-10 rounded-full overflow-hidden cursor-pointer bg-gray-300 flex items-center justify-center"
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
          className={`absolute right-0 top-14 mt-2 w-48 bg-white shadow-md rounded z-50 transition-all duration-300 ease-in-out ${
            isOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        >
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
