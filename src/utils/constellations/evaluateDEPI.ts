import type { StructuralSummaryData } from "../../types/StructuralSummaryData";
import { joinStrings } from "../joinStrings";

type DEPIResults = {
  DEPI: string;
  DEPICounter: number;
  DEPIText: string;
};

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
 * Evalúa la constelación DEPI (Depresión).
 * Marca positivo si cumple al menos 5 condiciones.
 */
export function evaluateDEPI(
  summary: Partial<StructuralSummaryData>
): DEPIResults {
  const persona = summary.Genero === "M" ? "el evaluado" : "la evaluada";

  let condiciones = 0;
  let interpretaciones: string[] = [];
  let factorCognitivo = 0;
  let factorAfectivo = 0;
  let factorSocial = 0;
  let texto = "";

  if ((summary.SumV ?? 0) > 0 || (summary.FD ?? 0) > 2) {
    condiciones++;
    interpretaciones.push("marcada tendencia a la introspección negativa");

    if ((summary.FD ?? 0) > 2) factorCognitivo++;
    if ((summary.SumV ?? 0) > 0) factorAfectivo++;
  }

  if ((summary.CompljsColSH ?? 0) > 0) {
    condiciones++;
    factorAfectivo++;
    interpretaciones.push(
      "fuerte presencia de elementos disfóricos en su elaboración cognitiva"
    );
  } else if ((summary.S ?? 0) > 2) {
    condiciones++;
    factorAfectivo++;
    interpretaciones.push("marcada tendencia oposicionista");
  }

  const egoc = summary.Ego ?? 0;
  if (egoc < 0.33) {
    condiciones++;
    factorCognitivo++;
    interpretaciones.push("bajo índice de egocentrismo");
  }
  if (egoc > 0.44 && (summary["Fr+rF"] ?? 0) === 0) {
    condiciones++;
    factorCognitivo++;
    interpretaciones.push("alto índice de egocentrismo (sin narcisismo)");
  }

  if ((summary.Afr ?? 1) < 0.46) {
    condiciones++;
    factorAfectivo++;
    interpretaciones.push(
      "baja responsividad cognitiva a la estimulación emocional"
    );
  } else if ((summary.Compljs ?? 10) < 4) {
    condiciones++;
    factorCognitivo++;
    interpretaciones.push("baja complejidad intelectual");
  }

  if ((summary.SumSH ?? 0) > (summary["FM+m"] ?? 0)) {
    condiciones++;
    factorAfectivo++;
    interpretaciones.push(
      "aumento de tensión interna por el registro de elementos disfóricos"
    );
  } else if ((summary["SumC'"] ?? 0) > 2) {
    condiciones++;
    factorAfectivo++;
    interpretaciones.push("aumento la represión de elementos disfóricos");
  }

  if ((summary.MOR ?? 0) > 2) {
    condiciones++;
    factorCognitivo++;
    interpretaciones.push("marcada presencia de negativismo en la ideación");
  } else if ((summary.Intelec ?? 0) > 3) {
    condiciones++;
    factorCognitivo++;
    interpretaciones.push("marcada tendencia a usar la intelectualización");
  }

  if ((summary.COP ?? 0) < 2) {
    condiciones++;
    factorSocial++;
    interpretaciones.push(
      "falta de atribuciones positivas a la interacción con los demás"
    );
  } else if ((summary["Aisl/R"] ?? 0) > 0.24) {
    condiciones++;
    factorSocial++;
    interpretaciones.push("una tendencia a asilarse socialmente");
  }

  if (condiciones < 5) {
    texto = `La constelación de depresión marca negativo, lo que permite descartar la presencia de depresión actual. Pese a ello, ${persona} muestra ${
      numeros[condiciones]
    } indicadores, incluyendo ${joinStrings(interpretaciones)}.`;
  } else if (condiciones === 5) {
    texto = `Se observa que ${persona} cuenta con cinco indicadores de la constelación de depresión que, si bien no afirma que cuente con un diagnóstico de depresión activa, indica que se encuentra vulnerable a caer en estados depresivos o sufrir alteraciones bruscas del estado de ánimo.`;
  } else if (condiciones > 5) {
    texto = generarDepiPositivo(
      persona,
      factorCognitivo,
      factorAfectivo,
      factorSocial
    );
  }

  const resultado = condiciones >= 5 ? "Positivo" : "Negativo";

  return {
    DEPI: resultado,
    DEPICounter: condiciones,
    DEPIText: texto,
  };
}

function generarDepiPositivo(
  persona: string,
  factorCognitivo: number,
  factorAfectivo: number,
  factorSocial: number
): string {
  const areasAfectadas: string[] = [];
  if (factorCognitivo > 0) areasAfectadas.push("cognitiva");
  if (factorAfectivo > 0) areasAfectadas.push("afectiva");
  if (factorSocial > 0) areasAfectadas.push("social");

  let areasTxt = "";
  if (areasAfectadas.length === 1) {
    areasTxt = `sobre el área ${areasAfectadas[0]}`;
  } else if (areasAfectadas.length === 2) {
    areasTxt = `sobre las áreas ${areasAfectadas[0]} y ${areasAfectadas[1]}`;
  } else if (areasAfectadas.length > 2) {
    areasTxt = `en las áreas ${areasAfectadas.slice(0, -1).join(", ")} y ${
      areasAfectadas[areasAfectadas.length - 1]
    }`;
  }

  const normCognitivo = factorCognitivo / 4;
  const normAfectivo = factorAfectivo / 4;
  const normSocial = factorSocial / 1;

  const maxValor = Math.max(normCognitivo, normAfectivo, normSocial);
  let principal: string;
  if (maxValor === normCognitivo) {
    principal = "cognitiva";
  } else if (maxValor === normAfectivo) {
    principal = "afectiva";
  } else {
    principal = "social";
  }

  let severidad: string;
  if (maxValor <= 0.33) {
    severidad = "leve";
  } else if (maxValor <= 0.66) {
    severidad = "moderado";
  } else {
    severidad = "mayor";
  }

  return `La constelación de depresión marca positivo, lo que indica que ${persona} se encuentra enfrentando un trastorno afectivo que perturba su estado emocional, teniendo un mayor impacto ${areasTxt}, siendo la ${principal} la que muestra un deterioro ${severidad} en relación con su potencial de funcionamiento.`;
}
