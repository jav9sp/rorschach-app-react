export interface ProcesamientoResult {
  "W:D:Dd": string;
  "W:M": string;
  PSV: number;
  "DQ+": number;
  DQv: number;
}

/**
 * Calcula índices de procesamiento.
 *
 * Nota: Zf y Zd NO se calculan ni se devuelven aquí — son responsabilidad
 * exclusiva de `calcularZScore` (moduleZScore.ts). Antes esta función
 * recibía Zf/Zd como insumo y los "devolvía" tal cual en su propio
 * resultado; como se combina después de calcularZScore en
 * buildMasterSummary, ese eco sobrescribía silenciosamente el valor real
 * (convertía un Zd `null` legítimo en `0`).
 *
 * @param data Array de respuestas
 * @param variables Diccionario maestro
 * @returns ProcesamientoResult
 */
export function calcularProcesamiento(
  data: {
    Det?: string | null;
    DQ?: string | null;
  }[],
  variables: Record<string, number>,
): ProcesamientoResult {
  const w = variables["W"] ?? 0;
  const d = variables["D"] ?? 0;
  const dd = variables["Dd"] ?? 0;

  const wddRatio = `${w}:${d}:${dd}`;

  // W:M
  let totalM = 0;
  data.forEach((row) => {
    const det = row.Det;
    if (!det) return;

    const partes = det.split(".");
    totalM += partes.filter((p) => p.startsWith("M")).length;
  });
  const wmRatio = `${w}:${totalM}`;

  const psv = variables["PSV"] ?? 0;

  // DQ+ y DQv
  const dqPlus = data.filter((row) => row.DQ === "+").length;
  const dqV = data.filter((row) => row.DQ === "v").length;

  return {
    "W:D:Dd": wddRatio,
    "W:M": wmRatio,
    PSV: psv,
    "DQ+": dqPlus,
    DQv: dqV,
  };
}
