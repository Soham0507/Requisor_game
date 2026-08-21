import { useRef } from "react";
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { BrandThemeMessage } from "./GamePreviewFrame";

const MAX_LOGO_DIMENSION = 256;

interface BrandingFormProps {
  theme: BrandThemeMessage;
  onChange: (theme: BrandThemeMessage) => void;
  canvasReskinSupported: boolean;
}

/** Resizes an image file down to a small square data URL so it can be stored as `logoDataUrl` without an object-storage integration. */
function resizeImageToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, MAX_LOGO_DIMENSION / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/png"));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function BrandingForm({ theme, onChange, canvasReskinSupported }: BrandingFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof BrandThemeMessage>(key: K, value: BrandThemeMessage[K]) =>
    onChange({ ...theme, [key]: value });

  const handleLogoPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await resizeImageToDataUrl(file);
    set("logoUrl", dataUrl);
  };

  return (
    <div className="space-y-6">
      {!canvasReskinSupported && (
        <p className="text-xs text-muted-foreground bg-white/5 border border-white/10 rounded-md px-3 py-2">
          Full in-game re-skin isn't wired up for this title yet — logo and heading still update live below.
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="input-brand-name">Brand name</Label>
        <Input
          id="input-brand-name"
          data-testid="input-brand-name"
          value={theme.brandName}
          onChange={(e) => set("brandName", e.target.value)}
          placeholder="e.g. Acme Corp"
          maxLength={40}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="input-heading">Game title</Label>
        <Input
          id="input-heading"
          data-testid="input-heading"
          value={theme.heading}
          onChange={(e) => set("heading", e.target.value)}
          maxLength={40}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="input-tagline">Tagline</Label>
        <Input
          id="input-tagline"
          data-testid="input-tagline"
          value={theme.tagline}
          onChange={(e) => set("tagline", e.target.value)}
          maxLength={60}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="input-primary-color">Primary</Label>
          <Input
            id="input-primary-color"
            data-testid="input-primary-color"
            type="color"
            value={theme.primaryColor}
            onChange={(e) => set("primaryColor", e.target.value)}
            className="h-10 p-1"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="input-secondary-color">Secondary</Label>
          <Input
            id="input-secondary-color"
            data-testid="input-secondary-color"
            type="color"
            value={theme.secondaryColor}
            onChange={(e) => set("secondaryColor", e.target.value)}
            className="h-10 p-1"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="input-accent-color">Accent</Label>
          <Input
            id="input-accent-color"
            data-testid="input-accent-color"
            type="color"
            value={theme.accentColor}
            onChange={(e) => set("accentColor", e.target.value)}
            className="h-10 p-1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Logo</Label>
        <div className="flex items-center gap-3">
          {theme.logoUrl && (
            <img src={theme.logoUrl} alt="Logo preview" className="w-10 h-10 rounded-md object-cover border border-white/10" />
          )}
          <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} data-testid="button-upload-logo">
            <Upload size={14} /> Upload logo
          </Button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoPick} />
        </div>
      </div>
    </div>
  );
}
