import { useEffect, useState } from "react";
import FileUpload from "../components/FileUpload";
import { MoonLoader } from "react-spinners";
import SummaryInfo from "../components/SumaryInfo";
import Interpretations from "../components/Interpretations";

import { buildMasterSummary } from "../utils/buildMasterSummary";
import { parseExcel } from "../utils/parseExcel";
import { obtenerTablaPorEstilo } from "../utils/normativeData/moduleCargarTablaNormativa";
import { compararConNormativa } from "../utils/normativeData/normativeComparison";

import type { CSSProperties } from "react";
import type { Answer } from "../utils/buildMasterSummary";
import type { StructuralSummaryData } from "../types/StructuralSummaryData";
import type { Comparison } from "../types/NormativeData";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

export default function CalculateProtocol() {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [summary, setSummary] = useState<StructuralSummaryData | null>(null);
  const [comparisons, setComparisons] = useState<Comparison[] | null>(null);
  const [gender, setGender] = useState("M");
  const [age, setAge] = useState(14);
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(true);

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
      } catch (error) {
        console.error("Error al comparar con normativa:", error);
        setComparisons(null);
      }
    };

    ejecutarComparacion();
  }, [summary]);

  const handleFile = async (file: File) => {
    setLoading(true);

    try {
      const data: Answer[] = await parseExcel(file);
      setAnswers(data);

      if (!age || age < 4 || age > 99) {
        throw new Error("Edad fuera de rango válido.");
      }

      const summaryData = buildMasterSummary(data, age, gender);
      setSummary(summaryData);

      setTimeout(() => {
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error("Error:", error);
      setComparisons(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center pt-12 text-gray-700">
      <div className="max-w-3xl w-full">
        <h1 className="text-4xl md:text-5xl font-bold mb-12">
          {summary ? "Resultados del Evaluado" : "Calcular Protocolo"}
        </h1>

        {!summary && (
          <>
            <p className="text-lg md:text-xl text-gray-600 mb-8 text-center">
              Carga tus codificaciones en formato Excel. <br /> Usa la plantilla
              de prueba como guía, complétala y luego súbela pinchando el botón
              "Seleccionar archivo"
            </p>

            <form className="max-w-md border border-gray-300 mx-auto p-6 bg-white rounded space-y-6 my-10">
              <p className="text-lg text-gray-700">
                Indica la edad y género de la persona evaluada:
              </p>
              <div>
                <label
                  htmlFor="edad"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Edad
                </label>
                <input
                  onChange={(e) => setAge(+e.target.value)}
                  type="number"
                  name="edad"
                  id="edad"
                  className="w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              <div>
                <label
                  htmlFor="genero"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Género
                </label>
                <select
                  onChange={(e) => setGender(e.target.value)}
                  name="genero"
                  id="genero"
                  className="w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                  <option value="0">Seleccionar...</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                  <option value="No especificado">
                    Prefiero no especificar
                  </option>
                </select>
              </div>
            </form>

            <section>
              <FileUpload onFileSelected={handleFile} />

              <a
                href="/plantilla.xlsx"
                download="ejemplo_protocolo_rorschach.xlsx"
                className="px-6 py-3 bg-teal-600 text-white rounded shadow hover:bg-teal-700 transition mx-auto block w-fit font-semibold">
                Descargar plantilla de prueba
              </a>
            </section>
          </>
        )}

        {loading && (
          <section
            className={`absolute flex flex-col justify-center gap-10 items-center inset-0 z-10 h-screen bg-white backdrop-blur-xl`}>
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
              className="px-4 py-2 border rounded border-gray-300 bg-teal-600 hover:bg-teal-500 transition-colors cursor-pointer font-semibold text-white">
              {showInfo ? "Ver Informe" : "Ver Sumario Estructural"}
            </button>
            <button
              onClick={() => {
                setSummary(null);
                setComparisons(null);
                setShowInfo(true);
              }}
              className="px-4 py-2 border rounded border-gray-300 bg-amber-600 hover:bg-amber-500 transition-colors cursor-pointer font-semibold text-white">
              Limpiar Datos
            </button>
          </div>
        )}

        {/* Mostrar Información Procesada */}
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
    </div>
  );
}
