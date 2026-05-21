import { prisma } from "@/lib/prisma";
import { booksSeed } from "@/lib/seed-data";
import { DEMO_FALLBACK_ID, resolveUserId } from "@/lib/demo-user";

export async function getProfile(userId: string) {
  const resolvedUserId = await resolveUserId(userId, userId === DEMO_FALLBACK_ID ? "leitora@montello.app" : null);
  try {
    const profile = await prisma.user.findUnique({
      where: { id: resolvedUserId },
      include: {
        comments: { include: { book: true }, orderBy: { createdAt: "desc" } },
        reviews: { include: { book: true }, orderBy: { createdAt: "desc" } },
        favorites: { include: { book: true }, orderBy: { createdAt: "desc" } },
        library: { include: { book: true }, orderBy: { updatedAt: "desc" } },
        _count: { select: { comments: true, reviews: true, favorites: true } },
      },
    });
    if (profile) return profile;
  } catch {
    if (userId !== DEMO_FALLBACK_ID) return null;
  }

  if (userId !== DEMO_FALLBACK_ID) return null;

  const now = new Date();
  const [readBook, readingBook, wantBook] = booksSeed;

  return {
    id: "demo-user",
    name: "Leitora Maranhense",
    email: "leitora@montello.app",
    emailVerified: null,
    image: "https://api.dicebear.com/9.x/initials/svg?seed=Leitora%20Maranhense",
    username: "leitora",
    bio: "Entre romances históricos, memórias de São Luís e leituras de fim de tarde.",
    passwordHash: null,
    createdAt: new Date("2024-08-21"),
    updatedAt: now,
    comments: [
      {
        id: "demo-comment",
        content: "A maneira como São Luís respira dentro do romance torna a leitura muito viva.",
        createdAt: now,
        updatedAt: now,
        userId: "demo-user",
        bookId: readBook.slug,
        book: { ...readBook, id: readBook.slug, createdAt: now, updatedAt: now },
      },
    ],
    reviews: [
      {
        id: "demo-review",
        title: "Um romance de memória e cidade",
        content:
          "A força do livro está em transformar história social em experiência sensível.",
        rating: 5,
        createdAt: now,
        updatedAt: now,
        userId: "demo-user",
        bookId: readBook.slug,
        book: { ...readBook, id: readBook.slug, createdAt: now, updatedAt: now },
      },
    ],
    favorites: [
      {
        id: "demo-favorite",
        createdAt: now,
        userId: "demo-user",
        bookId: readBook.slug,
        book: { ...readBook, id: readBook.slug, createdAt: now, updatedAt: now },
      },
    ],
    library: [
      {
        id: "demo-read",
        status: "READ",
        favorite: true,
        rating: 5,
        completedAt: new Date("2024-08-21"),
        createdAt: now,
        updatedAt: now,
        userId: "demo-user",
        bookId: readBook.slug,
        book: { ...readBook, id: readBook.slug, createdAt: now, updatedAt: now },
      },
      {
        id: "demo-reading",
        status: "READING",
        favorite: false,
        rating: null,
        completedAt: null,
        createdAt: now,
        updatedAt: now,
        userId: "demo-user",
        bookId: readingBook.slug,
        book: { ...readingBook, id: readingBook.slug, createdAt: now, updatedAt: now },
      },
      {
        id: "demo-want",
        status: "WANT_TO_READ",
        favorite: false,
        rating: null,
        completedAt: null,
        createdAt: now,
        updatedAt: now,
        userId: "demo-user",
        bookId: wantBook.slug,
        book: { ...wantBook, id: wantBook.slug, createdAt: now, updatedAt: now },
      },
    ],
    _count: { comments: 1, reviews: 1, favorites: 1 },
  };
}
