import rawJson from "../data/dscore_conversion.json";
import type { AdjESInput } from "../types/ModuleInputs";

/**
 * Devuelve el Dscore basado en tabla de conversión externa.
 * @param eaMenosEs Diferencia EA - es
 * @returns Valor Dscore
 */
export function calcularDScore(eaMenosEs: number): number {
  const D_SCORE_CONVERSION: Record<string, number> = rawJson;
  const clave = String(Number(eaMenosEs.toFixed(1)));
  return D_SCORE_CONVERSION[clave] ?? 0;
}

/**
 * Calcula Adj es restando m y SumY, ajustando máximo 1 por cada uno.
 * @param variables Diccionario maestro
 * @returns Valor ajustado es
 */
export function calcularAdjES(variables: AdjESInput): number {
  const es = variables["es"] ?? 0;
  const m = variables["m"] ?? 0;
  const y = variables["SumY"] ?? 0;

  const mAjuste = Math.max(0, m - 1);
  const yAjuste = Math.max(0, y - 1);

  return es - mAjuste - yAjuste;
}

/**
 * Calcula AdjD como EA - Adj es y lo convierte a Dscore.
 * @param ea Valor EA
 * @param adjEs Valor ajustado es
 * @returns Valor Dscore (AdjD)
 */
export function calcularAdjD(ea: number, adjEs: number): number {
  const eaMenosAdjEs = Number((ea - adjEs).toFixed(2));
  return calcularDScore(eaMenosAdjEs);
}
