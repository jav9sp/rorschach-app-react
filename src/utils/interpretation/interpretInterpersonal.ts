import type { ComparisonMap } from "../../types/NormativeData";
import type { StructuralSummaryData } from "../../types/StructuralSummaryData";
import { genderText } from "./genderText";

export function interpretInterpersonal(
  summary: StructuralSummaryData,
  comparisons: ComparisonMap
): string[] {
  const [persona, vocal, articulo] = genderText(summary["Genero"]);

  const interpretaciones: string[] = [];

  // Paso 1: CDI y HVI
  if (summary.CDI === "Positivo") {
    interpretaciones.push(
      "Su inhabilidad social implica una serie de dificultades que le impiden relacionarse de manera adaptativa en la mayoría de las situaciones sociales, tiende a establecer vínculos más superficiales y poco duraderos, es más vulnerable ante el rechazo y acumula menos experiencias positivas en el plano relacional, lo que al mediano o largo plazo tiende a producir fuertes sentimientos de desvalimiento y baja autoestima."
    );
  }

  if (summary.HVI === "Positivo") {
    interpretaciones.push("[PENDIENTE HVI POSITIVO]");
  }

  // Paso 2: Relación a:p
  const totA = summary.a ?? 0;
  const totP = summary.p ?? 0;
  const sumMov = totA + totP;

  if (sumMov > 4) {
    if (totP > totA + 1) {
      interpretaciones.push(
        "Muestra una tendencia a asumir un rol pasivo en la interacción con los demás, por lo que deja que ellos tomen la iniciativa, evita asumir la responsabilidad de sus decisiones y espera que su entorno actúe en función de sus necesidades."
      );
    } else {
      interpretaciones.push(
        "Muestra una adecuada capacidad para asumir la iniciativa en la interacción con los demás, tomando responsabilidad de sus decisiones sin apoyarse en exceso en su entorno."
      );
    }
  }

  // Paso 3: Fd y T
  if (summary.Fd && summary.Fd > 0) {
    interpretaciones.push("[PENDIENTE Fd PRESENTE]");
  }

  const sumT = summary.SumT ?? 0;
  if (sumT === 0) {
    interpretaciones.push(
      `Su capacidad para identificar sus necesidades de contacto es menor a lo esperado, lo que indica que ${persona} tiende a asumir una postura más reservada y cautelosa en la interacción con otros.`
    );
  } else if (sumT === 1) {
    interpretaciones.push(
      `Su capacidad para identificar sus necesidades de contacto es adecuada, por lo que ${persona} cuenta con disposición a establecer contacto con los demás según lo esperado.`
    );
  } else if (sumT > 1) {
    interpretaciones.push("[PENDIENTE SumT>1]");
  }

  // Paso 4: contenidos humanos
  const todoH = comparisons.TodoH.COMPARACION ?? "Indefinido";
  let todoHTxt = "";
  if (todoH === "Levemente por debajo") {
    todoHTxt =
      "Su interés en el componente humano se encuentra por debajo de lo esperado";
  }

  const parrafoContH = `${todoHTxt}, En cuanto a cómo construye las conceptualizaciones de los demás, `;
  interpretaciones.push(parrafoContH);

  interpretaciones.push(predominioContH(persona, summary));

  // Paso 5: GHR:PHR
  const ghr = summary.GHR ?? 0;
  const phr = summary.PHR ?? 0;
  if (ghr + phr >= 3) {
    if (phr >= ghr) {
      interpretaciones.push(
        `Respecto a su eficacia interpersonal, se observan dificultades de adaptabilidad que llevan a ${persona} a ser percibida de manera poco favorable por los demás. Además, dado que sus constructos sobre los demás contienen sesgos, su percepción de los otros y sobre los vínculos se encuentra alterada.`
      );
    } else {
      interpretaciones.push(
        `Respecto a su eficacia interpersonal, se observa que ${persona} es capaz de establecer vínculos positivos, profundos y empáticos con los demás [ESTO ESTA MAL - VER AFR].`
      );
    }
  }

  // Paso 6: PER, COP y AG
  const per = summary.PER ?? 0;
  const cop = summary.COP ?? 0;
  const ag = summary.AG ?? 0;

  if (per > 2) {
    interpretaciones.push(
      `Por otro lado, se observan marcados indicadores de infantilismo que l${vocal} llevan a justificar defensivamente su autoimagen, intentando protegerse de los supuestos cuestionamientos que los demás hacen sobre sí. Esto aumenta las probabilidades de conflicto cuando el entorno le exige adaptarse a sus exigencias, escenarios en los cuales ${persona} podría actuar de manera más rígida.`
    );
  }

  const attributions: boolean = cop + ag > 0;

  if (!attributions) {
    interpretaciones.push(
      `Se observa que ${persona} no realiza atribuciones respecto a la interacción con otros, por lo que no prevé aspectos positivos ni negativos de interactuar. Por este motivo, es probable que sea percibid${vocal} como distante o poco sociable.`
    );
  } else {
    if (cop <= 1 && ag === 2) {
      interpretaciones.push(
        `Además, se observa que ${persona} tiende a percibir la agresividad como componente natural en las relaciones personales, por lo que es más proclive a manifestar conductas agresivas hacia los demás.`
      );
    }

    if (cop <= 2 && ag > 2) {
      interpretaciones.push(
        "Se observa que gran parte de su actividad interpersonal está marcada por una tendencia a asumir actitudes agresivas hacia los demás, lo que puede responder a una actitud defensiva ante una percepción de hostilidad del ambiente."
      );
    }

    if (cop === 2 && ag <= 1) {
      interpretaciones.push("[PENDIENTE COP == 2 and AG <= 1]");
    }

    if (cop === 3 && ag === 2) {
      interpretaciones.push("[PENDIENTE COP == 3 and AG == 2]");
    }
  }

  // Paso 7: Aislamiento
  const aisl = summary["Aisl/R"] ?? 0;
  if (aisl > 0.33) {
    interpretaciones.push(
      "[PENDIENTE AISL>0.33 - VERIFICAR SI COP BAJO Y Afr BAJO]"
    );
  } else if (aisl > 0.25) {
    interpretaciones.push(
      "[PENDIENTE AISL>0.25 - VERIFICAR SI COP BAJO Y Afr BAJO]"
    );
  }

  // Paso 8: M y FM con pares
  interpretaciones.push("[VERIFICAR CUALI DE FM O M CON PAR]");

  return interpretaciones;
}

// TODO: Cambiar y usar getDominant()
function predominioContH(
  persona: string,
  variables: StructuralSummaryData
  // estadosSimples: EstadosSimplesInterpersonal
): string {
  const contH = variables.H ?? 0;
  const contHd = variables.Hd ?? 0;
  const contHImg = variables["(H)"] ?? 0;
  const contHdImg = variables["(Hd)"] ?? 0;

  // const estadoContHd = estadosSimples.Hd ?? "Indefinido";
  // const estadoContHImg = estadosSimples["(H)"] ?? "Indefinido";
  // const estadoContHdImg = estadosSimples["(Hd)"] ?? "Indefinido";

  if (contH > contHImg + contHd + contHdImg) {
    return "Se muestra capaz de construir las conceptualizaciones sobre los demás integrando percepciones completas, basadas en datos e interacciones reales con su entorno según lo esperado.";
  }

  if (contH < contHImg + contHd + contHdImg) {
    return "Muestra dificultades en la construcción de las conceptualizaciones sobre los demás, ";
  }

  // Placeholder para usar estadoContHd, estadoContHImg, estadoContHdImg en análisis más profundo
  return `${persona}`;
}
