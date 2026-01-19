import type { ComparisonMap } from "../../types/NormativeData";
import type { StructuralSummaryData } from "../../types/StructuralSummaryData";
import { capitalize } from "../capitalize";
import { genderText } from "./genderText";

import type { Answer } from "../buildMasterSummary";
type Direction = "particular_to_general" | "general_to_particular";

export function interpretProcessing(
  answers: Answer[],
  summary: StructuralSummaryData,
  comparisons: ComparisonMap,
): string[] {
  const { person, vowel, article } = genderText(summary["Genero"]);
  const interpretaciones: string[] = [];

  // Requisitos Previos
  // Lambda
  const lambda = comparisons["Lambda"].COMPARACION;

  switch (lambda) {
    case "Marcadamente por encima":
      interpretaciones.push(
        `${capitalize(
          person,
        )} muestra una marcada tendencia a usar sus recursos de manera económica y sobre simplificar sus percepciones al analizar el campo estimular, evitando las ambigüedades y la incorporación de información emocional, lo que ${article} lleva a perder parte importante de la información del medio.`,
      );
      break;
    case "Dentro del rango":
      interpretaciones.push(
        `${capitalize(
          person,
        )} es capaz de usar sus recursos cognitivos de manera equilibrada, siendo capaz de simplificar sus percepciones en justa medida, incorporando la información emocional y realizando un registro eficiente de la información del entorno.`,
      );
      break;
    case "Levemente por debajo":
      interpretaciones.push(
        `${capitalize(
          person,
        )} muestra una tendencia a recopilar demasiados estímulos en su proceso perceptivo, llevándol${vowel} a abrumarse con el exceso de información al no poder simplificar sus percepciones lo suficiente.`,
      );
      break;
    case "Marcadamente por debajo":
      interpretaciones.push("[PENDIENTE LAMBDA MUY BAJO]");
      break;
  }

  if (summary["OBS"] === "Positivo")
    interpretaciones.push("[PENDIENTE OBS POSITIVO]");
  if (summary["HVI"] === "Positivo")
    interpretaciones.push("[PENDIENTE HVI POSITIVO]");

  // Zf
  const zf = comparisons.Zf.COMPARACION;

  switch (zf) {
    case "Marcadamente por encima":
      interpretaciones.push(
        `Su iniciativa y motivación en la tarea de organizar los estímulos del entorno y relacionarlos de manera significativa está muy por encima de lo esperado, por lo que ${person} realiza un esfuerzo mayor en su procesamiento de información [que puede estar relacionado a características perfeccionistas o un alto rendimiento].`,
      );
      break;
    case "Levemente por encima":
      interpretaciones.push(
        `Su iniciativa y motivación en la tarea de organizar los estímulos del entorno y relacionarlos de manera significativa se encuentra por encima de lo esperado, por lo que ${person} realiza un alto esfuerzo cognitivo en el procesamiento de información.`,
      );
      break;
    case "Dentro del rango":
      interpretaciones.push(
        `Su iniciativa y motivación en la tarea de organizar los estímulos del entorno y relacionarlos de manera significativa se encuentra dentro de lo esperado, por lo que ${person} realiza un adecuado esfuerzo cognitivo en el procesamiento de información.`,
      );
      break;
    case "Levemente por debajo":
      interpretaciones.push(
        `Su iniciativa y motivación en la tarea de organizar los estímulos del entorno y relacionarlos de manera significativa es menor a lo esperado, por lo que ${person} realiza un menor esfuerzo cognitivo en el procesamiento de la información.`,
      );
      break;
    case "Marcadamente por debajo":
      interpretaciones.push(
        "Su iniciativa y motivación en la tarea de organizar la información del entorno y relacionarla de manera significativa se encuentra muy por debajo de lo esperado, lo cual [apunta a la presencia de limitaciones cognitivas o un potencial intelectual inhibido por factores emocionales].",
      );
      break;
  }

  // Paso 2: W:D:Dd
  // Estilo de acercamiento
  const r = comparisons["R"];
  const w = comparisons["W"];
  const d = comparisons["D"];
  const dd = comparisons["Dd"];
  interpretaciones.push(
    checkApproach(r.VALOR, w.VALOR, d.VALOR, dd.VALOR, person),
  );

  // TODO: Esta función no calcula bien
  // Secuencia de enfoque
  const { isConsistent, direction } = checkSequenceConsistency(answers);

  if (isConsistent) {
    interpretaciones.push(
      `Se observan patrones de registro consistentes y metódicos en múltiples láminas, lo que sugiere una forma ordenada y predecible de recopilar información del entorno. Además, mantiene una dirección secuencial estable en láminas con más de una respuesta, que va ${direction}, lo cual constituye un indicador de eficacia en esta tarea`,
    );
  } else {
    interpretaciones.push(
      "No se observan patrones metódicos y predecibles en cómo registra la información del entorno, por lo que no es posible afirmar que sea eficaz en dicha tarea.",
    );
  }

  // W:M
  const tipoVivencial = summary.TipoVivencial;
  const sumW = summary["W"] ?? 0;
  const sumM = summary["M"] ?? 0;
  interpretaciones.push(checkAmbitionLevel(tipoVivencial, sumW, sumM));

  // Estilo Cognitivo
  const estilo = summary["Estilo Cognitivo"];
  if (estilo === "Dentro del rango") {
    interpretaciones.push(
      "Su estilo de procesamiento es normal, lo que le permite discriminar la información importante de la accesoria al examinar el campo estimular, facilitando su resolución de problemas y toma de decisiones.",
    );
  } else if (estilo === "Hipoincorporador") {
    interpretaciones.push(
      "Su estilo cognitivo es hipoincorporador, por lo que no espera a integrar toda la información importante a la hora de resolver problemas, reflejando impulsividad y negligencia en su proceso de toma de decisiones.",
    );
  } else if (estilo === "Hiperincorporador") {
    interpretaciones.push(
      "Su estilo cognitivo es hiperincorporador, por lo que tiende a querer recopilar toda la información del entorno sin discriminar aquella importante de la accesoria, llevándole a abrumarse con información y paralizarse al resolver problemas o tomar decisiones.",
    );
  }

  if (summary["PSV"]) interpretaciones.push("[PENDIENTE PSV PRESENTE]");

  // DQ
  const DQo = comparisons.DQo.COMPARACION;
  const DQv = comparisons.DQv.COMPARACION;
  const DQplus = comparisons["DQ+"].COMPARACION;
  // const DQvplus = comparisons["DQv/+"].COMPARACION;

  if (["Marcadamente por encima", "Levemente por encima"].includes(DQo)) {
    interpretaciones.push(`[DQo MUY ALTO]`);
  }
  if (["Marcadamente por encima", "Levemente por encima"].includes(DQv)) {
    interpretaciones.push(`[DQv MUY ALTO]`);
  }
  if (["Marcadamente por encima", "Levemente por encima"].includes(DQplus)) {
    interpretaciones.push("[DQ+ SOBRE LA MEDIA]");
  }
  interpretaciones.push("[PENDIENTE VER CALIDAD DQ]");
  interpretaciones.push("[PENDIENTE VER SECUENCIA DQ]");

  return interpretaciones;
}

