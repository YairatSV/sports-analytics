from datetime import datetime
from pydantic import BaseModel


class Match(BaseModel):
    id: str
    name: str
    date: datetime | None = None
    home: str
    away: str
    home_score: str | None = None
    away_score: str | None = None
    state: str
    completed: bool = False
    live: bool = False
    sport: str
    source: str = "ESPN public scoreboard"


class MatchesResponse(BaseModel):
    sport: str
    league: str
    source: str
    fetched_at: datetime
    count: int
    matches: list[Match]
