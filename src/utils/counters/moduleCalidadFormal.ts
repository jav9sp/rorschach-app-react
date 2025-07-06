/**
 * Resultado del conteo de calidad formal FQ.
 */
export interface ConteoCalidadFQ {
  "FQx+": number;
  FQxo: number;
  FQxu: number;
  "FQx-": number;
  FQxsin: number;
}

/**
 * Cuenta la frecuencia de cada código FQ: +, o, u, -, sin.
 * Devuelve claves con prefijo FQ.
 *
 * @param columna Array de códigos FQ
 * @returns ConteoCalidadFQ
 */
export function contarCalidadFQ(
  columna: (string | null | undefined)[]
): ConteoCalidadFQ {
  const claves: Record<string, keyof ConteoCalidadFQ> = {
    "+": "FQx+",
    o: "FQxo",
    u: "FQxu",
    "-": "FQx-",
    sin: "FQxsin",
  };

  const conteo: ConteoCalidadFQ = {
    "FQx+": 0,
    FQxo: 0,
    FQxu: 0,
    "FQx-": 0,
    FQxsin: 0,
  };

  columna.forEach((fqRaw) => {
    if (!fqRaw) return; // Ignorar vacíos/null

    const fq = fqRaw.toLowerCase().trim();
    if (claves[fq]) {
      const clave = claves[fq];
      conteo[clave] += 1;
    }
  });

  return conteo;
}
