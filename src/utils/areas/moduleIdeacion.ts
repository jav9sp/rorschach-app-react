import type {
  SpecialCodesInput,
  IdeationIndicatorsInput,
} from "../../types/ModuleInputs";

export interface CodigosEspeciales {
  DV1: number;
  DV2: number;
  INC1: number;
  INC2: number;
  DR1: number;
  DR2: number;
  FAB1: number;
  FAB2: number;
  ALOG: number;
  CONTAM: number;
  AB: number;
  Sum6CE: number;
  Sum6CE2: number;
  SumBrut6: number;
  SumPon6: number;
}

/**
 * Calcula SumBrut6 y WSum6 a partir de claves críticas.
 *
 * @param variables Diccionario maestro
 * @returns CodigosEspeciales
 */
export function calcularCodigosEspeciales(
  variables: SpecialCodesInput
): CodigosEspeciales {
  const clavesCriticas: Array<keyof SpecialCodesInput> = [
    "DV1",
    "DV2",
    "INC1",
    "INC2",
    "DR1",
    "DR2",
    "FAB1",
    "FAB2",
    "ALOG",
    "CONTAM",
  ];

  const sumBrut6 = clavesCriticas.reduce(
    (acc, key) => acc + (variables[key] ?? 0),
    0
  );

  const sum6ce = clavesCriticas
    .filter((k) => k.endsWith("1"))
    .reduce((acc, k) => acc + (variables[k] ?? 0), 0);

  const sum6ce2 = clavesCriticas
    .filter((k) => k.endsWith("2"))
    .reduce((acc, k) => acc + (variables[k] ?? 0), 0);

  const dv1 = variables["DV1"] ?? 0;
  const dv2 = variables["DV2"] ?? 0;
  const inc1 = variables["INC1"] ?? 0;
  const inc2 = variables["INC2"] ?? 0;
  const dr1 = variables["DR1"] ?? 0;
  const dr2 = variables["DR2"] ?? 0;
  const fab1 = variables["FAB1"] ?? 0;
  const fab2 = variables["FAB2"] ?? 0;
  const alog = variables["ALOG"] ?? 0;
  const contam = variables["CONTAM"] ?? 0;
  const ab = variables["AB"] ?? 0;

  const sumPon6 =
    1 * dv1 +
    2 * dv2 +
    2 * inc1 +
    4 * inc2 +
    3 * dr1 +
    6 * dr2 +
    4 * fab1 +
    7 * fab2 +
    5 * alog +
    7 * contam;

  return {
    DV1: dv1,
    DV2: dv2,
    INC1: inc1,
    INC2: inc2,
    DR1: dr1,
    DR2: dr2,
    FAB1: fab1,
    FAB2: fab2,
    ALOG: alog,
    CONTAM: contam,
    AB: ab,
    Sum6CE: sum6ce,
    Sum6CE2: sum6ce2,
    SumBrut6: sumBrut6,
    SumPon6: sumPon6,
  };
}

export interface IndicadoresIdeacion {
  "a:p": string;
  "Ma:Mp": string;
  Ma: number;
  Mp: number;
  "MQ-": number;
  MQsin: number;
  Intelec: number;
  MOR: number;
  "Nvl-2": number;
}

/**
 * Calcula indicadores de ideación.
 *
 * @param data Array de respuestas
 * @param dicVariables Diccionario maestro
 * @returns IndicadoresIdeacion
 */
export function calcularIndicadoresIdeacion(
  data: {
    Det?: string | null;
    FQ?: string | null;
    Nivel?: number | null;
  }[],
  dicVariables: IdeationIndicatorsInput
): IndicadoresIdeacion {
  let ma = 0;
  let mp = 0;
  let nvl_2 = 0;
  let mMenos = 0;
  let mQsin = 0;

  data.forEach((row) => {
    const detRaw = row.Det;
    const fqRaw = row.FQ;
    const nivel = row.Nivel;

    if (!detRaw) return;

    const partes = detRaw.split(".");
    for (const parte of partes) {
      if (parte.startsWith("M")) {
        if (parte.includes("ap") || parte.includes("pa")) {
          ma += 1;
          mp += 1;
        }
        if (parte.includes("a")) ma += 1;
        if (parte.includes("p")) mp += 1;
        if (fqRaw === "-") mMenos += 1;
        if (fqRaw === "sin") mQsin += 1;
      }
    }

    if (fqRaw === "-" && nivel === 2) {
      nvl_2 += 1;
    }
  });

  const a = dicVariables["a"] ?? 0;
  const p = dicVariables["p"] ?? 0;
  const ab = dicVariables["AB"] ?? 0;
  const art = dicVariables["Art"] ?? 0;
  const ay = dicVariables["Ay"] ?? 0;

  const valIntelec = 2 * ab + art + ay;

  return {
    "a:p": `${a}:${p}`,
    "Ma:Mp": `${ma}:${mp}`,
    Ma: ma,
    Mp: mp,
    "MQ-": mMenos,
    MQsin: mQsin,
    Intelec: valIntelec,
    MOR: dicVariables["MOR"] ?? 0,
    "Nvl-2": nvl_2,
  };
}
