"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/button";
import { Checkbox } from "../../../components/ui/checkbox";
import { PackagingTips } from "../../../components/shipping/PackagingTips";
import { useShipping } from "../../../context/ShippingContext";
import Link from "next/link";
import { ChevronLeft, Shield } from "lucide-react";
import { DELIVERY_TYPES } from "../../../lib/constants";

export default function SummaryPage() {
  const router = useRouter();
  const {
    activeStep,
    setActiveStep,
    pickupAddress,
    deliveryAddress,
    packageDetails,
    scheduleDetails,
    deliveryType,
    setDeliveryType,
  } = useShipping();

  const [securePackage, setSecurePackage] = useState(false);

  if (
    !pickupAddress ||
    !deliveryAddress ||
    !packageDetails ||
    !scheduleDetails
  ) {
    // Redirect to appropriate page if previous steps are not completed
    if (!scheduleDetails) {
      router.push("/shipping/schedule");
    } else if (!packageDetails) {
      router.push("/shipping/package");
    } else {
      router.push("/shipping/address");
    }
    return null;
  }

  const handleDeliveryTypeSelect = (type: string, price: number) => {
    setDeliveryType({ type, price });
  };

  const handleBack = () => {
    setActiveStep(2);
    router.push("/shipping/schedule");
  };

  const handlePayment = () => {
    // In a real app, this would redirect to a payment gateway
    alert("Proceeding to payment...");
  };

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="bg-blue-50 p-6 rounded-lg">
            <Link
              href="/shipping/schedule"
              className="flex items-center text-blue-600 mb-4 hover:text-blue-800 transition-colors"
              onClick={handleBack}
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Back to Schedule
            </Link>

            <h2 className="text-xl font-medium mb-6">Payment Details</h2>

            <div className="space-y-6">
              <div className="bg-white p-4 rounded-lg border border-blue-200 flex gap-3 items-start">
                <div className="mt-1">
                  <Checkbox
                    id="secure-package"
                    checked={securePackage}
                    onCheckedChange={(checked) =>
                      setSecurePackage(checked as boolean)
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor="secure-package"
                    className="font-medium cursor-pointer"
                  >
                    Secure your package for just ₹100
                  </label>
                  <p className="text-xs text-blue-600 mt-1">
                    <Link href="#">See what is covered</Link>
                  </p>
                </div>
                <div className="ml-auto">
                  <Shield className="w-9 h-9 text-blue-600" />
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Select delivery type</h3>
                {DELIVERY_TYPES.map((type) => (
                  <div
                    key={type.id}
                    className={`p-4 border rounded-lg mb-3 cursor-pointer transition-colors ${
                      deliveryType?.type === type.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                    onClick={() =>
                      handleDeliveryTypeSelect(type.id, type.price)
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div>
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              deliveryType?.type === type.id
                                ? "border-blue-600"
                                : "border-gray-400"
                            }`}
                          >
                            {deliveryType?.type === type.id && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full" />
                            )}
                          </div>
                        </div>
                        <span className="font-medium">{type.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">₹ {type.price}</div>
                        <div className="text-xs text-gray-500">
                          {type.description}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <p className="text-xs text-gray-500 italic">
                  *Delivery date is calculated after the date of pickup.
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                ← Back
              </Button>
              <Button
                onClick={handlePayment}
                className="bg-blue-900 hover:bg-blue-950"
                disabled={!deliveryType}
              >
                Proceed to pay
              </Button>
            </div>
          </div>
        </div>

        <div>
          <CompleteOrderSummary securePackage={securePackage} />
        </div>
      </div>
    </div>
  );
}

interface OrderSummaryProps {
  securePackage: boolean;
}

function CompleteOrderSummary({ securePackage }: OrderSummaryProps) {
  const {
    pickupAddress,
    deliveryAddress,
    packageDetails,
    scheduleDetails,
    deliveryType,
  } = useShipping();

  if (
    !pickupAddress ||
    !deliveryAddress ||
    !packageDetails ||
    !scheduleDetails
  ) {
    return null;
  }

  const insuranceCost = securePackage ? 100 : 0;
  const deliveryCost = deliveryType?.price || 0;
  const totalCost = deliveryCost + insuranceCost;

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

      <div className="border-b pb-4 mb-4">
        <h4 className="font-medium mb-3">Pickup Date</h4>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Date:</span>
          <span className="text-sm">{scheduleDetails.date}</span>
        </div>
      </div>

      <div className="border-b pb-4 mb-4">
        <h4 className="font-medium mb-3">Payment Details</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Delivery Charge:</span>
            <span className="text-sm">₹{deliveryCost}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Insurance:</span>
            <span className="text-sm">₹{insuranceCost}</span>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between">
          <span className="font-medium">Total:</span>
          <span className="font-medium">₹{totalCost}</span>
        </div>
      </div>
    </div>
  );
}
