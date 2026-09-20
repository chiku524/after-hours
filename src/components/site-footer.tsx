import Link from "next/link";
import { collection } from "@/lib/collection";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-[11px] tracking-[0.14em] text-muted-foreground uppercase sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          {collection.name} · 50 open editions · {collection.standard}
        </p>
        <p>
          <Link href="/drop" className="hover:text-foreground">
            Drop files
          </Link>
          <span className="px-2">/</span>
          <a href="/collection/metadata/_metadata.json" className="hover:text-foreground">
            Metadata
          </a>
        </p>
      </div>
    </footer>
  );
}
