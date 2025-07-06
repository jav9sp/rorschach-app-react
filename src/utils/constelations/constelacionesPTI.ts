import type { StructuralSummaryData } from "../../types/StructuralSummaryData";

/**
 * Evalúa la constelación PTI (trastornos de percepción-pensamiento).
 * Devuelve el número de condiciones cumplidas.
 */
export function evaluarPTI(variables: Partial<StructuralSummaryData>): {
  PTI: number;
} {
  let condiciones = 0;

  if ((variables["XA%"] ?? 1) < 0.7 && (variables["WDA%"] ?? 1) < 0.75) {
    condiciones += 1;
  }

  if ((variables["X-%"] ?? 0) > 0.29) {
    condiciones += 1;
  }

  if ((variables["Nvl-2"] ?? 0) > 2 && (variables["FAB2"] ?? 0) > 0) {
    condiciones += 1;
  }

  const r = variables["R"] ?? 0;
  const sumPon6 = variables["SumPon6"] ?? 0;
  if ((r < 17 && sumPon6 > 12) || (r > 16 && sumPon6 > 17)) {
    condiciones += 1;
  }

  if ((variables["MQ-"] ?? 0) > 1 || (variables["X-%"] ?? 0) > 0.4) {
    condiciones += 1;
  }

  return { PTI: condiciones };
}
