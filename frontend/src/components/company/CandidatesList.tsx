// A small card list that shows candidates and a "Discover All" button

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
            className="bg-white p-3 rounded-lg shadow-sm border"
          >
            <p className="text-sm font-bold text-black">{cand.name}</p>
            <p className="text-xs text-gray-500">{cand.status}</p>
            <button className="text-xs text-blue-600 mt-1 hover:underline">
              See Details
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button className="text-blue-600 text-sm hover:underline">
          Discover All
        </button>
      </div>
    </div>
  );
}
