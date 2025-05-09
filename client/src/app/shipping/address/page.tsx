"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/button";
import { PackagingTips } from "../../../components/shipping/PackagingTips";
import { useShipping } from "../../../context/ShippingContext";
import { AddressForm } from "./AddressForm";
import { SavedAddressesPopup } from "./SavedAddressesPopup";
import Link from "next/link";
import { ChevronLeft, Plus, Edit } from "lucide-react";

export default function AddressPage() {
  const router = useRouter();
  const { setActiveStep } = useShipping();
  const [pickupAddressModalOpen, setPickupAddressModalOpen] = useState(false);
  const [deliveryAddressModalOpen, setDeliveryAddressModalOpen] =
    useState(false);
  const [newPickupAddressModalOpen, setNewPickupAddressModalOpen] =
    useState(false);
  const [newDeliveryAddressModalOpen, setNewDeliveryAddressModalOpen] =
    useState(false);
  const { pickupAddress, deliveryAddress } = useShipping();

  const handleNext = () => {
    if (pickupAddress && deliveryAddress) {
      setActiveStep(1);
      router.push("/shipping/package");
    } else {
      // Show validation message
      if (!pickupAddress) {
        setPickupAddressModalOpen(true);
      } else if (!deliveryAddress) {
        setDeliveryAddressModalOpen(true);
      }
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="bg-blue-50 p-6 rounded-lg mb-8">
            <Link
              href="/"
              className="flex items-center text-blue-600 mb-4 hover:text-blue-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Home
            </Link>

            <div className="mb-8">
              <h2 className="text-xl font-medium mb-6">Pickup Address</h2>

              {pickupAddress ? (
                <div className="border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{pickupAddress.contactName}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {pickupAddress.flatNo}, {pickupAddress.areaStreet},{" "}
                      {pickupAddress.city}, {pickupAddress.state} -{" "}
                      {pickupAddress.pincode}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPickupAddressModalOpen(true)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Change
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setPickupAddressModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-6"
                  variant="outline"
                >
                  <Plus className="w-5 h-5" />
                  Add Pickup Address
                </Button>
              )}
            </div>

            <div>
              <h2 className="text-xl font-medium mb-6">Delivery Address</h2>

              {deliveryAddress ? (
                <div className="border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{deliveryAddress.contactName}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {deliveryAddress.flatNo}, {deliveryAddress.areaStreet},{" "}
                      {deliveryAddress.city}, {deliveryAddress.state} -{" "}
                      {deliveryAddress.pincode}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeliveryAddressModalOpen(true)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Change
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setDeliveryAddressModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-6"
                  variant="outline"
                >
                  <Plus className="w-5 h-5" />
                  Add Delivery Address
                </Button>
              )}
            </div>

            <div className="mt-8 flex justify-end">
              <Button
                onClick={handleNext}
                className="bg-blue-900 hover:bg-blue-950"
              >
                Next →
              </Button>
            </div>
          </div>
        </div>

        <div>
          <PackagingTips />
        </div>
      </div>

      {/* Saved Addresses Popups */}
      <SavedAddressesPopup
        type="pickup"
        isOpen={pickupAddressModalOpen}
        onClose={() => setPickupAddressModalOpen(false)}
      />

      <SavedAddressesPopup
        type="delivery"
        isOpen={deliveryAddressModalOpen}
        onClose={() => setDeliveryAddressModalOpen(false)}
      />

      {/* Direct Add New Address Forms (if user doesn't want to go through saved addresses) */}
      <AddressForm
        type="pickup"
        isOpen={newPickupAddressModalOpen}
        onClose={() => setNewPickupAddressModalOpen(false)}
      />

      <AddressForm
        type="delivery"
        isOpen={newDeliveryAddressModalOpen}
        onClose={() => setNewDeliveryAddressModalOpen(false)}
      />
    </div>
  );
}
