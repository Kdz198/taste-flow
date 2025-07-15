'use client';

import { ShoppingCart, MessageSquare } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { OrderItem } from '@/utils/type';

interface OrderItemsDisplayProps {
    orderItems: OrderItem[];
    menuList: any[] | undefined;
    formatPrice: (price: number) => string;
    onUpdateItemNote: (dishId: number, note: string) => void;
}

export default function OrderItemsDisplay({ orderItems, menuList, formatPrice, onUpdateItemNote }: OrderItemsDisplayProps) {
    return (
        <div className="bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] rounded-2xl p-6 border border-[#3A3A3A]">
            <div className="flex items-center gap-3 mb-6">
                <ShoppingCart className="text-[#F26D16]" size={24} />
                <h2 className="text-2xl font-bold text-white">Order Items ({orderItems.length})</h2>
            </div>

            <div className="space-y-4">
                {orderItems.map((item) => (
                    <div
                        key={item.dishId}
                        className="bg-[#1A1A1A] rounded-xl border border-[#F26D16]/30 overflow-hidden"
                    >
                        {/* Item Details */}
                        <div className="flex items-center gap-4 p-4">
                            {/* Item Image */}
                            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                                <img
                                    src="https://img.freepik.com/premium-photo/food-photography-4k_839182-2114.jpg"
                                    alt={menuList?.find(product => product.id === item.dishId)?.name || 'Food Item'}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Item Info */}
                            <div className="flex-1">
                                <h3 className="text-white font-semibold text-lg mb-1">
                                    {menuList?.find(product => product.id === item.dishId)?.name || 'Food Item'}
                                </h3>
                                <p className="text-[#F26D16] font-bold text-lg">
                                    {formatPrice(item.unitPrice)}
                                </p>
                                <p className="text-[#858787] text-sm">
                                    Quantity: {item.quantity}
                                </p>
                            </div>

                            {/* Item Total */}
                            <div className="text-right">
                                <p className="text-white font-bold text-lg">
                                    {formatPrice(item.unitPrice * item.quantity)}
                                </p>
                            </div>
                        </div>

                        {/* Item Note Section */}
                        <div className="px-4 pb-4">
                            <div className="border-t border-[#3A3A3A] pt-3">
                                <label className="block text-white font-medium mb-2 text-sm">
                                    <MessageSquare className="inline mr-2" size={14} />
                                    Special note for this item (optional)
                                </label>
                                <Input
                                    value={item.notes || ''}
                                    onChange={(e) => onUpdateItemNote(item.dishId, e.target.value)}
                                    placeholder="e.g., No spicy, extra sauce, well-done, no onions..."
                                    className="bg-[#2A2A2A] border-[#3A3A3A] text-white placeholder-[#858787] text-sm focus:border-[#F26D16] transition-colors"
                                />
                                {item.notes && (
                                    <p className="text-xs text-[#F26D16] mt-1">
                                        ✓ Note will be included with this item
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
