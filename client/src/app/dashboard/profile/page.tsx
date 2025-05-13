"use client";

import React, { useState } from "react";
import { User, Mail, Phone, MapPin, Edit2, Save } from "lucide-react";

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "Vishal Sharma",
    email: "vishal.sharma@example.com",
    phone: "+91 987-654-3210",
    address: "123 Main St, New Delhi, India",
  });

  const [formData, setFormData] = useState({ ...profileData });

  const handleEdit = () => setEditing(true);

  const handleSave = () => {
    setProfileData({ ...formData });
    setEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex justify-center items-start bg-gray-50">
      <div className="w-full space-y-4 px-4 max-w-2xl">
        <div className="flex items-center justify-between mb-2 pt-4">
          <div className="flex items-center gap-2">
            <User className="size-6" />
            <h1 className="text-xl font-bold">My Profile</h1>
          </div>
          {!editing ? (
            <button
              onClick={handleEdit}
              className="flex items-center gap-1 text-sm border border-blue-600 text-blue-600 bg-blue-50 rounded-lg px-3 py-1.5"
            >
              <Edit2 className="size-4" />
              Edit
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="flex items-center gap-1 text-sm border border-green-600 text-green-600 bg-green-50 rounded-lg px-3 py-1.5"
            >
              <Save className="size-4" />
              Save
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden mt-8">
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
              {[
                {
                  label: "Full Name",
                  icon: <User className="size-5 text-gray-400" />,
                  name: "fullName",
                  type: "text",
                  value: editing ? formData.fullName : profileData.fullName,
                },
                {
                  label: "Email Address",
                  icon: <Mail className="size-5 text-gray-400" />,
                  name: "email",
                  type: "email",
                  value: editing ? formData.email : profileData.email,
                },
                {
                  label: "Phone Number",
                  icon: <Phone className="size-5 text-gray-400" />,
                  name: "phone",
                  type: "tel",
                  value: editing ? formData.phone : profileData.phone,
                },
                {
                  label: "Default Address",
                  icon: <MapPin className="size-5 text-gray-400" />,
                  name: "address",
                  type: "text",
                  value: editing ? formData.address : profileData.address,
                },
              ].map((field) => (
                <div className="space-y-2" key={field.name}>
                  <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                  {editing ? (
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        {field.icon}
                      </span>
                      <input
                        type={field.type}
                        name={field.name}
                        value={field.value}
                        onChange={handleChange}
                        className="pl-10 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      {field.icon}
                      <span>{field.value}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
