export type SecuenciaLocalizacion = Record<LaminaClave, string[]>;
export type LaminaClave =
  | "I"
  | "II"
  | "III"
  | "IV"
  | "V"
  | "VI"
  | "VII"
  | "VIII"
  | "IX"
  | "X";

/**
 * Genera la secuencia de localizaciones por lámina I–X.
 * @param data Respuestas completas
 * @returns Objeto { I: [...], II: [...], ..., X: [...] }
 */
export function calcularSecuenciaLocalizacion(
  data: { Lam: string | number; Loc: string }[]
): Record<LaminaClave, string[]> {
  const secuencia: Record<LaminaClave, string[]> = {
    I: [],
    II: [],
    III: [],
    IV: [],
    V: [],
    VI: [],
    VII: [],
    VIII: [],
    IX: [],
    X: [],
  };

  const laminasValidas: LaminaClave[] = [
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

  data.forEach((row) => {
    const lamina = String(row.Lam).toUpperCase().trim() as LaminaClave;
    const loc = row.Loc?.toUpperCase().trim() ?? "FRACASO";

    if (laminasValidas.includes(lamina) && loc) {
      secuencia[lamina].push(loc);
    }
  });

  return secuencia;
}
