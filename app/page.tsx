import Link from "next/link";
import Image from "next/image";
import { BookOpen, Bookmark, Heart, Search, Star } from "lucide-react";
import { BookCard } from "@/components/book-card";
import { getBooks, type BookWithStats } from "@/services/books";

export default async function Home() {
  const books: BookWithStats[] = await getBooks();
  const [featured] = books;

  return (
    <div className="pb-24 md:pb-0">
      <section className="md:hidden">
        <div className="mx-auto max-w-md px-4 pb-6 pt-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-2xl font-bold">Olá, leitor!</h1>
              <p className="text-xs text-stone-600">O que você deseja descobrir hoje?</p>
            </div>
            <div className="grid size-9 place-items-center rounded-full bg-stone-950 font-serif text-xs font-bold text-amber-100">JM</div>
          </div>
          <form action="/obras" className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
            <input name="q" placeholder="Buscar obras, autores, temas..." className="field h-12 pl-10" />
          </form>

          <div className="mt-5 flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold">Destaques</h2>
            <Link href="/obras" className="text-xs font-medium">Ver todos</Link>
          </div>
          {featured && (
            <Link href={`/obras/${featured.slug}`} className="relative mt-3 block overflow-hidden rounded-lg bg-stone-950 p-4 text-white shadow-lg">
              <Image src={featured.coverUrl} alt="" fill sizes="360px" className="object-cover opacity-55" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
              <div className="relative min-h-32">
                <h3 className="max-w-44 font-serif text-2xl font-semibold leading-tight">{featured.title}</h3>
                <p className="mt-1 text-xs text-stone-200">Josué Montello</p>
                <span className="mt-5 inline-flex rounded-md border border-white/35 px-3 py-2 text-xs font-semibold">Ver obra</span>
              </div>
            </Link>
          )}

          <div className="mt-4 grid grid-cols-4 gap-2">
            {[
              ["Quero ler", Bookmark],
              ["Lendo", BookOpen],
              ["Obra lida", Star],
              ["Favoritos", Heart],
            ].map(([label, Icon]) => (
              <div key={String(label)} className="surface grid aspect-square place-items-center p-2 text-center">
                <Icon className="text-[var(--gold)]" size={18} />
                <span className="mt-1 text-[11px] font-medium">{String(label)}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold">Obras mais populares</h2>
            <Link href="/obras" className="text-xs font-medium">Ver todos</Link>
          </div>
          <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
            {books.map((book) => (
              <div key={book.slug} className="w-32 shrink-0">
                <BookCard book={book} compact />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative hidden overflow-hidden border-b border-stone-800 bg-[#0f0a06] text-white md:block">
        <Image src="/hero-library.svg" alt="" fill priority className="object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/15" />
        <div className="relative mx-auto grid min-h-[460px] max-w-[1500px] items-center px-8 py-16">
          <div className="max-w-2xl">
            <h1 className="font-serif text-6xl font-bold leading-[0.98] text-balance">
              Descubra o universo de Josué Montello
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-stone-100">
              Explore suas obras, conheça sua história e compartilhe suas leituras com outros apaixonados pela literatura.
            </p>
            <div className="mt-8 flex gap-3">
              <Link href="/obras" className="primary-btn bg-[var(--gold)] text-stone-950 hover:bg-amber-300">Explorar obras</Link>
              <Link href="/sobre" className="secondary-btn border-white/50 text-white hover:bg-white/10">Sobre o autor</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="hidden bg-[#fbf3e7] py-8 md:block dark:bg-stone-950">
        <div className="mx-auto max-w-[1500px] px-8">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-serif text-3xl font-semibold">Obras em destaque</h2>
            <Link href="/obras" className="text-sm font-medium">Ver todas</Link>
          </div>
          <div className="grid grid-cols-5 gap-7">
            {books.slice(0, 5).map((book) => (
              <BookCard key={book.slug} book={book} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
