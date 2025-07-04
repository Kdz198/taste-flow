// /api/auth/me.ts
import { cookies } from 'next/headers'
import { jwtDecode } from "jwt-decode";

export async function GET() {
    const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) return Response.json({ user: null })

  try {
    const user = jwtDecode(token)
    return Response.json({ user })
  } catch {
    return Response.json({ user: null })
  }
}
