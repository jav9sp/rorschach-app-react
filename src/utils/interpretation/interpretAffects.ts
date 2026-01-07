import type { ComparisonMap } from "../../types/NormativeData";
import type { StructuralSummaryData } from "../../types/StructuralSummaryData";

export function interpretAffects(
  summary: StructuralSummaryData,
  comparisons: ComparisonMap
): string[] {
  const interpretaciones: string[] = [];

  const persona = summary.Genero === "M" ? "el evaluado" : "la evaluada";
  const vocal = persona === "el evaluado" ? "o" : "a";

  const depi = summary.DEPICounter ?? 0;

  if (summary.DEPIText) interpretaciones.push(summary.DEPIText);

  const cdi = summary.CDICounter ?? 0;

  if (depi > 5 && cdi < 4) {
    interpretaciones.push("[PENDIENTE DEPI>5 Y CDI<4]");
  }
  if (depi > 5 && cdi > 3) {
    interpretaciones.push(
      `Que el impacto se observe con mayor fuerza sobre el área socio afectiva, indica que probablemente la depresión de ${persona} es secundaria a sus dificultades para crear y mantener relaciones interpersonales efectivas y gratificantes, por lo que si se tratan estas dificultades podría disminuir también la sintomatología depresiva.`
    );
  }
  if (depi < 6 && cdi > 3) {
    interpretaciones.push(
      `Pese a lo anterior, se observa que ${persona} cuenta con un índice de inhabilidad social positivo, lo que implica múltiples dificultades en la esfera social que pueden generar depresiones secundarias en el mediano o largo plazo.`
    );
  }

  const lambdaEstado = comparisons.Lambda.COMPARACION ?? "Indefinido";
  const tipoVivencial = summary.TipoVivencial ?? "Indefinido";
  const ebper = summary.EBPer ?? 0;

  switch (tipoVivencial) {
    case "Indefinido":
      interpretaciones.push(
        `No se observa suficiente información para determinar el tipo vivencial de ${persona}, por lo tanto, no es posible estimar su estilo de respuesta base a los estímulos del entorno.`
      );
      break;
    case "Introversivo":
      interpretaciones.push(
        "Su tipo vivencial es introversivo, por lo que su respuesta base a los estímulos del entorno es de tipo cognitiva, usa predominantemente la ideación y no procesa emociones mientras resuelve problemas y toma decisiones."
      );
      break;
    case "Extroversivo":
      interpretaciones.push(
        "Su tipo vivencial es extroversivo, por lo que su respuesta base a los estímulos del entorno es de tipo emocional, suele tener intercambios emocionales más espontáneos y el contacto social es fundamental para su funcionamiento general."
      );
      break;
    case "Ambigual":
      interpretaciones.push(
        `Su tipo vivencial es ambigual, por lo que su respuesta base a los estímulos es internamente inconsistente, pudiendo responder de manera racional o emocional a los mismos estímulos de manera impredecible. Esto hace que ${persona} tienda a cometer más errores en la toma de decisiones y sea particularmente vulnerable ante las situaciones de estrés.`
      );
      break;
  }

  if (
    (lambdaEstado === "Levemente por encima" ||
      lambdaEstado === "Marcadamente por encima") &&
    tipoVivencial === "Extroversivo"
  ) {
    interpretaciones.push(
      `Pese a lo anterior, su eficacia emocional no es adecuada, ya que su estilo sobre simplificador l${vocal} sitúa en un estilo evitativo, el cual implica mayor dificultad para diferenciar las características e implicaciones de los contextos emocionales complejos, una baja regulación de la influencia de los afectos en su toma de decisiones y a una falta en la modulación de sus descargas afectivas.`
    );
  }

  if (ebper > 0) {
    interpretaciones.push("[PENDIENTE EBPer PRESENTE]");
  }

  const sumV = comparisons.SumV.COMPARACION ?? "Indefinido";
  const sumT = comparisons.SumT.COMPARACION ?? "Indefinido";
  const sumY = comparisons.SumY.COMPARACION ?? "Indefinido";
  const sumCPrimaEstado = comparisons["SumC'"].COMPARACION ?? "Indefinido";

  if (sumV === "Levemente por encima" || sumV === "Marcadamente por encima") {
    interpretaciones.push(
      `Si bien ${persona} cuenta con capacidad para realizar trabajo de introspección, se observan signos de desvalorización y autocrítica negativa que probablemente se han cronificado con el tiempo y merman su autoestima, aumentando el malestar psíquico.`
    );
  }
  if (sumT === "Levemente por encima" || sumT === "Marcadamente por encima") {
    interpretaciones.push("[PENDIENTE SumT ALTO - MUY ALTO]");
  }
  if (sumY === "Levemente por encima" || sumY === "Marcadamente por encima") {
    interpretaciones.push("[PENDIENTE SumY ALTO - MUY ALTO]");
  }
  if (
    sumCPrimaEstado === "Levemente por encima" ||
    sumCPrimaEstado === "Marcadamente por encima"
  ) {
    interpretaciones.push("[PENDIENTE SumC' ALTO - MUY ALTO]");
  }

  const totCPrima = summary["SumC'"] ?? 0;
  const sumPonC = summary.SumPonC ?? 0;
  const ego = comparisons.Ego.COMPARACION ?? "Indefinido";
  const cop = summary.COP ?? 0;

  if (totCPrima >= sumPonC) {
    interpretaciones.push(
      `En cuanto a la gestión de sus emociones, ${persona} muestra una tendencia a internalizar en lugar de externalizarlas, lo que indica dificultades para iniciar procesos de descarga afectiva de manera deliberada. Esto resulta en una acumulación de tensión interna que puede derivar hacia el cuerpo y dar paso a trastornos psicosomáticos al mediano o largo plazo.`
    );
  } else {
    interpretaciones.push(
      `En cuanto a la gestión de sus emociones, ${persona} muestra capacidad para externalizar según lo esperado, lo que le permite realizar intercambios emocionales y disminuir la acumulación de tensión interna.`
    );
  }

  if (
    totCPrima >= sumPonC &&
    tipoVivencial === "Introversivo" &&
    (ego === "Levemente por encima" || ego === "Marcadamente por encima") &&
    cop < 2
  ) {
    interpretaciones.push("[ALTA PREDICTIVIDAD DE PSICOSOMÁTICOS]");
  }

  const afr = comparisons.Afr.COMPARACION ?? "Indefinido";
  switch (afr) {
    case "Marcadamente por encima":
      interpretaciones.push("[PENDIENTE AFR MUY ALTO]");
      break;
    case "Levemente por encima":
      interpretaciones.push("[PENDIENTE AFR ALTO]");
      break;
    case "Dentro del rango":
      interpretaciones.push(
        `Por otro lado, muestra una adecuada responsividad a la estimulación emocional, por lo que ${persona} tiende a incrementar su productividad en situaciones emocionalmente estimulantes y es más propens${vocal} a buscar estos escenarios, tal como se esperaría. `
      );
      break;
    case "Levemente por debajo":
      interpretaciones.push(
        "Su interés por procesar estímulos afectivos se encuentra bajo lo esperado, por lo que su búsqueda de estimulación emocional es menor a la media y su productividad no aumenta en estos escenarios según lo esperado."
      );
      break;
    case "Marcadamente por debajo":
      interpretaciones.push(
        `Su nivel de interés por procesar estímulos afectivos se encuentra muy por debajo de lo esperado, alcanzando una tendencia a rehuir de la estimulación emocional, lo que indica que ${persona} siente incomodidad ante los afectos y tiende a retraerse socialmente.`
      );
      break;
  }

  const intelec = summary.Intelec ?? 0;
  if (intelec > 3) {
    interpretaciones.push(
      `Se observa que ${persona} tiene una marcada tendencia a recurrir a la racionalización como mecanismo de defensa, que usa para ocultar o negar la presencia de afectos disfóricos, por lo que el abordaje e integración de estas en su funcionamiento psíquico puede llegar a presentar desafíos importantes.`
    );
  }

  const cp = summary.CP ?? 0;
  if (cp > 0) {
    interpretaciones.push("[PENDIENTE CP PRESENTE]");
  }

  const fc = summary.FC ?? 0;
  const cf = summary.CF ?? 0;
  const cPura = summary.C ?? 0;

  if (fc <= cf + cPura && cPura > 0) {
    interpretaciones.push("[PENDIENTE FC<=CF+C Y C Pura > 0]");
  }

  if (fc > (cf + cPura) * 3 || (fc > 0 && cf + cPura === 0)) {
    interpretaciones.push(
      `En cuanto a la espontaneidad de sus descargas afectivas, se observa que ${persona} tiende a sobre controlar sus intercambios afectivos, por lo que no puede relajarse cuando maneja sus emociones. [VERIFICAR RELACIONES INTERPERSONALES E INTEGRAR SI C' ES AUMENTADO]`
    );
  }

  return interpretaciones;
}
