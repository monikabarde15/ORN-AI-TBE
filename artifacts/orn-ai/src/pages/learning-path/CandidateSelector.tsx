import { useEffect, useMemo, useState } from "react";
import api from "../../../services/api";

interface Props {
  selectedCandidate: any;
  setSelectedCandidate: (candidate: any) => void;
}

const CandidateSelector = ({
  selectedCandidate,
  setSelectedCandidate,
}: Props) => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState<any[]>([]);

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      setLoading(true);

      const res = await api.get("/api/candidates");

      const data =
        res?.data?.data ||
        res?.data?.candidates ||
        res?.data ||
        [];

      setCandidates(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate: any) => {
      const text = (
        candidate.fullName ||
        candidate.name ||
        candidate.email ||
        ""
      ).toLowerCase();

      return text.includes(search.toLowerCase());
    });
  }, [candidates, search]);

const getCandidateId = (candidate: any) => {
  if (!candidate) return "";

  return candidate.id || candidate._id || "";
};

  
  const goToAddCandidate = () => {
    window.location.href = "/recruiter/add";
  };

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">

      <h3 className="text-lg font-semibold">
        Candidate
      </h3>

      <input
        className="mt-4 w-full rounded-lg border p-3 outline-none focus:border-blue-600"
        placeholder="Search candidate..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="mt-4 max-h-64 overflow-auto">

        {loading ? (
          <div className="py-6 text-center text-gray-500">
            Loading candidates...
          </div>
        ) : filteredCandidates.length > 0 ? (
          filteredCandidates.map((candidate: any) => (
            <div
              key={getCandidateId(candidate)}
              onClick={() => setSelectedCandidate(candidate)}
              className={`mb-2 cursor-pointer rounded-lg border p-3 transition ${
                getCandidateId(selectedCandidate) ===
                getCandidateId(candidate)
                  ? "border-blue-600 bg-blue-50"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="font-medium">
                {candidate.fullName || candidate.name}
              </div>

              <div className="text-sm text-gray-500">
                {candidate.email}
              </div>
            </div>
          ))
        ) : (
          <div className="py-6 text-center">

            <p className="text-gray-500 mb-4">
              No Candidate Found
            </p>

            <button
              onClick={goToAddCandidate}
              className="rounded-lg bg-blue-900 px-5 py-2 text-white hover:bg-blue-800"
            >
              + Add Candidate
            </button>

          </div>
        )}

      </div>

      {selectedCandidate && (
        <div className="mt-5 rounded-lg border border-green-200 bg-green-50 p-3">
          <div className="text-sm font-semibold text-green-700">
            Selected Candidate
          </div>

          <div className="mt-1">
            {selectedCandidate.fullName || selectedCandidate.name}
          </div>

          <div className="text-sm text-gray-600">
            {selectedCandidate.email}
          </div>
        </div>
      )}

    </div>
  );
};

export default CandidateSelector;