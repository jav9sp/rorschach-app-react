import type { EBEAEBperInput, EBRatioInput } from "../types/ModuleInputs";

export interface EBResult {
  eb: string;
  es: number;
  "FM+m": number;
}

/**
 * Calcula eb y es: FM+m : SumC'+SumT+SumY+SumV
 * @param detDict Diccionario de determinantes
 * @param detsResumidos Diccionario resumido (SumC', SumT, SumY, SumV)
 * @returns EBResult
 */
export function calcularEB_Ratio(detDict: EBRatioInput): EBResult {
  const fm = detDict["FM"] ?? 0;
  const m = detDict["m"] ?? 0;

  let sumSH =
    (detDict["SumC'"] ?? 0) +
    (detDict["SumT"] ?? 0) +
    (detDict["SumY"] ?? 0) +
    (detDict["SumV"] ?? 0);

  if (sumSH === 0) sumSH = 1;

  return {
    eb: `${fm + m}:${sumSH}`,
    es: fm + m + sumSH,
    "FM+m": fm + m,
  };
}

export interface EBEAEBPerResult {
  EB: string;
  EA: number;
  EBPer: number;
  "EA-es": number;
}

/**
 * Calcula EB, EA, EBPer y EA-es.
 * @param detDict Diccionario de determinantes
 * @param lambdaVal Valor de lambda
 * @returns EBEAEBPerResult
 */
export function calcularEB_EA_EBPer(
  detDict: EBEAEBperInput,
  lambdaVal: number
): EBEAEBPerResult {
  const m = detDict["M"] ?? 0;
  const fc = detDict["FC"] ?? 0;
  const cf = detDict["CF"] ?? 0;
  const c = detDict["C"] ?? 0;

  const sumPonC = 0.5 * fc + 1.0 * cf + 1.5 * c;

  const eb = `${m}:${sumPonC}`;
  const ea = m + sumPonC;

  const estiloDefinido =
    ea >= 4 &&
    lambdaVal < 1 &&
    ((ea <= 10 && Math.abs(m - sumPonC) >= 2) ||
      (ea > 10 && Math.abs(m - sumPonC) >= 2.5));

  const ebper =
    estiloDefinido && sumPonC !== 0 ? Number((m / sumPonC).toFixed(2)) : 0;

  return {
    EB: eb,
    EA: ea,
    EBPer: ebper,
    "EA-es": ea - (detDict["es"] ?? 0),
  };
}
