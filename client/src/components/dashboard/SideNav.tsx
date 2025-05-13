"use client";

import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const SideNav = () => {
  const pathname = usePathname();
  
  const navItems = [
    { name: 'Profile', path: '/dashboard/profile' },
    { name: 'Orders', path: '/dashboard/order' },
    { name: 'Saved Addresses', path: '/dashboard/savedAddress' }
  ];
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className='flex flex-col gap-3 p-2'>
        {navItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <div className={`text-lg font-medium p-4 border rounded-lg flex flex-row justify-between items-center hover:bg-red-50 transition-colors ${
              pathname === item.path ? 'bg-red-100 border-gray-300' : ''
            }`}>
              {item.name}
              <ChevronRight className='size-5' />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default SideNav