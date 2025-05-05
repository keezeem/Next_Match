import { getToken } from "next-auth/jwt";
import { type NextRequest } from "next/server";

export async function auth(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  if (!token) return null;

  return {
    user: {
      id: token.sub,
      profileComplete: token.profileComplete as boolean,
      role: token.role as string,
    },
  };
}
