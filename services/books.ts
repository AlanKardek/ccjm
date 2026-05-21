import { prisma } from "@/lib/prisma";
import { booksSeed } from "@/lib/seed-data";

export type BookWithStats = {
  id: string;
  slug: string;
  title: string;
  description: string;
  year: number | null;
  genre: string;
  coverUrl: string;
  curiosities: string[];
  averageRating: number;
  readers: number;
  favorites: number;
  comments: number;
  reviews: number;
};

function fallbackBooks(): BookWithStats[] {
  return booksSeed.map((book, index) => ({
    id: `fallback-${book.slug}`,
    ...book,
    averageRating: [4.9, 4.6, 4.5, 4.4, 4.2, 4.1][index] ?? 4.2,
    readers: 120 - index * 11,
    favorites: 74 - index * 7,
    comments: 18 - index,
    reviews: 8 - Math.floor(index / 2),
  }));
}

export async function getBooks(query?: string, genre?: string) {
  try {
    const books = await prisma.book.findMany({
      where: {
        AND: [
          query
            ? {
                OR: [
                  { title: { contains: query, mode: "insensitive" } },
                  { description: { contains: query, mode: "insensitive" } },
                ],
              }
            : {},
          genre ? { genre } : {},
        ],
      },
      include: {
        _count: {
          select: {
            comments: true,
            reviews: true,
            favorites: true,
            userBooks: true,
          },
        },
        reviews: { select: { rating: true } },
      },
      orderBy: [{ year: "desc" }, { title: "asc" }],
    });

    if (!books.length) return fallbackBooks();

    return books.map((book) => ({
      id: book.id,
      slug: book.slug,
      title: book.title,
      description: book.description,
      year: book.year,
      genre: book.genre,
      coverUrl: book.coverUrl,
      curiosities: book.curiosities,
      averageRating: book.reviews.length
        ? book.reviews.reduce((sum, review) => sum + review.rating, 0) / book.reviews.length
        : 0,
      readers: book._count.userBooks,
      favorites: book._count.favorites,
      comments: book._count.comments,
      reviews: book._count.reviews,
    }));
  } catch {
    return fallbackBooks();
  }
}

export async function getBook(slug: string) {
  try {
    const book = await prisma.book.findUnique({
      where: { slug },
      include: {
        comments: {
          include: { user: true, _count: { select: { likes: true } } },
          orderBy: { createdAt: "desc" },
        },
        reviews: {
          include: { user: true, _count: { select: { likes: true } } },
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { favorites: true, userBooks: true } },
      },
    });
    if (book) return book;
  } catch {
    return null;
  }

  const fallback = fallbackBooks().find((book) => book.slug === slug);
  return fallback
    ? {
        ...fallback,
        comments: [],
        reviews: [],
        _count: { favorites: fallback.favorites, userBooks: fallback.readers },
      }
    : null;
}

export async function getGenres() {
  const fallback = Array.from(new Set(booksSeed.map((book) => book.genre)));
  try {
    const genres = await prisma.book.findMany({
      select: { genre: true },
      distinct: ["genre"],
      orderBy: { genre: "asc" },
    });
    return genres.length ? genres.map((book) => book.genre) : fallback;
  } catch {
    return fallback;
  }
}
