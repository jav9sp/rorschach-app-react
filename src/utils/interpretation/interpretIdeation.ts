import type { ComparisonMap } from "../../types/NormativeData";
import type { StructuralSummaryData } from "../../types/StructuralSummaryData";
import { genderText } from "./genderText";

export function interpretIdeation(
  summary: StructuralSummaryData,
  comparisons: ComparisonMap
): string[] {
  const [persona, vocal, articulo] = genderText(summary["Genero"]);

  const interpretaciones: string[] = [];

  const edad = summary.Edad ?? 0;
  const lambda = summary.Lambda ?? 0;
  const eb = summary.TipoVivencial ?? "Indefinido";

  if (eb === "Introversivo" && edad <= 12) {
    interpretaciones.push("[EVALUAR MENOR DE 12 CON EB INTRATENSIVO]");
  }

  if (eb === "Introversivo") {
    interpretaciones.push(
      `Dado que ${persona} tiene un tipo vivencial Introversivo, prefiere usar la ideación al resolver problemas y se inclina a considerar todas las posibles alternativas antes de tomar una decisión, por lo que no procesa emociones en el proceso y se basa fuertemente en su propia evaluación interna para elaborar juicios.`
    );

    if (7 <= edad && edad < 18 && lambda > 1.3) {
      interpretaciones.push("[PENDIENTE NIÑO EVITATIVO]");
    }

    if (edad > 18 && lambda > 1.2) {
      interpretaciones.push("[PENDIENTE ADULTO EVITATIVO]");
    }
  }

  const ebper = summary.EBPer ?? 0;
  if (ebper !== 0) {
    interpretaciones.push("[PENDIENTE EBPer POSITIVO]");
  }

  const a = summary.a ?? 0;
  const p = summary.p ?? 0;
  const ma = summary.Ma ?? 0;
  const mp = summary.Mp ?? 0;
  const sumT = summary.SumT ?? 0;
  const populares = comparisons.Populares.COMPARACION ?? 0;
  const ego = comparisons.Ego.COMPARACION ?? 0;
  const fd = summary.Fd ?? 0;

  const m = summary.m ?? 0;
  const fm = summary.FM ?? 0;
  const M = summary.M ?? 0;
  const sumMov = m + fm + M;

  if (sumMov < 4) {
    interpretaciones.push(
      `${
        persona.charAt(0).toUpperCase() + persona.slice(1)
      } no proporcionó suficiente información respecto a su funcionamiento ideativo como para realizar un análisis en profundidad, lo que impide estimar de qué manera utiliza sus recursos ideativos y cómo éstos ${articulo} movilizan para interactuar con su entorno.`
    );
  } else {
    if (p > a + 1) {
      interpretaciones.push(
        `${
          persona.charAt(0).toUpperCase() + persona.slice(1)
        } muestra una actitud pasiva en sus procesos de ideación, por lo que tiende a asumir un rol pasivo en sus relaciones interpersonales y a no responsabilizarse por sus propias decisiones. Por este mismo motivo, suele refugiarse en la fantasía para satisfacer sus frustraciones de la vida real.`
      );
    } else {
      interpretaciones.push(
        `${
          persona.charAt(0).toUpperCase() + persona.slice(1)
        } muestra una tendencia a usar sus recursos ideativos de manera activa, lo que le permite tomar la iniciativa en la interacción con otros y asumir la responsabilidad de satisfacer sus necesidades mediante interacciones prácticas con su entorno.`
      );
    }

    interpretaciones.push(checkDependence(a, p, sumT, populares, ego, fd));

    if (
      (a >= 4 && p === 0) ||
      (a === 0 && p >= 4) ||
      a >= p * 3 ||
      p >= a * 3
    ) {
      interpretaciones.push(
        `Se observan rasgos de rigidez en su actividad ideativa, lo cual constituye un factor desfavorable de cara al tratamiento, dado que ${persona} tenderá a aferrarse a su propio punto de vista, dificultando la introducción de procesos de cambio en su pensamiento y conducta.`
      );
    } else {
      interpretaciones.push(
        "Cuenta con una adecuada flexibilidad ideativa, por lo que es capaz de desarrollar nuevos patrones de pensamiento y conducta, factor positivo para el proceso terapéutico."
      );
    }

    if (ma > mp + 1) {
      interpretaciones.push("[PENDIENTE Ma>Mp+1]");
    }
  }

  if (summary.HVI === "Positivo")
    interpretaciones.push("[PENDIENTE HVI POSITIVO]");
  if (summary.OBS === "Positivo")
    interpretaciones.push("[PENDIENTE OBS POSITIVO]");

  const mor = summary.MOR ?? 0;
  if (mor >= 2) {
    interpretaciones.push(
      `Se observa una marcada tendencia hacia el pesimismo en su actividad ideativa, que hace que ${persona} tienda a manifestar prejuicios negativos sobre el futuro y a mantener expectativas poco favorables.`
    );
  }

  if (m > 1) {
    interpretaciones.push(
      `Se observa un aumento en la actividad ideativa periférica que deriva de una sensación de descontrol que ${persona} experimenta por situaciones estresantes externas.`
    );
  }

  const fmMasM = comparisons["FM+m"].COMPARACION ?? "Indefinido";

  switch (fmMasM) {
    case "Levemente por encima":
    case "Marcadamente por encima":
      interpretaciones.push("[PENDIENTE FM+m ALTO - MUY ALTO]");
      break;
    case "Dentro del rango":
      interpretaciones.push(
        `Su actividad ideativa periférica muestra un adecuado nivel de activación, lo que indica que ${persona} registra tanto sus necesidades primarias como secundarias insatisfechas según lo esperado sin producir un aumento en sus preocupaciones o malestar interno.`
      );
      break;
    case "Levemente por debajo":
    case "Marcadamente por debajo":
      interpretaciones.push(
        `Su actividad ideativa periférica muestra un bajo nivel de activación lo que, si bien indica que ${persona} no experimenta un aumento de tensión por la insatisfacción de sus necesidades primarias o secundarias, se debe a que probablemente no está realizando un adecuado registro de estas.`
      );
      break;
  }

  const intelec = summary.Intelec ?? 0;
  if (intelec > 5) {
    interpretaciones.push(
      `Se observa que ${persona} se sirve de la intelectualización como parte fundamental de su funcionamiento psicológico, lo que le permite mitigar el impacto de las emociones disfóricas, pero que ${articulo} vuelve muy vulnerable a la desorganización en situaciones de sobrecarga emocional.`
    );
  }

  // interpretaciones.push(evaluarCodEspeciales(variables));
  interpretaciones.push("[VERIFICAR DISTORSIONES DE M]");
  interpretaciones.push("[VERIFICAR CUALIDAD DE M]");

  return interpretaciones;
}

function checkDependence(
  a: number,
  p: number,
  sumT: number,
  populares: string,
  ego: string,
  fd: number
): string {
  let contador = 0;

  if (p > a + 1) contador++;
  if (sumT > 1) contador++;
  if (
    ["Levemente por encima", "Marcadamente por encima"].includes(
      String(populares)
    )
  )
    contador++;
  if (["Levemente por debajo", "Marcadamente por debajo"].includes(String(ego)))
    contador++;
  if (fd > 0) contador++;

  return `[INDICADORES DEPENDENCIA: ${contador}]`;
}

// function evaluarCodEspeciales(variables: VariablesIdeacion): string {
//   // const sum6 = variables.SumBrut6 ?? 0;
//   // const sumpon6 = variables.SumPon6 ?? 0;

//   // Puedes integrar aquí un análisis específico si se requiere.
//   return "[PENDIENTE ANÁLISIS CCEE]";
// }
