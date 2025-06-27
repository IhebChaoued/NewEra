import Link from "next/link";
import { useRouter } from "next/router";
import {
  Home,
  Briefcase,
  Users,
  Gauge,
  BarChart2,
  User,
  Settings,
  HelpCircle,
} from "lucide-react";

const menu = [
  { label: "Dashboard", path: "/company/dashboard", icon: <Home size={18} /> },
  {
    label: "Jobboard",
    path: "/company/jobboard",
    icon: <Briefcase size={18} />,
  },
  { label: "CRM", path: "/company/crm", icon: <Users size={18} /> },
  {
    label: "Simulateur d'adéquation",
    path: "/company/simulateur",
    icon: <Gauge size={18} />,
  },
  {
    label: "Statistiques",
    path: "/company/stats",
    icon: <BarChart2 size={18} />,
  },
];

const bottom = [
  { label: "My Profile", icon: <User size={18} /> },
  { label: "Settings", icon: <Settings size={18} /> },
  { label: "Help & Support", icon: <HelpCircle size={18} /> },
];

export default function Sidebar() {
  const router = useRouter();

  return (
    <aside className="w-64 h-screen bg-white shadow-md p-4 flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold text-blue-600 mb-6">CaptureGet</h1>
        <ul className="space-y-4">
          {menu.map((item) => (
            <li key={item.label}>
              <Link
                href={item.path}
                className={`flex items-center gap-3 px-2 py-1 rounded-md transition ${
                  router.pathname === item.path
                    ? "text-blue-600 font-semibold"
                    : "text-gray-700 hover:text-blue-500"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <ul className="space-y-3 text-sm text-gray-500">
        {bottom.map((item) => (
          <li
            key={item.label}
            className="flex items-center gap-3 hover:text-blue-400 cursor-pointer"
          >
            {item.icon}
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
