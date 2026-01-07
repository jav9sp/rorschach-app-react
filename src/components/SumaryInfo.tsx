import type { Comparison } from "../types/NormativeData";
import type { StructuralSummaryData } from "../types/StructuralSummaryData";
import ComparisonTable from "./ComparisonTable";
import Resume from "./Resume";
import StructuralSummary from "./StructuralSummary";

type SummaryInfoProps = {
  summary: StructuralSummaryData;
  comparisons: Comparison[] | null;
};

export default function SummaryInfo({
  summary,
  comparisons,
}: SummaryInfoProps) {
  return (
    <section>
      <Resume summary={summary} />

      <StructuralSummary data={summary} />

      {comparisons && (
        <ComparisonTable
          comparaciones={comparisons}
          tipoVivencial={summary.TipoVivencial}
        />
      )}
    </section>
  );
}
