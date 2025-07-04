import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token } = body;
    // console.log('Received token:', token)
    const cookieStore = await cookies()


    if (!token) {
      return NextResponse.json({ message: 'Missing token or expiresAt' }, { status: 400 })
    }
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) //24h


    // cookie token
    cookieStore.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    })

    return NextResponse.json({ message: 'Cookie set' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: 'Error setting cookie' }, { status: 500 })
  }
}
