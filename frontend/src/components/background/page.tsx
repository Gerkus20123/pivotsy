import { cn } from "@/lib/utils";

function BackGround ({
    className
} : { 
    className?: string
}) {
    return (
        <div>
            {/* WARSTWA 1: Kropki (Dot Background) */}
            <div
                className={cn(
                    "fixed inset-0 -z-1",
                    "bg-size-[20px_20px]",
                    "bg-[radial-gradient(#cfd1d4_1px,transparent_1px)]",
                    "dark:bg-[radial-gradient(#262626_1px,transparent_1px)]",
                    className
                  )}
            />

            {/* WARSTWA 2: Maska (Radial Gradient Overlay) */}
            <div 
                className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center bg-gray-200 
                mask-[radial-gradient(ellipse_at_center,transparent_50%,black)] dark:bg-black"
            />
        </div>
    )
}

export default BackGround; 