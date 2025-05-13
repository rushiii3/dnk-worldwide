/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { PackagingTips } from "../../../components/shipping/PackagingTips";
import { useShipping } from "../../../context/ShippingContext";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Box,
  Package,
  Gift,
  FileText,
  ShoppingBag,
  Cpu,
  Coffee,
  Briefcase,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../components/ui/accordion";

// Define package option types
type PackageOption = {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
};

export default function PackagePage() {
  const router = useRouter();
  const {
    activeStep,
    setActiveStep,
    pickupAddress,
    deliveryAddress,
    packageDetails,
    setPackageDetails,
  } = useShipping();

  // Package type options
  const packageTypes: PackageOption[] = [
    {
      id: "box",
      title: "Box",
      description: "Standard cardboard box suitable for most items",
      icon: <Box className="w-8 h-8 text-blue-500" />,
    },
    {
      id: "envelope",
      title: "Envelope",
      description:
        "Paper or bubble wrap envelope for documents and small items",
      icon: <Package className="w-8 h-8 text-blue-500" />,
    },
    {
      id: "custom",
      title: "Custom Packaging",
      description: "Use your own packaging with custom dimensions",
      icon: <Gift className="w-8 h-8 text-blue-500" />,
    },
  ];

  // Package content options
  const contentTypes: PackageOption[] = [
    {
      id: "documents",
      title: "Documents",
      description: "Papers, contracts, certificates, etc.",
      icon: <FileText className="w-8 h-8 text-blue-500" />,
    },
    {
      id: "clothing",
      title: "Clothing & Textile",
      description: "Apparel, fabrics, and textile products",
      icon: <ShoppingBag className="w-8 h-8 text-blue-500" />,
    },
    {
      id: "electronics",
      title: "Electronics",
      description: "Electronic devices, gadgets, and accessories",
      icon: <Cpu className="w-8 h-8 text-blue-500" />,
    },
    {
      id: "food",
      title: "Food Items",
      description: "Non-perishable food items and groceries",
      icon: <Coffee className="w-8 h-8 text-blue-500" />,
    },
    {
      id: "gifts",
      title: "Gifts & Merchandise",
      description: "Gift items, souvenirs, and merchandise",
      icon: <Gift className="w-8 h-8 text-blue-500" />,
    },
    {
      id: "other",
      title: "Other",
      description: "Any other items not listed above",
      icon: <Briefcase className="w-8 h-8 text-blue-500" />,
    },
  ];

  // Weight options
  const weightRanges: PackageOption[] = [
    {
      id: "0-500g",
      title: "0 - 500g",
      description: "Letters, documents, small items",
    },
    {
      id: "500g-1kg",
      title: "500g - 1kg",
      description: "Books, small packages",
    },
    { id: "1kg-5kg", title: "1kg - 5kg", description: "Medium-sized items" },
    { id: "5kg-10kg", title: "5kg - 10kg", description: "Larger packages" },
    { id: "10kg-20kg", title: "10kg - 20kg", description: "Heavy items" },
    {
      id: "20kg-50kg",
      title: "20kg - 50kg",
      description: "Very heavy shipments",
    },
  ];

  const [formData, setFormData] = useState({
    packaging: packageDetails?.packaging || "",
    weight: packageDetails?.weight || "",
    content: packageDetails?.content || "",
    value: packageDetails?.value || "",
    length: packageDetails?.length || "",
    width: packageDetails?.width || "",
    height: packageDetails?.height || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeAccordion, setActiveAccordion] = useState<string | null>(
    "packaging"
  );

  // Add animation effect when opening accordion sections
  useEffect(() => {
    // First open the packaging section by default
    if (!activeAccordion && !formData.packaging) {
      setActiveAccordion("packaging");
    }

    // Auto-advance to weight section after packaging selection
    if (
      formData.packaging &&
      !formData.weight &&
      activeAccordion !== "weight"
    ) {
      const timer = setTimeout(() => {
        setActiveAccordion("weight");
      }, 300);
      return () => clearTimeout(timer);
    }

    // Auto-advance to content section after weight selection
    if (formData.weight && !formData.content && activeAccordion !== "content") {
      const timer = setTimeout(() => {
        setActiveAccordion("content");
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [formData.packaging, formData.weight, formData.content, activeAccordion]);

  if (!pickupAddress || !deliveryAddress) {
    // Redirect to address page if addresses are not provided
    router.push("/shipping/address");
    return null;
  }

  const handleOptionSelect = (category: string, value: string) => {
    setFormData({
      ...formData,
      [category]: value,
    });

    // Clear error when user makes a selection
    if (errors[category]) {
      setErrors({
        ...errors,
        [category]: "",
      });
    }
  };

  const handleInputChange = (name: string, value: string) => {
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

    if (!formData.packaging) {
      newErrors.packaging = "Please select packaging type";
    }

    if (!formData.weight) {
      newErrors.weight = "Please select parcel weight";
    }

    if (!formData.content) {
      newErrors.content = "Please select package content";
    }

    if (!formData.value) {
      newErrors.value = "Please enter package value";
    }

    // Validate custom dimensions if custom packaging is selected
    if (formData.packaging === "custom") {
      if (!formData.length) {
        newErrors.length = "Please enter package length";
      }
      if (!formData.width) {
        newErrors.width = "Please enter package width";
      }
      if (!formData.height) {
        newErrors.height = "Please enter package height";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      setPackageDetails(formData);
      setActiveStep(2);
      router.push("/shipping/schedule");
    }
  };

  const handleBack = () => {
    setActiveStep(0);
    router.push("/shipping/address");
  };

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="col-span-1 lg:col-span-3">
          <div className="bg-blue-50 p-6 rounded-lg">
            <Link
              href="/shipping/address"
              className="flex items-center text-blue-600 mb-4 hover:text-blue-800 transition-colors"
              onClick={handleBack}
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Back to Address
            </Link>

            <h2 className="text-xl font-medium mb-6">Package Details</h2>

            <div className="space-y-6">
              {/* Packaging Type Accordion */}
              <Accordion
                type="single"
                collapsible
                value={activeAccordion === "packaging" ? "packaging" : ""}
                onValueChange={(value) => setActiveAccordion(value || null)}
                className="shadow-sm"
              >
                <AccordionItem value="packaging" className="border-blue-100">
                  <AccordionTrigger className="text-left">
                    <div className="flex w-full justify-between">
                      <span>Select Packaging Type</span>
                      {formData.packaging && (
                        <span className="text-blue-600 mr-2">
                          {packageTypes.find(
                            (type) => type.id === formData.packaging
                          )?.title || formData.packaging}
                        </span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {packageTypes.map((type) => (
                        <div
                          key={type.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            formData.packaging === type.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                          onClick={() =>
                            handleOptionSelect("packaging", type.id)
                          }
                        >
                          <div className="flex flex-col items-center text-center">
                            {type.icon}
                            <h3 className="font-medium mt-2">{type.title}</h3>
                            <p className="text-xs text-gray-500 mt-1">
                              {type.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {errors.packaging && (
                      <p className="text-xs text-red-500 mt-2">
                        {errors.packaging}
                      </p>
                    )}

                    {/* Custom Package Dimensions (shown only when custom packaging is selected) */}
                    {formData.packaging === "custom" && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="length">Length (cm)</Label>
                          <Input
                            id="length"
                            type="number"
                            placeholder="Length"
                            value={formData.length}
                            onChange={(e) =>
                              handleInputChange("length", e.target.value)
                            }
                            className={errors.length ? "border-red-500" : ""}
                          />
                          {errors.length && (
                            <p className="text-xs text-red-500">
                              {errors.length}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="width">Width (cm)</Label>
                          <Input
                            id="width"
                            type="number"
                            placeholder="Width"
                            value={formData.width}
                            onChange={(e) =>
                              handleInputChange("width", e.target.value)
                            }
                            className={errors.width ? "border-red-500" : ""}
                          />
                          {errors.width && (
                            <p className="text-xs text-red-500">
                              {errors.width}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="height">Height (cm)</Label>
                          <Input
                            id="height"
                            type="number"
                            placeholder="Height"
                            value={formData.height}
                            onChange={(e) =>
                              handleInputChange("height", e.target.value)
                            }
                            className={errors.height ? "border-red-500" : ""}
                          />
                          {errors.height && (
                            <p className="text-xs text-red-500">
                              {errors.height}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Weight Accordion */}
              <Accordion
                type="single"
                collapsible
                value={activeAccordion === "weight" ? "weight" : ""}
                onValueChange={(value) => setActiveAccordion(value || null)}
                className="shadow-sm"
              >
                <AccordionItem value="weight" className="border-blue-100">
                  <AccordionTrigger className="text-left">
                    <div className="flex w-full justify-between">
                      <span>Choose Parcel Weight</span>
                      {formData.weight && (
                        <span className="text-blue-600 mr-2">
                          {weightRanges.find(
                            (weight) => weight.id === formData.weight
                          )?.title || formData.weight}
                        </span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {weightRanges.map((range) => (
                        <div
                          key={range.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            formData.weight === range.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                          onClick={() => handleOptionSelect("weight", range.id)}
                        >
                          <h3 className="font-medium">{range.title}</h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {range.description}
                          </p>
                        </div>
                      ))}
                    </div>
                    {errors.weight && (
                      <p className="text-xs text-red-500 mt-2">
                        {errors.weight}
                      </p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Content Type Accordion */}
              <Accordion
                type="single"
                collapsible
                value={activeAccordion === "content" ? "content" : ""}
                onValueChange={(value) => setActiveAccordion(value || null)}
                className="shadow-sm"
              >
                <AccordionItem value="content" className="border-blue-100">
                  <AccordionTrigger className="text-left">
                    <div className="flex w-full justify-between">
                      <span>Choose Package Content</span>
                      {formData.content && (
                        <span className="text-blue-600 mr-2">
                          {contentTypes.find(
                            (content) => content.id === formData.content
                          )?.title || formData.content}
                        </span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {contentTypes.map((content) => (
                        <div
                          key={content.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            formData.content === content.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                          onClick={() =>
                            handleOptionSelect("content", content.id)
                          }
                        >
                          <div className="flex flex-col items-center text-center">
                            {content.icon}
                            <h3 className="font-medium mt-2">
                              {content.title}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                              {content.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {errors.content && (
                      <p className="text-xs text-red-500 mt-2">
                        {errors.content}
                      </p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Package Value */}
              <div className="space-y-2">
                <Label htmlFor="value">Package Value (INR)</Label>
                <Input
                  id="value"
                  placeholder="Enter package value in INR"
                  value={formData.value}
                  onChange={(e) => handleInputChange("value", e.target.value)}
                  className={errors.value ? "border-red-500" : ""}
                />
                {errors.value && (
                  <p className="text-xs text-red-500">{errors.value}</p>
                )}
              </div>
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
          <OrderSummary />
          <PackagingTips />
        </div>
      </div>
    </div>
  );
}

function OrderSummary() {
  const { pickupAddress, deliveryAddress, packageDetails } = useShipping();

  if (!pickupAddress || !deliveryAddress) return null;

  // Helper function to get the display name of selected options
  const getDisplayValue = (type: string, value: string | undefined) => {
    if (!value) return "Not selected";

    switch (type) {
      case "packaging":
        return value.charAt(0).toUpperCase() + value.slice(1);
      case "weight":
        return value;
      case "content":
        const contentMap: Record<string, string> = {
          documents: "Documents",
          clothing: "Clothing & Textile",
          electronics: "Electronics",
          food: "Food Items",
          gifts: "Gifts & Merchandise",
          other: "Other",
        };
        return contentMap[value] || value;
      default:
        return value;
    }
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-xl text-blue-600 mb-6">Order Summary</h3>

      <div className="border-b pb-4 mb-4">
        <h4 className="font-medium mb-3">Address Details</h4>

        <div className="flex items-start gap-3 mb-4">
          <div className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center mt-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          </div>
          <div>
            <p className="font-medium">{pickupAddress.contactName} (Pickup)</p>
            <p className="text-xs text-gray-500">
              {pickupAddress.state} (+
              {pickupAddress.mobileNumber.substring(0, 6)}...)
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center mt-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          </div>
          <div>
            <p className="font-medium">
              {deliveryAddress.contactName} (Delivery)
            </p>
            <p className="text-xs text-gray-500">
              {deliveryAddress.state} (+
              {deliveryAddress.mobileNumber.substring(0, 6)}...)
            </p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-3">Package Details</h4>
        {packageDetails ? (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Packaging:</span>
              <span>
                {getDisplayValue("packaging", packageDetails.packaging)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Weight:</span>
              <span>{getDisplayValue("weight", packageDetails.weight)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Content:</span>
              <span>{getDisplayValue("content", packageDetails.content)}</span>
            </div>
            {packageDetails.value && (
              <div className="flex justify-between">
                <span className="text-gray-500">Value:</span>
                <span>₹{packageDetails.value}</span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-600">Please complete this section</p>
        )}
      </div>
    </div>
  );
}
