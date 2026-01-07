export type NormativeRow = {
  VARIABLE: string;
  MEDIA: string;
  DT: string;
  // Campos opcionales
  MIN?: string;
  MAX?: string;
  FREC?: string;
  MEDIANA?: string;
  MODA?: string;
  ASIM?: string;
  KU?: string;
  id?: number;
};

export type JsonNormativeTable = NormativeRow[];

export const COMPARISON_LEVELS = [
  "Marcadamente por debajo",
  "Levemente por debajo",
  "Dentro del rango",
  "Levemente por encima",
  "Marcadamente por encima",
  "Indefinido",
] as const;

export type ComparisonLevel = (typeof COMPARISON_LEVELS)[number];

export type Comparison = {
  VARIABLE: string;
  MEDIA: number;
  DT: number;
  VALOR: number;
  COMPARACION: ComparisonLevel;
};

export type ComparisonMap = {
  [variable: string]: {
    VARIABLE: string;
    MEDIA: number;
    DT: number;
    VALOR: number;
    COMPARACION: ComparisonLevel;
  };
};
