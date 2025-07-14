
import http from '@/lib/http'

import { LoginBodyType } from '@/schemaValidations/auth-schema';
import { MessageResType } from '@/schemaValidations/common-schema';
import { RegisterBodyType, RegisterRes } from '@/utils/type';




const authApiRequest = {
  login: (body: LoginBodyType) => http.post<{ token: string }>(
    '/auth/login',
    body
  ),
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