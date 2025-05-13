/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { useShipping } from "../../../context/ShippingContext";
import { AddressForm } from "./AddressForm";
import { Home, Building, Edit, Trash2, Plus } from "lucide-react";

interface SavedAddressesPopupProps {
  type: "pickup" | "delivery";
  isOpen: boolean;
  onClose: () => void;
}

export function SavedAddressesPopup({
  type,
  isOpen,
  onClose,
}: SavedAddressesPopupProps) {
  const {
    savedAddresses,
    setPickupAddress,
    setDeliveryAddress,
    removeSavedAddress,
  } = useShipping();

  const [newAddressModalOpen, setNewAddressModalOpen] = useState(false);
  const [editAddress, setEditAddress] = useState<any>(null);

  const title =
    type === "pickup" ? "Select Pickup Address" : "Select Delivery Address";

  const handleAddressSelect = (address: any) => {
    if (type === "pickup") {
      setPickupAddress(address);
    } else {
      setDeliveryAddress(address);
    }
    onClose();
  };

  const handleEdit = (e: React.MouseEvent, address: any) => {
    e.stopPropagation(); // Prevent selection of the address
    setEditAddress(address);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent selection of the address
    removeSavedAddress(id);
  };

  const handleAddNewAddress = () => {
    setNewAddressModalOpen(true);
    onClose(); // Close the saved addresses popup when opening the new address form
  };

  const handleCloseAddressForm = () => {
    setNewAddressModalOpen(false);
    setEditAddress(null);
  };

  const getAddressIcon = (saveAs: string) => {
    switch (saveAs) {
      case "home":
        return <Home className="w-5 h-5 text-blue-600" />;
      case "work":
        return <Building className="w-5 h-5 text-blue-600" />;
      default:
        return <Home className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>

          <div className="max-h-96 overflow-y-auto py-4">
            {savedAddresses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No addresses saved yet</p>
                <Button
                  onClick={handleAddNewAddress}
                  className="bg-blue-900 hover:bg-blue-950"
                >
                  Add New Address
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {savedAddresses.map((address) => (
                  <div
                    key={address.id}
                    onClick={() => handleAddressSelect(address)}
                    className="border rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors relative group"
                  >
                    <div className="flex items-start">
                      <div className="mr-3 mt-1">
                        {getAddressIcon(address.saveAs)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <p className="font-medium">{address.contactName}</p>
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded uppercase">
                            {address.saveAs}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {address.flatNo}, {address.areaStreet}
                        </p>
                        <p className="text-sm text-gray-600">
                          {address.city}, {address.state} - {address.pincode}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {address.mobileNumber}
                        </p>
                      </div>

                      {/* Edit and Delete buttons */}
                      <div className="absolute right-3 top-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full bg-gray-100"
                          onClick={(e) => handleEdit(e, address)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-600"
                          onClick={(e) => handleDelete(e, address.id || "")}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-between items-center">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>

            {savedAddresses.length > 0 && (
              <Button
                onClick={handleAddNewAddress}
                className="bg-blue-900 hover:bg-blue-950 gap-2"
              >
                <Plus className="w-4 h-4" />
                Add New Address
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Form for adding new address */}
      {newAddressModalOpen && (
        <AddressForm
          type={type}
          isOpen={newAddressModalOpen}
          onClose={handleCloseAddressForm}
        />
      )}

      {/* Form for editing address */}
      {editAddress && (
        <AddressForm
          type={type}
          isOpen={!!editAddress}
          onClose={handleCloseAddressForm}
          editAddress={editAddress}
        />
      )}
    </>
  );
}
