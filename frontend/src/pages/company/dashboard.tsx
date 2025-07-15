"use client";

import Layout from "@/components/company/Layout";
import { useState } from "react";
import CandidatesList from "@/components/company/CandidatesList";
import { useCompanyCRM } from "@/lib/useCompanyCRM";
import UserCard from "@/components/company/UserCard";
import CountUp from "react-countup";

const tabs = ["News", "Stats", "Agenda", "Feedback"];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("News");
  const { applications } = useCompanyCRM();

  // Just for demo KPI
  const totalApplications = applications.length;
  const totalHires = applications.filter(
    (a) => a.status === "qualified"
  ).length;
  const totalRejected = applications.filter(
    (a) => a.status === "not_qualified"
  ).length;

  return (
    <Layout>
      <div className="relative flex">
        {/* Main content */}
        <div className="responsive-container flex-1 pr-0 lg:pr-80">
          {/* Upgrade box */}
          <div className="bg-[#66f2bc] p-4 rounded-xl mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-green-900">
                Upgrade to Premium Membership
              </h2>
              <p className="text-sm text-green-800">
                Unlock All Premium Icons, No Ads, and more
              </p>
            </div>
            <button className="bg-green-700 text-white px-4 py-2 rounded-md">
              Upgrade
            </button>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <KpiCard
              label="Total candidatures"
              value={totalApplications}
              color="green"
            />
            <KpiCard label="Total embauches" value={totalHires} color="blue" />
            <KpiCard label="Total refus" value={totalRejected} color="red" />
          </div>

          {/* Tab buttons */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6 max-w-full overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-12 py-3 font-medium transition ${
                  activeTab === tab
                    ? "text-white rounded-xl"
                    : "text-black hover:text-green-600 rounded-full"
                }`}
                style={activeTab === tab ? { backgroundColor: "#66f2bc" } : {}}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Active tab content */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h3 className="text-lg font-semibold mb-2">{activeTab} Content</h3>
            <p className="text-gray-500">
              This is the content area for <strong>{activeTab}</strong>.
            </p>
          </div>

          {/* Latest Applications */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">
              Dernières candidatures
            </h3>

            {applications.length === 0 && (
              <p className="text-gray-500">Aucune candidature disponible.</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {applications.slice(0, 6).map((app) => (
                <UserCard
                  key={app._id}
                  name={`${app.userId?.firstName || ""} ${
                    app.userId?.lastName || ""
                  }`}
                  status={app.status}
                  imageUrl={app.userId?.avatar || "/default-avatar.png"}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="hidden lg:block absolute right-6 top-0 h-full">
          <CandidatesList />
        </div>
      </div>
    </Layout>
  );
}

type KpiCardProps = {
  label: string;
  value: number;
  color: "green" | "blue" | "red";
};

function KpiCard({ label, value, color }: KpiCardProps) {
  const colorMap = {
    green: "bg-green-100 text-green-800",
    blue: "bg-blue-100 text-blue-800",
    red: "bg-red-100 text-red-800",
  };

  return (
    <div className={`rounded-lg p-4 ${colorMap[color]}`}>
      <h4 className="text-sm font-semibold">{label}</h4>
      <p className="text-3xl font-bold mt-2">
        <CountUp end={value} duration={1.5} separator=" " />
      </p>
    </div>
  );
}
