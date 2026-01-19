import {
  assessSpecialCodes,
  interpretSpecialCodes,
  isMentalFlexible,
} from "../../helpers/ideation/ideationHelpers";
import { capitalize } from "../capitalize";
import { genderText } from "./genderText";

import type { ComparisonMap } from "../../types/NormativeData";
import type { StructuralSummaryData } from "../../types/StructuralSummaryData";
import { assessDependence } from "../../helpers/ideation/dependencyIndicators";

export function interpretIdeation(
  summary: StructuralSummaryData,
  comparisons: ComparisonMap,
): string[] {
  const { person, article } = genderText(summary["Genero"]);

  const interpretaciones: string[] = [];

  const age = summary.Edad ?? 0;
  const lambda = summary.Lambda ?? 0;
  const eb = summary.TipoVivencial ?? "Indefinido";

  // Paso 1: Lambda, EB introversivo y EBPer
  if (eb === "Introversivo" && age <= 12) {
    interpretaciones.push("[EVALUAR MENOR DE 12 CON EB INTRATENSIVO]");
  }

  if (eb === "Introversivo") {
    interpretaciones.push(
      `Dado que ${person} tiene un tipo vivencial Introversivo, prefiere usar la ideación al resolver problemas y se inclina a considerar todas las posibles alternativas antes de tomar una decisión, por lo que no procesa emociones en el proceso y se basa fuertemente en su propia evaluación interna para elaborar juicios.`,
    );

    if (7 <= age && age < 18 && lambda > 1.3) {
      interpretaciones.push("[PENDIENTE NIÑO EVITATIVO]");
    }

    if (age > 18 && lambda > 1.2) {
      interpretaciones.push("[PENDIENTE ADULTO EVITATIVO]");
    }
  }

  const ebper = summary.EBPer ?? 0;
  if (ebper !== 0) {
    interpretaciones.push("[PENDIENTE EBPer POSITIVO]");
  }

  // Paso 2: Relación a:p y Ma:Mp
  const a = summary.a ?? 0;
  const p = summary.p ?? 0;
  const ma = summary.Ma ?? 0;
  const mp = summary.Mp ?? 0;
  const sumT = summary.SumT ?? 0;
  const fd = summary.Fd ?? 0;
  const populares = comparisons.Populares.COMPARACION;
  const ego = comparisons.Ego.COMPARACION;

  const m = summary.m ?? 0;
  const aniMov = summary.FM ?? 0;
  const humMov = summary.M ?? 0;
  const sumMov = m + aniMov + humMov;

  if (sumMov < 4) {
    interpretaciones.push(
      `${capitalize(
        person,
      )} no proporcionó suficiente información respecto a su funcionamiento ideativo como para realizar un análisis en profundidad, lo que impide estimar de qué manera utiliza sus recursos ideativos y cómo éstos ${article} movilizan para interactuar con su entorno.`,
    );
  } else {
    if (p > a + 1) {
      interpretaciones.push(
        `${capitalize(
          person,
        )} muestra una actitud pasiva en sus procesos de ideación, por lo que tiende a asumir un rol pasivo en sus relaciones interpersonales y a no responsabilizarse por sus propias decisiones. Por este mismo motivo, suele refugiarse en la fantasía para satisfacer sus frustraciones de la vida real.`,
      );
    } else {
      interpretaciones.push(
        `${capitalize(
          person,
        )} muestra una tendencia a usar sus recursos ideativos de manera activa, lo que le permite tomar la iniciativa en la interacción con otros y asumir la responsabilidad de satisfacer sus necesidades mediante interacciones prácticas con su entorno.`,
      );
    }

    // Rasgos de dependencia
    const dep = assessDependence(a, p, sumT, populares, ego, fd);

    interpretaciones.push(`[INDICADORES DEPENDENCIA: ${dep.count}]`);

    if (dep.indicators.includes("P_mayor_que_A")) {
      interpretaciones.push(
        "Se observa una tendencia a privilegiar respuestas populares por sobre la iniciativa personal.",
      );
    }

    if (dep.indicators.includes("SumT_elevado")) {
      interpretaciones.push(
        "La presencia elevada de T sugiere necesidades de contacto y apoyo afectivo.",
      );
    }

    if (dep.indicators.includes("Ego_disminuido")) {
      interpretaciones.push(
        "Los indicadores de autovaloración se encuentran disminuidos, lo que puede favorecer conductas dependientes.",
      );
    }

    // Rigidez Ideativa
    const isFlexible = isMentalFlexible(a, p);

    if (isFlexible) {
      interpretaciones.push(
        "Cuenta con una adecuada flexibilidad ideativa, por lo que es capaz de desarrollar nuevos patrones de pensamiento y conducta, factor positivo para el proceso terapéutico.",
      );
    } else {
      interpretaciones.push(
        `Se observan rasgos de rigidez en su actividad ideativa, lo cual constituye un factor desfavorable de cara al tratamiento, dado que ${person} tenderá a aferrarse a su propio punto de vista, dificultando la introducción de procesos de cambio en su pensamiento y conducta.`,
      );
    }

    if (ma > mp + 1) {
      interpretaciones.push("[PENDIENTE Ma>Mp+1]");
    }
  }

  // Paso 3: HVI, OBS y MOR
  if (summary.HVI === "Positivo")
    interpretaciones.push("[PENDIENTE HVI POSITIVO]");
  if (summary.OBS === "Positivo")
    interpretaciones.push("[PENDIENTE OBS POSITIVO]");

  const mor = summary.MOR ?? 0;
  if (mor >= 2) {
    interpretaciones.push(
      `Se observa una marcada tendencia hacia el pesimismo en su actividad ideativa, que hace que ${person} tienda a manifestar prejuicios negativos sobre el futuro y a mantener expectativas poco favorables.`,
    );
  }

  // Paso 4: Análisis lado izquierdo de eb
  if (m > 1) {
    interpretaciones.push(
      `Se observa un aumento en la actividad ideativa periférica que deriva de una sensación de descontrol que ${person} experimenta por situaciones estresantes externas.`,
    );
  }

  const fmMasM = comparisons["FM+m"].COMPARACION;

  switch (fmMasM) {
    case "Marcadamente por encima":
      interpretaciones.push("[PENDIENTE FM+m MUY ALTO]");
      break;
    case "Levemente por encima":
      interpretaciones.push("[PENDIENTE FM+m ALTO]");
      break;
    case "Dentro del rango":
      interpretaciones.push(
        `Su actividad ideativa periférica muestra un adecuado nivel de activación, lo que indica que ${person} registra tanto sus necesidades primarias como secundarias insatisfechas según lo esperado sin producir un aumento en sus preocupaciones o malestar interno.`,
      );
      break;
    case "Levemente por debajo":
      interpretaciones.push("[PENDIENTE FM+m BAJO]");
      break;
    case "Marcadamente por debajo":
      interpretaciones.push(
        `Su actividad ideativa periférica muestra un bajo nivel de activación lo que, si bien indica que ${person} no experimenta un aumento de tensión por la insatisfacción de sus necesidades primarias o secundarias, se debe a que probablemente no está realizando un adecuado registro de estas.`,
      );
      break;
  }

  // Paso 5: Índice de Intelectualización
  const intelec = summary.Intelec ?? 0;
  if (intelec > 5) {
    interpretaciones.push(
      `Se observa que ${person} se sirve de la intelectualización como parte fundamental de su funcionamiento psicológico, lo que le permite mitigar el impacto de las emociones disfóricas, pero que ${article} vuelve muy vulnerable a la desorganización en situaciones de sobrecarga emocional.`,
    );
  }

  // Paso 6: Análisis de CCEE, SumBru6 y SumPon6
  const assessment = assessSpecialCodes(comparisons);
  interpretaciones.push(...interpretSpecialCodes(person, assessment));

  // Paso 7: MQ y grados de distorsión de MQ
  const mqMenos = summary["MQ-"] ?? 0;
  if (mqMenos > 0) interpretaciones.push("[VERIFICAR DISTORSIONES DE M]");

  // Paso 8: ASpectos cualitativos de M
  if (humMov > 0) interpretaciones.push("[VERIFICAR CUALIDAD DE M]");

  return interpretaciones;
}
