import { ReactNode, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

// Maps page routes to the Topbar title
const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/jobboard": "Jobboard",
  "/crm": "CRM",
  "/simulateur": "Simulateur d’adéquation",
  "/stats": "Statistiques",
};

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const currentTitle = pageTitles[router.pathname] || "CaptureGet";

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [shouldRenderSidebar, setShouldRenderSidebar] = useState(false);
  const [animateSidebar, setAnimateSidebar] = useState(false); // NEW

  useEffect(() => {
    if (isSidebarOpen) {
      setShouldRenderSidebar(true);
      // Wait for next tick to trigger animation
      setTimeout(() => setAnimateSidebar(true), 10);
    } else {
      setAnimateSidebar(false);
      const timeout = setTimeout(() => setShouldRenderSidebar(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isSidebarOpen]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar for large screens */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      {shouldRenderSidebar && (
        <div
          className={`fixed inset-0 z-40 bg-black transition-opacity duration-300 lg:hidden ${
            animateSidebar
              ? "bg-opacity-40 opacity-100"
              : "bg-opacity-0 opacity-0"
          }`}
          onClick={() => setIsSidebarOpen(false)}
        >
          {/* Sidebar panel (left sliding) */}
          <div
            className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ${
              animateSidebar ? "translate-x-0" : "-translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col bg-gray-50 border-l">
        <Topbar
          title={currentTitle}
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
