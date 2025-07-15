'use client';

import { CreditCard, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { OrderItem } from '@/utils/type';
import { paymentMethods } from './PaymentMethods';

interface OrderSummaryProps {
    orderItems: OrderItem[];
    totalFromCart: number;
    deliveryOption: 'pickup' | 'delivery';
    selectedPaymentMethod: string;
    user: any;
    customerInfo: any;
    isProcessing: boolean;
    formatPrice: (price: number) => string;
    handlePlaceOrder: () => void;
    menuList?: any[];
}

export default function OrderSummary({
    orderItems,
    totalFromCart,
    deliveryOption,
    selectedPaymentMethod,
    user,
    customerInfo,
    isProcessing,
    formatPrice,
    handlePlaceOrder,
    menuList
}: OrderSummaryProps) {
    return (
        <div>
            <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4">
                <div className="flex justify-between text-[#858787]">
                    <span>Subtotal ({orderItems.length} items)</span>
                    <span>{formatPrice(totalFromCart)}</span>
                </div>
                {/* <div className="flex justify-between text-[#858787]">
                    <span>Delivery Fee</span>
                    <span>{deliveryOption === 'delivery' ? formatPrice(15000) : 'Free'}</span>
                </div> */}
                <div className="border-t border-[#3A3A3A] pt-3">
                    <div className="flex justify-between text-white text-xl font-bold">
                        <span>Total</span>
                        <span className="text-[#F26D16]">
                            {formatPrice(totalFromCart)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Customer Summary */}
            <div className="p-4 bg-[#1A1A1A] rounded-xl border border-[#3A3A3A] mb-4">
                <h3 className="text-white font-semibold mb-2">Order Details</h3>
                <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                        <span className="text-[#858787]">Customer:</span>
                        <span className="text-white">{user?.name || customerInfo.name || "Guest User"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[#858787]">Phone:</span>
                        <span className="text-white">{customerInfo.phone || "Not provided"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[#858787]">Method:</span>
                        <span className="text-[#F26D16] font-medium">
                            {deliveryOption === 'delivery' ? 'Home Delivery' : 'Store Pickup'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[#858787]">Payment:</span>
                        <span className="text-[#F26D16] font-medium">
                            {paymentMethods.find(m => m.id === selectedPaymentMethod)?.name || 'Not selected'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Special Notes Summary */}
            {orderItems.some(item => item.notes && item.notes.trim()) && (
                <div className="p-4 bg-[#1A1A1A] rounded-xl border border-[#3A3A3A] mb-4">
                    <h3 className="text-white font-semibold mb-2">Special Notes</h3>
                    <div className="space-y-2 text-sm">
                        {orderItems
                            .filter(item => item.notes && item.notes.trim())
                            .map(item => (
                                <div key={item.dishId} className="flex gap-2">
                                    <span className="text-[#F26D16] font-medium">•</span>
                                    <div>
                                        <span className="text-white font-medium">
                                            {menuList?.find(product => product.id === item.dishId)?.name || `Item #${item.dishId}`}:
                                        </span>
                                        <span className="text-[#858787] ml-2">{item.notes}</span>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* Place Order Button */}
            <Button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className={`w-full rounded-xl py-3 font-semibold text-lg transition-all duration-300 ${
                    isProcessing 
                        ? 'bg-[#858787] cursor-not-allowed' 
                        : 'bg-[#F26D16] hover:bg-orange-600 hover:scale-[1.02]'
                } text-white`}
            >
                {isProcessing ? (
                    <>
                        <Loader2 className="mr-2 animate-spin" size={18} />
                        Processing...
                    </>
                ) : (
                    <>
                        <CreditCard className="mr-2" size={18} />
                        Place Order - {formatPrice(totalFromCart)}
                    </>
                )}
            </Button>

            {/* Back to Cart */}
            <Link href="/cart" className="block mt-4">
                <Button
                    variant="outline"
                    className="w-full border-[#F26D16] text-[#F26D16] hover:bg-[#F26D16] hover:text-white rounded-xl py-2"
                >
                    <ArrowLeft className="mr-2" size={16} />
                    Back to Cart
                </Button>
            </Link>

            {/* Security Note */}
            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                <p className="text-green-400 text-xs text-center">
                    🔒 Your payment information is secure and encrypted
                </p>
            </div>
        </div>
    );
}
