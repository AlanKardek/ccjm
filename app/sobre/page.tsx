import type { Metadata } from "next";
import { authorFacts, authorTimeline, booksSeed } from "@/lib/seed-data";

export const metadata: Metadata = {
  title: "Sobre Josué Montello",
  description: "Biografia, trajetória literária, curiosidades e linha do tempo de Josué Montello.",
};

export default function SobrePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-28 pt-8 sm:px-6 md:pb-12">
      <section className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-300">O escritor</p>
          <h1 className="mt-2 font-serif text-5xl font-bold leading-none">Josué Montello</h1>
          <div className="mt-6 space-y-5 text-lg leading-8 text-stone-700 dark:text-stone-300">
            <p>
              Josué de Sousa Montello nasceu em São Luís, em 21 de agosto de 1917, e tornou-se uma das vozes brasileiras mais ligadas à memória cultural do Maranhão. Sua obra percorre romance, conto, teatro, ensaio, jornalismo, diário e crítica literária.
            </p>
            <p>
              Ele foi eleito para a Academia Brasileira de Letras em 1956, ocupando a cadeira 29. Ao longo da carreira, atuou em instituições culturais, lecionou e manteve uma produção literária marcada por elegância narrativa, observação social e forte consciência histórica.
            </p>
            <p>
              Entre seus livros mais lembrados estão <strong>Os tambores de São Luís</strong>, <strong>Cais da Sagração</strong>, <strong>Noite sobre Alcântara</strong> e <strong>A coroação de Dona Leonor</strong>.
            </p>
          </div>
        </div>
        <aside className="surface p-5">
          <h2 className="font-serif text-2xl font-semibold">Curiosidades</h2>
          <div className="mt-4 space-y-3">
            {authorFacts.map((fact) => (
              <p key={fact} className="rounded-md bg-amber-50 p-3 text-sm leading-6 text-stone-700 dark:bg-stone-950 dark:text-stone-300">{fact}</p>
            ))}
          </div>
        </aside>
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-3xl font-semibold">Linha do tempo</h2>
        <div className="mt-5 grid gap-3">
          {authorTimeline.map((item) => (
            <article key={item.year} className="grid gap-3 rounded-lg border border-stone-200 bg-white/70 p-4 dark:border-stone-800 dark:bg-stone-900/70 sm:grid-cols-[100px_1fr]">
              <strong className="font-serif text-2xl text-amber-700 dark:text-amber-300">{item.year}</strong>
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-stone-600 dark:text-stone-300">{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-3xl font-semibold">Principais obras na plataforma</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {booksSeed.map((book) => (
            <div key={book.slug} className="surface p-4">
              <p className="font-semibold">{book.title}</p>
              <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{book.year} · {book.genre}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
