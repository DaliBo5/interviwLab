import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_LONG,
  createSessionToken,
  hashPassword,
  sessionCookieOptions,
} from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/auth/signup : crée un compte et ouvre une session
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    name?: unknown;
    email?: unknown;
    password?: unknown;
  };

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (name.length < 2 || name.length > 60) {
    return NextResponse.json({ error: "Indique ton nom (2 à 60 caractères)." }, { status: 400 });
  }
  if (!EMAIL_REGEX.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Adresse e-mail invalide." }, { status: 400 });
  }
  if (password.length < 8 || password.length > 128) {
    return NextResponse.json(
      { error: "Le mot de passe doit contenir au moins 8 caractères." },
      { status: 400 },
    );
  }

  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (existing) {
    return NextResponse.json(
      { error: "Un compte existe déjà avec cette adresse. Connecte-toi." },
      { status: 409 },
    );
  }

  const user = await prisma.user.create({
    data: { name, email, passwordHash: await hashPassword(password) },
  });

  const response = NextResponse.json({ ok: true }, { status: 201 });
  response.cookies.set(
    SESSION_COOKIE,
    createSessionToken(user.id, SESSION_LONG),
    sessionCookieOptions(SESSION_LONG),
  );
  return response;
}
