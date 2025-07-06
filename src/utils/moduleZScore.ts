import zestData from "../data/zscore_conversion.json";

/**
 * Tabla de puntajes por lámina y código.
 */
export const puntajesPorLaminaYCodigo: Record<
  string,
  Record<string, number>
> = {
  I: { zw: 1.0, za: 4.0, zd: 6.0, zs: 3.5 },
  II: { zw: 4.5, za: 3.0, zd: 5.5, zs: 4.5 },
  III: { zw: 5.5, za: 3.0, zd: 4.0, zs: 4.5 },
  IV: { zw: 2.0, za: 4.0, zd: 3.5, zs: 5.0 },
  V: { zw: 1.0, za: 2.5, zd: 5.0, zs: 4.0 },
  VI: { zw: 2.5, za: 2.5, zd: 6.0, zs: 6.5 },
  VII: { zw: 2.5, za: 1.0, zd: 3.0, zs: 4.0 },
  VIII: { zw: 4.5, za: 3.0, zd: 3.0, zs: 4.0 },
  IX: { zw: 5.5, za: 2.5, zd: 4.5, zs: 5.0 },
  X: { zw: 5.5, za: 4.0, zd: 4.5, zs: 6.0 },
};

/**
 * Tipos de entrada y salida.
 */
export interface ZScoreResult {
  Zf: number;
  Zsum: number;
  Zest: number | null;
  Zd: number | null;
  "Estilo Cognitivo": string;
}

/**
 * Calcula Zf, Zsum, Zest, Zd y Estilo Cognitivo.
 * @param columnaLamina Array de láminas (I-X)
 * @param columnaZ Array de códigos z (zw, za, zd, zs)
 * @returns ZScoreResult
 */
export function calcularZScore(
  columnaLamina: (string | null | undefined)[],
  columnaZ: (string | number | null | undefined)[]
): ZScoreResult {
  const zvalores: number[] = [];

  for (let i = 0; i < columnaLamina.length; i++) {
    const laminaRaw = columnaLamina[i];
    const codigoRaw = columnaZ[i];

    if (!laminaRaw || codigoRaw === null || codigoRaw === undefined) continue;

    const lamina = laminaRaw.toUpperCase();
    const codigo = String(codigoRaw).toLowerCase();

    const z = puntajesPorLaminaYCodigo[lamina]?.[codigo];
    if (z !== undefined) zvalores.push(z);
  }

  const zf = zvalores.length;
  const zsum = zvalores.reduce((acc, v) => acc + v, 0);

  // Conversión tabla Zest
  const Z_EST_DATA: Record<string, number> = zestData;
  const zest = Z_EST_DATA[zf] ?? null;
  const zd = zest !== null ? zsum - zest : null;

  let estilo = "No interpretable";
  if (zest !== null) {
    if (zd! > 3.5) estilo = "Hiperincorporador";
    else if (zd! < -3.5) estilo = "Hipoincorporador";
    else estilo = "Normal";
  }

  return {
    Zf: zf,
    Zsum: Number(zsum.toFixed(2)),
    Zest: zest,
    Zd: zd !== null ? Number(zd.toFixed(2)) : null,
    "Estilo Cognitivo": estilo,
  };
}
