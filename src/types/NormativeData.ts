export type FilaNormativa = {
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

export type TablaNormativaJson = FilaNormativa[];

export type Comparacion = {
  VARIABLE: string;
  MEDIA: number | string;
  DT: number | string;
  VALOR: number | string;
  COMPARACION: string;
};
