/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Checkbox } from "../../../components/ui/checkbox";
import { useShipping } from "../../../context/ShippingContext";
import { SAVE_AS_OPTIONS } from "../../../lib/constants";

interface AddressFormProps {
  type: "pickup" | "delivery";
  isOpen: boolean;
  onClose: () => void;
  editAddress?: any; // Optional address to edit
}

export function AddressForm({
  type,
  isOpen,
  onClose,
  editAddress,
}: AddressFormProps) {
  const title = editAddress
    ? "Edit Address"
    : type === "pickup"
    ? "Add Pickup Address"
    : "Add Delivery Address";
  const {
    setPickupAddress,
    setDeliveryAddress,
    pickupAddress,
    deliveryAddress,
    addSavedAddress,
  } = useShipping();

  // Only use initial values if editing an existing address
  const initialAddress = editAddress ? editAddress : null;

  const [formData, setFormData] = useState({
    id: initialAddress?.id || "",
    contactName: initialAddress?.contactName || "",
    mobileNumber: initialAddress?.mobileNumber || "",
    emailAddress: initialAddress?.emailAddress || "",
    flatNo: initialAddress?.flatNo || "",
    areaStreet: initialAddress?.areaStreet || "",
    pincode: initialAddress?.pincode || "",
    city: initialAddress?.city || "",
    state: initialAddress?.state || "",
    saveAs: initialAddress?.saveAs || "home",
  });

  // Reset form data when the dialog opens
  useEffect(() => {
    if (isOpen && !editAddress) {
      setFormData({
        id: "",
        contactName: "",
        mobileNumber: "",
        emailAddress: "",
        flatNo: "",
        areaStreet: "",
        pincode: "",
        city: "",
        state: "",
        saveAs: "home",
      });
      setSaveToAddressBook(true);
    }
  }, [isOpen, editAddress]);

  const [saveToAddressBook, setSaveToAddressBook] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.contactName.trim()) {
      newErrors.contactName = "Contact name is required";
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Mobile number must be 10 digits";
    }

    if (!formData.emailAddress.trim()) {
      newErrors.emailAddress = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.emailAddress)) {
      newErrors.emailAddress = "Invalid email format";
    }

    if (!formData.flatNo.trim()) {
      newErrors.flatNo = "Flat/Building details are required";
    }

    if (!formData.areaStreet.trim()) {
      newErrors.areaStreet = "Area/Street details are required";
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const addressWithId = {
        ...formData,
        id: formData.id || `address-${Date.now()}`,
      };

      if (type === "pickup") {
        setPickupAddress(addressWithId);
      } else {
        setDeliveryAddress(addressWithId);
      }

      // Save to address book if checked
      if (saveToAddressBook) {
        addSavedAddress(addressWithId);
      }

      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-md bg-white rounded-lg shadow-lg"
        style={{ position: "fixed" }}
      >
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>{title}</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6"
          />
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-sm font-medium uppercase text-gray-500 mb-2">
            {type.toUpperCase()} CONTACT DETAILS
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactName">Contact Name</Label>
              <Input
                id="contactName"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                placeholder="Enter name"
                className={errors.contactName ? "border-red-500" : ""}
              />
              {errors.contactName && (
                <p className="text-xs text-red-500">{errors.contactName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobileNumber">Mobile Number</Label>
              <Input
                id="mobileNumber"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="10-digit number"
                className={errors.mobileNumber ? "border-red-500" : ""}
              />
              {errors.mobileNumber && (
                <p className="text-xs text-red-500">{errors.mobileNumber}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="emailAddress">Email Address</Label>
            <Input
              id="emailAddress"
              name="emailAddress"
              value={formData.emailAddress}
              onChange={handleChange}
              placeholder="Enter email address"
              className={errors.emailAddress ? "border-red-500" : ""}
            />
            {errors.emailAddress && (
              <p className="text-xs text-red-500">{errors.emailAddress}</p>
            )}
          </div>

          <div className="text-sm font-medium uppercase text-gray-500 mt-6 mb-2">
            ADDRESS DETAILS
          </div>

          <div className="space-y-2">
            <Label htmlFor="flatNo">
              Flat, Housing no., Building, Apartment
            </Label>
            <Input
              id="flatNo"
              name="flatNo"
              value={formData.flatNo}
              onChange={handleChange}
              placeholder="Enter building details"
              className={errors.flatNo ? "border-red-500" : ""}
            />
            {errors.flatNo && (
              <p className="text-xs text-red-500">{errors.flatNo}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="areaStreet">Area, Street, Sector</Label>
            <Input
              id="areaStreet"
              name="areaStreet"
              value={formData.areaStreet}
              onChange={handleChange}
              placeholder="Enter area details"
              className={errors.areaStreet ? "border-red-500" : ""}
            />
            {errors.areaStreet && (
              <p className="text-xs text-red-500">{errors.areaStreet}</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="6-digit code"
                className={errors.pincode ? "border-red-500" : ""}
              />
              {errors.pincode && (
                <p className="text-xs text-red-500">{errors.pincode}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
                className={errors.city ? "border-red-500" : ""}
              />
              {errors.city && (
                <p className="text-xs text-red-500">{errors.city}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter state"
                className={errors.state ? "border-red-500" : ""}
              />
              {errors.state && (
                <p className="text-xs text-red-500">{errors.state}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>SAVE AS</Label>
            <div className="flex gap-3">
              {SAVE_AS_OPTIONS.map((option) => (
                <Button
                  key={option.id}
                  type="button"
                  variant={
                    formData.saveAs === option.id ? "default" : "outline"
                  }
                  className={`flex-1 ${
                    formData.saveAs === option.id ? "bg-blue-600" : ""
                  }`}
                  onClick={() =>
                    setFormData({
                      ...formData,
                      saveAs: option.id,
                    })
                  }
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {!editAddress && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="saveAddress"
                checked={saveToAddressBook}
                onCheckedChange={(checked) =>
                  setSaveToAddressBook(checked as boolean)
                }
              />
              <label
                htmlFor="saveAddress"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Save this address to your address book
              </label>
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button
              type="submit"
              className="w-full bg-blue-900 hover:bg-blue-950"
            >
              {editAddress
                ? "Save Changes"
                : type === "pickup"
                ? "Add Pickup Address"
                : "Add Delivery Address"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
