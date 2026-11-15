import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_LONG,
  SESSION_SHORT,
  createSessionToken,
  sessionCookieOptions,
  verifyPassword,
} from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/auth/signin : vérifie l'e-mail et le mot de passe puis ouvre une session
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    email?: unknown;
    password?: unknown;
    remember?: unknown;
  };

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  const user = email ? await prisma.user.findUnique({ where: { email } }) : null;
  const valid = user ? await verifyPassword(password, user.passwordHash) : false;

  if (!user || !valid) {
    // Message volontairement identique dans les deux cas
    return NextResponse.json({ error: "E-mail ou mot de passe incorrect." }, { status: 401 });
  }

  const maxAge = body.remember === true ? SESSION_LONG : SESSION_SHORT;
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, createSessionToken(user.id, maxAge), sessionCookieOptions(maxAge));
  return response;
}
