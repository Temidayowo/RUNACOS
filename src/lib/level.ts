export function computeLevel(admissionYear: number, currentSession: string): string {
  const sessionStart = parseInt(currentSession.split("/")[0]);
  if (isNaN(sessionStart)) return "N/A";
  const years = sessionStart - admissionYear;
  if (years <= 0) return "100";
  if (years >= 4) return "Extra Year";
  return `${(years + 1) * 100}`;
}
