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
        <div className="min-h-screen flex flex-col gap-4 p-10">

            {/* Image */}
            <Image 
                src="/default-job-image.png"
                width={350}
                height={250}
                alt='Job BackGround Image'
                className='rounded-md'
            /> 

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

            <div className='flex gap-4 items-center'>

                {/* Firm Logo */}
                {job.job_logo && (
                  <Image 
                        src={job.job_logo}
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
            </div>

            <hr></hr>

            <div className='flex justify-between'>
                {/* Payment */}
                <div className='bg-gray-200 p-1 rounded-md font-bold text-gray-500 flex items-center gap-2'>
                    <HandCoins />
                    <div>               
                        <div className='flex gap-1'>
                            <p className='text-md'>{job.payment}</p> 
                            <p className='text-md'>{job.currency}</p>
                        </div>
                    </div>
                </div>

                {/* Schedule */}
                <div className='bg-gray-200 p-1 rounded-md font-bold text-gray-500 flex items-center gap-2'>
                    <CalendarCheck />
                    <div>
                        <p className='text-md'>{job.schedule}</p>
                    </div>         
                </div>

            </div>
            
            <div className='flex justify-between'>
                {/* Agreement Type */}
                <div className='bg-gray-200 p-1 rounded-md font-bold text-gray-500 flex items-center gap-2'>
                    <Handshake />
                    <p className='text-md'>{job.agreement_type}</p> 
                </div>

                {/* Experience Requirements */}
                <div className='flex bg-green-200 p-1 px-2 rounded-md font-bold text-green-700 items-center'>
                    <p className='text-md'>{job.experience_requirement}</p>
                </div> 
            </div>
            
            <div className='flex justify-between'>
                {/* Location */}
                <div className="flex gap-2 font-bold items-center">
                    <MapPin />
                    <p className='text-md'>{job.location}</p>
                </div>

                {/* Transport availability */}
                <div className='bg-gray-200 p-1 rounded-md font-bold text-gray-500 flex items-center gap-2'>
                    <Bus />
                    <p className='text-md'>{job.transport_availability}</p>
                </div>
            </div>

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
            <div className="space-y-2 text-lg">
                <p className='text-lg font-bold'>Description</p>
                <p>{job.long_description}</p>
            </div>
            
            {/* Additional Requirements */}
            {job.additional_requirements && (
                <div className="space-y-2 text-lg">
                    <p className='text-lg font-bold'>Additional Requirements</p>
                    <p>{job.additional_requirements}</p>
                </div>
            )}

            <hr></hr>

            <Button>
                Apply
            </Button>
        </div>
    )
}

export default JobOffer