export function checkApproach(
  r: number,
  w: number,
  d: number,
  dd: number,
  persona: string,
  margin = 0.1,
): string {
  if (r === 0) return "[ERROR] No hay respuestas.";

  const wPct = w / r;
  const dPct = d / r;
  const ddPct = dd / r;

  const W_LOW = 0.19;
  const W_HIGH = 0.41;
  const D_LOW = 0.49;
  const D_HIGH = 0.71;
  const DD_MAX = 0.07;

  const withinRange = (x: number, low: number, high: number) =>
    x >= low - margin && x <= high + margin;
  const aboveHigh = (x: number, high: number) => x > high + margin;
  const belowLow = (x: number, low: number) => x < low - margin;
  const aboveMax = (x: number, max: number) => x > max + margin;
  const belowMax = (x: number, max: number) => x < max + margin;

  const wInRange = withinRange(wPct, W_LOW, W_HIGH);
  const dInRange = withinRange(dPct, D_LOW, D_HIGH);
  const ddOk = belowMax(ddPct, DD_MAX);

  const wHigh = aboveHigh(wPct, W_HIGH);
  const wLow = belowLow(wPct, W_LOW);
  const dHigh = aboveHigh(dPct, D_HIGH);
  const dLow = belowLow(dPct, D_LOW);
  const ddHigh = aboveMax(ddPct, DD_MAX);

  const frases: string[] = [];

  // Caso equilibrado
  if (wInRange && dInRange && ddOk) {
    frases.push(
      `muestra un estilo equilibrado de acercamiento a los estímulos, siendo capaz de trabajar tanto de manera global abarcando el conjunto del campo estimular como de forma práctica, identificando con claridad los elementos más evidentes.`,
    );
  } else {
    // w alto
    if (wHigh)
      frases.push(
        `presenta un enfoque marcadamente global y abstracto, tendiendo a priorizar la visión de conjunto por encima de los aspectos concretos.`,
      );

    // w bajo
    if (wLow)
      frases.push(
        `muestra un nivel bajo de procesamiento global, lo que podría dificultarle integrar el conjunto del estímulo cuando la tarea requiere una visión amplia.`,
      );

    // d alto
    if (dHigh)
      frases.push(
        `${persona} tiende a abordar los estímulos de forma muy práctica y focalizada, centrando su atención en lo evidente, lo cual puede restarle capacidad para mantener una perspectiva más global.`,
      );

    // d bajo
    if (dLow)
      frases.push(
        `${persona} evidencia un abordaje práctico por debajo de lo esperado, pudiendo mostrar cierta dificultad para identificar los aspectos más operativos o funcionales de los estímulos.`,
      );

    // dd alto
    if (ddHigh)
      frases.push(
        `muestra una tendencia a centrarse en detalles poco habituales, lo que refleja un acercamiento muy personal y la pérdida de la visión de conjunto y eficacia práctica.`,
      );
    else if (!ddOk)
      frases.push(
        `${persona} muestra una leve tendencia a fijarse en detalles atípicos, aunque sin que ello afecte significativamente su forma general de abordar los estímulos.`,
      );
  }

  if (frases.length === 0) return "[FALTA INTERPRETACIÓN W:D:Dd]";

  // === Construcción del texto coherente con conectores ===
  const conectores = ["Además", "Por otro lado", "Asimismo", "Finalmente"];
  let texto = "Su estilo de acercamiento a los estímulos ";

  frases.forEach((frase, i) => {
    if (i === 0) {
      // Primera frase: sin conector
      texto += frase.charAt(0).toLowerCase() + frase.slice(1);
    } else {
      const conector = conectores[Math.min(i - 1, conectores.length - 1)];
      texto += ` ${conector}, ${
        frase.charAt(0).toLowerCase() + frase.slice(1)
      }`;
    }
  });

  // Limpieza y formateo final: mayúsculas tras punto.
  texto = texto
    .replace(/\s+/g, " ")
    .replace(
      /([.])\s*([a-záéíóúñ])/g,
      (_, p1, p2) => `${p1} ${p2.toUpperCase()}`,
    )
    .trim();

  // Asegura punto final
  if (!texto.endsWith(".")) texto += ".";

  return texto;
}

