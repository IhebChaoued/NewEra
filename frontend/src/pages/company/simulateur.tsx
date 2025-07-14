"use client";

import Layout from "@/components/company/Layout";
import { useState, useEffect } from "react";
// import axios from "axios";

export default function Simulateur() {
  // Dummy lists - replace these with data from your backend
  const [jobs, setJobs] = useState<{ _id: string; title: string }[]>([]);
  const [candidates, setCandidates] = useState<{ _id: string; name: string }[]>(
    []
  );

  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    details: { criterion: string; job: string; candidate: string }[];
  } | null>(null);

  // Fetch jobs and candidates from backend (dummy for now)
  useEffect(() => {
    // Example dummy data
    setJobs([
      { _id: "job1", title: "Développeur Frontend" },
      { _id: "job2", title: "Data Analyst" },
    ]);

    setCandidates([
      { _id: "cand1", name: "Alice Dupont" },
      { _id: "cand2", name: "Jean Martin" },
    ]);
  }, []);

  const handleRunSimulation = async () => {
    if (!selectedJobId || !selectedCandidateId) {
      alert("Veuillez sélectionner une offre et un candidat.");
      return;
    }

    setLoading(true);

    // TODO → replace with real API call to your AI backend
    setTimeout(() => {
      setResult({
        score: 82,
        details: [
          {
            criterion: "Compétences clés",
            job: "React, TypeScript, Tailwind",
            candidate: "React, Vue, CSS",
          },
          {
            criterion: "Expérience",
            job: "3 ans minimum",
            candidate: "4 ans",
          },
          {
            criterion: "Langues",
            job: "Français, Anglais",
            candidate: "Français",
          },
        ],
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <Layout>
      <div className="bg-white p-6 rounded-xl shadow-md space-y-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Simulateur d’adéquation
        </h1>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Offre d’emploi
            </label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full"
            >
              <option value="">Sélectionnez une offre</option>
              {jobs.map((job) => (
                <option key={job._id} value={job._id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Candidat
            </label>
            <select
              value={selectedCandidateId}
              onChange={(e) => setSelectedCandidateId(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full"
            >
              <option value="">Sélectionnez un candidat</option>
              {candidates.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <button
            onClick={handleRunSimulation}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Analyse en cours..." : "Lancer l’analyse"}
          </button>
        </div>

        {result && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 text-green-700">
              Résultat : {result.score}%
            </h2>

            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left text-gray-700">Critère</th>
                  <th className="p-2 text-left text-gray-700">Offre</th>
                  <th className="p-2 text-left text-gray-700">Candidat</th>
                </tr>
              </thead>
              <tbody>
                {result.details.map((row, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">{row.criterion}</td>
                    <td className="p-2">{row.job}</td>
                    <td className="p-2">{row.candidate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
