import Layout from "@/components/company/Layout";

export default function Jobboard() {
  return (
    <Layout>
      <div className="responsive-container">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button className="bg-[#66f2bc] hover:bg-green-400 text-white px-4 py-2 rounded-xl shadow-sm font-semibold transition">
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

        {/* Job cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-xl shadow hover:shadow-md transition border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Développeur Frontend
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Tunis | CDI | Temps plein
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-[#66f2bc] text-white px-3 py-1 rounded-full">
                  Urgent
                </span>
                <span className="text-xs text-gray-500">
                  Publié il y a 3 jours
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
