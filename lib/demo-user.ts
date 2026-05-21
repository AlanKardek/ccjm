import { prisma } from "@/lib/prisma";

export const DEMO_EMAIL = "leitora@montello.app";
export const DEMO_FALLBACK_ID = "demo-user";

export async function getPersistedDemoUser() {
  try {
    return await prisma.user.findUnique({
      where: { email: DEMO_EMAIL },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        username: true,
      },
    });
  } catch {
    return null;
  }
}

export async function resolveUserId(userId: string, email?: string | null) {
  if (userId !== DEMO_FALLBACK_ID && email !== DEMO_EMAIL) return userId;

  const demo = await getPersistedDemoUser();
  return demo?.id ?? userId;
}
