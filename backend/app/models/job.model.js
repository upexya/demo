const mongoose = require("mongoose");

const { JOB_STATUS } = require("../constants/jobs.js");

const jobSchema = mongoose.Schema({
  prompt: { type: String, required: true },
  status: {
    type: String,
    enum: [JOB_STATUS.PENDING, JOB_STATUS.COMPLETE, JOB_STATUS.FAILED],
    default: JOB_STATUS.PENDING,
  },
  result: {
    success: Boolean,
    output: String,
  },
  createdAt: { type: Date, default: Date.now },
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
