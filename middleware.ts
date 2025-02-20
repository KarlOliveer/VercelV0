import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { updateSession } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  // Public paths that don't require authentication
  const publicPaths = ["/login"]
  const isPublicPath = publicPaths.includes(request.nextUrl.pathname)

  // Get the session
  const session = await updateSession(request)

  // If trying to access login page while already logged in, redirect to projects
  if (isPublicPath && session) {
    return NextResponse.redirect(new URL("/projects", request.url))
  }

  // If trying to access protected page without session, redirect to login
  if (!isPublicPath && !session) {
    const loginUrl = new URL("/login", request.url)
    // Add the current path as a redirect parameter
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// Update matcher to include all paths except api routes and static files
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}

