import Link from "next/link";
import { collection } from "@/lib/collection";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-heading text-lg tracking-tight">
            {collection.name}
          </span>
          <span className="hidden text-[10px] tracking-[0.22em] text-muted-foreground uppercase sm:inline">
            Open Edition
          </span>
        </Link>
        <nav className="flex items-center gap-5 text-xs tracking-[0.16em] uppercase">
          <Link href="/#rooms" className="text-muted-foreground hover:text-foreground">
            Rooms
          </Link>
          <Link href="/drop" className="text-muted-foreground hover:text-foreground">
            OpenSea drop
          </Link>
          <a
            href="/collection/metadata/_metadata.json"
            className="text-muted-foreground hover:text-foreground"
          >
            Metadata
          </a>
        </nav>
      </div>
    </header>
  );
}
