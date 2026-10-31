import type { APICommunityCategoryRef } from "@/data/community";

export function CategoryBadge({ category }: { category: APICommunityCategoryRef }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium"
      style={{
        color: category.color,
        borderColor: `color-mix(in srgb, ${category.color} 35%, transparent)`,
        backgroundColor: `color-mix(in srgb, ${category.color} 10%, transparent)`,
      }}
    >
      <span className="size-1.5 rounded-full" style={{ backgroundColor: category.color }} />
      {category.name}
    </span>
  );
}