
import http from "@/lib/http";
import { Product,  ResponeHungMenu} from "@/utils/type";


export const menuApiRequest = {
    getList: () => http.get<ResponeHungMenu<Product>>('/menus'),


}
export default menuApiRequest 
