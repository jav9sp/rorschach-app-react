import type { StructuralSummaryData } from "../../types/StructuralSummaryData";

/**
 * Evalúa la constelación OBS (estilo obsesivo).
 * Marca Positivo si se cumple alguna de las condiciones finales.
 */
export function evaluateOBS(summary: Partial<StructuralSummaryData>): {
  OBS: string;
  OBSCounter: number;
} {
  const reglas: boolean[] = [
    (summary["Dd"] ?? 0) > 3,
    (summary["Zf"] ?? 0) > 12,
    (summary["Zd"] ?? 0) > 3.0,
    (summary["Populares"] ?? 0) > 7,
    (summary["FQx+"] ?? 0) > 1,
  ];

  const totalReglas = reglas.filter(Boolean).length;

  let resultado = "Negativo";

  if (reglas.every(Boolean)) {
    resultado = "Positivo";
  }
  if (totalReglas >= 2 && (summary["FQx+"] ?? 0) > 3) {
    resultado = "Positivo";
  }
  if (totalReglas >= 3 && (summary["X+%"] ?? 0) > 0.89) {
    resultado = "Positivo";
  }
  if ((summary["DQ+"] ?? 0) > 3 && (summary["X+%"] ?? 0) > 0.89) {
    resultado = "Positivo";
  }

  return {
    OBS: resultado,
    OBSCounter: totalReglas,
  };
}
