// utils/moduleInterpersonal.ts

import type { InterpersonalInput } from "../../types/ModuleInputs";

export interface InterpersonalResult {
  "COP:AG": string;
  COP: number;
  AG: number;
  GHR: number;
  PHR: number;
  "GHR:PHR": string;
  "a:p": string;
  Fd: number;
  SumT: number;
  TodoH: number;
  H: number;
  Hx: number;
  PER: number;
  "Aisl/R": number;
}

/**
 * Calcula indicadores de la dimensión interpersonal.
 * @param variables Diccionario maestro
 * @returns InterpersonalResult
 */
export function calcularInterpersonal(
  variables: InterpersonalInput
): InterpersonalResult {
  const rTotal = variables["R"] ?? 0;

  const cop = variables["COP"] ?? 0;
  const ag = variables["AG"] ?? 0;
  const ghr = variables["GHR"] ?? 0;
  const phr = variables["PHR"] ?? 0;
  const a = variables["a"] ?? 0;
  const p = variables["p"] ?? 0;
  const fd = variables["Fd"] ?? 0;

  const sumT =
    (variables["FT"] ?? 0) + (variables["TF"] ?? 0) + (variables["T"] ?? 0);

  const hTotal =
    (variables["H"] ?? 0) +
    (variables["Hd"] ?? 0) +
    (variables["(H)"] ?? 0) +
    (variables["(Hd)"] ?? 0);

  const hPura = variables["H"] ?? 0;
  const hx = variables["Hx"] ?? 0;
  const per = variables["PER"] ?? 0;

  const numerador =
    (variables["Bt"] ?? 0) +
    (variables["Ge"] ?? 0) +
    (variables["Ls"] ?? 0) +
    2 * ((variables["Cl"] ?? 0) + (variables["Na"] ?? 0));

  const aislVsR = rTotal !== 0 ? Number((numerador / rTotal).toFixed(2)) : 0;

  return {
    "COP:AG": `${cop}:${ag}`,
    COP: cop,
    AG: ag,
    GHR: ghr,
    PHR: phr,
    "GHR:PHR": `${ghr}:${phr}`,
    "a:p": `${a}:${p}`,
    Fd: fd,
    SumT: sumT,
    TodoH: hTotal,
    H: hPura,
    Hx: hx,
    PER: per,
    "Aisl/R": aislVsR,
  };
}
