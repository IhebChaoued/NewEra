import { useEffect, useState } from "react";
import Layout from "@/components/company/Layout";
import axios from "axios";
import { IJob } from "@/types/job";
import { useCompanyAuthStore } from "@/store/companyAuthStore";

export default function Jobboard() {
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Form fields for new job
  const [newJob, setNewJob] = useState<Partial<IJob>>({
    title: "",
    description: "",
    requirements: "",
    location: "",
    salaryRange: "",
    howToApply: "",
    blurry: true,
  });

  const { token } = useCompanyAuthStore();

  // Fetch jobs on mount
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get<{ results: IJob[] }>(
        "http://localhost:5000/api/jobs"
      );
      setJobs(res.data.results);
    } catch (error) {
      console.error("Error fetching jobs", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target;
    const name = target.name;
    const value =
      target.type === "checkbox"
        ? (target as HTMLInputElement).checked
        : target.value;

    setNewJob((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/jobs", newJob, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Job created!");
      setShowModal(false);
      setNewJob({
        title: "",
        description: "",
        requirements: "",
        location: "",
        salaryRange: "",
        howToApply: "",
        blurry: true,
      });
      fetchJobs();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la création de l'offre.");
    }
  };

  return (
    <Layout>
      <div className="responsive-container">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#66f2bc] hover:bg-green-400 text-white px-4 py-2 rounded-xl shadow-sm font-semibold transition"
          >
            + Ajouter une offre
          </button>
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-wrap items-center gap-4">
          <input
            type="text"
            placeholder="Rechercher un poste..."
            className="flex-1 min-w-[200px] border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#66f2bc]"
          />
          <select className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#66f2bc]">
            <option>Type de contrat</option>
            <option>CDI</option>
            <option>CDD</option>
            <option>Stage</option>
          </select>
          <select className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#66f2bc]">
            <option>Localisation</option>
            <option>Tunis</option>
            <option>Sousse</option>
            <option>Remote</option>
          </select>
        </div>

        {/* Jobs grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p>Chargement...</p>
          ) : (
            jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white p-4 rounded-xl shadow hover:shadow-md transition border border-gray-100"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {job.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {job.location} | {job.salaryRange || "Salaire à définir"}
                </p>
                <p className="text-sm text-gray-700 line-clamp-3">
                  {job.description}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Créer une nouvelle offre</h2>
            <form onSubmit={handleCreateJob} className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Titre du poste"
                value={newJob.title || ""}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={newJob.description || ""}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <textarea
                name="requirements"
                placeholder="Compétences requises"
                value={newJob.requirements || ""}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                name="location"
                placeholder="Localisation"
                value={newJob.location || ""}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                name="salaryRange"
                placeholder="Fourchette salariale"
                value={newJob.salaryRange || ""}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                name="howToApply"
                placeholder="Instructions pour postuler"
                value={newJob.howToApply || ""}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="blurry"
                  checked={newJob.blurry || false}
                  onChange={handleChange}
                />
                Publier anonymement
              </label>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:underline"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Créer l&apos;offre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
