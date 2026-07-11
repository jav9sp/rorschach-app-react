import { describe, expect, it } from "vitest";
import { calcularEB_Ratio, calcularEB_EA_EBPer } from "./moduleEB";

describe("calcularEB_Ratio (eb y es)", () => {
  it("calcula eb = FM+m : SumC'+SumT+SumY+SumV y es como su suma", () => {
    const result = calcularEB_Ratio({
      FM: 3,
      m: 1,
      "SumC'": 1,
      SumT: 1,
      SumY: 1,
      SumV: 0,
    });

    expect(result.eb).toBe("4:3");
    expect(result.es).toBe(7);
    expect(result["FM+m"]).toBe(4);
  });

  it("usa 1 como divisor implícito del lado derecho cuando la suma es 0", () => {
    const result = calcularEB_Ratio({
      FM: 2,
      m: 0,
      "SumC'": 0,
      SumT: 0,
      SumY: 0,
      SumV: 0,
    });

    expect(result.eb).toBe("2:1");
    expect(result.es).toBe(3);
  });
});

describe("calcularEB_EA_EBPer", () => {
  it("calcula EA = M + (0.5*FC + 1.0*CF + 1.5*C) y EB = M:SumC ponderada", () => {
    // EA = 4 + (0.5*2 + 1*1 + 1.5*1) = 4 + 3.5 = 7.5
    const result = calcularEB_EA_EBPer(
      { M: 4, FC: 2, CF: 1, C: 1, es: 3 },
      0.5 // Lambda < 1
    );

    expect(result.EB).toBe("4:3.5");
    expect(result.EA).toBe(7.5);
    expect(result["EA-es"]).toBe(4.5);
  });

  it("solo calcula EBPer cuando el estilo vivencial está definido (EA>=4, Lambda<1, diferencia mínima según EA)", () => {
    // EA = 4 + (0.5*3 + 1*2 + 1.5*2) = 4 + 6.5 = 10.5 (>10 -> umbral de diferencia 2.5)
    // |M - SumC| = |4 - 6.5| = 2.5 -> cumple el umbral -> estilo definido
    const definido = calcularEB_EA_EBPer(
      { M: 4, FC: 3, CF: 2, C: 2, es: 0 },
      0.5
    );
    expect(definido.EA).toBe(10.5);
    expect(definido.EBPer).toBe(0.62); // 4 / 6.5 redondeado a 2 decimales
  });

  it("EBPer es 0 cuando el estilo no está definido (Lambda >= 1)", () => {
    const noDefinido = calcularEB_EA_EBPer(
      { M: 5, FC: 0, CF: 0, C: 3, es: 0 },
      1.2 // Lambda >= 1 invalida el estilo definido
    );
    expect(noDefinido.EBPer).toBe(0);
  });

  it("EBPer es 0 cuando SumC ponderada es 0 (evita división por cero)", () => {
    const result = calcularEB_EA_EBPer({ M: 5, FC: 0, CF: 0, C: 0, es: 0 }, 0.2);
    expect(result.EBPer).toBe(0);
  });
});
