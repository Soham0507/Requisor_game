import { Link } from "wouter";
import { useListGames } from "@workspace/api-client-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`;
}

export default function GamesCatalog() {
  const { data: games, isLoading, isError } = useListGames();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto px-6 md:px-12 pt-32 pb-24">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'PixelGamer', monospace" }}>
            Pick a game to brand
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Choose a game, customize its logo, colors, and heading, try it live, then finalize your branding.
          </p>
        </div>

        {isLoading && <p className="text-center text-muted-foreground">Loading catalog…</p>}
        {isError && <p className="text-center text-destructive">Couldn't load the game catalog. Please try again.</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {games?.map((game) => (
            <Card key={game.id} className="p-6 flex flex-col bg-card border-white/10">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-white">{game.name}</h3>
                {game.brandSupport === "full" ? (
                  <Badge className="bg-primary/20 text-primary border-primary/40">Live re-skin</Badge>
                ) : (
                  <Badge variant="secondary">Coming soon</Badge>
                )}
              </div>
              <p className="text-muted-foreground text-sm flex-grow mb-5">{game.tagline}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-white">{formatPrice(game.priceCents)}</span>
                <Link href={`/customize/${game.slug}`}>
                  <Button data-testid={`button-customize-${game.slug}`}>Customize</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
