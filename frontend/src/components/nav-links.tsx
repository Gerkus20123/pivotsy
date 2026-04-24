"use client"

import React from 'react'

import Link from 'next/link';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NavLinksData } from '../../constants/navigation_data';

interface NavLinksProps {
    onLogout?: () => void;
    variant?: "desktop" | "mobile";
}

function NavLinks({ onLogout, variant }: NavLinksProps) {

    const pathname = usePathname();
    const isMobile = variant === "mobile";

    return (
        <>
            {NavLinksData.map((item) => {
                const isActive = pathname === item.link;
                const Icon = item.icon as React.ElementType;

                if (item.id === "logout") {
                    return (
                        <Button
                            key={item.id}
                            onClick={onLogout}
                            variant='default'
                            className = {isMobile
                            ? "w-full justify-center text-center"
                            : "whitespace-nowrap"}
                        >
                            <Icon size={18} />
                            {item.name}
                        </Button>
                    );
                }

                return (
                    <Link
                        href={item.link}
                        key={item.id}
                    >  
                        <Button
                            variant='outline'
                            className={cn(
                                isMobile
                                ? "w-full justify-center text-center"
                                : "whitespace-nowrap",
                                isActive && "bg-sky-100 text-blue-600 hover:bg-sky-200"
                            )}
                        >
                            <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                            {item.name}
                        </Button> 
                    </Link>
                )
            })}
        </>
    )
}

export default NavLinks;