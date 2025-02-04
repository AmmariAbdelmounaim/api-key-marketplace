import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return new NextResponse(JSON.stringify({ session: null }), { status: 401 });
  }

  try {
    const session = jwt.verify(token, process.env.JWT_SECRET!);
    return new NextResponse(JSON.stringify({ session }), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ session: null }), { status: 401 });
  }
} 