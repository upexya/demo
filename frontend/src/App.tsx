import { useState, useEffect } from "react";

import "./App.css";

import { processJobs, getJobById } from "src/services/processJobs";

function App() {
  const [prompt, setPrompt] = useState("");
  const [jobId, setJobId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  // Poll job status every 5s if job is running
  useEffect(() => {
    if (!jobId) return;

    const interval = setInterval(async () => {
      try {
        const result = await getJobById(jobId);
        if (result?.status === "Complete") {
          setResult(result.result);
          setLoading(false);
          clearInterval(interval);
        }
      } catch (err) {
        setError("Failed to fetch job status");
        setLoading(false);
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [jobId]);

  const submitPrompt = async () => {
    if (!prompt.trim()) {
      setError("Prompt cannot be empty");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const result = await processJobs(prompt);
      console.log("Job submitted:", result);
      if (result?.id) {
        setJobId(result.id);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md">
        <h1 className="text-xl font-semibold mb-4 text-gray-800">
          Submit Automation Job
        </h1>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your instruction..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {loading ? (
            <>Loading...</>
          ) : (
            <button
              onClick={submitPrompt}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Submit
            </button>
          )}
        </div>

        {loading && (
          <div className="text-blue-500 font-medium animate-pulse">
            ⏳ Waiting for job to complete...
          </div>
        )}

        {result && (
          <div
            className={`p-4 rounded-lg ${
              result.success ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <p className="text-gray-800 font-medium">
              {result.success ? "✅ Job succeeded:" : "❌ Job failed:"}
            </p>
            <pre className="text-sm mt-2 text-gray-700 whitespace-pre-wrap">
              {result.output}
            </pre>
          </div>
        )}

        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
}

export default App;
