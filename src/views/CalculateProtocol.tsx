import { useState } from "react";
import FileUpload from "../components/FileUpload";
import ProtocolResults from "../components/ProtocolResults";

import { parseExcel } from "../utils/parseExcel";

import type { Answer } from "../utils/buildMasterSummary";

export default function CalculateProtocol() {
  const [answers, setAnswers] = useState<Answer[] | null>(null);
  const [gender, setGender] = useState("M");
  const [age, setAge] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);

    if (age === "" || age < 4 || age > 99) {
      setError(
        "Indica una edad válida (entre 4 y 99 años) antes de subir el archivo.",
      );
      return;
    }

    try {
      const data = await parseExcel(file);
      setAnswers(data);
    } catch (err) {
      console.error("Error al leer el archivo:", err);
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo leer el archivo. Verifica que sea un Excel válido con el formato de la plantilla.",
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center pt-12 text-gray-700">
      <div className="max-w-3xl w-full">
        <h1 className="text-4xl md:text-5xl font-bold mb-12">
          {answers ? "Resultados del Evaluado" : "Calcular Protocolo"}
        </h1>

        {error && (
          <div
            role="alert"
            className="mb-8 px-4 py-3 border border-red-300 bg-red-50 text-red-700 rounded"
          >
            {error}
          </div>
        )}

        {!answers && (
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
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Edad
                </label>
                <input
                  onChange={(e) =>
                    setAge(e.target.value === "" ? "" : +e.target.value)
                  }
                  value={age}
                  type="number"
                  min={4}
                  max={99}
                  name="edad"
                  id="edad"
                  className="w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              <div>
                <label
                  htmlFor="genero"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Género
                </label>
                <select
                  onChange={(e) => setGender(e.target.value)}
                  name="genero"
                  id="genero"
                  className="w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="0">Seleccionar...</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>
            </form>

            <section>
              <FileUpload onFileSelected={handleFile} />

              <a
                href="/plantilla.xlsx"
                download="ejemplo_protocolo_rorschach.xlsx"
                className="px-6 py-3 bg-teal-600 text-white rounded shadow hover:bg-teal-700 transition mx-auto block w-fit font-semibold"
              >
                Descargar plantilla de prueba
              </a>
            </section>
          </>
        )}

        {answers && (
          <ProtocolResults
            answers={answers}
            age={age as number}
            gender={gender}
            onReset={() => {
              setAnswers(null);
              setError(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
