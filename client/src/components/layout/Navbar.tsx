"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Plus } from 'lucide-react';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [animateItems, setAnimateItems] = useState(false);

  const toggleMenu = () => {
    if (!isMenuOpen) {
      setIsMenuOpen(true);
      // Trigger animation after menu is open
      setTimeout(() => {
        setAnimateItems(true);
      }, 100);
    } else {
      setAnimateItems(false);
      // Wait for animations to finish before closing menu
      setTimeout(() => {
        setIsMenuOpen(false);
      }, 500);
    }
  };

  // Clean up animation state when component unmounts
  useEffect(() => {
    return () => {
      setAnimateItems(false);
    };
  }, []);

  return (
    <header className="w-full shadow-md relative">
      <div className="flex items-center justify-between px-6 py-4 md:px-12 bg-white">
        {/* Logo - stays in place regardless of menu state */}
        <div className="font-bold text-3xl md:text-left text-center w-full md:w-auto z-50">
          <Link href="/">DNK</Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="hover:text-gray-600">
            Home
          </Link>
          <Link href="/about" className="hover:text-gray-600">
            About Us
          </Link>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex space-x-4">
          <Link href="/track" className="border border-gray-200 rounded-full px-6 py-1.5 hover:bg-gray-50">
            Track
          </Link>
          <Link href="/dashboard" className="bg-gray-100 rounded-full px-6 py-1.5 hover:bg-gray-200">
            Login
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center z-50"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <>
          {/* Blurred background overlay */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={toggleMenu}
            style={{
              transition: 'opacity 0.3s ease-in-out',
              opacity: animateItems ? 1 : 0
            }}
          />
          
          {/* Menu container - positioned to not overlap the header */}
          <div className="md:hidden fixed inset-0 pt-20 flex flex-col items-center z-40">
            <div className="text-center w-full">              
              <nav className="flex flex-col items-center space-y-6 text-white text-xl pt-8">
                {['Home', 'About Us', 'Track Your Order', 'Login/Sign up'].map((item, index) => (
                  <Link 
                    key={item} 
                    href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                    className="py-2 px-6 hover:bg-red-500 hover:text-white rounded transition-colors duration-300"
                    style={{
                      opacity: animateItems ? 1 : 0,
                      transform: animateItems ? 'translateY(0)' : 'translateY(20px)',
                      transition: `opacity 0.5s ease ${index * 0.15}s, transform 0.5s ease ${index * 0.15}s`
                    }}
                  >
                    {item}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export const DashboardNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [animateItems, setAnimateItems] = useState(false);

  const toggleMenu = () => {
    if (!isMenuOpen) {
      setIsMenuOpen(true);
      // Trigger animation after menu is open
      setTimeout(() => {
        setAnimateItems(true);
      }, 100);
    } else {
      setAnimateItems(false);
      // Wait for animations to finish before closing menu
      setTimeout(() => {
        setIsMenuOpen(false);
      }, 500);
    }
  };

  // Clean up animation state when component unmounts
  useEffect(() => {
    return () => {
      setAnimateItems(false);
    };
  }, []);

  return (
    <header className="w-full shadow-md relative">
      <div className="flex items-center justify-between px-6 py-4 md:px-12 bg-white">
        {/* Logo - stays in place regardless of menu state */}
        <div className="font-bold text-3xl md:text-left text-center w-full md:w-auto z-50">
          <Image src="/images/logo.jpeg" alt="logo" width={75} height={75} />
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex space-x-4">
          <Link href="/track" className="border border-gray-200 rounded-lg px-6 py-1.5 hover:bg-gray-50">
            <div className='flex flex-row items-center gap-2'>
                <MapPin className='size-4' />
                Track Your Order
              </div> 
          </Link>
          <Link href="/shipping" className="bg-gray-100 rounded-lg px-6 py-1.5 hover:bg-gray-200 flex flex-row gap-3">
            <div className='flex flex-row items-center gap-2'>
              <Plus className='size-4' />
              Create an Order
            </div> 
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center z-50"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <>
          {/* Blurred background overlay */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={toggleMenu}
            style={{
              transition: 'opacity 0.3s ease-in-out',
              opacity: animateItems ? 1 : 0
            }}
          />
          
          {/* Menu container - positioned to not overlap the header */}
          <div className="md:hidden fixed inset-0 pt-20 flex flex-col items-center z-40">
            <div className="text-center w-full">              
              <nav className="mt-20 flex flex-col items-center space-y-6 text-white text-xl pt-8">
                {['Profile', 'Orders', 'Track Your Order', 'Create an Order', 'Saved Addresses'].map((item, index) => (
                  <Link 
                    key={item} 
                    href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                    className="py-2 px-6 hover:bg-red-500 hover:text-white rounded transition-colors duration-300"
                    style={{
                      opacity: animateItems ? 1 : 0,
                      transform: animateItems ? 'translateY(0)' : 'translateY(20px)',
                      transition: `opacity 0.5s ease ${index * 0.15}s, transform 0.5s ease ${index * 0.15}s`
                    }}
                  >
                    {item}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </>
      )}
    </header>
  );
};