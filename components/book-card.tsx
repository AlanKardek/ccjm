import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import type { BookWithStats } from "@/services/books";

export function BookCard({ book, compact = false }: { book: BookWithStats; compact?: boolean }) {
  return (
    <Link
      href={`/obras/${book.slug}`}
      className="group block overflow-hidden rounded-lg border border-stone-900/10 bg-stone-950 shadow-md shadow-stone-900/15 transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className={compact ? "relative aspect-[3/4]" : "relative aspect-[2/3]"}>
        <Image src={book.coverUrl} alt={`Capa de ${book.title}`} fill sizes="(max-width: 768px) 42vw, 220px" className="object-cover transition duration-500 group-hover:scale-105" />
        <div className="book-cover-card absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <h3 className="font-serif text-xl font-semibold leading-tight">{book.title}</h3>
          <p className="mt-1 text-xs text-stone-200">Josué Montello</p>
          <div className="mt-6 flex items-center gap-2 text-xs">
            <Star size={14} className="fill-[var(--gold)] text-[var(--gold)]" />
            <span>{book.averageRating ? book.averageRating.toFixed(1) : "4.8"}</span>
            <span className="text-stone-300">· ({book.reviews || book.readers})</span>
          </div>
          <p className="mt-2 text-[11px] text-stone-200">{book.genre}</p>
        </div>
      </div>
    </Link>
  );
}

export function BookListRow({ book }: { book: BookWithStats }) {
  return (
    <Link href={`/obras/${book.slug}`} className="grid grid-cols-[70px_1fr_auto] items-center gap-3 border-b border-stone-300/70 py-3 last:border-b-0">
      <Image src={book.coverUrl} alt="" width={90} height={135} className="aspect-[2/3] rounded-md object-cover shadow-sm" />
      <div className="min-w-0">
        <h3 className="truncate font-serif text-lg font-semibold">{book.title}</h3>
        <p className="mt-0.5 text-xs text-stone-600 dark:text-stone-300">Josué Montello</p>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-stone-600 dark:text-stone-400">{book.description}</p>
      </div>
      <span className="text-stone-500">•••</span>
    </Link>
  );
}
