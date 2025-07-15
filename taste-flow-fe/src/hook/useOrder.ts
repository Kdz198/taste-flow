import { useMutation, useQuery } from '@tanstack/react-query';
import orderApiRequest from '@/apiRequest/order';
import { CreateOrderRequest, CreateOrderResponse, OrderStatus, PaymentMethod } from '@/utils/type';
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
         const url = await orderApiRequest.getPaymentLink(body);
         return url as string
    },
  });
};




