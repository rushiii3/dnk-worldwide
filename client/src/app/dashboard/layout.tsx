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
    if (typeof window !== 'undefined') {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 overflow-y-auto">
      <DashboardNavbar />

      {/* Centered container for dashboard */}
      <div className="flex justify-center w-full lg:px-4">
        <div className="flex w-full justify-center ">
          {/* SideNav - hidden on mobile */}
          {!isMobile && (
            <div className="hidden md:block lg:w-[300px] p-4">
              <SideNav />
            </div>
          )}

          {/* Main content */}
          <div className="flex flex-col mt-6 w-full lg:max-w-[600px] min-h-[calc(100vh-100px)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
