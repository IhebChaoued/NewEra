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

  const pieColors = ["#4ade80", "#f87171"];

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        {/* ✅ KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-green-100 rounded-lg p-4">
            <h3 className="text-gray-600 text-sm">Total candidatures</h3>
            <p className="text-2xl font-bold text-green-800">305</p>
          </div>

          <div className="bg-blue-100 rounded-lg p-4">
            <h3 className="text-gray-600 text-sm">Total embauches</h3>
            <p className="text-2xl font-bold text-blue-800">47</p>
          </div>

          <div className="bg-purple-100 rounded-lg p-4">
            <h3 className="text-gray-600 text-sm">Postes publiés</h3>
            <p className="text-2xl font-bold text-purple-800">12</p>
          </div>

          <div className="bg-red-100 rounded-lg p-4">
            <h3 className="text-gray-600 text-sm">Taux de refus</h3>
            <p className="text-2xl font-bold text-red-800">23%</p>
          </div>
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
      </div>
    </Layout>
  );
}

{
  /* ✅ New block: Jobs recruited */
}
<div className="bg-white p-4 rounded-lg shadow mb-6">
  <h3 className="text-lg font-semibold mb-4">Postes recrutés</h3>
  <ResponsiveContainer width="100%" height={300}>
    <BarChart
      data={[
        { name: "Développeur", recrutés: 15 },
        { name: "RH", recrutés: 8 },
        { name: "Marketing", recrutés: 5 },
        { name: "Sales", recrutés: 12 },
        { name: "Support", recrutés: 7 },
      ]}
      layout="vertical"
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
    >
      <XAxis type="number" />
      <YAxis dataKey="name" type="category" width={120} />
      <Tooltip />
      <Bar dataKey="recrutés" fill="#34d399" />
    </BarChart>
  </ResponsiveContainer>
</div>;
