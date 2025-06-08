import db from "#db/client";

export async function createPlaylistTrack(playlistId, trackId) {
  const sql = `INSERT into playlists_tracks(playlist_id, track_id)
    VALUES($1, $2)
    RETURNING *
    `;
  const {
    rows: [playlist_track],
  } = await db.query(sql, [playlistId, trackId]);
  return playlist_track;
}
