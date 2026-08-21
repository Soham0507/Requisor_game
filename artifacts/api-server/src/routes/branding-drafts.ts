import { Router, type IRouter } from "express";
import { and, eq } from "drizzle-orm";
import { db, brandingDraftsTable, gamesTable, ordersTable } from "@workspace/db";
import {
  UpsertBrandingDraftBody,
  UpsertBrandingDraftResponse,
  GetBrandingDraftResponse,
  FinalizeBrandingDraftBody,
  FinalizeBrandingDraftResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/branding-drafts", async (req, res) => {
  const body = UpsertBrandingDraftBody.parse(req.body);

  const [existing] = await db
    .select()
    .from(brandingDraftsTable)
    .where(
      and(
        eq(brandingDraftsTable.gameId, body.gameId),
        eq(brandingDraftsTable.draftToken, body.draftToken),
        eq(brandingDraftsTable.status, "draft"),
      ),
    )
    .limit(1);

  const values = {
    gameId: body.gameId,
    draftToken: body.draftToken,
    primaryColor: body.primaryColor,
    secondaryColor: body.secondaryColor,
    accentColor: body.accentColor,
    logoDataUrl: body.logoDataUrl ?? null,
    heading: body.heading,
    tagline: body.tagline ?? null,
    updatedAt: new Date(),
  };

  const [draft] = existing
    ? await db
        .update(brandingDraftsTable)
        .set(values)
        .where(eq(brandingDraftsTable.id, existing.id))
        .returning()
    : await db.insert(brandingDraftsTable).values(values).returning();

  res.json(UpsertBrandingDraftResponse.parse(draft));
});

router.get("/branding-drafts/:id", async (req, res) => {
  const [draft] = await db
    .select()
    .from(brandingDraftsTable)
    .where(eq(brandingDraftsTable.id, req.params.id))
    .limit(1);

  if (!draft) {
    res.status(404).json({ error: "Draft not found" });
    return;
  }

  res.json(GetBrandingDraftResponse.parse(draft));
});

// Serves an already-persisted draft's logo by URL instead of embedding the
// base64 data URI in the live link query string, which blows past Node's
// request header size limit (431) for anything but a tiny image.
router.get("/branding-drafts/:id/logo", async (req, res) => {
  const [draft] = await db
    .select({ logoDataUrl: brandingDraftsTable.logoDataUrl })
    .from(brandingDraftsTable)
    .where(eq(brandingDraftsTable.id, req.params.id))
    .limit(1);

  const match = draft?.logoDataUrl ? /^data:(.+?);base64,(.+)$/.exec(draft.logoDataUrl) : null;
  if (!match) {
    res.status(404).end();
    return;
  }

  const [, mimeType, base64Data] = match;
  res.setHeader("Content-Type", mimeType);
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  res.send(Buffer.from(base64Data, "base64"));
});

router.post("/branding-drafts/:id/finalize", async (req, res) => {
  const body = FinalizeBrandingDraftBody.parse(req.body ?? {});

  const [draft] = await db
    .select()
    .from(brandingDraftsTable)
    .where(eq(brandingDraftsTable.id, req.params.id))
    .limit(1);

  if (!draft) {
    res.status(404).json({ error: "Draft not found" });
    return;
  }

  const [game] = await db.select().from(gamesTable).where(eq(gamesTable.id, draft.gameId)).limit(1);

  if (!game) {
    res.status(404).json({ error: "Game not found" });
    return;
  }

  await db
    .update(brandingDraftsTable)
    .set({ status: "finalized", updatedAt: new Date() })
    .where(eq(brandingDraftsTable.id, draft.id));

  const [order] = await db
    .insert(ordersTable)
    .values({
      brandingDraftId: draft.id,
      gameId: game.id,
      totalAmountCents: game.priceCents,
      contactEmail: body.contactEmail ?? null,
    })
    .returning();

  res.json(FinalizeBrandingDraftResponse.parse(order));
});

export default router;
