import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  console.log("token", token);
  const protectedRoutes = ["/dashboard"];

  if (protectedRoutes.some((path) => request.nextUrl.pathname.startsWith(path))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const response = await fetch(`http://localhost:3000/api/verify`, {
      method: "GET",
      headers: {
        "Cookie": `token=${token}`
      }
    });

    if (response.status !== 200) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
