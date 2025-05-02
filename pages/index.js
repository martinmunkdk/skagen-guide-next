import React, { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

export default function Home() {
  const [guide, setGuide] = useState("");
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("Skagen");
  const [error, setError] = useState(null);

  const fetchGuide = async () => {
    setLoading(true);
    setError(null);
    setGuide("");
    try {
      const res = await fetch("https://skagen-guide-backend.onrender.com/api/generate-guide", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ destination: query }),
      });

      if (!res.ok) throw new Error("Fejl i forbindelsen til serveren");

      const data = await res.json();
      setGuide(data.guide || "Ingen guide modtaget.");
    } catch (err) {
      setError("Der opstod en fejl. Prøv igen senere.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuide();
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-4xl font-bold text-blue-800 mb-6 text-center">AI Guide til {query}</h1>
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Indtast destination (fx Skagen)"
            className="flex-1 px-4 py-2 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            onClick={fetchGuide}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow disabled:opacity-50"
          >
            <Sparkles className="w-5 h-5" />
            {loading ? "Genererer..." : "Generér"}
          </button>
        </div>
        <div className="bg-blue-100 border border-blue-300 rounded-xl p-6 whitespace-pre-line text-gray-800 min-h-[150px]">
          {loading && "Genererer guide... vent venligst."}
          {error && <div className="text-red-600">{error}</div>}
          {!loading && !error && guide}
        </div>
      </div>
    </div>
  );
}
