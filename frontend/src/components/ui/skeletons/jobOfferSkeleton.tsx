import { JobOfferSkeletonProps } from "@/lib/interfaces/skeletons/jobOfferSkeleton";


function JobOfferSkeleton({ hasImage }: JobOfferSkeletonProps) {
    return (
      <div className="flex flex-col gap-4 p-10 animate-pulse">
        
        {/* Date Skeleton */}
        <div>
            <p className="h-6 w-1/8 bg-slate-300 rounded-md"></p>
        </div>

        {/* Image Skeleton */}
        {hasImage &&
          <div className="w-[350px] h-[250px] bg-slate-300 rounded-md"></div>
        }
        
        <div className="text-xl font-bold w-full flex justify-between">
            {/* Title Skeleton (short description) */}
            <div className="h-6 bg-slate-300 rounded w-1/2"></div>

            {/* Follow Skeleton */}
            <div className="h-6 bg-slate-300 rounded w-1/15"></div>
        </div>
        
        <hr></hr>

        <div className='flex justify-between'>

          {/* Payment Skeleton */}
          <div className='h-6 p-1 bg-slate-300 rounded w-20'></div>

          {/* Schedule Skeleton */}
          <div className='h-6 p-1 bg-slate-300 rounded w-20'></div>
        </div>

        <div className='flex justify-between'>

          {/* Agreement Type Skeleton */}
          <div className='h-6 p-1 bg-slate-300 rounded w-20'></div>

          {/* Experience Requirements Skeleton */}
          <div className='h-6 p-1 bg-slate-300 rounded w-20'></div>
        </div>

        <div className='flex justify-between'>

          {/* Location Skeleton */}
          <div className='h-6 p-1 bg-slate-300 rounded w-20'></div>

          {/* Transport availability Skeleton */}
          <div className='h-6 p-1 bg-slate-300 rounded w-20'></div>
        </div>

        <hr></hr>

        {/* Skeleton dla długiego opisu (kilka linii) */}
        <div className="space-y-2">
          <div className="h-6 bg-slate-200 rounded w-1/7"></div>
          <div className="h-6 bg-slate-200 rounded w-5/6"></div>
          <div className="h-6 bg-slate-200 rounded w-4/6"></div>
        </div>
        
        <hr></hr>

      </div>
    );
}

export default JobOfferSkeleton;