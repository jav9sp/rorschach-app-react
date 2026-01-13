import type { StructuralSummaryData } from "../../types/StructuralSummaryData";

export function genderText(gender: StructuralSummaryData["Genero"]): string[] {
  const p = gender == "M" ? "el evaluado" : "la evaluada";
  const v = gender == "M" ? "o" : "a";
  const a = gender == "M" ? "lo" : "la";

  return [p, v, a];
}
