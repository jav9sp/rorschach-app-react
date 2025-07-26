import { useState, type Dispatch } from "react";

import {
  inkblots,
  locations,
  devQualities,
  determinants,
  formalQualities,
  // contents,
  // zPoints,
  // specialCodes,
} from "../data/codifications";

import type {
  ProtocolState,
  ProtocolActions,
} from "../reducers/protocol-reducer";
import type { Answer } from "../utils/buildMasterSummary";

type NewProtocolProps = {
  state: ProtocolState | undefined;
  dispatch: Dispatch<ProtocolActions>;
};

export default function NewProtocol({ state, dispatch }: NewProtocolProps) {
  const answerTemplate: Answer = {
    N: 1,
    Texto: "",
    Lam: "",
    Loc: "",
    DQ: "",
    Det: "",
    FQ: "",
    Nivel: 0,
    Par: 0,
    Contenidos: "",
    Populares: "",
    Z: 0,
    "CC.EE.": "",
  };
  const [answer, setAnswer] = useState<Answer>(answerTemplate);
  const [addAnswer, setAddAnswer] = useState(true);
  const [dets, setDets] = useState<string[]>([]);
  // const [conts, setConst] = useState<string[]>([]);
  // const [speCods, setSpeCods] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newAnswer: Answer = {
      ...answerTemplate,
      ...answer,
      N: (state?.responses.length ?? 0) + 1,
    };

    dispatch({ type: "add-response", payload: { answer: newAnswer } });
    setAddAnswer(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-teal-700">Nuevo Protocolo</h1>

      <button onClick={() => setAddAnswer(true)}>Nueva Respuesta</button>

      {addAnswer && (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Texto</label>
            <input
              type="text"
              className="w-full border border-gray-300 p-2 rounded"
              value={answer.Texto}
              onChange={(e) => setAnswer({ ...answer, Texto: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Lam</label>
            <select
              name="Lam"
              id="Lam"
              className="w-full border border-gray-300 p-2 rounded"
              onChange={(e) => setAnswer({ ...answer, Lam: e.target.value })}>
              {inkblots.map((inkBlot) => (
                <option key={inkBlot} value={inkBlot}>
                  Lámina {inkBlot}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Loc</label>
            <select
              name="Loc"
              id="Loc"
              className="w-full border border-gray-300 p-2 rounded"
              onChange={(e) => setAnswer({ ...answer, Loc: e.target.value })}>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">DQ</label>
            <select
              name="DQ"
              id="DQ"
              className="w-full border border-gray-300 p-2 rounded"
              onChange={(e) => setAnswer({ ...answer, DQ: e.target.value })}>
              {devQualities.map((dq) => (
                <option key={dq} value={dq}>
                  {dq}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Det</label>
            <input
              type="text"
              className="w-full border border-gray-300 p-2 rounded"
              value={dets.join(".")}
              readOnly
            />

            <div className="mt-2 flex flex-wrap gap-2">
              {determinants.map((det) => {
                const isChecked = dets.includes(det);
                return (
                  <label key={det} className="relative">
                    <input
                      type="checkbox"
                      className="peer absolute opacity-0 w-0 h-0"
                      checked={isChecked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setDets([...dets, det]);
                        } else {
                          setDets(dets.filter((d) => d !== det));
                        }
                        setAnswer({ ...answer, Det: dets.join(".") });
                      }}
                    />
                    <span className="inline-block w-12 h-10 p-2 text-center rounded border border-gray-300 cursor-pointer select-none peer-checked:bg-blue-500 peer-checked:text-white peer-checked:border-blue-500 transition">
                      {det}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">FQ</label>
            <select
              name="FQ"
              id="FQ"
              className="w-full border border-gray-300 p-2 rounded"
              onChange={(e) => setAnswer({ ...answer, FQ: e.target.value })}>
              {formalQualities.map((fq) => (
                <option key={fq} value={fq}>
                  {fq}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nivel</label>
            <input
              type="number"
              className="w-full border border-gray-300 p-2 rounded"
              value={answer.Nivel}
              onChange={(e) =>
                setAnswer({ ...answer, Nivel: Number(e.target.value) })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Par</label>
            <input
              type="number"
              className="w-full border border-gray-300 p-2 rounded"
              value={answer.Par}
              onChange={(e) =>
                setAnswer({ ...answer, Par: Number(e.target.value) })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contenidos</label>
            <input
              type="text"
              className="w-full border border-gray-300 p-2 rounded"
              value={answer.Contenidos}
              onChange={(e) =>
                setAnswer({ ...answer, Contenidos: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Populares</label>
            <input
              type="text"
              className="w-full border border-gray-300 p-2 rounded"
              value={answer.Populares}
              onChange={(e) =>
                setAnswer({ ...answer, Populares: e.target.value })
              }
            />
          </div>

          {/* <div>
            <label className="block text-sm font-medium mb-1">Z</label>
            <select
              name="Z"
              id="Z"
              className="w-full border border-gray-300 p-2 rounded"
              onChange={(e) => setAnswer({ ...answer, Z: e.target.value })}>
              {zPoints.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </div> */}

          <div>
            <label className="block text-sm font-medium mb-1">CC.EE.</label>
            <input
              type="text"
              className="w-full border border-gray-300 p-2 rounded"
              value={answer["CC.EE."]}
              onChange={(e) =>
                setAnswer({ ...answer, "CC.EE.": e.target.value })
              }
            />
          </div>

          <div className="md:col-span-2">
            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
              Agregar respuesta
            </button>
          </div>
        </form>
      )}

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Respuestas actuales</h2>
        <ul className="list-disc list-inside">
          {state?.responses.map((r) => (
            <li key={r.N}>
              {r.N}. {r.Loc} {r.Lam}
              {r.DQ} {r.Det}
              {r.FQ} {r.Par} {r.Contenidos} {r.Populares} {r.Z} {r["CC.EE."]}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
