import { contarLocalizaciones } from "./counters/moduleLocalizacion";
import { contarLocFQ } from "./counters/moduleCalidadFormalLocalizacion";
import { contarCalidadDQ } from "./counters/moduleCalidadEvolutiva";
import { contarDeterminantes } from "./counters/moduleDeterminantes";
import { contarCalidadFQ } from "./counters/moduleCalidadFormal";
import { contarContenidos } from "./counters/moduleContenidos";
import { contarValoresComa } from "./moduleValoresComa";

import { calcularZScore } from "./moduleZScore";
import {
  calcularCodigosEspeciales,
  calcularIndicadoresIdeacion,
} from "./areas/moduleIdeacion";
import {
  calcularR,
  calcularLambda,
  calcularDetsResumidos,
} from "./moduleBasicos";
import { calcularEB_EA_EBPer, calcularEB_Ratio } from "./moduleEB";
import { calcularAdjES, calcularAdjD, calcularDScore } from "./moduleAdj";
import {
  calcularAfectos,
  calcularEstiloVivencial,
} from "./areas/moduleAfectos";
import { calcularInterpersonal } from "./areas/moduleInterpersonal";
import { calcularMediacion } from "./areas/moduleMediacion";
import { calcularProcesamiento } from "./areas/moduleProcesamiento";
import { calcularAutopercepcion } from "./areas/moduleAutopercepcion";
import { generarConstelaciones } from "./constelations/moduleConstelaciones";

import { calcularSecuenciaLocalizacion } from "./counters/moduleSecuenciaLocalizacion";

import type { StructuralSummaryData } from "../types/StructuralSummaryData";
import type {
  AdjESInput,
  AfectsInput,
  SelfPerceptionInput,
  SpecialCodesInput,
  EBEAEBperInput,
  EBRatioInput,
  IdeationIndicatorsInput,
  InterpersonalInput,
  ProcessingInput,
} from "../types/ModuleInputs";

// === TIPOS ===

export type Gender = "M" | "F";

export type Answer = {
  N: number;
  Texto: string;
  Lam: string;
  Loc: string;
  DQ: string;
  Det: string;
  FQ: string;
  Nivel: number;
  Par: number;
  Contenidos: string;
  Populares: string;
  Z: number;
  "CC.EE.": string;
  [key: string]: any; // Para campos extra
};

