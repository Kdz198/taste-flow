import envConfig from "@/config";
import { normalizePath } from "./utils";
import { toast } from "sonner";



interface CustomOptions extends RequestInit {
    baseURL?: string | undefined
}
const AUTHENTICATION_ERROR_STATUS = 401;
const ENTITY_ERROR_STATUS = 422;
const isClient = typeof window !== 'undefined';
const TOKEN_KEY = 'access_token';
const EXPIRES_KEY = 'expires_at';
export class HttpError extends Error {
    status: number | undefined;
    payload: {
        message: string;
        [key: string]: any
    };
    constructor({ status, payload }: { status: number; payload: any }) {
        super('Http Error');
        this.status = status;
        this.payload = payload;
    }

}
export class EntityError extends HttpError {
    status: 422;
    payload: {
        message: string;
        errors: {
            field: string;
            message: string;
        }[]
    };
    constructor({ status, payload }: { status: 422, payload: { message: string, errors: { field: string, message: string }[] } }) {
        super({ status, payload });
        this.payload = payload;
        this.status = status;
    }
}

export class AuthenticationError extends HttpError {
    status: 401;
    payload: {
        message: string;
        [key: string]: any
    };
    constructor({ status, payload }: { status: 401, payload: { message: string, [key: string]: any } }) {
        super({ status, payload });
        this.payload = payload;
        this.status = status;
    }
}

async function httpRequest<T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    data?: CustomOptions | undefined
) {



    const token = isClient ? TokenSession.value : undefined;
    const body =
        data?.body instanceof FormData
            ? data.body
            : data?.body
                ? JSON.stringify(data.body)
                : undefined;

    const baseHeaders = body instanceof FormData
        ? {
            Authorization: token ? `Bearer ${token}` : "",
            'ngrok-skip-browser-warning': 'true',
        }
        : {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
            'ngrok-skip-browser-warning': 'true',
        };


    const baseUrl =
        data?.baseURL === undefined ? envConfig.NEXT_PUBLIC_API_URL : data.baseURL;

    const fullUrl = url.startsWith("/") ? `${baseUrl}${url}` : `${baseUrl}/${url}`;

    const res = await fetch(fullUrl, {
        ...data,
        headers: {
            ...baseHeaders,
            ...data?.headers,
        } as any,
        body,
        method,
    });

    const payload: T = await res.json();
    const value = {
        status: res.status,
        payload,
    };


    if (!res.ok) {
        if (res.status === AUTHENTICATION_ERROR_STATUS) {
            if (isClient) {
                setTimeout(() => {
                    toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
                    location.href = '/login';
                }, 1000);
            } else {
                throw new AuthenticationError({
                    status: res.status,
                    payload: {
                        message: "Authentication required on server",
                    },
                });
            }
        }
        else if (res.status === ENTITY_ERROR_STATUS) {
            throw new EntityError({
                status: 422,
                payload: payload as EntityError['payload'],
            });
        } else {
            throw new HttpError({
                status: res.status,
                payload: {
                    message: payload || 'An error occurred',
                },
            });
        }
    }
    // nếu là môi trường client mới cho chạy
    if (isClient) {
        handleAuthFlow(url, payload);
    }

    return value;
}





// SessionToken
class SessionToken {
    private accessToken: string | undefined;
    private _expiresAt: string = new Date().toISOString();

    get value() {
        return this.accessToken || '';
    }

    set value(token: string) {
        if (!isClient) throw new Error("Cannot set session token on server");
        this.accessToken = token;
    }

    get expiresAt() {
        return this._expiresAt;
    }

    set expiresAt(expiresAt: string) {
        if (!isClient) throw new Error("Cannot set expiresAt on server");
        this._expiresAt = expiresAt;
    }
}

export const TokenSession = new SessionToken();



let clientLogoutRequest: null | Promise<any> = null;
function handleAuthFlow(url: string, payload: any) {
    const path = normalizePath(url);
    if (['auth/login'].includes(path)) {
        const data = payload as { accessToken: string; refreshToken: string };
        TokenSession.value = data.accessToken;
        TokenSession.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    } else if (path === 'auth/logout') {
        TokenSession.value = '';
        TokenSession.expiresAt = new Date().toISOString();
    }
}

const http = {
    get<T>(
        url: string,
        data?: Omit<CustomOptions, 'body'> | undefined
    ) {
        return httpRequest<T>('GET', url, data)
    },
    post<T>(
        url: string,
        body: any,
        data?: Omit<CustomOptions, 'body'> | undefined
    ) {
        return httpRequest<T>('POST', url, { ...data, body })
    },
    put<T>(
        url: string,
        body: any,
        data?: Omit<CustomOptions, 'body'> | undefined
    ) {
        return httpRequest<T>('PUT', url, { ...data, body })
    },
    delete<T>(
        url: string,
        body: any,
        data?: Omit<CustomOptions, 'body'> | undefined
    ) {
        return httpRequest<T>('DELETE', url, { ...data, body })
    }
}
export default http

