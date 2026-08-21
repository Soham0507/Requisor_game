import { db, gamesTable, type InsertGame } from "@workspace/db";
import { sql } from "drizzle-orm";

const GAMES: InsertGame[] = [
  {
    slug: "space-shooter-1",
    name: "Space Shooter",
    tagline: "Fast-paced 2D space shooter with a neon HUD dashboard.",
    thumbnailUrl: null,
    folderPath: "artifacts/citrus-landing/game/Space-Shooter-1",
    previewBasePath: "/game-previews/space-shooter-1/",
    brandSupport: "full",
    defaultPrimaryColor: "#00f0ff",
    defaultSecondaryColor: "#ff2bd6",
    defaultAccentColor: "#a6ff3d",
    defaultLogoUrl: null,
    defaultHeading: "Space Shooter",
    priceCents: 4900,
  },
  {
    slug: "cyber-adventure",
    name: "Cyber Adventure",
    tagline: "Temple-run style endless runner with a cybersecurity theme. Dodge phishing attacks, block malware.",
    thumbnailUrl: null,
    folderPath: "artifacts/citrus-landing/game/Cybergame",
    previewBasePath: null,
    brandSupport: "chrome_only",
    defaultPrimaryColor: "#a855f7",
    defaultSecondaryColor: "#ec4899",
    defaultAccentColor: "#a855f7",
    defaultLogoUrl: null,
    defaultHeading: "Sentinel One",
    priceCents: 5900,
  },
  {
    slug: "basketball-shootout",
    name: "Basketball Shootout",
    tagline: "Gesture-based controls, real-time scoring, and smooth gameplay mechanics.",
    thumbnailUrl: null,
    folderPath: "artifacts/citrus-landing/game/AI-versionBB2-5",
    previewBasePath: null,
    brandSupport: "chrome_only",
    defaultPrimaryColor: "#f97316",
    defaultSecondaryColor: "#fbbf24",
    defaultAccentColor: "#f97316",
    defaultLogoUrl: null,
    defaultHeading: "47-Day Shootout",
    priceCents: 4900,
  },
  {
    slug: "gesture-space-war",
    name: "Gesture Space War",
    tagline: "Webcam gesture-controlled space combat.",
    thumbnailUrl: null,
    folderPath: "artifacts/citrus-landing/game/Gesture-Space-War",
    previewBasePath: null,
    brandSupport: "chrome_only",
    defaultPrimaryColor: "#22c55e",
    defaultSecondaryColor: "#38bdf8",
    defaultAccentColor: "#22c55e",
    defaultLogoUrl: null,
    defaultHeading: "Space Survivor",
    priceCents: 5900,
  },
  {
    slug: "zombie-hunter",
    name: "Zombie Hunter",
    tagline: "3D zombie shooter built with Three.js.",
    thumbnailUrl: null,
    folderPath: "artifacts/citrus-landing/game/zombie",
    previewBasePath: null,
    brandSupport: "chrome_only",
    defaultPrimaryColor: "#ff4444",
    defaultSecondaryColor: "#00ff88",
    defaultAccentColor: "#ff4444",
    defaultLogoUrl: null,
    defaultHeading: "Zombie Hunter",
    priceCents: 3900,
  },
];

async function main() {
  for (const game of GAMES) {
    await db
      .insert(gamesTable)
      .values(game)
      .onConflictDoUpdate({
        target: gamesTable.slug,
        set: { ...game, slug: sql`excluded.slug` },
      });
    console.log(`Seeded game: ${game.slug}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
