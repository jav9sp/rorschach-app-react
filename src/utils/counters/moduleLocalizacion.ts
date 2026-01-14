/**
 * Conteo de localizaciones.
 */
export interface ConteoLocalizaciones {
  W: number;
  D: number;
  "W+D": number;
  Dd: number;
  S: number;
}

/**
 * Cuenta la frecuencia de localizaciones W, D, Dd, S y calcula W+D.
 * @param columna Array de strings (localizaciones)
 * @returns ConteoLocalizaciones
 */

export function countLocations(
  columna: (string | undefined | null)[]
): ConteoLocalizaciones {
  const conteoLoc: ConteoLocalizaciones = {
    W: 0,
    D: 0,
    "W+D": 0,
    Dd: 0,
    S: 0,
  };

  columna.forEach((locRaw) => {
    if (!locRaw) return;

    const loc = locRaw.toUpperCase();

    if (loc.includes("S")) conteoLoc.S += 1;
    if (loc.includes("W")) conteoLoc.W += 1;

    if (loc.includes("DD")) {
      conteoLoc.Dd += 1;
    } else if (loc.includes("D") && !loc.includes("DD")) {
      conteoLoc.D += 1;
    }
  });

  conteoLoc["W+D"] = conteoLoc.W + conteoLoc.D;

  return conteoLoc;
}
