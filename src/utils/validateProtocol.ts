import {
  inkblots,
  locations,
  devQualities,
  formalQualities,
} from "../data/codifications";
import type { Answer } from "./buildMasterSummary";

export type ValidationError = { row: number | string; message: string };

const REQUIRED_FIELDS: (keyof Answer)[] = ["Lam", "Loc", "DQ", "Det", "FQ"];

const INKBLOTS_UPPER = inkblots.map((v) => v.toUpperCase());
const LOCATIONS_UPPER = locations.map((v) => v.toUpperCase());
const DQ_LOWER = devQualities.map((v) => v.toLowerCase());
const FQ_LOWER = formalQualities.map((v) => v.toLowerCase());

function isBlank(value: unknown): boolean {
  return value === undefined || value === null || String(value).trim() === "";
}

/**
 * Valida que el protocolo importado desde Excel tenga la forma mínima que
 * el motor de cálculo necesita para producir un Sumario Estructural
 * confiable. No corrige nada: solo detecta y reporta filas problemáticas
 * para poder avisar al usuario antes de calcular en vez de dejar que
 * columnas ausentes se conviertan en ceros silenciosos.
 */
export function validateProtocol(data: Answer[]): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data || data.length === 0) {
    errors.push({
      row: "-",
      message: "El archivo no contiene ninguna respuesta.",
    });
    return errors;
  }

  data.forEach((row, idx) => {
    const rowLabel = row?.N ?? idx + 1;

    REQUIRED_FIELDS.forEach((field) => {
      if (isBlank(row?.[field])) {
        errors.push({
          row: rowLabel,
          message: `Falta la columna "${String(field)}".`,
        });
      }
    });

    if (!isBlank(row.Lam)) {
      const lam = String(row.Lam).trim().toUpperCase();
      if (!INKBLOTS_UPPER.includes(lam)) {
        errors.push({
          row: rowLabel,
          message: `Lámina "${row.Lam}" no reconocida (debe ser I a X).`,
        });
      }
    }

    if (!isBlank(row.Loc)) {
      const loc = String(row.Loc).trim().toUpperCase();
      if (!LOCATIONS_UPPER.includes(loc)) {
        errors.push({
          row: rowLabel,
          message: `Localización "${row.Loc}" no reconocida (valores válidos: ${locations.join(", ")}).`,
        });
      }
    }

    if (!isBlank(row.DQ)) {
      const dq = String(row.DQ).trim().toLowerCase();
      if (!DQ_LOWER.includes(dq)) {
        errors.push({
          row: rowLabel,
          message: `Calidad evolutiva "${row.DQ}" no reconocida (valores válidos: ${devQualities.join(", ")}).`,
        });
      }
    }

    if (!isBlank(row.FQ)) {
      const fq = String(row.FQ).trim().toLowerCase();
      if (!FQ_LOWER.includes(fq)) {
        errors.push({
          row: rowLabel,
          message: `Calidad formal "${row.FQ}" no reconocida (valores válidos: ${formalQualities.join(", ")}).`,
        });
      }
    }
  });

  return errors;
}

export function formatValidationErrors(
  errors: ValidationError[],
  maxShown = 5
): string {
  const shown = errors.slice(0, maxShown);
  const summary = shown
    .map((e) => `Fila ${e.row}: ${e.message}`)
    .join(" · ");
  const rest = errors.length - shown.length;
  return rest > 0
    ? `${summary} · y ${rest} error${rest === 1 ? "" : "es"} más.`
    : summary;
}
