import http from "@/lib/http";
import { Category } from "@/schemaValidations/category-schema";




const categoryApi = {
    getCategoryList: () => http.get<Category[]>("/category"),
};
export default categoryApi;