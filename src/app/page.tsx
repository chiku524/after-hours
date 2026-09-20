import Link from "next/link";
import { GalleryGrid } from "@/components/gallery-grid";
import { buttonVariants } from "@/components/ui/button";
import { collection, gifPath, pieces } from "@/lib/collection";
import { cn } from "@/lib/utils";

export default function Home() {
  const featured = pieces[0];

  return (
    <main className="flex flex-1 flex-col">
      <section className="relative min-h-[72vh] overflow-hidden border-b border-border">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/collection/banner.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/20" />
        <div className="relative mx-auto flex min-h-[72vh] max-w-6xl flex-col justify-end gap-8 px-4 py-16 sm:flex-row sm:items-end sm:justify-between sm:px-6">
          <div className="max-w-xl">
            <p className="text-[11px] tracking-[0.28em] text-primary uppercase">
              {collection.symbol} · {collection.standard} · {collection.supply}
            </p>
            <h1 className="font-heading mt-3 text-5xl leading-[0.95] sm:text-7xl">
              {collection.name}
            </h1>
            <p className="mt-4 max-w-md text-sm leading-7 text-foreground/80 sm:text-base">
              {collection.tagline} Fifty unique looping rooms — rain, static,
              last trains, sento steam — each minted as its own open edition.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="#rooms" className={cn(buttonVariants())}>
                Browse 50 loops
              </Link>
              <Link href="/drop" className={cn(buttonVariants({ variant: "outline" }))}>
                Prepare the OpenSea drop
              </Link>
            </div>
          </div>
          <Link
            href={`/piece/${featured.id}`}
            className="hidden w-56 shrink-0 overflow-hidden rounded-xl ring-1 ring-foreground/15 sm:block"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={gifPath(featured.id)}
              alt={featured.name}
              className="aspect-square w-full object-cover"
            />
            <div className="bg-background/85 px-3 py-2 text-xs">
              <p className="tracking-[0.16em] text-primary uppercase">Now looping</p>
              <p className="font-heading text-base">{featured.name}</p>
            </div>
          </Link>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-12 sm:grid-cols-3 sm:px-6">
        <Stat label="Pieces" value="50 unique loops" />
        <Stat label="Edition" value="Open / unlimited" />
        <Stat label="Loop" value={collection.loop} />
      </section>

      <GalleryGrid />
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border px-4 py-4">
      <p className="text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
        {label}
      </p>
      <p className="font-heading mt-1 text-2xl">{value}</p>
    </div>
  );
}
