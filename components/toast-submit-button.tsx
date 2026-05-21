"use client";

import { useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

export function ToastSubmitButton({
  children,
  pendingText = "Salvando...",
  successText = "Pronto. Alteração salva.",
  className = "primary-btn",
}: {
  children: React.ReactNode;
  pendingText?: string;
  successText?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  const wasPending = useRef(false);

  useEffect(() => {
    if (pending) wasPending.current = true;
    if (!pending && wasPending.current) {
      toast.success(successText);
      wasPending.current = false;
    }
  }, [pending, successText]);

  return (
    <button disabled={pending} className={className}>
      {pending ? pendingText : children}
    </button>
  );
}
