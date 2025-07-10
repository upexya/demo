import axiosInstance from "./axiosInstance";
import endpoints from "src/constants/endpoints";

export async function getUsers() {
  try {
    const response = await axiosInstance.get(endpoints.user + "?q=user1");
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message);
  }
}
