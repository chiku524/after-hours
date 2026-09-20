import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  collection,
  getPiece,
  metadataPath,
  padId,
  pieces,
  stillPath,
} from "@/lib/collection";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return pieces.map((piece) => ({ id: String(piece.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const piece = getPiece(Number(id));
  if (!piece) return {};
  return {
    title: `#${padId(piece.id)} ${piece.name}`,
    description: piece.blurb,
  };
}

const traits: Array<[string, keyof NonNullable<ReturnType<typeof getPiece>>]> = [
  ["Setting", "setting"],
  ["Weather", "weather"],
  ["Companion", "companion"],
  ["Light", "light"],
  ["Signal", "signal"],
  ["Hour", "hour"],
  ["Mood", "mood"],
  ["Palette", "palette"],
];

export default async function PiecePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const piece = getPiece(Number(id));
  if (!piece) notFound();

  const prev = getPiece(piece.id === 1 ? 50 : piece.id - 1);
  const next = getPiece(piece.id === 50 ? 1 : piece.id + 1);

  return (
    <main className="mx-auto grid w-full max-w-6xl flex-1 gap-10 px-4 py-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:px-6">
      <div>
        <div className="scan-frame overflow-hidden rounded-2xl bg-black ring-1 ring-foreground/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={stillPath(piece.id)}
            alt={piece.name}
            className="aspect-square w-full object-cover"
          />
        </div>
        <p className="mt-3 text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
          Still PNG · square master
        </p>
      </div>

      <div>
        <p className="text-[11px] tracking-[0.24em] text-primary uppercase">
          {collection.name} · {padId(piece.id)} / 50 · {collection.edition}
        </p>
        <h1 className="font-heading mt-3 text-4xl leading-tight sm:text-5xl">
          {piece.name}
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-7 text-foreground/80">
          {piece.blurb}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Badge variant="secondary">{piece.weather}</Badge>
          <Badge variant="outline">{piece.setting}</Badge>
          <Badge variant="outline">{piece.signal}</Badge>
          <Badge variant="outline">Unlimited supply</Badge>
        </div>

        <dl className="mt-8 grid grid-cols-2 gap-3">
          {traits.map(([label, key]) => (
            <div key={label} className="rounded-lg border border-border px-3 py-3">
              <dt className="text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
                {label}
              </dt>
              <dd className="mt-1 text-sm">{String(piece[key])}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={stillPath(piece.id)}
            download={`${padId(piece.id)}-${piece.name}.png`}
            className={cn(buttonVariants())}
          >
            Download PNG
          </a>
          <a
            href={metadataPath(piece.id)}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            OpenSea JSON
          </a>
        </div>

        <div className="mt-10 flex items-center justify-between border-t border-border pt-6 text-sm">
          {prev ? (
            <Link href={`/piece/${prev.id}`} className="text-muted-foreground hover:text-foreground">
              ← {padId(prev.id)} {prev.name}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/piece/${next.id}`} className="text-right text-muted-foreground hover:text-foreground">
              {padId(next.id)} {next.name} →
            </Link>
          ) : null}
        </div>
      </div>
    </main>
  );
}
