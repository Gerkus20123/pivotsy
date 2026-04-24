'use client'

import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import { MapPin, CalendarCheck, Bus, Handshake, Heart } from "lucide-react"
import { Job } from '@/lib/interfaces/job';
import { fetchFollowedJobs } from '@/lib/api/fetching';
import { toggleFollowJob } from '@/lib/api/postRequests';

function Followed() {

    const [followedJobs, setFollowedJobs] = useState<Job[]>([]);
    const [follow, setFollow] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);

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
            const data = await fetchFollowedJobs();
            setFollowedJobs(data)
        } catch (error) {
            console.error("Błąd podczas ładowania danych:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [])

    if (loading) return <p>Loading ...</p>
    if (followedJobs.length === 0) return (
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

    return (
        <div className='min-h-screen'>
            {/* Page Title */}
            <h1 className="text-3xl font-bold mb-8">Followed Jobs</h1>
            
            <hr></hr>

            {/* Job Offers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-10">
                {followedJobs.map((job) => {

                    const isFollowed = true;    

                    return (
                        <div 
                            key={job.id} 
                            className="p-4 bg-slate-100 rounded-xl flex flex-col gap-2"
                        >
                            {/* Job Title, Payment & Follow */}
                            <div className='flex justify-between'>
                                <Link 
                                    href={`/home/search/${job.id}`}
                                    className='font-bold text-lg hover:text-blue-600 transition-colors cursor-pointer'
                                >
                                    <p>{job.short_description}</p>
                                    <div className="flex gap-1 text-lg font-bold">
                                        <p>{job.payment || ""}</p>
                                        <p>{job.currency || ""}</p>
                                    </div>
                                </Link>
                                
                                <div onClick={() => handleFollowed(job.id)}>
                                    {isFollowed ? (
                                        <Heart className="cursor-pointer fill-red-500 text-red-500" size={20} />
                                    ) : (
                                        <Heart className="cursor-pointer" size={20} />
                                    )}
                                </div>
                                
                            </div>

                            <hr className='my-1'></hr>

                            {/* Agreement Type & Transport Availability */}
                            <div className='flex justify-between items-center'>
                                <div className='bg-gray-200 p-1 rounded-md font-bold text-gray-500 flex items-center gap-2'>
                                    <Handshake 
                                        size={20}
                                    />
                                    {job.agreement_type}
                                </div> 
                                <div className='bg-gray-200 p-1 rounded-md font-bold text-gray-500 flex items-center gap-2'>
                                    <Bus 
                                        size={20}
                                    />
                                    {job.transport_availability}
                                </div> 
                            </div>

                            {/* Schedule & Location */}
                            <div className='flex justify-between items-center'>
                                <div className='bg-gray-200 p-1 rounded-md font-bold text-gray-500 flex items-center gap-2'>
                                    <CalendarCheck 
                                        size={20}
                                    />
                                    {job.schedule}
                                </div> 

                                <div className='bg-gray-200 p-1 rounded-md font-bold text-gray-500 flex items-center gap-2'>
                                    <MapPin 
                                        size={20}
                                    />
                                    <p>{job.location}</p>
                                </div>
                            </div>

                            <hr className='my-1'></hr>

                            {/* Date & Experience Requirements */}
                            <div className='flex justify-between items-center p-1'>
                                <p>Dodano: {new Date(job.created_at).toLocaleDateString('pl-PL')}</p>
                                
                                <div className='bg-green-200 p-1 px-2 rounded-md font-bold text-green-700'>
                                    {job.experience_requirement}
                                </div> 
                            </div>
                        </div>
                )})}
            </div>

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

export default Followed;