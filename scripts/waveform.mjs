import { readFile, writeFile } from "node:fs/promises";
import { resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = fileURLToPath(new URL("../", import.meta.url));
const input = process.argv[2];
if (!input) throw new Error("Indique un fichier dans media/audio/.");
const source = resolve(root, input);
const path = relative(root, source).replaceAll("\\", "/");
if (!/^media\/audio\/[a-z0-9][a-z0-9._-]*\.(mp3|m4a|wav|ogg|oga)$/i.test(path)) {
  throw new Error("Chemin audio non valide : " + path);
}

const pcm = spawnSync("ffmpeg", ["-v", "error", "-i", source, "-ac", "1", "-ar", "800", "-f", "s16le", "-"], {
  maxBuffer: 24 * 1024 ** 2, windowsHide: true
});
if (pcm.error || pcm.status !== 0 || pcm.stdout.length < 336) {
  throw new Error("FFmpeg n’a pas pu lire le fichier : " + (pcm.error?.message || pcm.stderr?.toString() || path));
}
const samples = Math.floor(pcm.stdout.length / 2);
const points = 168;
const energies = [];
for (let i = 0; i < points; i++) {
  const start = Math.floor(i * samples / points);
  const end = Math.floor((i + 1) * samples / points);
  let sum = 0;
  for (let sample = start; sample < end; sample++) sum += pcm.stdout.readInt16LE(sample * 2) ** 2;
  energies.push(Math.sqrt(sum / (end - start)));
}
const ceiling = Math.max([...energies].sort((a,b) => a-b)[Math.floor(points * .9)], 1);
const peaks = energies.map((energy) => Math.max(5, Math.min(100, Math.round((energy / ceiling) ** .87 * 91))));
const target = resolve(root, "_data/waveforms.json");
const current = JSON.parse(await readFile(target, "utf8"));
current["/" + path] = peaks;
await writeFile(target, JSON.stringify(current) + "\n", "utf8");
console.log("Forme d’onde mise à jour pour " + path);
