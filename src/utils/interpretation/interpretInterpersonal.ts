import type { ComparisonMap } from "../../types/NormativeData";
import type { StructuralSummaryData } from "../../types/StructuralSummaryData";
import { capitalize } from "../capitalize";
import { getDominant } from "../getDominant";
import { genderText } from "./genderText";

const elevated = ["Levemente por encima", "Marcadamente por encima"];
const decreased = ["Levemente por debajo", "Marcadamente por debajo"];

export function interpretInterpersonal(
  summary: StructuralSummaryData,
  comparisons: ComparisonMap,
): string[] {
  const { person, vowel } = genderText(summary["Genero"]);

  const interpretaciones: string[] = [];

  // Paso 1: CDI y HVI
  if (summary.CDI === "Positivo") {
    interpretaciones.push(
      "Su inhabilidad social implica una serie de dificultades que le impiden relacionarse de manera adaptativa en la mayoría de las situaciones sociales, tiende a establecer vínculos más superficiales y poco duraderos, es más vulnerable ante el rechazo y acumula menos experiencias positivas en el plano relacional, lo que al mediano o largo plazo tiende a producir fuertes sentimientos de desvalimiento y baja autoestima.",
    );
  }

  if (summary.HVI === "Positivo") {
    interpretaciones.push("[PENDIENTE HVI POSITIVO]");
  }

  // Paso 2: Relación a:p
  const totA = summary.a ?? 0;
  const totP = summary.p ?? 0;
  const totMov = totA + totP;

  if (totMov > 4) {
    if (totP > totA + 1) {
      interpretaciones.push(
        "Muestra una tendencia a asumir un rol pasivo en la interacción con los demás, por lo que deja que ellos tomen la iniciativa, evita asumir la responsabilidad de sus decisiones y espera que su entorno actúe en función de sus necesidades.",
      );
    } else {
      interpretaciones.push(
        "Muestra una adecuada capacidad para asumir la iniciativa en la interacción con los demás, tomando responsabilidad de sus decisiones sin apoyarse en exceso en su entorno.",
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
      `Su capacidad para identificar sus necesidades de contacto es menor a lo esperado, lo que indica que ${person} tiende a asumir una postura más reservada y cautelosa en la interacción con otros.`,
    );
  } else if (sumT === 1) {
    interpretaciones.push(
      `Su capacidad para identificar sus necesidades de contacto es adecuada, por lo que ${person} cuenta con disposición a establecer contacto con los demás según lo esperado.`,
    );
  } else if (sumT > 1) {
    interpretaciones.push(
      `Sus necesidades de cercanía son mayores a lo esperado, lo que indica que ${person} probablemente enfrenta un proceso de pérdida significativa que no ha sido elaborada adecuadamente. Esto l${vowel} lleva a experimentar intensos sentimientos de soledad y a ansiar el contacto con otros.`,
    );
  }

  // Paso 4: contenidos humanos

  const sumH = summary.H ?? 0;
  const sumHd = summary.Hd ?? 0;
  const sumHImg = summary["(H)"] ?? 0;
  const sumHdImg = summary["(Hd)"] ?? 0;
  const todoH = summary.TodoH ?? 0;

  const todoHComp = comparisons.TodoH.COMPARACION;

  if (todoH === 0) {
    interpretaciones.push(
      `${capitalize(
        person,
      )} no proporcionó suficiente información para estimar cómo construye las conceptualizaciones de los demás, lo cual refleja un nulo interés en el componente humano y apunta a la presencia de dificultades en sus procesos de identificación.`,
    );
  } else {
    if (elevated.includes(todoHComp)) {
      interpretaciones.push("[TODOH ELEVADO]");
    }
    if (decreased.includes(todoHComp)) {
      interpretaciones.push("[TODOH DISMINUIDO]");
    } else {
      interpretaciones.push("[TODOH NORMAL]");
    }

    const valuesH = {
      H: sumH,
      Hd: sumHd,
      HImg: sumHImg,
      HdImg: sumHdImg,
    };

    const dominantH = getDominant(valuesH);
    interpretaciones.push(`[PENDIENTE H DOMINANTE: ${dominantH.dominants}]`);
  }

  // Paso 5: GHR:PHR
  const ghr = summary.GHR ?? 0;
  const phr = summary.PHR ?? 0;
  if (ghr + phr >= 3) {
    interpretaciones.push(
      "Su interés en las interacciones con otros es adecuada",
    );

    if (ghr >= phr) {
      interpretaciones.push(
        `y las interpretaciones e imágenes mentales que hace sobre los demás y los vínculos tienden a ser realistas, permitiéndole adaptarse y ser socialmente eficaz la mayor parte del tiempo.`,
      );
    } else {
      interpretaciones.push(
        `pero las interpretaciones e imágenes mentales que hace sobre los demás y los vínculos tienden a ser poco realistas e incluir sesgos personales excesivos, apuntando a la presencia de alteraciones sobre estos constructos. Esto aumenta la probabilidad de que su conducta presente menor eficacia y adaptación social.`,
      );
    }
  }

  // Paso 6: PER, COP y AG
  const per = summary.PER ?? 0;
  const cop = summary.COP ?? 0;
  const ag = summary.AG ?? 0;

  const attributions: boolean = cop + ag + per > 0;

  if (!attributions) {
    interpretaciones.push(
      `Se observa que ${person} no realiza atribuciones respecto a la interacción con otros, por lo que no prevé aspectos positivos ni negativos de interactuar. Por este motivo, es probable que sea percibid${vowel} como distante o poco sociable por los demás.`,
    );
  } else {
    interpretaciones.push(
      `Respecto a las atribuciones que ${person} realiza sobre las interacciones sociales, se observa que`,
    );

    if (per > 2) {
      interpretaciones.push(
        `tiende a mostrar elementos de infantilismo que l${vowel} llevan a justificar defensivamente su autoimagen, reflejando inseguridad y compensarlo recurriendo al autoritarismo infantil. Por este motivo es probable que ${person} sea percibida como rígid${vowel} y tienda a tener conflictos cuando el entorno no se somete a sus exigencias.`,
      );
    }

    if (cop > ag) {
      interpretaciones.push(
        "Tiende a atribuir aspectos positivos en la interacción con otros y muestra disposición a participar de ellas.",
      );
    }

    if (cop <= 1 && ag === 2) {
      interpretaciones.push(
        `Además, se observa que ${person} tiende a percibir la agresividad como componente natural en las relaciones personales, por lo que es más proclive a manifestar conductas agresivas hacia los demás.`,
      );
    }

    if (cop <= 2 && ag > 2) {
      interpretaciones.push(
        "Se observa que gran parte de su actividad interpersonal está marcada por una tendencia a asumir actitudes agresivas hacia los demás, lo que puede responder a una actitud defensiva ante una percepción de hostilidad del ambiente.",
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
      "[PENDIENTE AISL>0.33 - VERIFICAR SI COP BAJO Y Afr BAJO]",
    );
  } else if (aisl > 0.25) {
    interpretaciones.push(
      "[PENDIENTE AISL>0.25 - VERIFICAR SI COP BAJO Y Afr BAJO]",
    );
  }

  // Paso 8: M y FM con pares
  interpretaciones.push("[VERIFICAR CUALI DE FM O M CON PAR]");

  return interpretaciones;
}
