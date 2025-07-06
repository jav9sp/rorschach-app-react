import { useState } from "react";
import type { StructuralSummaryData } from "../types/StructuralSummaryData";
import { buildMasterSummary } from "../utils/buildMasterSummary";
import { parseExcel } from "../utils/parseExcel";
import FileUpload from "./FileUpload";
import StructuralSummary from "./StructuralSumary";

export default function Landing() {
  const [summary, setSummary] = useState<StructuralSummaryData | null>(null);

  const handleFile = async (file: File) => {
    const data = await parseExcel(file);
    const summaryData = buildMasterSummary(data); // Aquí pondrás edad/género dinámicos
    setSummary(summaryData);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-3xl w-full">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 text-center">
          Generador de Informes Rorschach - Sistema Exner
        </h1>

        {!summary && (
          <>
            <p className="text-lg md:text-xl text-gray-600 mb-8 text-center">
              Carga tus codificaciones en Excel, genera el sumario estructural y
              obtén un informe preliminar del test de Rorschach en segundos.
            </p>

            <a
              href="/plantilla.xlsx"
              download="ejemplo_protocolo_rorschach.xlsx"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition mx-auto block w-fit">
              Descargar plantilla de prueba
            </a>

            <FileUpload onFileSelected={handleFile} />

            <div className="mt-12 text-left">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                ¿Qué puedes hacer con esta herramienta?
              </h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Subir tu archivo de codificaciones (.xlsx)</li>
                <li>Calcular automáticamente el sumario estructural</li>
                <li>Obtener constelaciones interpretativas</li>
                <li>
                  Pronto - Visualizar indicadores clave del Sistema
                  Comprehensivo
                </li>
                <li>Pronto - Descargar un informe preliminar</li>
              </ul>
            </div>
          </>
        )}

        {summary && (
          <>
            <StructuralSummary data={summary} />

            <button
              onClick={() => setSummary(null)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition cursor-pointer my-12 mx-auto block">
              Calcular Otro
            </button>
          </>
        )}

        <footer className="mt-12 text-sm text-gray-500 text-center">
          <span>© {new Date().getFullYear()}</span>{" "}
          <a href="https://manchasdetinta.net" target="blank">
            manchasdetinta.net
          </a>
        </footer>
      </div>
    </div>
  );
}
