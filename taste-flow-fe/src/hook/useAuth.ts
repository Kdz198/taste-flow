import authApiRequest from "@/apiRequest/auth";
import meRequest from "@/apiRequest/me";
import envconfig from "@/config";
import { useAuth } from "@/lib/auth-context";

import { decodeJWT } from "@/lib/utils"
import { LoginBodyType } from "@/schemaValidations/auth-schema"
import orderSlice from "@/store/slice/slice-order";
import { RegisterBodyType, RegisterRes } from "@/utils/type";
import { useMutation } from "@tanstack/react-query"
import axios from "axios";
import { useDispatch } from "react-redux";


export const useLogin = (onSuccessCallback?: () => void) => {
    const { setUser, setToken } = useAuth();
    const dispatch = useDispatch()
    return useMutation({
        mutationFn: async (data: LoginBodyType) => {
            const res = await axios.post(
                `${envconfig.NEXT_PUBLIC_API_URL}/auth/login?email=${data.email}&password=${data.password}`, {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true',
                    },
                }
            );
            return res.data;
        },

        onSuccess: async (token, refreshtoken) => {
            setToken(token);

            try {
                await axios.post(
                    `${envconfig.NEXT_PUBLIC_URL}/api/auth`,
                    { token, refreshtoken },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true',
                        },
                    }
                );
                // get user info from token
                const res = await meRequest.get();
                const data = res.payload as RegisterRes;
                dispatch(orderSlice.actions.setUserId(data.id))
                setUser(data);
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
            console.log('calling registration API with data:', data);
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




