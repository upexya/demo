import { useState } from "react";

import "./App.css";

import { processJobs } from "src/services/processJobs";

function App() {
  const [prompt, setPrompt] = useState("");

  const submitPrompt = async () => {
    try {
      const users = await processJobs(prompt);
      console.log(users);
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
          <button
            onClick={submitPrompt}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Submit
          </button>
        </div>

        <h2 className="text-lg font-medium mb-2 text-gray-700">Jobs</h2>
        {/* <ul className="space-y-2">
          {jobs.map((job) => (
            <li key={job.id} className="p-3 border rounded-lg bg-gray-50">
              <p className="text-sm text-gray-700"><strong>Prompt:</strong> {job.prompt}</p>
              <p className="text-sm">
                <strong>Status:</strong>{' '}
                <span
                  className={
                    job.status === 'Pending'
                      ? 'text-yellow-500'
                      : job.result?.success
                      ? 'text-green-600'
                      : 'text-red-500'
                  }
                >
                  {job.status}
                </span>
              </p>
              {job.result && (
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Output:</strong> {job.result.output}
                </p>
              )}
            </li>
          ))}
        </ul> */}
      </div>
    </div>
  );
}

export default App;
