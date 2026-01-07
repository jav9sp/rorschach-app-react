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
import { generateConstellations } from "./constellations/generateConstellations";

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

// ? Se debe dejar como Partial porque otros módulos necesitan la edad
// ? Si no se deja Partial genera error que no sé cómo corregir por ahora
export function buildMasterSummary(
  data: Answer[],
  age: number,
  gender: string
): StructuralSummaryData {
  // Definir el Objeto Maestro con toda las variables
  const summary: Partial<StructuralSummaryData> = {};

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

  summary.Edad = age;
  summary.Genero = gender;

  Object.assign(summary, contarLocalizaciones(locs));
  Object.assign(summary, contarCalidadDQ(dq));

  const { resumenDeterminantes, resumenSubindices, detCompljs, categorias } =
    contarDeterminantes(dets, fq);
  Object.assign(summary, resumenDeterminantes, resumenSubindices, categorias);

  summary.RespComplejas = detCompljs;

  Object.assign(summary, contarCalidadFQ(fq));
  Object.assign(summary, contarLocFQ(data));
  Object.assign(summary, contarContenidos(cont));
  Object.assign(summary, contarValoresComa(ccee));

  Object.assign(summary, calcularZScore(lam, z));

  // Asignar CC.EE
  const codigosEspeciales: SpecialCodesInput = {
    DV1: Number(summary.DV1 ?? 0),
    DV2: Number(summary.DV2 ?? 0),
    INC1: Number(summary.INC1 ?? 0),
    INC2: Number(summary.INC2 ?? 0),
    DR1: Number(summary.DR1 ?? 0),
    DR2: Number(summary.DR2 ?? 0),
    FAB1: Number(summary.FAB1 ?? 0),
    FAB2: Number(summary.FAB2 ?? 0),
    ALOG: Number(summary.ALOG ?? 0),
    CONTAM: Number(summary.CONTAM ?? 0),
    AB: Number(summary.AB ?? 0),
  };
  Object.assign(summary, calcularCodigosEspeciales(codigosEspeciales));

  Object.assign(summary, calcularR(data));
  Object.assign(summary, calcularLambda(data, resumenDeterminantes));
  Object.assign(summary, calcularDetsResumidos(resumenDeterminantes));

  // Cálculos EB, eb
  const ebRatioInput: EBRatioInput = {
    FM: Number(summary.FM ?? 0),
    m: Number(summary.m ?? 0),
    "SumC'": Number(summary["SumC'"] ?? 0),
    SumT: Number(summary.SumT ?? 0),
    SumY: Number(summary.SumY ?? 0),
    SumV: Number(summary.SumV ?? 0),
  };
  Object.assign(summary, calcularEB_Ratio(ebRatioInput));

  const ebEaEbperInput: EBEAEBperInput = {
    C: Number(summary.C ?? 0),
    CF: Number(summary.CF ?? 0),
    FC: Number(summary.FC ?? 0),
    M: Number(summary.M ?? 0),
    es: Number(summary.es ?? 0),
  };
  Object.assign(
    summary,
    calcularEB_EA_EBPer(ebEaEbperInput, summary.Lambda ?? 0)
  );

  summary.TipoVivencial = calcularEstiloVivencial(
    summary.EB ?? "0:0",
    summary.EA ?? 0
  );

  summary.PuntD = calcularDScore(summary["EA-es"] ?? 0);

  const adjEsInputs: AdjESInput = {
    es: Number(summary.es ?? 0),
    m: Number(summary.m ?? 0),
    SumY: Number(summary.SumY ?? 0),
  };
  summary.Adjes = calcularAdjES(adjEsInputs);
  summary.AdjD = calcularAdjD(summary.EA ?? 0, summary.Adjes);

  const dataAfectos = data.map((r) => ({
    Det: r.Det ?? "",
    Lam: r.Lam != null ? String(r.Lam).trim().toUpperCase() : "",
    Loc: r.Loc ?? "",
  }));

  // Cálculo Afectos
  const calcularAfectosInput: AfectsInput = {
    FC: Number(summary.FC ?? 0),
    CF: Number(summary.CF ?? 0),
    C: Number(summary.C ?? 0),
    Cn: Number(summary.Cn ?? 0),
    CP: Number(summary.CP ?? 0),
    "FC'": Number(summary["FC'"] ?? 0),
    "C'F": Number(summary["C'F"] ?? 0),
    "C'": Number(summary["C'"] ?? 0),
    FT: Number(summary.FT ?? 0),
    TF: Number(summary.TF ?? 0),
    T: Number(summary.T ?? 0),
    FV: Number(summary.FV ?? 0),
    VF: Number(summary.VF ?? 0),
    V: Number(summary.V ?? 0),
    FY: Number(summary.FY ?? 0),
    YF: Number(summary.YF ?? 0),
    Y: Number(summary.Y ?? 0),
  };
  Object.assign(summary, calcularAfectos(dataAfectos, calcularAfectosInput));

  // Cálculo Interpersonal
  const interpersonalInput: InterpersonalInput = {
    R: Number(summary.R ?? 0),
    COP: Number(summary.COP ?? 0),
    AG: Number(summary.AG ?? 0),
    GHR: Number(summary.GHR ?? 0),
    PHR: Number(summary.PHR ?? 0),
    a: Number(summary.a ?? 0),
    p: Number(summary.p ?? 0),
    Fd: Number(summary.Fd ?? 0),
    FT: Number(summary.FT ?? 0),
    TF: Number(summary.TF ?? 0),
    T: Number(summary.T ?? 0),
    H: Number(summary.H ?? 0),
    Hd: Number(summary.Hd ?? 0),
    "(H)": Number(summary["(H)"] ?? 0),
    "(Hd)": Number(summary["(Hd)"] ?? 0),
    Hx: Number(summary.Hx ?? 0),
    PER: Number(summary.PER ?? 0),
    Bt: Number(summary.Bt ?? 0),
    Ge: Number(summary.Ge ?? 0),
    Ls: Number(summary.Ls ?? 0),
    Cl: Number(summary.Cl ?? 0),
    Na: Number(summary.Na ?? 0),
  };
  Object.assign(summary, calcularInterpersonal(interpersonalInput));

  // Cálculo Mediación
  Object.assign(summary, calcularMediacion(data));

  // Cálculo Procesamiento
  const procesamientoInput: ProcessingInput = {
    W: Number(summary.W ?? 0),
    D: Number(summary.D ?? 0),
    Dd: Number(summary.Dd ?? 0),
    Zf: Number(summary.Zf ?? 0),
    Zd: Number(summary.Zd ?? 0),
    PSV: Number(summary.PSV ?? 0),
  };
  Object.assign(summary, calcularProcesamiento(data, procesamientoInput));

  // Cálculo Autopercepción
  const autopercepcionInput: SelfPerceptionInput = {
    FV: Number(summary.FV ?? 0),
    VF: Number(summary.VF ?? 0),
    V: Number(summary.V ?? 0),
    Fd: Number(summary.Fd ?? 0),
    An: Number(summary.An ?? 0),
    Xy: Number(summary.Xy ?? 0),
    MOR: Number(summary.MOR ?? 0),
    H: Number(summary.H ?? 0),
    "(H)": Number(summary["(H)"] ?? 0),
    Hd: Number(summary.Hd ?? 0),
    "(Hd)": Number(summary["(Hd)"] ?? 0),
  };
  Object.assign(summary, calcularAutopercepcion(data, autopercepcionInput));

  // Indicadores Ideación
  const indicadoresIdeacion: IdeationIndicatorsInput = {
    a: Number(summary.a ?? 0),
    p: Number(summary.p ?? 0),
    AB: Number(summary.AB ?? 0),
    MOR: Number(summary.MOR ?? 0),
    Art: Number(summary.Art ?? 0),
    Ay: Number(summary.Ay ?? 0),
  };
  Object.assign(
    summary,
    calcularIndicadoresIdeacion(data, indicadoresIdeacion)
  );

  // Cálculo Constelaciones
  Object.assign(summary, generateConstellations(summary));

  // Secuencia de Localización
  summary.Secuencia = calcularSecuenciaLocalizacion(data);

  return summary as StructuralSummaryData;
}
