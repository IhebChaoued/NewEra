import Layout from "@/components/company/Layout";
import { useState } from "react";
import CandidatesList from "@/components/company/CandidatesList";

const tabs = ["News", "Stats", "Poste", "Candidats", "Agenda", "Feedback"];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("News");

  return (
    <Layout>
      <div className="relative flex">
        {/* Main content centered */}
        <div className="responsive-container flex-1 pr-0 lg:pr-80">
          {" "}
          {/* padding right to avoid overlap */}
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
          {/* Tab content */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">{activeTab} Content</h3>
            <p className="text-gray-500">
              This is the content area for <strong>{activeTab}</strong>.
            </p>
          </div>
        </div>

        {/* Fixed CandidatesList on far right */}
        <div className="hidden lg:block absolute right-6 top-0 h-full">
          <CandidatesList />
        </div>
      </div>
    </Layout>
  );
}
