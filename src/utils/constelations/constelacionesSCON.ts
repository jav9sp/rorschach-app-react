import type { StructuralSummaryData } from "../../types/StructuralSummaryData";

/**
 * Evalúa la constelación S-CON (suicidio).
 * Marca Positivo si >= 8 condiciones y edad >= 15.
 */
export function evaluarSCON(
  variables: Partial<StructuralSummaryData>,
  edad: number
): { SCON: string; "SCON Contador": number } {
  if (edad < 15) {
    return { SCON: "No aplica. Menor a 15 años.", "SCON Contador": 0 };
  }

  let condiciones = 0;

  if ((variables["SumV"] ?? 0) + (variables["FD"] ?? 0) > 2) {
    condiciones += 1;
  }

  if ((variables["CompljsColSH"] ?? 0) > 0) {
    condiciones += 1;
  }

  const egoc = variables["Ego"] ?? 0;
  if (typeof egoc === "number" && egoc < 0.31) condiciones += 1;
  if (typeof egoc === "number" && egoc > 0.44) condiciones += 1;

  if ((variables["MOR"] ?? 0) > 3) {
    condiciones += 1;
  }

  const zd = variables["Zd"] ?? 0;
  if (zd > 3.5) condiciones += 1;
  if (zd < -3.5) condiciones += 1;

  const es = variables["es"] ?? 0;
  const ea = variables["EA"] ?? 0;
  if (es > ea) condiciones += 1;

  if ((variables["CF"] ?? 0) + (variables["C"] ?? 0) > (variables["FC"] ?? 0)) {
    condiciones += 1;
  }

  if ((variables["X+%"] ?? 1) < 0.7) condiciones += 1;

  if ((variables["S"] ?? 0) > 3) condiciones += 1;

  const p = variables["Populares"] ?? 0;
  if (p < 3) condiciones += 1;
  else if (p > 8) condiciones += 1;

  if ((variables["H"] ?? 0) < 2) condiciones += 1;

  if ((variables["R"] ?? 0) < 17) condiciones += 1;

  const resultado = condiciones >= 8 ? "Positivo" : "Negativo";

  return {
    SCON: resultado,
    "SCON Contador": condiciones,
  };
}
