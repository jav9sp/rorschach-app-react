import type { StructuralSummaryData } from "../../types/StructuralSummaryData";

/**
 * Evalúa la constelación DEPI (Depresión).
 * Marca positivo si cumple al menos 5 condiciones.
 */
export function evaluarDEPI(variables: Partial<StructuralSummaryData>): {
  DEPI: string;
  "DEPI Contador": number;
} {
  let condiciones = 0;

  if ((variables["SumV"] ?? 0) > 0 || (variables["FD"] ?? 0) > 2) {
    condiciones += 1;
  }

  if ((variables["CompljsColSH"] ?? 0) > 0) {
    condiciones += 1;
  } else if ((variables["S"] ?? 0) > 2) {
    condiciones += 1;
  }

  const egoc = variables["Ego"] ?? 0;
  if (typeof egoc === "number" && egoc < 0.33) {
    condiciones += 1;
  }
  if (
    typeof egoc === "number" &&
    egoc > 0.44 &&
    (variables["Fr+rF"] ?? 0) === 0
  ) {
    condiciones += 1;
  }

  if ((variables["Afr"] ?? 1) < 0.46) {
    condiciones += 1;
  } else if ((variables["Compljs"] ?? 10) < 4) {
    condiciones += 1;
  }

  if ((variables["SumSH"] ?? 0) > (variables["FM+m"] ?? 0)) {
    condiciones += 1;
  } else if ((variables["SumC'"] ?? 0) > 2) {
    condiciones += 1;
  }

  if ((variables["MOR"] ?? 0) > 2) {
    condiciones += 1;
  } else if ((variables["Intelec"] ?? 0) > 3) {
    condiciones += 1;
  }

  if ((variables["COP"] ?? 0) < 2) {
    condiciones += 1;
  } else if ((variables["Aisl/R"] ?? 0) > 0.24) {
    condiciones += 1;
  }

  const resultado = condiciones >= 5 ? "Positivo" : "Negativo";

  return {
    DEPI: resultado,
    "DEPI Contador": condiciones,
  };
}
