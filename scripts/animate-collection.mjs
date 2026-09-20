import { spawn } from "node:child_process";
import { mkdir, readFile, rm, writeFile, cp } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SIZE = 480;
const FPS = 10;
const FRAMES = 24;
const collection = JSON.parse(
  await readFile(path.join(root, "src/data/collection.json"), "utf8"),
);

const stillDir = path.join(root, "public/collection/stills");
const gifDir = path.join(root, "public/collection/gifs");
const metaDir = path.join(root, "public/collection/metadata");
const tmpRoot = path.join(root, ".tmp-frames");

function pad(id) {
  return String(id).padStart(2, "0");
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";
    child.stderr.on("data", (d) => {
      stderr += d.toString();
    });
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(" ")} failed (${code}): ${stderr.slice(-800)}`));
    });
  });
}

function overlaySvg(piece, frame) {
  const weather = piece.weather.toLowerCase();
  const seed = piece.id * 97;
  const parts = [];

  if (weather === "rain") {
    for (let i = 0; i < 78; i++) {
      const x = ((seed * 19 + i * 53 + frame * 8) % (SIZE + 24)) - 12;
      const y = ((seed * 11 + i * 97 + frame * 21) % (SIZE + 36)) - 18;
      const o = 0.16 + (i % 5) * 0.045;
      const w = i % 8 === 0 ? 1.5 : 0.8;
      parts.push(
        `<line x1="${x}" y1="${y}" x2="${x - 3}" y2="${y + 18}" stroke="white" stroke-opacity="${o}" stroke-width="${w}"/>`,
      );
    }
  } else if (weather === "snow") {
    for (let i = 0; i < 64; i++) {
      const x = ((seed * 17 + i * 41 + frame * 2) % SIZE);
      const y = ((seed * 13 + i * 67 + frame * 9) % SIZE);
      const r = 1 + (i % 3);
      parts.push(
        `<circle cx="${x}" cy="${y}" r="${r}" fill="white" fill-opacity="${0.28 + (i % 4) * 0.1}"/>`,
      );
    }
  } else if (weather === "fog" || weather === "steam") {
    const dir = weather === "steam" ? -1 : 1;
    for (let i = 0; i < 8; i++) {
      const cx = (seed * 5 + i * 73 + frame * 3 * dir * (weather === "fog" ? 1 : 0.4)) % SIZE;
      const cy =
        weather === "steam"
          ? (SIZE + 40 - ((frame * 6 + i * 40) % (SIZE + 80))) % (SIZE + 40)
          : 80 + ((i * 50 + frame * 2) % 360);
      const rx = 90 + (i % 3) * 40;
      const ry = 28 + (i % 4) * 12;
      parts.push(
        `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="white" fill-opacity="${weather === "steam" ? 0.07 : 0.08}"/>`,
      );
    }
  }

  if (piece.animation.scanlines) {
    for (let y = 0; y < SIZE; y += 3) {
      const pulse = 0.07 + 0.03 * Math.sin((2 * Math.PI * (frame + y)) / 18);
      parts.push(
        `<rect x="0" y="${y}" width="${SIZE}" height="1" fill="#0b0a08" fill-opacity="${pulse}"/>`,
      );
    }
  }

  // always a little analog speckle
  for (let i = 0; i < 40; i++) {
    const x = (seed * 3 + i * 29 + frame * 11) % SIZE;
    const y = (seed * 7 + i * 43 + frame * 5) % SIZE;
    parts.push(
      `<rect x="${x}" y="${y}" width="1" height="1" fill="white" fill-opacity="0.18"/>`,
    );
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}">${parts.join("")}</svg>`;
}

