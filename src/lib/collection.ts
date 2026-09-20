import data from "@/data/collection.json";

export type Weather = "Rain" | "Snow" | "Fog" | "Steam" | "Clear";

export type Piece = {
  id: number;
  name: string;
  setting: string;
  weather: Weather | string;
  companion: string;
  light: string;
  signal: string;
  hour: string;
  mood: string;
  palette: string;
  blurb: string;
  animation: {
    panX: number;
    panY: number;
    flicker: number;
    grain: number;
    scanlines: boolean;
  };
};

export const collection = data;

export const pieces = data.pieces as Piece[];

export function padId(id: number) {
  return String(id).padStart(2, "0");
}

export function getPiece(id: number) {
  return pieces.find((piece) => piece.id === id);
}

export function gifPath(id: number) {
  return `/collection/gifs/${padId(id)}.gif`;
}

export function stillPath(id: number) {
  return `/collection/stills/piece-${padId(id)}.png`;
}

export function metadataPath(id: number) {
  return `/collection/metadata/${id}.json`;
}

export function uniqueTraits(key: keyof Piece) {
  return [...new Set(pieces.map((piece) => String(piece[key])))].sort();
}
