import { describe, expect, it } from "vitest";
import {
  calcularR,
  calcularLambda,
  calcularDetsResumidos,
  sumarDeterminantes,
} from "./moduleBasicos";

describe("calcularR", () => {
  it("cuenta el total de respuestas (R)", () => {
    expect(calcularR([{}, {}, {}])).toEqual({ R: 3 });
  });

  it("devuelve 0 para un protocolo vacío", () => {
    expect(calcularR([])).toEqual({ R: 0 });
  });
});

describe("calcularLambda", () => {
  it("calcula Lambda = F / (R - F)", () => {
    // R = 20, F puras = 5 -> 5 / (20 - 5) = 0.33
    const data = new Array(20).fill({});
    expect(calcularLambda(data, { F: 5 })).toEqual({ Lambda: 0.33 });
  });

  it("evita división por cero cuando R === F (protocolo de puras F)", () => {
    const data = new Array(4).fill({});
    // R - F = 0 -> se usa 1 como divisor
    expect(calcularLambda(data, { F: 4 })).toEqual({ Lambda: 4 });
  });

  it("da Lambda 0 cuando no hay respuestas F puras", () => {
    const data = new Array(10).fill({});
    expect(calcularLambda(data, {})).toEqual({ Lambda: 0 });
  });
});

describe("sumarDeterminantes", () => {
  it("suma solo las claves indicadas", () => {
    const dict = { F: 5, M: 2, FM: 3 };
    expect(sumarDeterminantes(dict, ["M", "FM"])).toBe(5);
  });

  it("ignora claves ausentes en el diccionario", () => {
    expect(sumarDeterminantes({ F: 5 }, ["M", "FM"])).toBe(0);
  });
});

describe("calcularDetsResumidos", () => {
  it("agrupa correctamente SumC', SumT, SumV y SumY", () => {
    const dict = {
      "FC'": 1,
      "C'F": 1,
      "C'": 1,
      FT: 2,
      TF: 0,
      T: 0,
      FV: 1,
      VF: 0,
      V: 0,
      FY: 1,
      YF: 1,
      Y: 1,
    };
    expect(calcularDetsResumidos(dict)).toEqual({
      "SumC'": 3,
      SumT: 2,
      SumV: 1,
      SumY: 3,
    });
  });

  it("devuelve 0 en todas las sumas para un diccionario vacío", () => {
    expect(calcularDetsResumidos({})).toEqual({
      "SumC'": 0,
      SumT: 0,
      SumV: 0,
      SumY: 0,
    });
  });
});
