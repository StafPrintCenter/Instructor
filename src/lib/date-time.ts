export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function relativeTime(value: string) {
  const diff = Date.now() - new Date(value).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days > 0) return `il y a ${days} j`;
  const hours = Math.floor(diff / 3_600_000);
  if (hours > 0) return `il y a ${hours} h`;
  const minutes = Math.max(1, Math.floor(diff / 60_000));
  return `il y a ${minutes} min`;
}

export function daysSince(value: string) {
  return Math.floor((Date.now() - new Date(value).getTime()) / 86_400_000);
}
