import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export type AdminSession = {
  isLoggedIn: boolean;
  login?: string;
};

function sessionPassword(): string {
  const p = process.env.SESSION_SECRET ?? "dev-secret-change-me-min-32-chars!!";
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
