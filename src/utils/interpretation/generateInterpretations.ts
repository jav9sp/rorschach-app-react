import { interpretPreliminaries } from "./interpretPreliminaries";
import { interpretProcessing } from "./interpretProssesing";
import { interpretMediation } from "./interpretMediation";
import { interpretAffects } from "./interpretAffects";
import { interpretSelfPerception } from "./interpretSelfPerception";
import { interpretInterpersonal } from "./interpretInterpersonal";
import { interpretStressControl } from "./interpretStressControl";
import { interpretSituationalStress } from "./interpretSituationalStress";

import type { ComparisonMap } from "../../types/NormativeData";
import type { StructuralSummaryData } from "../../types/StructuralSummaryData";
import type { Answer } from "../buildMasterSummary";
import { interpretIdeation } from "./interpretIdeation";

type GenerateInterpretationsInputs = {
  answers: Answer[];
  summary: StructuralSummaryData;
  comparisonMap: ComparisonMap;
};

export function generateInterpretations({
  answers,
  summary,
  comparisonMap,
}: GenerateInterpretationsInputs) {
  // Llamadas a cada módulo de interpretación
  const preliminaries = interpretPreliminaries(summary, comparisonMap);
  const processing = interpretProcessing(answers, summary, comparisonMap);
  const mediation = interpretMediation(summary, comparisonMap);
  const ideation = interpretIdeation(summary, comparisonMap);
  const affects = interpretAffects(summary, comparisonMap);
  const selfPerception = interpretSelfPerception(summary, comparisonMap);
  const interpersonal = interpretInterpersonal(summary, comparisonMap);
  const stressControl = interpretStressControl(summary, comparisonMap);
  const situationalStress = interpretSituationalStress(summary, comparisonMap);

  // Retornamos un objeto estructurado
  return {
    sections: [
      {
        title: "I. Aspectos Preliminares",
        areas: [
          {
            title: null,
            interpretations: preliminaries,
          },
        ],
      },
      {
        title: "II. Interpretación por Área",
        areas: [
          {
            title: "1. Procesamiento de la Información",
            interpretations: processing,
          },
          {
            title: "2. Mediación Cognitiva",
            interpretations: mediation,
          },
          {
            title: "3. Ideación y Pensamiento",
            interpretations: ideation,
          },
          {
            title: "4. Afectos",
            interpretations: affects,
          },
          {
            title: "5. Autopercepción",
            interpretations: selfPerception,
          },
          {
            title: "6. Relaciones Interpersonales",
            interpretations: interpersonal,
          },
          {
            title: "7. Control y Tolerancia al Estrés",
            interpretations: stressControl,
          },
          {
            title: "8. Estrés situacional",
            interpretations: situationalStress,
          },
        ],
      },
      {
        title: "III. Consideraciones Finales",
        areas: [
          {
            title: null,
            interpretations: [], // No hay interpretación por ahora
          },
        ],
      },
    ],
  };
}
