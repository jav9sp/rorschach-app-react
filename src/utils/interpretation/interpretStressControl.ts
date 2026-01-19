import type { ComparisonMap } from "../../types/NormativeData";
import type { StructuralSummaryData } from "../../types/StructuralSummaryData";
import { capitalize } from "../capitalize";
import { genderText } from "./genderText";

export function interpretStressControl(
  summary: StructuralSummaryData,
  comparisons: ComparisonMap,
): string[] {
  const { person, vowel } = genderText(summary["Genero"]);
  const elevated = ["Levemente por encima", "Marcadamente por encima"];

  const interpretaciones: string[] = [];

  // Paso 1: AdjD y CDI
  const adjD = summary.AdjD ?? null;
  const cdi = summary.CDI ?? "Negativo";
  // const edad = variables.Edad ?? null;

  if (adjD === 0) {
    interpretaciones.push(
      `${capitalize(
        person,
      )} cuenta con una adecuada capacidad para controlar y dirigir sus conductas ante las tensiones de la vida cotidiana, por lo que sus controles solo fallarían ante situaciones de estrés intenso, prolongado o inesperado.`,
    );
  }

  if (adjD !== null && adjD > 0) {
    interpretaciones.push(
      `${capitalize(
        person,
      )} cuenta con una capacidad para controlar y dirigir sus conductas ante las tensiones de la vida cotidiana que es mayor a lo esperado, indicando que cuenta con muchos más recursos para manejar los estados de tensión interna y las demandas del entorno.`,
    );
  }

  if (adjD !== null && adjD < 0) {
    interpretaciones.push(
      `Se observa que ${person} no cuenta con una adecuada capacidad para controlar y dirigir sus conductas ante las tensiones de la vida cotidiana, por lo que se encuentra actualmente en un estado de sobrecarga, procesando mayor tensión interna de la que es capaz de manejar.`,
    );
  }

  if (cdi === "Positivo") {
    interpretaciones.push(
      "Dado que cuenta con un índice de inhabilidad social positivo, su capacidad de control se ve muy disminuida en la mayoría de las situaciones socioafectivas, dando paso a conductas similares a las que tendría en situaciones de sobrecarga, por lo que corre un mayor riesgo de desorganización ante situaciones externas complejas.",
    );
  }

  // Paso 2: EA
  const ea = comparisons.EA.COMPARACION;

  switch (ea) {
    case "Marcadamente por encima":
      interpretaciones.push("[PENDIENTE EA MUY ALTO]");
      break;
    case "Levemente por encima":
      interpretaciones.push("[PENDIENTE EA ALTO]");
      break;
    case "Dentro del rango":
      interpretaciones.push(
        `Se observa que cuenta con recursos suficientes para hacer frente a los disparadores de tensión interna, lo que le permite iniciar conductas deliberadas y tomar decisiones frente a estos.`,
      );
      break;
    case "Levemente por debajo":
      interpretaciones.push(
        `Pese a lo anterior, se observa que la cantidad de sus recursos se encuentra levemente disminuida, por lo que independientemente del nivel de tensión interna que ${person} registra actualmente, se encuentra en un estado de vulnerabilidad ante situaciones de estrés, por lo que requiere de un ambiente controlado para funcionar adaptativamente.`,
      );
      break;
    case "Marcadamente por debajo":
      interpretaciones.push(
        `En cuanto a sus recursos disponibles, estos se encuentran muy por debajo de lo esperado, por lo que, independientemente del nivel de tensión interna que ${person} registra actualmente, se encuentra en un estado de vulnerabilidad crónica ante situaciones de estrés, lo que aumenta su necesidad de un ambiente controlado y previsible para funcionar adaptativamente.`,
      );
      break;
  }

  interpretaciones.push("[VERIFICAR CALIDAD DE RECURSOS]");

  // Verificación M y SumPonC
  const sumPonC = summary.SumPonC ?? 0;
  const m = summary.M ?? 0;

  if (m === 0 && sumPonC > 3) {
    interpretaciones.push(
      `Si bien cuenta con recursos para realizar intercambios emocionales, muestra una tendencia a verse abrumad${vowel} por el afecto lo que incide en su pensamiento deliberado dificultando su tarea de demorar la descarga de afectos y focalizar los procesos de atención. Esto resulta en que bajo situaciones de alta estimulación emocional incrementa considerablemente la impulsividad y labilidad de sus controles.`,
    );
  }

  if (m > 3 && sumPonC === 0) {
    interpretaciones.push("[PENDIENTE M>3 Y SumPonC=0]");
  }

  if (m === 0 && sumPonC === 0) {
    interpretaciones.push("[PENDIENTE M=0 Y SumPonC=0]");
  }

  // Paso 3: EB, Lambda y EBPer
  const lambdaEstado = comparisons.Lambda.COMPARACION ?? "Indefinido";
  const tipoVivencial = summary.TipoVivencial ?? "Indefinido";
  const ebper = summary.EBPer ?? 0;

  if (elevated.includes(lambdaEstado)) {
    interpretaciones.push(
      "[EVALUAR POSIBLE LADO EB CERO POR L ALTO Y ESTILO EVITATIVO]",
    );
  }

  if (tipoVivencial === "Extroversivo") {
    interpretaciones.push(
      `Dado que ${person} tiene un tipo vivencial ${tipoVivencial}, [COMPLETAR]`,
    );
  }

  if (tipoVivencial === "Introversivo") {
    interpretaciones.push(
      `Dado que ${person} tiene un tipo vivencial ${tipoVivencial}, responde principalmente de manera ideacional, demorando la toma de decisiones y manteniendo las emociones al margen mientras soluciona problemas.`,
    );
  }

  if (tipoVivencial === "Ambigual") {
    interpretaciones.push(
      `Por otro lado, dado que ${person} tiene un tipo vivencial ${tipoVivencial}, es particularmente vulnerable ante situaciones de estrés debido a la inconsistencia interna de su respuesta ante los estímulos del entorno, volviendo su conducta más errática e imprevisible. `,
    );
  }

  if (ebper > 0) {
    interpretaciones.push("[PENDIENTE EBPer PRESENTE]");
  }

  // Paso 4: es y Adjes
  const valorEs = summary.es ?? 0;
  const nivelEs = comparisons.es.COMPARACION ?? "Indefinido";
  // const nivelAdjEs = estadosSimples.Adjes ?? "Indefinido";

  if (valorEs === 0) {
    interpretaciones.push("[PENDIENTE es = 0]");
  }

  if (elevated.includes(nivelEs)) {
    interpretaciones.push("[PENDIENTE es ELEVADA]");
  }

  // Paso 5: eb y lados
  // const ebIzq = variables["FM+m"] ?? 0;
  // const ebDer = variables.SumSH ?? 0;
  // const eb = variables.eb ?? "";

  interpretaciones.push("[PASO 5: PENDIENTE INTEGRAR VALORES eb]");

  return interpretaciones;
}
