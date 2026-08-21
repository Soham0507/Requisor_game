import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "wouter";
import { ArrowLeft } from "lucide-react";
import {
  useGetGame,
  useUpsertBrandingDraft,
  useFinalizeBrandingDraft,
  type Order,
} from "@workspace/api-client-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { getDraftToken } from "@/lib/draft-token";
import { GamePreviewFrame, type BrandThemeMessage } from "@/components/customizer/GamePreviewFrame";
import { BrandingForm } from "@/components/customizer/BrandingForm";
import { OrderSummaryPanel } from "@/components/customizer/OrderSummaryPanel";
import { ContactCustomUiDialog } from "@/components/customizer/ContactCustomUiDialog";

const SAVE_DEBOUNCE_MS = 600;

// Not DB-backed yet — a small client-side default per game, same spirit as
// `defaultHeading`/`defaultPrimaryColor` on the `games` table. brandName is
// kept out of the branding-draft save/finalize payload below (schema has no
// column for it yet), so it lives only in this page's client-side state.
const DEFAULT_BRAND_NAMES: Record<string, string> = {
  "cyber-adventure": "SentinelOne",
  "basketball-shootout": "AppViewX",
};

// Every game now speaks the BRANDING_CONTRACT.md postMessage protocol (see
// each game's brand-bridge), so the live preview works for all of them —
// not just the one `games` row currently marked brandSupport "full". Preview
// bundles are built into citrus-landing/public/game-previews/<slug>/.
const PREVIEW_BASE_PATHS: Record<string, string> = {
  "space-shooter-1": "/game-previews/space-shooter-1/",
  "cyber-adventure": "/game-previews/cyber-adventure/",
  "basketball-shootout": "/game-previews/basketball-shootout/",
  "gesture-space-war": "/game-previews/gesture-space-war/",
  "zombie-hunter": "/game-previews/zombie-hunter/",
};

export default function Customize() {
  const { slug } = useParams<{ slug: string }>();
  const { data: game, isLoading, isError } = useGetGame(slug ?? "");

  const [theme, setTheme] = useState<BrandThemeMessage | null>(null);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const { mutate: saveDraft } = useUpsertBrandingDraft();
  const { mutate: finalizeDraft, isPending: isFinalizing } = useFinalizeBrandingDraft();

  useEffect(() => {
    if (game && !theme) {
      setTheme({
        primaryColor: game.defaultPrimaryColor,
        secondaryColor: game.defaultSecondaryColor,
        accentColor: game.defaultAccentColor,
        logoUrl: game.defaultLogoUrl ?? null,
        brandName: DEFAULT_BRAND_NAMES[game.slug] ?? "",
        heading: game.defaultHeading,
        tagline: "",
      });
    }
  }, [game, theme]);

  const draftToken = useMemo(() => getDraftToken(), []);

  const handleThemeChange = (next: BrandThemeMessage) => {
    setTheme(next);
    if (!game) return;

    clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveDraft(
        {
          data: {
            gameId: game.id,
            draftToken,
            primaryColor: next.primaryColor,
            secondaryColor: next.secondaryColor,
            accentColor: next.accentColor,
            logoDataUrl: next.logoUrl,
            heading: next.heading,
            tagline: next.tagline,
          },
        },
        { onSuccess: (draft) => setDraftId(draft.id) },
      );
    }, SAVE_DEBOUNCE_MS);
  };

  const handleFinalize = () => {
    if (!draftId || !game) return;
    // Payment is bypassed for now (see OrderSummaryPanel) — finalizing a
    // draft immediately unlocks the live link, no Stripe/checkout step yet.
    finalizeDraft({ id: draftId, data: {} }, { onSuccess: (created) => setOrder(created) });
  };

  // The "live link" is just the game's own preview URL with the finalized
  // branding baked in as query params — every game's brand-bridge already
  // reads these on load (see BRANDING_CONTRACT.md), so this works standalone,
  // outside any iframe, with no server-side lookup or persistence required.
  const liveLink = useMemo(() => {
    if (!game || !theme) return null;
    const basePath = PREVIEW_BASE_PATHS[game.slug];
    if (!basePath) return null;
    const params = new URLSearchParams({
      brandName: theme.brandName,
      heading: theme.heading,
      tagline: theme.tagline,
      primaryColor: theme.primaryColor,
      secondaryColor: theme.secondaryColor,
      accentColor: theme.accentColor,
    });
    if (theme.logoUrl) {
      // A user-uploaded logo is a data: URI — far too large to embed
      // directly in a URL (blows past Node's request header size limit,
      // see api-server's /branding-drafts/:id/logo route). Reference the
      // already-persisted draft's logo by URL instead; anything else (e.g.
      // a game's defaultLogoUrl) is already a normal short URL.
      const logoParam =
        theme.logoUrl.startsWith("data:") && draftId
          ? `${window.location.origin}/api/branding-drafts/${draftId}/logo`
          : theme.logoUrl;
      params.set("logo", logoParam);
    }
    return `${window.location.origin}${basePath}?${params.toString()}`;
  }, [game, theme, draftId]);

  if (isLoading || !theme) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="container mx-auto px-6 pt-32 text-center text-muted-foreground">Loading…</main>
      </div>
    );
  }

  if (isError || !game) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="container mx-auto px-6 pt-32 text-center text-destructive">Game not found.</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto px-6 md:px-12 pt-28 pb-24">
        <Link href="/games" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white mb-6">
          <ArrowLeft size={14} /> Back to catalog
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8" style={{ fontFamily: "'PixelGamer', monospace" }}>
          Customize {game.name}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            {PREVIEW_BASE_PATHS[game.slug] ? (
              <GamePreviewFrame previewBasePath={PREVIEW_BASE_PATHS[game.slug]} theme={theme} />
            ) : (
              <div className="rounded-xl border border-white/10 bg-card aspect-video w-full flex items-center justify-center text-center p-8">
                <p className="text-muted-foreground text-sm">
                  Live in-game re-skinning isn't wired up for {game.name} yet — logo and heading
                  changes below will still apply once it is. Try{" "}
                  <Link href="/customize/space-shooter-1" className="text-primary underline">
                    Space Shooter
                  </Link>{" "}
                  for the full live preview.
                </p>
              </div>
            )}

            <BrandingForm theme={theme} onChange={handleThemeChange} canvasReskinSupported={game.brandSupport === "full"} />
          </div>

          <div className="space-y-6">
            <OrderSummaryPanel
              gameName={game.name}
              priceCents={game.priceCents}
              order={order}
              isFinalizing={isFinalizing}
              onFinalize={handleFinalize}
              liveLink={liveLink}
            />
            <div className="text-center">
              <ContactCustomUiDialog gameId={game.id} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
