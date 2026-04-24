import BackGround from '@/components/background/page';
import NavBar from '@/components/nav-bar';
import { Card } from '@/components/ui/card';
import React from 'react'
import { ReactNode } from 'react'; 

function Layout({
    children 
} : { 
    children: ReactNode 
}) {
  return (
    <div className="min-h-screen overflow-hidden flex flex-col relative">
        <BackGround />

        <div className='p-10 flex flex-col h-full lg:mt-5'>   
          <div className='flex items-center justify-center'>
            <NavBar /> 
          </div>
          
          <Card 
              className="relative flex flex-col z-1 lg:mt-20 mt-20 bg-white backdrop-blur-sm shadow-2xl border-none h-auto
                  rounded-3xl p-15 lg:p-15 w-full shrink-0 transition-all duration-500"
          > 
              <div className="flex-1 min-h-0">
                {children} 
              </div>
          </Card>
          
        </div>
              
    </div>
  )
}

export default Layout;