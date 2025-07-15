const candidates = [
  { name: "Nom Prenom", status: "En cours" },
  { name: "Nom Prenom", status: "Validé" },
  { name: "Nom Prenom", status: "Validé" },
  { name: "Nom Prenom", status: "Validé" },
  { name: "Nom Prenom", status: "Validé" },
];

export default function CandidatesList() {
  return (
    <div className="w-64">
      <div className="space-y-4">
        {candidates.map((cand, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border dark:border-gray-700"
          >
            <p className="text-sm font-bold text-black dark:text-gray-100">
              {cand.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {cand.status}
            </p>
            <button className="text-xs text-blue-600 dark:text-blue-400 mt-1 hover:underline">
              See Details
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
          Discover All
        </button>
      </div>
    </div>
  );
}
