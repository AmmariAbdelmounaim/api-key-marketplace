import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

/**
 * Route handler to verify the JWT token.
 * 
 * GET /api/verify
 * 
 * Expected token from cookies: "token"
 */
export async function GET(request: NextRequest) {
  // Retrieve the token from cookies
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Token not provided" },
      { status: 401 }
    );
  }

  try {
    // Verify the token using the secret stored in the environment variable
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.json({ success: true, decoded });
  } catch (error) {
    console.error("Token verification failed:", error);
    // If token verification fails, respond with an error
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
} 