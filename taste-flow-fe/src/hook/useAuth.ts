import authApiRequest from "@/apiRequest/auth";
import cartApi from "@/apiRequest/cart";
import meRequest from "@/apiRequest/me";
import { useAuth } from "@/lib/auth-context";
import { TokenSession } from "@/lib/http";
import { LoginBodyType } from "@/schemaValidations/auth-schema"
import { setCart } from "@/store/slice/slice-cart";
import { RegisterBodyType } from "@/utils/type";
import { useMutation } from "@tanstack/react-query"
import { useDispatch } from "react-redux";

export const useLogin = (onSuccessCallback?: () => void) => {
    const dispatch = useDispatch();
    const { setUser } = useAuth();

    return useMutation({
        mutationFn: async (data: LoginBodyType) => {
            const res = await authApiRequest.login(data);
            return res;
        },

        onSuccess: async (token) => {
            try {
                // 1. Lưu token vào TokenSession (class)
                TokenSession.value = token;
                TokenSession.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

                // 2. Gửi token về server để set cookie
                await authApiRequest.loginToSever(token);

                // 3. Gọi luôn thông tin user
                const userInfo = await meRequest.get();
                setUser(userInfo.payload);

                // 4. Gọi giỏ hàng của user
                const cart = await cartApi.getCart(userInfo.payload.id);
                dispatch(setCart(cart.payload));

                // 5. Gọi callback (chuyển trang, toast, vv.)
                onSuccessCallback?.();
            } catch (error) {
                console.error("Error during login flow:", error);
            }
        },

        onError: (error) => {
            console.error("Login error:", error);
        },
    });
};
export const useRegister = (onSuccessCallback?: () => void) => {
    return useMutation({
        mutationFn: async (data: RegisterBodyType) => {
            const res = await authApiRequest.register(data)
            if (!res.payload) {
                throw new Error('No data returned from registration API');
            }
            return res.payload
        },
        onSuccess: async (data) => {
            onSuccessCallback?.();
        },
        onError: (error) => {
            console.error("Registration error:", error);
        },
    })
}

export const useLogout = (onSuccessCallback?: () => void) => {
    const { logout } = useAuth();

    return useMutation({
        mutationFn: async () => {
            // phía server
            const res = await authApiRequest.logout();
            return res;
        },
        onSuccess: () => {
            // phía client 
            logout();
            onSuccessCallback?.();
            console.log("Logout successful");
        },
        onError: (error) => {
            console.error("Logout error:", error);
        },
    });
};




