import type { StructuralSummaryData } from "../types/StructuralSummaryData";

interface ResumeProps {
  summary: StructuralSummaryData;
}

export default function Resume({ summary }: ResumeProps) {
  return (
    <div className="w-full rounded border border-gray-300 p-4 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Resumen del Evaluado
      </h2>

      <ul className="space-y-2 text-gray-700">
        <li className="flex justify-between">
          <span className="font-medium">Edad:</span>
          <span>{summary.Edad} años</span>
        </li>
        <li className="flex justify-between">
          <span className="font-medium">Género:</span>
          <span>{summary.Genero}</span>
        </li>
        <li className="flex justify-between">
          <span className="font-medium">Cantidad de Respuestas:</span>
          <span>{summary.R}</span>
        </li>
        <li className="flex justify-between">
          <span className="font-medium">Lambda:</span>
          <span>{summary.Lambda}</span>
        </li>
        <li className="flex justify-between">
          <span className="font-medium">Estilo Vivencial:</span>
          <span>{summary["Tipo Vivencial"]}</span>
        </li>
        <li className="flex justify-between">
          <span className="font-medium">Constelación CDI:</span>
          <span>{summary.CDI}</span>
        </li>
        <li className="flex justify-between">
          <span className="font-medium">Constelación DEPI:</span>
          <span>{summary.DEPI}</span>
        </li>
      </ul>
    </div>
  );
}
