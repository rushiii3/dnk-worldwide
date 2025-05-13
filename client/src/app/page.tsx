"use client";

import Faqs from "../components/home/Faqs";
import Hero from "../components/home/Hero";
import Works from "../components/home/Works";
import Footer from "../components/layout/Footer";
import { Navbar } from "../components/layout/Navbar";

export default function Home() {
  return (
    <div className="h-screen flex flex-col items-center">
      <Navbar />
      <Hero />
      <Works />
      <Faqs />
      <Footer />
    </div>
  );
}
