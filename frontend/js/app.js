import { soccerOutcomeProbabilities } from "./soccer.js";
import { nflWinProbabilities } from "./nfl.js";
import { estimateGameTotals } from "./nba.js";

// Verificación básica de que los tres motores se cargan correctamente.
const checks = {
  soccer: soccerOutcomeProbabilities(1.4, 1.1),
  nfl: nflWinProbabilities(3, 13),
  nba: estimateGameTotals(112, 108)
};
console.info("SPORTS ANALYTICS: módulos matemáticos cargados.", checks);
