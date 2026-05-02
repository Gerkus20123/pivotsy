import axiosInstance from "../axios";
import { Job } from "../interfaces/job";
import { JobPaginationResponse } from "../interfaces/jobPaginationResponse";
import { JobStats } from "../interfaces/jobStats";


// Fetching all jobs (objects)
export const fetchJobs = async (
    category?: string | null, 
    subcategory?: string | null,
    page?: number
) : Promise<JobPaginationResponse> => {
    try {
        const queryParams = new URLSearchParams();

        if (category) queryParams.append('category', category);
        if (subcategory) queryParams.append('subcategory', subcategory);
        if (page) queryParams.append('page', page.toString());
        queryParams.append('per_page', '10');

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";
        const url = `${baseUrl}/jobs?${queryParams.toString()}`;

        const response = await fetch(url, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`A server error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Error fetching jobs:", error);
        throw error;
    }
};

// Fetching all jobs of a certain category or subcategory (objects)
export const fetchJobsCatSubCat = async (): Promise<JobStats> => {
    try {
        const response = await axiosInstance.get("/jobs/stats")
        console.log(response.data)
        return response.data
    } catch (error) {
        console.log("Error fetching jobs:", error);
        return { categories: {}, subcategories: {} };
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
export const fetchFollowedJobIds = async () : Promise<number[]> => {
    try {

        const userId = localStorage.getItem("userId");
        if (!userId) return [];

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";
        const url = `${baseUrl}/users/${userId}/followed_jobs`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        if (Array.isArray(data.items)) {
            return data.items.map((job: any) => job.id);
        }

        return [];

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
export const fetchFollowedJobs = async (page?: number):Promise<JobPaginationResponse> => {

        const emptyResponse: JobPaginationResponse = {
            items: [],
            total: 0,
            pages: 0,
            current_page: page || 1
        };

    try {
        const userId = localStorage.getItem("userId");
        if (!userId) return emptyResponse;

        const response = await axiosInstance.get(`/users/${userId}/followed_jobs`, {
            params: {
                page,
                per_page: 10
            }
        })

        console.log(response.data)
        return response.data
    } catch (error) {
        console.log("Error fetching followed jobs:", error)
        return emptyResponse;
    }
};

// Fetching current user data (objects)
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

// Fetching all user created jobs (objects)
export const fetchAllUserCreatedJobOffers = async (page?: number):Promise<JobPaginationResponse> => {

    const emptyResponse: JobPaginationResponse = {
        items: [],
        total: 0,
        pages: 0,
        current_page: page || 1
    };

    try {

        const userId = localStorage.getItem("userId");
        if (!userId) return emptyResponse;

        const response = await axiosInstance.get(`/users/${userId}/jobs`, {
            params: {
                page,
                per_page: 4
            } 
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching jobs of a user:", error);
        throw error;
    }
};