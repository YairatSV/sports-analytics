-- PostgreSQL initial schema. Apply through your managed database console/migrations.
CREATE TABLE IF NOT EXISTS sports (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS competitions (
    id BIGSERIAL PRIMARY KEY,
    sport_id TEXT NOT NULL REFERENCES sports(id),
    provider TEXT NOT NULL,
    provider_competition_id TEXT NOT NULL,
    name TEXT NOT NULL,
    UNIQUE (provider, sport_id, provider_competition_id)
);

CREATE TABLE IF NOT EXISTS teams (
    id BIGSERIAL PRIMARY KEY,
    sport_id TEXT NOT NULL REFERENCES sports(id),
    provider TEXT NOT NULL,
    provider_team_id TEXT NOT NULL,
    name TEXT NOT NULL,
    UNIQUE (provider, sport_id, provider_team_id)
);

CREATE TABLE IF NOT EXISTS seasons (
    id BIGSERIAL PRIMARY KEY,
    competition_id BIGINT NOT NULL REFERENCES competitions(id),
    name TEXT NOT NULL,
    start_date DATE,
    end_date DATE
);

CREATE TABLE IF NOT EXISTS matches (
    id BIGSERIAL PRIMARY KEY,
    competition_id BIGINT NOT NULL REFERENCES competitions(id),
    season_id BIGINT REFERENCES seasons(id),
    provider TEXT NOT NULL,
    provider_match_id TEXT NOT NULL,
    home_team_id BIGINT REFERENCES teams(id),
    away_team_id BIGINT REFERENCES teams(id),
    start_time TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'scheduled',
    home_score INTEGER,
    away_score INTEGER,
    provider_updated_at TIMESTAMPTZ,
    fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (provider, provider_match_id)
);

CREATE TABLE IF NOT EXISTS match_events (
    id BIGSERIAL PRIMARY KEY,
    match_id BIGINT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    provider_event_id TEXT,
    event_type TEXT NOT NULL,
    period TEXT,
    clock TEXT,
    description TEXT,
    occurred_at TIMESTAMPTZ,
    fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS team_statistics (
    id BIGSERIAL PRIMARY KEY,
    match_id BIGINT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    team_id BIGINT NOT NULL REFERENCES teams(id),
    statistic_key TEXT NOT NULL,
    statistic_value NUMERIC,
    fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (match_id, team_id, statistic_key)
);

CREATE TABLE IF NOT EXISTS predictions (
    id BIGSERIAL PRIMARY KEY,
    match_id BIGINT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    model_name TEXT NOT NULL,
    model_version TEXT NOT NULL,
    probabilities JSONB NOT NULL,
    input_snapshot JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS data_sources (
    id BIGSERIAL PRIMARY KEY,
    provider TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    provider_updated_at TIMESTAMPTZ,
    response_status INTEGER,
    error_message TEXT
);

CREATE INDEX IF NOT EXISTS idx_matches_start_time ON matches(start_time);
CREATE INDEX IF NOT EXISTS idx_matches_competition_status ON matches(competition_id, status);
CREATE INDEX IF NOT EXISTS idx_match_events_match_id ON match_events(match_id);
CREATE INDEX IF NOT EXISTS idx_predictions_match_id_created ON predictions(match_id, created_at DESC);

INSERT INTO sports (id, name) VALUES
    ('soccer', 'Fútbol'), ('nfl', 'NFL'), ('nba', 'NBA')
ON CONFLICT (id) DO NOTHING;
