import type { APIInstructorSession } from "@/data/sessions";
import { toPortoNovoInputValue } from "@/lib/session-time";

export interface CalendarCell {
  key: string;
  day: number;
  inMonth: boolean;
  isToday: boolean;
}

export const WEEKDAY_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const toDateKey = (d: Date) => d.toISOString().slice(0, 10);

/** Jour courant */
export const todayKey = () => toPortoNovoInputValue(new Date().toISOString()).slice(0, 10);

/** Jour d'une session */
export const sessionDayKey = (iso: string) => toPortoNovoInputValue(iso).slice(0, 10);

export function shiftDateKey(key: string, days: number): string {
  const d = new Date(`${key}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return toDateKey(d);
}

/** Grille d'un mois (semaines du lundi au dimanche, 5 ou 6 lignes) */
export function buildMonthGrid(year: number, month: number): CalendarCell[] {
  const first = new Date(Date.UTC(year, month, 1));
  const offset = (first.getUTCDay() + 6) % 7; // lundi = 0
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const weeks = Math.ceil((offset + daysInMonth) / 7);
  const today = todayKey();

  return Array.from({ length: weeks * 7 }, (_, i) => {
    const d = new Date(Date.UTC(year, month, 1 - offset + i));
    const key = toDateKey(d);
    return { key, day: d.getUTCDate(), inMonth: d.getUTCMonth() === month, isToday: key === today };
  });
}

export function shiftMonth(year: number, month: number, delta: number) {
  const d = new Date(Date.UTC(year, month + delta, 1));
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() };
}

export function formatMonthLabel(year: number, month: number): string {
  const label = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(year, month, 1))
  );
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function formatDayKey(key: string): string {
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "full", timeZone: "UTC" }).format(new Date(`${key}T00:00:00Z`));
}

/** Sessions classées par jour (Porto-Novo), triées par heure de début */
export function groupSessionsByDay(sessions: APIInstructorSession[]): Record<string, APIInstructorSession[]> {
  const byDay: Record<string, APIInstructorSession[]> = {};
  for (const s of sessions) {
    const key = sessionDayKey(s.startsAt);
    if (!byDay[key]) byDay[key] = [];
    byDay[key].push(s);
  }
  for (const key of Object.keys(byDay)) {
    byDay[key].sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  }
  return byDay;
}