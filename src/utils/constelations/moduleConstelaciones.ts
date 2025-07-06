import type { StructuralSummaryData } from "../../types/StructuralSummaryData";
import { evaluarCDI } from "../constelations/constelacionesCDI";
import { evaluarDEPI } from "../constelations/constelacionesDEPI";
import { evaluarHVI } from "../constelations/constelacionesHVI";
import { evaluarOBS } from "../constelations/constelacionesOBS";
import { evaluarPTI } from "../constelations/constelacionesPTI";
import { evaluarSCON } from "../constelations/constelacionesSCON";

/**
 * Resultado general de constelaciones.
 */
export interface ConstelacionesResult extends Record<string, string | number> {}

/**
 * Genera todas las constelaciones.
 * @param variables Diccionario maestro
 * @param edad Edad del sujeto
 * @returns ConstelacionesResult
 */
export function generarConstelaciones(
  variables: Partial<StructuralSummaryData>,
  edad: number
): ConstelacionesResult {
  return {
    ...evaluarCDI(variables),
    ...evaluarDEPI(variables),
    ...evaluarHVI(variables),
    ...evaluarOBS(variables),
    ...evaluarPTI(variables),
    ...evaluarSCON(variables, edad),
  };
}
