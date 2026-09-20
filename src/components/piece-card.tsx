"use client";

import Link from "next/link";
import { padId, stillPath, type Piece } from "@/lib/collection";

export function PieceCard({ piece }: { piece: Piece }) {
  return (
    <Link href={`/piece/${piece.id}`} className="group block">
      <article className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 transition group-hover:-translate-y-0.5 group-hover:ring-primary/40">
        <div className="scan-frame relative aspect-square overflow-hidden bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={stillPath(piece.id)}
            alt={piece.name}
            className="h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-2.5">
            <span className="rounded-full bg-black/55 px-2 py-0.5 font-mono text-[10px] tracking-[0.18em] text-primary">
              {padId(piece.id)}/50
            </span>
            <span className="rounded-full bg-black/55 px-2 py-0.5 text-[10px] tracking-[0.14em] text-foreground/80 uppercase">
              {piece.weather}
            </span>
          </div>
        </div>
        <div className="space-y-1 px-3 py-3">
          <h2 className="font-heading text-[1.05rem] leading-tight">{piece.name}</h2>
          <p className="text-[11px] tracking-wide text-muted-foreground">
            {piece.hour} · {piece.setting} · {piece.signal}
          </p>
        </div>
      </article>
    </Link>
  );
}
