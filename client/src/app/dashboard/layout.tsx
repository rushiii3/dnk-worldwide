"use client";

import { DashboardNavbar } from '@/src/components/layout/Navbar'
import SideNav from '@/src/components/dashboard/SideNav'
import React, { useState, useEffect } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window !== 'undefined') {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
      
      // Initial check
      checkMobile();
      
      // Add event listener for resize
      window.addEventListener('resize', checkMobile);
      
      // Cleanup
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <DashboardNavbar />
      <div className='flex flex-1 w-full'>
        {/* SideNav - visible only on desktop */}
        {!isMobile && (
          <div className='hidden md:block w-1/4 lg:w-1/5 p-4'>
            <SideNav />
          </div>
        )}
        
        {/* Main content area */}
        <div className={`flex-1 p-4 ${isMobile ? 'w-full' : 'md:w-3/4 lg:w-4/5'}`}>
          {children}
        </div>
      </div>
    </div>
  )
}