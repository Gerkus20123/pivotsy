"use client"

import React from 'react'
import { Card } from './ui/card';
import NavLinks from './nav-links';
import { useAuth } from '@/hooks/auth';
import { useRouter } from 'next/navigation';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { Menu } from 'lucide-react';
import Image from 'next/image';
import LightDarkSystemLinks from './lightDarkSystemMode-links';

function NavBar() {

    const auth = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await auth.signout(() =>
                router.replace('/')
            );
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Card 
            className="fixed z-2 top-5 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md shadow-2xl h-auto
            rounded-3xl p-4 lg:p-5 flex items-center flex flex-row transition-all duration-500 w-[95%] max-w-6xl"
        >
            <div className='flex items-center w-full'>
                {/* Logo */}
                <div className='flex items-center justify-start flex-1'>
                    <Image
                        src="/pivotsy-icon.png"
                        width={35}
                        height={35}
                        alt='App image'
                    />
                </div>

                {/* --- DESKTOP --- */}
                <div className='hidden lg:flex items-center justify-center flex-1 gap-2'>
                    <NavLinks
                        variant='desktop' 
                        onLogout={handleLogout}
                    /> 
                </div>
                    
                {/* 3. PRAWA STRONA: Theme Switcher i Mobile Menu */}
                <div className="flex items-center justify-end lg:flex-1 gap-4">
                        
                        {/* Theme Switcher */}
                        <div className='lg:flex gap-2 bg-gray-100 p-1 rounded-2xl'>
                            <LightDarkSystemLinks />   
                        </div>

                        {/* Mobile Trigger - widoczny tylko na Mobile */}
                        <div className='lg:hidden'>
                            <Sheet>
                                <SheetTrigger className='hover:bg-gray-200 rounded-md p-1 cursor-pointer'>
                                    <Menu size={28} />
                                </SheetTrigger>
                                <SheetContent side="top" className="mt-24 mx-5 rounded-xl p-5">
                                    <div className="flex flex-col gap-3 p-2 w-full max-w-2xl mx-auto">
                                        <NavLinks 
                                            variant='mobile'
                                            onLogout={handleLogout} 
                                        />
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                </div>
            </div>
        </Card>
    )
}

export default NavBar;