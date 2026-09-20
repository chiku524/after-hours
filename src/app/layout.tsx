import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { collection } from "@/lib/collection";
import "./globals.css";

const heading = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const plex = IBM_Plex_Mono({
  variable: "--font-ibm",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: `${collection.name} — 50 open edition lo-fi stills`,
    template: `%s · ${collection.name}`,
  },
  description: collection.description,
  openGraph: {
    title: collection.name,
    description: collection.tagline,
    images: [{ url: "/collection/banner.png" }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark ${heading.variable} ${plex.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <div className="film-grain" aria-hidden />
        <SiteHeader />
        <div className="flex flex-1 flex-col">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
