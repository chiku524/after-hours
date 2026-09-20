import { NextResponse } from "next/server";
import { collection, getPiece, padId } from "@/lib/collection";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const piece = getPiece(Number(id));
  if (!piece) {
    return NextResponse.json({ error: "Token not found" }, { status: 404 });
  }

  const file = `${padId(piece.id)}.gif`;
  return NextResponse.json({
    name: `${collection.name} #${piece.id} — ${piece.name}`,
    description: `${piece.blurb} ${collection.description}`,
    image: `/collection/gifs/${file}`,
    animation_url: `/collection/gifs/${file}`,
    external_url: `/piece/${piece.id}`,
    background_color: "100e0c",
    attributes: [
      { trait_type: "Setting", value: piece.setting },
      { trait_type: "Weather", value: piece.weather },
      { trait_type: "Companion", value: piece.companion },
      { trait_type: "Light", value: piece.light },
      { trait_type: "Signal", value: piece.signal },
      { trait_type: "Hour", value: piece.hour },
      { trait_type: "Mood", value: piece.mood },
      { trait_type: "Palette", value: piece.palette },
      { trait_type: "Edition", value: collection.edition },
      { trait_type: "Loop", value: collection.loop },
    ],
  });
}
