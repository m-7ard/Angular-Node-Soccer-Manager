CREATE TABLE matches (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    home_team_id VARCHAR(255) NOT NULL,
    away_team_id VARCHAR(255) NOT NULL,
    venue VARCHAR(255) NOT NULL,
    scheduled_date DATE NOT NULL,
    start_date DATETIME NULL,
    end_date DATETIME NULL,
    status VARCHAR(50) NOT NULL,
    home_team_score INT NULL,
    away_team_score INT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (home_team_id) REFERENCES team(id),
    FOREIGN KEY (away_team_id) REFERENCES team(id)
);
