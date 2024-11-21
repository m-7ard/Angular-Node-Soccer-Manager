CREATE TABLE player (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    active_since DATETIME NOT NULL,
    number INT(11) NOT NULL,
    images VARCHAR(1028)
);