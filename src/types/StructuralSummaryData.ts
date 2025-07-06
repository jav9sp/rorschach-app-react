import type { SecuenciaLocalizacion } from "../utils/counters/moduleSecuenciaLocalizacion";

export type StructuralSummaryData = {
  // Generales
  Edad: number;
  Genero: string;
  R: number;
  Lambda: number;

  // Procesamiento
  W: number;
  D: number;
  "W+D": number;
  Dd: number;
  S: number;
  "W:D:Dd": string;
  "W:M": string;
  "DQ+": number;
  DQo: number;
  "DQv/+": number;
  DQv: number;
  Zf: number;
  Zsum: number;
  Zest: number;
  Zd: number;
  "Estilo Cognitivo": string;
  "WDx+": number;
  WDxo: number;
  WDxu: number;
  "WDx-": number;
  WDxsin: number;

  // Determinantes
  F: number;
  M: number;
  FM: number;
  m: number;
  C: number;
  CF: number;
  FC: number;
  "C'": number;
  "C'F": number;
  "FC'": number;
  T: number;
  TF: number;
  FT: number;
  V: number;
  VF: number;
  FV: number;
  Y: number;
  YF: number;
  FY: number;
  FD: number;
  rF: number;
  Fr: number;

  // Ideación
  "MQ+": number;
  MQo: number;
  MQu: number;
  "MQ-": number;
  MQsin: number;
  a: number;
  p: number;
  Intereses: number;
  Intelec: number;
  "Nvl-2": number;
  "a:p": string;
  "Ma:Mp": string;

  // Contenidos
  H: number;
  "(H)": number;
  Hd: number;
  "(Hd)": number;
  Hx: number;
  A: number;
  "(A)": number;
  Ad: number;
  "(Ad)": number;
  An: number;
  Art: number;
  Ay: number;
  Bl: number;
  Bt: number;
  Cg: number;
  Cl: number;
  Ex: number;
  Fi: number;
  Fd: number;
  Ge: number;
  Hh: number;
  Ls: number;
  Na: number;
  Sc: number;
  Sx: number;
  Xy: number;
  Idio: number;

  // CC.EE.
  MOR: number;
  DV1: number;
  DV2: number;
  INC1: number;
  INC2: number;
  DR1: number;
  DR2: number;
  FAB1: number;
  FAB2: number;
  ALOG: number;
  CONTAM: number;
  PSV: number;
  AB: number;
  Sum6CE: number;
  Sum6CE2: number;
  SumBrut6: number;
  SumPon6: number;

  // Afectos
  "SumC'": number;
  SumT: number;
  SumV: number;
  SumY: number;
  "FC:CF+C+Cn": string;
  "C Pura": number;
  "SumC':SumPonC": string;
  Afr: number;
  "Compljs:R": string;
  CP: number;
  SumPonC: number;
  Cn: number;
  "FC+CF+C+Cn": number;
  Compljs: number;
  "Compljs/R": number;
  "CompljsSit/R": number;
  CompljsColSH: number;
  CompljsColY: number;
  CompljsSHY: number;
  CompljsSH: number;
  CompljsMov: number;
  SumSH: number;

  // Controles
  eb: string;
  es: number;
  "FM+m": number;
  EB: string;
  EA: number;
  EBPer: number;
  "EA-es": number;
  "Tipo Vivencial": string;
  PuntD: number;
  Adjes: number;
  AdjD: number;

  // Interpersonal
  GHR: number;
  PHR: number;
  COP: number;
  AG: number;
  PER: number;
  TodoH: number;
  "COP:AG": string;
  "GHR:PHR": string;
  "Aisl/R": number;

  // Ajustes
  "XA%": number;
  "WDA%": number;
  "X+%": number;
  "Xu%": number;
  "X-%": number;
  "S-": number;
  "S-%": number;
  Populares: number;
  "FQx+": number;
  FQxo: number;
  FQxu: number;
  "FQx-": number;
  FQxsin: number;

  // Autopercepción
  Ego: number;
  "Fr+rF": number;
  "An+Xy": number;
  "H:(H)+Hd+(Hd)": string;
  Pares: number;

  // Constelaciones
  CDI: string;
  "CDI Contador": number;
  DEPI: string;
  "DEPI Contador": number;
  HVI: string;
  OBS: string;
  "OBS Contador": number;
  PTI: number;
  SCON: string;
  "SCON Contador": number;

  // Secuencia
  Secuencia: SecuenciaLocalizacion;
  RespComplejas: string[];

  // Resúmenes de FQ_Loc
  "W_FQx+": number;
  "W_FQx-": number;
  W_FQxo: number;
  W_FQxsin: number;
  W_FQxu: number;
  "D_FQx+": number;
  "D_FQx-": number;
  D_FQxo: number;
  D_FQxsin: number;
  D_FQxu: number;
  "Dd_FQx+": number;
  "Dd_FQx-": number;
  Dd_FQxo: number;
  Dd_FQxsin: number;
  Dd_FQxu: number;
  "S_FQx+": number;
  "S_FQx-": number;
  S_FQxo: number;
  S_FQxsin: number;
  S_FQxu: number;
};
