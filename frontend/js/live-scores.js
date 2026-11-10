import { API_BASE } from "./config.js";

// Fuente de respaldo gratuita: endpoint público no oficial de ESPN.
const ESPN_BASE = "https://site.api.espn.com/apis/site/v2/sports";
export const SPORT_OPTIONS = {
  soccer: {
    label: "Fútbol",
    leagues: [
      { id: "eng.1", name: "Premier League" },
      { id: "esp.1", name: "LaLiga" },
      { id: "mex.1", name: "Liga MX" },
      { id: "usa.1", name: "MLS" },
      { id: "uefa.champions", name: "UEFA Champions League" }
    ]
  },
  nfl: { label: "NFL", path: "football/nfl" },
  nba: { label: "NBA", path: "basketball/nba" }
};

function normalizeDirectEvent(event, sport) {
  const competition = event.competitions?.[0] ?? {};
  const competitors = competition.competitors ?? [];
  const home = competitors.find(team => team.homeAway === "home") ?? competitors[0] ?? {};
  const away = competitors.find(team => team.homeAway === "away") ?? competitors[1] ?? {};
  const status = competition.status?.type ?? event.status?.type ?? {};
  return {
    id: String(event.id ?? ""),
    name: event.name ?? "Partido sin nombre",
    date: event.date ?? null,
    home: home.team?.displayName ?? home.team?.name ?? "Local",
    away: away.team?.displayName ?? away.team?.name ?? "Visitante",
    homeScore: home.score ?? "—",
    awayScore: away.score ?? "—",
    state: status.shortDetail ?? status.detail ?? status.description ?? "Estado no disponible",
    completed: Boolean(status.completed),
    live: status.state === "in",
    sport
  };
}

function normalizeBackendMatch(match) {
  return {
    id: match.id,
    name: match.name,
    date: match.date,
    home: match.home,
    away: match.away,
    homeScore: match.home_score ?? "—",
    awayScore: match.away_score ?? "—",
    state: match.state,
    completed: Boolean(match.completed),
    live: Boolean(match.live),
    sport: match.sport
  };
}

export async function fetchScoreboard(sport, league = "eng.1", signal) {
  const config = SPORT_OPTIONS[sport];
  if (!config) throw new Error("Deporte no soportado.");

  if (API_BASE) {
    const params = new URLSearchParams({ sport });
    if (sport === "soccer") params.set("league", league);
    const response = await fetch(`${API_BASE.replace(/\/$/, "")}/api/v1/matches?${params}`, {
      headers: { Accept: "application/json" }, cache: "no-store", signal
    });
    if (!response.ok) throw new Error(`El backend respondió HTTP ${response.status}.`);
    const payload = await response.json();
    return (payload.matches ?? []).map(normalizeBackendMatch);
  }

  const path = sport === "soccer" ? `soccer/${encodeURIComponent(league)}` : config.path;
  const response = await fetch(`${ESPN_BASE}/${path}/scoreboard`, {
    headers: { Accept: "application/json" }, cache: "no-store", signal
  });
  if (!response.ok) throw new Error(`La fuente respondió HTTP ${response.status}.`);
  const payload = await response.json();
  return (payload.events ?? []).map(event => normalizeDirectEvent(event, sport));
}
