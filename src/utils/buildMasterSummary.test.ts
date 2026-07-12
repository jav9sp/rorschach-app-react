import { describe, expect, it } from "vitest";
import { buildMasterSummary } from "./buildMasterSummary";
import { loadPlantillaProtocol } from "./__fixtures__/loadPlantillaProtocol";

/**
 * IMPORTANTE — qué es y qué no es este test:
 *
 * Este test corre buildMasterSummary sobre el Excel real que la app
 * distribuye (`public/plantilla.xlsx`, leído vía loadPlantillaProtocol()).
 * No es un protocolo validado por un clínico frente al Sumario Estructural
 * esperado — es un snapshot de REGRESIÓN: congela el resultado actual para
 * que cualquier cambio futuro en el motor de cálculo muestre un diff
 * explícito en vez de romperse en silencio.
 *
 * La primera vez que corra este test se generará el snapshot en
 * `__snapshots__/buildMasterSummary.test.ts.snap`. Antes de confiar en él como
 * referencia clínica, alguien con criterio profesional (el propio autor del
 * proyecto) debería revisar esos valores una vez. Si en algún punto se cuenta
 * con protocolos ya corregidos a mano, conviene reemplazar este snapshot por
 * aserciones explícitas sobre esos valores conocidos (ver los tests de
 * moduleBasicos/moduleEB/moduleAdj/moduleZScore para el patrón).
 */
describe("buildMasterSummary — snapshot de regresión", () => {
  it("procesa el protocolo de ejemplo de la plantilla sin lanzar errores", () => {
    const plantillaProtocol = loadPlantillaProtocol();
    expect(() => buildMasterSummary(plantillaProtocol, 30, "M")).not.toThrow();
  });

  it("mantiene estable el Sumario Estructural del protocolo de ejemplo", () => {
    const plantillaProtocol = loadPlantillaProtocol();
    const summary = buildMasterSummary(plantillaProtocol, 30, "M");
    expect(summary).toMatchSnapshot();
  });
});
