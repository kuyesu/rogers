import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req: any) {
  if (req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/overview', req.url));
  }
}
