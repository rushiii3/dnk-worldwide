"use client";

import React, { useState } from "react";
import { Input, Button } from "@heroui/react";
import { Circle, MapPin, X, AlertCircle } from "lucide-react";
import { Dialog } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { otpService } from "../../apiCalls/otpVerification";

const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showOtpInputs, setShowOtpInputs] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [sessionId, setSessionId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Handle OTP digit input and auto focus next field
  const handleOtpChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input automatically
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) (nextInput as HTMLInputElement).focus();
      }
    }
  };

  // Send OTP API call
  const handleSendOtp = async () => {
    // Reset any previous errors
    setError("");
    
    // Validate phone number
    if (!phoneNumber || phoneNumber.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await otpService.sendOtp({
        countryCode,
        phoneNumber
      });
      
      // Save session ID for verification
      setSessionId(response.sessionId);
      setShowOtpInputs(true);
      setError(""); // Clear any previous errors
    } catch (err) {
      console.error("Error sending OTP:", err);
      setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP API call
  const handleVerifyOtp = async () => {
    // Reset any previous errors
    setError("");
    
    // Combine OTP digits into a single string
    const otpCode = otp.join("");
    
    // Validate OTP
    if (otpCode.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await otpService.verifyOtp({
        countryCode,
        phoneNumber,
        sessionId,
        code: otpCode
      });
      
      // On successful verification
      console.log("User verified:", response.user);
      
      // Store user data in localStorage if needed
      localStorage.setItem("user", JSON.stringify(response.user));
      
      // Navigate to dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    setError("");
    setIsLoading(true);
    
    try {
      const response = await otpService.sendOtp({
        countryCode,
        phoneNumber
      });
      
      // Update session ID
      setSessionId(response.sessionId);
      // Reset OTP fields
      setOtp(Array(6).fill(""));
    } catch (err) {
      console.error("Error resending OTP:", err);
      setError(err.response?.data?.message || "Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 w-full md:mt-12">
      <div className="md:flex md:flex-row md:bg-[#FFFF00] md:rounded-xl z-10 md:justify-between md:p-12">
        {/* Hero Text */}
        <div className="text-3xl mt-12 md:mt-0 tracking-tight md:text-5xl md:font-medium md:leading-20 md:drop-shadow-lg md:text-black">
          Send Anything,<br /> Anywhere<br /> from your doorstep.
        </div>

        {/* Hero Card */}
        <div className="mt-24 md:mt-0 w-full md:max-w-lg flex justify-center">
          <div className="bg-gray-100 shadow-xl rounded-xl p-8 w-full max-w-lg">
            <h1 className="text-2xl font-normal mb-6">
              <span className="font-bold">Ship</span> Personal Courier
            </h1>

            {/* Input with icons */}
            <div className="flex items-start space-x-4">
              <div className="flex flex-col mt-6 items-center pt-1">
                <Circle className="text-blue-600 text-xl" />
                <div className="border-l border-dotted border-black h-28 my-1" />
                <MapPin className="text-blue-600" />
              </div>

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
                onClick={() => setIsModalOpen(true)}
              >
                Get Otp and Ship now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Modal with Phone Number and OTP */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
        {/* Backdrop with blur effect */}
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
        
        {/* Modal positioning */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          {/* Modal Content */}
          <Dialog.Panel className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 transform transition-all">
            {/* Close Button */}
            <button 
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setIsModalOpen(false)}
              disabled={isLoading}
            >
              <X size={20} />
            </button>
            
            <Dialog.Title className="text-2xl font-bold text-gray-800 mb-6">
              {showOtpInputs ? "Verify Your Number" : "Enter Your Mobile Number"}
            </Dialog.Title>
            
            {/* Error message display */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <AlertCircle className="text-red-500 mr-2 mt-1 flex-shrink-0" size={16} />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            
            {/* Phone Input Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <div className="flex items-center space-x-2 border-b-2 border-gray-300 pb-2 focus-within:border-blue-500 transition-colors">
                {/* Country code dropdown can be added here if needed */}
                <span className="text-base font-medium text-gray-700">{countryCode}</span>
                <Input
                  placeholder="Enter 10 digit number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-1 border-none focus:outline-none text-lg"
                  disabled={showOtpInputs || isLoading}
                  maxLength={10}
                  type="tel"
                />
              </div>
            </div>
            
            {/* OTP Section - Conditionally Rendered */}
            {showOtpInputs && (
              <div className="animate-fadeIn">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Enter OTP sent to {countryCode} {phoneNumber}
                  </label>
                  <div className="flex justify-between space-x-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        className="w-10 h-12 border-2 border-gray-300 text-center text-lg rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                        disabled={isLoading}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="text-center mb-4">
                  <button 
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline transition-colors"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                  >
                    {isLoading ? "Please wait..." : "Didn't receive code? Resend OTP"}
                  </button>
                </div>
              </div>
            )}
            
            {/* Action Button */}
            <Button
              className="w-full bg-[#27327C] text-white py-3 rounded-lg text-base font-medium hover:bg-[#1e2763] transition-colors shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
              onClick={showOtpInputs ? handleVerifyOtp : handleSendOtp}
              disabled={isLoading}
            >
              {isLoading ? (
                "Please wait..."
              ) : showOtpInputs ? (
                "Verify & Continue"
              ) : (
                "Send OTP"
              )}
            </Button>
            
            {/* Security Notice */}
            <p className="text-xs text-gray-500 text-center mt-4">
              Your information is encrypted and secure
            </p>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default Hero;