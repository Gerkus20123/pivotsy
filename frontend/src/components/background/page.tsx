import React from 'react'
import { cn } from "@/lib/utils";

function BackGround () {
    return (
        <div>
            {/* WARSTWA 1: Kropki (Dot Background) */}
            <div
                className={cn(
                    "absolute inset-0 z-1",
                    "[background-size:20px_20px]",
                    "[background-image:radial-gradient(#cfd1d4_1px,transparent_1px)]", // Light mode
                    "dark:[background-image:radial-gradient(#262626_1px,transparent_1px)]", // Dark mode
                )}
            />

            {/* WARSTWA 2: Maska (Radial Gradient Overlay) */}
            <div 
                className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center bg-gray-200 
                [mask-image:radial-gradient(ellipse_at_center,transparent_50%,black)] dark:bg-black"
            />
        </div>
    )
}

export default BackGround; 