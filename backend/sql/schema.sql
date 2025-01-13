CREATE TABLE team (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    date_founded DATETIME NOT NULL
);

CREATE TABLE player (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    active_since DATETIME NOT NULL,
    images VARCHAR(1028)
);

CREATE TABLE team_membership (
    id VARCHAR(255) PRIMARY KEY,
    team_id VARCHAR(255) NOT NULL,
    player_id VARCHAR(255) NOT NULL,
    active_from DATETIME NOT NULL,
    active_to DATETIME NULL,
    FOREIGN KEY (team_id) REFERENCES team(id),
    FOREIGN KEY (player_id) REFERENCES player(id)
);

CREATE TABLE users (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    date_created DATETIME NOT NULL,
    is_admin BIT NOT NULL
);

CREATE TABLE matches (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    home_team_id VARCHAR(255) NOT NULL,
    away_team_id VARCHAR(255) NOT NULL,
    venue VARCHAR(255) NOT NULL,
    scheduled_date DATETIME NOT NULL,
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

CREATE TABLE match_events (
    id VARCHAR(255) PRIMARY KEY,
    match_id VARCHAR(255) NOT NULL,
    player_id VARCHAR(255) NOT NULL,
    team_id VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    date_occured DATETIME NOT NULL,
    secondary_player_id VARCHAR(255),
    description TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (match_id) REFERENCES matches(id),
    FOREIGN KEY (player_id) REFERENCES player(id),
    FOREIGN KEY (team_id) REFERENCES team(id),
    FOREIGN KEY (secondary_player_id) REFERENCES player(id)
);

CREATE TABLE team_membership_histories (
    id VARCHAR(255) PRIMARY KEY,
    team_membership_id VARCHAR(255) NOT NULL,
    date_effective_from DATETIME NOT NULL,
    number INT(11) NOT NULL,
    position VARCHAR(255) NOT NULL,
    FOREIGN KEY (team_membership_id) REFERENCES team_membership(id),
);
