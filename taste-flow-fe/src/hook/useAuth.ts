import authApiRequest from "@/apiRequest/auth";
import { useAuth } from "@/lib/auth-context";
import { LoginBodyType } from "@/schemaValidations/auth-schema"
import { RegisterBodyType } from "@/utils/type";
import { useMutation } from "@tanstack/react-query"

export const useLogin = (onSuccessCallback?: () => void) => {
    const {  setToken } = useAuth();
    return useMutation({
        mutationFn: async (data: LoginBodyType) => {
           const res = await authApiRequest.login(data);
           return res
        },

        onSuccess: async (token) => {
            setToken(token);
            try {
                await authApiRequest.loginToSever(token);
                onSuccessCallback?.();
            } catch (error) {
                console.error("Error setting auth cookie:", error);
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




