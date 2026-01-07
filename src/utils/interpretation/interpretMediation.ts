import { capitalize } from "../capitalize";

import type { ComparisonMap } from "../../types/NormativeData";
import type { StructuralSummaryData } from "../../types/StructuralSummaryData";

export function interpretMediation(
  summary: StructuralSummaryData,
  comparisons: ComparisonMap
): string[] {
  const interpretaciones: string[] = [];

  const persona = summary.Genero === "M" ? "el evaluado" : "la evaluada";
  const articulo = persona === "el evaluado" ? "lo" : "la";

  // Paso 1: XA%, WDA%
  const xa = summary["XA%"] ?? 0;
  const wda = summary["WDA%"] ?? 0;

  if (xa >= 0.96 && wda >= 0.96) {
    interpretaciones.push(
      `${capitalize(
        persona
      )} muestra una adecuada capacidad para ejercer control cognitivo sobre su percepción e interpretación de la realidad según lo esperado, pero se observa una marcada tendencia a ser muy convencional, por lo que actúa en base a las demandas de su entorno, evita cometer errores y elimina la expresión de su creatividad y originalidad.`
    );
  } else if (xa >= 0.78 && xa <= 0.9 && wda >= 0.78 && wda <= 0.9) {
    interpretaciones.push(
      `${capitalize(
        persona
      )} muestra una adecuada capacidad para ejercer control cognitivo sobre su percepción e interpretación de la realidad según lo esperado, por lo que es capaz de percibir la realidad como lo hace la mayoría.`
    );
  } else if (xa <= 0.78 && wda <= 0.78) {
    interpretaciones.push(
      `${capitalize(
        persona
      )} muestra dificultades para ejercer control cognitivo sobre su percepción e interpretación de la realidad, por lo que tiende a comportarse de manera poco convencional [EVALUAR DESVIACIÓN - CORTE EN 0.78] [aumentando el riesgo de conflictos de comunicación con su entono y su capacidad para generar conductas que respondan adecuadamente a las demandas de su entorno.]`
    );
  } else {
    interpretaciones.push(`[PENDIENTE EVALUACIÓN XA% ${xa} Y WDA% ${wda}]`);
  }

  // Paso 2: FQsin
  if (summary["FQxsin"] && summary["FQxsin"] > 0) {
    interpretaciones.push(
      "[PENDIENTE FQsin PRESENTE, VERIFICAR CONTENIDO QUE ACOMPAÑA A FQsin]"
    );
  }

  // Paso 3: X-%, Nvl-2, FQ-, S-%
  const xMenos = summary["X-%"] ?? 0;
  const nvl2 = summary["Nvl-2"] ?? 0;
  const fqMenos = comparisons["FQx-"].COMPARACION ?? "Indefinido";
  const sMenos = summary["S-%"] ?? 0;

  if (xMenos > 0.2) interpretaciones.push("[PENDIENTE X-% > 0.2]");
  if (xMenos > 0.2 && nvl2 > 0.4)
    interpretaciones.push("[VERIFICAR INTERFERENCIAS Nvl-2]");
  if (xMenos > 0.2 && sMenos < 0.4)
    interpretaciones.push("[INTERFERENCIAS GENERALIZADAS S-% < 0.4]");
  if (
    fqMenos === "Levemente por encima" ||
    fqMenos === "Marcadamente por encima"
  ) {
    interpretaciones.push("[EVALUAR HOMOGENEIDAD DE F-]");
  }

  // Paso 4: Populares
  const populares = comparisons.Populares.COMPARACION ?? "Indefinido";
  switch (populares) {
    case "Marcadamente por encima":
      interpretaciones.push(
        `Su capacidad para identificar aquellos elementos más habituales del campo estimular está muy aumentada, por lo que su adecuación perceptiva está muy por encima de la comparación normativa. Esto indica que ${persona} es es mucho más consciente de las exigencias sociales y tiende a acumular malestar si no cumple con las expectativas del entorno.`
      );
      break;
    case "Levemente por encima":
      interpretaciones.push(
        `Su capacidad para identificar aquellos elementos más habituales del campo estimular está levemente aumentada, por lo que su adecuación perceptiva es mayor a la comparación normativa. Esto indica que ${persona} es más sensible a las exigencias sociales y tiende a proteger mucho su identidad percibida.`
      );
      break;
    case "Dentro del rango":
      interpretaciones.push(
        `Su capacidad para identificar aquellos elementos más habituales del campo estimular es adecuada, por lo que su adecuación perceptiva se ajusta a la comparación normativa. Esto indica que ${persona} tiene una adecuada sensibilidad a las exigencias sociales y es capaz de actuar de manera convencional en escenarios socialmente obvios.`
      );
      break;
    case "Levemente por debajo":
      interpretaciones.push(
        `Su capacidad para identificar aquellos elementos más habituales del campo estimular está levemente disminuida, por lo que su adecuación perceptiva en relación con la comparación normativa es menor. Esto indica que ${persona} tiene una sensibilidad menor a las exigencias sociales que lo llevan a actuar de manera menos convencional en escenarios socialmente obvios.`
      );
      break;
    case "Marcadamente por debajo":
      interpretaciones.push(
        `Su capacidad para identificar aquellos elementos más habituales del campo estimular está muy disminuida, por lo que su adecuación perceptiva en relación con la comparación normativa se encuentra muy por debajo. Esto indica que ${persona} tiene una muy baja sensibilidad a las exigencias sociales [EVALUAR DESAJUSTES] [lo que indica un pobre contacto con la realidad] por lo que no será capaz de comportarse convencionalmente incluso en situaciones sociales obvias.`
      );
      break;
  }

  // Paso 5: FQ+
  const fqPlus = summary["FQx+"] ?? 0;
  if (fqPlus > 4) {
    interpretaciones.push(
      `Si bien ${persona} muestra una buena capacidad perceptiva y alta motivación, muestra una tendencia marcada a la búsqueda de exactitud, [indicando rasgos perfeccionistas u obsesivos].`
    );
  }

  // Paso 6: X+% y Xu%
  const xPlus = summary["X+%"] ?? 0;
  const xu = comparisons["Xu%"].COMPARACION ?? "Indefinido";
  if (
    xPlus < 0.78 &&
    (xu === "Levemente por encima" || xu === "Marcadamente por encima")
  ) {
    interpretaciones.push(
      `Las posibles dificultades de ${persona} se evidencian en su excesivo autocentramiento, lo que ${articulo} lleva a sesgar sus percepciones según sus propias necesidades y a aferrarse a su punto de vista, rechazando perspectivas más convencionales de la realidad o la posibilidad de adoptar otros enfoques. Esto podría volverse problemático, especialmente si el entorno le exige ajustarse a las expectativas sociales, en cuyo caso las probabilidades de conflicto aumentan.`
    );
  } else if (xPlus < 0.78 && xu === "Dentro del rango") {
    interpretaciones.push("[PENDIENTE Xu% NORMAL]");
  }

  return interpretaciones;
}
