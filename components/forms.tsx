"use client";

import { useActionState } from "react";
import { registerAction, loginAction, requestPasswordResetAction } from "@/app/actions";

type State = { error?: string; success?: string } | undefined;

export function LoginForm() {
  const [state, action, pending] = useActionState<State, FormData>(loginAction, undefined);
  return (
    <form action={action} className="space-y-4">
      <input name="email" type="email" required placeholder="email" className="field" />
      <input name="password" type="password" required placeholder="senha" className="field" />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button disabled={pending} className="primary-btn w-full">{pending ? "Entrando..." : "Entrar"}</button>
    </form>
  );
}

export function RegisterForm() {
  const [state, action, pending] = useActionState<State, FormData>(registerAction, undefined);
  return (
    <form action={action} className="space-y-4">
      <input name="name" required placeholder="nome" className="field" />
      <input name="username" required placeholder="username" className="field" />
      <input name="email" type="email" required placeholder="email" className="field" />
      <input name="password" type="password" required minLength={6} placeholder="senha" className="field" />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button disabled={pending} className="primary-btn w-full">{pending ? "Criando..." : "Criar conta"}</button>
    </form>
  );
}

export function ResetForm() {
  const [state, action, pending] = useActionState<State, FormData>(requestPasswordResetAction, undefined);
  return (
    <form action={action} className="space-y-4">
      <input name="email" type="email" required placeholder="email" className="field" />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-emerald-700 dark:text-emerald-300">{state.success}</p>}
      <button disabled={pending} className="primary-btn w-full">{pending ? "Preparando..." : "Recuperar senha"}</button>
    </form>
  );
}
