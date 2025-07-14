import z from 'zod'



export const RegisterBody = z
  .object({
    name: z.string().trim().min(2).max(256),
    email: z.string().email(),
    password: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100),
    address: z.string().trim().max(256),
    phone: z
      .string()
      .min(9, 'Số điện thoại phải có ít nhất 9 chữ số')
      .max(15, 'Số điện thoại không được vượt quá 15 chữ số')
      .regex(/^[0-9]+$/, 'Số điện thoại không hợp lệ')

  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mật khẩu không khớp',
        path: ['confirmPassword'],
      });
    }
  });

export type RegisterBodyType = z.TypeOf<typeof RegisterBody>

export const RegisterRes = z.object({
  data: z.object({
    token: z.string(),
    expiresAt: z.string(),
    account: z.object({
      id: z.number(),
      name: z.string(),
      email: z.string()
    })
  }),
  message: z.string()
})

export type RegisterResType = z.TypeOf<typeof RegisterRes>

export const LoginBody = z
  .object({
    email: z.string().email(),
    password: z.string().min(6).max(100)
  })
  .strict()

export type LoginBodyType = z.infer<typeof LoginBody>

export const LoginRes = RegisterRes

export type LoginResType = z.infer<typeof LoginRes>
export const SlideSessionBody = z.object({}).strict()

export type SlideSessionBodyType = z.infer<typeof SlideSessionBody>
export const SlideSessionRes = RegisterRes

export type SlideSessionResType = z.infer<typeof SlideSessionRes>