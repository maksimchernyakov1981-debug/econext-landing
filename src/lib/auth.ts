import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export type AdminSession = {
  isLoggedIn: boolean;
  login?: string;
};

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET ?? "dev-secret-change-me-min-32-chars!!",
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
