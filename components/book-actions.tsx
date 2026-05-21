import { Heart, Star } from "lucide-react";
import { auth } from "@/auth";
import { favoriteAction, updateReadingAction } from "@/app/actions";
import { ToastSubmitButton } from "@/components/toast-submit-button";
import { resolveUserId } from "@/lib/demo-user";
import { prisma } from "@/lib/prisma";

export async function BookActions({ bookId }: { bookId: string }) {
  const session = await auth();
  const userId = session?.user?.id ? await resolveUserId(session.user.id, session.user.email) : null;
  const [favorite, userBook] = userId
    ? await Promise.all([
        prisma.favorite.findUnique({ where: { userId_bookId: { userId, bookId } } }),
        prisma.userBook.findUnique({ where: { userId_bookId: { userId, bookId } } }),
      ])
    : [null, null];

  return (
    <div className="space-y-3">
      <form action={favoriteAction}>
        <input type="hidden" name="bookId" value={bookId} />
        <ToastSubmitButton
          className={favorite ? "primary-btn w-full bg-rose-800 hover:bg-rose-700" : "secondary-btn w-full"}
          pendingText={favorite ? "Removendo..." : "Favoritando..."}
          successText={favorite ? "Favorito removido." : "Obra favoritada."}
        >
          <Heart size={16} className={favorite ? "fill-white" : ""} /> {favorite ? "Favoritado" : "Favoritar"}
        </ToastSubmitButton>
      </form>
      <form action={updateReadingAction} className="grid gap-3">
        <input type="hidden" name="bookId" value={bookId} />
        <select name="status" defaultValue={userBook?.status ?? "WANT_TO_READ"} className="field">
          <option value="WANT_TO_READ">Quero ler</option>
          <option value="READING">Lendo atualmente</option>
          <option value="READ">Obra lida</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-300">
          <Star size={16} className="text-amber-500" />
          <input name="rating" type="number" min="1" max="5" defaultValue={userBook?.rating ?? ""} placeholder="nota" className="field h-10" />
        </label>
        <ToastSubmitButton pendingText="Salvando..." successText="Status de leitura atualizado.">
          Salvar status
        </ToastSubmitButton>
      </form>
    </div>
  );
}
