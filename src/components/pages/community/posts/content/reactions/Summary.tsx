import { getReactionEmoji } from "@/data/community-reactions";

interface ReactionSummaryProps {
  reactions: Record<string, number>;
  total: number;
  onClick: () => void;
}

/** Les 3 réactions les plus fréquentes + le total ; ouvre « Qui a réagi » */
export function ReactionSummary({ reactions, total, onClick }: ReactionSummaryProps) {
  if (total <= 0) return null;

  const top = Object.entries(reactions)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${total} réaction${total > 1 ? "s" : ""} : voir qui a réagi`}
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
    >
      <span className="flex gap-0.5 text-sm">
        {top.map(([type]) => (
          <span key={type}>{getReactionEmoji(type)}</span>
        ))}
      </span>
      <span className="font-medium">{total}</span>
    </button>
  );
}