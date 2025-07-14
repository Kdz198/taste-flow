'use client';

import { AlertCircle, Smartphone, CreditCard, Building2 } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";

interface PaymentMethod {
    id: string;
    name: string;
    icon: React.ReactNode;
    description: string;
}

interface PaymentMethodsProps {
    selectedPaymentMethod: string;
    setSelectedPaymentMethod: (method: string) => void;
    validationErrors: {[key: string]: string};
    setValidationErrors: (errors: {[key: string]: string}) => void;
}

const paymentMethods: PaymentMethod[] = [
    {
        id: 'MOMO',
        name: 'MoMo Wallet',
        icon: <Smartphone className="text-pink-500" size={24} />,
        description: 'Pay quickly with MoMo e-wallet'
    },
    {
        id: 'VNPAY',
        name: 'VNPay',
        icon: <CreditCard className="text-blue-500" size={24} />,
        description: 'Secure payment with VNPay gateway'
    },
    {
        id: 'CASH',
        name: 'Cash on Delivery',
        icon: <Building2 className="text-green-500" size={24} />,
        description: 'Pay when you receive your order'
    }
];

export default function PaymentMethods({ 
    selectedPaymentMethod, 
    setSelectedPaymentMethod, 
    validationErrors, 
    setValidationErrors 
}: PaymentMethodsProps) {
    return (
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
                        } ${validationErrors.payment ? 'border-red-500/50' : ''}`}
                        onClick={() => {
                            setSelectedPaymentMethod(method.id);
                            if (validationErrors.payment) {
                                setValidationErrors({ ...validationErrors, payment: '' });
                            }
                        }}
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
            {validationErrors.payment && (
                <p className="text-red-400 text-xs mt-2 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {validationErrors.payment}
                </p>
            )}
        </div>
    );
}

export { paymentMethods };
export type { PaymentMethod };
