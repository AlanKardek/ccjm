import type { Metadata } from "next";
import { ResetForm } from "@/components/forms";

export const metadata: Metadata = { title: "Recuperar senha" };

export default function RecuperarSenhaPage() {
  return (
    <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-md content-center px-4 pb-24 pt-8">
      <div className="surface p-5">
        <h1 className="font-serif text-4xl font-bold">Recuperar senha</h1>
        <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-300">
          Informe seu email para gerar uma solicitação de redefinição.
        </p>
        <div className="mt-6">
          <ResetForm />
        </div>
      </div>
    </div>
  );
}
