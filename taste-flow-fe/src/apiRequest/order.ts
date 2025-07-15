import http, { TokenSession } from "@/lib/http";
import { CreateOrderRequest, CreateOrderResponse, Discount, PaymentMethod } from "@/utils/type";
import envConfig from "@/config";



export const orderApiRequest = {
    getOrder: async (orderId: number) => {
        const token = TokenSession.value;

        const response = await fetch(`${envConfig.NEXT_PUBLIC_API_URL}/order/${orderId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
            },
        });

        if (!response.ok) {
            const errorText = await response.text(); // đọc thông báo lỗi thuần nếu có
            throw new Error(`HTTP ${response.status} - ${errorText}`);
        }

        const status = await response.text(); // ✅ vì API trả về kiểu text: "CANCELLED"
        return status; // => status là "CANCELLED", "PENDING", v.v.
    },
    createOrder: (body: CreateOrderRequest) => http.post<CreateOrderResponse>('/order', body),
    getPaymentLink: async (body: PaymentMethod) => {
        const token = TokenSession.value;

        const url = new URL(`${envConfig.NEXT_PUBLIC_API_URL}/payment`);
        url.searchParams.append('orderId', body.orderId.toString());
        url.searchParams.append('paymentMethod', body.paymentMethod);
        url.searchParams.append('discountCode', body.discountCode || '');

        const response = await fetch(url.toString(), {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status} - ${errorText}`);
        }

        const paymentLink = await response.text();
        return paymentLink;
    },

    getDiscount: () => http.get<Discount[]>('/discounts'),
}

export default orderApiRequest;