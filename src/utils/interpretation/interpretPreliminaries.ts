import type {
  Comparison,
  ComparisonLevel,
  ComparisonMap,
} from "../../types/NormativeData";
import type { StructuralSummaryData } from "../../types/StructuralSummaryData";
import { evaluateRiskFactors } from "../evaluation/riskFactors";
import { joinStrings } from "../joinStrings";

export function interpretPreliminaries(
  summary: StructuralSummaryData,
  comparisons: ComparisonMap
): string[] {
  const persona = summary.Genero === "M" ? "el evaluado" : "la evaluada";
  const intro = `En el presente documento se describen los principales hallazgos sobre el funcionamiento cognitivo y psíquico de ${persona} tras la aplicación del test de Rorschach.`;

  const rTotal = summary.R ?? 0;
  const lambda = summary.Lambda ?? 0;

  const interpretaciones: string[] = [];
  interpretaciones.push(`${intro} ${checkValidity(rTotal, lambda)}`);

  const altoRendimiento = checkHighPotential(persona, summary);
  if (altoRendimiento) interpretaciones.push(altoRendimiento);

  interpretaciones.push(...checkProductivity(comparisons));

  if (summary.SCONText) interpretaciones.push(summary.SCONText);

  interpretaciones.push(...evaluateRiskFactors(summary, comparisons));

  const desfavorables = verifyUnfavorableIndexes(persona, summary, comparisons);
  if (desfavorables) interpretaciones.push(desfavorables);

  interpretaciones.push(
    `A continuación, se describen las principales conclusiones sobre el funcionamiento de ${persona} en cada una de sus áreas.`
  );

  return interpretaciones;
}

function checkValidity(rTotal: number, lambda: number): string {
  if (lambda > 0.99 && rTotal < 14) {
    return "Se constata que su disposición durante la evaluación no fue suficientemente cooperativa, por lo que el protocolo se considera inválido al no contar con la información suficiente para establecer una interpretación estable en el tiempo.";
  }
  return "Se constata que su disposición durante la evaluación fue cooperativa, por lo que el protocolo se considera válido y que la información recopilada es suficiente para establecer conclusiones estables en el tiempo.";
}

function checkProductivity(comparisons: ComparisonMap): string[] {
  const introAlto =
    "En cuanto a su rendimiento intelectual, sus principales fortalezas se observan en ";
  const introNormal =
    "Dentro de los indicadores que se encuentran en un rango normal está ";
  const introBajo =
    "Por otro lado, sus dificultades se manifiestan principalmente en ";

  const definiciones: Record<StructuralSummaryData, ComparisonLevel> = {
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
    Zsum: {
      "Marcadamente por encima": "[PENDIENTE Zsum MUY ALTO]",
      "Levemente por encima": "[PENDIENTE Zsum ALTO]",
      "Dentro del rango": "[PENDIENTE Zsum NORMAL]",
      "Levemente por debajo": "[PENDIENTE Zsum BAJO]",
      "Marcadamente por debajo": "[PENDIENTE Zsum MUY BAJO]",
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
    Intereses: {
      "Marcadamente por encima": "[PENDIENTE Intereses MUY ALTO]",
      "Levemente por encima": "[PENDIENTE Intereses ALTO]",
      "Dentro del rango": "[PENDIENTE Intereses NORMAL]",
      "Levemente por debajo": "[PENDIENTE Intereses BAJO]",
      "Marcadamente por debajo": "[PENDIENTE Intereses MUY BAJO]",
    },
  };

  const alto: string[] = [];
  const normal: string[] = [];
  const bajo: string[] = [];

  for (const key in definiciones) {
    const comp = comparisons[key as keyof typeof definiciones];
    const niveles = definiciones[key];

    if (!comp || typeof comp.COMPARACION !== "string") {
      bajo.push(
        `no se encontró información suficiente para el indicador ${key}`
      );
      continue;
    }

    const valor = comp.COMPARACION;
    const interpretacion = niveles[valor];

    if (
      valor === "Levemente por encima" ||
      valor === "Marcadamente por encima"
    ) {
      alto.push(interpretacion);
    } else if (valor === "Dentro del rango") {
      normal.push(interpretacion);
    } else if (
      valor === "Levemente por debajo" ||
      valor === "Marcadamente por debajo"
    ) {
      bajo.push(interpretacion);
    }
  }

  const resultado: string[] = [];
  if (alto.length > 0) resultado.push(`${introAlto}${joinStrings(alto)}`);
  if (normal.length > 0)
    resultado.push(`${introNormal}${joinStrings(normal)}.`);
  if (bajo.length > 0) resultado.push(`${introBajo}${joinStrings(bajo)}.`);

  resultado.push("[INCLUIR INTERPRETACIÓN USO DEL LENGUAJE]");

  return resultado;
}

function checkHighPotential(
  persona: string,
  summary: StructuralSummaryData
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
  persona: string,
  summary: StructuralSummaryData,
  comparisons: ComparisonMap
): string | null {
  const articulo = persona === "el evaluado" ? "lo" : "la";
  const lista: string[] = [];

  const hvi = summary.HVI ?? "Negativo";
  const cdi = summary.CDI ?? "Negativo";
  const reflejos = summary["Fr+rF"] ?? 0;
  const intelec = comparisons.Intelec ?? "Indefinido";
  const s = comparisons.S ?? "Indefinido";

  if (hvi === "Positivo") lista.push("[PENDIENTE HVI POSITIVO]");
  if (cdi === "Positivo")
    lista.push(
      `un índice de inhabilidad social positivo, que ${articulo} vuelve ineficaz en la interacción con los demás`
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
    return `Por otro lado, ${persona} presenta ${joinStrings(
      lista
    )}, lo cual se considera como factor desfavorable de cara al tratamiento y dificulta el logro de objetivos terapéuticos.`;
  }

  return null;
}
