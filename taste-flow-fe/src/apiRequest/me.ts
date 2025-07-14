import http from "@/lib/http"
import { RegisterRes } from "@/utils/type";



export const meRequest = {
    get: () => http.get<RegisterRes>('users/me')
}
export default meRequest;
