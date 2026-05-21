import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle, MoreVertical, PenLine, Star } from "lucide-react";
import { initials } from "@/lib/utils";
import { getCommunityFeed } from "@/services/community";

export const metadata: Metadata = {
  title: "Comunidade",
  description: "Feed de comentários e resenhas dos leitores de Josué Montello.",
};

export default async function ComunidadePage() {
  const feed = await getCommunityFeed();

  return (
    <div className="phone-page md:mx-auto md:max-w-[1500px] md:px-8 md:py-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-300">Comunidade</p>
          <h1 className="mt-2 font-serif text-4xl font-bold">Conversas literárias</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600 dark:text-stone-300">
            Comentários, resenhas e descobertas recentes de leitores da plataforma.
          </p>
        </div>
        <Link href="/obras" className="primary-btn hidden md:inline-flex">
          <PenLine size={16} /> Escrever resenha
        </Link>
      </div>

      <div className="mb-5 flex gap-6 border-b border-stone-300 text-sm">
        {["Todos", "Comentários", "Resenhas"].map((tab, index) => (
          <span key={tab} className={index === 0 ? "border-b-2 border-stone-950 pb-3 font-semibold" : "pb-3 text-stone-600"}>{tab}</span>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <section className="space-y-4">
          {feed.length ? feed.map((item) => (
            <Link key={`${item.type}-${item.id}`} href={item.href} className="surface grid grid-cols-[1fr_72px] gap-4 p-4 transition hover:border-amber-500 md:grid-cols-[1fr_92px]">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <Avatar name={item.userName} image={item.userImage} />
                    <div>
                      <p className="text-sm font-semibold">{item.userName}</p>
                      <p className="text-xs text-stone-500">{item.type} · {item.createdAt.toLocaleDateString("pt-BR")}</p>
                    </div>
                  </div>
                  <MoreVertical size={17} className="text-stone-500" />
                </div>
                <h2 className="mt-3 font-serif text-xl font-semibold leading-tight">{item.title}</h2>
                {"bookTitle" in item && <p className="mt-1 text-xs text-stone-500">{item.bookTitle}</p>}
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-stone-700 dark:text-stone-300">{item.body}</p>
                <div className="mt-4 flex items-center gap-5 text-xs text-stone-500">
                  <span className="inline-flex items-center gap-1 text-rose-700"><Heart size={14} /> {item.likes}</span>
                  <span className="inline-flex items-center gap-1"><MessageCircle size={14} /> Responder</span>
                  {"rating" in item && <span className="inline-flex items-center gap-1"><Star className="fill-[var(--gold)] text-[var(--gold)]" size={14} /> {item.rating}</span>}
                </div>
              </div>
              <Image src={item.bookCover} alt="" width={184} height={276} className="aspect-[2/3] rounded-md object-cover shadow-sm" />
            </Link>
          )) : (
            <div className="surface p-8 text-center">
              <p className="font-serif text-2xl font-semibold">A comunidade ainda está silenciosa.</p>
              <p className="mt-2 text-sm text-stone-600">Publique um comentário ou resenha em uma obra para começar.</p>
            </div>
          )}
        </section>

        <aside className="hidden lg:block">
          <div className="surface p-5">
            <h2 className="font-serif text-2xl font-semibold">Atividade</h2>
            <div className="mt-4 grid gap-3 text-sm">
              <Stat label="Publicações" value={feed.length} />
              <Stat label="Comentários" value={feed.filter((item) => item.type === "Comentário").length} />
              <Stat label="Resenhas" value={feed.filter((item) => item.type === "Resenha").length} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Avatar({ name, image }: { name: string; image?: string | null }) {
  if (image) {
    return <Image src={image} alt="" width={40} height={40} className="size-10 rounded-full object-cover" />;
  }
  return (
    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-stone-950 text-xs font-bold text-amber-100">
      {initials(name)}
    </span>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-stone-300/70 bg-white/45 px-3 py-2 dark:border-stone-800 dark:bg-stone-950/40">
      <span className="text-stone-600 dark:text-stone-300">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
