import axiosInstance from "../axios";

// Toggle follow a job (object)
export const toggleFollowJob = async (jobId: number) => {
    const response = await axiosInstance.post(`/jobs/${jobId}/follow`)
    return response.data;
}

// Create a job (object)
export const createAJob = async (data: any) => {
    await axiosInstance.post("/jobs", data)
};

// Edit user data
export const editUserData = async (data: any) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return null;

    await axiosInstance.put(`/users/${userId}`, data)
}