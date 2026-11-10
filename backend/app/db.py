from datetime import datetime
import asyncpg


async def connect_database(database_url: str):
    return await asyncpg.create_pool(
        dsn=database_url,
        min_size=1,
        max_size=3,
        command_timeout=20,
        statement_cache_size=0,
        server_settings={"application_name": "sports-analytics"},
    )


async def close_database(pool):
    await pool.close()


def _as_datetime(value):
    if not value:
        return None
    if isinstance(value, datetime):
        return value
    return datetime.fromisoformat(str(value).replace("Z", "+00:00"))


def _as_score(value):
    if value is None:
        return None
    try:
        return int(float(value))
    except (TypeError, ValueError):
        return None


def _status(match):
    if match.get("completed"):
        return "final"
    if match.get("live"):
        return "in_progress"
    return "scheduled"


async def save_scoreboard(pool, result: dict):
    sport = result["sport"]
    league = result["league"]
    provider = "espn"
    competition_name = {
        "eng.1": "Premier League",
        "esp.1": "La Liga",
        "mex.1": "Liga MX",
        "usa.1": "MLS",
        "uefa.champions": "UEFA Champions League",
        "nfl": "NFL",
        "nba": "NBA",
    }.get(league, league.upper())

    async with pool.acquire() as conn:
        async with conn.transaction():
            competition_id = await conn.fetchval(
                """
                INSERT INTO competitions (sport_id, provider, provider_competition_id, name)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (provider, sport_id, provider_competition_id)
                DO UPDATE SET name = EXCLUDED.name
                RETURNING id
                """,
                sport, provider, league, competition_name,
            )

            for match in result.get("matches", []):
                home_provider_id = str(match.get("home_team_provider_id") or match["home"])
                away_provider_id = str(match.get("away_team_provider_id") or match["away"])
                home_team_id = await conn.fetchval(
                    """
                    INSERT INTO teams (sport_id, provider, provider_team_id, name)
                    VALUES ($1, $2, $3, $4)
                    ON CONFLICT (provider, sport_id, provider_team_id)
                    DO UPDATE SET name = EXCLUDED.name
                    RETURNING id
                    """,
                    sport, provider, home_provider_id, match["home"],
                )
                away_team_id = await conn.fetchval(
                    """
                    INSERT INTO teams (sport_id, provider, provider_team_id, name)
                    VALUES ($1, $2, $3, $4)
                    ON CONFLICT (provider, sport_id, provider_team_id)
                    DO UPDATE SET name = EXCLUDED.name
                    RETURNING id
                    """,
                    sport, provider, away_provider_id, match["away"],
                )
                await conn.execute(
                    """
                    INSERT INTO matches (
                        competition_id, provider, provider_match_id,
                        home_team_id, away_team_id, start_time, status,
                        home_score, away_score, provider_updated_at, fetched_at
                    )
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
                    ON CONFLICT (provider, provider_match_id)
                    DO UPDATE SET
                        competition_id = EXCLUDED.competition_id,
                        home_team_id = EXCLUDED.home_team_id,
                        away_team_id = EXCLUDED.away_team_id,
                        start_time = EXCLUDED.start_time,
                        status = EXCLUDED.status,
                        home_score = EXCLUDED.home_score,
                        away_score = EXCLUDED.away_score,
                        provider_updated_at = NOW(),
                        fetched_at = NOW()
                    """,
                    competition_id, provider, str(match["id"]),
                    home_team_id, away_team_id, _as_datetime(match.get("date")),
                    _status(match), _as_score(match.get("home_score")),
                    _as_score(match.get("away_score")),
                )

            await conn.execute(
                """
                INSERT INTO data_sources (provider, endpoint, fetched_at, response_status)
                VALUES ($1, $2, NOW(), 200)
                """,
                provider, f"scoreboard/{sport}/{league}",
            )
