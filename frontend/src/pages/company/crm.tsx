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

import { useCompanyCRM } from "../../lib/useCompanyCRM";
import { IApplication } from "../../types/application";

export default function CRM() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [openRecruitment, setOpenRecruitment] = useState(true);
  const [openIntegration, setOpenIntegration] = useState(false);

  const {
    applications,
    loading,
    error,
    changeStatus,
    addStep,
    saveStepResult,
  } = useCompanyCRM();

  const stages: Record<IApplication["status"], IApplication[]> = {
    pending: [],
    in_progress: [],
    qualified: [],
    not_qualified: [],
  };

  for (const app of applications) {
    stages[app.status].push(app);
  }

  const stageLabels: Record<keyof typeof stages, string> = {
    pending: "Nouveaux candidats",
    in_progress: "En cours",
    qualified: "Embauché",
    not_qualified: "Non qualifié",
  };

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Sidebar */}
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

            <div className="flex items-center justify-between mt-4 px-2 gap-2 w-full">
              <div className="flex-grow flex items-center gap-2 border border-gray-300 rounded-md px-3 py-1 text-sm text-gray-700">
                <Search size={14} />
                Recherche
              </div>
              <div className="bg-blue-600 text-white p-1.5 rounded-md cursor-pointer">
                <Plus size={16} />
              </div>
            </div>

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
                <div className="flex items-center gap-2 text-sm text-gray-700 truncate w-full">
                  <Folder size={14} />
                  <span className="truncate">Postes vacants</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 truncate w-full">
                  <FileText size={14} />
                  <span className="truncate">Processus de recrutement</span>
                </div>
              </div>
            </div>

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
                <div className="text-sm text-gray-700 truncate">
                  📁 <span className="truncate">Dossier administratif</span>
                </div>
                <div className="text-sm text-gray-700 truncate">
                  📁 <span className="truncate">Contrat et signature RH</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CRM content */}
        <div className="flex-1 bg-white rounded-xl p-6 shadow-md">
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

          {loading && <p>Chargement...</p>}
          {error && <p className="text-red-500">{error}</p>}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {Object.entries(stages).map(([status, apps]) => (
              <div key={status} className="bg-gray-50 rounded-lg border p-4">
                <h2 className="text-lg font-semibold mb-4">
                  {stageLabels[status as keyof typeof stages]}
                </h2>

                {apps.length === 0 ? (
                  <p className="text-gray-500 text-sm">Aucun candidat.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-gray-700">
                      <tr>
                        <th className="p-2 text-left">Nom</th>
                        <th className="p-2 text-left">Poste</th>
                        <th className="p-2 text-left">Email</th>
                        <th className="p-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {apps.map((app: IApplication) => (
                        <tr key={app._id} className="border-t hover:bg-gray-50">
                          <td className="p-2">
                            {app.userId?.firstName} {app.userId?.lastName}
                          </td>
                          <td className="p-2">{app.jobId?.title}</td>
                          <td className="p-2">{app.userId?.email}</td>
                          <td className="p-2 space-x-2">
                            <button
                              className="text-blue-600 underline text-xs"
                              onClick={() =>
                                changeStatus(
                                  app._id,
                                  status === "pending"
                                    ? "in_progress"
                                    : status === "in_progress"
                                    ? "qualified"
                                    : status === "qualified"
                                    ? "not_qualified"
                                    : "pending"
                                )
                              }
                            >
                              Changer étape
                            </button>
                            <button
                              className="text-green-600 underline text-xs"
                              onClick={() =>
                                addStep(app._id, "Entretien Téléphonique")
                              }
                            >
                              Ajouter étape
                            </button>
                            <button
                              className="text-yellow-600 underline text-xs"
                              onClick={() =>
                                saveStepResult(
                                  app._id,
                                  app.steps?.[0]?._id || "",
                                  "GO"
                                )
                              }
                            >
                              MAJ étape
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
