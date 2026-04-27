import { JobCardProps } from '@/lib/interfaces/jobCard';
import { Bus, CalendarCheck, Handshake, Heart, MapPinIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

function JobCard({ jobs, followedJobs = [], onFollow }: JobCardProps) {

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-10">
                {jobs.map((job, index) => {

                    const isFollowed = followedJobs?.includes(job.id);

                    return (
                        <div 
                            key={index} 
                            className="p-4 bg-slate-100 rounded-xl flex flex-col gap-2"
                        >
                            {/* Job Title, Payment & Follow */}
                            <div className='flex justify-between items-center'>
                                
                                {/* Firm Logo */}
                                <div className='flex gap-4'>
                                    <Image 
                                        src={"/default-job-image.png"}
                                        width={60}
                                        height={50}
                                        alt='Job Image'
                                        className='rounded-md'
                                    />  

                                    <Link 
                                        href={`/home/search/${job.id}`}
                                        className='font-bold text-lg hover:text-blue-600 transition-colors cursor-pointer justify-center flex flex-col'
                                    >
                                        <p>{job.short_description}</p>
                                        <div className="flex gap-1 text-lg font-bold">
                                            <p className='text-xl'>{job.payment || ""}</p>
                                            <p className='text-sm'>{job.currency || ""}</p>
                                        </div>
                                    </Link> 
                                </div>
                                
                                {onFollow && (
                                    <div 
                                        onClick={() => onFollow(job.id)}
                                    >
                                        {isFollowed ? (
                                            <Heart className="cursor-pointer fill-red-500 text-red-500" size={20} />
                                        ) : (
                                            <Heart className="cursor-pointer" size={20} />
                                        )}
                                    </div>   
                                )}
                                    
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
                                    <MapPinIcon 
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
    )
}

export default JobCard;