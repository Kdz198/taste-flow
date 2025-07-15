import http, { TokenSession } from "@/lib/http";
import { CreateOrderRequest, CreateOrderResponse } from "@/utils/type";
import envConfig from "@/config";
import { get } from "http";


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
    getPaymentLink: async (body: { paymentMethod: string, orderId: number }) => {
        const token = TokenSession.value;

        const response = await fetch(`${envConfig.NEXT_PUBLIC_API_URL}/order/payment-link`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text(); // đọc thông báo lỗi thuần nếu có
            throw new Error(`HTTP ${response.status} - ${errorText}`);
        }

        const paymentLink = await response.json();
        return paymentLink; // trả về đường dẫn thanh toán
    }

}

export default orderApiRequest;