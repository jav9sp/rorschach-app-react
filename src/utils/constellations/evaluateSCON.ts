import type { StructuralSummaryData } from "../../types/StructuralSummaryData";
import { joinStrings } from "../joinStrings";

const numeros: Record<number, string> = {
  1: "un",
  2: "dos",
  3: "tres",
  4: "cuatro",
  5: "cinco",
  6: "seis",
  7: "siete",
};

/**
 * Evalúa la constelación S-CON (suicidio).
 * Marca Positivo si >= 8 condiciones y edad >= 15.
 */
export function evaluateSCON(summary: Partial<StructuralSummaryData>): {
  SCON: string;
  SCONCounter: number;
  SCONText: string;
} {
  const persona = summary["Genero"] === "M" ? "el evaluado" : "la evaluada";

  if (summary.Edad! < 15) {
    return {
      SCON: "No aplica. Menor a 15 años.",
      SCONCounter: 0,
      SCONText: "",
    };
  }

  let condiciones = 0;
  const interpretaciones: string[] = [];
  let texto = "";

  if (Number(summary["SumV"] || 0) + Number(summary["FD"] || 0) > 2) {
    condiciones++;
    interpretaciones.push("una alta tendencia a la introspección negativa");
  }

  if (Number(summary["CompljsColSH"] || 0) > 0) {
    condiciones++;
    interpretaciones.push(
      "una fuerte presencia de elementos disfóricos en su elaboración cognitiva"
    );
  }

  const egoc = Number(summary["Ego"] || 0);
  if (egoc < 0.31) {
    condiciones++;
    interpretaciones.push("un bajo índice de egocentrismo");
  }
  if (egoc > 0.44) {
    condiciones++;
    interpretaciones.push("un alto índice de egocentrismo");
  }

  if (Number(summary["MOR"] || 0) > 3) {
    condiciones++;
    interpretaciones.push("una alta presencia de negativismo en la ideación");
  }

  const zd = Number(summary["Zd"] || 0);
  if (zd > 3.5) {
    condiciones++;
    interpretaciones.push(
      "dificultad para tomar decisiones debido a exceso de análisis"
    );
  }
  if (zd < -3.5) {
    condiciones++;
    interpretaciones.push(
      "impulsividad en la toma de decisiones al resolver problemas"
    );
  }

  const es = Number(summary["es"] || 0);
  const ea = Number(summary["EA"] || 0);
  if (es > ea) {
    condiciones++;
    interpretaciones.push(
      "un aumento en el registro de tensión interna y falta de recursos para manejarla"
    );
  }

  if (
    Number(summary["CF"] || 0) + Number(summary["C"] || 0) >
    Number(summary["FC"] || 0)
  ) {
    condiciones++;
    interpretaciones.push("falta de modulación en la descarga de afectos");
  }

  if (Number(summary["X+%"] ?? 1) < 0.7) {
    condiciones++;
    interpretaciones.push("un bajo ajuste perceptivo general");
  }

  if (Number(summary["S"] || 0) > 3) {
    condiciones++;
    interpretaciones.push(
      "un estilo confrontacional que puede aumentar el conflicto con el entorno"
    );
  }

  const p = Number(summary["Populares"] || 0);
  if (p < 3) {
    condiciones++;
    interpretaciones.push("una baja sensibilidad a las convenciones sociales");
  } else if (p > 8) {
    condiciones++;
    interpretaciones.push(
      "una excesiva sensibilidad a las convenciones sociales"
    );
  }

  if (Number(summary["H"] || 0) < 2) {
    condiciones++;
    interpretaciones.push("un bajo interés en el componente humano");
  }

  if (Number(summary["R"] || 0) < 17) {
    condiciones++;
    interpretaciones.push("un bajo nivel de productividad");
  }

  // Generar párrafo si es positivo o negativo
  if (condiciones <= 8) {
    texto = `La constelación de suicidio marca negativo, lo que permite descartar la presencia de conductas autolesivas en el corto o mediano plazo. 
Pese a ello, se observa ${
      numeros[condiciones] || condiciones
    } indicadores presentes, incluyendo ${joinStrings(interpretaciones)}.`;
  }

  if (condiciones >= 8) {
    texto = `La constelación de suicidio marca positivo, por lo que existe un peligro inminente de que ${persona} incurra en conductas autolesivas en el corto o mediano plazo, lo cual requiere un abordaje urgente.`;
  }

  const resultado = condiciones >= 8 ? "Positivo" : "Negativo";

  return { SCON: resultado, SCONCounter: condiciones, SCONText: texto };
}
