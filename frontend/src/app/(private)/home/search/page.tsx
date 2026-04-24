'use client'

import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import axiosInstance from '@/lib/axios';
import Link from 'next/link';
import { MapPin, CalendarCheck, Bus, Handshake, Heart } from "lucide-react"
import { fetchFollowedJobIds, fetchJobs } from '@/lib/api/fetching';
import { Job } from '@/lib/interfaces/job';

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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-10">
                {jobs.map((job, index) => {

                    const isFollowed = followedJobs.includes(job.id);

                    return (
                        <div 
                            key={index} 
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

export default SearchOffers;