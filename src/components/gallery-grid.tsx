"use client";

import { useMemo, useState } from "react";
import { PieceCard } from "@/components/piece-card";
import { pieces, uniqueTraits } from "@/lib/collection";
import { Button } from "@/components/ui/button";

const weatherFilters = ["All", ...uniqueTraits("weather")];

export function GalleryGrid() {
  const [weather, setWeather] = useState("All");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    return pieces.filter((piece) => {
      const weatherOk = weather === "All" || piece.weather === weather;
      const q = query.trim().toLowerCase();
      const queryOk =
        !q ||
        piece.name.toLowerCase().includes(q) ||
        piece.setting.toLowerCase().includes(q) ||
        piece.companion.toLowerCase().includes(q) ||
        piece.signal.toLowerCase().includes(q);
      return weatherOk && queryOk;
    });
  }, [weather, query]);

  return (
    <section id="rooms" className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] tracking-[0.22em] text-primary uppercase">
            50 rooms · unlimited mints
          </p>
          <h2 className="font-heading mt-1 text-3xl">The collection</h2>
        </div>
        <label className="block sm:w-64">
          <span className="sr-only">Search rooms</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search setting, signal, companion"
            className="h-9 w-full rounded-lg border border-input bg-background/60 px-3 text-sm outline-none placeholder:text-muted-foreground/70 focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </label>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {weatherFilters.map((filter) => (
          <Button
            key={filter}
            size="sm"
            variant={weather === filter ? "default" : "outline"}
            onClick={() => setWeather(filter)}
          >
            {filter}
          </Button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
          <p className="font-heading text-xl">No rooms on this frequency.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try another weather filter or clear the search.
          </p>
          <Button className="mt-5" variant="outline" onClick={() => { setWeather("All"); setQuery(""); }}>
            Reset tuner
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((piece) => (
            <PieceCard key={piece.id} piece={piece} />
          ))}
        </div>
      )}
    </section>
  );
}
