DROP TABLE IF EXISTS locations;

CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    search_query VARCHAR(255),
    formatted_query VARCHAR(255),
    latitude float,
    longitude float
);

INSERT INTO locations (search_query,formatted_query,latitude,longitude) VALUES ('my city','myyyy city',50.6516,30.115);