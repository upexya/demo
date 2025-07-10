const express = require("express");
const router = express.Router();

const { root } = require("../constants/routes");
const job_controller = require("../controller/job.controller");

router.post(root, job_controller.processJob);

router.get(`${root}:id`, job_controller.getJobById);

module.exports = router;
