import { useMutation, useQuery } from '@tanstack/react-query';
import orderApiRequest from '@/apiRequest/order';
import { CreateOrderRequest, CreateOrderResponse, OrderStatus, PaymentMethod } from '@/utils/type';
import { TokenSession } from '@/lib/http';
import axios from 'axios';
import envConfig from "@/config";
export const useCreateOrder = () => {
  return useMutation({
    mutationFn: async (data: CreateOrderRequest) => {
      const res = await orderApiRequest.createOrder(data);
      return res.payload as CreateOrderResponse;
    },
  });
};
export const useCheckOrderStatus = () => {
  return useMutation({
    mutationFn: async (orderId: number) => {
      const status = await orderApiRequest.getOrder(orderId);
      return status as OrderStatus;
    },
  });
};

export const useGetPaymentLink = () => {
  return useMutation({
    mutationFn: async (body: PaymentMethod) => {
      const token = TokenSession.value;

      const res = await fetch(
        `${envConfig.NEXT_PUBLIC_API_URL}/payment?orderId=${body.orderId}&paymentMethod=${body.paymentMethod}&discountCode=${body.discountCode ?? ''}`,
        {
          method: 'POST', // ✅ dùng POST vì backend bạn yêu cầu POST
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
            'Content-Type': 'application/json',
          },
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status} - ${errorText}`);
      }

      const paymentUrl = await res.text(); // ✅ vì backend trả về chuỗi
      return paymentUrl;
    },
  });
};




