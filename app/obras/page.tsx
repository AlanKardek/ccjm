import type { Metadata } from "next";
import { BookCard, BookListRow } from "@/components/book-card";
import { getBooks, getGenres } from "@/services/books";

export const metadata: Metadata = {
  title: "Obras",
  description: "Catálogo de obras de Josué Montello com busca, filtros, comentários e resenhas.",
};

export default async function ObrasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; genre?: string }>;
}) {
  const params = await searchParams;
  const [books, genres] = await Promise.all([getBooks(params.q, params.genre), getGenres()]);

  return (
    <div className="phone-page md:mx-auto md:max-w-[1500px] md:px-8 md:py-8">
      <div className="mb-6 md:mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-300">Catálogo</p>
        <h1 className="mt-2 font-serif text-4xl font-bold sm:text-5xl">Obras de Josué Montello</h1>
        <p className="mt-3 max-w-2xl text-stone-600 dark:text-stone-300">
          Busque romances, filtre por gênero e acompanhe estatísticas da comunidade.
        </p>
      </div>

      <form className="surface mb-6 grid gap-3 p-3 sm:grid-cols-[1fr_220px_auto]">
        <input name="q" defaultValue={params.q} placeholder="Buscar por título ou descrição" className="field" />
        <select name="genre" defaultValue={params.genre ?? ""} className="field">
          <option value="">Todos os gêneros</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
        <button className="primary-btn h-full">Filtrar</button>
      </form>

      <div className="hidden grid-cols-2 gap-5 md:grid lg:grid-cols-4 xl:grid-cols-5">
        {books.map((book) => <BookCard key={book.slug} book={book} />)}
      </div>
      <div className="surface px-4 md:hidden">
        {books.map((book) => <BookListRow key={book.slug} book={book} />)}
      </div>
    </div>
  );
}
