'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle, AlertCircle, Clock, ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';

interface PaymentResult {
  orderId: number;
  amount: number;
  status: string;
  method: string;
}

export default function OrderStatusPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Lấy params từ URL
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');
    const status = searchParams.get('status');
    const method = searchParams.get('method');

    if (orderId && amount && status && method) {
      setPaymentResult({
        orderId: parseInt(orderId),
        amount: parseInt(amount),
        status: status,
        method: method
      });
    }

    setIsLoading(false);
  }, [searchParams]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getStatusConfig = (status: string) => {
    switch (status.toUpperCase()) {
      case 'SUCCESS':
      case 'COMPLETED':
        return {
          icon: CheckCircle,
          color: 'text-green-500',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/20',
          title: 'Thanh toán thành công!',
          message: 'Đơn hàng của bạn đã được xử lý thành công.'
        };
      case 'FAILED':
      case 'CANCELLED':
        return {
          icon: XCircle,
          color: 'text-red-500',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/20',
          title: 'Thanh toán thất bại!',
          message: 'Đã xảy ra lỗi trong quá trình thanh toán.'
        };
      case 'PENDING':
        return {
          icon: Clock,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/20',
          title: 'Đang xử lý thanh toán...',
          message: 'Giao dịch đang được xử lý, vui lòng chờ.'
        };
      default:
        return {
          icon: AlertCircle,
          color: 'text-gray-500',
          bgColor: 'bg-gray-500/10',
          borderColor: 'border-gray-500/20',
          title: 'Trạng thái không xác định',
          message: 'Vui lòng liên hệ hỗ trợ để biết thêm chi tiết.'
        };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F26D16] mx-auto mb-4"></div>
          <p className="text-white">Đang xử lý kết quả...</p>
        </div>
      </div>
    );
  }

  if (!paymentResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] flex items-center justify-center">
        <div className="bg-[#2A2A2A] rounded-2xl p-8 border border-[#3A3A3A] text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Thông tin không hợp lệ</h1>
          <p className="text-gray-400 mb-6">
            Không tìm thấy thông tin thanh toán. Vui lòng thử lại.
          </p>
          <Link
            href="/order"
            className="inline-flex items-center gap-2 bg-[#F26D16] hover:bg-[#d85a12] text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại đặt hàng
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(paymentResult.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Status Card */}
          <div className={`bg-[#2A2A2A] rounded-2xl p-8 border ${statusConfig.borderColor} text-center mb-6`}>
            <div className={`w-20 h-20 rounded-full ${statusConfig.bgColor} flex items-center justify-center mx-auto mb-4`}>
              <StatusIcon className={`w-10 h-10 ${statusConfig.color}`} />
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-2">
              {statusConfig.title}
            </h1>
            
            <p className="text-gray-400 mb-6">
              {statusConfig.message}
            </p>

            {/* Order Details */}
            <div className="bg-[#1A1A1A] rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-white mb-4">Chi tiết giao dịch</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Mã đơn hàng:</span>
                  <span className="text-white font-medium">#{paymentResult.orderId}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Phương thức thanh toán:</span>
                  <span className="text-white font-medium">{paymentResult.method}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Số tiền:</span>
                  <span className="text-[#F26D16] font-bold text-lg">
                    {formatPrice(paymentResult.amount)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Trạng thái:</span>
                  <span className={`font-medium ${statusConfig.color}`}>
                    {paymentResult.status}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Thời gian:</span>
                  <span className="text-white font-medium">
                    {new Date().toLocaleString('vi-VN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Link
                href="/"
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <Home className="w-4 h-4" />
                Trang chủ
              </Link>
              
              {paymentResult.status.toUpperCase() === 'SUCCESS' || paymentResult.status.toUpperCase() === 'COMPLETED' ? (
                <Link
                  href={`/order/${paymentResult.orderId}`}
                  className="flex items-center gap-2 bg-[#F26D16] hover:bg-[#d85a12] text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Xem đơn hàng
                </Link>
              ) : (
                <Link
                  href="/order"
                  className="flex items-center gap-2 bg-[#F26D16] hover:bg-[#d85a12] text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Thử lại
                </Link>
              )}
            </div>
          </div>

          {/* Additional Info */}
          {paymentResult.status.toUpperCase() === 'SUCCESS' && (
            <div className="bg-[#2A2A2A] rounded-lg p-6 border border-[#3A3A3A]">
              <h3 className="text-lg font-semibold text-white mb-3">Thông tin quan trọng</h3>
              <ul className="space-y-2 text-gray-400">
                <li>• Đơn hàng sẽ được xử lý trong vòng 15-30 phút</li>
                <li>• Bạn sẽ nhận được thông báo khi đơn hàng sẵn sàng</li>
                <li>• Vui lòng giữ mã đơn hàng để tra cứu</li>
                <li>• Liên hệ hotline nếu cần hỗ trợ</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
