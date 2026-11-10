// Aproximación normal para la diferencia de puntos. No sustituye un modelo por posesiones.
export function normalCdf(x) {
  if (!Number.isFinite(x)) throw new TypeError("x debe ser finito.");
  const sign = x < 0 ? -1 : 1;
  const z = Math.abs(x) / Math.sqrt(2);
  const t = 1 / (1 + 0.3275911 * z);
  const erf = 1 - (((((1.061405429*t-1.453152027)*t)+1.421413741)*t-0.284496736)*t+0.254829592)*t*Math.exp(-z*z);
  return 0.5 * (1 + sign * erf);
}

export function nflWinProbabilities(expectedMargin, marginStdDev) {
  if (!Number.isFinite(expectedMargin) || !Number.isFinite(marginStdDev) || marginStdDev <= 0) {
    throw new RangeError("Se requiere margen esperado finito y desviación estándar positiva.");
  }
  const homeWinOrTie = normalCdf(expectedMargin / marginStdDev);
  return { homeWinOrTie, awayWinOrTie: 1 - homeWinOrTie, model: "normal-margin-approximation" };
}
