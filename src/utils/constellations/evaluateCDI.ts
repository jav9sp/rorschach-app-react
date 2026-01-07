import type { StructuralSummaryData } from "../../types/StructuralSummaryData";

type CDIResults = {
  CDI: string;
  CDICounter: number;
};

/**
 * Evalúa la constelación CDI (inhabilidad social).
 * Requiere 4 de 5 condiciones.
 */
export function evaluateCDI(
  summary: Partial<StructuralSummaryData>
): CDIResults {
  let condiciones = 0;

  if (summary["EA"] ?? (0 < 6 || summary["AdjD"]) ?? 0 < 0) condiciones += 1;

  if ((summary["COP"] ?? 0) < 2 && (summary["AG"] ?? 0) < 2) condiciones += 1;

  if ((summary["SumPonC"] ?? 10) < 2.5 || (summary["Afr"] ?? 1) < 0.46)
    condiciones += 1;

  if ((summary["p"] ?? 0) > (summary["a"] ?? 0) + 1 || (summary["H"] ?? 0) < 2)
    condiciones += 1;

  let extra = 0;
  if ((summary["SumT"] ?? 0) > 1) extra += 1;
  if ((summary["Aisl/R"] ?? 0) > 0.24) extra += 1;
  if ((summary["Fd"] ?? 0) > 0) extra += 1;

  const resultado =
    condiciones >= 4 || (condiciones === 3 && extra > 0)
      ? "Positivo"
      : "Negativo";

  return {
    CDI: resultado,
    CDICounter: condiciones,
  };
}
