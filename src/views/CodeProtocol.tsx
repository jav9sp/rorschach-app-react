import { useMemo, useReducer, useRef, useState, type FormEvent } from "react";
import { inkblots } from "../data/codifications";
import { initialState, protocolReducer } from "../reducers/protocol-reducer";
import LaminaNav from "../components/coding/LaminaNav";
import ResponseForm from "../components/coding/ResponseForm";
import ProtocolResults from "../components/ProtocolResults";
import type { Answer } from "../utils/buildMasterSummary";

export default function CodeProtocol() {
  const [state, dispatch] = useReducer(protocolReducer, initialState);
  const [gender, setGender] = useState("M");
  const [age, setAge] = useState<number | "">("");
  const [ageError, setAgeError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const formBoxRef = useRef<HTMLDivElement>(null);

  const currentLamina = inkblots[currentIndex];

  const countsByLamina = useMemo(
    () =>
      inkblots.map(
        (lam) =>
          state.responses.filter(
            (r) => r.Lam.toUpperCase() === lam.toUpperCase(),
          ).length,
      ),
    [state.responses],
  );

  const responsesByLamina = useMemo(
    () =>
      state.responses.filter(
        (r) => r.Lam.toUpperCase() === currentLamina.toUpperCase(),
      ),
    [state.responses, currentLamina],
  );

  const handleStart = (e: FormEvent) => {
    e.preventDefault();
    if (age === "" || age < 4 || age > 99) {
      setAgeError("Indica una edad válida (entre 4 y 99 años) para comenzar.");
      return;
    }
    setAgeError(null);
    setStarted(true);
  };

  const handleReset = () => {
    dispatch({ type: "clear-responses" });
    setFinished(false);
    setStarted(false);
    setCurrentIndex(0);
  };

  const handleAddResponse = (answer: Omit<Answer, "N">) => {
    dispatch({ type: "add-response", payload: { answer } });
    // Se difiere al siguiente frame para que el DOM ya haya crecido con la
    // nueva respuesta antes de resetear el scroll (si no, el "scroll
    // anchoring" del navegador deshace el reset al insertar contenido arriba).
    requestAnimationFrame(() => {
      formBoxRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center pt-12 text-gray-700">
        <div className="max-w-3xl w-full">
          <h1 className="text-4xl md:text-5xl font-bold mb-12">
            Resultados del Evaluado
          </h1>
          <ProtocolResults
            answers={state.responses}
            age={age as number}
            gender={gender}
            onReset={handleReset}
          />
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center pt-12 text-gray-700">
        <div className="max-w-3xl w-full">
          <h1 className="text-4xl md:text-5xl font-bold mb-12">
            Codificar Protocolo
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 text-center">
            Vas a codificar las respuestas lámina por lámina, directamente desde
            el navegador — sin necesidad de Excel.
          </p>

          {ageError && (
            <div
              role="alert"
              className="mb-8 px-4 py-3 border border-red-300 bg-red-50 text-red-700 rounded max-w-md mx-auto"
            >
              {ageError}
            </div>
          )}

          <form
            onSubmit={handleStart}
            className="max-w-md border border-gray-300 mx-auto p-6 bg-white rounded space-y-6 my-10"
          >
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
                <option value="No especificado">Prefiero no especificar</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 transition cursor-pointer font-semibold"
            >
              Comenzar codificación
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center pt-12 pb-32 text-gray-700">
      <div className="max-w-5xl w-full px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Codificar Protocolo
        </h1>

        <LaminaNav
          laminas={inkblots}
          currentIndex={currentIndex}
          counts={countsByLamina}
          onSelect={setCurrentIndex}
        />

        <div className="grid md:grid-cols-2 gap-6 md:h-[640px]">
          <div className="border border-gray-300 rounded-lg bg-white flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-200 text-center">
              <h2 className="text-xl font-semibold">Lámina {currentLamina}</h2>
            </div>
            <div className="flex-1 flex items-center justify-center p-4 bg-gray-50 overflow-hidden min-h-[240px]">
              <img
                src={`/laminas/${currentIndex + 1}.jpg`}
                alt={`Lámina ${currentLamina} del Test de Rorschach`}
                className="max-w-full max-h-full object-contain rounded"
              />
            </div>
          </div>

          <div
            ref={formBoxRef}
            style={{ overflowAnchor: "none" }}
            className="border border-gray-300 rounded-lg bg-white p-5 overflow-y-auto"
          >
            {responsesByLamina.length > 0 && (
              <ul className="space-y-2 mb-6">
                {responsesByLamina.map((r) => (
                  <li
                    key={r.N}
                    className="flex items-center justify-between border border-gray-200 rounded px-4 py-2 bg-gray-50 text-sm"
                  >
                    <span>
                      <strong>R{r.N}</strong> — {r.Loc} {r.DQ} {r.Det} {r.FQ}
                      {r.Par ? " Par" : ""}
                      {r.Contenidos ? ` · ${r.Contenidos}` : ""}
                      {r.Populares ? " · P" : ""}
                      {r.Z ? ` · Z(${r.Z})` : ""}
                      {r["CC.EE."] ? ` · [${r["CC.EE."]}]` : ""}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        dispatch({
                          type: "delete-response",
                          payload: { id: r.N },
                        })
                      }
                      className="text-red-600 hover:text-red-800 cursor-pointer font-medium"
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <ResponseForm lamina={currentLamina} onAdd={handleAddResponse} />
          </div>
        </div>

        <div className="flex items-center justify-between mt-8">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            className="px-4 py-2 border rounded border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            ◀ Lámina anterior
          </button>
          <button
            type="button"
            disabled={currentIndex === inkblots.length - 1}
            onClick={() =>
              setCurrentIndex((i) => Math.min(inkblots.length - 1, i + 1))
            }
            className="px-4 py-2 border rounded border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Lámina siguiente ▶
          </button>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-center z-10">
        <button
          type="button"
          disabled={state.responses.length === 0}
          onClick={() => setFinished(true)}
          className="px-6 py-3 bg-teal-600 text-white rounded shadow hover:bg-teal-700 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-semibold"
        >
          Calcular Sumario Estructural ({state.responses.length} respuesta
          {state.responses.length === 1 ? "" : "s"})
        </button>
      </div>
    </div>
  );
}
