const { JOB_STATUS } = require("../constants/jobs");

const Job = require("../models/job.model");

const { Hyperbrowser } = require("@hyperbrowser/sdk");

const hbClient = new Hyperbrowser({
  apiKey: process.env.HYPERBROWSER_API_KEY,
});

exports.getJobById = async (req, res) => {
  const { id } = req.params || {};
  if (!id) {
    return res.status(400).json({ message: "Job ID is required" });
  }
  try {
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    return res.status(200).json(job);
  } catch (err) {
    console.error("Error fetching job:", err);
    return res
      .status(500)
      .json({ message: "Error fetching job", error: err.message });
  }
};

exports.processJob = async (req, res) => {
  const { prompt } = req.body || {};
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ message: "Invalid prompt" });
  }

  const job = new Job({ prompt });
  await job.save();

  try {
    // Run the job asynchronously
    invokeHyperbrowser(job._id, prompt);
    return res
      .status(202)
      .json({ id: job._id, message: "Job is being processed" });
  } catch (err) {
    console.error("Error invoking Hyperbrowser:", err);
    return res
      .status(500)
      .json({ message: "Error processing job", error: err.message });
  }
};

// Background processor
async function invokeHyperbrowser(jobId, prompt) {
  try {
    console.log("Invoking Hyperbrowser with prompt:", prompt);
    const result = await hbClient.agents.hyperAgent.startAndWait({
      task: prompt,
    });

    const finalOutput = result?.data?.finalResult || "No result";

    await Job.findByIdAndUpdate(jobId, {
      status: "Complete",
      result: {
        success: true,
        output: finalOutput,
      },
    });

    console.log(`✅ Job ${jobId} completed and saved.`);
  } catch (err) {
    console.error(`❌ Hyperbrowser error for job ${jobId}:`, err);

    await Job.findByIdAndUpdate(jobId, {
      status: "Complete",
      result: {
        success: false,
        output: err.message || "Hyperbrowser failed",
      },
    });
  }
}
