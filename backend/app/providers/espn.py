from datetime import datetime, timezone
import httpx

BASE_URL = "https://site.api.espn.com/apis/site/v2/sports"

SPORT_PATHS = {
    "nfl": "football/nfl",
    "nba": "basketball/nba",
}

SOCCER_LEAGUES = {
    "eng.1", "esp.1", "mex.1", "usa.1", "uefa.champions",
}


class ProviderError(Exception):
    pass


def _normalize(event: dict, sport: str) -> dict:
    competition = (event.get("competitions") or [{}])[0]
    competitors = competition.get("competitors") or []
    home = next((x for x in competitors if x.get("homeAway") == "home"), None)
    away = next((x for x in competitors if x.get("homeAway") == "away"), None)
    if home is None and competitors:
        home = competitors[0]
    if away is None and len(competitors) > 1:
        away = competitors[1]
    home, away = home or {}, away or {}
    status = competition.get("status") or event.get("status") or {}
    status_type = status.get("type") or {}
    return {
        "id": str(event.get("id", "")),
        "name": event.get("name") or "Partido sin nombre",
        "date": event.get("date"),
        "home": (home.get("team") or {}).get("displayName", "Local"),
        "away": (away.get("team") or {}).get("displayName", "Visitante"),
        "home_score": str(home.get("score")) if home.get("score") is not None else None,
        "away_score": str(away.get("score")) if away.get("score") is not None else None,
        "state": status_type.get("shortDetail") or status_type.get("detail") or "Estado no disponible",
        "completed": bool(status_type.get("completed", False)),
        "live": status_type.get("state") == "in",
        "sport": sport,
        "home_team_provider_id": str((home.get("team") or {}).get("id") or (home.get("team") or {}).get("displayName") or "home"),
        "away_team_provider_id": str((away.get("team") or {}).get("id") or (away.get("team") or {}).get("displayName") or "away"),
    }


async def fetch_scoreboard(sport: str, league: str, timeout: float) -> dict:
    if sport == "soccer":
        if league not in SOCCER_LEAGUES:
            raise ValueError("Competición de fútbol no admitida.")
        path = f"soccer/{league}"
    elif sport in SPORT_PATHS:
        path = SPORT_PATHS[sport]
        league = sport
    else:
        raise ValueError("Deporte no admitido. Usa soccer, nfl o nba.")

    url = f"{BASE_URL}/{path}/scoreboard"
    try:
        async with httpx.AsyncClient(timeout=timeout, headers={"User-Agent": "SPORTS-ANALYTICS/0.1"}) as client:
            response = await client.get(url)
            response.raise_for_status()
            payload = response.json()
    except (httpx.HTTPError, ValueError) as exc:
        raise ProviderError("No fue posible consultar el proveedor deportivo.") from exc

    events = payload.get("events") or []
    return {
        "sport": sport,
        "league": league,
        "source": "ESPN public scoreboard (unofficial)",
        "fetched_at": datetime.now(timezone.utc),
        "count": len(events),
        "matches": [_normalize(event, sport) for event in events],
    }
