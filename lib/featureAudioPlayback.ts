export type FeatureAudioPlaybackResult = "playing" | "interrupted" | "unavailable";

type AudioPlaybackHandle = Pick<HTMLAudioElement, "play" | "load">;

/** Start or retry the Feature recording while keeping AbortError lifecycle noise non-fatal. */
export async function attemptFeaturePlayback(
  audio: AudioPlaybackHandle,
  retry = false,
): Promise<FeatureAudioPlaybackResult> {
  if (retry) audio.load();

  try {
    await audio.play();
    return "playing";
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") return "interrupted";
    return "unavailable";
  }
}

type AudioDocument = Pick<Document, "addEventListener" | "removeEventListener" | "querySelectorAll">;

/** Keep every page audio element exclusive without coupling the Feature UI to a specific player. */
export function installExclusiveAudioPlayback(documentRef: AudioDocument): () => void {
  const handlePlay = (event: Event) => {
    const activeAudio = event.target as HTMLAudioElement | null;
    if (!activeAudio || activeAudio.tagName !== "AUDIO") return;

    documentRef.querySelectorAll("audio").forEach((audio) => {
      if (audio !== activeAudio) audio.pause();
    });
  };

  documentRef.addEventListener("play", handlePlay, true);
  return () => documentRef.removeEventListener("play", handlePlay, true);
}

export function formatFeatureAudioTime(seconds: number, round = false): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const wholeSeconds = round ? Math.round(seconds) : Math.floor(seconds);
  const minutes = Math.floor(wholeSeconds / 60);
  const remainder = String(wholeSeconds % 60).padStart(2, "0");
  return `${minutes}:${remainder}`;
}
