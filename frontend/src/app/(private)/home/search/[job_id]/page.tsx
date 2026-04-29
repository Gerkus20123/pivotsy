'use client'

import { Button } from '@/components/ui/button';
import JobOfferSkeleton from '@/components/ui/skeletons/jobOfferSkeleton';
import Image from 'next/image';
import React, { use, useEffect, useState } from 'react'
import { HandCoins, MapPin, CalendarCheck, Bus, Handshake, Heart, Tag, BriefcaseBusiness } from "lucide-react"
import { Job } from '@/lib/interfaces/job';
import { fetchJob, fetchFollowedJobId } from '@/lib/api/fetching';
import { toggleFollowJob } from '@/lib/api/postRequests';
 
interface PageProps {
    params: Promise<{ job_id: string }>; 
}

function JobOffer({ params }: PageProps) {

    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [followedJobs, setFollowedJobs] = useState<number[]>([]);
    const resolvedParams = use(params);
    const job_id = Number(resolvedParams.job_id);
    const isFollowed = followedJobs.includes(job_id);

    const API_BASE_URL = "http://127.0.0.1:5000";

    const handleFollowed = async (jobId: number) => {
        try {

            const postRequest = await toggleFollowJob(jobId)

            setFollowedJobs(prev =>
                prev.includes(jobId)
                    ? prev.filter(id => id !== jobId)
                    : [...prev, jobId]
            );

            console.log(postRequest.message); 
        } catch (error: any) {
            console.error("An error occured while trying to follow the job:", error);
            alert("You must be logged in to follow the job!");
        }
    };

    const loadData = async () => {
        try {
            setLoading(true);
            
            const [gotJob, followedIds] = await Promise.all([
                fetchJob(job_id),
                fetchFollowedJobId(job_id)
            ]);

            setJob(gotJob);
            setFollowedJobs(followedIds);
        } catch (error) {
            console.error("Błąd podczas ładowania danych:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (job_id) {
            loadData();
        }
    }, [job_id])

    if (loading) return <JobOfferSkeleton />;
    if (!job) return <p>Offer not found.</p>;
    
    return (
        <div>
            <div className="min-h-screen flex flex-col gap-4 p-5">

                {/* Job Background Image */}
                <div className="relative w-full h-[300px] md:h-[450px] overflow-hidden rounded-xl shadow-sm mb-10">
                    <img 
                        src={`${API_BASE_URL}${job.background_image}`}
                        alt='Job Background Image'
                        width={1400}
                        height={100}
                        className='object-cover'
                        sizes="(max-width: 768px) 100vw, 800px"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
                </div>

                {/* Firm Logo & Created At & Title */}
                <div className='flex gap-4 items-center'>

                    {/* Firm Logo */}
                    {job.logo && (
                    <img 
                            src={`${API_BASE_URL}${job.logo}`}
                            width={50}
                            height={50}
                            alt='Job Image'
                            className='rounded-md'
                        />   
                    )}
                                    
                    <div>
                        {/* Created at */}
                        <div>
                            <p className="text-sm text-gray-500">
                                Created At: {new Date(job.created_at).toLocaleDateString('pl-PL')}
                            </p>
                        </div>

                        {/* Job Offer Title */}
                        <div className="text-xl font-bold w-full">
                            <p>{job.short_description}</p>
                        </div>
                    </div>  

                    {/* Follow a job */}
                    <div 
                        className='flex justify-end'
                        onClick={() => handleFollowed(job_id)}
                    >
                        {isFollowed ? (
                            <Heart className="cursor-pointer fill-red-500 text-red-500" size={20} />
                        ) : (
                            <Heart className="cursor-pointer" size={20} />
                        )}
                    </div>
                </div>

                <hr></hr>
                
                {/* Payment & Schedule */}
                <div className='flex justify-between'>
                    {/* Payment */}
                    <div className='bg-yellow-200 p-1 rounded-md font-bold text-yellow-800 flex items-center gap-2'>
                        <HandCoins />
                        <div>               
                            <div className='flex gap-1'>
                                <p className='text-xl'>{job.payment}</p> 
                                <p className='text-md'>{job.currency}</p>
                            </div>
                        </div>
                    </div>

                    {/* Experience Requirements */}
                    <div className='flex bg-green-200 p-1 px-2 rounded-md font-bold text-green-700 items-center'>
                        <p className='text-md'>{job.experience_requirement}</p>
                    </div> 
                </div>
                
                {/* Agreement Type & Experience Requirements */}
                <div className='flex justify-between'>
                    {/* Agreement Type */}
                    <div className='bg-gray-200 p-1 rounded-md font-bold text-gray-500 flex items-center gap-2'>
                        <Handshake />
                        <p className='text-md'>{job.agreement_type}</p> 
                    </div>

                    {/* Schedule */}
                    <div className='bg-gray-200 p-1 rounded-md font-bold text-gray-500 flex items-center gap-2'>
                        <CalendarCheck />
                        <div>
                            <p className='text-md'>{job.schedule}</p>
                        </div>         
                    </div>
                </div>
                
                {/* Location & Transport Availability */}
                <div className='flex justify-between'>
                    {/* Location */}
                    <div className='bg-gray-200 p-1 rounded-md font-bold text-gray-500 flex items-center gap-2'>
                        <MapPin />
                        <p className='text-md'>{job.location}</p>
                    </div>

                    {/* Transport Availability */}
                    <div className='bg-gray-200 p-1 rounded-md font-bold text-gray-500 flex items-center gap-2'>
                        <Bus />
                        <p className='text-md'>{job.transport_availability}</p>
                    </div>
                </div>
                
                {/* Category and Subcategory & Type of Work */}
                <div className='flex justify-between'>
                    {/* Category and Subcategory */}
                    <div className='bg-gray-200 p-1 rounded-md font-bold text-gray-500 flex items-center gap-2'>
                        <Tag />
                        {job.subcategory ? (
                            <p className='text-md'>{job.category} {'>'} {job.subcategory}</p>
                        ) : (
                            <p className='text-md'>{job.category}</p>
                        )}
                    </div>

                    <div className='bg-gray-200 p-1 rounded-md font-bold text-gray-500 flex items-center gap-2'>
                        <BriefcaseBusiness />

                        {/* Type of work*/}
                        {job.type_of_work && (
                            <p className='text-md'>{job.type_of_work}</p>
                        )}
                    </div>
                </div>

                <hr></hr>

                {/* Long Description */}
                <div className="space-y-5 text-lg">
                    <p className='text-lg font-bold'>Description</p>
                    <div 
                        className="prose prose-lg max-w-none 
                        [&_ul]:list-disc 
                        [&_ul]:ml-10
                        [&_ul]:my-2
                        [&_strong]:font-bold 
                        [&_p]:text-sm
                        [&_p]:my-2
                        "
                        dangerouslySetInnerHTML={{ __html: job.long_description || "" }} 
                    />
                </div>
                
                {/* Additional Requirements */}
                {job.additional_requirements && (
                    <div className="space-y-2 text-lg">
                        <p className='text-lg font-bold'>Additional Requirements</p>
                        <p>{job.additional_requirements}</p>
                    </div>
                )}
                
                {/* Job Offer Author Information */}
                <div>
                    <p className='text-lg font-bold'>Author</p>
                    <p className='text-lg mb-2'>{job.user?.name}</p>

                    <p className='text-lg font-bold'>Phone Number</p>
                    <p className='text-lg mb-2'>{job.user?.phone_number}</p>

                    <p className='text-lg font-bold'>Company Name</p>
                    <p className='text-lg mb-2'>{job.user?.company_name}</p>
                </div>

                <hr></hr>

                <Button
                    className="mb-4"
                >
                    Apply 
                </Button>
            </div> 

            {/* Seen By Count */}
            <div className='flex justify-center items-center gap-2'>
                <p>Seen: </p>
                <p className='text-l'> 123 </p>
            </div>
        </div>
        
    )
}

export default JobOffer