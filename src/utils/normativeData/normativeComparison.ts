import type { TablaNormativaJson } from "../../types/NormativeData";
import type { StructuralSummaryData } from "../../types/StructuralSummaryData";

type Comparacion = {
  VARIABLE: string;
  MEDIA: number | string;
  DT: number | string;
  VALOR: number | string;
  COMPARACION: string;
};

function parseNumber(value: string | number): number {
  if (typeof value === "number") return value;

  return parseFloat(
    value.replace(",", ".").replace("[", "").replace("]", "").trim()
  );
}

export function compararConNormativa(
  resultados: StructuralSummaryData,
  tabla: TablaNormativaJson
): Comparacion[] {
  return tabla.map((row) => {
    const variable = row.VARIABLE;

    const media = parseNumber(row.MEDIA);
    const dt = parseNumber(row.DT);

    const rawValor = resultados[variable as keyof StructuralSummaryData];

    if (typeof rawValor !== "number") {
      return {
        VARIABLE: variable,
        MEDIA: media,
        DT: dt,
        VALOR: "-",
        COMPARACION: "No disponible",
      };
    }

    const valor = rawValor;

    // Evita dividir por cero
    const sd_units = dt !== 0 ? (valor - media) / dt : 0;

    let estado = "";
    if (Math.abs(sd_units) <= 1) {
      estado = "Dentro del rango";
    } else if (Math.abs(sd_units) <= 2) {
      estado = sd_units > 0 ? "Levemente por encima" : "Levemente por debajo";
    } else {
      estado =
        sd_units > 0 ? "Marcadamente por encima" : "Marcadamente por debajo";
    }

    return {
      VARIABLE: variable,
      MEDIA: media,
      DT: dt,
      VALOR: valor,
      COMPARACION: estado,
    };
  });
}
