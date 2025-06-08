import { faker } from "@faker-js/faker";

import db from "#db/client";

import { createTrack } from "#db/queries/tracks";
import { createPlaylist } from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  for (let i = 0; i < 20; i++) {
    const track = {
      name: faker.book.title(),
      duration_ms: faker.number.int({ min: 10, max: 200 }),
    };
    await createTrack(track);
  }

  for (let i = 0; i < 10; i++) {
    const playlist = {
      name: faker.location.city(),
      description: faker.location.street(),
    };
    await createPlaylist(playlist);
  }

  // for (let i = 0; i < 15; i++) {
  //   const randomizedPlaylistId = 1 + Math.floor(Math.random() * 10);
  //   const randomizedTrackId = 1 + Math.floor(Math.random() * 20);

  //   const randomizedPlayList = {
  //     playlistId: randomizedPlaylistId,
  //     trackId: randomizedTrackId,
  //   };

  //   await createPlaylistTrack(randomizedPlayList);
  // }

  let success = 0;
  while (success < 15) {
    const randomizedPlaylistId = 1 + Math.floor(Math.random() * 10);
    const randomizedTrackId = 1 + Math.floor(Math.random() * 20);

    const randomizedPlayList = {
      playlistId: randomizedPlaylistId,
      trackId: randomizedTrackId,
    };

    try {
      await createPlaylistTrack(randomizedPlayList);
      success++;
    } catch (err) {
      console.error("Error creating playlist track", err);
    }
  }
}
