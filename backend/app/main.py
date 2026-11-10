import asyncio
import time
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .providers.espn import fetch_scoreboard, ProviderError, SOCCER_LEAGUES
from .schemas import MatchesResponse

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description="API inicial para marcadores y análisis de fútbol, NFL y NBA.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)

_cache: dict[str, tuple[float, dict]] = {}
_cache_lock = asyncio.Lock()


@app.get("/health")
async def health():
    return {"status": "ok", "service": settings.app_name, "version": "0.1.0"}


@app.get("/api/v1/sports")
async def sports():
    return {
        "sports": [
            {"id": "soccer", "name": "Fútbol", "leagues": sorted(SOCCER_LEAGUES)},
            {"id": "nfl", "name": "NFL"},
            {"id": "nba", "name": "NBA"},
        ]
    }


@app.get("/api/v1/matches", response_model=MatchesResponse)
async def matches(
    sport: str = Query(..., pattern="^(soccer|nfl|nba)$"),
    league: str = Query("eng.1", min_length=2, max_length=40),
):
    cache_key = f"{sport}:{league if sport == 'soccer' else sport}"
    now = time.monotonic()
    async with _cache_lock:
        cached = _cache.get(cache_key)
        if cached and now - cached[0] < settings.cache_ttl_seconds:
            return cached[1]

    try:
        result = await fetch_scoreboard(sport, league, settings.espn_timeout_seconds)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except ProviderError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    async with _cache_lock:
        _cache[cache_key] = (time.monotonic(), result)
    return result
