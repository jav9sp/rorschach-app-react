import { describe, expect, it } from "vitest";
import { evaluateCDI } from "./evaluateCDI";

/**
 * Regresión de un bug real encontrado en auditoría: el criterio 1 del CDI
 * ("EA < 6 o AdjD < 0") estaba escrito como
 * `summary["EA"] ?? (0 < 6 || summary["AdjD"]) ?? 0 < 0`. Por precedencia de
 * operadores (`<` liga más fuerte que `??`, así que `0 < 0` se evalúa antes
 * y queda como el fallback final de la cadena `??`), la expresión completa
 * se reducía a `if (summary.EA)`: era verdadera para prácticamente cualquier
 * protocolo real, porque EA casi nunca es exactamente 0. En la práctica el
 * criterio 1 se contaba casi siempre, sobrecontando protocolos hacia CDI
 * positivo en vez de aplicar la condición real "EA < 6 o AdjD < 0".
 */
describe("evaluateCDI — criterio 1 (EA < 6 o AdjD < 0)", () => {
  it("cuenta el criterio 1 cuando EA es bajo (< 6), aunque AdjD sea >= 0", () => {
    const result = evaluateCDI({ EA: 4, AdjD: 0 });
    expect(result.CDICounter).toBeGreaterThanOrEqual(1);
  });

  it("cuenta el criterio 1 cuando AdjD es negativo, aunque EA sea alto", () => {
    const result = evaluateCDI({ EA: 12, AdjD: -1 });
    expect(result.CDICounter).toBeGreaterThanOrEqual(1);
  });

  it("no cuenta el criterio 1 cuando EA >= 6 y AdjD >= 0", () => {
    // Con el resto de condiciones "sanas" (COP/AG bajos alcanza igual el criterio 2),
    // aislamos el efecto fijando valores que no disparan ningún otro criterio.
    const result = evaluateCDI({
      EA: 8,
      AdjD: 0,
      COP: 3,
      AG: 3,
      Afr: 0.6,
      p: 0,
      a: 0,
      H: 3,
    });
    expect(result.CDICounter).toBe(0);
  });
});
