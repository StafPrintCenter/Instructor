// src/lib/file-size.ts
const numberFormat = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 });

/** 71013 → "69,3 Ko" */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${numberFormat.format(bytes / 1024)} Ko`;
  return `${numberFormat.format(bytes / (1024 * 1024))} Mo`;
}