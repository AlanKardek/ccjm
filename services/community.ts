import { prisma } from "@/lib/prisma";

export async function getCommunityFeed() {
  const [comments, reviews] = await Promise.all([
    prisma.comment.findMany({
      include: {
        book: true,
        user: true,
        _count: { select: { likes: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.review.findMany({
      include: {
        book: true,
        user: true,
        _count: { select: { likes: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  return [
    ...comments.map((comment) => ({
      id: comment.id,
      type: "Comentário" as const,
      title: comment.book.title,
      body: comment.content,
      createdAt: comment.createdAt,
      href: `/obras/${comment.book.slug}`,
      likes: comment._count.likes,
      bookCover: comment.book.coverUrl,
      userName: comment.user.name ?? comment.user.username ?? "Leitor",
      userImage: comment.user.image,
    })),
    ...reviews.map((review) => ({
      id: review.id,
      type: "Resenha" as const,
      title: review.title,
      body: review.content,
      createdAt: review.createdAt,
      href: `/obras/${review.book.slug}`,
      likes: review._count.likes,
      rating: review.rating,
      bookCover: review.book.coverUrl,
      userName: review.user.name ?? review.user.username ?? "Leitor",
      userImage: review.user.image,
      bookTitle: review.book.title,
    })),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}
