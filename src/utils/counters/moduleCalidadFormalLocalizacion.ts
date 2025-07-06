import type { Respuesta } from "../buildMasterSummary";

/**
 * Claves combinadas de Localización + FQ.
 */
export type ClaveLocFQ =
  | "W_FQx+"
  | "W_FQxo"
  | "W_FQxu"
  | "W_FQx-"
  | "W_FQxsin"
  | "D_FQx+"
  | "D_FQxo"
  | "D_FQxu"
  | "D_FQx-"
  | "D_FQxsin"
  | "Dd_FQx+"
  | "Dd_FQxo"
  | "Dd_FQxu"
  | "Dd_FQx-"
  | "Dd_FQxsin"
  | "S_FQx+"
  | "S_FQxo"
  | "S_FQxu"
  | "S_FQx-"
  | "S_FQxsin";

export type ConteoLocFQ = Record<ClaveLocFQ, number>;

/**
 * Conteo combinado de Localización + Calidad Formal.
 * @param respuestas Array de Respuesta con Loc y FQ
 */
export function contarLocFQ(
  respuestas: Pick<Respuesta, "Loc" | "FQ">[]
): ConteoLocFQ {
  const clavesFQ: Record<string, string> = {
    "+": "FQx+",
    o: "FQxo",
    u: "FQxu",
    "-": "FQx-",
    sin: "FQxsin",
  };

  const clavesLoc = ["W", "D", "Dd", "S"];

  const resultado: ConteoLocFQ = {} as ConteoLocFQ;

  // Inicializa todas las combinaciones en 0
  clavesLoc.forEach((loc) => {
    Object.values(clavesFQ).forEach((fq) => {
      const clave = `${loc}_${fq}` as ClaveLocFQ;
      resultado[clave] = 0;
    });
  });

  respuestas.forEach((resp) => {
    const fqRaw = resp.FQ?.toLowerCase().trim();
    const locRaw = resp.Loc?.toUpperCase().trim();

    if (!fqRaw || !locRaw) return;

    const fqKey = clavesFQ[fqRaw];
    if (!fqKey) return;

    const locs: string[] = [];

    if (locRaw.includes("W")) locs.push("W");
    if (locRaw.includes("DD")) {
      locs.push("Dd");
    } else if (locRaw.includes("D") && !locRaw.includes("DD")) {
      locs.push("D");
    }
    if (locRaw.includes("S")) locs.push("S");

    locs.forEach((locPart) => {
      const clave = `${locPart}_${fqKey}` as ClaveLocFQ;
      resultado[clave] += 1;
    });
  });

  return resultado;
}
