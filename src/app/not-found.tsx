import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-4 py-24 text-center">
      <p className="text-[11px] tracking-[0.24em] text-primary uppercase">
        Signal lost
      </p>
      <h1 className="font-heading mt-3 text-4xl">That room is dark.</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        No still lives at this address. The tuner only goes from 01 to 50.
      </p>
      <Link href="/" className={cn(buttonVariants(), "mx-auto mt-6")}>
        Return to After Hours
      </Link>
    </main>
  );
}
