// The video editor's project, its drawing code and its checks. Nothing here
// touches the original file: an edit is a small set of numbers and text layers,
// drawn onto a canvas the same way for the preview and for the export, so what
// you see is what gets saved.

export type TextStyle = "outline" | "box";
export type TextLayer = {
  id: string;
  text: string;
  /** seconds in the original video */
  from: number;
  to: number;
  /** where the middle of the text sits, 0 (top) to 1 (bottom) */
  y: number;
  /** letter height, as a % of the frame's width */
  size: number;
  style: TextStyle;
};

export type Fit = "fill" | "fit";
export type Shape = "9:16" | "4:5" | "1:1" | "16:9";

export type Project = {
  /** the part of the original that's kept, in seconds */
  start: number;
  end: number;
  speed: number;
  /** 0 is muted, 1 is the original volume */
  volume: number;
  shape: Shape;
  /** fill crops the video to the frame, fit shows all of it over a blurred copy */
  fit: Fit;
  zoom: number;
  /** which part shows when the video is cropped: -1 … 1 */
  x: number;
  y: number;
  texts: TextLayer[];
};

export const SIZES: Record<Shape, [number, number]> = { "9:16": [1080, 1920], "4:5": [1080, 1350], "1:1": [1080, 1080], "16:9": [1920, 1080] };
export const SHAPES: { value: Shape; label: string }[] = [
  { value: "9:16", label: "9:16 TikTok / Reels" },
  { value: "4:5", label: "4:5 feed" },
  { value: "1:1", label: "1:1 square" },
  { value: "16:9", label: "16:9 wide" },
];
export const SPEEDS = [0.75, 1, 1.1, 1.25, 1.5, 2];
export const TEXT_Y = { top: 0.16, middle: 0.5, bottom: 0.7 } as const;
export const TEXT_SIZE = { small: 4.6, medium: 6, large: 7.6 } as const;
export const MIN_CLIP = 1;
export const FPS = 30;

let n = 0;
export const layerId = () => `t${Date.now().toString(36)}${n++}`;
export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
export const round2 = (v: number) => Math.round(v * 100) / 100;

export const newProject = (duration: number): Project => ({ start: 0, end: round2(duration), speed: 1, volume: 1, shape: "9:16", fit: "fill", zoom: 1, x: 0, y: 0, texts: [] });
export const newLayer = (p: Project, text = "your hook here"): TextLayer => ({ id: layerId(), text, from: p.start, to: round2(Math.min(p.end, p.start + 3)), y: p.texts.length ? TEXT_Y.bottom : TEXT_Y.top, size: TEXT_SIZE.medium, style: "outline" });

/** how long the saved video will be */
export const outLength = (p: Project) => Math.max(0, p.end - p.start) / (p.speed || 1);

export const clock = (s: number) => {
  const v = Math.max(0, s);
  const m = Math.floor(v / 60);
  return `${m}:${(v - m * 60).toFixed(1).padStart(4, "0")}`;
};

// ---------------------------------------------------------------- drawing

const FONT = (px: number) => `800 ${px}px Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif`;

/** break text into lines that fit, keeping the line breaks that were typed */
export function wrapLines(measure: (s: string) => number, text: string, maxWidth: number) {
  const out: string[] = [];
  for (const para of text.split("\n")) {
    const words = para.trim().split(/\s+/).filter(Boolean);
    if (!words.length) continue;
    let line = "";
    for (const w of words) {
      const next = line ? `${line} ${w}` : w;
      if (line && measure(next) > maxWidth) {
        out.push(line);
        line = w;
      } else line = next;
    }
    out.push(line);
  }
  return out;
}

function drawText(ctx: CanvasRenderingContext2D, layer: TextLayer, text: string, W: number, H: number) {
  const px = Math.round((layer.size / 100) * W);
  ctx.font = FONT(px);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const lines = wrapLines((s) => ctx.measureText(s).width, text, W * 0.86);
  if (!lines.length) return;
  const lh = px * 1.24;
  const block = lines.length * lh;
  // keep the whole block inside the frame
  const top = clamp(layer.y * H - block / 2, px * 0.4, Math.max(px * 0.4, H - block - px * 0.4));
  lines.forEach((line, i) => {
    const cy = top + lh * i + lh / 2;
    if (layer.style === "box") {
      const w = ctx.measureText(line).width + px * 0.7;
      const r = px * 0.22;
      const x = W / 2 - w / 2;
      const y = cy - lh / 2;
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + lh, r);
      ctx.arcTo(x + w, y + lh, x, y + lh, r);
      ctx.arcTo(x, y + lh, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#111";
      ctx.fillText(line, W / 2, cy + px * 0.04);
    } else {
      ctx.lineJoin = "round";
      ctx.lineWidth = px * 0.2;
      ctx.strokeStyle = "#000";
      ctx.strokeText(line, W / 2, cy);
      ctx.fillStyle = "#fff";
      ctx.fillText(line, W / 2, cy);
    }
  });
}

