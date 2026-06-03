import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import { env } from "./env";

export type AdminSession = {
  isLoggedIn: boolean;
  login?: string;
};

function sessionPassword(): string {
  let p = env.sessionSecret().trim();
  if (
    (p.startsWith('"') && p.endsWith('"')) ||
    (p.startsWith("'") && p.endsWith("'"))
  ) {
    p = p.slice(1, -1).trim();
  }
  if (p.length < 32) {
    return (p + "-".repeat(32)).slice(0, 32);
  }
  return p;
}

export const sessionOptions: SessionOptions = {
  password: sessionPassword(),
  cookieName: "admin_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  },
};

export async function getAdminSession() {
  return getIronSession<AdminSession>(await cookies(), sessionOptions);
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session.isLoggedIn) return null;
  return session;
}
