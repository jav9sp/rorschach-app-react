import type { StructuralSummaryData } from "../../types/StructuralSummaryData";

export function finalConsiderations(summary: StructuralSummaryData): string[] {
  const considerations: string[] = [];

  if (summary.COP > 4) {
    considerations.push(
      "COP > 4: Tendencia a abandono temprano del tratamiento."
    );
  }

  return considerations;
}
