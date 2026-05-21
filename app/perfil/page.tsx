import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpen, ChevronRight, Settings } from "lucide-react";
import { auth } from "@/auth";
import { initials, readingStatusLabel } from "@/lib/utils";
import { getProfile } from "@/services/profile";

export const metadata: Metadata = { title: "Meu perfil" };

export default async function PerfilPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const profile = await getProfile(session.user.id);
  if (!profile) redirect("/login");

  const read = profile.library.filter((item) => item.status === "READ");
  const reading = profile.library.filter((item) => item.status === "READING");
  const want = profile.library.filter((item) => item.status === "WANT_TO_READ");

  return (
    <div className="pb-24 md:grid md:grid-cols-[220px_1fr] md:pb-0">
      <aside className="hidden min-h-[calc(100svh-4rem)] bg-[#120d08] p-7 text-white md:block">
        <div className="font-serif text-xl font-bold uppercase leading-tight text-amber-100">Josué<br />Montello</div>
        <nav className="mt-12 grid gap-4 text-sm">
          {["Início", "Obras", "Sobre o Autor", "Comunidade", "Minha Estante", "Favoritos"].map((item) => (
            <span key={item} className="text-stone-200">{item}</span>
          ))}
        </nav>
        <div className="mt-28 grid gap-4 text-sm text-stone-300">
          <span>Configurações</span>
          <span>Sair</span>
        </div>
      </aside>

      <main className="mx-auto w-full max-w-[1320px] px-4 pt-5 md:px-10 md:py-8">
        <section className="md:hidden">
          <div className="flex items-center justify-between">
            <span />
            <h1 className="text-sm font-semibold">Meu Perfil</h1>
            <Settings size={18} />
          </div>
          <ProfileHeader profile={profile} compact />
          <MobileStats read={read.length} comments={profile._count.comments} reviews={profile._count.reviews} favorites={profile._count.favorites} />
        </section>

        <section className="hidden md:block">
          <div className="flex items-start justify-between">
            <ProfileHeader profile={profile} />
            <button className="secondary-btn h-10">Editar perfil</button>
          </div>
          <div className="mt-7 grid grid-cols-4 divide-x divide-stone-300 rounded-lg border border-stone-300/70 bg-[#fbf3e7]/75">
            <StatNumber value={profile._count.reviews} label="Resenhas" />
            <StatNumber value={profile._count.comments} label="Comentários" />
            <StatNumber value={read.length} label="Obras lidas" />
            <StatNumber value={profile._count.favorites} label="Favoritos" />
          </div>
        </section>

        <div className="mt-6 flex gap-8 border-b border-stone-300 text-sm">
          {["Resumo", "Resenhas", "Comentários", "Estante", "Atividade"].map((tab, index) => (
            <span key={tab} className={index === 0 ? "border-b-2 border-stone-950 pb-3 font-semibold" : "pb-3 text-stone-600"}>{tab}</span>
          ))}
        </div>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="surface p-4">
            <h2 className="font-semibold">Leitura em andamento</h2>
            <ShelfRows items={reading.length ? reading : want.slice(0, 1)} />
          </div>
          <div className="surface p-4">
            <h2 className="font-semibold">Minha estante</h2>
            <div className="mt-4 grid gap-2">
              <MobileShelfLink color="bg-sky-700" title="Quero ler" count={want.length} />
              <MobileShelfLink color="bg-amber-600" title="Lendo atualmente" count={reading.length} />
              <MobileShelfLink color="bg-green-700" title="Obras lidas" count={read.length} />
              <MobileShelfLink color="bg-rose-700" title="Favoritos" count={profile._count.favorites} />
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <Feed title="Resenhas publicadas" items={profile.reviews.map((review) => ({
            href: `/obras/${review.book.slug}`,
            title: review.title,
            meta: `${review.book.title} · ${review.rating} estrelas`,
            body: review.content,
          }))} />
          <Feed title="Comentários realizados" items={profile.comments.map((comment) => ({
            href: `/obras/${comment.book.slug}`,
            title: comment.book.title,
            meta: "Comentário",
            body: comment.content,
          }))} />
        </section>
      </main>
    </div>
  );
}

