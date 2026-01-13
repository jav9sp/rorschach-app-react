export function getDominant(valuesObject: Record<string, number>) {
  const maxValue = Math.max(...Object.values(valuesObject));

  const dominants = Object.entries(valuesObject)
    .filter(([_, v]) => v === maxValue)
    .map(([k]) => k);

  return {
    maxValue,
    dominants,
    isTie: dominants.length > 1,
  };
}
