
import axios from '@/lib/axios';
import http from '@/lib/http'
import envconfig from '@/config';
import { LoginBodyType } from '@/schemaValidations/auth-schema';
import { MessageResType } from '@/schemaValidations/common-schema';
import { RegisterBodyType, RegisterRes } from '@/utils/type';




const authApiRequest = {
  login: async (body: LoginBodyType) => {
    const res = await axios.post(
      `${envconfig.NEXT_PUBLIC_API_URL}/auth/login?email=${body.email}&password=${body.password}`, {},
      {
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      }
    );
    return res.data;
  },


  // call sever login
  loginToSever: async (token: string) => {
    await axios.post(
      `${envconfig.NEXT_PUBLIC_URL}/api/auth`,
      { token },
      {
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      }
    );
  },
  register: (body: RegisterBodyType) => http.post<RegisterRes>(
    '/auth/register',
    body
  ),
  // call sever
  logout: () => http.post<MessageResType>('/api/auth/logout', {},
    {
      baseURL: '',
    }
  ),

}

export default authApiRequest