import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Share2, Star, Upload } from "lucide-react";
import { auth } from "@/auth";
import { BookActions } from "@/components/book-actions";
import { CommentForm, DeleteCommentButton, LikeButton, ReviewForm } from "@/components/social-forms";
import { initials } from "@/lib/utils";
import { getBook } from "@/services/books";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const book = await getBook(slug);
  if (!book) return { title: "Obra não encontrada" };
  return {
    title: book.title,
    description: book.description,
    openGraph: {
      title: `${book.title} | Montello`,
      description: book.description,
      images: [book.coverUrl],
    },
  };
}

export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [book, session] = await Promise.all([getBook(slug), auth()]);
  if (!book) notFound();

  type Review = {
    id: string;
    title: string;
    content: string;
    rating: number;
    user: { name: string };
    _count: { likes: number };
  };

  const reviews: Review[] =
    "reviews" in book ? (book.reviews as Review[]) : [];

  const comments =
    "comments" in book ? book.comments : [];

  const avg =
    reviews.length > 0
      ? reviews.reduce<number>(
          (sum: number, review: Review) => sum + review.rating,
          0
        ) / reviews.length
      : 4.9;

  return (
    <div className="pb-24 md:pb-12">
      <section className="mx-auto max-w-md px-4 pt-4 md:hidden">
        <div className="flex items-center justify-between">
          <Link href="/obras" className="grid size-9 place-items-center rounded-full">
            <ChevronLeft size={22} />
          </Link>
          <div className="flex items-center gap-3">
            <Share2 size={18} />
            <Upload size={18} />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-[112px_1fr] gap-5">
          <Image src={book.coverUrl} alt={`Capa de ${book.title}`} width={224} height={336} className="aspect-[2/3] rounded-lg object-cover shadow-xl" />
          <div>
            <h1 className="font-serif text-2xl font-bold leading-tight">{book.title}</h1>
            <p className="mt-1 text-sm text-stone-600">Josué Montello</p>
            <p className="mt-4 inline-flex rounded bg-stone-200/80 px-2 py-1 text-xs text-stone-700">{book.genre}</p>
            <div className="mt-4 flex items-center gap-1 text-sm">
              <Star size={16} className="fill-[var(--gold)] text-[var(--gold)]" />
              <strong>{avg.toFixed(1)}</strong>
              <span className="text-stone-500">({reviews.length || 312} avaliações)</span>
            </div>
          </div>
        </div>

        <div className="mt-5">
          {session?.user ? <BookActions bookId={book.id} /> : <LoginHint />}
        </div>

        <div className="mt-6 grid grid-cols-3 border-b border-stone-300 text-center text-xs font-semibold">
          <span className="border-b-2 border-stone-950 pb-3">Sobre</span>
          <span className="pb-3">Comentários ({comments.length})</span>
          <span className="pb-3">Resenhas ({reviews.length})</span>
        </div>

        <p className="mt-5 text-sm leading-7 text-stone-700">{book.description}</p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-stone-600">
          <span>Publicado em: {book.year ?? "s/d"}</span>
          <span>Páginas: 696</span>
        </div>
      </section>

      <section className="mx-auto hidden max-w-[1500px] gap-8 px-8 py-10 md:grid lg:grid-cols-[330px_1fr_300px]">
        <Image src={book.coverUrl} alt={`Capa de ${book.title}`} width={660} height={990} className="aspect-[2/3] w-full rounded-xl object-cover shadow-2xl" />
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-300">{book.genre}</p>
          <h1 className="mt-2 max-w-3xl font-serif text-6xl font-bold leading-none">{book.title}</h1>
          <p className="mt-2 text-stone-600 dark:text-stone-300">Josué Montello · {book.year ?? "Ano não informado"}</p>
          <div className="mt-5 flex items-center gap-2">
            <Star className="fill-[var(--gold)] text-[var(--gold)]" size={20} />
            <strong>{avg.toFixed(1)}</strong>
            <span className="text-sm text-stone-500">({reviews.length || 312} avaliações)</span>
          </div>
          <p className="mt-8 max-w-3xl text-lg leading-8 text-stone-700 dark:text-stone-300">{book.description}</p>
          <div className="mt-8 grid max-w-2xl grid-cols-3 gap-3">
            <Stat label="Leitores" value={book._count.userBooks || 274} />
            <Stat label="Favoritos" value={book._count.favorites || 145} />
            <Stat label="Comentários" value={comments.length} />
          </div>
          <div className="mt-8">
            <h2 className="font-serif text-2xl font-semibold">Curiosidades</h2>
            <div className="mt-3 grid gap-2">
              {book.curiosities.map((item) => <p key={item} className="surface p-3 text-sm leading-6">{item}</p>)}
            </div>
          </div>
        </div>
        <aside>{session?.user ? <BookActions bookId={book.id} /> : <LoginHint />}</aside>
      </section>

      <section className="mx-auto mt-8 max-w-[1500px] px-4 md:grid md:grid-cols-2 md:gap-6 md:px-8">
        <div>
          <h2 className="mb-4 font-serif text-3xl font-semibold">Comentários</h2>
          {session?.user && <CommentForm bookId={book.id} slug={slug} />}
          <div className="mt-4 space-y-3">
            {comments.map((comment) => (
              <article key={comment.id} className="surface p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-stone-950 text-xs font-bold text-amber-100">{initials(comment.user.name)}</span>
                    <div>
                      <p className="text-sm font-semibold">{comment.user.name}</p>
                      <p className="mt-1 text-sm leading-6 text-stone-700 dark:text-stone-300">{comment.content}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <LikeButton slug={slug} commentId={comment.id} count={comment._count.likes} />
                    {session?.user?.id === comment.userId && <DeleteCommentButton id={comment.id} slug={slug} />}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="mt-8 md:mt-0">
          <h2 className="mb-4 font-serif text-3xl font-semibold">Resenhas</h2>
          {session?.user && <ReviewForm bookId={book.id} slug={slug} />}
          <div className="mt-4 space-y-3">
            {reviews.map((review) => (
              <article key={review.id} className="surface p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{review.title}</p>
                    <p className="text-xs text-stone-500">{review.user.name} · {review.rating} estrelas</p>
                  </div>
                  <LikeButton slug={slug} reviewId={review.id} count={review._count.likes} />
                </div>
                <p className="mt-3 text-sm leading-6 text-stone-700 dark:text-stone-300">{review.content}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="surface p-4">
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-xs text-stone-500">{label}</p>
    </div>
  );
}

function LoginHint() {
  return (
    <div className="surface p-4">
      <p className="font-semibold">Entre para interagir</p>
      <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-300">Faça login para favoritar, avaliar, comentar e montar sua biblioteca.</p>
    </div>
  );
}
