const TZ = "Africa/Porto-Novo";
const OFFSET = "+01:00";

const fullFmt = new Intl.DateTimeFormat("fr-FR", { dateStyle: "full", timeStyle: "short", timeZone: TZ });
const shortFmt = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short", timeZone: TZ });
const timeFmt = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: TZ });

const inputFmt = new Intl.DateTimeFormat("sv-SE", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: TZ,
});

export const formatSessionDateTime = (iso: string) => fullFmt.format(new Date(iso));
export const formatSessionShortDateTime = (iso: string) => shortFmt.format(new Date(iso));
export const formatSessionTime = (iso: string) => timeFmt.format(new Date(iso));
export const formatSessionTimeRange = (start: string, end: string) =>
  `${formatSessionTime(start)} – ${formatSessionTime(end)}`;

export function getSessionDayParts(iso: string) {
  const d = new Date(iso);
  const part = (opts: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("fr-FR", { ...opts, timeZone: TZ }).format(d);
  return {
    weekday: part({ weekday: "short" }),
    day: part({ day: "2-digit" }),
    month: part({ month: "short" }),
    year: part({ year: "numeric" }),
  };
}

/** ISO → valeur d'un <input type="datetime-local"> en heure de Porto-Novo */
export function toPortoNovoInputValue(iso: string): string {
  return inputFmt.format(new Date(iso)).replace(/\s+/, "T");
}

/** Valeur d'un <input type="datetime-local"> → startsAt avec fuseau explicite */
export function toStartsAtPayload(inputValue: string): string {
  return `${inputValue}:00${OFFSET}`;
}

/** Plus petite date de début autorisée à la création (aujourd'hui + 3 jours) */
export function minSessionStartInputValue(daysAhead = 3): string {
  return toPortoNovoInputValue(new Date(Date.now() + daysAhead * 86_400_000).toISOString());
}