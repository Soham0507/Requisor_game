import path from "path";
import express, { Router, type IRouter } from "express";

// The bundled server always lands at `artifacts/api-server/dist/index.mjs`
// (see build.mjs), so three levels up from this file's runtime directory is
// the repo root regardless of dev vs. prod.
const repoRoot = path.resolve(import.meta.dirname, "../../..");

// Every game's static build is mounted here so the branding customizer can
// embed it in a live, re-themeable iframe — each implements the
// CDH_BRAND_READY / CDH_BRAND_UPDATE postMessage protocol via its own
// src/brand-bridge.ts (or brand-bridge.js for zombie), see
// game/BRANDING_CONTRACT.md. Rebuild a game with
// `BASE_PATH=/game-previews/<slug>/ vite build` (or `--base=` for configs
// that don't read BASE_PATH) whenever its source changes — these are static
// snapshots, not live dev servers.
const GAME_PREVIEWS: { slug: string; distDir: string }[] = [
  {
    slug: "space-shooter-1",
    distDir: path.join(
      repoRoot,
      "artifacts/citrus-landing/game/Space-Shooter-1/Space-Shooter-1/artifacts/game-dashboard/dist/public",
    ),
  },
  {
    slug: "cyber-adventure",
    distDir: path.join(
      repoRoot,
      "artifacts/citrus-landing/game/Cybergame/Cybergame/artifacts/gesturesec-runner/dist/public",
    ),
  },
  {
    slug: "basketball-shootout",
    distDir: path.join(
      repoRoot,
      "artifacts/citrus-landing/game/AI-versionBB2-5/AI-versionBB2-5/dist/public",
    ),
  },
  {
    slug: "gesture-space-war",
    distDir: path.join(
      repoRoot,
      "artifacts/citrus-landing/game/Gesture-Space-War/Gesture-Space-War/artifacts/space-game/dist/public",
    ),
  },
  {
    slug: "zombie-hunter",
    // Plain static game (no build step) — index.html + assets copied as-is.
    distDir: path.join(repoRoot, "artifacts/citrus-landing/public/game-previews/zombie-hunter"),
  },
];

const router: IRouter = Router();

for (const { slug, distDir } of GAME_PREVIEWS) {
  router.use(`/game-previews/${slug}`, express.static(distDir));
}

export default router;