function checkAmbitionLevel(
  tipoVivencial: string,
  sumW: number,
  sumM: number,
): string {
  if (sumW && sumM && sumM > 0) {
    const proporcionReal = sumW / sumM;
    const esperadas = {
      Introversivo: 1.5,
      Ambigual: 2,
      Extroversivo: 3,
      Indefinido: 2,
    };
    const esperada = esperadas[tipoVivencial as keyof typeof esperadas] ?? 2;
    const margen = 1.25;

    if (Math.abs(proporcionReal - esperada) <= margen) {
      return "En cuanto a su ambición intelectual, se muestra adecuada en relación con los recursos creativos, por lo que es capaz de plantearse metas realistas y poner en marcha los recursos suficientes para llevarla a cabo.";
    } else if (proporcionReal > esperada + margen) {
      return "En cuanto a su ambición intelectual, se muestra aumentada en relación con los recursos creativos que dispone para llevarla a cabo, por lo que tiende a plantearse metas poco realistas y a frustrarse en el proceso.";
    } else {
      return "En cuanto a su ambición intelectual, se muestra disminuida en relación con los recursos creativos que dispone para llevarla a cabo, por lo que tiende a plantearse metas conservadoras y más bajas de lo que es capaz de lograr.";
    }
  }
  return "No se cuenta con información suficiente sobre W y M para evaluar la proporción en el contexto del tipo vivencial.";
}

