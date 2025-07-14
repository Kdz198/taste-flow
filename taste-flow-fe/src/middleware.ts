import { NextRequest, NextResponse } from 'next/server'

// Các route yêu cầu đăng nhập
const protectedRoutes = ['/admin', '/dashboard', '/profile', '/cart', '/order']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Kiểm tra xem có nằm trong route cần bảo vệ không
  const requiresAuth = protectedRoutes.some((route) => pathname.startsWith(route))
  if (!requiresAuth) return NextResponse.next()

  // Kiểm tra token trong cookie
  const token = req.cookies.get('token')?.value

  // Nếu không có token → redirect kèm callback URL
  if (!token) {
    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // ✅ Nếu có token → cho phép truy cập
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
    '/cart/:path*',
    '/order/:path*',
  ],
}
