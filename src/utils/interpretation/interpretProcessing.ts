import { inkblots } from "../../data/codifications";
import type { ComparisonMap } from "../../types/NormativeData";
import type { StructuralSummaryData } from "../../types/StructuralSummaryData";
import type { Answer } from "../buildMasterSummary";
import { capitalize } from "../capitalize";
import { genderText } from "./genderText";

export function interpretProcessing(
  answers: Answer[],
  summary: StructuralSummaryData,
  comparisons: ComparisonMap
): string[] {
  const [persona, vocal, articulo] = genderText(summary["Genero"]);
  const interpretaciones: string[] = [];

  // LAMBDA
  const lambda = comparisons["Lambda"];
  if (lambda.COMPARACION === "Marcadamente por encima") {
    interpretaciones.push(
      `${capitalize(
        persona
      )} muestra una marcada tendencia a usar sus recursos de manera económica y sobre simplificar sus percepciones al analizar el campo estimular, evitando las ambigüedades y la incorporación de información emocional, lo que ${articulo} lleva a perder parte importante de la información del medio.`
    );
  } else if (lambda.COMPARACION === "Levemente por encima") {
    interpretaciones.push(
      `${capitalize(
        persona
      )} tiende a usar sus recursos de manera económica y sobre simplificar sus percepciones al analizar el campo estimular, evitando las ambigüedades y la incorporación de información emocional, lo que ${articulo} lleva a perder parte importante de la información del medio.`
    );
  } else if (lambda.COMPARACION === "Dentro del rango") {
    interpretaciones.push(
      `${capitalize(
        persona
      )} es capaz de usar sus recursos cognitivos de manera equilibrada, siendo capaz de simplificar sus percepciones en justa medida, incorporando la información emocional y realizando un registro eficiente de la información del entorno.`
    );
  } else if (lambda.COMPARACION === "Levemente por debajo") {
    interpretaciones.push(
      `${capitalize(
        persona
      )} muestra una tendencia a recopilar demasiados estímulos en su proceso perceptivo, llevándol${vocal} a abrumarse con el exceso de información al no poder simplificar sus percepciones lo suficiente.`
    );
  } else if (lambda.COMPARACION === "Marcadamente por debajo") {
    interpretaciones.push("[PENDIENTE LAMBDA MUY BAJO]");
  }

  if (summary["OBS"] === "Positivo")
    interpretaciones.push("[PENDIENTE OBS POSITIVO]");
  if (summary["HVI"] === "Positivo")
    interpretaciones.push("[PENDIENTE HVI POSITIVO]");

  // Zf
  const zf = comparisons.Zf.COMPARACION;
  const motivacionZf = {
    "Marcadamente por encima": `Su iniciativa y motivación en la tarea de organizar los estímulos del entorno y relacionarlos de manera significativa está muy por encima de lo esperado, por lo que ${persona} realiza un esfuerzo mayor en su procesamiento de información [que puede estar relacionado a características perfeccionistas o un alto rendimiento].`,
    alto: `Su iniciativa y motivación en la tarea de organizar los estímulos del entorno y relacionarlos de manera significativa se encuentra por encima de lo esperado, por lo que ${persona} realiza un alto esfuerzo cognitivo en el procesamiento de información.`,
    normal: `Su iniciativa y motivación en la tarea de organizar los estímulos del entorno y relacionarlos de manera significativa se encuentra dentro de lo esperado, por lo que ${persona} realiza un adecuado esfuerzo cognitivo en el procesamiento de información.`,
    bajo: `Su iniciativa y motivación en la tarea de organizar los estímulos del entorno y relacionarlos de manera significativa es menor a lo esperado, por lo que ${persona} realiza un menor esfuerzo cognitivo en el procesamiento de la información.`,
    "Marcadamente por debajo":
      "Su iniciativa y motivación en la tarea de organizar la información del entorno y relacionarla de manera significativa se encuentra muy por debajo de lo esperado, lo cual [apunta a la presencia de limitaciones cognitivas o un potencial intelectual inhibido por factores emocionales].",
  };

  // TODO: Corregir el mapeo de la motivación
  if (zf && motivacionZf[zf as keyof typeof motivacionZf])
    interpretaciones.push(motivacionZf[zf as keyof typeof motivacionZf]);

  // Estilo de acercamiento
  const r = comparisons["R"];
  const w = comparisons["W"];
  const d = comparisons["D"];
  const dd = comparisons["Dd"];
  interpretaciones.push(
    checkApproach(r.VALOR, w.VALOR, d.VALOR, dd.VALOR, persona)
  );

  // Secuencia de enfoque
  interpretaciones.push(checkSequence(answers, persona));

  // W:M
  const tipoVivencial = summary.TipoVivencial;
  const sumW = summary["W"] ?? 0;
  const sumM = summary["M"] ?? 0;
  interpretaciones.push(checkAmbitionLevel(tipoVivencial, sumW, sumM));

  // Estilo Cognitivo
  const estilo = summary["Estilo Cognitivo"];
  if (estilo === "Dentro del rango") {
    interpretaciones.push(
      "Su estilo de procesamiento es normal, lo que le permite discriminar la información importante de la accesoria al examinar el campo estimular, facilitando su resolución de problemas y toma de decisiones."
    );
  } else if (estilo === "Hipoincorporador") {
    interpretaciones.push(
      "Su estilo cognitivo es hipoincorporador, por lo que no espera a integrar toda la información importante a la hora de resolver problemas, reflejando impulsividad y negligencia en su proceso de toma de decisiones."
    );
  } else if (estilo === "Hiperincorporador") {
    interpretaciones.push(
      "Su estilo cognitivo es hiperincorporador, por lo que tiende a querer recopilar toda la información del entorno sin discriminar aquella importante de la accesoria, llevándole a abrumarse con información y paralizarse al resolver problemas o tomar decisiones."
    );
  }

  if (summary["PSV"]) interpretaciones.push("[PENDIENTE PSV PRESENTE]");

  // DQ
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
  margin = 0.1
): string {
  if (r === 0) return "[ERROR] r no puede ser 0.";

  const wPcge = w / r;
  const dPcge = d / r;
  const ddPcge = dd / r;

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

  const wInRange = withinRange(wPcge, W_LOW, W_HIGH);
  const dInRange = withinRange(dPcge, D_LOW, D_HIGH);
  const ddOk = belowMax(ddPcge, DD_MAX);

  const wHigh = aboveHigh(wPcge, W_HIGH);
  const wLow = belowLow(wPcge, W_LOW);
  const dHigh = aboveHigh(dPcge, D_HIGH);
  const dLow = belowLow(dPcge, D_LOW);
  const ddHigh = aboveMax(ddPcge, DD_MAX);

  const frases: string[] = [];

  // Caso equilibrado
  if (wInRange && dInRange && ddOk) {
    frases.push(
      `muestra un estilo equilibrado de acercamiento a los estímulos, siendo capaz de trabajar tanto de manera global abarcando el conjunto del campo estimular como de forma práctica, identificando con claridad los elementos más evidentes.`
    );
  } else {
    // w alto
    if (wHigh)
      frases.push(
        `presenta un enfoque marcadamente global y abstracto, tendiendo a priorizar la visión de conjunto por encima de los aspectos concretos.`
      );

    // w bajo
    if (wLow)
      frases.push(
        `muestra un nivel bajo de procesamiento global, lo que podría dificultarle integrar el conjunto del estímulo cuando la tarea requiere una visión amplia.`
      );

    // d alto
    if (dHigh)
      frases.push(
        `${persona} tiende a abordar los estímulos de forma muy práctica y focalizada, centrando su atención en lo evidente, lo cual puede restarle capacidad para mantener una perspectiva más global.`
      );

    // d bajo
    if (dLow)
      frases.push(
        `${persona} evidencia un abordaje práctico por debajo de lo esperado, pudiendo mostrar cierta dificultad para identificar los aspectos más operativos o funcionales de los estímulos.`
      );

    // dd alto
    if (ddHigh)
      frases.push(
        `muestra una tendencia a centrarse en detalles poco habituales, lo que refleja un acercamiento muy personal y la pérdida de la visión de conjunto y eficacia práctica.`
      );
    else if (!ddOk)
      frases.push(
        `${persona} muestra una leve tendencia a fijarse en detalles atípicos, aunque sin que ello afecte significativamente su forma general de abordar los estímulos.`
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
      (_, p1, p2) => `${p1} ${p2.toUpperCase()}`
    )
    .trim();

  // Asegura punto final
  if (!texto.endsWith(".")) texto += ".";

  return texto;
}

function checkAmbitionLevel(
  tipoVivencial: string,
  sumW: number,
  sumM: number
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

export function checkSequence(
  answers: Answer[],
  persona: string,
  minPatrones = 2
): string {
  // Mapeo de orden: w (global) > d (práctico) > dd (detalles atípicos)
  const orden = { w: 3, d: 2, dd: 1 } as const;

  // --- Agrupar respuestas por lámina y extraer la secuencia de Loc en orden de aparición ---
  const porLamina = new Map<string, string[]>();
  for (const a of answers) {
    if (!a || !a.Lam) continue;
    const loc = String(a.Loc || "")
      .toLowerCase()
      .trim();
    if (!porLamina.has(a.Lam)) porLamina.set(a.Lam, []);
    porLamina.get(a.Lam)!.push(loc);
  }

  // Filtrar solo láminas con 2+ respuestas (requisito del usuario)
  const laminasEvaluables = [...porLamina.entries()]
    .map(([lam, locs]) => ({ lam, locs }))
    .filter(({ locs }) => locs.length >= 2);

  // Si no hay ninguna lámina con 2+ respuestas, no se puede estimar patrón
  if (laminasEvaluables.length === 0) {
    return `No es posible estimar los patrones de registro de ${persona}, ya que todas las láminas presentan una sola respuesta.`;
  }

  // --- Funciones helper ---
  const toValor = (loc: string): number | null => (orden as any)[loc] ?? null;

  const esMonotonicaConCambio = (valores: number[]): "asc" | "desc" | null => {
    // Determinar dirección por extremos (si son iguales, buscar primer cambio real)
    let dir: "asc" | "desc" | null = null;

    // Buscar primer par con diferencia real para fijar dirección
    for (let i = 1; i < valores.length; i++) {
      if (valores[i] > valores[i - 1]) {
        dir = "asc";
        break;
      } else if (valores[i] < valores[i - 1]) {
        dir = "desc";
        break;
      }
    }
    if (!dir) return null;

    // Verificar consistencia permitiendo repeticiones
    for (let i = 1; i < valores.length; i++) {
      if (dir === "asc" && valores[i] < valores[i - 1]) return null;
      if (dir === "desc" && valores[i] > valores[i - 1]) return null;
    }
    return dir;
  };

  // --- Evaluación por lámina ---
  let patrones = 0;
  const laminasConPatron: { lam: string; dir: "asc" | "desc" }[] = [];

  for (const { lam, locs } of laminasEvaluables) {
    // Convertir a escala numérica; descartar LOC desconocidos
    const valores = locs
      .map((l) => toValor(l))
      .filter((v): v is number => v !== null);

    if (valores.length < 2) {
      // Si al filtrar LOC inválidos quedan <2, no evaluamos esta lámina
      continue;
    }

    const dir = esMonotonicaConCambio(valores);
    if (dir) {
      patrones++;
      laminasConPatron.push({ lam, dir });
    }
  }

  // --- Redacción coherente según resultado ---
  if (patrones >= minPatrones) {
    // Texto con conectores y mayúsculas tras punto
    let texto =
      `Se observa que ${persona} presenta patrones de registro consistentes y metódicos en múltiples láminas, ` +
      `lo que sugiere una forma ordenada y predecible de recopilar la información del entorno. ` +
      `Además, mantiene una dirección secuencial estable (ascendente o descendente) en las láminas con más de una respuesta, ` +
      `lo cual constituye un indicador de eficacia en esta tarea.`;

    // Mayúsculas tras punto (por si concatena en otros contextos)
    texto = texto.replace(
      /([.])\s*([a-záéíóúñ])/g,
      (_, p1, p2) => `${p1} ${p2.toUpperCase()}`
    );
    if (!texto.endsWith(".")) texto += ".";
    return texto;
  } else {
    let texto =
      `No se identifican patrones de registro suficientemente consistentes en las láminas con múltiples respuestas, ` +
      `por lo que ${persona} no evidencia una organización estable y metódica al recoger la información del entorno. ` +
      `Por otro lado, cuando la secuencia no mantiene una dirección clara o se mantiene plana, ` +
      `el registro tiende a perder previsibilidad.`;
    texto = texto.replace(
      /([.])\s*([a-záéíóúñ])/g,
      (_, p1, p2) => `${p1} ${p2.toUpperCase()}`
    );
    if (!texto.endsWith(".")) texto += ".";
    return texto;
  }
}

function groupAnswerSequence(
  answers: Answer[],
  inkblots: string[]
): Record<string, string[]> {
  const groupedSequence: Record<string, string[]> = {};

  // Crear el map con Lam en minúsculas
  const lamMap = new Map<string, string>();
  inkblots.forEach((lam) => {
    groupedSequence[lam] = [];
    lamMap.set(lam.toLowerCase(), lam);
  });

  // Recorrer todas las respuestas
  answers.forEach((ans) => {
    const lamKey = lamMap.get(ans.Lam.toLowerCase());
    if (lamKey) {
      const cleanLoc = ans.Loc.replace("s", ""); // Eliminar la S
      groupedSequence[lamKey].push(cleanLoc);
    }
  });

  return groupedSequence;
}
