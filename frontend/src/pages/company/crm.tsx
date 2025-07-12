"use client";

import Layout from "@/components/company/Layout";
import { useState, useMemo } from "react";
import {
  Home,
  MoreVertical,
  ChevronRight,
  CheckCircle,
  Plus,
} from "lucide-react";
import { useCompanyCRM } from "../../lib/useCompanyCRM";

export default function CRM() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [openRecruitment, setOpenRecruitment] = useState(true);

  const [editingStepResult, setEditingStepResult] = useState<{
    appId: string;
    stepId: string;
  } | null>(null);

  const [addingStepForAppId, setAddingStepForAppId] = useState<string | null>(
    null
  );

  const [newStepName, setNewStepName] = useState("");

  const {
    applications,
    loading,
    error,
    changeStatus,
    addStep,
    saveStepResult,
  } = useCompanyCRM();

  const stages: Record<
    "pending" | "in_progress" | "qualified" | "not_qualified",
    typeof applications
  > = {
    pending: [],
    in_progress: [],
    qualified: [],
    not_qualified: [],
  };

  for (const app of applications) {
    stages[app.status].push(app);
  }

  const stepResultLabels: Record<string, string> = {
    GO: "Validé",
    NO_GO: "Non retenu",
    STILL: "En attente",
    "": "Non défini",
  };

  /**
   * Get ALL unique step names across all applications
   */
  const allStepNames = useMemo(() => {
    const names = new Set<string>();
    for (const app of applications) {
      for (const step of app.steps || []) {
        if (step.name?.trim()) {
          names.add(step.name);
        }
      }
    }
    return Array.from(names);
  }, [applications]);

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
                        {allStepNames.map((name) => (
                          <th key={name} className="p-2 text-left">
                            {name}
                          </th>
                        ))}
                        <th className="p-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {apps.length === 0 && (
                        <tr>
                          <td
                            colSpan={6 + allStepNames.length}
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

                          {allStepNames.map((stepName) => {
                            const step = app.steps?.find(
                              (s) => s.name === stepName
                            );
                            if (!step) {
                              return (
                                <td key={stepName} className="p-2">
                                  {addingStepForAppId === app._id ? (
                                    <div className="flex gap-1">
                                      <input
                                        type="text"
                                        value={newStepName}
                                        onChange={(e) =>
                                          setNewStepName(e.target.value)
                                        }
                                        onKeyDown={async (e) => {
                                          if (e.key === "Enter") {
                                            if (newStepName.trim()) {
                                              await addStep(
                                                app._id,
                                                newStepName.trim()
                                              );
                                              setNewStepName("");
                                              setAddingStepForAppId(null);
                                            }
                                          }
                                        }}
                                        onBlur={() =>
                                          setAddingStepForAppId(null)
                                        }
                                        autoFocus
                                        className="border text-xs px-2 py-1 rounded w-full"
                                      />
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        setAddingStepForAppId(app._id);
                                      }}
                                      className="flex items-center gap-1 text-green-600 text-xs hover:underline"
                                    >
                                      <Plus size={12} /> Ajouter étape
                                    </button>
                                  )}
                                </td>
                              );
                            }

                            return (
                              <td key={step._id} className="p-2">
                                {editingStepResult?.appId === app._id &&
                                editingStepResult?.stepId === step._id ? (
                                  <select
                                    value={step.result || ""}
                                    onChange={async (e) => {
                                      await saveStepResult(
                                        app._id,
                                        step._id || "",
                                        e.target.value as
                                          | "GO"
                                          | "NO_GO"
                                          | "STILL"
                                          | ""
                                      );
                                      setEditingStepResult(null);
                                    }}
                                    className="text-xs border rounded px-1 py-0.5 w-full"
                                  >
                                    <option value="">Non défini</option>
                                    <option value="GO">Validé</option>
                                    <option value="NO_GO">Non retenu</option>
                                    <option value="STILL">En attente</option>
                                  </select>
                                ) : (
                                  <div
                                    className={`cursor-pointer px-2 py-1 text-xs rounded ${
                                      step.result === "GO"
                                        ? "bg-green-100 text-green-800"
                                        : step.result === "NO_GO"
                                        ? "bg-red-100 text-red-800"
                                        : step.result === "STILL"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-gray-100 text-gray-800"
                                    }`}
                                    onClick={() =>
                                      setEditingStepResult({
                                        appId: app._id,
                                        stepId: step._id || "",
                                      })
                                    }
                                  >
                                    {step.name} →{" "}
                                    {stepResultLabels[step.result || ""]}
                                  </div>
                                )}
                              </td>
                            );
                          })}

                          <td className="p-2 space-x-2">
                            <button
                              className="text-blue-600 underline text-xs"
                              onClick={() =>
                                changeStatus(
                                  app._id,
                                  app.status === "pending"
                                    ? "in_progress"
                                    : app.status === "in_progress"
                                    ? "qualified"
                                    : app.status === "qualified"
                                    ? "not_qualified"
                                    : "pending"
                                )
                              }
                            >
                              Changer étape
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
