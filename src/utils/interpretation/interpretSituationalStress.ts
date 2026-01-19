import type { ComparisonMap } from "../../types/NormativeData";
import type { StructuralSummaryData } from "../../types/StructuralSummaryData";
import { capitalize } from "../capitalize";
import { genderText } from "./genderText";

export function interpretSituationalStress(
  summary: StructuralSummaryData,
  comparisons: ComparisonMap,
): string[] {
  const { person, vowel } = genderText(summary["Genero"]);

  const interpretaciones: string[] = [];

  // Paso 1: PuntD vs AdjD
  const puntD = summary["PuntD"] ?? 0;
  const adjD = summary["AdjD"] ?? 0;

  if (puntD !== adjD) {
    interpretaciones.push(
      `${capitalize(
        person,
      )} presenta dificultades importantes para ajustar la capacidad de control y tolerar la sobre estimulación generada por situaciones externas.`,
    );
  } else {
    interpretaciones.push(
      `No se observan indicadores de aumento en el registro de tensión interna en ${person} por factores situacionales.`,
    );
  }

  // Paso 2: D < AdjD
  if (puntD < adjD) {
    interpretaciones.push(
      "Debido a esto, su capacidad de control actual es menor al que tiene habitualmente en situaciones normales. [REVISAR m e Y]",
    );
  }

  if (puntD < 0 && adjD < 0) {
    interpretaciones.push("[SOBRECARGA HABITUAL, ALTA IMPULSIVIDAD]");
  }

  // Paso 3: m e Y
  const m = summary["m"] ?? 0;
  const sumY = summary["SumY"] ?? 0;

  if (m > 1) interpretaciones.push("[AUMENTO MALESTAR IDEACIONAL]");
  if (sumY > 1) interpretaciones.push("[AUMENTO MALESTAR EMOCIONAL]");

  if (m > 0 || sumY > 0) {
    if (sumY > 0 && m >= sumY * 3) {
      interpretaciones.push(
        "[SOBRECARGA IDEACIONAL - PÉRDIDA CONTROL INMINENTE]",
      );
    }

    if (m > 0 && sumY >= m * 3) {
      interpretaciones.push(
        `El impacto de las situaciones externas afecta principalmente en sobre su funcionamiento emocional, por lo que es probable que ${person} se vea inundad${vowel} por sentimientos de indefensión e impotencia que pueden tener un efecto paralizante en su conducta.`,
      );
    }
  }

  // Paso 4: T, V, Ego, reflejos
  const sumT = summary["SumT"] ?? 0;
  const sumV = summary["SumV"] ?? 0;
  const ego = comparisons["Ego"].COMPARACION ?? "Indefinido";
  const reflejos = summary["Fr+rF"] ?? 0;

  if (sumT > 1) {
    interpretaciones.push(
      "[VERIFICAR AUMENTO DE T - ¿PÉRDIDA RECIENTE? ¿DUELO NO ELABORADO?]",
    );
  }

  if (sumV > 0) {
    interpretaciones.push("[VERIFICAR AUMENTO DE V]");
  }

  if (
    ["Levemente por encima", "Marcadamente por encima"].includes(ego) &&
    reflejos === 0 &&
    sumT > 1 &&
    sumV > 0
  ) {
    interpretaciones.push(
      "[RECALCULAR AdjD POR AUMENTO DE T O V - INCORPORAR HISTORIA CLÍNICA]",
    );
  }

  // Paso 5: C pura, MQsin, MQ-
  const cPura = summary["C"] ?? 0;
  const mqSin = summary["MQsin"] ?? 0;
  const mqMenos = summary["MQ-"] ?? 0;

  if (puntD !== undefined && typeof puntD === "number") {
    if (puntD >= 0) {
      interpretaciones.push("[ADECUADO CONTROL GENERAL]");
    } else {
      interpretaciones.push("[BAJO CONTROL GENERAL]");
    }
  }

  if (cPura > 0) interpretaciones.push("[C PURA PRESENTE]");
  if (mqSin > 0) interpretaciones.push("[MQsin PRESENTE]");
  if (mqMenos > 0) interpretaciones.push("[MQ- PRESENTE]");

  // Paso 6: CompljsSit/R
  const compljsSit = summary["CompljsSit/R"] ?? 0;
  if (compljsSit >= 0.5) {
    interpretaciones.push("[ALTA COMPLEJIDAD INTELECTUAL SITUACIONAL");
  }

  // Paso 7: CompljsColY y CompljsSHY
  const compljsColY = summary["CompljsColY"] ?? 0;
  const compljsSHY = summary["CompljsSHY"] ?? 0;

  if (compljsColY > 0) interpretaciones.push("[PRESENTE CompljsColY]");
  if (compljsSHY > 0) interpretaciones.push("[PRESENTE CompljsSHY]");

  return interpretaciones;
}
