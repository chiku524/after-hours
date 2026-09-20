# After Hours

Fifty unique **open-edition** lo-fi stills for an OpenSea drop. Each piece is its own unlimited ERC-1155: a room, a weather, a radio frequency, and a square PNG.

The gallery at `/` is the collector-facing catalog. `/drop` is the listing playbook. Token files live in `public/collection/`.

## Run locally

```bash
npm install
npm run dev
```

The app binds to port **43147** when you use `npm run dev`. Open [http://127.0.0.1:43147](http://127.0.0.1:43147).

## What’s in the drop

| Path | What it is |
| --- | --- |
| `public/collection/stills/piece-01.png`–`50.png` | Token images (square stills) |
| `public/collection/metadata/1.json`–`50.json` | OpenSea metadata + traits |
| `public/collection/metadata/_metadata.json` | All 50 records in one file |
| `public/collection/cover.png` | Collection logo |
| `public/collection/banner.png` | OpenSea banner |
| `public/collection/collection.json` | Collection-level metadata |

## OpenSea open edition

This is **not** a 50-supply 1/1 set. It is **50 unique items**, each with **unlimited mints**.

1. Open [OpenSea Studio](https://studio.opensea.io) → Create a drop → **Open Edition**.
2. Create **50 items**, one PNG each, supply unlimited.
3. Copy names, descriptions, and traits from `public/collection/metadata/{id}.json`.
4. Set a mint price and window. Creator fee in the repo is **5%** (`seller_fee_basis_points: 500`).
5. Replace `YOUR_WALLET_ADDRESS` and `YOUR_CID` in the JSON if you pin to IPFS. Local token JSON is also served at `/api/metadata/{id}`.

Polygon is the cheaper minting chain for open editions; Ethereum works if you want mainnet.

## Stack

Next.js, TypeScript, Tailwind, shadcn/ui.
