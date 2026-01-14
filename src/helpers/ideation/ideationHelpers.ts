import type { ComparisonMap } from "../../types/NormativeData";

type Elevation = "leve" | "marcado";
type SpecialCodeKey =
  | "DV1"
  | "DV2"
  | "DR1"
  | "DR2"
  | "INC1"
  | "INC2"
  | "FAB1"
  | "FAB2"
  | "ALOG"
  | "CONTAM";

type ThoughtDisorgGrade = 1 | 2 | 3;

type SpecialCodesAssessment = {
  elevated: {
    leve: SpecialCodeKey[];
    marcado: SpecialCodeKey[];
  };
  grades: {
    1: SpecialCodeKey[]; // DV1 INC1 DR1
    2: SpecialCodeKey[]; // DV2 FAB1 INC2 ALOG
    3: SpecialCodeKey[]; // DR2 FAB2 CONTAM
  };
  maxGrade: ThoughtDisorgGrade | 0; // 0 si nada en grado 1-3
  hasAnyElevation: boolean;
  hasGrade3: boolean;
};

export function evaluateSpecialCodes(comparisons: Partial<ComparisonMap>): {
  levemente: SpecialCodeKey[];
  marcadamente: SpecialCodeKey[];
  anyHigh: boolean;
} {
  const codes: Record<SpecialCodeKey, string | undefined> = {
    DV1: comparisons.DV1?.COMPARACION,
    DV2: comparisons.DV2?.COMPARACION,
    DR1: comparisons.DR1?.COMPARACION,
    DR2: comparisons.DR2?.COMPARACION,
    INC1: comparisons.INC1?.COMPARACION,
    INC2: comparisons.INC2?.COMPARACION,
    FAB1: comparisons.FAB1?.COMPARACION,
    FAB2: comparisons.FAB2?.COMPARACION,
    ALOG: comparisons.ALOG?.COMPARACION,
    CONTAM: comparisons.CONTAM?.COMPARACION,
  };

  const levemente: SpecialCodeKey[] = [];
  const marcadamente: SpecialCodeKey[] = [];

  for (const [key, comp] of Object.entries(codes) as [
    SpecialCodeKey,
    string | undefined
  ][]) {
    if (comp === "Levemente por encima") levemente.push(key);
    if (comp === "Marcadamente por encima") marcadamente.push(key);
  }

  return {
    levemente,
    marcadamente,
    anyHigh: levemente.length > 0 || marcadamente.length > 0,
  };
}

export function isMentalFlexible(active: number, passive: number): boolean {
  if (
    (active >= 4 && passive === 0) ||
    (active === 0 && passive >= 4) ||
    active >= passive * 3 ||
    passive >= active * 3
  )
    return false;
  return true;
}

export function checkDependence(
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
  if (["Levemente por encima", "Marcadamente por encima"].includes(populares))
    contador++;
  if (["Levemente por debajo", "Marcadamente por debajo"].includes(ego))
    contador++;
  if (fd > 0) contador++;

  return `[INDICADORES DEPENDENCIA: ${contador}]`;
}

const GRADE_MAP: Record<SpecialCodeKey, ThoughtDisorgGrade> = {
  DV1: 1,
  INC1: 1,
  DR1: 1,
  DV2: 2,
  FAB1: 2,
  INC2: 2,
  ALOG: 2,
  DR2: 3,
  FAB2: 3,
  CONTAM: 3,
};

function compToElevation(comp?: string): Elevation | null {
  if (comp === "Levemente por encima") return "leve";
  if (comp === "Marcadamente por encima") return "marcado";
  return null;
}

export function assessSpecialCodes(
  comparisons: Partial<ComparisonMap>
): SpecialCodesAssessment {
  const comps: Record<SpecialCodeKey, string | undefined> = {
    DV1: comparisons.DV1?.COMPARACION,
    DV2: comparisons.DV2?.COMPARACION,
    DR1: comparisons.DR1?.COMPARACION,
    DR2: comparisons.DR2?.COMPARACION,
    INC1: comparisons.INC1?.COMPARACION,
    INC2: comparisons.INC2?.COMPARACION,
    FAB1: comparisons.FAB1?.COMPARACION,
    FAB2: comparisons.FAB2?.COMPARACION,
    ALOG: comparisons.ALOG?.COMPARACION,
    CONTAM: comparisons.CONTAM?.COMPARACION,
  };

  const result: SpecialCodesAssessment = {
    elevated: { leve: [], marcado: [] },
    grades: { 1: [], 2: [], 3: [] },
    maxGrade: 0,
    hasAnyElevation: false,
    hasGrade3: false,
  };

  (Object.keys(comps) as SpecialCodeKey[]).forEach((code) => {
    const elev = compToElevation(comps[code]);
    if (!elev) return;

    result.elevated[elev].push(code);
    const grade = GRADE_MAP[code];
    result.grades[grade].push(code);

    result.hasAnyElevation = true;
    if (grade > result.maxGrade) result.maxGrade = grade;
    if (grade === 3) result.hasGrade3 = true;
  });

  return result;
}
/**
 *
 * @param persona
 * @param assessment
 * @returns String Array of interpretations for Special Codes
 */
export function interpretSpecialCodes(
  persona: string,
  assessment: SpecialCodesAssessment
): string[] {
  const out: string[] = [];

  if (!assessment.hasAnyElevation) {
    out.push(
      `En el protocolo de ${persona} no se observan elevaciones relevantes en los códigos especiales críticos, lo que sugiere que los deslices ideativos (si aparecen) son escasos o situacionales.`
    );
    return out;
  }

  // 1) Encabezado general según nivel
  if (assessment.elevated.marcado.length > 0) {
    out.push(
      `En ${persona} se observan elevaciones marcadas en códigos especiales críticos, lo que sugiere fallas lógicas más importantes y un mayor riesgo de desorganización del curso ideativo, especialmente en situaciones demandantes.`
    );
  } else if (assessment.elevated.leve.length > 0) {
    out.push(
      `En ${persona} se observan elevaciones leves en códigos especiales críticos, compatibles con deslices cognitivos moderados o dificultades puntuales en la discriminación y organización de ideas.`
    );
  }

  // 2) Lectura cualitativa por grado del continuum
  if (assessment.maxGrade === 1) {
    out.push(
      `La elevación se concentra en indicadores de menor gravedad (grado 1), asociados a lapsus leves, razonamiento más concreto o dificultades moderadas de discriminación.`
    );
  } else if (assessment.maxGrade === 2) {
    out.push(
      `La presencia de indicadores de gravedad intermedia (grado 2) sugiere rupturas lógicas más relevantes e inmadurez o desarticulación del pensamiento en algunos momentos.`
    );
  } else if (assessment.maxGrade === 3) {
    out.push(
      `Se identifican indicadores de gravedad alta (grado 3), lo que constituye una señal de alarma por su asociación con disfunción ideativa severa o desorganización del pensamiento.`
    );
  }

  // 3) Listado útil para trazabilidad clínica (opcional, pero práctico)
  const list = (arr: string[]) => arr.join(", ");
  if (assessment.elevated.marcado.length) {
    out.push(
      `Códigos marcadamente elevados: ${list(assessment.elevated.marcado)}.`
    );
  }
  if (assessment.elevated.leve.length) {
    out.push(`Códigos levemente elevados: ${list(assessment.elevated.leve)}.`);
  }

  return out;
}
