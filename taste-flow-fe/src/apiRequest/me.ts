import http from "@/lib/http"



export const meRequest = {
    get: () => http.get('users/me')
}
export default meRequest;
