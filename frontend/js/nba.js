// Utilidades iniciales para una futura estimación basada en ritmo y eficiencia.
export function estimateTeamPoints(possessions, pointsPerPossession) {
  if (!Number.isFinite(possessions) || possessions <= 0 ||
      !Number.isFinite(pointsPerPossession) || pointsPerPossession < 0) {
    throw new RangeError("Posesiones y eficiencia ofensiva deben ser válidas.");
  }
  return possessions * pointsPerPossession;
}

export function estimateGameTotals(home, away) {
  if (![home, away].every(v => Number.isFinite(v) && v >= 0)) {
    throw new RangeError("Las puntuaciones estimadas deben ser no negativas.");
  }
  return { homePoints: home, awayPoints: away, totalPoints: home + away, pointDifference: home - away };
}
