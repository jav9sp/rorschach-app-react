import { describe, expect, it } from "vitest";
import { validateProtocol, formatValidationErrors } from "./validateProtocol";
import type { Answer } from "./buildMasterSummary";
import { loadPlantillaProtocol } from "./__fixtures__/loadPlantillaProtocol";

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
  Z: "",
  "CC.EE.": "",
};

describe("validateProtocol", () => {
  it("no reporta errores para el protocolo de ejemplo de la plantilla", () => {
    expect(validateProtocol(loadPlantillaProtocol())).toEqual([]);
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
    expect(errors).toEqual([{ row: 1, message: 'Falta la columna "Loc".' }]);
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
    expect(errors.some((e) => e.message.includes("Localización"))).toBe(true);
  });

  it("reporta una calidad formal (FQ) no reconocida", () => {
    const errors = validateProtocol([{ ...validRow, FQ: "x" }]);
    expect(errors.some((e) => e.message.includes("Calidad formal"))).toBe(true);
  });

  it("acepta valores válidos en minúscula o mayúscula indistintamente", () => {
    const errors = validateProtocol([
      {
        ...validRow,
        Lam: "i",
        Loc: "w",
        DQ: "O".toLowerCase(),
        FQ: "O".toLowerCase(),
      },
    ]);
    expect(errors).toEqual([]);
  });

  it("acepta una categoría Z válida (zw/za/zd/zs)", () => {
    const errors = validateProtocol([{ ...validRow, Z: "zd" }]);
    expect(errors).toEqual([]);
  });

  it("no reporta error cuando Z viene vacío (no toda respuesta tiene actividad organizativa)", () => {
    const errors = validateProtocol([{ ...validRow, Z: "" }]);
    expect(errors).toEqual([]);
  });

  it("rechaza un punto Z numérico ya calculado (convención antigua de la plantilla)", () => {
    const errors = validateProtocol([{ ...validRow, Z: 2.5 }]);
    expect(errors.some((e) => e.message.includes('Z "2.5"'))).toBe(true);
  });

  it("rechaza una categoría Z no reconocida", () => {
    const errors = validateProtocol([{ ...validRow, Z: "zx" }]);
    expect(errors.some((e) => e.message.startsWith('Z "zx"'))).toBe(true);
  });
});

describe("formatValidationErrors", () => {
  it("junta los primeros errores en un solo mensaje legible", () => {
    const msg = formatValidationErrors([
      { row: 1, message: 'Falta la columna "Loc".' },
      { row: 2, message: 'Falta la columna "FQ".' },
    ]);
    expect(msg).toBe(
      'Fila 1: Falta la columna "Loc". · Fila 2: Falta la columna "FQ".',
    );
  });

  it("indica cuántos errores más hay cuando supera el máximo mostrado", () => {
    const errors = Array.from({ length: 7 }, (_, i) => ({
      row: i + 1,
      message: 'Falta la columna "Loc".',
    }));
    const msg = formatValidationErrors(errors, 5);
    expect(msg.endsWith("y 2 errores más.")).toBe(true);
  });
});
