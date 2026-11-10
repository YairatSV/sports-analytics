// Modelo inicial: Poisson independiente. Las tasas esperadas deben provenir de datos validados.
export function poissonProbability(goals, lambda) {
  if (!Number.isInteger(goals) || goals < 0 || !Number.isFinite(lambda) || lambda < 0) {
    throw new RangeError("Parámetros Poisson inválidos.");
  }
  if (lambda === 0) return goals === 0 ? 1 : 0;
  let factorial = 1;
  for (let i = 2; i <= goals; i += 1) factorial *= i;
  return Math.exp(-lambda) * (lambda ** goals) / factorial;
}

export function soccerOutcomeProbabilities(homeLambda, awayLambda, maxGoals = 15) {
  if (![homeLambda, awayLambda].every(v => Number.isFinite(v) && v >= 0)) {
    throw new RangeError("Las medias de goles deben ser números no negativos.");
  }
  if (!Number.isInteger(maxGoals) || maxGoals < 1 || maxGoals > 30) {
    throw new RangeError("maxGoals debe estar entre 1 y 30.");
  }
  let home = 0, draw = 0, away = 0, coveredMass = 0;
  for (let h = 0; h <= maxGoals; h += 1) {
    const ph = poissonProbability(h, homeLambda);
    for (let a = 0; a <= maxGoals; a += 1) {
      const p = ph * poissonProbability(a, awayLambda);
      coveredMass += p;
      if (h > a) home += p;
      else if (h === a) draw += p;
      else away += p;
    }
  }
  return { home, draw, away, coveredMass, omittedMass: Math.max(0, 1 - coveredMass) };
}
