import { checkAllHaveResponses } from "../checkAllHaveResponses";
import { evaluateRiskFactors } from "../evaluation/riskFactors";
import { joinStrings } from "../joinStrings";
import { genderText } from "./genderText";

import type { StructuralSummaryData } from "../../types/StructuralSummaryData";
import type { ComparisonLevel, ComparisonMap } from "../../types/NormativeData";
import type { LaminaClave } from "../counters/moduleSecuenciaLocalizacion";

export function interpretPreliminaries(
  summary: StructuralSummaryData,
  comparisons: ComparisonMap,
): string[] {
  const { person, article } = genderText(summary["Genero"]);

  const intro = `En el presente documento se describen los principales hallazgos sobre el funcionamiento cognitivo y psíquico de ${person} tras la aplicación del test de Rorschach.`;

  const r = summary.R ?? 0;
  const lambda = summary.Lambda ?? 0;
  const sequence = summary.Secuencia ?? null;

  const interpretaciones: string[] = [];

  interpretaciones.push(`${intro} ${checkValidity(r, lambda, sequence)}`);

  const altoRendimiento = checkHighPotential(person, summary);
  if (altoRendimiento) interpretaciones.push(altoRendimiento);

  interpretaciones.push(...checkProductivity(comparisons));

  if (summary.SCONText) interpretaciones.push(summary.SCONText);

  interpretaciones.push(...evaluateRiskFactors(summary, comparisons));

  const desfavorables = verifyUnfavorableIndexes(
    person,
    summary,
    comparisons,
    article,
  );
  if (desfavorables) interpretaciones.push(desfavorables);

  interpretaciones.push(
    `A continuación, se describen las principales conclusiones sobre el funcionamiento de ${person} en cada una de sus áreas.`,
  );

  return interpretaciones;
}

export function checkValidity(
  r: number,
  lambda: number,
  sequence: Record<LaminaClave, string[]>,
): string {
  const { ok, failed } = checkAllHaveResponses(sequence);

  const invalidByLambdaR = lambda > 0.99 && r < 14;

  const invalidByFailures = !ok;

  if (invalidByLambdaR || invalidByFailures) {
    const motivoFracasos = invalidByFailures
      ? `Invalidez por FRACASO en lámina: ${failed.join(", ")}.`
      : "";

    return `Se constata que su disposición durante la evaluación no fue suficientemente cooperativa, por lo que el protocolo se considera inválido al no contar con la información suficiente para establecer una interpretación estable en el tiempo. [${motivoFracasos}]`;
  }

  return "Se constata que su disposición durante la evaluación fue cooperativa, por lo que el protocolo se considera válido y que la información recopilada es suficiente para establecer conclusiones estables en el tiempo.";
}

