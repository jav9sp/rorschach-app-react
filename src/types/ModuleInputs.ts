import type { StructuralSummaryData } from "./StructuralSummaryData";

// Módulo EB Ratio
export type EBRatioInput = Pick<
  StructuralSummaryData,
  "FM" | "m" | "SumC'" | "SumT" | "SumV" | "SumY"
>;

export type DetsResumidosInput = Pick<
  StructuralSummaryData,
  "SumC'" | "SumT" | "SumV" | "SumY"
>;

// Módulo EB, EA, EBPer
export type EBEAInput = Pick<StructuralSummaryData, "M" | "FC" | "CF" | "C">;

export type EBEAEBperInput = Pick<
  StructuralSummaryData,
  "M" | "FC" | "CF" | "C" | "es"
>;

// Módulo Ideación
export type IndicadoresIdeacionInput = Pick<
  StructuralSummaryData,
  "a" | "p" | "AB" | "Art" | "Ay" | "MOR"
>;

export type CodigosEspecialesInput = Pick<
  StructuralSummaryData,
  | "DV1"
  | "DV2"
  | "INC1"
  | "INC2"
  | "DR1"
  | "DR2"
  | "FAB1"
  | "FAB2"
  | "ALOG"
  | "CONTAM"
  | "AB"
>;

// Módulo Adj
export type AdjESInput = Pick<StructuralSummaryData, "m" | "SumY" | "es">;

// Módulo Interpersonal
export type InterpersonalInput = Pick<
  StructuralSummaryData,
  | "R"
  | "COP"
  | "AG"
  | "GHR"
  | "PHR"
  | "a"
  | "p"
  | "Fd"
  | "FT"
  | "TF"
  | "T"
  | "H"
  | "Hd"
  | "(H)"
  | "(Hd)"
  | "Hx"
  | "PER"
  | "Bt"
  | "Ge"
  | "Ls"
  | "Cl"
  | "Na"
>;

// Módulo Procesamiento
export type ProcesamientoInput = Pick<
  StructuralSummaryData,
  "W" | "D" | "Dd" | "Zf" | "Zd" | "PSV"
>;

// Módulo Autopercepción
export type AutopercepcionInput = Pick<
  StructuralSummaryData,
  "FV" | "VF" | "V" | "Fd" | "An" | "Xy" | "MOR" | "H" | "(H)" | "Hd" | "(Hd)"
>;

// Módulo Afectos
export type AfectosInput = Pick<
  StructuralSummaryData,
  "FC" | "CF" | "C" | "Cn" | "FC'" | "C'F" | "C'" | "CP" | AfectosShKey
>;

// Tipo para DetSH
export type AfectosShKey =
  | "FC'"
  | "C'F"
  | "C'"
  | "FV"
  | "VF"
  | "V"
  | "FT"
  | "TF"
  | "T"
  | "FY"
  | "YF"
  | "Y";
