import axiosInstance from "./axiosInstance";
import endpoints from "src/constants/endpoints";

export async function processJobs(prompt: string) {
  if (!prompt) {
    throw new Error("Prompt is required");
  }

  try {
    const response = await axiosInstance.post(endpoints.jobs, { prompt });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message);
  }
}

export async function getJobById(jobId: string) {
  if (!jobId) {
    throw new Error("Job ID is required");
  }

  try {
    const response = await axiosInstance.get(`${endpoints.jobs}/${jobId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message);
  }
}