/**
 * Draw one finished frame: the video cropped or fitted into the frame, then
 * the text that's on screen at `t`. `hook` replaces the first text layer's
 * words (that's how hook versions are made).
 */
export function drawFrame(ctx: CanvasRenderingContext2D, video: HTMLVideoElement | null, p: Project, t: number, hook?: string) {
  const [W, H] = SIZES[p.shape];
  ctx.filter = "none";
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);
  const vw = video?.videoWidth || 0;
  const vh = video?.videoHeight || 0;
  if (video && vw && vh) {
    const cover = (zoom: number, x: number, y: number) => {
      const s = Math.max(W / vw, H / vh) * zoom;
      const dw = vw * s;
      const dh = vh * s;
      ctx.drawImage(video, (W - dw) / 2 - (x * (dw - W)) / 2, (H - dh) / 2 - (y * (dh - H)) / 2, dw, dh);
    };
    if (p.fit === "fill") cover(p.zoom, p.x, p.y);
    else {
      if ("filter" in ctx) {
        ctx.filter = "blur(36px) brightness(0.6)";
        cover(1.15, 0, 0);
        ctx.filter = "none";
      }
      const s = Math.min(W / vw, H / vh) * p.zoom;
      ctx.drawImage(video, (W - vw * s) / 2, (H - vh * s) / 2, vw * s, vh * s);
    }
  }
  p.texts.forEach((l, i) => {
    if (t >= l.from - 1e-3 && t < l.to) drawText(ctx, l, i === 0 && hook ? hook : l.text, W, H);
  });
}

// ---------------------------------------------------------------- checks

export type Problem = { level: "stop" | "warn"; text: string };

/** everything that would make the saved video wrong, found before saving */
export function problems(p: Project, duration: number): Problem[] {
  const out: Problem[] = [];
  if (!(duration > 0)) return [{ level: "stop", text: "The video hasn't loaded yet." }];
  if (p.end - p.start < MIN_CLIP) out.push({ level: "stop", text: `The kept part is under ${MIN_CLIP} second. Move the start or the end.` });
  if (p.start < 0 || p.end > duration + 0.05) out.push({ level: "stop", text: "The trim goes past the video. Reset the trim." });
  p.texts.forEach((l, i) => {
    const name = i === 0 ? "The hook text" : `Text ${i + 1}`;
    if (!l.text.trim()) out.push({ level: "stop", text: `${name} is empty. Type something or delete it.` });
    else if (l.to <= l.from) out.push({ level: "stop", text: `${name} ends before it starts.` });
    else if (l.to <= p.start || l.from >= p.end) out.push({ level: "stop", text: `${name} is outside the part you kept, so it would never show.` });
    else if (Math.min(l.to, p.end) - Math.max(l.from, p.start) < 0.7 * (p.speed || 1)) out.push({ level: "warn", text: `${name} is on screen for under a second. Hard to read.` });
    if (l.text.trim() && p.shape === "9:16" && l.y > 0.76) out.push({ level: "warn", text: `${name} sits where TikTok and Instagram put the caption and buttons. Move it up.` });
    if (l.text.trim() && p.shape === "9:16" && l.y < 0.1) out.push({ level: "warn", text: `${name} sits under the top bar of the apps. Move it down a little.` });
    if (l.text.length > 110) out.push({ level: "warn", text: `${name} is long (${l.text.length} letters). It will cover a lot of the video.` });
  });
  const len = outLength(p);
  if (len > 180) out.push({ level: "warn", text: `The video comes out ${Math.round(len)}s long. Saving takes that long too.` });
  if (p.volume === 0) out.push({ level: "warn", text: "Sound is off. The saved video will be silent." });
  return out;
}

// ---------------------------------------------------------------- an edit plan from Claude

export type Plan = { project: Project; hooks: string[]; notes: string[] };

const isNum = (v: unknown): v is number => typeof v === "number" && isFinite(v);

/**
 * Read an edit plan (the JSON the Editor agent writes) and apply it on top of
 * the current project. Anything out of range is pulled back in and listed in
 * `notes`; anything it can't read is an error and nothing changes.
 */
