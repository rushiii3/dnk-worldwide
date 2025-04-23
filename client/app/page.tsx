"use client";

import Faqs from "./components/Faqs";
import Hero from "./components/Hero";
import Works from "./components/Works";
import Footer from "./ui/Footer";
import { Navbar } from "./ui/Navbar";

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
