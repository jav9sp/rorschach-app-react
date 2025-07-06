import type { StructuralSummaryData } from "../../types/StructuralSummaryData";

/**
 * Evalúa la constelación OBS (estilo obsesivo).
 * Marca Positivo si se cumple alguna de las condiciones finales.
 */
export function evaluarOBS(variables: Partial<StructuralSummaryData>): {
  OBS: string;
  "OBS Contador": number;
} {
  const reglas: boolean[] = [
    (variables["Dd"] ?? 0) > 3,
    (variables["Zf"] ?? 0) > 12,
    (variables["Zd"] ?? 0) > 3.0,
    (variables["Populares"] ?? 0) > 7,
    (variables["FQx+"] ?? 0) > 1,
  ];

  const totalReglas = reglas.filter(Boolean).length;

  let resultado = "Negativo";

  if (reglas.every(Boolean)) {
    resultado = "Positivo";
  }
  if (totalReglas >= 2 && (variables["FQx+"] ?? 0) > 3) {
    resultado = "Positivo";
  }
  if (totalReglas >= 3 && (variables["X+%"] ?? 0) > 0.89) {
    resultado = "Positivo";
  }
  if ((variables["DQ+"] ?? 0) > 3 && (variables["X+%"] ?? 0) > 0.89) {
    resultado = "Positivo";
  }

  return {
    OBS: resultado,
    "OBS Contador": totalReglas,
  };
}
