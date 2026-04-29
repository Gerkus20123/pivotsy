'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link';
import { Job } from '@/lib/interfaces/job';
import { fetchFollowedJobs } from '@/lib/api/fetching';
import { toggleFollowJob } from '@/lib/api/postRequests';
import JobCard from '@/components/job-card';
import Pagination from '@/components/pagination';

function Followed() {

    const [followedJobs, setFollowedJobs] = useState<Job[]>([]);
    const [follow, setFollow] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const handleFollowed = async (jobId: number) => {
        try {

            const postRequest = await toggleFollowJob(jobId);

            setFollowedJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));

            setFollow(prev => prev.filter(id => id !== jobId));

            console.log(postRequest.message); 
        } catch (error) {
            console.error("An error occured while trying to follow the job:", error);
        }
    };

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await fetchFollowedJobs(currentPage);

            setFollowedJobs(data.items);
            setTotalPages(data.pages);
        } catch (error) {
            console.error("An error occured while the loading the followed jobs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [currentPage])

    if (loading) return <p>Loading ...</p>
    if (!followedJobs || followedJobs.length === 0) return (
        <div className='min-h-screen'>
           {/* Page Title */}
            <h1 className="text-3xl font-bold mb-8">Followed Jobs</h1> 

            <hr></hr>

            <div className="flex flex-col items-center justify-center gap-5 mt-10">            
                <h1 className="text-2xl font-bold text-gray-500">You do not have followed jobs yet.</h1>
                <Link href="/home/search" className="text-blue-500 hover:underline mt-4">
                    Browse available jobs
                </Link>
            </div>
        </div>
    );

    const followedIds = followedJobs.map(j => j.id);

    return (
        <div className='min-h-screen'>
            {/* Page Title */}
            <h1 className="text-3xl font-bold mb-8">Followed Jobs</h1>
            
            <hr></hr>

            {/* Job Offers */}
            <JobCard 
                jobs={followedJobs} 
                followedJobs={followedIds} 
                onFollow={handleFollowed}
            />

            {/* Pagination */}
            <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(newPage: number) => setCurrentPage(newPage)}
            />
        </div>
    )
}

export default Followed;