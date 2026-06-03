import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { env } from "@/lib/env";

export async function POST(request: Request) {
  const body = await request.json();
  const login = String(body.login ?? "");
  const password = String(body.password ?? "");

  if (login !== env.adminLogin() || password !== env.adminPassword()) {
    return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 });
  }

  const session = await getAdminSession();
  session.isLoggedIn = true;
  session.login = login;
  await session.save();

  return NextResponse.json({ ok: true });
}