function ProfileHeader({ profile, compact = false }: { profile: { name: string | null; username: string | null; bio: string | null; createdAt: Date }; compact?: boolean }) {
  return (
    <div className={compact ? "mt-6 text-center" : "flex items-center gap-6"}>
      <span className={`${compact ? "mx-auto size-24 text-3xl" : "size-28 text-4xl"} grid place-items-center rounded-full bg-stone-950 font-serif font-bold text-amber-100`}>
        {initials(profile.name)}
      </span>
      <div className={compact ? "mt-3" : ""}>
        <h1 className="font-serif text-3xl font-bold md:text-4xl">{profile.name}</h1>
        <p className="text-sm text-stone-500">@{profile.username}</p>
        <p className="mt-2 max-w-xl text-sm leading-6 text-stone-600">{profile.bio ?? "Apaixonado por leitura e pela literatura maranhense."}</p>
        {!compact && <p className="mt-1 text-xs text-stone-500">Entrou em {profile.createdAt.toLocaleDateString("pt-BR")}</p>}
      </div>
    </div>
  );
}

function MobileStats({ read, comments, reviews, favorites }: { read: number; comments: number; reviews: number; favorites: number }) {
  return (
    <div className="mt-5 grid grid-cols-4 text-center">
      <StatNumber value={reviews} label="Resenhas" />
      <StatNumber value={comments} label="Comentários" />
      <StatNumber value={read} label="Obras lidas" />
      <StatNumber value={favorites} label="Favoritos" />
    </div>
  );
}

function StatNumber({ value, label }: { value: number; label: string }) {
  return (
    <div className="p-3">
      <p className="text-xl font-semibold">{value}</p>
      <p className="text-[11px] text-stone-500">{label}</p>
    </div>
  );
}

function ShelfRows({ items }: { items: Array<{ id: string; status: string; rating: number | null; book: { slug: string; title: string; coverUrl: string } }> }) {
  return (
    <div className="mt-4 grid gap-3">
      {items.length ? items.map((item) => (
        <Link key={item.id} href={`/obras/${item.book.slug}`} className="grid grid-cols-[64px_1fr] gap-3">
          <Image src={item.book.coverUrl} alt="" width={128} height={192} className="aspect-[2/3] rounded-md object-cover" />
          <div>
            <p className="font-serif text-lg font-semibold leading-tight">{item.book.title}</p>
            <p className="mt-1 text-xs text-stone-500">Josué Montello</p>
            <p className="mt-3 text-xs">{readingStatusLabel(item.status)}</p>
            <div className="mt-2 h-2 rounded-full bg-stone-200"><div className="h-2 w-3/5 rounded-full bg-[var(--gold)]" /></div>
          </div>
        </Link>
      )) : <p className="text-sm text-stone-500">Nenhum livro aqui ainda.</p>}
    </div>
  );
}

function MobileShelfLink({ color, title, count }: { color: string; title: string; count: number }) {
  return (
    <div className="flex items-center justify-between border-b border-stone-300 py-3 last:border-b-0">
      <div className="flex items-center gap-3">
        <span className={`grid size-8 place-items-center rounded-full ${color} text-white`}>
          <BookOpen size={15} />
        </span>
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-xs text-stone-500">{count} obras</p>
        </div>
      </div>
      <ChevronRight size={18} className="text-stone-500" />
    </div>
  );
}

function Feed({ title, items }: { title: string; items: Array<{ href: string; title: string; meta: string; body: string }> }) {
  return (
    <div>
      <h2 className="mb-4 font-serif text-3xl font-semibold">{title}</h2>
      <div className="space-y-3">
        {items.length ? items.map((item) => (
          <Link href={item.href} key={`${item.href}-${item.title}`} className="surface block p-4 transition hover:border-amber-500">
            <p className="font-semibold">{item.title}</p>
            <p className="mt-1 text-xs text-stone-500">{item.meta}</p>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-600 dark:text-stone-300">{item.body}</p>
          </Link>
        )) : <p className="surface p-4 text-sm text-stone-500">Nada publicado ainda.</p>}
      </div>
    </div>
  );
}