export function checkSequenceConsistency(
  answers: Answer[],
  minResponsesPerLamina = 2,
): { isConsistent: boolean; direction: Direction | null } {
  // Orden: w (global) > d (común) > dd (detalle inusual)
  const order = { w: 3, d: 2, dd: 1 } as const;

  // Normaliza Loc: minúscula, trim, y elimina "s"
  // Ej: "Ws" -> "w", "DdS" -> "dd"
  const normalizeLoc = (loc: unknown): string => {
    return String(loc ?? "")
      .toLowerCase()
      .trim()
      .replace(/s/g, ""); // omite 's' donde aparezca
  };

  const toValue = (loc: string): number | null => {
    return (order as Record<string, number>)[loc] ?? null;
  };

  const monotonicDirection = (values: number[]): "asc" | "desc" | null => {
    // Encuentra primer cambio real para fijar dirección
    let dir: "asc" | "desc" | null = null;

    for (let i = 1; i < values.length; i++) {
      if (values[i] > values[i - 1]) {
        dir = "asc";
        break;
      }
      if (values[i] < values[i - 1]) {
        dir = "desc";
        break;
      }
    }
    if (!dir) return null; // nunca cambió

    // Verifica que sea monótona (permitiendo repeticiones)
    for (let i = 1; i < values.length; i++) {
      if (dir === "asc" && values[i] < values[i - 1]) return null;
      if (dir === "desc" && values[i] > values[i - 1]) return null;
    }
    return dir;
  };

  // Agrupar por lámina manteniendo orden de aparición
  const perLamina = new Map<string, string[]>();
  for (const a of answers) {
    if (!a?.Lam) continue;
    const lam = String(a.Lam).toUpperCase().trim();
    const loc = normalizeLoc(a.Loc);
    if (!perLamina.has(lam)) perLamina.set(lam, []);
    perLamina.get(lam)!.push(loc);
  }

  // Solo láminas con 2+ respuestas
  const candidates = [...perLamina.entries()]
    .map(([lam, locs]) => ({ lam, locs }))
    .filter(({ locs }) => locs.length >= minResponsesPerLamina);

  // Recolecta la dirección por lámina (solo si hay cambios y se puede evaluar)
  const dirs: ("asc" | "desc")[] = [];

  for (const { locs } of candidates) {
    // Convierte a valores, descartando locs desconocidas
    const values = locs
      .map((l) => toValue(l))
      .filter((v): v is number => v !== null);

    if (values.length < 2) continue;

    // Exigir cambio real de localización (si todo igual, se omite)
    const hasRealChange = values.some((v, i) => i > 0 && v !== values[i - 1]);
    if (!hasRealChange) continue;

    const dir = monotonicDirection(values);
    if (dir) dirs.push(dir);
  }

  // Si no hay láminas evaluables, no se puede afirmar consistencia
  if (dirs.length === 0) {
    return { isConsistent: false, direction: null };
  }

  // Consistente si todas tienen la misma dirección
  const allSame = dirs.every((d) => d === dirs[0]);
  if (!allSame) {
    return { isConsistent: false, direction: null };
  }

  const direction: Direction =
    dirs[0] === "asc" ? "particular_to_general" : "general_to_particular";

  return { isConsistent: true, direction };
}
