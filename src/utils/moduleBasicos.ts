/**
 * Devuelve { R } con la cantidad total de respuestas.
 * @param data Array de respuestas
 * @returns { R: number }
 */
export function calcularR(data: any[]): { R: number } {
  return { R: data.length };
}

/**
 * Calcula Lambda = F / (R - F)
 * @param data Array de respuestas
 * @param detDict Diccionario de determinantes
 * @returns { Lambda: number }
 */
export function calcularLambda(
  data: any[],
  detDict: Record<string, number>
): { Lambda: number } {
  const r = data.length;
  const fPura = detDict["F"] ?? 0;
  const noF = r - fPura !== 0 ? r - fPura : 1;

  return { Lambda: Number((fPura / noF).toFixed(2)) };
}

/**
 * Suma total de determinantes para una lista de claves.
 * @param detDict Diccionario de determinantes
 * @param claves Lista de claves a sumar
 * @returns Suma
 */
export function sumarDeterminantes(
  detDict: Record<string, number>,
  claves: string[]
): number {
  return claves.reduce((acc, k) => acc + (detDict[k] ?? 0), 0);
}

/**
 * Calcula SumC', SumT, SumV, SumY.
 * @param detDict Diccionario de determinantes
 * @returns Sumas resumidas
 */
export function calcularDetsResumidos(
  detDict: Record<string, number>
): Record<string, number> {
  return {
    "SumC'": sumarDeterminantes(detDict, ["FC'", "C'F", "C'"]),
    SumT: sumarDeterminantes(detDict, ["FT", "TF", "T"]),
    SumV: sumarDeterminantes(detDict, ["FV", "VF", "V"]),
    SumY: sumarDeterminantes(detDict, ["FY", "YF", "Y"]),
  };
}
