import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const audioDir = path.join(root, "public", "audio");
const outputFile = path.join(root, "src", "data", "tracks.ts");
const supported = new Set([".wav", ".mp3", ".flac", ".m4a", ".aac", ".ogg"]);

function titleFromFile(file) {
  return path
    .basename(file, path.extname(file))
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

await mkdir(audioDir, { recursive: true });
await mkdir(path.dirname(outputFile), { recursive: true });

const files = await readdir(audioDir);
const tracks = await Promise.all(
  files
    .filter((file) => supported.has(path.extname(file).toLowerCase()))
    .map(async (file) => {
      const fullPath = path.join(audioDir, file);
      const info = await stat(fullPath);

      return {
        title: titleFromFile(file),
        file,
        src: `/audio/${encodeURIComponent(file)}`,
        size: info.size,
        updatedAt: info.mtime.toISOString()
      };
    })
);

tracks.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

const content = `export type Track = {
  title: string;
  file: string;
  src: string;
  size: number;
  updatedAt: string;
};

export const tracks: Track[] = ${JSON.stringify(tracks, null, 2)};
`;

await writeFile(outputFile, content);
console.log(`Synced ${tracks.length} track${tracks.length === 1 ? "" : "s"}.`);
