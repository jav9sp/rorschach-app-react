import type { LaminaClave } from "./counters/moduleSecuenciaLocalizacion";

export function checkAllHaveResponses(
  sequence: Record<LaminaClave, string[]>
): { ok: boolean; failed: LaminaClave[] } {
  const laminas: LaminaClave[] = [
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X",
  ];

  const failed = laminas.filter((lam) => {
    const locs = sequence[lam] ?? [];
    return !locs.some((loc) => String(loc).toUpperCase().trim() !== "FRACASO");
  });

  return { ok: failed.length === 0, failed };
}
