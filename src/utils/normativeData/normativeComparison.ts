import type {
  Comparison,
  ComparisonLevel,
  JsonNormativeTable,
} from "../../types/NormativeData";
import type { StructuralSummaryData } from "../../types/StructuralSummaryData";

function parseNumber(value: string | number): number {
  if (typeof value === "number") return value;

  return parseFloat(
    value.replace(",", ".").replace("[", "").replace("]", "").trim()
  );
}

export function compararConNormativa(
  resultados: StructuralSummaryData,
  tabla: JsonNormativeTable
): Comparison[] {
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
        VALOR: 0,
        COMPARACION: "Indefinido",
      };
    }

    const valor = rawValor;

    // Evita dividir por cero
    const sd_units = dt !== 0 ? (valor - media) / dt : 0;

    let estado: ComparisonLevel = "Indefinido";
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
