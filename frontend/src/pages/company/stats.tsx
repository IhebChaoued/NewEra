"use client";

import Layout from "@/components/company/Layout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import CountUp from "react-countup";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function Stats() {
  // Fake data for charts
  const applicationsData = [
    { mois: "Jan", candidatures: 30 },
    { mois: "Fév", candidatures: 50 },
    { mois: "Mar", candidatures: 40 },
    { mois: "Avr", candidatures: 60 },
    { mois: "Mai", candidatures: 80 },
    { mois: "Juin", candidatures: 45 },
  ];

  const hiresData = [
    { name: "Embauchés", value: 20 },
    { name: "Non retenus", value: 80 },
  ];

  const jobsData = [
    { mois: "Jan", postes: 4 },
    { mois: "Fév", postes: 6 },
    { mois: "Mar", postes: 5 },
    { mois: "Avr", postes: 8 },
    { mois: "Mai", postes: 7 },
    { mois: "Juin", postes: 3 },
  ];

  const recruitedJobs = [
    { title: "Développeur", number: 15 },
    { title: "RH", number: 8 },
    { title: "Marketing", number: 5 },
    { title: "Sales", number: 12 },
    { title: "Support", number: 7 },
  ];

  const pieColors = ["#4ade80", "#f87171"];

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        {/* ✅ KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <KPICard
            label="Total candidatures"
            value={305}
            color="green"
            trend={12}
          />
          <KPICard label="Total embauches" value={47} color="blue" trend={5} />
          <KPICard
            label="Postes publiés"
            value={12}
            color="purple"
            trend={-3}
          />
          <KPICard
            label="Taux de refus"
            value="23%"
            color="red"
            trend={2}
            isPercentage
          />
        </div>

        {/* ✅ Applications Over Time */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Candidatures au fil du temps
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={applicationsData}>
              <XAxis dataKey="mois" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="candidatures" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ✅ Hires vs Rejections */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Répartition des résultats
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={hiresData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={(entry) => `${entry.name}: ${entry.value}`}
                dataKey="value"
              >
                {hiresData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* ✅ Jobs Posted Per Month */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Postes publiés par mois
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={jobsData}>
              <XAxis dataKey="mois" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="postes"
                stroke="#a78bfa"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ✅ Jobs Recruited */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">
              Postes recrutés (Graphique)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={recruitedJobs}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis type="number" />
                <YAxis dataKey="title" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="number" fill="#34d399" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Top postes recrutés</h3>
            <ul className="divide-y divide-gray-200">
              {recruitedJobs.map((job) => (
                <li key={job.title} className="py-2 flex justify-between">
                  <span className="text-gray-700">{job.title}</span>
                  <span className="font-semibold text-green-600">
                    {job.number}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}

type KPIProps = {
  label: string;
  value: number | string;
  color: "green" | "blue" | "purple" | "red";
  trend: number;
  isPercentage?: boolean;
};

function KPICard({ label, value, color, trend, isPercentage }: KPIProps) {
  const colorClasses: Record<string, string> = {
    green: "text-green-800 bg-green-100",
    blue: "text-blue-800 bg-blue-100",
    purple: "text-purple-800 bg-purple-100",
    red: "text-red-800 bg-red-100",
  };

  const TrendIcon = trend >= 0 ? ArrowUpRight : ArrowDownRight;
  const trendColor = trend >= 0 ? "text-green-600" : "text-red-600";

  return (
    <div className={`rounded-lg p-4 ${colorClasses[color]}`}>
      <h3 className="text-gray-600 text-sm">{label}</h3>
      <p className="text-2xl font-bold">
        {typeof value === "number" ? (
          <CountUp end={value} duration={1.5} separator=" " />
        ) : (
          value
        )}
      </p>
      <div className={`flex items-center mt-1 text-sm ${trendColor}`}>
        <TrendIcon size={14} className="mr-1" />
        {trend >= 0 ? "+" : ""}
        {trend}%{isPercentage && " ce mois-ci"}
      </div>
    </div>
  );
}
