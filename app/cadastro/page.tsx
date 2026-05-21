import Link from "next/link";
import type { Metadata } from "next";
import { RegisterForm } from "@/components/forms";

export const metadata: Metadata = { title: "Cadastro" };

export default function CadastroPage() {
  return (
    <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-md content-center px-4 pb-24 pt-8">
      <div className="surface p-5">
        <h1 className="font-serif text-4xl font-bold">Criar conta</h1>
        <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-300">
          Monte sua biblioteca montelliana e participe das conversas.
        </p>
        <div className="mt-6">
          <RegisterForm />
        </div>
        <p className="mt-5 text-sm text-stone-600 dark:text-stone-300">
          Já tem conta? <Link href="/login" className="font-semibold hover:text-amber-700">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
