'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CreateOrderRequest, OrderItem } from '@/utils/type';
import { useAuth } from '@/lib/auth-context';
import { useCreateOrder, useCheckOrderStatus, useGetPaymentLink, useDiscountCode } from '@/hook/useOrder';
import { OrderProcessStep } from '../ProcessingOverlay';
import { CustomerInfo } from '../CustomerForm';

interface UseOrderProcessingProps {
    orderItems: OrderItem[];
    deliveryOption: 'pickup' | 'delivery';
    selectedPaymentMethod: string;
    totalFromCart: number;
    customerInfo: CustomerInfo;
    selectedDiscountCode?: string | null;
}

export const useOrderProcessing = ({
    orderItems,
    deliveryOption,
    selectedPaymentMethod,
    totalFromCart,
    customerInfo,
    selectedDiscountCode
}: UseOrderProcessingProps) => {
    const { user } = useAuth();
    const router = useRouter();
    const { mutateAsync: createOrder } = useCreateOrder();
    const { mutateAsync: checkStatus } = useCheckOrderStatus();
    const { mutateAsync: getPayment } = useGetPaymentLink();
    const [currentStep, setCurrentStep] = useState<OrderProcessStep>(OrderProcessStep.FORM_FILLING);
    const [isProcessing, setIsProcessing] = useState(false);
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

    const validateOrderForm = () => {
        const errors: { [key: string]: string } = {};

        if (orderItems.length === 0) {
            toast.error('Vui lòng chọn món để đặt hàng.');
            return false;
        }

        if (!customerInfo.name.trim()) {
            errors.name = 'Vui lòng nhập họ tên.';
        }

        if (!customerInfo.phone.trim()) {
            errors.phone = 'Vui lòng nhập số điện thoại.';
        } else if (!/^[0-9]{10,11}$/.test(customerInfo.phone.replace(/\s/g, ''))) {
            errors.phone = 'Số điện thoại không hợp lệ.';
        }

        if (deliveryOption === 'delivery' && !customerInfo.address.trim()) {
            errors.address = 'Vui lòng nhập địa chỉ giao hàng.';
        }

        if (!selectedPaymentMethod) {
            errors.payment = 'Vui lòng chọn phương thức thanh toán.';
        }

        setValidationErrors(errors);

        if (Object.keys(errors).length > 0) {
            const firstError = Object.values(errors)[0];
            toast.error(firstError);
            return false;
        }

        return true;
    };

    const handlePlaceOrder = async () => {
        if (!validateOrderForm()) return;

        setIsProcessing(true);

        try {
            // Step 1: Tạo đơn hàng
            setCurrentStep(OrderProcessStep.CREATING_ORDER);

            const payload: CreateOrderRequest = {
                order: {
                    userId: user?.id ?? 0,
                    totalAmount: totalFromCart,
                    deliveryAddress: deliveryOption === 'delivery' ? customerInfo.address : 'Store Pickup',
                    discountCode: selectedDiscountCode || undefined,
                },
                orderItemList: orderItems,
            };

            const result = await createOrder(payload);
            const orderId = result.orderId;
            // console.log('Order created:', result);
            if (!orderId) throw new Error('Không có orderId trả về');

            toast.success('Đơn hàng đã được tạo thành công!');

            // Step 2: Kiểm tra trạng thái đơn hàng
            setCurrentStep(OrderProcessStep.CHECKING_STATUS);
            const statusRes = await checkStatus(orderId);
            // console.log('Order status:', statusRes);
            if (statusRes === 'NOT FOUND') {
                throw new Error('Đơn hàng không tồn tại');
            }
            if (statusRes === 'CANCELLED') {
                throw new Error('Đơn hàng đã bị huỷ');
            }
            if (statusRes === 'COMPLETED') {
                toast.success('Đơn hàng đã được hoàn thành');
                router.push(`/order-success?orderId=${orderId}`);
                return;
            }

            if (statusRes === 'PENDING') {
                const intervalId = setInterval(async () => {
                    try {
                        const status = await checkStatus(orderId);
                        if (status === 'READY_FOR_PAYMENT') {
                            clearInterval(intervalId);
                            const paymentLink = await getPayment({
                                orderId,
                                paymentMethod: selectedPaymentMethod,
                                discountCode: selectedDiscountCode || undefined,
                            });
                            setCurrentStep(OrderProcessStep.PROCESSING_PAYMENT);
                            if (paymentLink) {
                                setCurrentStep(OrderProcessStep.REDIRECTING);
                                window.location.href = paymentLink;
                            } else {
                                throw new Error('Không có link thanh toán');
                            }
                        }
                        if(status=== 'CANCELLED') {
                            clearInterval(intervalId);
                            toast.error('Kho Không đủ hàng');
                            router.push('/cart');
                        }
                    } catch (err) {
                        console.error('❌ Lỗi khi kiểm tra trạng thái đơn:', err);
                        clearInterval(intervalId);
                    }
                }, 1000);
            }

        } catch (error) {
            console.error('❌ Lỗi khi đặt hàng:', error);
            toast.error(error instanceof Error ? error.message : 'Đặt hàng thất bại. Vui lòng thử lại.');
            setCurrentStep(OrderProcessStep.FORM_FILLING);
              setIsProcessing(false);
        } 
    };

    return {
        currentStep,
        isProcessing,
        validationErrors,
        setValidationErrors,
        handlePlaceOrder
    };
};
