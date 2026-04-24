import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_REST_API_URL || "http://127.0.0.1:5000";

const axiosInstance = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export const updateAccessToken = (accessToken: string) => {
  axiosInstance.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
};

export default axiosInstance;
