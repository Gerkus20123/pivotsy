'use client'

import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react'
import axiosInstance from '@/lib/axios';
import { fetchFollowedJobIds, fetchJobs } from '@/lib/api/fetching';
import { Job } from '@/lib/interfaces/job';
import JobCard from '@/components/job-card';

function SearchOffers() {

    const [jobs, setJobs] = useState<Job[]>([]);
    const [followedJobs, setFollowedJobs] = useState<number[]>([]);

    const handleFollowed = async (jobId: number) => {
        try {

            const response = await axiosInstance.post(`/jobs/${jobId}/follow`)

            setFollowedJobs(prev =>
                prev.includes(jobId)
                    ? prev.filter(id => id !== jobId)
                    : [...prev, jobId]
            );

            console.log(response.data.message); 
        } catch (error) {
            console.error("Błąd podczas obserwowania oferty:", error);
            alert("Musisz być zalogowany, aby obserwować oferty!");
        }
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const [jobsData, followedIds] = await Promise.all([
                    fetchJobs(),
                    fetchFollowedJobIds()
                ]);
                setJobs(jobsData);
                setFollowedJobs(followedIds);
            } catch (error) {
                console.error("Błąd podczas ładowania danych:", error);
                alert("Błąd podczas ładowania danych");
            }
        };

        loadData();
    }, [])

    return (
        <div className='min-h-screen'>
            {/* Page Title */}
            <h1 className="text-3xl font-bold mb-8">Offers</h1>
            
            <hr></hr>
            
            {/* Job Offers */}
            <JobCard 
                jobs={jobs} 
                followedJobs={followedJobs} 
                onFollow={handleFollowed}
            />

            {/* Pagination */}
            <div className='flex items-center justify-center gap-5 mt-10'>
                <Button
                    variant="outline"
                >
                    <ArrowLeft />
                </Button>
                <p className='font-bold text-lg'> Page 1</p>
                <Button
                    variant="default"
                >
                    <ArrowRight />
                </Button>
            </div>
        </div>
    )
}

export default SearchOffers;