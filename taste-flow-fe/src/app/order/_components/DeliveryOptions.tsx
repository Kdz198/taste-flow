'use client';

import { Clock } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";

interface DeliveryOptionsProps {
    deliveryOption: 'pickup' | 'delivery';
    setDeliveryOption: (option: 'pickup' | 'delivery') => void;
}

export default function DeliveryOptions({ deliveryOption, setDeliveryOption }: DeliveryOptionsProps) {
    return (
        <div className="bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] rounded-2xl p-6 border border-[#3A3A3A]">
            <div className="flex items-center gap-3 mb-6">
                <Clock className="text-[#F26D16]" size={24} />
                <h2 className="text-2xl font-bold text-white">Delivery Options</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        deliveryOption === 'delivery'
                            ? 'border-[#F26D16] bg-[#F26D16]/10'
                            : 'border-[#3A3A3A] hover:border-[#F26D16]/50'
                    }`}
                    onClick={() => setDeliveryOption('delivery')}
                >
                    <div className="flex items-center gap-3">
                        <Checkbox
                            checked={deliveryOption === 'delivery'}
                            className="data-[state=checked]:bg-[#F26D16] data-[state=checked]:border-[#F26D16]"
                        />
                        <div>
                            <h3 className="text-white font-semibold">Home Delivery</h3>
                            <p className="text-[#858787] text-sm">Delivery fee: 15,000 VND</p>
                            <p className="text-[#858787] text-sm">Estimated time: 30-45 minutes</p>
                        </div>
                    </div>
                </div>

                <div
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        deliveryOption === 'pickup'
                            ? 'border-[#F26D16] bg-[#F26D16]/10'
                            : 'border-[#3A3A3A] hover:border-[#F26D16]/50'
                    }`}
                    onClick={() => setDeliveryOption('pickup')}
                >
                    <div className="flex items-center gap-3">
                        <Checkbox
                            checked={deliveryOption === 'pickup'}
                            className="data-[state=checked]:bg-[#F26D16] data-[state=checked]:border-[#F26D16]"
                        />
                        <div>
                            <h3 className="text-white font-semibold">Store Pickup</h3>
                            <p className="text-[#858787] text-sm">No delivery fee</p>
                            <p className="text-[#858787] text-sm">Ready in: 15-20 minutes</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
