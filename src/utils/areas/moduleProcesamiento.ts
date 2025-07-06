export interface ProcesamientoResult {
  Zf: number;
  "W:D:Dd": string;
  "W:M": string;
  Zd: number;
  PSV: number;
  "DQ+": number;
  DQv: number;
}

/**
 * Calcula índices de procesamiento.
 * @param data Array de respuestas
 * @param variables Diccionario maestro
 * @returns ProcesamientoResult
 */
export function calcularProcesamiento(
  data: {
    Det?: string | null;
    DQ?: string | null;
  }[],
  variables: Record<string, number>
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

  // Zd y Zf
  const zf = variables["Zf"] ?? 0;
  const zd = variables["Zd"] ?? 0;

  const psv = variables["PSV"] ?? 0;

  // DQ+ y DQv
  const dqPlus = data.filter((row) => row.DQ === "+").length;
  const dqV = data.filter((row) => row.DQ === "v").length;

  return {
    Zf: zf,
    "W:D:Dd": wddRatio,
    "W:M": wmRatio,
    Zd: zd,
    PSV: psv,
    "DQ+": dqPlus,
    DQv: dqV,
  };
}
