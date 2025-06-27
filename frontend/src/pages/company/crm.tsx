import Layout from "@/components/company/Layout";
import { useState } from "react";
import {
  Home,
  MoreVertical,
  ChevronRight,
  Search,
  Plus,
  CheckCircle,
  Folder,
  FileText,
} from "lucide-react";

export default function CRM() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [openRecruitment, setOpenRecruitment] = useState(true);
  const [openIntegration, setOpenIntegration] = useState(false);

  const candidates = [
    {
      name: "Nom Prenom",
      poste: "Développeur",
      date: "25 Juin 2025",
      status: "Validé",
    },
    {
      name: "Autre Nom",
      poste: "Designer",
      date: "20 Juin 2025",
      status: "En cours",
    },
  ];

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* 🔹 Sidebar Left Section */}
        <div className="w-full lg:w-72 xl:w-64 bg-white rounded-xl p-4 shadow-sm border flex-shrink-0 lg:ml-0 text-left self-start">
          <div className="flex flex-col space-y-2 items-start">
            <button className="flex items-center gap-2 text-gray-800 font-medium px-2 py-2 rounded-md hover:bg-gray-100 w-full transition">
              <Home size={18} />
              Accueil
            </button>

            <div className="flex items-center gap-2 mt-6 px-2 text-gray-800 font-medium">
              <CheckCircle size={16} className="text-green-600" />
              Mon travail
            </div>

            <hr className="my-4 w-full" />

            <div className="flex items-center justify-between px-2 w-full">
              <div className="flex items-center gap-2 font-semibold text-gray-900">
                <Home size={16} />
                <span className="truncate">Espace de travail</span>
              </div>
              <div className="flex items-center gap-2">
                <ChevronRight size={16} className="cursor-pointer" />
                <MoreVertical size={16} className="cursor-pointer" />
              </div>
            </div>

            {/* Search + Add */}
            <div className="flex items-center justify-between mt-4 px-2 gap-2 w-full">
              <div className="flex-grow flex items-center gap-2 border border-gray-300 rounded-md px-3 py-1 text-sm text-gray-700">
                <Search size={14} />
                Recherche
              </div>
              <div className="bg-blue-600 text-white p-1.5 rounded-md cursor-pointer">
                <Plus size={16} />
              </div>
            </div>

            {/* 🔸 Processus de recrutement */}
            <div className="mt-6 w-full">
              <button
                onClick={() => setOpenRecruitment(!openRecruitment)}
                className="flex items-center gap-2 w-full text-[#c2e37b] font-semibold px-2 py-1 text-sm transition-all duration-300"
              >
                <ChevronRight
                  size={16}
                  className={`transition-transform duration-300 ${
                    openRecruitment ? "rotate-90" : ""
                  }`}
                />
                <span className="text-left">Processus de recrutement</span>
              </button>

              <div
                className={`ml-6 mt-2 space-y-2 overflow-hidden transition-all duration-300 ${
                  openRecruitment ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div
                  className="flex items-center gap-2 text-sm text-gray-700 truncate w-full"
                  title="Postes vacants"
                >
                  <Folder size={14} />
                  <span className="truncate">Postes vacants</span>
                </div>
                <div
                  className="flex items-center gap-2 text-sm text-gray-700 truncate w-full"
                  title="Processus de recrutement"
                >
                  <FileText size={14} />
                  <span className="truncate">Processus de recrutement</span>
                </div>
              </div>
            </div>

            {/* 🔸 Recrutement et intégration */}
            <div className="mt-4 w-full">
              <button
                onClick={() => setOpenIntegration(!openIntegration)}
                className="flex items-center gap-2 w-full text-[#f9b156] font-semibold px-2 py-1 text-sm transition-all duration-300"
              >
                <ChevronRight
                  size={16}
                  className={`transition-transform duration-300 ${
                    openIntegration ? "rotate-90" : ""
                  }`}
                />
                <span className="text-left">Recrutement et intégration</span>
              </button>

              <div
                className={`ml-6 mt-2 space-y-2 overflow-hidden transition-all duration-300 ${
                  openIntegration ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div
                  className="text-sm text-gray-700 truncate"
                  title="Dossier administratif"
                >
                  📁 <span className="truncate">Dossier administratif</span>
                </div>
                <div
                  className="text-sm text-gray-700 truncate"
                  title="Contrat et signature RH"
                >
                  📁 <span className="truncate">Contrat et signature RH</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 🔹 CRM Main Content Area */}
        <div className="flex-1 bg-white rounded-xl p-6 shadow-md">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap gap-4 flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-md"
              />

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2"
              >
                <option value="All">Tous</option>
                <option value="Validé">Validé</option>
                <option value="En cours">En cours</option>
              </select>
            </div>

            <button className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700">
              Nouveau
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3">Nom</th>
                  <th className="px-4 py-3">Poste</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Statut</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((cand, idx) => (
                  <tr key={idx} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{cand.name}</td>
                    <td className="px-4 py-3">{cand.poste}</td>
                    <td className="px-4 py-3">{cand.date}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full inline-block ${
                          cand.status === "Validé"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {cand.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
