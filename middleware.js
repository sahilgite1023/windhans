// middleware.js
// Middleware to protect routes

import { NextResponse } from 'next/server'

export function middleware(request) {
  const userId = request.cookies.get('userId')?.value
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/register')
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/profile') ||
                          request.nextUrl.pathname.startsWith('/feed') ||
                          request.nextUrl.pathname.startsWith('/upload')
  
  // If user is not logged in and trying to access protected route
  if (!userId && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // If user is logged in and trying to access login/register
  if (userId && isAuthPage) {
    return NextResponse.redirect(new URL('/feed', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/feed/:path*',
    '/upload/:path*',
    '/login',
    '/register',
  ]
}
