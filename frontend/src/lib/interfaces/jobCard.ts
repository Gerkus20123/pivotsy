import { Job } from "./job";

export interface JobCardProps {
    jobs: Job[];
    followedJobs?: number[];
    onFollow?: (id: number) => void;
    isAccountPage?: boolean;
}