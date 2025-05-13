"use client";

import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Edit2, Save } from 'lucide-react';

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: 'Vishal Sharma',
    email: 'vishal.sharma@example.com',
    phone: '+91 987-654-3210',
    address: '123 Main St, New Delhi, India'
  });

  const [formData, setFormData] = useState({...profileData});

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = () => {
    setProfileData({...formData});
    setEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <User className="size-6" />
          <h1 className="text-xl font-bold">My Profile</h1>
        </div>
        {!editing ? (
          <button 
            onClick={handleEdit}
            className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-sm"
          >
            <Edit2 className="size-4" />
            Edit
          </button>
        ) : (
          <button 
            onClick={handleSave}
            className="flex items-center gap-1 bg-green-50 text-green-600 px-3 py-1.5 rounded-lg text-sm"
          >
            <Save className="size-4" />
            Save
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gray-200 rounded-full w-16 h-16 flex items-center justify-center">
              <User className="size-8 text-gray-600" />
            </div>
            <div>
              <h2 className="text-xl font-medium">{profileData.fullName}</h2>
              <p className="text-gray-500 text-sm">Customer since May 2023</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              {editing ? (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="pl-10 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <User className="size-5 text-gray-400" />
                  <span>{profileData.fullName}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              {editing ? (
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <Mail className="size-5 text-gray-400" />
                  <span>{profileData.email}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              {editing ? (
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-10 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <Phone className="size-5 text-gray-400" />
                  <span>{profileData.phone}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Default Address</label>
              {editing ? (
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="pl-10 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <MapPin className="size-5 text-gray-400" />
                  <span>{profileData.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}