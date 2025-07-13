"use client";

import Layout from "@/components/company/Layout";
import { useState, useMemo, useEffect } from "react";
import {
  Home,
  MoreVertical,
  ChevronRight,
  CheckCircle,
  Plus,
} from "lucide-react";
import { useCompanyCRM } from "../../lib/useCompanyCRM";
import axios from "axios";

export default function CRM() {
  const [search, setSearch] = useState("");
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

  // ✅ Custom fields logic
  const [showCustomFieldModal, setShowCustomFieldModal] = useState(false);
  const [customFields, setCustomFields] = useState<
    { _id: string; name: string; type: string }[]
  >([]);
  const [newCustomFieldName, setNewCustomFieldName] = useState("");
  const [newCustomFieldType, setNewCustomFieldType] = useState("text");

  // Fetch custom fields from backend
  useEffect(() => {
    axios
      .get<{ _id: string; name: string; type: string }[]>("/api/custom-fields")
      .then((res) => setCustomFields(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleAddCustomField = async () => {
    if (!newCustomFieldName.trim()) {
      alert("Nom du champ requis.");
      return;
    }

    try {
      const { data } = await axios.post<{
        _id: string;
        name: string;
        type: string;
      }>("/api/custom-fields", {
        name: newCustomFieldName.trim(),
        type: newCustomFieldType,
      });

      setCustomFields((prev) => [...prev, data]);
      setShowCustomFieldModal(false);
      setNewCustomFieldName("");
      setNewCustomFieldType("text");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la création du champ personnalisé.");
    }
  };

  const filteredApplications = useMemo(() => {
    if (!search.trim()) return applications;

    return applications.filter((app) => {
      const searchStr = search.toLowerCase();

      return (
        app.userId?.firstName?.toLowerCase().includes(searchStr) ||
        app.userId?.lastName?.toLowerCase().includes(searchStr) ||
        app.userId?.email?.toLowerCase().includes(searchStr) ||
        app.jobId?.title?.toLowerCase().includes(searchStr) ||
        customFields.some((field) => {
          const fieldValue = app.customFields?.find((f) => f._id === field._id);
          const val = fieldValue?.value != null ? String(fieldValue.value) : "";
          return val.toLowerCase().includes(searchStr);
        })
      );
    });
  }, [search, applications, customFields]);

  const stages = useMemo(() => {
    const uniqueAppsMap = new Map<string, (typeof applications)[0]>();

    for (const app of filteredApplications) {
      const userId = app.userId?._id || "";
      const jobId = app.jobId?._id || "";
      const key = `${userId}-${jobId}`;

      if (!uniqueAppsMap.has(key)) {
        uniqueAppsMap.set(key, app);
      }
    }

    const result: Record<
      "pending" | "in_progress" | "qualified" | "not_qualified",
      typeof applications
    > = {
      pending: [],
      in_progress: [],
      qualified: [],
      not_qualified: [],
    };

    for (const app of uniqueAppsMap.values()) {
      result[app.status].push(app);
    }

    return result;
  }, [filteredApplications]);

  const stepResultLabels: Record<string, string> = {
    GO: "Validé",
    NO_GO: "Non retenu",
    STILL: "En attente",
    "": "Non défini",
  };

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
            </div>
          </div>

          {loading && <p>Chargement...</p>}
          {error && <p className="text-red-500">{error}</p>}

          <div className="flex flex-col gap-12">
            {Object.entries(stages).map(([status, apps]) => (
              <div key={status} className="bg-gray-50 rounded-lg border p-4">
                <h2 className="text-lg font-semibold mb-4 text-black">
                  {status === "pending"
                    ? "Nouveaux candidats"
                    : status === "in_progress"
                    ? "En cours"
                    : status === "qualified"
                    ? "Embauché"
                    : "Non qualifié"}
                </h2>

                <button
                  onClick={() => setShowCustomFieldModal(true)}
                  className="mb-4 text-sm px-3 py-2 rounded bg-green-700 text-white hover:bg-green-800"
                >
                  + Ajouter un champ personnalisé
                </button>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-gray-900 sticky top-0 z-10">
                      <tr>
                        <th className="p-2 text-left">Nom</th>
                        <th className="p-2 text-left">Email</th>
                        <th className="p-2 text-left">Téléphone</th>
                        <th className="p-2 text-left">Poste</th>
                        <th className="p-2 text-left">Date d’application</th>
                        <th className="p-2 text-left">CV</th>
                        {customFields.map((field) => (
                          <th key={field._id} className="p-2 text-left">
                            {field.name}
                          </th>
                        ))}
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
                            colSpan={
                              7 + customFields.length + allStepNames.length
                            }
                            className="p-3 text-gray-500 text-center"
                          >
                            Aucun candidat.
                          </td>
                        </tr>
                      )}

                      {apps.map((app) => (
                        <tr key={app._id} className="border-t hover:bg-gray-50">
                          <td className="p-2 text-black">
                            {app.userId?.firstName} {app.userId?.lastName}
                          </td>
                          <td className="p-2 text-black">
                            {app.userId?.email}
                          </td>
                          <td className="p-2 text-black">
                            {app.userId?.phone || "-"}
                          </td>
                          <td className="p-2 text-black">
                            {app.jobId?.title || "-"}
                          </td>
                          <td className="p-2 text-black">
                            {app.createdAt
                              ? new Date(app.createdAt).toLocaleDateString(
                                  "fr-FR"
                                )
                              : "-"}
                          </td>
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

                          {customFields.map((field) => (
                            <td key={field._id} className="p-2 text-black">
                              -
                            </td>
                          ))}

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

      {/* ✅ Custom field modal */}
      {showCustomFieldModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Nouveau champ personnalisé
            </h3>

            <div className="mb-4">
              <label className="text-sm block mb-1">Nom du champ</label>
              <input
                type="text"
                value={newCustomFieldName}
                onChange={(e) => setNewCustomFieldName(e.target.value)}
                className="border rounded px-3 py-2 w-full"
              />
            </div>

            <div className="mb-4">
              <label className="text-sm block mb-1">Type de champ</label>
              <select
                value={newCustomFieldType}
                onChange={(e) => setNewCustomFieldType(e.target.value)}
                className="border rounded px-3 py-2 w-full"
              >
                <option value="text">Texte</option>
                <option value="number">Nombre</option>
                <option value="date">Date</option>
                <option value="select">Liste déroulante</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCustomFieldModal(false)}
                className="px-4 py-2 rounded border text-gray-700"
              >
                Annuler
              </button>
              <button
                onClick={handleAddCustomField}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
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
