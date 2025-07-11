import z from 'zod'

export const MessageRes = z
  .object({
    message: z.string()
  })
  .strict()

export type MessageResType = z.infer<typeof MessageRes>