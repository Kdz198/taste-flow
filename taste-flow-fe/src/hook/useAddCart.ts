import addToCartRequest from "@/apiRequest/addToCart"
import { ItemAddRequest } from "@/utils/type"
import { useMutation } from "@tanstack/react-query"




export const useAddCart = () => {
    return useMutation({
        mutationFn: async (body: any) => {
            const res = await addToCartRequest.addToCart(body)
            if (!res.payload) {
                throw new Error('No data returned from registration API')
            }
            return res.payload
        },
        onSuccess: () => {
            console.log('Add to cart success:')
            // Handle success, e.g., show a toast notification or redirect
        },
        onError: (error) => {
            console.error('Error adding to cart:', error)
            // Handle error, e.g., show a toast notification
        },
    })
}
export const useOrderCart = () => {

}