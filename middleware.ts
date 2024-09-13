import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers";
import * as jose from 'jose'
import { jwtConfig } from "./lib/routes/jwtConfig";
import { PROTECTED_APIS, PROTECTED_PAGES } from "./lib/routes/routes";

export const middleware = async (request: NextRequest) => {
  const isProtectedPage = PROTECTED_PAGES.includes(request.nextUrl.pathname);
  const isProtectedAPI = PROTECTED_APIS.includes(request.nextUrl.pathname);
  const redirectToRoot = () => {
    return NextResponse.redirect(new URL('/', request.nextUrl))
  }

  const token = cookies().get('auth2-token')?.value;
  if (!token && isProtectedAPI) {
    return NextResponse.json({
      message: 'Request is not authenticated',
      success: false
    });
  }

  if (!token && isProtectedPage) {
    return redirectToRoot()
  }

  try {
    const decoded = await jose.jwtVerify(token as string, jwtConfig.secret)
    if (!decoded && isProtectedPage) {
      return redirectToRoot()
    }

    const response = NextResponse.next();
    response.headers.set("x-user-header", JSON.stringify(decoded.payload));
    return response;
  } catch (e) {
    console.log('Server Error', e)
    return NextResponse.json({
      message: 'Auth Error. Something went wrong',
      success: false
    });

  }
}

export const config = {
  matcher: [
    '/api/auth2/logout',
    '/api/dashboard',
    '/api/user',

    '/dashboard'
  ]
}