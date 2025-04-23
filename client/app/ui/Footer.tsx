'use client'

import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className='w-full px-6 md:px-20 py-16 mt-20'>
      <div className='max-w-screen-xl mx-auto flex flex-col'>

        {/* Top Section */}
        <div className='md:flex md:flex-row md:justify-between md:gap-12'>

          {/* Subscribe to Newsletter Card */}
          <div className='bg-[#203C86]/5 p-6 flex flex-col items-start rounded-xl shadow-md md:max-w-sm'>
            <h1 className='text-2xl font-medium'>
              Subscribe <br /> to our newsletter!
            </h1>
            <div className='flex flex-row w-full mt-4'>
              <input
                placeholder='Email Address'
                className='p-4 bg-white text-gray-400 w-full'
              />
              <button className='w-16 bg-red-400 cursor-pointer flex justify-center items-center'>
                <ArrowRight className='text-white size-6' />
              </button>
            </div>
            <p className='hidden md:block mt-4 text-sm text-gray-600'>
              Hello, we are Lift Media. Our goal is to translate the positive effects from
              revolutionizing how companies engage with their clients & their team.
            </p>
          </div>

          {/* Company Info */}
          <div className='flex flex-col lg:flex-row mt-10 md:mt-0 lg:gap-16'>

            {/* Company Address */}
            <div className='lg:w-[350px] lg:'>
              <h1 className='font-medium text-xl'>Company Address</h1>
              <p className='text-lg mt-2 text-[#a8a8a8] leading-relaxed'>
                Plot No. B, Khasra No. 360, M.G Road, <br />
                Sultanpur, Gadaipur, Mehrauli, <br />
                South Delhi <br />
                110030
              </p>
            </div>

            {/* Info Links */}
            <div className='flex flex-row gap-12 md:gap-16 lg:gap-20 mt-8 md:mt-8 lg:mt-0 justify-between'>
              {/* Information */}
              <div>
                <h1 className='text-xl font-medium'>Information</h1>
                <ul className='mt-6 space-y-3 text-lg text-[#a8a8a8]'>
                  {['FAQ', 'Blog', 'Support'].map((item, i) => (
                    <li
                      key={i}
                      className='cursor-pointer relative w-fit after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:bg-black after:w-0 hover:after:w-full after:transition-all after:duration-300'
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <h1 className='text-xl font-medium'>Company</h1>
                <ul className='mt-6 space-y-3 text-lg text-[#a8a8a8]'>
                  {['About Us', 'Careers', 'Contact Us', 'Services'].map((item, i) => (
                    <li
                      key={i}
                      className='cursor-pointer relative w-fit after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:bg-black after:w-0 hover:after:w-full after:transition-all after:duration-300'
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className='mt-12 border-t border-[#a8a8a8]' />

        {/* Social Media Icons */}
        <div className='flex justify-center gap-6 mt-8'>
          {[
            { src: '/images/linkedin.svg', alt: 'LinkedIn' },
            { src: '/images/facebook.svg', alt: 'Facebook' },
            { src: '/images/twitter.svg', alt: 'Twitter' },
          ].map(({ src, alt }, i) => (
            <div
              key={i}
              className='border border-black p-2 rounded-full cursor-pointer hover:scale-105 transition duration-300'
            >
              <Image src={src} alt={alt} width={20} height={20} className='p-[2px]' />
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className='flex flex-col md:flex-row justify-between items-center mt-12 gap-6'>
          <div className='font-bold text-4xl'>
            <Link href="/">DNK</Link>
          </div>
          <div className='flex flex-row gap-4 text-sm text-gray-700'>
            {['Terms', 'Privacy', 'Cookies'].map((item, i) => (
              <p
                key={i}
                className='cursor-pointer hover:bg-black hover:text-white px-3 py-1 rounded-lg transition duration-300'
              >
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
