import { AudioLibrary } from "@/components/audio-library";
import { tracks } from "@/data/tracks";

export default function Home() {
  return <AudioLibrary tracks={tracks} />;
}
