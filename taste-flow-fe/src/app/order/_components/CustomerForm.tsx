'use client';

import { User, Phone, MapPin, Receipt, AlertCircle } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface CustomerInfo {
    name: string;
    phone: string;
    address: string;
    note: string;
}

interface CustomerFormProps {
    customerInfo: CustomerInfo;
    setCustomerInfo: (info: CustomerInfo) => void;
    deliveryOption: 'pickup' | 'delivery';
    validationErrors: {[key: string]: string};
    setValidationErrors: (errors: {[key: string]: string}) => void;
}

export default function CustomerForm({ 
    customerInfo, 
    setCustomerInfo, 
    deliveryOption, 
    validationErrors, 
    setValidationErrors 
}: CustomerFormProps) {
    return (
        <div className="bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] rounded-2xl p-6 border border-[#3A3A3A]">
            <div className="flex items-center gap-3 mb-6">
                <User className="text-[#F26D16]" size={24} />
                <h2 className="text-2xl font-bold text-white">Customer Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-white font-semibold mb-2">
                        <User className="inline mr-2" size={16} />
                        Full Name
                    </label>
                    <Input
                        value={customerInfo.name}
                        onChange={(e) => {
                            setCustomerInfo({ ...customerInfo, name: e.target.value });
                            if (validationErrors.name) {
                                setValidationErrors({ ...validationErrors, name: '' });
                            }
                        }}
                        placeholder="Enter your full name"
                        className={`bg-[#1A1A1A] border-[#3A3A3A] text-white placeholder-[#858787] ${
                            validationErrors.name ? 'border-red-500' : ''
                        }`}
                    />
                    {validationErrors.name && (
                        <p className="text-red-400 text-xs mt-1 flex items-center">
                            <AlertCircle size={12} className="mr-1" />
                            {validationErrors.name}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-white font-semibold mb-2">
                        <Phone className="inline mr-2" size={16} />
                        Phone Number
                    </label>
                    <Input
                        value={customerInfo.phone}
                        onChange={(e) => {
                            setCustomerInfo({ ...customerInfo, phone: e.target.value });
                            if (validationErrors.phone) {
                                setValidationErrors({ ...validationErrors, phone: '' });
                            }
                        }}
                        placeholder="Enter your phone number"
                        className={`bg-[#1A1A1A] border-[#3A3A3A] text-white placeholder-[#858787] ${
                            validationErrors.phone ? 'border-red-500' : ''
                        }`}
                    />
                    {validationErrors.phone && (
                        <p className="text-red-400 text-xs mt-1 flex items-center">
                            <AlertCircle size={12} className="mr-1" />
                            {validationErrors.phone}
                        </p>
                    )}
                </div>

                <div className="md:col-span-2">
                    <label className="block text-white font-semibold mb-2">
                        <MapPin className="inline mr-2" size={16} />
                        {deliveryOption === 'delivery' ? 'Delivery Address' : 'Pickup Location'}
                    </label>
                    {deliveryOption === 'delivery' ? (
                        <>
                            <Input
                                value={customerInfo.address}
                                onChange={(e) => {
                                    setCustomerInfo({ ...customerInfo, address: e.target.value });
                                    if (validationErrors.address) {
                                        setValidationErrors({ ...validationErrors, address: '' });
                                    }
                                }}
                                placeholder="Enter your delivery address"
                                className={`bg-[#1A1A1A] border-[#3A3A3A] text-white placeholder-[#858787] ${
                                    validationErrors.address ? 'border-red-500' : ''
                                }`}
                            />
                            {validationErrors.address && (
                                <p className="text-red-400 text-xs mt-1 flex items-center">
                                    <AlertCircle size={12} className="mr-1" />
                                    {validationErrors.address}
                                </p>
                            )}
                        </>
                    ) : (
                        <div className="bg-[#1A1A1A] border border-[#3A3A3A] rounded-md p-3">
                            <p className="text-white font-medium">TasteFlow Main Store</p>
                            <p className="text-[#858787] text-sm">123 Food Street, District 1, Ho Chi Minh City</p>
                            <p className="text-[#F26D16] text-sm font-medium mt-1">Open: 8:00 AM - 10:00 PM</p>
                        </div>
                    )}
                </div>

                <div className="md:col-span-2">
                    <label className="block text-white font-semibold mb-2">
                        <Receipt className="inline mr-2" size={16} />
                        Order Note (Optional)
                    </label>
                    <Input
                        value={customerInfo.note}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, note: e.target.value })}
                        placeholder="Special requests or notes"
                        className="bg-[#1A1A1A] border-[#3A3A3A] text-white placeholder-[#858787]"
                    />
                </div>
            </div>
        </div>
    );
}

export type { CustomerInfo };
