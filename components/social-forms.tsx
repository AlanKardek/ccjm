import { Heart, Trash2 } from "lucide-react";
import { createCommentAction, createReviewAction, deleteCommentAction, likeAction } from "@/app/actions";
import { ToastSubmitButton } from "@/components/toast-submit-button";

export function CommentForm({ bookId, slug }: { bookId: string; slug: string }) {
  return (
    <form action={createCommentAction} className="rounded-lg border border-stone-200 bg-white/75 p-4 dark:border-stone-800 dark:bg-stone-900/70">
      <input type="hidden" name="bookId" value={bookId} />
      <input type="hidden" name="slug" value={slug} />
      <textarea name="content" required minLength={3} placeholder="Escreva um comentário..." className="field min-h-24 resize-none" />
      <ToastSubmitButton className="primary-btn mt-3" pendingText="Comentando..." successText="Comentário publicado.">
        Comentar
      </ToastSubmitButton>
    </form>
  );
}

export function ReviewForm({ bookId, slug }: { bookId: string; slug: string }) {
  return (
    <form action={createReviewAction} className="rounded-lg border border-stone-200 bg-white/75 p-4 dark:border-stone-800 dark:bg-stone-900/70">
      <input type="hidden" name="bookId" value={bookId} />
      <input type="hidden" name="slug" value={slug} />
      <input name="title" required placeholder="Título da resenha" className="field" />
      <textarea name="content" required minLength={10} placeholder="Sua leitura crítica..." className="field mt-3 min-h-28 resize-none" />
      <select name="rating" className="field mt-3">
        {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} estrelas</option>)}
      </select>
      <ToastSubmitButton className="primary-btn mt-3" pendingText="Publicando..." successText="Resenha publicada.">
        Publicar resenha
      </ToastSubmitButton>
    </form>
  );
}

export function LikeButton({ slug, commentId, reviewId, count }: { slug: string; commentId?: string; reviewId?: string; count: number }) {
  return (
    <form action={likeAction}>
      <input type="hidden" name="slug" value={slug} />
      {commentId && <input type="hidden" name="commentId" value={commentId} />}
      {reviewId && <input type="hidden" name="reviewId" value={reviewId} />}
      <button className="inline-flex items-center gap-1 text-xs text-stone-500 transition hover:text-rose-600 dark:text-stone-400">
        <Heart size={14} /> {count}
      </button>
    </form>
  );
}

export function DeleteCommentButton({ id, slug }: { id: string; slug: string }) {
  return (
    <form action={deleteCommentAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="slug" value={slug} />
      <button title="Excluir comentário" className="text-stone-400 transition hover:text-red-600">
        <Trash2 size={14} />
      </button>
    </form>
  );
}
