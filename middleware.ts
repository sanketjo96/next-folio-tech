import { NextRequest, NextResponse } from "next/server"
import { PROTECTED_ROUTES } from "./lib/routes/routes";
import { cookies } from "next/headers";
import * as jose from 'jose'
import { jwtConfig } from "./lib/routes/jwtConfig";

export const middleware = async (request: NextRequest) => {
  const isProtectedRoute = PROTECTED_ROUTES.includes(request.nextUrl.pathname);
  const token = cookies().get('auth2-token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/', request.nextUrl))
  }

  try {
    const decoded = await jose.jwtVerify(token, jwtConfig.secret)
    if (!decoded && isProtectedRoute) {
      return NextResponse.redirect(new URL('/', request.nextUrl))
    }

    const response = NextResponse.next();
    response.headers.set("x-user-header", JSON.stringify(decoded.payload));
    return response;
  } catch (e) {
    return NextResponse.json({
      message: 'Auth Error. Something went wrong'
    });
  }
}

export const config = {
  matcher: [
    '/api/dashboard',
    '/api/user',

    '/dashboard'
  ]
}