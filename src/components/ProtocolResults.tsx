import { useEffect, useState, type CSSProperties } from "react";
import { MoonLoader } from "react-spinners";
import SummaryInfo from "./SumaryInfo";
import Interpretations from "./Interpretations";

import { buildMasterSummary } from "../utils/buildMasterSummary";
import {
  validateProtocol,
  formatValidationErrors,
} from "../utils/validateProtocol";
import { obtenerTablaPorEstilo } from "../utils/normativeData/moduleCargarTablaNormativa";
import { compararConNormativa } from "../utils/normativeData/normativeComparison";

import type { Answer } from "../utils/buildMasterSummary";
import type { StructuralSummaryData } from "../types/StructuralSummaryData";
import type { Comparison } from "../types/NormativeData";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

type ProtocolResultsProps = {
  answers: Answer[];
  age: number;
  gender: string;
  onReset: () => void;
};

/**
 * Valida, calcula el Sumario Estructural, lo compara con las tablas
 * normativas y muestra el resultado. Es el mismo flujo para cualquier
 * origen de datos (Excel o el formulario de codificación por lámina) —
 * antes esta lógica vivía duplicada dentro de CalculateProtocol.tsx.
 */
export default function ProtocolResults({
  answers,
  age,
  gender,
  onReset,
}: ProtocolResultsProps) {
  const [summary, setSummary] = useState<StructuralSummaryData | null>(null);
  const [comparisons, setComparisons] = useState<Comparison[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      const validationErrors = validateProtocol(answers);
      if (validationErrors.length > 0) {
        throw new Error(
          `El protocolo tiene datos incompletos o valores no reconocidos y no se puede calcular con seguridad. ${formatValidationErrors(validationErrors)}`,
        );
      }

      const summaryData = buildMasterSummary(answers, age, gender);
      setSummary(summaryData);

      setTimeout(() => {
        setLoading(false);
      }, 800);
    } catch (err) {
      console.error("Error al calcular el sumario:", err);
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo calcular el sumario estructural a partir de los datos ingresados.",
      );
      setLoading(false);
    }
  }, [answers, age, gender]);

  useEffect(() => {
    const ejecutarComparacion = async () => {
      if (!summary) return;

      try {
        const estilo = summary.TipoVivencial || "Indefinido";
        const edad = summary.Edad;

        const tabla = await obtenerTablaPorEstilo(estilo, edad!);
        const comparacion = compararConNormativa(summary, tabla);

        localStorage.setItem("comparacion", JSON.stringify(comparacion));

        setComparisons(comparacion);
      } catch (err) {
        console.error("Error al comparar con normativa:", err);
        setComparisons(null);
        setError(
          "El sumario se calculó correctamente, pero no fue posible compararlo con las tablas normativas.",
        );
      }
    };

    ejecutarComparacion();
  }, [summary]);

  return (
    <div className="max-w-3xl w-full">
      {error && (
        <div
          role="alert"
          className="mb-8 px-4 py-3 border border-red-300 bg-red-50 text-red-700 rounded"
        >
          {error}
        </div>
      )}

      {loading && (
        <section className="absolute flex flex-col justify-center gap-10 items-center inset-0 z-10 h-screen bg-white backdrop-blur-xl">
          <p className="text-4xl text-teal-600 font-bold">Calculando...</p>

          <MoonLoader
            color={"oklch(60% 0.118 184.704)"}
            loading={loading}
            cssOverride={override}
            size={150}
            speedMultiplier={0.8}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </section>
      )}

      {summary && (
        <div className="my-10 flex justify-between">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="px-4 py-2 border rounded border-gray-300 bg-teal-600 hover:bg-teal-500 transition-colors cursor-pointer font-semibold text-white"
          >
            {showInfo ? "Ver Informe" : "Ver Sumario Estructural"}
          </button>
          <button
            onClick={onReset}
            className="px-4 py-2 border rounded border-gray-300 bg-amber-600 hover:bg-amber-500 transition-colors cursor-pointer font-semibold text-white"
          >
            Limpiar Datos
          </button>
        </div>
      )}

      {summary && showInfo && (
        <SummaryInfo summary={summary} comparisons={comparisons} />
      )}
      {summary && comparisons && !showInfo && (
        <Interpretations
          answers={answers}
          summary={summary}
          comparisons={comparisons}
        />
      )}
    </div>
  );
}
