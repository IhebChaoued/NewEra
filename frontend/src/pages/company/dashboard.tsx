"use client";

import Layout from "@/components/company/Layout";
import { useState } from "react";
import CandidatesList from "@/components/company/CandidatesList";
import CountUp from "react-countup";
import {
  ArrowUpRight,
  Calendar,
  FileText,
  BarChart2,
  Star,
  Users,
  MessageSquare,
  Bell,
  CheckCircle,
  ClipboardCheck,
  TrendingUp,
  Activity,
  Quote,
  Briefcase,
  Plus,
} from "lucide-react";

const tabs = ["News", "Stats", "Agenda", "Feedback", "Activity"];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("News");

  return (
    <Layout>
      <div className="relative flex flex-col lg:flex-row">
        {/* Main content */}
        <div className="flex-1 pr-0 lg:pr-80">
          {/* Upgrade box */}
          <div className="bg-gradient-to-r from-green-100 via-[#66f2bc] to-green-100 p-5 rounded-xl mb-6 flex items-center justify-between shadow">
            <div>
              <h2 className="text-lg font-bold text-green-900">
                Upgrade to Premium Membership
              </h2>
              <p className="text-sm text-green-800">
                Unlock All Premium Icons, No Ads, and more
              </p>
            </div>
            <button className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md transition">
              Upgrade
            </button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <MetricCard
              title="Total candidatures"
              icon={<Users size={20} />}
              value={305}
              color="from-green-400 to-green-500"
              trend={12}
            />
            <MetricCard
              title="Total embauches"
              icon={<Star size={20} />}
              value={47}
              color="from-blue-400 to-blue-500"
              trend={5}
            />
            <MetricCard
              title="Total refus"
              icon={<FileText size={20} />}
              value={23}
              color="from-red-400 to-red-500"
              trend={-3}
            />
          </div>

          {/* Tab buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-[#66f2bc] text-white shadow"
                    : "text-gray-700 hover:bg-green-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <TabContent tab={activeTab} />
        </div>

        {/* Candidates Sidebar */}
        <div className="hidden lg:block absolute right-6 top-0 h-full">
          <CandidatesList />
        </div>
      </div>
    </Layout>
  );
}

// Metric Card Component
function MetricCard({
  title,
  icon,
  value,
  color,
  trend,
}: {
  title: string;
  icon: React.ReactNode;
  value: number;
  color: string;
  trend: number;
}) {
  return (
    <div
      className={`bg-gradient-to-br ${color} p-4 rounded-xl text-white flex justify-between items-center shadow hover:shadow-lg transition`}
    >
      <div>
        <p className="text-sm font-medium">{title}</p>
        <h2 className="text-2xl font-bold mt-1">
          <CountUp end={value} duration={1.5} separator=" " />
        </h2>
        <p className="text-xs mt-1 flex items-center">
          <ArrowUpRight
            size={14}
            className={`mr-1 ${
              trend >= 0 ? "text-green-200" : "text-red-200 rotate-45"
            }`}
          />
          {trend >= 0 ? "+" : ""}
          {trend}%
        </p>
      </div>
      <div className="opacity-50">{icon}</div>
    </div>
  );
}

