'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react';
import { toggleFollowJob } from '@/lib/api/postRequests';
import { toast } from 'sonner';


function FollowButton({ 
    jobId, 
    initialIsFollowed, 
} : {
    jobId: number;
    initialIsFollowed: boolean;
}) {

    const [isFollowed, setIsFollowed] = useState(initialIsFollowed);
    
    const handleClick = async () => {
        const previousState = isFollowed;
        setIsFollowed(!previousState);

        try {
            await toggleFollowJob(jobId);
            toast.success(!isFollowed ? ("Job has been pivoted.") : ("Job has been unpivoted."));
        } catch (error) {
            setIsFollowed(previousState);
            toast.error("You must be logged in to follow a job!");
            console.error("An error occurred while following the job:", error);
        }
    };

    useEffect(() => {
        setIsFollowed(initialIsFollowed);
    }, [initialIsFollowed]);

    return (
        <div onClick={handleClick}>
            <Heart 
                className={isFollowed ? "cursor-pointer fill-red-500 text-red-500" : "cursor-pointer"} 
                size={20} 
            />
        </div>
    )
}

export default FollowButton;