export function checkProductivity(comparisons: ComparisonMap): string[] {
  const introAlto =
    "En cuanto a su rendimiento intelectual, sus principales fortalezas se observan en ";
  const introNormal =
    "Dentro de los indicadores que se encuentran en un rango normal está ";
  const introBajo =
    "Por otro lado, sus dificultades se manifiestan principalmente en ";

  // Si NO quieres definir "Indefinido", usa Exclude
  type DefinedLevel = Exclude<ComparisonLevel, "Indefinido">;

  const definiciones = {
    R: {
      "Marcadamente por encima":
        "un nivel de productividad muy por encima de lo esperado",
      "Levemente por encima": "un nivel de productividad por sobre lo esperado",
      "Dentro del rango": "un adecuado nivel de productividad",
      "Levemente por debajo": "un nivel de productividad bajo lo esperado",
      "Marcadamente por debajo":
        "un muy bajo nivel de productividad, que apunta a la presencia de limitaciones cognitivas",
    },
    "DQ+": {
      "Marcadamente por encima": "[PENDIENTE DQ+ MUY ALTO]",
      "Levemente por encima": "[PENDIENTE DQ+ ALTO]",
      "Dentro del rango":
        "capacidad para realizar trabajo de análisis y síntesis según lo esperado",
      "Levemente por debajo": "baja capacidad de análisis y síntesis",
      "Marcadamente por debajo":
        "su dificultad para realizar trabajo de análisis y síntesis",
    },
    "XA%": {
      "Marcadamente por encima": "[PENDIENTE XA% MUY ALTO]",
      "Levemente por encima": "[PENDIENTE XA% ALTO]",
      "Dentro del rango": "adecuado ajuste perceptivo",
      "Levemente por debajo":
        "su leve tendencia a realizar interpretaciones subjetivas de la realidad",
      "Marcadamente por debajo":
        "su marcada tendencia a realizar interpretaciones poco convencionales de la realidad",
    },
    Compljs: {
      "Marcadamente por encima": "[PENDIENTE Compljs MUY ALTO]",
      "Levemente por encima": "[PENDIENTE Compljs ALTO]",
      "Dentro del rango": "[PENDIENTE Compljs NORMAL]",
      "Levemente por debajo":
        "baja capacidad para procesar múltiples estímulos a la vez",
      "Marcadamente por debajo":
        "su marcada simplicidad cognitiva que le impide trabajar con múltiples estímulos a la vez",
    },
    Zf: {
      "Marcadamente por encima":
        "una motivación en la tarea de relacionar los estímulos del entorno de manera significativa mayor a lo esperado",
      "Levemente por encima":
        "una motivación en la tarea de relacionar los estímulos del entorno de manera significativa mayor a lo esperado",
      "Dentro del rango":
        "un adecuado nivel de motivación en la tarea de relacionar los estímulos del entorno de manera significativa y darles sentido",
      "Levemente por debajo":
        "una baja motivación en la tarea de relacionar los estímulos del entorno de manera significativa y darles sentido",
      "Marcadamente por debajo":
        "una muy baja motivación en la tarea de relacionar los estímulos del entorno de manera significativa y darles sentido",
    },
    SumV: {
      "Marcadamente por encima": "[PENDIENTE SumV MUY ALTO]",
      "Levemente por encima": "[PENDIENTE SumV ALTO]",
      "Dentro del rango": "[PENDIENTE SumV NORMAL]",
      "Levemente por debajo": "[PENDIENTE SumV BAJO]",
      "Marcadamente por debajo": "[PENDIENTE SumV MUY BAJO]",
    },
    W: {
      "Marcadamente por encima": "[PENDIENTE W MUY ALTO]",
      "Levemente por encima": "[PENDIENTE W ALTO]",
      "Dentro del rango": "[PENDIENTE W NORMAL]",
      "Levemente por debajo": "[PENDIENTE W BAJO]",
      "Marcadamente por debajo": "[PENDIENTE W MUY BAJO]",
    },
    FD: {
      "Marcadamente por encima": "[PENDIENTE FD MUY ALTO]",
      "Levemente por encima": "[PENDIENTE FD ALTO]",
      "Dentro del rango": "[PENDIENTE FD NORMAL]",
      "Levemente por debajo": "[PENDIENTE FD BAJO]",
      "Marcadamente por debajo": "[PENDIENTE FD MUY BAJO]",
    },
    DQv: {
      "Marcadamente por encima": "[PENDIENTE DQv MUY ALTO]",
      "Levemente por encima": "[PENDIENTE DQv ALTO]",
      "Dentro del rango": "[PENDIENTE DQv NORMAL]",
      "Levemente por debajo": "[PENDIENTE DQv BAJO]",
      "Marcadamente por debajo": "[PENDIENTE DQv MUY BAJO]",
    },
  } satisfies Record<string, Record<DefinedLevel, string>>;

  type IndicatorKey = keyof typeof definiciones;

  const alto: string[] = [];
  const normal: string[] = [];
  const bajo: string[] = [];

  for (const key of Object.keys(definiciones) as IndicatorKey[]) {
    const comp = comparisons[key]; // ComparisonMap usa index signature, esto está OK
    const niveles = definiciones[key];

    if (!comp) {
      bajo.push(
        `no se encontró información suficiente para el indicador ${key}`,
      );
      continue;
    }

    const valor = comp.COMPARACION;

    // Manejo explícito de Indefinido (si puede venir)
    if (valor === "Indefinido") {
      bajo.push(`no se pudo determinar el nivel para el indicador ${key}`);
      continue;
    }

    const interpretacion = niveles[valor]; // valor ahora es DefinedLevel

    if (
      valor === "Levemente por encima" ||
      valor === "Marcadamente por encima"
    ) {
      alto.push(interpretacion);
    } else if (valor === "Dentro del rango") {
      normal.push(interpretacion);
    } else {
      // Levemente/Marcadamente por debajo
      bajo.push(interpretacion);
    }
  }

  const resultado: string[] = [];
  if (alto.length > 0) resultado.push(`${introAlto}${joinStrings(alto)}`);
  if (normal.length > 0)
    resultado.push(`${introNormal}${joinStrings(normal)}.`);
  if (bajo.length > 0) resultado.push(`${introBajo}${joinStrings(bajo)}.`);

  resultado.push("[INCLUIR INTERPRETACIÓN USO DEL LENGUAJE]");
  resultado.push("[INCLUIR INTERPRETACIÓN Zsum]");
  return resultado;
}

function checkHighPotential(
  persona: string,
  summary: StructuralSummaryData,
): string | null {
  const dq = summary["DQ+"] ?? 0;
  const zsum = summary.Zsum ?? 0;
  const w = summary.W ?? 0;
  const dqv = summary.DQv ?? 0;

  if (dq > 4 && zsum > 30 && w > 12 && dqv === 0) {
    return `Se observa que ${persona} reúne indicadores suficientes para encontrarse dentro de un rendimiento cognitivo cualitativamente superior a la media, pese a ello, es recomendado contrastar esto mediante un examen más profundo para corroborarlo.`;
  }

  return null;
}

function verifyUnfavorableIndexes(
  person: string,
  summary: StructuralSummaryData,
  comparisons: ComparisonMap,
  article: string,
): string | null {
  const lista: string[] = [];

  const hvi = summary.HVI ?? "Negativo";
  const cdi = summary.CDI ?? "Negativo";
  const reflejos = summary["Fr+rF"] ?? 0;
  const intelec = comparisons.Intelec ?? "Indefinido";
  const s = comparisons.S ?? "Indefinido";

  if (hvi === "Positivo") lista.push("[PENDIENTE HVI POSITIVO]");
  if (cdi === "Positivo")
    lista.push(
      `un índice de inhabilidad social positivo, que ${article} vuelve ineficaz en la interacción con los demás`,
    );
  if (reflejos > 0)
    lista.push("elementos narcisistas en la construcción de su autoconcepto");
  if (
    intelec.COMPARACION === "Levemente por encima" ||
    intelec.COMPARACION === "Marcadamente por encima"
  )
    lista.push("[PENDIENTE INTELEC ALTO]");
  if (
    s.COMPARACION === "Levemente por encima" ||
    s.COMPARACION === "Marcadamente por encima"
  )
    lista.push("[PENDIENTE S ALTO]");

  if (lista.length > 0) {
    return `Por otro lado, ${person} presenta ${joinStrings(
      lista,
    )}, lo cual se considera como factor desfavorable de cara al tratamiento y dificulta el logro de objetivos terapéuticos.`;
  }

  return null;
}
