import Link from "next/link";
import { Bell, BookOpen, Feather, Home, Library, Menu, Search, UsersRound, UserRound } from "lucide-react";
import { auth } from "@/auth";
import { logoutAction } from "@/app/actions";
import { ThemeToggle } from "@/components/theme-toggle";

const nav = [
  { href: "/", label: "Início", icon: Home },
  { href: "/obras", label: "Obras", icon: Library },
  { href: "/comunidade", label: "Comunidade", icon: UsersRound },
  { href: "/perfil", label: "Perfil", icon: UserRound },
];

const desktopNav = [
  ...nav.slice(0, 3),
  { href: "/sobre", label: "Sobre o Autor", icon: BookOpen },
  nav[3],
];

export async function AppShell({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-[var(--paper)] text-stone-950 dark:bg-stone-950 dark:text-stone-50">
      <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-[#f4ead8]/90 backdrop-blur-xl dark:border-stone-800 dark:bg-[#120d08]/92">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-4 sm:px-6">
          <button className="grid size-9 place-items-center rounded-md md:hidden" aria-label="Menu">
            <Menu size={20} />
          </button>

          <Link href="/" className="flex items-center gap-3">
            <Feather className="hidden text-[var(--gold)] md:block" size={28} />
            <span className="leading-tight">
              <span className="block font-serif text-xl font-bold uppercase leading-none tracking-wide">Josué</span>
              <span className="block font-serif text-xl font-bold uppercase leading-none tracking-wide">Montello</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {desktopNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-transparent py-2 text-sm font-semibold text-stone-800 transition hover:border-[var(--gold)] hover:text-stone-950 dark:text-stone-100"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <form action="/obras" className="relative hidden lg:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" size={16} />
              <input
                name="q"
                placeholder="Buscar obras..."
                className="h-10 w-64 rounded-lg border border-stone-500/40 bg-black/10 pl-9 pr-3 text-sm outline-none transition focus:border-[var(--gold)] dark:bg-white/5"
              />
            </form>
            <button className="relative hidden size-10 place-items-center rounded-full text-stone-800 md:grid dark:text-stone-100" aria-label="Notificações">
              <Bell size={19} />
              <span className="absolute right-2 top-2 size-2 rounded-full bg-red-500" />
            </button>
            <ThemeToggle />
            {session?.user ? (
              <form action={logoutAction}>
                <button className="hidden rounded-full border border-stone-400/50 px-4 py-2 text-sm font-semibold transition hover:border-[var(--gold)] md:inline-flex">
                  Sair
                </button>
              </form>
            ) : (
              <Link href="/login" className="rounded-full bg-stone-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-800 dark:bg-amber-200 dark:text-stone-950">
                Entrar
              </Link>
            )}
          </div>
        </div>
      </header>

      <main>{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-stone-200 bg-[#fbf3e7]/95 px-3 pb-[calc(env(safe-area-inset-bottom)+0.45rem)] pt-2 backdrop-blur md:hidden dark:border-stone-800 dark:bg-stone-950/95">
        <div className="grid grid-cols-4 gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-[11px] font-medium text-stone-800 active:bg-stone-200 dark:text-stone-200 dark:active:bg-stone-800"
            >
              <item.icon size={18} strokeWidth={1.8} />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
