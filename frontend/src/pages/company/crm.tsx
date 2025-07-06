import Layout from "@/components/company/Layout";
import { useState } from "react";
import {
  Home,
  MoreVertical,
  ChevronRight,
  CheckCircle,
  Plus,
} from "lucide-react";
import { useCompanyCRM } from "../../lib/useCompanyCRM";
import { IApplication } from "../../types/application";

export default function CRM() {
  const [dynamicColumns, setDynamicColumns] = useState<string[]>([
    "Entretien Téléphonique",
  ]);
  const [openRecruitment, setOpenRecruitment] = useState(true);

  const {
    applications,
    loading,
    error,
    changeStatus,
    addStep,
    saveStepResult,
  } = useCompanyCRM();

  // Confirmation modal state
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<{
    appId: string;
    newStatus: IApplication["status"];
  } | null>(null);

  function handleChangeStage(appId: string, newStatus: IApplication["status"]) {
    // save data and show modal
    setConfirmTarget({ appId, newStatus });
    setShowConfirm(true);
  }

  function handleConfirm() {
    if (confirmTarget) {
      changeStatus(confirmTarget.appId, confirmTarget.newStatus);
    }
    setShowConfirm(false);
    setConfirmTarget(null);
  }

  function handleCancel() {
    setShowConfirm(false);
    setConfirmTarget(null);
  }

  function addColumn() {
    const name = prompt("Nom de la nouvelle étape ?");
    if (name) {
      setDynamicColumns([...dynamicColumns, name]);
    }
  }

  // Group applications by pipeline status
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

        {/* CRM Content */}
        <div className="flex-1 bg-white rounded-xl p-6 shadow-md">
          {loading && <p>Chargement...</p>}
          {error && <p className="text-red-500">{error}</p>}

          <div className="flex flex-col gap-12">
            {Object.entries(stages).map(([status, apps]) => (
              <div key={status}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {stageLabels[status as keyof typeof stages]}
                  </h2>

                  {/* Only show add button in En cours */}
                  {status === "in_progress" && (
                    <button
                      onClick={addColumn}
                      className="flex items-center text-sm text-green-700 hover:text-green-900"
                    >
                      <Plus size={14} className="mr-1" />
                      Ajouter étape
                    </button>
                  )}
                </div>

                <div className="overflow-x-auto border rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-gray-700">
                      <tr>
                        <th className="p-3 text-left">Nom</th>
                        <th className="p-3 text-left">Email</th>
                        <th className="p-3 text-left">Téléphone</th>
                        <th className="p-3 text-left">Poste</th>
                        <th className="p-3 text-left">CV</th>

                        {/* Dynamic columns only for En cours */}
                        {status === "in_progress" &&
                          dynamicColumns.map((col) => (
                            <th
                              key={col}
                              className="p-3 text-left whitespace-nowrap"
                            >
                              {col}
                            </th>
                          ))}

                        <th className="p-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {apps.length === 0 ? (
                        <tr>
                          <td
                            colSpan={
                              6 +
                              (status === "in_progress"
                                ? dynamicColumns.length
                                : 0)
                            }
                            className="p-3 text-gray-500 text-center"
                          >
                            Aucun candidat.
                          </td>
                        </tr>
                      ) : (
                        apps.map((app) => (
                          <tr
                            key={app._id}
                            className="border-t hover:bg-gray-50"
                          >
                            <td className="p-3">
                              {app.userId?.firstName} {app.userId?.lastName}
                            </td>
                            <td className="p-3">{app.userId?.email}</td>
                            <td className="p-3">{app.userId?.phone || "-"}</td>
                            <td className="p-3">{app.jobId?.title}</td>
                            <td className="p-3">
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

                            {/* Dynamic step cells */}
                            {status === "in_progress" &&
                              dynamicColumns.map((col) => {
                                const step = app.steps?.find(
                                  (s) => s.name === col
                                );

                                return (
                                  <td
                                    key={col}
                                    className={`p-3 text-center text-xs font-semibold ${
                                      step?.result === "GO"
                                        ? "bg-green-100 text-green-800"
                                        : step?.result === "NO_GO"
                                        ? "bg-red-100 text-red-800"
                                        : step?.result === "STILL"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-gray-50 text-gray-500"
                                    }`}
                                  >
                                    {step?.result || "-"}
                                  </td>
                                );
                              })}

                            <td className="p-3 space-x-2">
                              <button
                                className="text-blue-600 underline text-xs"
                                onClick={() =>
                                  handleChangeStage(
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

                              {status === "in_progress" && (
                                <>
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
                                </>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirmation</h2>
            <p className="mb-6">
              Êtes-vous sûr de vouloir passer à l’étape suivante ?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
