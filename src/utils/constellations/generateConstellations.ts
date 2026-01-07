import type { StructuralSummaryData } from "../../types/StructuralSummaryData";
import { evaluateCDI } from "./evaluateCDI";
import { evaluateDEPI } from "./evaluateDEPI";
import { evaluateHVI } from "./evaluateHVI";
import { evaluateOBS } from "./evaluateOBS";
import { evaluatePTI } from "./evaluatePTI";
import { evaluateSCON } from "./evaluateSCON";

/**
 * Resultado general de constelaciones.
 */
export interface ConstelacionesResult extends Record<string, string | number> {}

/**
 * Genera todas las constelaciones.
 * @param summary Diccionario maestro
 * @param edad Edad del sujeto
 * @returns ConstelacionesResult
 */
export function generateConstellations(
  summary: Partial<StructuralSummaryData>
): ConstelacionesResult {
  return {
    ...evaluateCDI(summary),
    ...evaluateDEPI(summary),
    ...evaluateHVI(summary),
    ...evaluateOBS(summary),
    ...evaluatePTI(summary),
    ...evaluateSCON(summary),
  };
}