export function applyPlan(raw: string, duration: number, current: Project): Plan | { error: string } {
  let j: Record<string, unknown>;
  try {
    // take the JSON out of a ```json block or surrounding words
    const a = raw.indexOf("{");
    const b = raw.lastIndexOf("}");
    if (a < 0 || b <= a) return { error: "That doesn't look like an edit plan. Paste the JSON Claude gave you, starting with { and ending with }." };
    j = JSON.parse(raw.slice(a, b + 1));
  } catch {
    return { error: "The plan isn't valid JSON. Ask Claude to send it again as one JSON block." };
  }
  if (!j || typeof j !== "object" || Array.isArray(j)) return { error: "The plan should be one JSON object." };

  const notes: string[] = [];
  const p: Project = { ...current, texts: current.texts.map((t) => ({ ...t })) };
  const inVideo = (v: number, what: string) => {
    const c = round2(clamp(v, 0, duration));
    if (Math.abs(c - v) > 0.011) notes.push(`${what} was ${v}s, outside the video (0–${round2(duration)}s). Set to ${c}s.`);
    return c;
  };

  const trim = j.trim as Record<string, unknown> | undefined;
  if (trim && typeof trim === "object") {
    if (isNum(trim.start)) p.start = inVideo(trim.start, "Trim start");
    if (isNum(trim.end)) p.end = inVideo(trim.end, "Trim end");
    if (p.end - p.start < MIN_CLIP) return { error: `The plan keeps under ${MIN_CLIP} second of video (${p.start}s to ${p.end}s). Nothing was changed.` };
  }
  if (isNum(j.speed)) {
    p.speed = clamp(j.speed, 0.5, 2);
    if (p.speed !== j.speed) notes.push(`Speed ${j.speed} isn't possible. Set to ${p.speed}.`);
  }
  if (j.mute === true) p.volume = 0;
  else if (isNum(j.volume)) p.volume = clamp(j.volume, 0, 1);
  if (j.shape !== undefined) {
    if (typeof j.shape === "string" && j.shape in SIZES) p.shape = j.shape as Shape;
    else notes.push(`Shape "${String(j.shape)}" isn't one of 9:16, 4:5, 1:1, 16:9. Kept ${p.shape}.`);
  }
  if (j.fit === "fill" || j.fit === "fit") p.fit = j.fit;

  if (j.texts !== undefined) {
    if (!Array.isArray(j.texts)) return { error: '"texts" should be a list. Nothing was changed.' };
    const texts: TextLayer[] = [];
    for (const [i, t0] of (j.texts as unknown[]).entries()) {
      const t = t0 as Record<string, unknown>;
      const label = `Text ${i + 1}`;
      if (!t || typeof t.text !== "string" || !t.text.trim()) {
        notes.push(`${label} had no words. Skipped.`);
        continue;
      }
      const from = Math.max(p.start, inVideo(isNum(t.from) ? t.from : p.start, `${label} start`));
      let to = Math.min(p.end, inVideo(isNum(t.to) ? t.to : from + 3, `${label} end`));
      if (from >= p.end) {
        notes.push(`${label} ("${t.text.slice(0, 30)}") starts after the kept part ends. Skipped.`);
        continue;
      }
      if (to <= from) {
        to = round2(Math.min(p.end, from + 3));
        notes.push(`${label} ended before it started. It now shows until ${to}s.`);
      }
      const y = isNum(t.y) ? clamp(t.y, 0.05, 0.95) : TEXT_Y[(t.position as keyof typeof TEXT_Y) in TEXT_Y ? (t.position as keyof typeof TEXT_Y) : i === 0 ? "top" : "bottom"];
      const size = isNum(t.size) ? clamp(t.size, 3, 12) : TEXT_SIZE[(t.size as keyof typeof TEXT_SIZE) in TEXT_SIZE ? (t.size as keyof typeof TEXT_SIZE) : "medium"];
      texts.push({ id: layerId(), text: t.text.trim(), from: round2(from), to: round2(to), y, size, style: t.style === "box" ? "box" : "outline" });
    }
    p.texts = texts;
  }

  let hooks: string[] = [];
  if (j.hooks !== undefined) {
    if (!Array.isArray(j.hooks)) notes.push('"hooks" should be a list of lines. Ignored.');
    else hooks = (j.hooks as unknown[]).filter((h): h is string => typeof h === "string" && !!h.trim()).map((h) => h.trim());
    if (hooks.length && !p.texts.length) notes.push("The plan has hook versions but no text on screen, so there's nothing to swap. Add a hook text first.");
  }
  return { project: p, hooks, notes };
}

/** the current edit, in the same shape a plan uses, to hand to Claude */
export function describeProject(p: Project, duration: number, name: string) {
  return JSON.stringify(
    {
      video: { name, seconds: round2(duration) },
      trim: { start: p.start, end: p.end },
      speed: p.speed,
      volume: p.volume,
      shape: p.shape,
      fit: p.fit,
      texts: p.texts.map((t) => ({ text: t.text, from: t.from, to: t.to, y: round2(t.y), size: t.size, style: t.style })),
    },
    null,
    2,
  );
}
