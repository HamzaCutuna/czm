export function todayInSarajevo() {
  const fmt = new Intl.DateTimeFormat("bs-BA", {
    timeZone: "Europe/Sarajevo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const parts = Object.fromEntries(fmt.formatToParts(new Date()).map(p => [p.type, p.value]));
  const dan = parseInt(parts.day, 10);
  const mjesec = parseInt(parts.month, 10);
  return { dan, mjesec };
}
