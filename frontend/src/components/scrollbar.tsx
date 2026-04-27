'use client'
import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";

function CustomScroll({ 
    children,
    className,
    childrenType
} : {
    children: any,
    className?: string,
    childrenType: string
}) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [thumbTop, setThumbTop] = useState(0);
    const [thumbHeight, setThumbHeight] = useState(40);
    const isDragging = useRef(false);
    const startY = useRef(0);
    const startScrollTop = useRef(0);

    const handleScroll = () => {
        const el = containerRef.current;
        if (!el) return;

        const maxScroll = el.scrollHeight - el.clientHeight;

        if (maxScroll <= 0) {
            setThumbTop(0);
            return;
        }

        const ratio = el.scrollTop / maxScroll;

        const height = Math.max(
            (el.clientHeight / el.scrollHeight) * el.clientHeight,
            20
        );

        setThumbHeight(height);
        setThumbTop(ratio * (el.clientHeight - height));
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging.current) return;
      
        const el = containerRef.current;
        if (!el) return;
      
        const deltaY = e.clientY - startY.current;
      
        const maxScroll = el.scrollHeight - el.clientHeight;
        const trackHeight = el.clientHeight - thumbHeight;
      
        const scrollDelta = (deltaY / trackHeight) * maxScroll;
      
        el.scrollTop = startScrollTop.current + scrollDelta;
    };

    const handleMouseUp = () => {
        isDragging.current = false;
      
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        const el = containerRef.current;
        if (!el) return;
      
        isDragging.current = true;
        startY.current = e.clientY;
        startScrollTop.current = el.scrollTop;
      
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    return (
        <div className={`relative ${className ?? ""}`}>
        
            {/* content */}
            <div
                ref={containerRef}
                onScroll={handleScroll}
                className={cn("h-full overflow-y-scroll no-scrollbar", childrenType)}
            >
                {children}
            </div>

            {/* custom scrollbar */}
            <div className="absolute right-1 top-0 h-full w-2 bg-transparent cursor-pointer">
                <div
                    className="w-1 bg-gray-400 rounded-full absolute"
                    style={{
                        height: `${thumbHeight}px`,
                        transform: `translateY(${thumbTop}px)`
                    }}
                    onMouseDown={handleMouseDown}
                />
            </div>
            
        </div>
    );
}

export default CustomScroll;