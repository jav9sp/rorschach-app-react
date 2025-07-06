export interface MediacionResult {
  "XA%": number;
  "WDA%": number;
  "X+%": number;
  "Xu%": number;
  "X-%": number;
  "S-": number;
  "S-%": number;
  Populares: number;
}

/**
 * Calcula indicadores de mediación.
 * @param data Array de respuestas
 * @returns MediacionResult
 */
export function calcularMediacion(
  data: {
    FQ?: string | null;
    Loc?: string | null;
    Populares?: string | null;
  }[]
): MediacionResult {
  const totalR = data.length;

  if (totalR === 0) {
    return {
      "XA%": 0,
      "WDA%": 0,
      "X+%": 0,
      "Xu%": 0,
      "X-%": 0,
      "S-": 0,
      "S-%": 0,
      Populares: 0,
    };
  }

  // Normalización
  const norm = data.map((row) => ({
    FQ: row.FQ?.toString().trim() ?? "",
    Loc: row.Loc?.toString().trim().toUpperCase() ?? "",
    Populares: row.Populares?.toString().toLowerCase().trim() ?? "",
  }));

  // XA%: FQ + o o u
  const fqXA = norm.filter((r) => ["+", "o", "u"].includes(r.FQ)).length;
  const xaPct = Number((fqXA / totalR).toFixed(2));

  // WDA%: Loc W o D con FQ + o o u
  const wd = norm.filter((r) => ["W", "D"].includes(r.Loc));
  const fqWDA = wd.filter((r) => ["+", "o", "u"].includes(r.FQ)).length;
  const wdaPct = wd.length !== 0 ? Number((fqWDA / wd.length).toFixed(2)) : 0;

  // X-%, X-Tot
  const xNegPct = Number(
    (norm.filter((r) => r.FQ === "-").length / totalR).toFixed(2)
  );
  const xNegTot = norm.filter((r) => r.FQ === "-").length;

  // X+%
  const xPosPct = Number(
    (norm.filter((r) => ["+", "o"].includes(r.FQ)).length / totalR).toFixed(2)
  );

  // Xu%
  const xuPct = Number(
    (norm.filter((r) => r.FQ === "u").length / totalR).toFixed(2)
  );

  // S-: Loc contiene S y FQ == -
  const sNeg = norm.filter((r) => r.Loc.includes("S") && r.FQ === "-").length;

  // S-%: Res contiene S- / Total X-
  const sNegPct = Number((sNeg / xNegTot).toFixed(2));

  // Populares
  const populares = norm.filter((r) => r.Populares === "p").length;

  return {
    "XA%": xaPct,
    "WDA%": wdaPct,
    "X+%": xPosPct,
    "Xu%": xuPct,
    "X-%": xNegPct,
    "S-": sNeg,
    "S-%": sNegPct,
    Populares: populares,
  };
}
