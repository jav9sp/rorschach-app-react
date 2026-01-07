type Variables = Record<string, any>;

interface EstrategiaInterpretacion {
  "Variable activadora": string | null;
  "Secuencia de exploración": string[];
}

export function determinarEstrategiaInterpretacion(
  variables: Variables
): EstrategiaInterpretacion {
  const secuencias: Array<
    [string | [string, string], (v: Variables) => boolean, string[]]
  > = [
    [
      "PTI",
      (v) => v["PTI"] > 3,
      [
        "Ideación",
        "Mediación",
        "Procesamiento",
        "Controles",
        "Afectos",
        "Autopercepción",
        "Percepción Interpersonal",
      ],
    ],
    [
      ["DEPI", "CDI"],
      (v) => v["DEPI"] > 5 && v["CDI Contador"] > 3,
      [
        "Percepción interpersonal",
        "Autopercepción",
        "Controles",
        "Afectos",
        "Procesamiento",
        "Mediación",
        "Ideación",
      ],
    ],
    [
      "DEPI",
      (v) => v["DEPI"] > 5,
      [
        "Afectos",
        "Controles",
        "Autopercepción",
        "Percepción interpersonal",
        "Procesamiento",
        "Mediación",
        "Ideación",
      ],
    ],
    [
      "D<AdjD",
      (v) => v["PuntD"] < v["AdjD"],
      ["Controles", "Estrés situacional"],
    ],
    [
      "CDI",
      (v) => v["CDI Contador"] > 3,
      [
        "Controles",
        "Afectos",
        "Autopercepción",
        "Percepción interpersonal",
        "Procesamiento",
        "Mediación",
        "Ideación",
      ],
    ],
    ["AdjD", (v) => v["AdjD"] < 0, ["Controles"]],
    [
      "Lambda",
      (v) => v["Lambda"] > 0.99,
      [
        "Procesamiento",
        "Mediación",
        "Ideación",
        "Controles",
        "Afectos",
        "Autopercepción",
        "Percepción interpersonal",
      ],
    ],
    [
      "Fr+rF",
      (v) => v["Fr+rF"] > 0,
      ["Autopercepción", "Percepción interpersonal"],
    ],
    [
      "EB Introversivo",
      (v) => v["Tipo Vivencial"]?.toLowerCase() === "introversivo",
      [
        "Ideación",
        "Procesamiento",
        "Mediación",
        "Controles",
        "Afectos",
        "Autopercepción",
        "Percepción interpersonal",
      ],
    ],
    [
      "EB Extroversivo",
      (v) => v["Tipo Vivencial"]?.toLowerCase() === "extroversivo",
      [
        "Afectos",
        "Autopercepción",
        "Percepción interpersonal",
        "Controles",
        "Procesamiento",
        "Mediación",
        "Ideación",
      ],
    ],
    [
      "p>a+1",
      (v) => v["p"] > v["a"] + 1,
      [
        "Ideación",
        "Procesamiento",
        "Mediación",
        "Controles",
        "Autopercepción",
        "Percepción interpersonal",
        "Afectos",
      ],
    ],
    [
      "HVI",
      (v) => v["HVI"] === "Positivo",
      [
        "Ideación",
        "Procesamiento",
        "Mediación",
        "Controles",
        "Autopercepción",
        "Percepción interpersonal",
        "Afectos",
      ],
    ],
  ];

  for (const [clave, condicion, secuencia] of secuencias) {
    if (condicion(variables)) {
      const claveTexto = Array.isArray(clave) ? clave.join(" y ") : clave;
      return {
        "Variable activadora": claveTexto,
        "Secuencia de exploración": secuencia,
      };
    }
  }

  return {
    "Variable activadora": null,
    "Secuencia de exploración": [],
  };
}
