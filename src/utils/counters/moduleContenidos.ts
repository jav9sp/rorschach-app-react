/**
 * Lista de contenidos posibles.
 */
export const CONTENIDOS_POSIBLES = [
  "H",
  "(H)",
  "Hd",
  "(Hd)",
  "Hx",
  "A",
  "(A)",
  "Ad",
  "(Ad)",
  "An",
  "Art",
  "Ay",
  "Bl",
  "Bt",
  "Cg",
  "Cl",
  "Ex",
  "Fi",
  "Fd",
  "Ge",
  "Hh",
  "Ls",
  "Na",
  "Sc",
  "Sx",
  "Xy",
  "Idio",
] as const;

export type Contenido = (typeof CONTENIDOS_POSIBLES)[number];

export type ConteoContenidos = Record<Contenido, number>;

/**
 * Cuenta la frecuencia de cada contenido posible.
 *
 * @param columna Array de strings (contenidos separados por comas)
 * @returns Conteo de cada contenido posible
 */
export function contarContenidos(
  columna: (string | null | undefined)[]
): ConteoContenidos {
  const conteo: ConteoContenidos = CONTENIDOS_POSIBLES.reduce(
    (acc, contenido) => {
      acc[contenido] = 0;
      return acc;
    },
    {} as ConteoContenidos
  );

  columna.forEach((entradaRaw) => {
    if (!entradaRaw) return;

    entradaRaw.split(",").forEach((valorRaw) => {
      const valor = valorRaw.trim();
      if (valor in conteo) {
        conteo[valor as Contenido] += 1;
      }
    });
  });

  return conteo;
}
