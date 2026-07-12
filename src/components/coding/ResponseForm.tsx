import { useState, type FormEvent } from "react";
import {
  locations,
  devQualities,
  determinants,
  formalQualities,
  contents,
  specialCodes,
} from "../../data/codifications";
import { Z_CATEGORY_CODES, type ZCategoryCode } from "../../utils/moduleZScore";
import ChipToggleGroup from "./ChipToggleGroup";
import type { Answer } from "../../utils/buildMasterSummary";

type ResponseFormProps = {
  lamina: string;
  onAdd: (answer: Omit<Answer, "N">) => void;
};

const emptyDraft = {
  Texto: "",
  Loc: "",
  DQ: "",
  det: [] as string[],
  FQ: "",
  Nivel: "" as number | "",
  parDoble: false,
  contenidos: [] as string[],
  esPopular: false,
  zCategoria: "" as ZCategoryCode | "",
  ccee: [] as string[],
};

export default function ResponseForm({ lamina, onAdd }: ResponseFormProps) {
  const [draft, setDraft] = useState(emptyDraft);

  const canSubmit = Boolean(
    draft.Loc && draft.DQ && draft.det.length > 0 && draft.FQ,
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    onAdd({
      Texto: draft.Texto,
      Lam: lamina,
      Loc: draft.Loc,
      DQ: draft.DQ,
      Det: draft.det.join("."),
      FQ: draft.FQ,
      Nivel: draft.Nivel === "" ? 0 : draft.Nivel,
      Par: draft.parDoble ? 2 : 0,
      Contenidos: draft.contenidos.join(","),
      Populares: draft.esPopular ? "p" : "",
      Z: draft.zCategoria,
      "CC.EE.": draft.ccee.join(","),
    });

    setDraft(emptyDraft);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h3 className="font-semibold text-gray-700">
        Agregar respuesta — Lámina {lamina}
      </h3>

      <div>
        <label
          htmlFor="texto"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          ¿Qué respondió? (opcional)
        </label>
        <textarea
          id="texto"
          rows={2}
          value={draft.Texto}
          onChange={(e) => setDraft({ ...draft, Texto: e.target.value })}
          className="w-full border border-gray-300 rounded p-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="loc"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Localización
          </label>
          <select
            id="loc"
            value={draft.Loc}
            onChange={(e) => setDraft({ ...draft, Loc: e.target.value })}
            className="w-full border border-gray-300 rounded p-2"
          >
            <option value="">Seleccionar...</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="dq"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Calidad evolutiva (DQ)
          </label>
          <select
            id="dq"
            value={draft.DQ}
            onChange={(e) => setDraft({ ...draft, DQ: e.target.value })}
            className="w-full border border-gray-300 rounded p-2"
          >
            <option value="">Seleccionar...</option>
            {devQualities.map((dq) => (
              <option key={dq} value={dq}>
                {dq}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="fq"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Calidad formal (FQ)
          </label>
          <select
            id="fq"
            value={draft.FQ}
            onChange={(e) => {
              const fq = e.target.value;
              setDraft({
                ...draft,
                FQ: fq,
                // Nivel solo aplica a respuestas con FQ- (distorsionadas)
                Nivel: fq === "-" ? draft.Nivel : "",
              });
            }}
            className="w-full border border-gray-300 rounded p-2"
          >
            <option value="">Seleccionar...</option>
            {formalQualities.map((fq) => (
              <option key={fq} value={fq}>
                {fq}
              </option>
            ))}
          </select>
        </div>

        {draft.FQ === "-" && (
          <div>
            <label
              htmlFor="nivel"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nivel
            </label>
            <input
              id="nivel"
              type="number"
              value={draft.Nivel}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  Nivel: e.target.value === "" ? "" : Number(e.target.value),
                })
              }
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>
        )}
      </div>

      <ChipToggleGroup
        label="Determinantes"
        options={determinants}
        selected={draft.det}
        onChange={(det) => setDraft({ ...draft, det })}
      />

      <ChipToggleGroup
        label="Contenidos"
        options={contents}
        selected={draft.contenidos}
        onChange={(contenidos) => setDraft({ ...draft, contenidos })}
      />

      <ChipToggleGroup
        label="Códigos especiales"
        options={specialCodes}
        selected={draft.ccee}
        onChange={(ccee) => setDraft({ ...draft, ccee })}
      />

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={draft.parDoble}
            onChange={(e) => setDraft({ ...draft, parDoble: e.target.checked })}
          />
          Par
        </label>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={draft.esPopular}
            onChange={(e) =>
              setDraft({ ...draft, esPopular: e.target.checked })
            }
          />
          Popular
        </label>
      </div>

      <div>
        <span className="block text-sm font-medium text-gray-700 mb-1">
          Actividad organizativa (Z)
        </span>
        <div className="flex flex-wrap gap-4">
          {Z_CATEGORY_CODES.map((code) => (
            <label
              key={code}
              className="flex items-center gap-2 text-sm text-gray-700"
            >
              <input
                type="checkbox"
                checked={draft.zCategoria === code}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    zCategoria: e.target.checked ? code : "",
                  })
                }
              />
              {code.toUpperCase()}
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-semibold"
      >
        Agregar respuesta
      </button>
    </form>
  );
}
