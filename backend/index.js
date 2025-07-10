const express = require("express");

require("dotenv").config();

const port = process.env.PORT || 3001;

// connect to database
const connectDb = require("./app/config/db");
connectDb();

// create express app
const app = express();

const cors = require("cors");
app.use(
  cors({
    credentials: true,
    origin: [process.env.FRONTEND_URL],
  })
);

app.use(express.json());

// import routes
const job_router = require("./app/routes/job.routes");

const { jobs_routes } = require("./app/constants/routes");

// use routes
app.use(jobs_routes.JOBS, job_router);

app.get("/", (req, res) => {
  res.status(200).json({ [port]: port });
});

// error handling middleware
const { errorHandler, notFound } = require("./app/middleware/error.middleware");
app.use(notFound);
app.use(errorHandler);

// listen for server requests
app.listen(port, () => {
  console.log("Server is listening on port ", port);
});
