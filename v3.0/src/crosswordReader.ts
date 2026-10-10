import { parse } from "@xwordly/xword-parser";
import { Buffer } from "buffer";
import wsjUrl from "./assets/wsj.puz?url";

(globalThis as typeof globalThis & { Buffer: typeof Buffer }).Buffer = Buffer;

export default async function CrosswordReader() {
  // await receive url
  const response = await fetch(wsjUrl);
  if (!response.ok) {
    throw new Error(`Unable to load puzzle: ${response.status}`);
  }

  const blob = await response.blob();
  const file = new File([blob], "wsj.puz", {
    type: "application/octet-stream",
  });

  const arrayBuffer = await file.arrayBuffer();
  const parsed = parse(arrayBuffer, {
    filename: file.name,
  });

  return parsed;
}
