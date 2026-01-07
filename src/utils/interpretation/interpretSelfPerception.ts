import type { StructuralSummaryData } from "../../types/StructuralSummaryData";
import type { ComparisonLevel, ComparisonMap } from "../../types/NormativeData";

export function interpretSelfPerception(
  summary: StructuralSummaryData,
  comparisons: ComparisonMap
): string[] {
  const interpretaciones: string[] = [];
  const persona = summary.Genero === "M" ? "el evaluado" : "la evaluada";
  const vocal = summary.Genero === "M" ? "o" : "a";

  // Paso 1: OBS y HVI
  if (summary.OBS === "Positivo") {
    interpretaciones.push("[PENDIENTE OBS POSITIVO]");
  }

  if (summary.HVI === "Positivo") {
    interpretaciones.push("[PENDIENTE HVI POSITIVO]");
  }

  // Paso 2: Índice de egocentrismo y reflejos
  const ego: ComparisonLevel = comparisons.Ego?.COMPARACION ?? "Indefinido";
  switch (ego) {
    case "Marcadamente por encima":
      interpretaciones.push(
        `Su índice de egocentrismo se encuentra muy por encima de lo esperado, lo que indica que ${persona} se encuentra excesivamente autocentrad${vocal}, tiende a despreocuparse de su mundo exterior y a otorgar demasiada prioridad a su propio punto de vista.`
      );
      break;
    case "Levemente por encima":
      interpretaciones.push(
        `Su índice de egocentrismo se encuentra elevado en relación con lo esperado, lo que indica que ${persona} tiene una inusual preocupación por sí mism${vocal}, tiende a despreocuparse de su mundo exterior y a otorgar demasiada prioridad a su propio punto de vista.`
      );
      break;
    case "Dentro del rango":
      interpretaciones.push(
        `Su índice de egocentrismo se encuentra dentro de los parámetros esperados, por lo que la preocupación que ${persona} tiene sobre sí mism${vocal} es adecuada, pudiendo prestar atención a sus necesidades personales sin descuidar su entorno.`
      );
      break;
    case "Levemente por debajo":
      interpretaciones.push(
        `Su índice de egocentrismo se encuentra por debajo de lo esperado, lo que indica que ${persona} tiene una baja preocupación por sus propias necesidades, su imagen personal se encuentra desvalorizada y su autoestima es baja.`
      );
      break;
    case "Marcadamente por debajo":
      interpretaciones.push(
        `Su índice de egocentrismo se encuentra muy por debajo de lo esperado, por lo que ${persona} tiende a despreocupar sus propias necesidades y tiene una imagen desvalorizada de sí misma. Esto puede llevarla a desconfiar de sus propios recursos y a dejarse influenciar excesivamente por los demás`
      );
      break;
  }

  const sumV = summary.SumV ?? 0;
  const mor = summary.MOR ?? 0;

  if (sumV > 0 || mor > 2) {
    interpretaciones.push("[PENDIENTE AUTOVALORACIÓN NEGATIVA]");
  } else {
    interpretaciones.push(
      "No muestra indicadores de autovaloración negativa, por lo que es posible afirmar que cuenta con una adecuada autoestima."
    );
  }

  const reflejos = summary["Fr+rF"] ?? 0;
  if (reflejos > 0) {
    interpretaciones.push(
      `Además, se observan indicadores de narcisismo, por lo que ${persona} tiende a sobrestimar su valía personal, lo que indica inmadurez personal.`
    );
  }

  // Paso 3: FD y V en relación con historia personal
  const fd = summary.FD ?? 0;
  if (fd > 2) {
    interpretaciones.push("[PENDIENTE FD>2]");
  }

  if (sumV > 0 && sumV + fd > 2) {
    interpretaciones.push("[PENDIENTE V+FD>2]");
  }

  // Paso 5: An y Xy
  const an = summary.An ?? 0;
  const xy = summary.Xy ?? 0;

  if (an + xy > 3) {
    interpretaciones.push(
      `Se observa una muy elevada preocupación por el cuerpo, que apunta a la posible presencia de alteraciones en la autoimagen y las actitudes que ${persona} tiene hacia sí mism${vocal}, reflejando que experimenta una gran vulnerabilidad referida a la experiencia de sí mism${vocal}.`
    );
  }

  if (an + xy === 2) {
    interpretaciones.push("[REVISAR DISTORSIONES AN+XY = 2]");
  }

  // Paso 6: MOR y contenidos asociados
  if (mor > 2) {
    interpretaciones.push("[VERIFICAR CONTENIDOS MOR]");
  }

  // Paso 7: H:(H)+Hd+(HD)
  const hPura = summary.H ?? 0;
  const sumHd = summary.Hd ?? 0;
  const sumHImg = summary["(H)"] ?? 0;
  const sumHdImg = summary["(Hd)"] ?? 0;

  const todoH = comparisons.TodoH.COMPARACION ?? "Indefinido";
  let todoHTxt = "";

  switch (todoH) {
    case "Marcadamente por encima":
      todoHTxt = "[PENDIENTE TODOH MUY ALTO]";
      break;
    case "Levemente por encima":
      todoHTxt = "[PENDIENTE TODOH ALTO]";
      break;
    case "Dentro del rango":
      todoHTxt = `Su interés en el componente humano se encuentra dentro de lo esperado, por lo que ${persona} es capaz de realizar trabajo de identificación para construir su autoconcepto.`;
      break;
    case "Levemente por debajo":
      todoHTxt = `Se observan dificultades en los procesos de identificación que derivan del bajo interés que ${persona} tiene por el componente humano, lo cual apunta a la presencia de conflictos de identidad, de autoimagen o de relación con los demás.`;
      break;
    case "Marcadamente por debajo":
      todoHTxt = "[PENDIENTE TODOH MUY BAJO]";
      break;
  }

  if (hPura > sumHd + sumHImg + sumHdImg) {
    interpretaciones.push("[PENDIENTE H > (H)+Hd+(Hd)]");
  } else {
    interpretaciones.push("[PENDIENTE H < (H)+Hd+(Hd)]");
  }

  interpretaciones.push("[PENDIENTE ANÁLISIS H DOMINANTE]");

  const hx = summary.Hx ?? 0;
  if (hx > 0) {
    interpretaciones.push(
      "Además, se observa una tendencia a establecer aspectos del autoconcepto mediante la intelectualización, lo que puede derivar en la incorporación de distorsiones importantes."
    );
  }

  interpretaciones.push(todoHTxt);

  const ghr = summary.GHR ?? 0;
  const phr = summary.PHR ?? 0;

  if (ghr + phr != 0) {
    if (ghr < phr) {
      interpretaciones.push(
        `Por otro lado, ${persona} muestra una tendencia a incorporar aspectos desadaptativos o distorsionadores que hacen que la construcción que hace sobre las conceptualizaciones sobre sí mism${vocal} tenga una menor efectividad para producir respuestas adaptativas en su funcionamiento auto perceptivo.`
      );
    } else {
      interpretaciones.push(
        `Se observa que la interpretación que hace de las representaciones humanas le permiten construir las conceptualizaciones sobre sí mism${vocal} de manera efectiva, lo que le permite producir respuestas adaptativas en esta área de funcionamiento la mayor parte del tiempo`
      );
    }
  }

  interpretaciones.push(
    "[PASO 8: VERIFICAR PROYECCIONES EN FQ-, MOR, M Y SOBRE ELABORACIONES]"
  );

  return interpretaciones;
}
