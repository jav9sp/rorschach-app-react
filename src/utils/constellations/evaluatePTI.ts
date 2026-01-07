import type { StructuralSummaryData } from "../../types/StructuralSummaryData";

/**
 * Evalúa la constelación PTI (trastornos de percepción-pensamiento).
 * Devuelve el número de condiciones cumplidas.
 */
export function evaluatePTI(summary: Partial<StructuralSummaryData>): {
  PTICounter: number;
} {
  let condiciones = 0;

  if ((summary["XA%"] ?? 1) < 0.7 && (summary["WDA%"] ?? 1) < 0.75) {
    condiciones += 1;
  }

  if ((summary["X-%"] ?? 0) > 0.29) {
    condiciones += 1;
  }

  if ((summary["Nvl-2"] ?? 0) > 2 && (summary["FAB2"] ?? 0) > 0) {
    condiciones += 1;
  }

  const r = summary["R"] ?? 0;
  const sumPon6 = summary["SumPon6"] ?? 0;
  if ((r < 17 && sumPon6 > 12) || (r > 16 && sumPon6 > 17)) {
    condiciones += 1;
  }

  if ((summary["MQ-"] ?? 0) > 1 || (summary["X-%"] ?? 0) > 0.4) {
    condiciones += 1;
  }

  return { PTICounter: condiciones };
}
