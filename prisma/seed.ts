import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { booksSeed } from "../lib/seed-data";

const prisma = new PrismaClient({
  adapter: new PrismaPg(process.env.DATABASE_URL ?? ""),
});

async function main() {
  const passwordHash = await bcrypt.hash("montello123", 12);

  const demo = await prisma.user.upsert({
    where: { email: "leitora@montello.app" },
    update: {},
    create: {
      email: "leitora@montello.app",
      name: "Leitora Maranhense",
      username: "leitora",
      bio: "Entre romances históricos, memórias de São Luís e leituras de fim de tarde.",
      passwordHash,
      image: "https://api.dicebear.com/9.x/initials/svg?seed=Leitora%20Maranhense",
    },
  });

  for (const book of booksSeed) {
    await prisma.book.upsert({
      where: { slug: book.slug },
      update: book,
      create: book,
    });
  }

  const tambores = await prisma.book.findUnique({
    where: { slug: "os-tambores-de-sao-luis" },
  });

  if (tambores) {
    await prisma.comment.upsert({
      where: { id: "seed-comment-tambores" },
      update: {},
      create: {
        id: "seed-comment-tambores",
        content: "A maneira como São Luís respira dentro do romance torna a leitura muito viva.",
        bookId: tambores.id,
        userId: demo.id,
      },
    });

    await prisma.review.upsert({
      where: { userId_bookId: { userId: demo.id, bookId: tambores.id } },
      update: {},
      create: {
        title: "Um romance de memória e cidade",
        content:
          "A força do livro está em transformar história social em experiência sensível. A cidade, a ancestralidade e os personagens parecem caminhar juntos.",
        rating: 5,
        bookId: tambores.id,
        userId: demo.id,
      },
    });

    await prisma.userBook.upsert({
      where: { userId_bookId: { userId: demo.id, bookId: tambores.id } },
      update: {},
      create: {
        userId: demo.id,
        bookId: tambores.id,
        status: "READ",
        favorite: true,
        rating: 5,
        completedAt: new Date("2024-08-21"),
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
