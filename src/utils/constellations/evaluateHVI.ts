import type { StructuralSummaryData } from "../../types/StructuralSummaryData";

/**
 * Evalúa la constelación HVI (hipervigilancia).
 * Requiere que Condición 1 se cumpla (SumT == 0) y al menos 4 del resto.
 */
export function evaluateHVI(variables: Partial<StructuralSummaryData>): {
  HVI: string;
} {
  let resultado = "Negativo";

  const sumFtTfT =
    (variables["FT"] ?? 0) + (variables["TF"] ?? 0) + (variables["T"] ?? 0);

  // Condición 1 obligatoria: FT + TF + T == 0
  if (sumFtTfT !== 0) {
    return { HVI: "Negativo" };
  }

  let condiciones = 0;

  if ((variables["Zf"] ?? 0) > 12) condiciones += 1;
  if ((variables["Zd"] ?? 0) > 3.5) condiciones += 1;
  if ((variables["S"] ?? 0) > 3) condiciones += 1;
  if ((variables["TodoH"] ?? 0) > 6) condiciones += 1;

  const parH =
    (variables["(H)"] ?? 0) +
    (variables["(Hd)"] ?? 0) +
    (variables["(Ad)"] ?? 0);
  if (parH > 3) condiciones += 1;

  const sumHA = (variables["H"] ?? 0) + (variables["A"] ?? 0);
  const sumHdAd = (variables["Hd"] ?? 0) + (variables["Ad"] ?? 0);
  if (sumHA > sumHdAd && sumHA < 4) condiciones += 1;

  if ((variables["Cg"] ?? 0) > 3) condiciones += 1;

  if (condiciones >= 4) resultado = "Positivo";

  return {
    HVI: resultado,
  };
}
