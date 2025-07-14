'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { OrderItem } from '@/utils/type';
import { useAuth } from '@/lib/auth-context';
import { useMenuList } from '@/hook/useMenu';

// Import components
import ProcessingOverlay from './ProcessingOverlay';
import OrderItemsDisplay from './OrderItemsDisplay';
import CustomerForm, { CustomerInfo } from './CustomerForm';
import DeliveryOptions from './DeliveryOptions';
import PaymentMethods from './PaymentMethods';
import OrderSummary from './OrderSummary';
import EmptyStates from './EmptyStates';
import { useOrderProcessing } from './hooks/useOrderProcessing';


export default function OrderContent() {
    const searchParams = useSearchParams()
    const { data: menuList, isLoading } = useMenuList()
    const { user } = useAuth()
    const { orderItemList } = useSelector((state: RootState) => state.order)
    const [orderItems, setOrderItems] = useState<OrderItem[]>(orderItemList)
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('MOMO')
    const [deliveryOption, setDeliveryOption] = useState<'pickup' | 'delivery'>('delivery')
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
        name: user?.name || '',
        phone: user?.phone || '',
        address: '',
        note: ''
    })
    const totalFromCart = useMemo(() => {
        return orderItems.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
    }, [orderItems]);



    // Use custom hook for order processing
    const {
        currentStep,
        isProcessing,
        validationErrors,
        setValidationErrors,
        handlePlaceOrder
    } = useOrderProcessing({
        orderItems,
        totalFromCart,
        deliveryOption,
        selectedPaymentMethod,
        customerInfo
    });
    // Auto-fill customer info khi user đã đăng nhập
    useEffect(() => {
        if (user) {
            setCustomerInfo(prev => ({
                ...prev,
                name: user.name || prev.name,
                phone: user.phone || prev.phone,
            }))
        }
    }, [user])
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price)
    }

    // Handle loading state
    if (isLoading) {
        return <EmptyStates type="loading" />;
    }

    // Handle no items state
    if (orderItems.length === 0) {
        return <EmptyStates type="no-items" />;
    }

    return (
        <>
            <ProcessingOverlay isProcessing={isProcessing} currentStep={currentStep} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Order Items & Customer Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <OrderItemsDisplay
                        orderItems={orderItems}
                        menuList={menuList}
                        formatPrice={formatPrice}
                    />

                    {/* Customer Information */}
                    <CustomerForm
                        customerInfo={customerInfo}
                        setCustomerInfo={setCustomerInfo}
                        deliveryOption={deliveryOption}
                        validationErrors={validationErrors}
                        setValidationErrors={setValidationErrors}
                    />

                    {/* Delivery Options */}
                    <DeliveryOptions
                        deliveryOption={deliveryOption}
                        setDeliveryOption={setDeliveryOption}
                    />
                </div>

                {/* Payment & Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] rounded-2xl p-6 border border-[#3A3A3A] sticky top-8 space-y-6">
                        {/* Payment Methods */}
                        <PaymentMethods
                            selectedPaymentMethod={selectedPaymentMethod}
                            setSelectedPaymentMethod={setSelectedPaymentMethod}
                            validationErrors={validationErrors}
                            setValidationErrors={setValidationErrors}
                        />

                        {/* Order Summary */}
                        <OrderSummary
                            orderItems={orderItems}
                            totalFromCart={totalFromCart}
                            deliveryOption={deliveryOption}
                            selectedPaymentMethod={selectedPaymentMethod}
                            user={user}
                            customerInfo={customerInfo}
                            isProcessing={isProcessing}
                            formatPrice={formatPrice}
                            handlePlaceOrder={handlePlaceOrder}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
