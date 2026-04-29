import { Job } from "./job";

export interface JobPaginationResponse {
    items: Job[];
    total: number;
    pages: number;
    current_page: number;
}