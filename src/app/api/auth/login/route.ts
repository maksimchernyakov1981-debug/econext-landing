import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { env } from "@/lib/env";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const login = String(body.login ?? "").trim();
    const password = String(body.password ?? "").trim();

    const expectedLogin = env.adminLogin();
    const expectedPassword = env.adminPassword();

    if (login !== expectedLogin || password !== expectedPassword) {
      return NextResponse.json(
        { error: "Неверный логин или пароль" },
        { status: 401 }
      );
    }

    const session = await getAdminSession();
    session.isLoggedIn = true;
    session.login = login;
    await session.save();

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[auth/login]", e);
    return NextResponse.json(
      {
        error:
          "Ошибка входа. Проверьте SESSION_SECRET в Vercel (минимум 32 символа) и пересоберите проект.",
      },
      { status: 500 }
    );
  }
}
