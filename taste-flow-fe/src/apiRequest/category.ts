import http from "@/lib/http";
import { Category } from "@/schemaValidations/category-schema";




const categoryRequest = {
    getCategoryList: () => http.get<Category[]>("/category"),
};
export default categoryRequest;