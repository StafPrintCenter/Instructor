export function TrainingCardCover({ color }: { color: string | null }) {
  return <div className="h-1.5 w-full" style={{ backgroundColor: color || "var(--primary)" }} />;
}