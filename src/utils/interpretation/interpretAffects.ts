import type { ComparisonMap } from "../../types/NormativeData";
import type { StructuralSummaryData } from "../../types/StructuralSummaryData";
import { genderText } from "./genderText";

export function interpretAffects(
  summary: StructuralSummaryData,
  comparisons: ComparisonMap,
): string[] {
  const { person, vowel } = genderText(summary["Genero"]);

  const interpretaciones: string[] = [];

  const elevated = ["Levemente por encima", "Marcadamente por encima"];

  // Paso 1: DEPI y CDI
  const depi = summary.DEPICounter ?? 0;
  const cdi = summary.CDICounter ?? 0;

  if (summary.DEPIText) interpretaciones.push(summary.DEPIText);

  if (depi > 5 && cdi < 4) {
    interpretaciones.push("[PENDIENTE DEPI>5 Y CDI<4]");
  }
  if (depi > 5 && cdi > 3) {
    interpretaciones.push(
      `Que el impacto se observe con mayor fuerza sobre el área socio afectiva, indica que probablemente la depresión de ${person} es secundaria a sus dificultades para crear y mantener relaciones interpersonales efectivas y gratificantes, por lo que si se tratan estas dificultades podría disminuir también la sintomatología depresiva.`,
    );
  }
  if (depi < 6 && cdi > 3) {
    interpretaciones.push(
      `Pese a lo anterior, se observa que ${person} cuenta con un índice de inhabilidad social positivo, lo que implica múltiples dificultades en la esfera social que pueden generar depresiones secundarias en el mediano o largo plazo.`,
    );
  }

  // Paso 2: Lambda, EB extratensivo y EBPer
  const lambdaComp = comparisons.Lambda.COMPARACION ?? "Indefinido";
  const tipoVivencial = summary.TipoVivencial ?? "Indefinido";
  const ebper = summary.EBPer ?? 0;

  switch (tipoVivencial) {
    case "Indefinido":
      interpretaciones.push(
        `No se observa suficiente información para determinar el tipo vivencial de ${person}, por lo tanto, no es posible estimar su estilo de respuesta base a los estímulos del entorno.`,
      );
      break;
    case "Introversivo":
      interpretaciones.push(
        "Su tipo vivencial es introversivo, por lo que su respuesta base a los estímulos del entorno es de tipo cognitiva, usa predominantemente la ideación y no procesa emociones mientras resuelve problemas y toma decisiones.",
      );
      break;
    case "Extroversivo":
      interpretaciones.push(
        "Su tipo vivencial es extroversivo, por lo que su respuesta base a los estímulos del entorno es de tipo emocional, suele tener intercambios emocionales más espontáneos y el contacto social es fundamental para su funcionamiento general.",
      );
      break;
    case "Ambigual":
      interpretaciones.push(
        `Su tipo vivencial es ambigual, por lo que su respuesta base a los estímulos es internamente inconsistente, pudiendo responder de manera racional o emocional a los mismos estímulos de manera impredecible. Esto hace que ${person} tienda a cometer más errores en la toma de decisiones y sea particularmente vulnerable ante las situaciones de estrés.`,
      );
      break;
  }

  if (elevated.includes(lambdaComp) && tipoVivencial === "Extroversivo") {
    interpretaciones.push(
      `Pese a lo anterior, su eficacia emocional no es adecuada, ya que su estilo sobre simplificador l${vowel} sitúa en un estilo evitativo, el cual implica mayor dificultad para diferenciar las características e implicaciones de los contextos emocionales complejos, una baja regulación de la influencia de los afectos en su toma de decisiones y a una falta en la modulación de sus descargas afectivas.`,
    );
  }

  if (ebper > 0) {
    interpretaciones.push("[PENDIENTE EBPer PRESENTE]");
  }

  // Paso 3: Análisis del lado derecho de la eb
  const vComp = comparisons.SumV.COMPARACION;
  const tComp = comparisons.SumT.COMPARACION;
  const yComp = comparisons.SumY.COMPARACION;
  const cPrimaComp = comparisons["SumC'"].COMPARACION;

  if (elevated.includes(vComp)) {
    interpretaciones.push(
      `Si bien ${person} cuenta con capacidad para realizar trabajo de introspección, se observan signos de desvalorización y autocrítica negativa que probablemente se han cronificado con el tiempo y merman su autoestima, aumentando el malestar psíquico.`,
    );
  }
  if (elevated.includes(tComp)) {
    interpretaciones.push(
      `Sus necesidades de cercanía y contacto emocional se encuentran elevadas, por lo que ${person} experimenta malestar que deriva de un registro más intenso de los sentimientos de soledad, llevándolo a depender más de la presencia afectiva de otros.`,
    );
  }
  if (elevated.includes(yComp)) {
    interpretaciones.push(
      `Se observa que ${person} presenta un intenso malestar emocional vinculado a el efecto de situaciones externas que generan tensión. Esto la lleva a experimentar sentimientos de indefensión y desvalimiento, situándola en un estado de parálisis afectiva y latente desborde.`,
    );
  }
  if (elevated.includes(cPrimaComp)) {
    interpretaciones.push(
      `Muestra un aumento significativo en el registro de afectos disfóricos que son internalizados. La evaluada tiende a reprimir estos afectos de manera inconsciente, aumentando su tensión interna, lo que puede derivar en trastornos psicosomáticos al largo plazo`,
    );
  }

  // Paso 4: SumC' y SumPonC
  const totCPrima = summary["SumC'"] ?? 0;
  const sumPonC = summary.SumPonC ?? 0;
  const ego = comparisons.Ego.COMPARACION;
  const cop = summary.COP ?? 0;

  if (totCPrima >= sumPonC) {
    interpretaciones.push(
      `En cuanto a la gestión de sus emociones, ${person} muestra una tendencia a internalizar en lugar de externalizarlas, lo que indica dificultades para iniciar procesos de descarga afectiva de manera deliberada. Esto resulta en una acumulación de tensión interna que puede derivar hacia el cuerpo y dar paso a trastornos psicosomáticos al mediano o largo plazo.`,
    );
  } else {
    interpretaciones.push(
      `En cuanto a la gestión de sus emociones, ${person} muestra capacidad para externalizar según lo esperado, lo que le permite realizar intercambios emocionales y disminuir la acumulación de tensión interna.`,
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

  // Verificar presencia de Contenidos Críticos
  const sx = summary.Sx ?? 0;
  const bl = summary.Bl ?? 0;
  const cl = summary.Cl ?? 0;

  if (sx > 0) interpretaciones.push("[INTEGRAR PRESENCIA DE Sx]");
  if (bl > 0) interpretaciones.push("[INTEGRAR PRESENCIA DE Bl]");
  if (cl > 0) interpretaciones.push("[INTEGRAR PRESENCIA DE Cl]");

  // Paso 5: Proporción Afectiva AFR
  const afr = comparisons.Afr.COMPARACION;
  switch (afr) {
    case "Marcadamente por encima":
      interpretaciones.push(
        `Respecto a su responsividad a la estimulación emocional, se observa una sensibilidad mayor a lo esperado, lo que indica que ${person} tiene un mayor interés en la emocionalidad, aumentando la frecuencia de demandas e intercambios. Esto conlleva la posibilidad de que surjan problemas de descontrol o falta de modulación en las descargas afectivas.`,
      );
      break;
    case "Levemente por encima":
      interpretaciones.push("[PENDIENTE AFR ALTO]");
      break;
    case "Dentro del rango":
      interpretaciones.push(
        `Por otro lado, muestra una adecuada responsividad a la estimulación emocional, por lo que ${person} tiende a incrementar su productividad en situaciones emocionalmente estimulantes y es más propens${vowel} a buscar estos escenarios, tal como se esperaría. `,
      );
      break;
    case "Levemente por debajo":
      interpretaciones.push(
        "Su interés por procesar estímulos afectivos se encuentra bajo lo esperado, por lo que su búsqueda de estimulación emocional es menor a la media y su productividad no aumenta en estos escenarios según lo esperado.",
      );
      break;
    case "Marcadamente por debajo":
      interpretaciones.push(
        `Su nivel de interés por procesar estímulos afectivos se encuentra muy por debajo de lo esperado, alcanzando una tendencia a rehuir de la estimulación emocional, lo que indica que ${person} siente incomodidad ante los afectos y tiende a retraerse socialmente.`,
      );
      break;
  }

  // Índice de Intelectualización
  const intelec = summary.Intelec ?? 0;
  if (intelec > 3) {
    interpretaciones.push(
      `Se observa que ${person} tiene una marcada tendencia a recurrir a la racionalización como mecanismo de defensa, que usa para ocultar o negar la presencia de afectos disfóricos, por lo que el abordaje e integración de estas en su funcionamiento psíquico puede llegar a presentar desafíos importantes.`,
    );
  }

  // Paso 7: Proyección de Color CP
  const cp = summary.CP ?? 0;
  if (cp > 0) {
    interpretaciones.push("[PENDIENTE CP PRESENTE]");
  }

  // Paso 8: Proporción Forma-Color y Presencia de C Pura
  const fc = summary.FC ?? 0;
  const cf = summary.CF ?? 0;
  const cPura = summary.C ?? 0;

  if (fc <= cf + cPura && cPura > 0) {
    interpretaciones.push("[PENDIENTE FC<=CF+C Y C Pura > 0]");
  }

  if (fc > (cf + cPura) * 3 || (fc > 0 && cf + cPura === 0)) {
    interpretaciones.push(
      `En cuanto a la espontaneidad de sus descargas afectivas, se observa que ${person} tiende a sobre controlar sus intercambios afectivos, por lo que no puede relajarse cuando maneja sus emociones. [VERIFICAR RELACIONES INTERPERSONALES E INTEGRAR SI C' ES AUMENTADO]`,
    );
  }

  // Paso 9: Respuestas de Espacio Blanco S
  const sSum = comparisons.S.COMPARACION;
  if (elevated.includes(sSum)) interpretaciones.push("[RESPUESTAS S ELEVADAS]");

  // Paso 10: Composición de respuestas complejas
  // const compljColY = summary.CompljsColY ?? 0;
  const compljColSH = summary.CompljsColSH ?? 0;
  // const compljSH = summary.CompljsSH ?? 0;
  // const compljSHY = summary.CompljsSHY ?? 0;
  if (compljColSH > 0) {
    interpretaciones.push(
      `Por otro lado, se observan indicadores de ambivalencia que se manifiestan en una experiencia emocional confusa donde se mezclan afectos placenteros y dolorosos. Este indicador es propio de personas que enfrentan estados depresivos y generan sufrimiento al experimentar esta mezcla de sentimientos ante la misma situación estimular.`,
    );
  }

  return interpretaciones;
}
