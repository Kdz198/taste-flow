import http from "@/lib/http";
import { CategoryMenu, ResponeHungCategory } from "@/utils/type";






const categoryRequest = {
    getCategoryList: () => http.get<ResponeHungCategory<CategoryMenu>>("/categories"),
};
export default categoryRequest;