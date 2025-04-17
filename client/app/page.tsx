"use client";

import Hero from "./components/Hero";
import Works from "./components/Works";
import { Navbar } from "./ui/Navbar";



export default function Home() {
  return (
    <div className="h-screen flex flex-col items-center">
      <Navbar />
      <Hero />
      <Works />
    </div>
  );
}
