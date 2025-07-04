import http from "@/lib/http";
import { ItemAddRequest } from "@/utils/type";



const addToCartRequest ={
    addToCart :(body:any)=> http.post('/cart', body),
    getCart: () => http.get('/cart'),
    
    
}

export default addToCartRequest;
