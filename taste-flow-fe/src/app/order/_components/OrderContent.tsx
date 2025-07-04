'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
    CreditCard,
    Clock,
    MapPin,
    Phone,
    User,
    ShoppingCart,
    Receipt,
    CheckCircle2,
    Smartphone,
    Building2,
    ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import productApiRequest from '@/apiRequest/product';
import { FoodType } from '@/schemaValidations/product-schema';

interface OrderItem extends FoodType {
    quantity: number;
}

interface PaymentMethod {
    id: string;
    name: string;
    icon: React.ReactNode;
    description: string;
}

export default function OrderContent() {
    const searchParams = useSearchParams();
    const { itemAddCart, userId } = useSelector((state: RootState) => state.order);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('momo');
    const [deliveryOption, setDeliveryOption] = useState<'pickup' | 'delivery'>('delivery');
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        phone: '',
        address: '',
        note: ''
    });

    // Get selected items from URL params
    const selectedItemIds = searchParams.get('selectedItems')?.split(',') || [];
    const totalFromCart = Number(searchParams.get('total')) || 0;

    const paymentMethods: PaymentMethod[] = [
        {
            id: 'momo',
            name: 'MoMo Wallet',
            icon: <Smartphone className="text-pink-500" size={24} />,
            description: 'Pay quickly with MoMo e-wallet'
        },
        {
            id: 'vnpay',
            name: 'VNPay',
            icon: <CreditCard className="text-blue-500" size={24} />,
            description: 'Secure payment with VNPay gateway'
        },
        {
            id: 'cod',
            name: 'Cash on Delivery',
            icon: <Building2 className="text-green-500" size={24} />,
            description: 'Pay when you receive your order'
        }
    ];

    // Fetch selected items details
    useEffect(() => {
        const fetchOrderItems = async () => {
            try {
                if (selectedItemIds.length === 0) {
                    setOrderItems([]);
                    setLoading(false);
                    return;
                }

                const response = await productApiRequest.getList();
                const allProducts = response.payload;
                
                const itemsWithDetails = selectedItemIds.map(itemId => {
                    const product = allProducts.find((p: FoodType) => p._id === itemId);
                    const quantity = itemAddCart[itemId] || 1;
                    return product ? { ...product, quantity } : null;
                }).filter(Boolean) as OrderItem[];

                setOrderItems(itemsWithDetails);
            } catch (error) {
                console.error('Error fetching order items:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderItems();
    }, [selectedItemIds, itemAddCart]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const handlePlaceOrder = () => {
        const orderData = {
            userId,
            items: orderItems.map(item => ({
                productId: item._id,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            })),
            paymentMethod: selectedPaymentMethod,
            deliveryOption,
            customerInfo,
            total: deliveryOption === 'delivery' ? totalFromCart : totalFromCart - 15000,
            orderDate: new Date().toISOString()
        };

        console.log('Order Data:', orderData);
        // Here you would send the order to your backend API
        alert(`Order placed successfully with ${selectedPaymentMethod.toUpperCase()}! (This is a demo)`);
    };

    if (loading) {
        return (
            <div className="text-center py-16">
                <div className="text-4xl mb-4">⏳</div>
                <p className="text-[#858787]">Loading your order...</p>
            </div>
        );
    }

    if (orderItems.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="text-6xl mb-6">📦</div>
                <h3 className="text-2xl font-bold text-white mb-4">No items selected</h3>
                <p className="text-[#858787] mb-8 max-w-md mx-auto">
                    You haven't selected any items to order. 
                    Please go back to your cart and select items to proceed.
                </p>
                <Link href="/cart">
                    <Button className="bg-[#F26D16] hover:bg-orange-600 text-white rounded-full px-8 py-3 font-semibold transition-all duration-300 hover:scale-105">
                        <ArrowLeft className="mr-2" size={18} />
                        Back to Cart
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Items & Customer Info */}
            <div className="lg:col-span-2 space-y-6">
                {/* Order Items */}
                <div className="bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] rounded-2xl p-6 border border-[#3A3A3A]">
                    <div className="flex items-center gap-3 mb-6">
                        <ShoppingCart className="text-[#F26D16]" size={24} />
                        <h2 className="text-2xl font-bold text-white">Order Items ({orderItems.length})</h2>
                    </div>

                    <div className="space-y-4">
                        {orderItems.map((item) => (
                            <div 
                                key={item._id}
                                className="flex items-center gap-4 p-4 bg-[#1A1A1A] rounded-xl border border-[#F26D16]/30"
                            >
                                {/* Item Image */}
                                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                                    <img
                                        src="https://img.freepik.com/premium-photo/food-photography-4k_839182-2114.jpg"
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Item Info */}
                                <div className="flex-1">
                                    <h3 className="text-white font-semibold text-lg mb-1">{item.name}</h3>
                                    <p className="text-[#F26D16] font-bold text-lg">
                                        {formatPrice(item.price)}
                                    </p>
                                    <p className="text-[#858787] text-sm">
                                        Quantity: {item.quantity}
                                    </p>
                                </div>

                                {/* Item Total */}
                                <div className="text-right">
                                    <p className="text-white font-bold text-lg">
                                        {formatPrice(item.price * item.quantity)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Customer Information */}
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
                                onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                                placeholder="Enter your full name"
                                className="bg-[#1A1A1A] border-[#3A3A3A] text-white placeholder-[#858787]"
                            />
                        </div>

                        <div>
                            <label className="block text-white font-semibold mb-2">
                                <Phone className="inline mr-2" size={16} />
                                Phone Number
                            </label>
                            <Input
                                value={customerInfo.phone}
                                onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                                placeholder="Enter your phone number"
                                className="bg-[#1A1A1A] border-[#3A3A3A] text-white placeholder-[#858787]"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-white font-semibold mb-2">
                                <MapPin className="inline mr-2" size={16} />
                                Delivery Address
                            </label>
                            <Input
                                value={customerInfo.address}
                                onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                                placeholder="Enter your delivery address"
                                className="bg-[#1A1A1A] border-[#3A3A3A] text-white placeholder-[#858787]"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-white font-semibold mb-2">
                                <Receipt className="inline mr-2" size={16} />
                                Order Note (Optional)
                            </label>
                            <Input
                                value={customerInfo.note}
                                onChange={(e) => setCustomerInfo({...customerInfo, note: e.target.value})}
                                placeholder="Special requests or notes"
                                className="bg-[#1A1A1A] border-[#3A3A3A] text-white placeholder-[#858787]"
                            />
                        </div>
                    </div>
                </div>

                {/* Delivery Options */}
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
            </div>

            {/* Payment & Order Summary */}
            <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] rounded-2xl p-6 border border-[#3A3A3A] sticky top-8 space-y-6">
                    {/* Payment Methods */}
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4">Payment Method</h2>
                        <div className="space-y-3">
                            {paymentMethods.map((method) => (
                                <div 
                                    key={method.id}
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                                        selectedPaymentMethod === method.id 
                                            ? 'border-[#F26D16] bg-[#F26D16]/10' 
                                            : 'border-[#3A3A3A] hover:border-[#F26D16]/50'
                                    }`}
                                    onClick={() => setSelectedPaymentMethod(method.id)}
                                >
                                    <div className="flex items-center gap-3">
                                        <Checkbox
                                            checked={selectedPaymentMethod === method.id}
                                            className="data-[state=checked]:bg-[#F26D16] data-[state=checked]:border-[#F26D16]"
                                        />
                                        {method.icon}
                                        <div>
                                            <h3 className="text-white font-semibold text-sm">{method.name}</h3>
                                            <p className="text-[#858787] text-xs">{method.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div>
                        <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>
                        
                        <div className="space-y-3 mb-4">
                            <div className="flex justify-between text-[#858787]">
                                <span>Subtotal ({orderItems.length} items)</span>
                                <span>{formatPrice(totalFromCart - (deliveryOption === 'delivery' ? 15000 : 0))}</span>
                            </div>
                            <div className="flex justify-between text-[#858787]">
                                <span>Delivery Fee</span>
                                <span>{deliveryOption === 'delivery' ? formatPrice(15000) : 'Free'}</span>
                            </div>
                            <div className="border-t border-[#3A3A3A] pt-3">
                                <div className="flex justify-between text-white text-xl font-bold">
                                    <span>Total</span>
                                    <span className="text-[#F26D16]">
                                        {formatPrice(deliveryOption === 'delivery' ? totalFromCart : totalFromCart - 15000)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Customer Summary */}
                        <div className="p-4 bg-[#1A1A1A] rounded-xl border border-[#3A3A3A] mb-4">
                            <h3 className="text-white font-semibold mb-2">Customer</h3>
                            <p className="text-[#858787] text-sm">
                                {userId || "Guest User"}
                            </p>
                        </div>

                        {/* Place Order Button */}
                        <Button 
                            onClick={handlePlaceOrder} 
                            className="w-full bg-[#F26D16] hover:bg-orange-600 text-white rounded-xl py-3 font-semibold text-lg transition-all duration-300 hover:scale-[1.02]"
                        >
                            <CreditCard className="mr-2" size={18} />
                            Place Order - {formatPrice(deliveryOption === 'delivery' ? totalFromCart : totalFromCart - 15000)}
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
                </div>
            </div>
        </div>
    );
}
