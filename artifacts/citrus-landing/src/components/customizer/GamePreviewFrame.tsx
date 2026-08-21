import { useEffect, useRef, useState } from "react";

export interface BrandThemeMessage {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl: string | null;
  brandName: string;
  heading: string;
  tagline: string;
}

interface GamePreviewFrameProps {
  previewBasePath: string;
  theme: BrandThemeMessage;
}

/** Embeds the real game and pushes live branding updates via the postMessage contract in game/BRANDING_CONTRACT.md. */
export function GamePreviewFrame({ previewBasePath, theme }: GamePreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === "CDH_BRAND_READY" && event.source === iframeRef.current?.contentWindow) {
        setReady(true);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [previewBasePath]);

  useEffect(() => {
    if (!ready) return;
    iframeRef.current?.contentWindow?.postMessage({ type: "CDH_BRAND_UPDATE", theme }, "*");
  }, [ready, theme]);

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-black aspect-video w-full">
      <iframe
        ref={iframeRef}
        key={previewBasePath}
        src={previewBasePath}
        title="Live game preview"
        className="w-full h-full"
        data-testid="iframe-game-preview"
      />
    </div>
  );
}
