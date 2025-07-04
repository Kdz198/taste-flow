import { NextRequest, NextResponse } from 'next/server'

// Các path cần bảo vệ
const protectedPaths = ['/admin', '/dashboard', '/profile']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Kiểm tra xem path hiện tại có nằm trong danh sách protected không
  const isProtected = protectedPaths.some((path) =>
    pathname.startsWith(path)
  )

  // Nếu không phải route cần bảo vệ → cho đi tiếp
  if (!isProtected) {
    return NextResponse.next()
  }

  // Kiểm tra token trong cookie
  const token = req.cookies.get('access_token')?.value

  // Nếu không có token → redirect đến login kèm callback
  if (!token) {
    return redirectToLogin(req)
  }

  // Nếu có token → cho đi tiếp
  return NextResponse.next()
}

// Redirect về login với callback và flag expired
function redirectToLogin(req: NextRequest) {
  const loginUrl = new URL('/login', req.url)
  loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname) // quay lại trang trc khi đăng nhập
  return NextResponse.redirect(loginUrl)
}

// Chỉ áp dụng middleware cho các path cần thiết
export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/profile/:path*'],
}
