type DependenceIndicator =
  | "P_mayor_que_A"
  | "SumT_elevado"
  | "Populares_elevados"
  | "Ego_disminuido"
  | "FD_presente";

export function assessDependence(
  a: number,
  p: number,
  sumT: number,
  populares: string,
  ego: string,
  fd: number
): {
  indicators: DependenceIndicator[];
  count: number;
} {
  const indicators: DependenceIndicator[] = [];

  if (p > a + 1) indicators.push("P_mayor_que_A");
  if (sumT > 1) indicators.push("SumT_elevado");
  if (["Levemente por encima", "Marcadamente por encima"].includes(populares))
    indicators.push("Populares_elevados");
  if (["Levemente por debajo", "Marcadamente por debajo"].includes(ego))
    indicators.push("Ego_disminuido");
  if (fd > 0) indicators.push("FD_presente");

  return {
    indicators,
    count: indicators.length,
  };
}
