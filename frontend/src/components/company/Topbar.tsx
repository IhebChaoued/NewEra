type TopbarProps = {
  title: string;
  onMenuClick?: () => void;
};

export default function Topbar({ title, onMenuClick }: TopbarProps) {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
      {/* Left: Hamburger + Title */}
      <div className="flex items-center gap-4 min-w-0">
        {/* Hamburger menu for mobile only */}
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

        {/* Title (truncates if too long) */}
        <h2 className="text-xl font-bold text-gray-800 truncate">{title}</h2>
      </div>

      {/* Right: Icons + Name + Avatar */}
      <div className="flex items-center gap-4 shrink-0">
        <span className="text-lg cursor-pointer">🔔</span>
        <span className="text-lg cursor-pointer">❤️</span>

        {/* Moved name BEFORE avatar */}
        <span className="hidden lg:inline font-medium">Nom Prenom</span>
        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
      </div>
    </header>
  );
}