export function buildMasterSummary(
  data: Answer[],
  age: number,
  gender: string
): StructuralSummaryData {
  // Definir el Objeto Maestro con toda las variables
  const variables: Partial<StructuralSummaryData> = {};

  // Extraer los datos de las respuestas por columnas
  const locs = data.map((r) => r.Loc);
  const dq = data.map((r) => r.DQ);
  const dets = data.map((r) => r.Det);
  const fq = data.map((r) => r.FQ);
  const cont = data.map((r) => r.Contenidos);
  const ccee = data.map((r) => r["CC.EE."]);
  const lam: string[] = data.map((r) =>
    r.Lam != null ? String(r.Lam).trim().toUpperCase() : ""
  );
  const z: string[] = data.map((r) =>
    r.Z != null ? String(r.Z).trim().toLowerCase() : ""
  );

  variables.Edad = age;
  variables.Genero = gender;

  Object.assign(variables, contarLocalizaciones(locs));
  Object.assign(variables, contarCalidadDQ(dq));

  const { resumenDeterminantes, resumenSubindices, detCompljs, categorias } =
    contarDeterminantes(dets, fq);
  Object.assign(variables, resumenDeterminantes, resumenSubindices, categorias);

  variables["RespComplejas"] = detCompljs;

  Object.assign(variables, contarCalidadFQ(fq));
  Object.assign(variables, contarLocFQ(data));
  Object.assign(variables, contarContenidos(cont));
  Object.assign(variables, contarValoresComa(ccee));

  Object.assign(variables, calcularZScore(lam, z));

  // Asignar CC.EE
  const codigosEspeciales: SpecialCodesInput = {
    DV1: Number(variables.DV1 ?? 0),
    DV2: Number(variables.DV2 ?? 0),
    INC1: Number(variables.INC1 ?? 0),
    INC2: Number(variables.INC2 ?? 0),
    DR1: Number(variables.DR1 ?? 0),
    DR2: Number(variables.DR2 ?? 0),
    FAB1: Number(variables.FAB1 ?? 0),
    FAB2: Number(variables.FAB2 ?? 0),
    ALOG: Number(variables.ALOG ?? 0),
    CONTAM: Number(variables.CONTAM ?? 0),
    AB: Number(variables.AB ?? 0),
  };
  Object.assign(variables, calcularCodigosEspeciales(codigosEspeciales));

  Object.assign(variables, calcularR(data));
  Object.assign(variables, calcularLambda(data, resumenDeterminantes));
  Object.assign(variables, calcularDetsResumidos(resumenDeterminantes));

  // Cálculos EB, eb
  const ebRatioInput: EBRatioInput = {
    FM: Number(variables.FM ?? 0),
    m: Number(variables.m ?? 0),
    "SumC'": Number(variables["SumC'"] ?? 0),
    SumT: Number(variables.SumT ?? 0),
    SumY: Number(variables.SumY ?? 0),
    SumV: Number(variables.SumV ?? 0),
  };
  Object.assign(variables, calcularEB_Ratio(ebRatioInput));

  const ebEaEbperInput: EBEAEBperInput = {
    C: Number(variables.C ?? 0),
    CF: Number(variables.CF ?? 0),
    FC: Number(variables.FC ?? 0),
    M: Number(variables.M ?? 0),
    es: Number(variables.es ?? 0),
  };
  Object.assign(
    variables,
    calcularEB_EA_EBPer(ebEaEbperInput, variables.Lambda ?? 0)
  );

  variables["Tipo Vivencial"] = calcularEstiloVivencial(
    variables.EB ?? "0:0",
    variables.EA ?? 0
  );

  variables["PuntD"] = calcularDScore(variables["EA-es"] ?? 0);

  const adjEsInputs: AdjESInput = {
    es: Number(variables.es ?? 0),
    m: Number(variables.m ?? 0),
    SumY: Number(variables.SumY ?? 0),
  };
  variables["Adjes"] = calcularAdjES(adjEsInputs);
  variables["AdjD"] = calcularAdjD(variables.EA ?? 0, variables.Adjes);

  const dataAfectos = data.map((r) => ({
    Det: r.Det ?? "",
    Lam: r.Lam != null ? String(r.Lam).trim().toUpperCase() : "",
    Loc: r.Loc ?? "",
  }));

  // Cálculo Afectos
  const calcularAfectosInput: AfectsInput = {
    FC: Number(variables.FC ?? 0),
    CF: Number(variables.CF ?? 0),
    C: Number(variables.C ?? 0),
    Cn: Number(variables.Cn ?? 0),
    CP: Number(variables.CP ?? 0),
    "FC'": Number(variables["FC'"] ?? 0),
    "C'F": Number(variables["C'F"] ?? 0),
    "C'": Number(variables["C'"] ?? 0),
    FT: Number(variables.FT ?? 0),
    TF: Number(variables.TF ?? 0),
    T: Number(variables.T ?? 0),
    FV: Number(variables.FV ?? 0),
    VF: Number(variables.VF ?? 0),
    V: Number(variables.V ?? 0),
    FY: Number(variables.FY ?? 0),
    YF: Number(variables.YF ?? 0),
    Y: Number(variables.Y ?? 0),
  };
  Object.assign(variables, calcularAfectos(dataAfectos, calcularAfectosInput));

  // Cálculo Interpersonal
  const interpersonalInput: InterpersonalInput = {
    R: Number(variables.R ?? 0),
    COP: Number(variables.COP ?? 0),
    AG: Number(variables.AG ?? 0),
    GHR: Number(variables.GHR ?? 0),
    PHR: Number(variables.PHR ?? 0),
    a: Number(variables.a ?? 0),
    p: Number(variables.p ?? 0),
    Fd: Number(variables.Fd ?? 0),
    FT: Number(variables.FT ?? 0),
    TF: Number(variables.TF ?? 0),
    T: Number(variables.T ?? 0),
    H: Number(variables.H ?? 0),
    Hd: Number(variables.Hd ?? 0),
    "(H)": Number(variables["(H)"] ?? 0),
    "(Hd)": Number(variables["(Hd)"] ?? 0),
    Hx: Number(variables.Hx ?? 0),
    PER: Number(variables.PER ?? 0),
    Bt: Number(variables.Bt ?? 0),
    Ge: Number(variables.Ge ?? 0),
    Ls: Number(variables.Ls ?? 0),
    Cl: Number(variables.Cl ?? 0),
    Na: Number(variables.Na ?? 0),
  };
  Object.assign(variables, calcularInterpersonal(interpersonalInput));

  // Cálculo Mediación
  Object.assign(variables, calcularMediacion(data));

  // Cálculo Procesamiento
  const procesamientoInput: ProcessingInput = {
    W: Number(variables.W ?? 0),
    D: Number(variables.D ?? 0),
    Dd: Number(variables.Dd ?? 0),
    Zf: Number(variables.Zf ?? 0),
    Zd: Number(variables.Zd ?? 0),
    PSV: Number(variables.PSV ?? 0),
  };
  Object.assign(variables, calcularProcesamiento(data, procesamientoInput));

  // Cálculo Autopercepción
  const autopercepcionInput: SelfPerceptionInput = {
    FV: Number(variables.FV ?? 0),
    VF: Number(variables.VF ?? 0),
    V: Number(variables.V ?? 0),
    Fd: Number(variables.Fd ?? 0),
    An: Number(variables.An ?? 0),
    Xy: Number(variables.Xy ?? 0),
    MOR: Number(variables.MOR ?? 0),
    H: Number(variables.H ?? 0),
    "(H)": Number(variables["(H)"] ?? 0),
    Hd: Number(variables.Hd ?? 0),
    "(Hd)": Number(variables["(Hd)"] ?? 0),
  };
  Object.assign(variables, calcularAutopercepcion(data, autopercepcionInput));

  // Indicadores Ideación
  const indicadoresIdeacion: IdeationIndicatorsInput = {
    a: Number(variables.a ?? 0),
    p: Number(variables.p ?? 0),
    AB: Number(variables.AB ?? 0),
    MOR: Number(variables.MOR ?? 0),
    Art: Number(variables.Art ?? 0),
    Ay: Number(variables.Ay ?? 0),
  };
  Object.assign(
    variables,
    calcularIndicadoresIdeacion(data, indicadoresIdeacion)
  );

  // Cálculo Constelaciones
  Object.assign(
    variables,
    generarConstelaciones(variables, variables.Edad ?? 0)
  );

  // Secuencia de Localización
  variables["Secuencia"] = calcularSecuenciaLocalizacion(data);

  return variables as StructuralSummaryData;
}
