"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";

type AddressType = {
  id?: string; // Add ID for saved addresses
  contactName: string;
  mobileNumber: string;
  emailAddress: string;
  flatNo: string;
  areaStreet: string;
  pincode: string;
  city: string;
  state: string;
  saveAs: string;
};

type PackageType = {
  packaging: string;
  weight: string;
  content: string;
  value: string;
  // Added fields for custom package dimensions
  length?: string;
  width?: string;
  height?: string;
};

type ScheduleType = {
  date: string;
  timeSlot: string;
};

type DeliveryType = {
  type: string;
  price: number;
};

interface ShippingContextType {
  activeStep: number;
  pickupAddress: AddressType | null;
  deliveryAddress: AddressType | null;
  packageDetails: PackageType | null;
  scheduleDetails: ScheduleType | null;
  deliveryType: DeliveryType | null;
  savedAddresses: AddressType[];
  setActiveStep: (step: number) => void;
  setPickupAddress: (address: AddressType) => void;
  setDeliveryAddress: (address: AddressType) => void;
  setPackageDetails: (details: PackageType) => void;
  setScheduleDetails: (details: ScheduleType) => void;
  setDeliveryType: (type: DeliveryType) => void;
  addSavedAddress: (address: AddressType) => void;
  removeSavedAddress: (id: string) => void;
}

const defaultContext: ShippingContextType = {
  activeStep: 0,
  pickupAddress: null,
  deliveryAddress: null,
  packageDetails: null,
  scheduleDetails: null,
  deliveryType: null,
  savedAddresses: [],
  setActiveStep: () => {},
  setPickupAddress: () => {},
  setDeliveryAddress: () => {},
  setPackageDetails: () => {},
  setScheduleDetails: () => {},
  setDeliveryType: () => {},
  addSavedAddress: () => {},
  removeSavedAddress: () => {},
};

const ShippingContext = createContext<ShippingContextType>(defaultContext);

export const useShipping = () => useContext(ShippingContext);

export const ShippingProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [pickupAddress, setPickupAddress] = useState<AddressType | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState<AddressType | null>(null);
  const [packageDetails, setPackageDetails] = useState<PackageType | null>(null);
  const [scheduleDetails, setScheduleDetails] = useState<ScheduleType | null>(null);
  const [deliveryType, setDeliveryType] = useState<DeliveryType | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<AddressType[]>([]);

  // Load saved addresses from localStorage on initial load
  useEffect(() => {
    const savedAddressesData = localStorage.getItem('savedAddresses');
    if (savedAddressesData) {
      setSavedAddresses(JSON.parse(savedAddressesData));
    }
  }, []);

  // Save addresses to localStorage whenever they change
  useEffect(() => {
    if (savedAddresses.length > 0) {
      localStorage.setItem('savedAddresses', JSON.stringify(savedAddresses));
    }
  }, [savedAddresses]);

  const addSavedAddress = (address: AddressType) => {
    // Always generate a new unique ID for each address unless editing
    const addressWithId = {
      ...address,
      id: address.id || `address-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    // Check if address already exists (by ID)
    const exists = savedAddresses.some(addr => addr.id === addressWithId.id);
    
    if (exists) {
      // Update existing address
      setSavedAddresses(savedAddresses.map(addr => 
        addr.id === addressWithId.id ? addressWithId : addr
      ));
    } else {
      // Add new address
      setSavedAddresses([...savedAddresses, addressWithId]);
    }
  };

  const removeSavedAddress = (id: string) => {
    setSavedAddresses(savedAddresses.filter(address => address.id !== id));
  };

  return (
    <ShippingContext.Provider
      value={{
        activeStep,
        pickupAddress,
        deliveryAddress,
        packageDetails,
        scheduleDetails,
        deliveryType,
        savedAddresses,
        setActiveStep,
        setPickupAddress,
        setDeliveryAddress,
        setPackageDetails,
        setScheduleDetails,
        setDeliveryType,
        addSavedAddress,
        removeSavedAddress,
      }}
    >
      {children}
    </ShippingContext.Provider>
  );
};