async function animatePiece(piece) {
  const id = pad(piece.id);
  const still = path.join(stillDir, `piece-${id}.png`);
  const outGif = path.join(gifDir, `${id}.gif`);
  const work = path.join(tmpRoot, id);
  await rm(work, { recursive: true, force: true });
  await mkdir(work, { recursive: true });

  const { panX, panY, flicker, grain } = piece.animation;
  const vf = [
    `scale=${SIZE + 80}:${SIZE + 80}:force_original_aspect_ratio=increase`,
    `crop=${SIZE + 80}:${SIZE + 80}`,
    `crop=${SIZE}:${SIZE}:(in_w-out_w)/2+${panX}*sin(2*PI*n/${FRAMES}):(in_h-out_h)/2+${panY}*cos(2*PI*n/${FRAMES})`,
    `noise=alls=${grain}:allf=t+u`,
    `eq=brightness='${flicker}*sin(2*PI*n/12)':saturation=1.06:gamma=0.98`,
    `vignette=PI/5`,
  ].join(",");

  await run("ffmpeg", [
    "-y",
    "-loop",
    "1",
    "-i",
    still,
    "-vf",
    vf,
    "-r",
    String(FPS),
    "-frames:v",
    String(FRAMES),
    path.join(work, "base-%03d.png"),
  ]);

  for (let n = 1; n <= FRAMES; n++) {
    const framePath = path.join(work, `base-${String(n).padStart(3, "0")}.png`);
    const overlay = await sharp(Buffer.from(overlaySvg(piece, n)))
      .png()
      .toBuffer();
    const composed = await sharp(framePath)
      .composite([{ input: overlay, blend: "over" }])
      .png()
      .toBuffer();
    await sharp(composed)
      .jpeg({ quality: 78, mozjpeg: true })
      .toFile(path.join(work, `f-${String(n).padStart(3, "0")}.jpg`));
  }

  const palette = path.join(work, "palette.png");
  await run("ffmpeg", [
    "-y",
    "-framerate",
    String(FPS),
    "-i",
    path.join(work, "f-%03d.jpg"),
    "-vf",
    "palettegen=max_colors=64:stats_mode=diff",
    palette,
  ]);
  await run("ffmpeg", [
    "-y",
    "-framerate",
    String(FPS),
    "-i",
    path.join(work, "f-%03d.jpg"),
    "-i",
    palette,
    "-lavfi",
    "paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle",
    "-loop",
    "0",
    path.join(work, "raw.gif"),
  ]);

  await run("gifsicle", [
    "-O3",
    "--lossy=80",
    "--colors",
    "64",
    "-o",
    outGif,
    path.join(work, "raw.gif"),
  ]);

  await rm(work, { recursive: true, force: true });
  return outGif;
}

function attributes(piece) {
  return [
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
  ];
}

function tokenMetadata(piece, imageUri) {
  return {
    name: `${collection.name} #${piece.id} — ${piece.name}`,
    description: `${piece.blurb} ${collection.name} is a 50-piece open edition. Token ${piece.id} is unlimited: anyone can mint this loop. ${collection.description}`,
    image: imageUri,
    animation_url: imageUri,
    external_url: `https://afterhours.open/piece/${piece.id}`,
    background_color: "100e0c",
    attributes: attributes(piece),
  };
}

async function writeMetadata() {
  await mkdir(metaDir, { recursive: true });
  const manifest = [];
  for (const piece of collection.pieces) {
    const id = pad(piece.id);
    const local = tokenMetadata(piece, `${id}.gif`);
    const ipfs = tokenMetadata(piece, `ipfs://YOUR_CID/${id}.gif`);
    await writeFile(
      path.join(metaDir, `${piece.id}.json`),
      JSON.stringify(ipfs, null, 2) + "\n",
    );
    manifest.push(local);
  }

  await writeFile(
    path.join(root, "public/collection/metadata/_metadata.json"),
    JSON.stringify(manifest, null, 2) + "\n",
  );
  await writeFile(
    path.join(root, "public/collection/collection.json"),
    JSON.stringify(
      {
        name: collection.name,
        symbol: collection.symbol,
        description: collection.description,
        image: "ipfs://YOUR_CID/cover.png",
        banner_image: "ipfs://YOUR_CID/banner.png",
        external_link: "https://afterhours.open",
        seller_fee_basis_points: collection.sellerFeeBasisPoints,
        fee_recipient: "YOUR_WALLET_ADDRESS",
        drop: {
          type: "open-edition",
          standard: collection.standard,
          supply: collection.supply,
          pieces: collection.pieces.length,
        },
      },
      null,
      2,
    ) + "\n",
  );
}

const only = process.argv.slice(2).map(Number).filter(Boolean);
await mkdir(gifDir, { recursive: true });
await mkdir(tmpRoot, { recursive: true });

const targets = only.length
  ? collection.pieces.filter((p) => only.includes(p.id))
  : collection.pieces;

console.log(`Animating ${targets.length} piece(s) at ${SIZE}px / ${FPS}fps / ${FRAMES} frames`);

const concurrency = Number(process.env.ANIMATE_CONCURRENCY || 3);
let cursor = 0;
async function worker() {
  while (cursor < targets.length) {
    const piece = targets[cursor++];
    const started = Date.now();
    await animatePiece(piece);
    console.log(`  #${pad(piece.id)} ${piece.name} (${((Date.now() - started) / 1000).toFixed(1)}s)`);
  }
}
await Promise.all(Array.from({ length: Math.min(concurrency, targets.length) }, worker));

await writeMetadata();
await cp(
  path.join(root, "public/collection/cover.png"),
  path.join(gifDir, "cover.png"),
).catch(() => {});
console.log("Metadata written.");
