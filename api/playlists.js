import express from "express";
const router = express.Router();
export default router;

import {
  getPlaylists,
  createPlaylist,
  getPlaylist,
} from "#db/queries/playlists";

import { getTracksByPlaylistId, getTrack } from "#db/queries/tracks";

import { createPlaylistTrack } from "#db/queries/playlists_tracks";

router
  .route("/")
  .get(async (req, res) => {
    const tracks = await getPlaylists();
    res.send(tracks);
  })
  .post(async (req, res) => {
    if (!req.body) return res.status(400).send("Request body not provided");

    if (!req.body.name || !req.body.description)
      return res
        .status(400)
        .send("Request body must have name, and description");

    const { name, description } = req.body;

    const playlist = await createPlaylist({ name, description });
    res.status(201).send(playlist);
  });

router.param("id", async (req, res, next, id) => {
  if (!/^\d+$/.test(id))
    return res.status(400).send("ID must be a postive integer");

  const playlist = await getPlaylist(id);
  if (!playlist) return res.status(404).send("Playlist not found");
  req.playlist = playlist;
  next();
});

router.route("/:id").get(async (req, res) => {
  res.send(req.playlist);
});

router
  .route("/:id/tracks")
  .get(async (req, res) => {
    const tracks = await getTracksByPlaylistId(req.playlist.id);
    res.send(tracks);
  })
  .post(async (req, res, next) => {
    // body must be present
    if (!req.body) {
      return res.status(400).send("Request body is required.");
    }

    const { trackId } = req.body;
    // trackId must be provided
    if (trackId === undefined) {
      return res.status(400).send("Request body requires: trackId");
    }

    // trackId must be a positive integer
    if (!Number.isInteger(trackId) || trackId <= 0) {
      return res.status(400).send("trackId must be a positive integer");
    }

    // track must actually exist
    const track = await getTrack(trackId);
    if (!track) {
      return res.status(400).send("track does not exist");
    }

    // attempt insert, but catch unique‐violation
    try {
      const playlistTrack = await createPlaylistTrack(
        req.playlist.id,
        track.id
      );
      return res.status(201).send(playlistTrack);
    } catch (err) {
      if (err.code === "23505") {
        // duplicate (playlist_id, track_id)
        return res.status(400).send("track is already in playlist");
      }
      // pass on any other error to the global error handler
      next(err);
    }
  });