// Tab content
function TabContent({ tab }: { tab: string }) {
  switch (tab) {
    case "News":
      return (
        <div className="grid gap-4">
          <Card title="Nouvelle fonctionnalité" icon={<BarChart2 size={18} />}>
            Nous avons ajouté des statistiques avancées pour vos analyses.
          </Card>
          <Card title="Annonce équipe" icon={<Users size={18} />}>
            Bienvenue à Sophie, notre nouvelle recruteuse !
          </Card>
          <Card title="Citation du jour" icon={<Quote size={18} />}>
            <span className="italic text-gray-600">
              “Great vision without great people is irrelevant.”
            </span>
          </Card>
          <QuickLinks />
        </div>
      );

    case "Stats":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card title="Candidatures par mois" icon={<BarChart2 size={18} />}>
            <div className="text-gray-600 text-sm">
              Placeholder chart coming soon...
            </div>
          </Card>
          <Card title="Taux de réussite" icon={<Star size={18} />}>
            <p className="text-3xl font-bold text-green-600">76%</p>
          </Card>
          <LatestJobPosts />
        </div>
      );

    case "Agenda":
      return (
        <div className="grid gap-4">
          <Card title="Entretien prévu" icon={<Calendar size={18} />}>
            <p className="text-gray-700 text-sm">
              Entretien avec <strong>John Doe</strong> le 12/08 à 14h.
            </p>
            <button className="mt-2 px-3 py-1 text-sm rounded bg-green-600 text-white hover:bg-green-700">
              Confirmer
            </button>
          </Card>
          <RemindersList />
        </div>
      );

    case "Feedback":
      return (
        <div className="grid gap-4">
          <Card
            title="Avis des utilisateurs"
            icon={<MessageSquare size={18} />}
          >
            <p className="text-gray-700 text-sm">
              ‘Super outil, très intuitif et efficace !’
            </p>
            <p className="text-gray-700 text-sm mt-2">
              ‘J’aimerais pouvoir personnaliser encore plus les dashboards.’
            </p>
            <textarea
              placeholder="Laissez votre feedback..."
              className="mt-3 w-full border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
            ></textarea>
            <button className="mt-2 px-3 py-1 text-sm rounded bg-green-600 text-white hover:bg-green-700">
              Envoyer
            </button>
          </Card>
        </div>
      );

    case "Activity":
      return (
        <div className="grid gap-4">
          <RecentActivity />
        </div>
      );

    default:
      return null;
  }
}

// Generic Card Component
function Card({
  title,
  children,
  icon,
}: {
  title: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition">
      <div className="flex items-center gap-2 mb-3 text-green-600 font-medium">
        {icon}
        {title}
      </div>
      {children}
    </div>
  );
}

// Quick Links
function QuickLinks() {
  return (
    <div className="flex gap-3 mt-4">
      <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm">
        <Plus size={14} /> Nouveau poste
      </button>
      <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm">
        <Plus size={14} /> Ajouter candidat
      </button>
    </div>
  );
}

// Reminders List
function RemindersList() {
  const reminders = [
    { text: "Appeler John demain", done: false },
    { text: "Revoir le job Marketing", done: true },
  ];

  return (
    <Card title="Rappels" icon={<Bell size={18} />}>
      <ul className="space-y-2">
        {reminders.map((r, idx) => (
          <li
            key={idx}
            className="flex items-center justify-between text-sm text-gray-700"
          >
            <span className={r.done ? "line-through text-gray-400" : ""}>
              {r.text}
            </span>
            {r.done ? (
              <CheckCircle size={16} className="text-green-500" />
            ) : (
              <ClipboardCheck size={16} className="text-gray-400" />
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}

// Recent Activity
function RecentActivity() {
  const activities = [
    {
      icon: <Briefcase size={16} />,
      text: "Nouveau poste Frontend Developer créé.",
      time: "il y a 2h",
    },
    {
      icon: <Users size={16} />,
      text: "Sophie a ajouté un candidat.",
      time: "il y a 4h",
    },
    {
      icon: <TrendingUp size={16} />,
      text: "Statistiques mises à jour.",
      time: "hier",
    },
  ];

  return (
    <Card title="Activité récente" icon={<Activity size={18} />}>
      <ul className="space-y-2">
        {activities.map((a, idx) => (
          <li key={idx} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-700">
              {a.icon}
              <span>{a.text}</span>
            </div>
            <span className="text-gray-400 text-xs">{a.time}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

// Latest Job Posts Table
function LatestJobPosts() {
  const jobs = [
    { title: "Frontend Developer", date: "10/07/2025", applicants: 12 },
    { title: "UX Designer", date: "08/07/2025", applicants: 5 },
  ];

  return (
    <Card title="Derniers postes créés" icon={<Briefcase size={18} />}>
      <table className="w-full text-sm text-gray-700">
        <thead>
          <tr className="border-b">
            <th className="py-2 text-left">Poste</th>
            <th className="py-2 text-left">Date</th>
            <th className="py-2 text-left">Candidats</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job, i) => (
            <tr key={i} className="border-b hover:bg-gray-50">
              <td className="py-2">{job.title}</td>
              <td className="py-2">{job.date}</td>
              <td className="py-2">{job.applicants}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
