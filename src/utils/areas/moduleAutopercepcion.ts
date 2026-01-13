export interface SelfPerceptionResult {
  Ego: number;
  "Fr+rF": number;
  SumV: number;
  Fd: number;
  "An+Xy": number;
  MOR: number;
  "H:(H)+Hd+(Hd)": string;
  Pares: number;
}

/**
 * Calcula indicadores de autopercepción.
 * @param data Array de respuestas
 * @param variables Diccionario maestro
 * @returns SelfPerceptionResult
 */
export function calculateSelfPerception(
  data: {
    Det?: string | null;
    Par?: number | null;
  }[],
  variables: Record<string, number>
): SelfPerceptionResult {
  const r = data.length;

  let frRf = 0;
  data.forEach((row) => {
    const det = row.Det;
    if (!det) return;

    const partes = det.split(".");
    frRf += partes.filter((v) => v === "Fr" || v === "rF").length;
  });

  const pares = data.filter((row) => row.Par === 2).length;

  const iEgoc = r !== 0 ? Number(((3 * frRf + pares) / r).toFixed(2)) : 0;

  const sumV =
    (variables["FV"] ?? 0) + (variables["VF"] ?? 0) + (variables["V"] ?? 0);

  const fd = variables["Fd"] ?? 0;
  const anXy = (variables["An"] ?? 0) + (variables["Xy"] ?? 0);
  const mor = variables["MOR"] ?? 0;

  const h = variables["H"] ?? 0;
  const hPar =
    (variables["(H)"] ?? 0) + (variables["Hd"] ?? 0) + (variables["(Hd)"] ?? 0);

  return {
    Ego: iEgoc,
    "Fr+rF": frRf,
    SumV: sumV,
    Fd: fd,
    "An+Xy": anXy,
    MOR: mor,
    "H:(H)+Hd+(Hd)": `${h}:${hPar}`,
    Pares: pares,
  };
}
