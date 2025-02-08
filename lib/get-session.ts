"server only";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { Session } from "@/utils/types";

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const session = jwt.verify(token, process.env.JWT_SECRET!) as Session;
    return session;
  } catch (error) {
    return null;
  }
}
