'use client';

import { Loader2, CheckCircle2, Shield } from 'lucide-react';

enum OrderProcessStep {
    FORM_FILLING = 'form_filling',
    CREATING_ORDER = 'creating_order',
    CHECKING_STATUS = 'checking_status',
    PROCESSING_PAYMENT = 'processing_payment',
    REDIRECTING = 'redirecting'
}

interface ProcessingOverlayProps {
    isProcessing: boolean;
    currentStep: OrderProcessStep;
}

const getStepMessage = (currentStep: OrderProcessStep) => {
    switch (currentStep) {
        case OrderProcessStep.CREATING_ORDER:
            return 'Đang tạo đơn hàng...';
        case OrderProcessStep.CHECKING_STATUS:
            return 'Đang kiểm tra trạng thái đơn hàng...';
        case OrderProcessStep.PROCESSING_PAYMENT:
            return 'Đang xử lý thông tin thanh toán...';
        case OrderProcessStep.REDIRECTING:
            return 'Đang chuyển hướng đến trang thanh toán...';
        default:
            return '';
    }
};

export default function ProcessingOverlay({ isProcessing, currentStep }: ProcessingOverlayProps) {
    if (!isProcessing) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] rounded-2xl p-8 border border-[#3A3A3A] max-w-md w-full mx-4">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 relative">
                        <Loader2 className="w-16 h-16 text-[#F26D16] animate-spin" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Processing Order</h3>
                    <p className="text-[#858787] mb-4">{getStepMessage(currentStep)}</p>
                    
                    {/* Progress Steps */}
                    <div className="space-y-2">
                        <div className={`flex items-center gap-2 text-sm ${
                            currentStep === OrderProcessStep.CREATING_ORDER ? 'text-[#F26D16]' : 
                            [OrderProcessStep.CHECKING_STATUS, OrderProcessStep.PROCESSING_PAYMENT, OrderProcessStep.REDIRECTING].includes(currentStep) ? 'text-green-400' : 'text-[#858787]'
                        }`}>
                            {[OrderProcessStep.CHECKING_STATUS, OrderProcessStep.PROCESSING_PAYMENT, OrderProcessStep.REDIRECTING].includes(currentStep) ? 
                                <CheckCircle2 size={16} /> : 
                                currentStep === OrderProcessStep.CREATING_ORDER ? <Loader2 size={16} className="animate-spin" /> : 
                                <div className="w-4 h-4 rounded-full border-2 border-[#858787]" />
                            }
                            <span>Creating order</span>
                        </div>
                        
                        <div className={`flex items-center gap-2 text-sm ${
                            currentStep === OrderProcessStep.CHECKING_STATUS ? 'text-[#F26D16]' : 
                            [OrderProcessStep.PROCESSING_PAYMENT, OrderProcessStep.REDIRECTING].includes(currentStep) ? 'text-green-400' : 'text-[#858787]'
                        }`}>
                            {[OrderProcessStep.PROCESSING_PAYMENT, OrderProcessStep.REDIRECTING].includes(currentStep) ? 
                                <CheckCircle2 size={16} /> : 
                                currentStep === OrderProcessStep.CHECKING_STATUS ? <Loader2 size={16} className="animate-spin" /> : 
                                <div className="w-4 h-4 rounded-full border-2 border-[#858787]" />
                            }
                            <span>Verifying order status</span>
                        </div>
                        
                        <div className={`flex items-center gap-2 text-sm ${
                            currentStep === OrderProcessStep.PROCESSING_PAYMENT ? 'text-[#F26D16]' : 
                            currentStep === OrderProcessStep.REDIRECTING ? 'text-green-400' : 'text-[#858787]'
                        }`}>
                            {currentStep === OrderProcessStep.REDIRECTING ? 
                                <CheckCircle2 size={16} /> : 
                                currentStep === OrderProcessStep.PROCESSING_PAYMENT ? <Loader2 size={16} className="animate-spin" /> : 
                                <div className="w-4 h-4 rounded-full border-2 border-[#858787]" />
                            }
                            <span>Processing payment</span>
                        </div>
                        
                        <div className={`flex items-center gap-2 text-sm ${
                            currentStep === OrderProcessStep.REDIRECTING ? 'text-[#F26D16]' : 'text-[#858787]'
                        }`}>
                            {currentStep === OrderProcessStep.REDIRECTING ? <Loader2 size={16} className="animate-spin" /> : 
                                <div className="w-4 h-4 rounded-full border-2 border-[#858787]" />
                            }
                            <span>Redirecting to payment</span>
                        </div>
                    </div>
                    
                    <div className="mt-6 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                        <p className="text-blue-400 text-xs">
                            <Shield className="inline mr-1" size={12} />
                            Please do not close this window during processing
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { OrderProcessStep };
