-- TODO
DROP TABLE IF EXISTS playlists_tracks;
DROP TABLE IF EXISTS playlists;
DROP TABLE IF EXISTS tracks;

CREATE TABLE playlists (
    id SERIAL PRIMARY KEY,
    name text NOT NULL,
    description text NOT NULL
);

CREATE TABLE tracks (
    id SERIAL PRIMARY KEY,
    name text NOT NULL,
    duration_ms INT NOT NULL
);

CREATE TABLE playlists_tracks (
    id SERIAL PRIMARY KEY,
    playlist_id integer NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
    track_id integer NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
    UNIQUE (playlist_id, track_id)
);