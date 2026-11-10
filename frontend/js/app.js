import { soccerOutcomeProbabilities } from "./soccer.js";
import { nflWinProbabilities } from "./nfl.js";
import { estimateGameTotals } from "./nba.js";
import { fetchScoreboard, SPORT_OPTIONS } from "./live-scores.js";

const state = { sport: "soccer", league: "eng.1", timer: null, controller: null };
const list = document.querySelector("#score-list");
const statusText = document.querySelector("#feed-status");
const statusDot = document.querySelector("#feed-dot");
const updatedAt = document.querySelector("#updated-at");
const leagueWrap = document.querySelector("#league-wrap");
const leagueSelect = document.querySelector("#league-select");
const refreshButton = document.querySelector("#refresh-button");

const mathChecks = {
  soccer: soccerOutcomeProbabilities(1.4, 1.1),
  nfl: nflWinProbabilities(3, 13),
  nba: estimateGameTotals(112, 108)
};
console.info("Motores matemáticos cargados", mathChecks);

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function renderEvents(events) {
  list.replaceChildren();
  if (!events.length) {
    list.append(makeElement("p", "empty-state", "No hay partidos disponibles para esta competición en la respuesta actual."));
    return;
  }
  for (const event of events) {
    const card = makeElement("article", "score-card");
    const top = makeElement("div", "score-card-top");
    const stateLabel = makeElement("span", event.live ? "match-state live" : "match-state", event.live ? "EN JUEGO · " + event.state : event.state);
    top.append(stateLabel);
    if (event.date) {
      const date = new Date(event.date);
      top.append(makeElement("time", "match-date", Number.isNaN(date.getTime()) ? "" : date.toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" })));
    }
    const matchup = makeElement("div", "matchup");
    const teams = makeElement("div", "teams");
    teams.append(makeElement("strong", "team-name", event.home));
    teams.append(makeElement("strong", "team-name", event.away));
    const scores = makeElement("div", "scores");
    scores.append(makeElement("span", "", event.homeScore));
    scores.append(makeElement("span", "", event.awayScore));
    matchup.append(teams, scores);
    card.append(top, matchup);
    list.append(card);
  }
}

async function loadScores() {
  if (state.controller) state.controller.abort();
  state.controller = new AbortController();
  statusText.textContent = "Consultando fuente…";
  statusDot.classList.remove("error");
  refreshButton.disabled = true;
  try {
    const events = await fetchScoreboard(state.sport, state.league, state.controller.signal);
    renderEvents(events);
    const now = new Date();
    updatedAt.textContent = "Última consulta: " + now.toLocaleTimeString("es-MX");
    statusText.textContent = "Fuente disponible · " + events.length + " partidos";
  } catch (error) {
    if (error.name === "AbortError") return;
    statusText.textContent = "Fuente no disponible";
    statusDot.classList.add("error");
    list.replaceChildren(makeElement("p", "empty-state", "No fue posible consultar los marcadores. Comprueba tu conexión o intenta actualizar de nuevo."));
    console.error("Error consultando marcador:", error);
  } finally {
    refreshButton.disabled = false;
  }
}

function scheduleRefresh() {
  if (state.timer) window.clearInterval(state.timer);
  state.timer = window.setInterval(loadScores, 60000);
}

document.querySelectorAll(".sport-tab").forEach(button => {
  button.addEventListener("click", () => {
    state.sport = button.dataset.sport;
    document.querySelectorAll(".sport-tab").forEach(tab => tab.classList.toggle("active", tab === button));
    leagueWrap.hidden = state.sport !== "soccer";
    loadScores();
  });
});
leagueSelect.addEventListener("change", () => {
  state.league = leagueSelect.value;
  loadScores();
});
refreshButton.addEventListener("click", loadScores);

loadScores();
scheduleRefresh();
