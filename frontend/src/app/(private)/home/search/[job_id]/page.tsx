'use client'

import { Button } from '@/components/ui/button';
import JobOfferSkeleton from '@/components/ui/skeletons/jobOfferSkeleton';
import { use, useEffect, useState } from 'react'
import { HandCoins, MapPin, CalendarCheck, Bus, Handshake, Heart, Tag, BriefcaseBusiness, PhoneCall } from "lucide-react"
import { Job } from '@/lib/interfaces/job';
import { fetchJob, fetchFollowedJobId } from '@/lib/api/fetching';
import { toggleFollowJob } from '@/lib/api/postRequests';
import { JobCategoryOptions } from '../../../../../../constants/job_category_options';

 
interface PageProps {
    params: Promise<{ job_id: string }>; 
}

function JobOffer({ params }: PageProps) {

    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [followedJobs, setFollowedJobs] = useState<number[]>([]);
    const [isPhoneNumberShown, setIsPhoneNumberShown] = useState(false);
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
            <div className="min-h-screen flex flex-col gap-4 lg:p-5 md:p-5 p-1">

                {/* Job Background Image */}
                {job.background_image && (
                    <div className="relative w-full justify-center flex h-[100px] md:h-[450px] lg:h-[450px] overflow-hidden rounded-xl shadow-sm mb-10">
                        <img 
                            src={`${API_BASE_URL}${job.background_image}`}
                            alt='Job Background Image'
                            className='object-cover w-full lg:w-full lg:h-full md:h-120 h-40'
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
                    </div> 
                )}
                
                {/* Firm Logo & Created At & Title */}
                <div className='lg:flex items-center lg:justify-between'>

                    <div className='flex gap-4 mb-3 lg:mb-0 justify-between md:justify-start lg:justify-between items-center'>
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

                        {/* Created at & Job Offer Title */}   
                        <div>
                            <p className="lg:text-xl md:text-sm text-[10px] text-gray-500">
                                Created At: {new Date(job.created_at).toLocaleDateString('pl-PL')}
                            </p>
                            <p className="lg:text-xl md:text-xl text-xs font-bold w-full">{job.short_description}</p> 
                            <p className="lg:text-xl md:text-sm text-[10px]">{job.user?.company_name}</p>
                        </div>

                        {/* Follow a job */}
                        <div 
                            onClick={() => handleFollowed(job_id)}
                        >
                            {isFollowed ? (
                                <Heart className="cursor-pointer fill-red-500 text-red-500" size={20} />
                            ) : (
                                <Heart className="cursor-pointer" size={20} />
                            )}
                        </div>
                    </div>

                    {/* Call & Apply to Job section */}
                    <div className='flex gap-4 lg:w-full lg:max-w-xs'>
                        <Button
                            className="flex-1"
                            onClick={() => setIsPhoneNumberShown(isPhoneNumberShown ? false : true)}
                        >
                            {isPhoneNumberShown ? (
                                <div className='flex gap-2 items-center'>
                                    <PhoneCall />
                                    <p className='lg:text-sm md:text-sm text-[10px]'>{job.user?.phone_number}</p>
                                </div>
                                ) : "Call"
                            }
                        </Button> 
                        <Button
                            className="flex-1"
                        >
                            Apply 
                        </Button> 
                    </div>
                </div>

                <hr></hr>
                
                {/* Payment & Experience Requirements */}
                <div className='lg:flex justify-between'>
                    {/* Payment */}
                    <div className='bg-yellow-200 p-1 rounded-md font-bold text-yellow-800 flex items-center gap-2 lg:mb-0 mb-4'>
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
                <div className='lg:flex justify-between'>
                    {/* Agreement Type */}
                    <div className='bg-gray-200 p-1 rounded-md font-bold text-gray-500 flex items-center gap-2 lg:mb-0 mb-4'>
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
                <div className='lg:flex justify-between'>
                    {/* Location */}
                    <div className='bg-gray-200 p-1 rounded-md font-bold text-gray-500 flex items-center gap-2 lg:mb-0 mb-4'>
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
                <div className='lg:flex justify-between'>
                    {/* Category and Subcategory */}
                    <div className='bg-gray-200 p-1 rounded-md font-bold text-gray-500 flex items-center gap-2 lg:mb-0 mb-4'>
                        {(() => {

                            const categoryConfig = JobCategoryOptions.find(c => c.name === job.category);
                            const subcategoryConfig = categoryConfig?.subcategory?.find(sub => sub.name === job.subcategory)

                            const IconToRender = subcategoryConfig?.icon || categoryConfig?.icon;

                            return IconToRender ? (
                                <IconToRender 
                                    size={20} 
                                    className="text-gray-500" 
                                />
                            ) : null;
                        })()}
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
            </div> 
            
            <hr className='mb-5'></hr>
            
            {/* Seen By Count */}
            <div className='flex justify-center items-center gap-2'>
                <p> <strong>Seen:</strong></p>
                <p className='text-l'> 123 </p>
            </div>
        </div>
        
    )
}

export default JobOffer