const { v4: uuidv4 } = require("uuid");

const { JOB_STATUS } = require("../constants/jobs");

const { Hyperbrowser } = require("@hyperbrowser/sdk");

const hbClient = new Hyperbrowser({
  apiKey: process.env.HYPERBROWSER_API_KEY,
});

exports.processJob = async (req, res) => {
  const { prompt } = req.body || {};
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ message: "Invalid prompt" });
  }

  const id = uuidv4();

  try {
    const result = await invokeHyperbrowser(id, prompt);
    return res
      .status(202)
      .json({ id, prompt, message: "Job is being processed", result });
  } catch (err) {
    console.error("Error invoking Hyperbrowser:", err);
    return res
      .status(500)
      .json({ message: "Error processing job", error: err.message });
  }
};

async function invokeHyperbrowser(id, prompt) {
  try {
    console.log("Invoking Hyperbrowser with ID:", prompt);
    const result = await hbClient.agents.hyperAgent.startAndWait({
      task: prompt,
    });

    console.log("result", result);
    console.log("Hyperbrowser result:", result?.data?.finalResult);
    return result?.data?.finalResult;
  } catch (err) {
    console.error(`Encountered error: ${err}`);
  }
}
