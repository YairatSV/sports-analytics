from app.providers.espn import _normalize


def test_normalize_soccer_event():
    event = {
        "id": 123,
        "name": "Home vs Away",
        "date": "2026-11-10T18:00:00Z",
        "competitions": [{
            "competitors": [
                {"homeAway": "home", "score": 2, "team": {"displayName": "Home FC"}},
                {"homeAway": "away", "score": 1, "team": {"displayName": "Away FC"}},
            ],
            "status": {"type": {"shortDetail": "Final", "completed": True, "state": "post"}},
        }],
    }
    result = _normalize(event, "soccer")
    assert result["id"] == "123"
    assert result["home"] == "Home FC"
    assert result["away"] == "Away FC"
    assert result["home_score"] == "2"
    assert result["away_score"] == "1"
    assert result["completed"] is True
    assert result["live"] is False


def test_normalize_empty_event_has_safe_defaults():
    result = _normalize({}, "nba")
    assert result["home"] == "Local"
    assert result["away"] == "Visitante"
    assert result["home_score"] is None
    assert result["away_score"] is None
