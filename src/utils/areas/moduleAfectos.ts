import type { AfectosInput, AfectosShKey } from "../../types/ModuleInputs";

/**
 * Resultado del cálculo de afectos.
 */
export interface AfectosResult {
  "FC:CF+C+Cn": string;
  "C Pura": number;
  "SumC':SumPonC": string;
  Afr: number;
  S: number;
  "Compljs:R": string;
  CP: number;
  SumPonC: number;
  Cn: number;
  "FC+CF+C+Cn": number;
  Compljs: number;
  "Compljs/R": number;
  "CompljsSit/R": number;
  CompljsColSH: number;
  CompljsColY: number;
  CompljsSHY: number;
  CompljsSH: number;
  CompljsMov: number;
  SumSH: number;
}

/**
 * Calcula SumPonC.
 */
export function calcularSumPonC(fc: number, cf: number, cPura: number): number {
  return 0.5 * fc + 1.0 * cf + 1.5 * cPura;
}

/**
 * Calcula afectos principales.
 * @param data Array de respuestas
 * @param variables Diccionario maestro
 * @returns AfectosResult
 */
export function calcularAfectos(
  data: {
    Det?: string | null;
    Lam?: string | null;
    Loc?: string | null;
  }[],
  variables: AfectosInput
): AfectosResult {
  const rTotal = data.length;

  const fc = variables["FC"] ?? 0;
  const cf = variables["CF"] ?? 0;
  let cPura = variables["C"] ?? 0;
  const cn = variables["Cn"] ?? 0;
  const totalC = fc + cf + cPura + cn;

  const fcVsOtros = `${fc}:${cf + cPura + cn}`;

  // Recalcular C pura (contar solo "C")
  cPura = data.reduce((acc, row) => {
    const det = row.Det?.trim();
    if (det === "C") acc += 1;
    return acc;
  }, 0);

  const sumCPrima =
    (variables["FC'"] ?? 0) + (variables["C'F"] ?? 0) + (variables["C'"] ?? 0);
  const sumPonC = calcularSumPonC(fc, cf, cPura);
  const sumCvsPonC = `${sumCPrima}:${sumPonC}`;

  // Afr: proporción de respuestas en VIII, IX, X
  const laminasAfr = data.filter((row) =>
    ["viii", "ix", "x", "VIII", "IX", "X"].includes(row.Lam ?? "")
  ).length;
  const otrasLaminas = rTotal - laminasAfr || 1;
  const afr = Number((laminasAfr / otrasLaminas).toFixed(2));

  // S: cuántas tienen S en Loc
  const totalS = data.reduce((acc, row) => {
    if (row.Loc && row.Loc.toUpperCase().includes("S")) acc += 1;
    return acc;
  }, 0);

  // Complj:R
  const respuestasComplejas = data.reduce((acc, row) => {
    if (row.Det && row.Det.includes(".")) acc += 1;
    return acc;
  }, 0);
  const compljVsR = `${respuestasComplejas}:${rTotal}`;

  // CP
  const cp = variables["CP"] ?? 0;

  // SumSH
  const colDet = new Set(["FC", "CF", "C"]);
  const shDet = new Set<AfectosShKey>([
    "FC'",
    "C'F",
    "C'",
    "FV",
    "VF",
    "V",
    "FT",
    "TF",
    "T",
  ]);
  const sitDet = new Set<AfectosShKey>(["FY", "YF", "Y"]);
  const totShDet = new Set<AfectosShKey>([...shDet, ...sitDet]);
  const movDet = new Set(["m"]);

  let compljColSH = 0;
  let compljColY = 0;
  let compljSHSH = 0;
  let compljSHY = 0;
  let compljMov = 0;
  let sumSH = 0;

  data.forEach((row) => {
    const det = row.Det;
    if (!det) return;

    const partes = det.split(".").map((p) => p.trim());
    if (partes.length < 2) return;

    const tieneColor = partes.some((p) => colDet.has(p));
    const tieneSombreado = partes.some((p) => totShDet.has(p as AfectosShKey));
    const tieneSituacional = partes.some((p) => sitDet.has(p as AfectosShKey));
    const tieneMovimiento = partes.some((p) => movDet.has(p));
    const totalSombreado = partes.filter((p) =>
      totShDet.has(p as AfectosShKey)
    ).length;

    if (tieneColor && tieneSituacional) {
      compljColSH += 1;
      compljColY += 1;
    }
    if (totalSombreado >= 2 && tieneSituacional) {
      compljSHSH += 1;
      compljSHY += 1;
    }
    if (tieneColor && tieneSombreado) {
      compljColSH += 1;
    }
    if (totalSombreado >= 2) {
      compljSHSH += 1;
    }
    if (tieneMovimiento) {
      compljMov += 1;
    }
  });

  sumSH = Array.from(totShDet).reduce(
    (acc, det) => acc + (variables[det] ?? 0),
    0
  );

  return {
    "FC:CF+C+Cn": fcVsOtros,
    "C Pura": cPura,
    "SumC':SumPonC": sumCvsPonC,
    Afr: afr,
    S: totalS,
    "Compljs:R": compljVsR,
    CP: cp,
    SumPonC: sumPonC,
    Cn: cn,
    "FC+CF+C+Cn": totalC,
    Compljs: respuestasComplejas,
    "Compljs/R": Number((respuestasComplejas / rTotal).toFixed(2)),
    "CompljsSit/R": respuestasComplejas ? compljSHY / respuestasComplejas : 0,
    CompljsColSH: compljColSH,
    CompljsColY: compljColY,
    CompljsSHY: compljSHY,
    CompljsSH: compljSHSH,
    CompljsMov: compljMov,
    SumSH: sumSH,
  };
}

/**
 * Determina estilo vivencial.
 * @param eb Cadena "M : SumPonC"
 * @param ea Valor EA
 * @returns Descripción del estilo
 */
export function calcularEstiloVivencial(eb: string, ea: number): string {
  try {
    const [mStr, cStr] = eb.split(":");
    const m = parseFloat(mStr);
    const c = parseFloat(cStr);
    const diff = Math.abs(m - c);

    if (ea < 4 || m === 0 || c === 0) return "Indefinido";
    if (diff < 2) return "Ambigual";
    if (m > c) return "Introversivo";
    return "Extroversivo";
  } catch {
    return "Error al calcular el Tipo Vivencial";
  }
}
