"use client";

import { Navbar } from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { ShippingSteps } from "../../components/shipping/ShippingSteps";
import { ShippingProvider } from "../../context/ShippingContext";
import ProtectedRoute from "@/src/components/ProtectedRoute";

export default function ShippingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <ShippingProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <ShippingSteps />
          <main className="flex-1 py-6">{children}</main>
          <Footer />
        </div>
      </ShippingProvider>
    </ProtectedRoute>
  );
}
