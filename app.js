import express from "express";
const app = express();
export default app;

import tracksRouter from "#api/tracks";
import playlistsRouter from "#api/playlists";

app.use(express.json());

app.use("/tracks", tracksRouter);
app.use("/playlists", playlistsRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});
