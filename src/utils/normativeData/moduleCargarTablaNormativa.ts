import muestraExtroRo from "../../data/muestraExtroRo.json";
import muestraIntroRo from "../../data/muestraIntroRo.json";
import muestraAmbigualRo from "../../data/muestraAmbigualRo.json";
import muestraTotalRo from "../../data/muestraTotalRo.json";
import muestra15Anios from "../../data/muestra15Anios.json";
import muestra14Anios from "../../data/muestra14Anios.json";

import type { JsonNormativeTable } from "../../types/NormativeData";

const RUTAS_ESTILOS: Record<string, JsonNormativeTable> = {
  Extroversivo: muestraExtroRo,
  Introversivo: muestraIntroRo,
  Ambigual: muestraAmbigualRo,
  Indefinido: muestraTotalRo,
  Total: muestraTotalRo,
  "15 Años": muestra15Anios,
  "14 Años": muestra14Anios,
};

export function obtenerTablaPorEstilo(
  estilo: string,
  edad: number
): JsonNormativeTable {
  if (edad > 16) {
    return RUTAS_ESTILOS[estilo] || RUTAS_ESTILOS["Indefinido"];
  }
  if (edad === 15) {
    return RUTAS_ESTILOS["15 Años"];
  }
  // ? Cargamos tabla de 14 años por defecto
  if (edad <= 14) {
    return RUTAS_ESTILOS["14 Años"];
  }

  throw new Error("Edad no soportada");
}
