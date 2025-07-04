import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { UseFormSetError } from "react-hook-form";
import { jwtDecode } from "jwt-decode";
import { EntityError } from "./http";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface IError {
  error: any;
  setError?: UseFormSetError<any>
}

export const handleErrorApi = ({ error, setError }: IError) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: "server",
        message: item.message,
      })
    })
  } else {
    console.error("An error occurred:", error);
  }
}
export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path
}



export const decodeJWT = <T>(token: string) => {
  return jwtDecode<T>(token)
}