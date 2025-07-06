// utils/moduleDeterminantes.ts

/**
 * Conteo general de determinantes.
 */
export interface ConteoDeterminantes {
  [key: string]: number;
}

/**
 * Conteo de subíndices de movimiento (a/p).
 */
export interface ConteoSubindices {
  a: number;
  p: number;
}

/**
 * Intereses: número de categorías de determinantes.
 */
export interface Intereses {
  Intereses: number;
}

/**
 * Cuenta determinantes y subíndices de movimiento.
 * Clasifica M por calidad formal.
 *
 * @param columnaDet Array de determinantes codificados
 * @param columnaFQ  Array de calidades formales
 * @returns [conteoGeneral, conteoSubindices, intereses]
 */
export function contarDeterminantes(
  columnaDet: (string | null | undefined)[],
  columnaFQ: (string | null | undefined)[]
): {
  resumenDeterminantes: ConteoDeterminantes;
  resumenSubindices: ConteoSubindices;
  detCompljs: string[];
  categorias: Intereses;
} {
  const conteoGeneral: ConteoDeterminantes = {
    F: 0,
    M: 0,
    FM: 0,
    m: 0,
    C: 0,
    CF: 0,
    FC: 0,
    "C'": 0,
    "C'F": 0,
    "FC'": 0,
    T: 0,
    TF: 0,
    FT: 0,
    V: 0,
    VF: 0,
    FV: 0,
    Y: 0,
    YF: 0,
    FY: 0,
    FD: 0,
    rF: 0,
    Fr: 0,
    "MQ+": 0,
    MQo: 0,
    MQu: 0,
    "MQ-": 0,
    MQsin: 0,
  };

  const conteoSubindices: ConteoSubindices = {
    a: 0,
    p: 0,
  };

  let detCompljs: string[] = [];

  for (let i = 0; i < columnaDet.length; i++) {
    const detRaw = columnaDet[i];
    const fqRaw = columnaFQ[i];
    if (!detRaw || !fqRaw) continue;

    if (detRaw.includes(".")) {
      detCompljs.push(detRaw);
    }

    let tieneM = false;

    const valores = detRaw.split(".");
    for (let valor of valores) {
      valor = valor.trim();
      if (!valor) continue;

      // Buscar índice del primer sufijo (a, p, ap, pa)
      const sufijos = ["ap", "pa", "a", "p"];
      let idx = valor.length;
      for (const suf of sufijos) {
        const pos = valor.indexOf(suf);
        if (pos !== -1 && pos < idx) idx = pos;
      }

      const base = valor.substring(0, idx);
      const sufijo = valor.substring(idx).toLowerCase();

      // Aumentar conteo de base
      if (base) {
        conteoGeneral[base] = (conteoGeneral[base] || 0) + 1;
      }

      // Subíndices
      if (sufijo.includes("a")) conteoSubindices.a += 1;
      if (sufijo.includes("p")) conteoSubindices.p += 1;

      if (base === "M") tieneM = true;
    }

    // Clasificación MQ
    if (tieneM) {
      const fq = fqRaw.toLowerCase().trim();
      if (fq === "+") conteoGeneral["MQ+"] += 1;
      else if (fq === "o") conteoGeneral["MQo"] += 1;
      else if (fq === "u") conteoGeneral["MQu"] += 1;
      else if (fq === "-") conteoGeneral["MQ-"] += 1;
      else conteoGeneral["MQsin"] += 1;
    }
  }

  // Contar categorías presentes (> 0)
  const categoriasCount = Object.values(conteoGeneral).filter(
    (v) => v > 0
  ).length;
  const intereses: Intereses = { Intereses: categoriasCount };

  return {
    resumenDeterminantes: conteoGeneral,
    resumenSubindices: conteoSubindices,
    detCompljs,
    categorias: intereses,
  };
}
