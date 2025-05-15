/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/button";
import { PackagingTips } from "../../../components/shipping/PackagingTips";
import { useShipping } from "../../../context/ShippingContext";
import Link from "next/link";
import { ChevronLeft, Clock } from "lucide-react";

export default function SchedulePage() {
  const router = useRouter();
  const {
    activeStep,
    setActiveStep,
    pickupAddress,
    deliveryAddress,
    packageDetails,
    scheduleDetails,
    setScheduleDetails,
  } = useShipping();

  const [selectedDate, setSelectedDate] = useState(scheduleDetails?.date || "");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(
    scheduleDetails?.timeSlot || ""
  );
  const [error, setError] = useState("");

  if (!pickupAddress || !deliveryAddress || !packageDetails) {
    // Redirect to appropriate page if previous steps are not completed
    if (!pickupAddress || !deliveryAddress) {
      router.push("/shipping/address");
    } else {
      router.push("/shipping/package");
    }
    return null;
  }

  const dates = [
    { day: "WED", date: "26", month: "March" },
    { day: "THU", date: "27", month: "March" },
    { day: "FRI", date: "28", month: "March" },
  ];

  const timeSlots = [
    { id: "morning", label: "9:00 AM - 12:00 PM" },
    { id: "afternoon", label: "12:00 PM - 3:00 PM" },
    { id: "evening", label: "3:00 PM - 6:00 PM" },
  ];

  const handleNext = () => {
    if (!selectedDate) {
      setError("Please select a pickup date");
      return;
    }

    if (!selectedTimeSlot) {
      setError("Please select a time slot");
      return;
    }

    setScheduleDetails({
      date: selectedDate,
      timeSlot: selectedTimeSlot,
    });

    setActiveStep(3);
    router.push("/shipping/summary");
  };

  const handleBack = () => {
    setActiveStep(1);
    router.push("/shipping/package");
  };

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="col-span-1 lg:col-span-3">
          <div className="bg-blue-50 p-6 rounded-lg">
            <Link
              href="/shipping/package"
              className="flex items-center text-blue-600 mb-4 hover:text-blue-800 transition-colors"
              onClick={handleBack}
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Back to Package Details
            </Link>

            <h2 className="text-xl font-medium mb-6">Schedule your Pickup</h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">Select a pickup day</h3>
                <div className="flex gap-4 flex-wrap">
                  {dates.map((item) => (
                    <button
                      key={item.date}
                      type="button"
                      className={`flex flex-col items-center justify-center rounded-full w-16 h-16 py-3 px-2 transition-colors ${
                        selectedDate === `${item.day} ${item.date}`
                          ? "bg-blue-600 text-white"
                          : "bg-white border hover:border-blue-600"
                      }`}
                      onClick={() => {
                        setSelectedDate(`${item.day} ${item.date}`);
                        setError("");
                      }}
                    >
                      <span className="text-xs">{item.day}</span>
                      <span className="text-xl font-bold">{item.date}</span>
                      <span className="text-xs">{item.month}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slot Selection */}
              <div>
                <h3 className="font-medium mb-3">Select a time slot</h3>
                <div className="space-y-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      className={`w-full py-3 px-4 flex items-center justify-between rounded-lg border transition-colors ${
                        selectedTimeSlot === slot.id
                          ? "bg-blue-100 border-blue-600"
                          : "bg-white hover:border-blue-600"
                      }`}
                      onClick={() => {
                        setSelectedTimeSlot(slot.id);
                        setError("");
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          selectedTimeSlot === slot.id 
                            ? "border-blue-600" 
                            : "border-gray-300"
                        }`}>
                          {selectedTimeSlot === slot.id && (
                            <div className="w-3 h-3 bg-blue-600 rounded-full" />
                          )}
                        </div>
                        <span>{slot.label}</span>
                      </div>
                      <span className="text-sm text-green-600 font-medium">Available</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-blue-100 p-4 rounded-lg flex gap-3 items-center">
                <Clock className="w-5 h-5 text-blue-600" />
                <div className="text-sm">
                  <span className="font-semibold">23:59 hours remaining</span>{" "}
                  for the next pickup slot.
                  <br />
                  Book before 2pm to get Same-Day Pickup at your doorstep.
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>

            <div className="mt-8 flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                ← Back
              </Button>
              <Button
                onClick={handleNext}
                className="bg-blue-900 hover:bg-blue-950"
              >
                Next →
              </Button>
            </div>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-2 space-y-6">
          <OrderSummary selectedDate={selectedDate} selectedTimeSlot={selectedTimeSlot} timeSlots={timeSlots} />
          <PackagingTips />
        </div>
      </div>
    </div>
  );
}

function OrderSummary({ 
  selectedDate, 
  selectedTimeSlot, 
  timeSlots 
}: { 
  selectedDate: string; 
  selectedTimeSlot: string;
  timeSlots: { id: string; label: string }[];
}) {
  const { pickupAddress, deliveryAddress, packageDetails } = useShipping();

  if (!pickupAddress || !deliveryAddress || !packageDetails) return null;

  // Find the selected time slot label
  const selectedTimeSlotLabel = timeSlots.find(slot => slot.id === selectedTimeSlot)?.label || "Not selected";

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-xl text-blue-600 mb-6">Order Summary</h3>

      <div className="border-b pb-4 mb-4">
        <h4 className="font-medium mb-3">Address Details</h4>

        <div className="flex items-start gap-3 mb-4">
          <div className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center mt-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full" />
          </div>
          <div>
            <p className="font-medium">{pickupAddress.contactName} (Pickup)</p>
            <p className="text-xs text-gray-500">Maharashtra (+910000)</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center mt-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full" />
          </div>
          <div>
            <p className="font-medium">
              {deliveryAddress.contactName} (Delivery)
            </p>
            <p className="text-xs text-gray-500">Maharashtra (+910000)</p>
          </div>
        </div>
      </div>

      <div className="border-b pb-4 mb-4">
        <h4 className="font-medium mb-3">Package Details</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Packaging:</span>
            <span className="text-sm">{packageDetails.packaging}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Weight:</span>
            <span className="text-sm">{packageDetails.weight}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Content:</span>
            <span className="text-sm">{packageDetails.content}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Value:</span>
            <span className="text-sm">₹{packageDetails.value}</span>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-3">Pickup Date</h4>
        {selectedDate ? (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Date:</span>
              <span className="text-sm">{selectedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Time:</span>
              <span className="text-sm">{selectedTimeSlot ? selectedTimeSlotLabel : "Not selected"}</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-600">Please select a pickup date</p>
        )}
      </div>
    </div>
  );
}