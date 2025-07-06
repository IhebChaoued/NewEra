import Layout from "@/components/company/Layout";
import { useState } from "react";
import { Home, MoreVertical, ChevronRight, CheckCircle } from "lucide-react";
import { useCompanyCRM } from "../../lib/useCompanyCRM";
import { IApplication } from "../../types/application";

export default function CRM() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [openRecruitment, setOpenRecruitment] = useState(true);

  // New: track which step is in edit mode
  const [editingStep, setEditingStep] = useState<{
    appId: string;
    stepId: string;
  } | null>(null);

  const {
    applications,
    loading,
    error,
    changeStatus,
    addStep,
    saveStepResult,
  } = useCompanyCRM();

  // Group applications by status
  const stages: Record<IApplication["status"], IApplication[]> = {
    pending: [],
    in_progress: [],
    qualified: [],
    not_qualified: [],
  };

  for (const app of applications) {
    stages[app.status].push(app);
  }

  // French labels for step results
  const stepResultLabels: Record<string, string> = {
    GO: "Validé",
    NO_GO: "Non retenu",
    STILL: "En attente",
    "": "Non défini",
  };

  // New candidate modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCandidate, setNewCandidate] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    jobTitle: "",
    message: "",
    cvFile: null as File | null,
  });

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Sidebar */}
        <div className="w-full lg:w-72 xl:w-64 bg-white rounded-xl p-4 shadow-sm border flex-shrink-0 text-left self-start">
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
            </div>
          </div>
        </div>

        {/* Main CRM content */}
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
              </select>
            </div>
          </div>

          {loading && <p>Chargement...</p>}
          {error && <p className="text-red-500">{error}</p>}

          <div className="flex flex-col gap-12">
            {Object.entries(stages).map(([status, apps]) => (
              <div key={status} className="bg-gray-50 rounded-lg border p-4">
                <h2 className="text-lg font-semibold mb-4">
                  {status === "pending"
                    ? "Nouveaux candidats"
                    : status === "in_progress"
                    ? "En cours"
                    : status === "qualified"
                    ? "Embauché"
                    : "Non qualifié"}
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-gray-700">
                      <tr>
                        <th className="p-2 text-left">Nom</th>
                        <th className="p-2 text-left">Email</th>
                        <th className="p-2 text-left">Téléphone</th>
                        <th className="p-2 text-left">Poste</th>
                        <th className="p-2 text-left">CV</th>
                        <th className="p-2 text-left">Étapes</th>
                        <th className="p-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {apps.length === 0 && (
                        <tr>
                          <td
                            colSpan={7}
                            className="p-3 text-gray-500 text-center"
                          >
                            Aucun candidat.
                          </td>
                        </tr>
                      )}

                      {apps.map((app) => (
                        <tr key={app._id} className="border-t hover:bg-gray-50">
                          <td className="p-2">
                            {app.userId?.firstName} {app.userId?.lastName}
                          </td>
                          <td className="p-2">{app.userId?.email}</td>
                          <td className="p-2">{app.userId?.phone || "-"}</td>
                          <td className="p-2">{app.jobId?.title || "-"}</td>
                          <td className="p-2">
                            {app.cvUrl ? (
                              <a
                                href={app.cvUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline text-xs"
                              >
                                CV
                              </a>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="p-2">
                            {app.steps?.length > 0 ? (
                              <div className="flex flex-col space-y-1">
                                {app.steps.map((step) => (
                                  <div
                                    key={step._id}
                                    className={`px-2 py-1 rounded text-xs font-semibold cursor-pointer ${
                                      step.result === "GO"
                                        ? "bg-green-100 text-green-800"
                                        : step.result === "NO_GO"
                                        ? "bg-red-100 text-red-800"
                                        : step.result === "STILL"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-gray-100 text-gray-800"
                                    }`}
                                    onClick={() =>
                                      setEditingStep({
                                        appId: app._id,
                                        stepId: step._id || "",
                                      })
                                    }
                                  >
                                    {editingStep?.appId === app._id &&
                                    editingStep?.stepId === step._id ? (
                                      <select
                                        value={step.result || ""}
                                        onChange={(e) => {
                                          saveStepResult(
                                            app._id,
                                            step._id || "",
                                            e.target.value as
                                              | "GO"
                                              | "NO_GO"
                                              | "STILL"
                                              | ""
                                          );
                                          setEditingStep(null);
                                        }}
                                        className="text-xs border rounded px-1 py-0.5"
                                      >
                                        <option value="">Non défini</option>
                                        <option value="GO">Validé</option>
                                        <option value="NO_GO">
                                          Non retenu
                                        </option>
                                        <option value="STILL">
                                          En attente
                                        </option>
                                      </select>
                                    ) : (
                                      <>
                                        {step.name} →{" "}
                                        {stepResultLabels[step.result || ""]}
                                      </>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </td>
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

                      {status === "pending" && (
                        <tr>
                          <td
                            colSpan={7}
                            className="p-3 text-center text-green-600 cursor-pointer hover:underline"
                            onClick={() => setShowAddModal(true)}
                          >
                            + Ajouter candidat
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Candidate Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Nouveau candidat</h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <input
                type="text"
                placeholder="Prénom"
                value={newCandidate.firstName}
                onChange={(e) =>
                  setNewCandidate({
                    ...newCandidate,
                    firstName: e.target.value,
                  })
                }
                className="border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Nom"
                value={newCandidate.lastName}
                onChange={(e) =>
                  setNewCandidate({
                    ...newCandidate,
                    lastName: e.target.value,
                  })
                }
                className="border px-3 py-2 rounded"
              />
              <input
                type="email"
                placeholder="Email"
                value={newCandidate.email}
                onChange={(e) =>
                  setNewCandidate({
                    ...newCandidate,
                    email: e.target.value,
                  })
                }
                className="border px-3 py-2 rounded col-span-2"
              />
              <input
                type="text"
                placeholder="Téléphone"
                value={newCandidate.phone}
                onChange={(e) =>
                  setNewCandidate({
                    ...newCandidate,
                    phone: e.target.value,
                  })
                }
                className="border px-3 py-2 rounded col-span-2"
              />
              <input
                type="text"
                placeholder="Poste"
                value={newCandidate.jobTitle}
                onChange={(e) =>
                  setNewCandidate({
                    ...newCandidate,
                    jobTitle: e.target.value,
                  })
                }
                className="border px-3 py-2 rounded col-span-2"
              />
              <textarea
                placeholder="Message"
                value={newCandidate.message}
                onChange={(e) =>
                  setNewCandidate({
                    ...newCandidate,
                    message: e.target.value,
                  })
                }
                className="border px-3 py-2 rounded col-span-2"
              />
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) =>
                  setNewCandidate({
                    ...newCandidate,
                    cvFile: e.target.files?.[0] || null,
                  })
                }
                className="col-span-2"
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  alert("TODO: save to backend!");
                  setShowAddModal(false);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
