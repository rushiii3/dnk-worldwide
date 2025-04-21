"use client";

import React from 'react'
import { Input, Button} from "@heroui/react";
import { Circle, MapPin } from 'lucide-react';

const Hero = () => {
  return (
    <div className='p-6 w-full md:mt-12'>
        <div className='md:flex md:flex-row md:bg-blue-500 z-50 md:justify-between md:p-12'>
            {/* Hero Text */}
            <div className='text-3xl mt-12 md:mt-0 tracking-tight md:text-5xl md:font-medium md:leading-20 md:drop-shadow-lg'>
                Send Anything,<br/> Anywhere<br /> from your doorstep.
            </div>

            {/* Hero Card */}
            <div className="mt-24 md:mt-0 w-full md:max-w-lg flex justify-center">
                <div className="bg-gray-100 shadow-xl rounded-xl p-8 w-full max-w-lg">
                    {/* Heading */}
                    <h1 className="text-2xl font-normal mb-6">
                        <span className="font-bold">Ship</span> Personal Courier
                    </h1>

                    {/* Input with icons */}
                    <div className="flex items-start space-x-4">
                        {/* Left icon group */}
                        <div className="flex flex-col mt-6 items-center pt-1">
                            <Circle className="text-blue-600 text-xl" />
                            <div className="border-l border-dotted border-black h-28 my-1" />
                            <MapPin className="text-blue-600" />
                        </div>

                        {/* Input fields */}
                        <div className="flex flex-col w-full space-y-20 mt-6">
                            <Input
                            placeholder="Enter pickup pin code"
                            className="rounded-xl border border-black px-4 py-3 text-base focus:outline-none"
                            variant="bordered"
                            />
                            <Input
                            placeholder="Enter delivery pin code"
                            className="rounded-xl border border-black px-4 py-3 text-base focus:outline-none"
                            variant="bordered"
                            />
                        </div>
                    </div>

                    {/* Button */}
                    <div className="mt-10">
                        <Button
                        className="w-full bg-[#27327C] text-white py-3 text-base font-medium rounded-md hover:bg-[#1e2763] transition"
                        >
                        Get Otp and Ship now
                        </Button>
                    </div>
                </div>
            </div>
        </div>
        

        
    </div>
  )
}

export default Hero