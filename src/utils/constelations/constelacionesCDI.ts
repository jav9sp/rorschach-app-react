import type { StructuralSummaryData } from "../../types/StructuralSummaryData";

/**
 * Evalúa la constelación CDI (inhabilidad social).
 * Requiere 4 de 5 condiciones.
 */
export function evaluarCDI(variables: Partial<StructuralSummaryData>): {
  CDI: string;
  "CDI Contador": number;
} {
  let condiciones = 0;

  if (variables["EA"] ?? (0 < 6 || variables["AdjD"]) ?? 0 < 0)
    condiciones += 1;

  if ((variables["COP"] ?? 0) < 2 && (variables["AG"] ?? 0) < 2)
    condiciones += 1;

  if ((variables["SumPonC"] ?? 10) < 2.5 || (variables["Afr"] ?? 1) < 0.46)
    condiciones += 1;

  if (
    (variables["p"] ?? 0) > (variables["a"] ?? 0) + 1 ||
    (variables["H"] ?? 0) < 2
  )
    condiciones += 1;

  let extra = 0;
  if ((variables["SumT"] ?? 0) > 1) extra += 1;
  if ((variables["Aisl/R"] ?? 0) > 0.24) extra += 1;
  if ((variables["Fd"] ?? 0) > 0) extra += 1;

  const resultado =
    condiciones >= 4 || (condiciones === 3 && extra > 0)
      ? "Positivo"
      : "Negativo";

  return {
    CDI: resultado,
    "CDI Contador": condiciones,
  };
}
