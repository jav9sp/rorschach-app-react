import { describe, expect, it } from "vitest";
import {
  validateProtocol,
  formatValidationErrors,
} from "./validateProtocol";
import type { Answer } from "./buildMasterSummary";
import plantillaProtocol from "./__fixtures__/plantilla-protocol.json";

const validRow: Answer = {
  N: 1,
  Texto: "",
  Lam: "I",
  Loc: "W",
  DQ: "o",
  Det: "F",
  FQ: "o",
  Nivel: 0,
  Par: 0,
  Contenidos: "A",
  Populares: "",
  Z: 0,
  "CC.EE.": "",
};

describe("validateProtocol", () => {
  it("no reporta errores para el protocolo de ejemplo de la plantilla", () => {
    expect(validateProtocol(plantillaProtocol as Answer[])).toEqual([]);
  });

  it("reporta error si el archivo no tiene filas", () => {
    const errors = validateProtocol([]);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toMatch(/no contiene ninguna respuesta/);
  });

  it("reporta las columnas obligatorias ausentes", () => {
    const { Loc, ...rowSinLoc } = validRow;
    void Loc;
    const errors = validateProtocol([rowSinLoc as Answer]);
    expect(errors).toEqual([
      { row: 1, message: 'Falta la columna "Loc".' },
    ]);
  });

  it("reporta una lámina no reconocida", () => {
    const errors = validateProtocol([{ ...validRow, Lam: "XI" }]);
    expect(errors).toContainEqual({
      row: 1,
      message: 'Lámina "XI" no reconocida (debe ser I a X).',
    });
  });

  it("reporta una localización no reconocida", () => {
    const errors = validateProtocol([{ ...validRow, Loc: "Z" }]);
    expect(
      errors.some((e) => e.message.includes("Localización"))
    ).toBe(true);
  });

  it("reporta una calidad formal (FQ) no reconocida", () => {
    const errors = validateProtocol([{ ...validRow, FQ: "x" }]);
    expect(
      errors.some((e) => e.message.includes("Calidad formal"))
    ).toBe(true);
  });

  it("acepta valores válidos en minúscula o mayúscula indistintamente", () => {
    const errors = validateProtocol([
      { ...validRow, Lam: "i", Loc: "w", DQ: "O".toLowerCase(), FQ: "O".toLowerCase() },
    ]);
    expect(errors).toEqual([]);
  });
});

describe("formatValidationErrors", () => {
  it("junta los primeros errores en un solo mensaje legible", () => {
    const msg = formatValidationErrors([
      { row: 1, message: "Falta la columna \"Loc\"." },
      { row: 2, message: "Falta la columna \"FQ\"." },
    ]);
    expect(msg).toBe(
      'Fila 1: Falta la columna "Loc". · Fila 2: Falta la columna "FQ".'
    );
  });

  it("indica cuántos errores más hay cuando supera el máximo mostrado", () => {
    const errors = Array.from({ length: 7 }, (_, i) => ({
      row: i + 1,
      message: "Falta la columna \"Loc\".",
    }));
    const msg = formatValidationErrors(errors, 5);
    expect(msg.endsWith("y 2 errores más.")).toBe(true);
  });
});
