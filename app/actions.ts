"use server";

import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth, signIn, signOut } from "@/auth";
import { resolveUserId } from "@/lib/demo-user";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  name: z.string().min(2),
  username: z.string().min(3).regex(/^[a-z0-9_]+$/i),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function registerAction(_: unknown, formData: FormData) {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Confira os dados e tente novamente." };

  const email = parsed.data.email.toLowerCase();
  const username = parsed.data.username.toLowerCase();
  const exists = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });
  if (exists) return { error: "Email ou username já cadastrado." };

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  await prisma.user.create({
    data: {
      email,
      username,
      name: parsed.data.name,
      passwordHash,
      image: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(parsed.data.name)}`,
    },
  });

  await signIn("credentials", {
    email,
    password: parsed.data.password,
    redirectTo: "/perfil",
  });
}

export async function loginAction(_: unknown, formData: FormData) {
  try {
    const result = await signIn("credentials", {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      redirectTo: "/perfil",
    });

    if (result === false) {
      return { error: "Email ou senha inválidos." };
    }
  } catch (error) {
    if (error instanceof AuthError) return { error: "Email ou senha inválidos." };
    throw error;
  }
}

export async function oauthAction(provider: "google" | "facebook") {
  await signIn(provider, { redirectTo: "/perfil" });
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}

export async function requestPasswordResetAction(_: unknown, formData: FormData) {
  const email = String(formData.get("email") ?? "").toLowerCase();
  if (!z.string().email().safeParse(email).success) {
    return { error: "Informe um email válido." };
  }

  const token = crypto.randomBytes(32).toString("hex");
  await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires: new Date(Date.now() + 1000 * 60 * 60),
    },
  });

  return {
    success:
      "Se o email estiver cadastrado, um link de recuperação será enviado. Em desenvolvimento, o token fica salvo no banco.",
  };
}

async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const id = await resolveUserId(session.user.id, session.user.email);
  return { ...session.user, id };
}

export async function updateReadingAction(formData: FormData) {
  const user = await requireUser();
  const bookId = String(formData.get("bookId"));
  const status = String(formData.get("status")) as "WANT_TO_READ" | "READING" | "READ";
  const rating = Number(formData.get("rating") || 0);

  await prisma.userBook.upsert({
    where: { userId_bookId: { userId: user.id, bookId } },
    update: {
      status,
      rating: rating || null,
      completedAt: status === "READ" ? new Date() : null,
    },
    create: {
      userId: user.id,
      bookId,
      status,
      rating: rating || null,
      completedAt: status === "READ" ? new Date() : null,
    },
  });

  revalidatePath("/perfil");
  revalidatePath("/obras");
}

export async function favoriteAction(formData: FormData) {
  const user = await requireUser();
  const bookId = String(formData.get("bookId"));
  const existing = await prisma.favorite.findUnique({
    where: { userId_bookId: { userId: user.id, bookId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
  } else {
    await prisma.favorite.create({ data: { userId: user.id, bookId } });
  }

  await prisma.userBook.upsert({
    where: { userId_bookId: { userId: user.id, bookId } },
    update: { favorite: !existing },
    create: { userId: user.id, bookId, favorite: true },
  });

  revalidatePath("/perfil");
  revalidatePath("/obras");
}

export async function createCommentAction(formData: FormData) {
  const user = await requireUser();
  const bookId = String(formData.get("bookId"));
  const slug = String(formData.get("slug"));
  const content = String(formData.get("content") ?? "").trim();
  if (content.length < 3) return;

  await prisma.comment.create({ data: { userId: user.id, bookId, content } });
  revalidatePath(`/obras/${slug}`);
}

export async function deleteCommentAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id"));
  const slug = String(formData.get("slug"));
  await prisma.comment.deleteMany({ where: { id, userId: user.id } });
  revalidatePath(`/obras/${slug}`);
}

export async function createReviewAction(formData: FormData) {
  const user = await requireUser();
  const bookId = String(formData.get("bookId"));
  const slug = String(formData.get("slug"));
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const rating = Number(formData.get("rating") ?? 5);
  if (title.length < 3 || content.length < 10) return;

  await prisma.review.upsert({
    where: { userId_bookId: { userId: user.id, bookId } },
    update: { title, content, rating },
    create: { userId: user.id, bookId, title, content, rating },
  });
  revalidatePath(`/obras/${slug}`);
}

export async function likeAction(formData: FormData) {
  const user = await requireUser();
  const slug = String(formData.get("slug"));
  const commentId = String(formData.get("commentId") || "") || null;
  const reviewId = String(formData.get("reviewId") || "") || null;
  const where = commentId
    ? { userId_commentId: { userId: user.id, commentId } }
    : { userId_reviewId: { userId: user.id, reviewId: reviewId! } };

  const existing = await prisma.like.findUnique({ where });
  if (existing) await prisma.like.delete({ where: { id: existing.id } });
  else await prisma.like.create({ data: { userId: user.id, commentId, reviewId } });

  revalidatePath(`/obras/${slug}`);
}
