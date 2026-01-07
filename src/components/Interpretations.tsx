import { useMemo } from "react";
import type { Comparison } from "../types/NormativeData";
import type { StructuralSummaryData } from "../types/StructuralSummaryData";
import { generateInterpretations } from "../utils/interpretation/generateInterpretations";
import { parseComparisons } from "../utils/parseComparisons";
import type { Answer } from "../utils/buildMasterSummary";

type InterpretationsProps = {
  answers: Answer[];
  summary: StructuralSummaryData;
  comparisons: Comparison[];
};

export default function Interpretations({
  answers,
  summary,
  comparisons,
}: InterpretationsProps) {
  const comparisonMap = useMemo(() => {
    return comparisons ? parseComparisons(comparisons) : {};
  }, [comparisons]);

  const interpretations = useMemo(
    () =>
      generateInterpretations({
        answers,
        summary,
        comparisonMap,
      }),
    [answers, summary, comparisonMap]
  );

  return (
    <section className="my-10">
      <h2 className="my-10 font-semibold text-3xl">Informe Preliminar</h2>
      {interpretations.sections.map((section) => (
        <div key={section.title}>
          <h2 className="text-2xl my-6 text-left! font-semibold">
            {section.title}
          </h2>
          {section.areas.map((area, idx) => (
            <div key={idx} className="my-10">
              {area.title && (
                <h3 className="text-xl text-left! font-medium">{area.title}</h3>
              )}
              {area.interpretations.flat().map((interp, i) => (
                <p key={i} className="my-4">
                  {interp}
                </p>
              ))}
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}
