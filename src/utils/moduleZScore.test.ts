import { describe, expect, it } from "vitest";
import { calcularZScore, puntajesPorLaminaYCodigo } from "./moduleZScore";
import zestData from "../data/zscore_conversion.json";

/**
 * Regresión de un bug real encontrado en auditoría: buildMasterSummary
 * alimentaba esta función con el valor NUMÉRICO de Z ya calculado (como
 * trae la plantilla Excel histórica: 1, 2.5, 4.5…), pero calcularZScore
 * espera un código de categoría ("zw"/"za"/"zd"/"zs") para buscar el punto
 * en `puntajesPorLaminaYCodigo`. Un número como "2.5" nunca coincide con
 * esas claves, así que la búsqueda fallaba en silencio para TODO protocolo
 * cargado siguiendo la plantilla oficial: Zf=0, Zsum=0, Zest=null, Zd=null,
 * "Estilo Cognitivo" siempre "No interpretable". La convención correcta,
 * la que usa esta función, es la categoría — por eso se corrigió la
 * plantilla y el flujo de carga para usar zw/za/zd/zs.
 */
describe("calcularZScore", () => {
  it("suma los puntos Z de la tabla según lámina y categoría (zw/za/zd/zs)", () => {
    const laminas = ["I", "I", "II"];
    const codigos = ["zw", "za", "zd"];

    const result = calcularZScore(laminas, codigos);

    const esperado =
      puntajesPorLaminaYCodigo.I.zw +
      puntajesPorLaminaYCodigo.I.za +
      puntajesPorLaminaYCodigo.II.zd;

    expect(result.Zf).toBe(3);
    expect(result.Zsum).toBeCloseTo(esperado, 5);
  });

  it("ignora respuestas sin lámina o sin código Z (no puntúan Z)", () => {
    const result = calcularZScore(
      ["I", null, "II", undefined],
      ["zw", "za", null, "zd"],
    );
    expect(result.Zf).toBe(1);
    expect(result.Zsum).toBe(puntajesPorLaminaYCodigo.I.zw);
  });

  it("es insensible a mayúsculas tanto en lámina como en código", () => {
    const result = calcularZScore(["i"], ["ZW"]);
    expect(result.Zf).toBe(1);
    expect(result.Zsum).toBe(puntajesPorLaminaYCodigo.I.zw);
  });

  it("un valor numérico crudo (convención antigua de la plantilla) no matchea ninguna categoría y no puntúa", () => {
    const result = calcularZScore(["I"], [2.5]);
    expect(result.Zf).toBe(0);
    expect(result.Zsum).toBe(0);
    expect(result.Zest).toBeNull();
    expect(result.Zd).toBeNull();
  });

  it("calcula Zest desde la tabla de conversión y Zd = Zsum - Zest", () => {
    // 3 respuestas con Z -> Zf=3 -> Zest según la propia tabla del repo
    const laminas = ["I", "I", "I"];
    const codigos = ["zw", "za", "zd"]; // 1.0 + 4.0 + 6.0 = 11.0
    const result = calcularZScore(laminas, codigos);

    expect(result.Zf).toBe(3);
    expect(result.Zest).toBe(zestData["3"]);
    expect(result.Zd).toBe(Number((11.0 - zestData["3"]).toFixed(2)));
  });

  it("clasifica el Estilo Cognitivo como Hiperincorporador cuando Zd > 3.5", () => {
    // Zf=1 -> Zest = zestData["1"] = 0; con un punto Z alto, Zd = Zsum - 0 > 3.5
    const result = calcularZScore(["VI"], ["zd"]); // VI.zd = 6.0
    expect(result.Zd).toBeGreaterThan(3.5);
    expect(result["Estilo Cognitivo"]).toBe("Hiperincorporador");
  });

  it("da 'No interpretable' cuando no hay ninguna respuesta con Z (Zf=0)", () => {
    const result = calcularZScore([], []);
    expect(result.Zf).toBe(0);
    expect(result.Zest).toBeNull();
    expect(result.Zd).toBeNull();
    expect(result["Estilo Cognitivo"]).toBe("No interpretable");
  });
});
