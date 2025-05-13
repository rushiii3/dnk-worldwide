"use client";

import { cn } from "../../lib/utils";
import { SHIPPING_STEPS } from "../../lib/constants";
import { useShipping } from "../../context/ShippingContext";


export function ShippingSteps() {
  const { activeStep } = useShipping();

  return (
    <div className="w-full max-w-4xl mx-auto py-6">
      <div className="flex justify-center items-center">
        {SHIPPING_STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full border-2 flex items-center justify-center",
                  activeStep >= index
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-blue-100 border-blue-200 text-blue-400"
                )}
              >
                {activeStep > index ? (
                  <CheckIcon className="w-5 h-5" />
                ) : (
                  <span className="text-sm">{index + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  "text-xs mt-2",
                  activeStep >= index ? "text-blue-600" : "text-blue-300"
                )}
              >
                {step.name}
              </span>
            </div>
            {index < SHIPPING_STEPS.length - 1 && (
              <div
                className={cn(
                  "w-16 h-[2px] mx-1",
                  activeStep > index ? "bg-blue-600" : "bg-blue-200"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12l5 5 9-9" />
    </svg>
  );
}
