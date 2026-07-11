import { describe, expect, it } from "vitest";
import { calcularDScore, calcularAdjES, calcularAdjD } from "./moduleAdj";
import dScoreTable from "../data/dscore_conversion.json";

describe("calcularDScore", () => {
  // Verifica contra la propia tabla de conversión del repo (src/data/dscore_conversion.json),
  // así el test detecta si el lookup deja de coincidir con la tabla, no solo si cambia un número suelto.
  it.each(Object.entries(dScoreTable))(
    "EA-es = %s -> D score %s (según tabla)",
    (key, expected) => {
      expect(calcularDScore(Number(key))).toBe(expected);
    }
  );

  it("redondea a un decimal antes de buscar en la tabla", () => {
    // 3.04 -> "3" tras toFixed(1) y Number()
    expect(calcularDScore(3.04)).toBe(dScoreTable["3"]);
  });

  it("devuelve 0 si el valor cae fuera del rango de la tabla", () => {
    expect(calcularDScore(999)).toBe(0);
  });
});

describe("calcularAdjES", () => {
  it("resta a es como máximo (m-1) y (SumY-1), nunca más", () => {
    // es=10, m=3 -> ajuste m = max(0, 3-1) = 2; SumY=2 -> ajuste y = max(0, 2-1) = 1
    expect(calcularAdjES({ es: 10, m: 3, SumY: 2 })).toBe(10 - 2 - 1);
  });

  it("no ajusta nada cuando m y SumY son 0 o 1", () => {
    expect(calcularAdjES({ es: 5, m: 1, SumY: 0 })).toBe(5);
    expect(calcularAdjES({ es: 5, m: 0, SumY: 1 })).toBe(5);
  });
});

describe("calcularAdjD", () => {
  it("calcula AdjD como el D score de (EA - Adjes)", () => {
    // EA=10, Adjes=7 -> diferencia 3 -> según la tabla real, D score de 3 es su valor tabulado
    const diferencia = 10 - 7;
    expect(calcularAdjD(10, 7)).toBe(dScoreTable[String(diferencia) as keyof typeof dScoreTable]);
  });
});
