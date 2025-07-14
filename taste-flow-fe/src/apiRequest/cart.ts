import http from "@/lib/http";
import { AddToCartRequest, CartResponse, RemoveFromCartRequest } from "@/utils/type";



const cartApi = {
    addToCart: (body: AddToCartRequest) => http.post<CartResponse>('/cart', body),
    getCart: (userId:number) => http.get<CartResponse>(`/cart/${userId}`),
    removeCart: (body: RemoveFromCartRequest) => http.delete<CartResponse>('/cart/remove', body)
}

export default cartApi;
