import type { ComparisonMap } from "../../types/NormativeData";
import type { StructuralSummaryData } from "../../types/StructuralSummaryData";

type RiskResult = string;

export function evaluateRiskFactors(
  summary: StructuralSummaryData,
  comparisons: ComparisonMap
): RiskResult[] {
  const resultados: RiskResult[] = [];

  const genero = summary["Genero"] as string | undefined;
  const persona = genero === "M" ? "el evaluado" : "la evaluada";

  const lambdaEstado = comparisons["Lambda"]?.COMPARACION ?? "Indefinido";

  const eb = summary.TipoVivencial ?? 0;

  // Factor 1 - Ideacional con EB Intro + Lambda↓
  if (
    eb === "Introversivo" &&
    ["Levemente por debajo", "Marcadamente por debajo"].includes(lambdaEstado)
  ) {
    resultados.push(
      `Se observa que ${persona} tiene bajas probabilidades de desarrollar futuros desajustes psíquicos los cuales, en caso de ocurrir, estarían vinculados a su estilo de funcionamiento ideacional, la falta de intercambio afectivo y la evitación de la toma de decisiones.`
    );
  }

  // Factor 1 - Afectivo con EB Extra + Lambda↓
  if (
    eb === "Extroversivo" &&
    ["Levemente por debajo", "Marcadamente por debajo"].includes(lambdaEstado)
  ) {
    resultados.push(
      `Se observa que ${persona} tiene bajas probabilidades de desarrollar futuros desajustes psíquicos los cuales, en caso de ocurrir, estarían vinculados a su estilo de funcionamiento afectivo, su espontaneidad en la descarga de afectos y la toma de decisiones impulsiva.`
    );
  }

  // Factor 4 - Ambigual + Lambda↓
  if (
    eb === "Ambigual" &&
    ["Levemente por debajo", "Marcadamente por debajo"].includes(lambdaEstado)
  ) {
    resultados.push(
      `Se observa que ${persona} tiene un nivel de riesgo medio a desarrollar futuros desajustes psíquicos importantes, los cuales estarían vinculados a su estilo de funcionamiento inconsistente a la hora de resolver problemas y tomar decisiones.`
    );
  }

  // Factor 4 - EB Intro + Lambda↑
  if (
    eb === "Introversivo" &&
    ["Levemente por encima", "Marcadamente por encima"].includes(lambdaEstado)
  ) {
    resultados.push(
      `Se observa que ${persona} tiene un nivel de riesgo medio a desarrollar futuros desajustes psíquicos importantes, los cuales estarían vinculados a su estilo de funcionamiento ideacional evitativo, su pensamiento simple y excesivo control sobre los afectos.`
    );
  }

  // Factor 5 - EB Extra + Lambda↑
  if (
    eb === "Extroversivo" &&
    ["Levemente por encima", "Marcadamente por encima"].includes(lambdaEstado)
  ) {
    resultados.push(
      `Se observa que ${persona} tiene un nivel de riesgo medio a desarrollar futuros desajustes psíquicos importantes, los cuales estarían vinculados a su estilo de funcionamiento afectivo evitativo, su baja modulación de las descargas afectivas y su pensamiento demasiado concreto.`
    );
  }

  // Factor 8 - Ambigual + Lambda↑
  if (
    eb === "Ambigual" &&
    ["Levemente por encima", "Marcadamente por encima"].includes(lambdaEstado)
  ) {
    resultados.push(
      `Se observa que ${persona} tiene altas probabilidades de desarrollar futuros desajustes psíquicos importantes debido a la marcada inconsistencia interna, su estilo de pensamiento demasiado simple y la dificultad para controlar los afectos.`
    );
  }

  if (eb === "Indefinido") {
    resultados.push(
      `No existe información suficiente para estimar la presencia de factores de riesgo que alerten sobre posibles desajustes psíquicos importantes que ${persona} pueda desarrollar en el corto o mediano plazo.`
    );
  }

  // Variables desfavorables adicionales (estructura base)
  const adicionales: string[] = [];
  const introAdicionales = `Por otro lado, se observa que ${persona}`;
  adicionales.push(introAdicionales);

  return resultados;
}
