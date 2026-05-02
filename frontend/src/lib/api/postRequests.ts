import axiosInstance from "../axios";

// Toggle follow a job (object)
export const toggleFollowJob = async (jobId: number) => {
    const response = await axiosInstance.post(`/jobs/${jobId}/follow`)
    return response.data;
};

// Create a job (object)
export const createAJob = async (data: any) => {
    await axiosInstance.post("/jobs", data)
};

// Edit user data
export const editUserData = async (data: any) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return null;

    await axiosInstance.put(`/users/${userId}`, data)
};

// Delete a job of a user
export const deleteUserJob = async (jobId: number) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return null;

    await axiosInstance.delete(`/users/${userId}/jobs/${jobId}`)
};

// Edit a job of a user
export const editUserJob = async (jobId: any, formData: FormData) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return null;

    await axiosInstance.put(`users/${userId}/jobs/${jobId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })
};