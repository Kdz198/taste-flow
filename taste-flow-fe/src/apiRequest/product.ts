
import http from "@/lib/http";
import { FoodType } from "@/schemaValidations/product-schema";

export const productApiRequest = {
    getList: () => http.get<FoodType[]>('/menu'),


}
export default productApiRequest;