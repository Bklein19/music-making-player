# Wav Shelf

A minimal private music shelf for local WAVs and works in progress.

## Add Music

Put audio files in:

```txt
public/audio/
```

Supported formats are `.wav`, `.mp3`, `.flac`, `.m4a`, `.aac`, and `.ogg`.

The app scans that folder before `dev` and `build`, then generates `src/data/tracks.ts`.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:3000`.

## Deploy

Push this project to GitHub, import it into Vercel, and keep the defaults:

- Framework preset: Next.js
- Build command: `npm run build`
- Output directory: Next.js default

For a small private library, committing audio files works. For a larger WAV library, store the audio in object storage and point tracks at those URLs instead.
