import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { collection } from "@/lib/collection";
import { cn } from "@/lib/utils";

const steps = [
  {
    title: "Create the collection in OpenSea Studio",
    body: "Open studio.opensea.io, choose Create a drop, and pick Open Edition. After Hours is designed as 50 separate ERC-1155 items, each with unlimited supply — not a 50/50 limited set.",
  },
  {
    title: "Use Polygon or Ethereum",
    body: "Polygon keeps open-edition minting cheap for collectors. Ethereum is fine if you want the mainnet audience. Same assets either way.",
  },
  {
    title: "Upload the 50 stills as 50 items",
    body: "Each file in public/collection/stills/piece-01.png through piece-50.png is one token. Name them with the metadata titles (After Hours #1 — Tape Hiss, 2:14 AM, and so on). Paste the matching JSON from public/collection/metadata/ as the description and traits.",
  },
  {
    title: "Set each item to unlimited",
    body: "Open editions should not have a max supply. Leave quantity unlimited, set a mint price, and choose a start/end window if you want the drop to close later.",
  },
  {
    title: "Royalties and payout",
    body: "Collection metadata ships with a 5% creator fee (500 basis points). Replace YOUR_WALLET_ADDRESS in public/collection/collection.json before you freeze royalties.",
  },
  {
    title: "Optional: pin to IPFS",
    body: "If you self-host tokenURI, upload public/collection/stills plus cover.png and banner.png, then replace YOUR_CID in the metadata JSON. The gallery also serves /api/metadata/{id} for local testing.",
  },
];

export const metadata = {
  title: "OpenSea drop",
  description: `How to list the ${collection.name} 50-piece open edition on OpenSea.`,
};

export default function DropPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
      <p className="text-[11px] tracking-[0.24em] text-primary uppercase">
        Drop playbook
      </p>
      <h1 className="font-heading mt-3 text-4xl sm:text-5xl">
        List After Hours as 50 open editions
      </h1>
      <p className="mt-4 text-sm leading-7 text-foreground/80">
        {collection.description} The files in this repo are drop-ready: square
        PNG stills, OpenSea-shaped metadata, cover, and banner.
      </p>

      <div className="mt-8 overflow-hidden rounded-xl ring-1 ring-foreground/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/collection/cover.png" alt="After Hours cover" />
      </div>

      <ol className="mt-10 space-y-6">
        {steps.map((step, index) => (
          <li key={step.title} className="rounded-xl border border-border px-5 py-5">
            <p className="text-[10px] tracking-[0.2em] text-primary uppercase">
              Step {String(index + 1).padStart(2, "0")}
            </p>
            <h2 className="font-heading mt-1 text-2xl">{step.title}</h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{step.body}</p>
          </li>
        ))}
      </ol>

      <div className="mt-10 rounded-xl bg-card px-5 py-5 ring-1 ring-foreground/10">
        <h2 className="font-heading text-2xl">File map</h2>
        <ul className="mt-3 space-y-2 font-mono text-xs leading-6 text-muted-foreground">
          <li>public/collection/stills/piece-01.png–50.png — token images</li>
          <li>public/collection/metadata/1.json–50.json — OpenSea traits</li>
          <li>public/collection/cover.png — collection logo</li>
          <li>public/collection/banner.png — OpenSea banner</li>
        </ul>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/#rooms" className={cn(buttonVariants())}>
            Back to rooms
          </Link>
          <a
            href="/collection/metadata/_metadata.json"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Download metadata bundle
          </a>
        </div>
      </div>
    </main>
  );
}
