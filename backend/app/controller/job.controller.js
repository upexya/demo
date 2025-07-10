const { v4: uuidv4 } = require("uuid");

const User = require("../models/user.model");
const { JOB_STATUS } = require("../constants/jobs");

let jobs = {};

exports.processJob = async (req, res) => {
  const { prompt } = req.body || {};
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ message: "Invalid prompt" });
  }

  const id = uuidv4();
  jobs[id] = {
    id,
    prompt,
    status: JOB_STATUS.PENDING,
  };

  // processJob(id, prompt);

  // return res.status(202).json({ id });
  return res
    .status(202)
    .json({ message: "Job is being processed", id, prompt });
};

async function processJob(id, prompt) {
  try {
    const response = await axios.post(
      "https://api.hyperagent.ai/v1/execute",
      { instruction: prompt },
      { headers: { Authorization: `Bearer YOUR_HYPERAGENT_API_KEY` } }
    );
    jobs[id].status = "Complete";
    jobs[id].result = {
      success: true,
      output: response.data?.output || "No output",
    };
  } catch (err) {
    jobs[id].status = "Complete";
    jobs[id].result = { success: false, output: err.message };
  }
}
