"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ShippingPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/shipping/address");
  }, [router]);

  return null;
}
