export function getGreeting(date: Date = new Date()): string {
  const hour = date.getHours();

  if (hour < 5 || hour >= 18) return "Bonsoir";
  if (hour >= 12) return "Bon après-midi";
  return "Bonjour";
}
