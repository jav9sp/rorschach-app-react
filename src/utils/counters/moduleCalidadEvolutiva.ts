/**
 * Resultado del conteo de calidad DQ
 */
export interface ConteoCalidadDQ {
  "DQ+": number;
  DQo: number;
  "DQv/+": number;
  DQv: number;
}

/**
 * Cuenta la frecuencia de cada código DQ: +, o, v/+, v.
 * Devuelve claves con prefijo DQ.
 *
 * @param columna Array de códigos DQ
 * @returns ConteoCalidadDQ
 */
export function contarCalidadDQ(
  columna: (string | undefined | null)[]
): ConteoCalidadDQ {
  const claves: Record<string, keyof ConteoCalidadDQ> = {
    "+": "DQ+",
    o: "DQo",
    "v/+": "DQv/+",
    v: "DQv",
  };

  const conteo: ConteoCalidadDQ = {
    "DQ+": 0,
    DQo: 0,
    "DQv/+": 0,
    DQv: 0,
  };

  columna.forEach((dqRaw) => {
    if (!dqRaw) return; // Salta vacíos o null

    const dq = dqRaw.toLowerCase().trim();
    if (claves[dq]) {
      const clave = claves[dq];
      conteo[clave] += 1;
    }
  });

  return conteo;
}
