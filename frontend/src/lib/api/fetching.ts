import axiosInstance from "../axios";
import { Job } from "../interfaces/job";

// Fetching all jobs (objects)
export const fetchJobs = async (): Promise<Job[]> => {
    try {
        const response = await axiosInstance.get("/jobs");
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.log("Error fetching jobs:", error);
        throw error
    }
};

// Fetching a job (object)
export const fetchJob = async (jobId: number): Promise<Job> => {
    try {
        const response = await axiosInstance.get(`/jobs/${jobId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching a job:", error);
        throw error;
    }
};

// Fetching ids of all followed jobs (numbers)
export const fetchFollowedJobIds = async (): Promise<number[]> => {
    try {

        // Loading userId from localStorage
        const userId = localStorage.getItem("userId");
        if (!userId) return [];

        const response = await axiosInstance.get(`/users/${userId}/followed_jobs`)

        return response.data.map((job: Job) => job.id);
    } catch (error) {
        console.log("Error fetching ids of followed jobs:", error)
        return [];
    }
};

// Fetching id of a job (number)
export const fetchFollowedJobId = async (jobId: number): Promise<number[]> => {
    try {

        const userId = localStorage.getItem("userId");
        if (!userId) return [];

        const response = await axiosInstance.get(`/users/${userId}/followed_jobs/${jobId}`)

        if (response.data && response.data.id === jobId) {
            return [jobId];
        }

        return [];
    } catch (error: any) {
        if (error.response?.status === 404) {
            return [];
        } else {
            console.log("Error fetching followed job status id:", error);
            return [];
        }
    }
};

// Fetching all followed jobs (objects)
export const fetchFollowedJobs = async ():Promise<Job[]> => {
    try {
        const userId = localStorage.getItem("userId");
        if (!userId) return [];

        const response = await axiosInstance.get(`/users/${userId}/followed_jobs`)

        console.log(response.data)
        return response.data
    } catch (error) {
        console.log("Error fetching followed jobs:", error)
        return [];
    }
};

// Fetching current user data ()
export const fetchingCurrentUserData = async ():Promise<any> => {
    try {
        const userId = localStorage.getItem("userId");
        if (!userId) return null;

        const response = await axiosInstance.get(`/users/${userId}`)

        console.log(response.data)
        return response.data
    } catch (error) {
        console.log("Error fetching current user:", error)
        return null;
    }
};
