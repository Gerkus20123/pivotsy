'use client'

import { JobCardProps } from '@/lib/interfaces/jobCard';
import { Bus, CalendarCheck, Handshake, MapPinIcon } from 'lucide-react';
import Link from 'next/link';
import { JobCategoryOptions } from '../../constants/job_category_options';
import { cn } from '@/lib/utils';
import FollowButton from './subcomponets/followButton';
import { useEffect, useState } from 'react';
import { fetchFollowedJobIds } from '@/lib/api/fetching';
import { Button } from './ui/button';
import { deleteUserJob } from '@/lib/api/postRequests';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import DeleteAlert from './alerts/deleteAlert';


function JobCard({ 
    jobs,
    isAccountPage
}: JobCardProps) {

    const API_BASE_URL = "http://127.0.0.1:5000";

    const [localFollowedIds, setLocalFollowedIds] = useState<number[]>([]);
    const [displayJobs, setDisplayJobs] = useState(jobs);
    const router = useRouter()

    useEffect(() => {
        const loadFollowed = async () => {
            try {
                const ids = await fetchFollowedJobIds();
                setLocalFollowedIds(ids);
            } catch (error) {
                console.error("Failed to fetch followed jobs on client:", error);
            }
        };
        loadFollowed();
    }, []);

    const handleDeleteJob = async (id: number) => {
        try {
            await deleteUserJob(id);
            toast.success("Job has been deleted successfully!");
            setDisplayJobs(prev => prev.filter(j => j.id !== id));
        } catch (error) {
            toast.error("Failed to delete a job")
        }
    };

    const handleEditJob = (id: number) => {
        router.push(`/home/account/${id}?editingMode=true`)
    };

    useEffect(() => {
        setDisplayJobs(jobs)
    }, [jobs])

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-10">
                {displayJobs.map((job, index) => {

                    const isFollowed = localFollowedIds?.includes(job.id);
                    const jobLogoImage = job.logo ? (`${API_BASE_URL}${job.logo}`) : "/default-job-image.png"

                    return (
                        <div 
                            key={index} 
                            className="p-4 bg-slate-100 rounded-xl flex flex-col gap-2"
                        >
                            {/* Job Title, Payment & Follow */}
                            <div className='flex justify-between items-center'>
                                
                                {/* Firm Logo */}
                                <div className='flex gap-4'>
                                    {job.logo && (
                                        <img 
                                            src={jobLogoImage}
                                            alt='Job Image'
                                            className='rounded-md w-10 h-10 lg:w-15 lg:h-15'
                                        />   
                                    )}
                                     
                                    <Link 
                                        href={!isAccountPage? (`/home/search/${job.id}`) : (`/home/account/${job.id}`)}
                                        className='font-bold hover:text-blue-600 transition-colors cursor-pointer justify-center flex flex-col'
                                    >
                                        <p className='lg:text-sm text-xs'>{job.short_description}</p>
                                        <div className="flex gap-1 font-bold">
                                            <p className='lg:text-xl text-xs'>{job.payment || ""}</p>
                                            <p className='lg:text-sm text-[10px]'>{job.currency || ""}</p>
                                        </div>
                                    </Link> 
                                </div>
                                
                                {!isAccountPage ? (
                                    <FollowButton 
                                        jobId={job.id} 
                                        initialIsFollowed={isFollowed ?? false}
                                    />   
                                ) : (
                                    <div className='flex gap-1'>
                                        <Button
                                            onClick={() => handleEditJob(job.id)}
                                        >
                                            Edit
                                        </Button>
                                        <DeleteAlert 
                                            itemToDelete='job'
                                            onClick={() => handleDeleteJob(job.id)}
                                        />
                                    </div>
                                )}
                                           
                            </div>

                            <hr className='my-1'></hr>

                            {/* Agreement Type & Transport Availability */}
                            <div className='flex lg:justify-between lg:items-center flex-col lg:flex-row gap-2'>
                                <div className='bg-gray-200 p-1 rounded-md font-bold text-gray-500 flex items-center gap-2'>
                                    <Handshake 
                                        size={20}
                                    />
                                    <p className='lg:text-[10px] text-[8px]'>{job.agreement_type}</p>
                                </div> 
                                <div className='bg-gray-200 p-1 rounded-md font-bold text-gray-500 flex items-center gap-2'>
                                    <Bus 
                                        size={20}
                                    />
                                    <p className='lg:text-[10px] text-[8px]'>{job.transport_availability}</p>
                                </div> 
                            </div>

                            {/* Schedule & Location */}
                            <div className='flex lg:justify-between lg:items-center flex-col lg:flex-row gap-2'>
                                <div className='bg-gray-200 p-1 rounded-md font-bold text-gray-500 flex items-center gap-2'>
                                    <CalendarCheck 
                                        size={20}
                                    />
                                    <p className='lg:text-[10px] text-[8px]'>{job.schedule}</p>
                                </div> 
                                
                                {job.location && (
                                   <div className='bg-gray-200 p-1 rounded-md font-bold text-gray-500 flex items-center gap-2'>
                                        <MapPinIcon 
                                            size={20}
                                        />
                                        <p className='lg:text-[10px] text-[8px]'>{job.location}</p>
                                    </div> 
                                )}
                                
                            </div>
                            
                            {/* Job Category */}
                            <div 
                                className={cn("bg-gray-200 p-1 rounded-md font-bold", 
                                              "text-gray-500 flex items-center gap-2",
                                              (job.category && !job.subcategory) ? ("lg:w-1/4 w-full") : ("lg:w-1/2 w-full")
                                           )}
                            >
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
                                    <p className='lg:text-[10px] text-[8px]'>{job.category} {">"} {job.subcategory}</p>
                                ) : (
                                    <p className='lg:text-[10px] text-[8px]'>{job.category}</p>
                                )}
                                
                            </div>

                            <hr className='my-1'></hr>

                            {/* Date & Experience Requirements */}
                            <div className='flex lg:justify-between md:justify-between items-center lg:items-center md:flex-row flex-col lg:flex-row gap-2 p-1'>
                                <p> <strong>Added:</strong> {new Date(job.created_at).toLocaleDateString('pl-PL')}</p>
                                
                                <div className='bg-green-200 p-0.5 px-2 rounded-md font-bold text-green-700 text-center'>
                                    {job.experience_requirement}
                                </div> 
                            </div>
                        </div>
                )})}
            </div>
    )
}

export default JobCard;