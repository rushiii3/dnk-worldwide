"use client";

import React, { useState } from 'react';
import { MapPin, Plus, MoreVertical, Home, Briefcase, Star, Trash2, PenSquare } from 'lucide-react';

// Mock data for demonstration
const mockAddresses = [
  { 
    id: 1, 
    label: 'Home', 
    default: true,
    name: 'Vishal Sharma',
    address: '123 Main Street, Apt 4B',
    city: 'New Delhi',
    state: 'Delhi',
    zipCode: '110001',
    country: 'India',
    phone: '+91 987-654-3210'
  },
  { 
    id: 2, 
    label: 'Work', 
    default: false,
    name: 'Vishal Sharma',
    address: '456 Business Ave, Suite 200',
    city: 'Gurgaon',
    state: 'Haryana',
    zipCode: '122001',
    country: 'India',
    phone: '+91 987-654-3210'
  },
  { 
    id: 3, 
    label: 'Parent\'s House', 
    default: false,
    name: 'Rajesh & Sunita Sharma',
    address: '789 Maple Road',
    city: 'Jaipur',
    state: 'Rajasthan',
    zipCode: '302001',
    country: 'India',
    phone: '+91 876-543-2109'
  }
];

export default function SavedAddressPage() {
  const [addresses, setAddresses] = useState(mockAddresses);
  const [showAddressMenu, setShowAddressMenu] = useState<number | null>(null);
  
  const getAddressIcon = (label: string) => {
    switch(label.toLowerCase()) {
      case 'home':
        return <Home className="size-5" />;
      case 'work':
        return <Briefcase className="size-5" />;
      default:
        return <MapPin className="size-5" />;
    }
  };
  
  const toggleAddressMenu = (id: number) => {
    if (showAddressMenu === id) {
      setShowAddressMenu(null);
    } else {
      setShowAddressMenu(id);
    }
  };
  
  const setAsDefault = (id: number) => {
    setAddresses(addresses.map(address => ({
      ...address,
      default: address.id === id
    })));
    setShowAddressMenu(null);
  };
  
  const deleteAddress = (id: number) => {
    setAddresses(addresses.filter(address => address.id !== id));
    setShowAddressMenu(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <MapPin className="size-6" />
          <h1 className="text-xl font-bold">Saved Addresses</h1>
        </div>
        <button className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm">
          <Plus className="size-4" />
          Add New
        </button>
      </div>

      <div className="space-y-4">
        {addresses.map((address) => (
          <div key={address.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${address.default ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                    {getAddressIcon(address.label)}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{address.label}</h3>
                      {address.default && (
                        <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{address.name}</p>
                  </div>
                </div>
                
                <div className="relative">
                  <button 
                    onClick={() => toggleAddressMenu(address.id)}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <MoreVertical className="size-5 text-gray-500" />
                  </button>
                  
                  {showAddressMenu === address.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-1 z-10 border">
                      <button 
                        onClick={() => {}} 
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <PenSquare className="size-4" />
                        Edit
                      </button>
                      
                      {!address.default && (
                        <button 
                          onClick={() => setAsDefault(address.id)} 
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Star className="size-4" />
                          Set as Default
                        </button>
                      )}
                      
                      <button 
                        onClick={() => deleteAddress(address.id)} 
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-red-600"
                      >
                        <Trash2 className="size-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-3 ml-12">
                <p className="text-sm">{address.address}</p>
                <p className="text-sm">{address.city}, {address.state} {address.zipCode}</p>
                <p className="text-sm">{address.country}</p>
                <p className="text-sm text-gray-500 mt-1">{address.phone}</p>
              </div>

              <div className="flex gap-2 mt-4">
                <button className="flex-1 flex items-center justify-center gap-1 text-xs border border-gray-300 rounded-lg py-2 px-3 bg-gray-50">
                  <PenSquare className="size-4" />
                  Edit
                </button>
                {!address.default && (
                  <button className="flex-1 flex items-center justify-center gap-1 text-xs border border-blue-600 text-blue-600 rounded-lg py-2 px-3 bg-blue-50">
                    <Star className="size-4" />
                    Set as Default
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}