import cartApi from "@/apiRequest/cart";
import { AddToCartRequest,  RemoveFromCartRequest } from "@/utils/type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";



// export const useGetCart = () => {
//     return useQuery({
//         queryKey: ['cart'],
//         queryFn: async () => {
//             const res = await cartApi.getCart
//             return res.payload;
//         }
//     });
// }

export const useAddToCart = () => {
    return useMutation({
        mutationFn: async (body: AddToCartRequest) => {
            const res = await cartApi.addToCart(body);
            return res.payload;
        },
    })
}
export const useRemoveFromCart = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (body: RemoveFromCartRequest) => {
            const res = await cartApi.removeCart(body);
            return res.payload;
        },
    });
}