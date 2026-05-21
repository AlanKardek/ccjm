import Link from "next/link";
import type { Metadata } from "next";
import { oauthAction } from "@/app/actions";
import { LoginForm } from "@/components/forms";

export const metadata: Metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <AuthFrame title="Entrar" subtitle="Acesse sua biblioteca, favoritos e conversas.">
      <LoginForm />
      <div className="grid gap-2">
        <form action={async () => { "use server"; await oauthAction("google"); }}>
          <button className="secondary-btn w-full">Continuar com Google</button>
        </form>
        <form action={async () => { "use server"; await oauthAction("facebook"); }}>
          <button className="secondary-btn w-full">Continuar com Facebook</button>
        </form>
      </div>
      <div className="flex justify-between text-sm">
        <Link href="/cadastro" className="font-semibold hover:text-amber-700">Criar conta</Link>
        <Link href="/recuperar-senha" className="font-semibold hover:text-amber-700">Esqueci a senha</Link>
      </div>
    </AuthFrame>
  );
}

function AuthFrame({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-md content-center px-4 pb-24 pt-8">
      <div className="surface p-5">
        <h1 className="font-serif text-4xl font-bold">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-300">{subtitle}</p>
        <div className="mt-6 space-y-5">{children}</div>
      </div>
    </div>
  );
}
