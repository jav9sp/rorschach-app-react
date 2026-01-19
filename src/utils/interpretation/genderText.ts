import type { StructuralSummaryData } from "../../types/StructuralSummaryData";

type GenderTextReturn = {
  person: "el evaluado" | "la evaluada";
  vowel: "o" | "a";
  article: "lo" | "la";
};

export function genderText(
  gender: StructuralSummaryData["Genero"],
): GenderTextReturn {
  const person = gender == "M" ? "el evaluado" : "la evaluada";
  const vowel = gender == "M" ? "o" : "a";
  const article = gender == "M" ? "lo" : "la";

  return { person, vowel, article };
}
