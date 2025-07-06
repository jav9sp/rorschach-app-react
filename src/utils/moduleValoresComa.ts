/**
 * Conteo de valores separados por comas.
 */
export type ConteoValoresComa = Record<string, number>;

/**
 * Cuenta valores separados por comas en una columna.
 *
 * @param columna Array de strings (pueden ser null/undefined)
 * @returns Mapa de valores únicos y sus frecuencias
 */
export function contarValoresComa(
  columna: (string | null | undefined)[]
): ConteoValoresComa {
  const conteo: ConteoValoresComa = {};

  columna.forEach((entradaRaw) => {
    if (!entradaRaw) return;

    entradaRaw.split(",").forEach((valorRaw) => {
      const valor = valorRaw.trim();
      if (valor) {
        conteo[valor] = (conteo[valor] ?? 0) + 1;
      }
    });
  });

  return conteo;
}
