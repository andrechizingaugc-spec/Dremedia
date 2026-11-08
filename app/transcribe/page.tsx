"use client";

import { useState } from "react";
import { Copy, ExternalLink, Play, RotateCcw, Upload, Video } from "lucide-react";
import { transcripts } from "@/lib/mock";
import { Button, Card, NotHooked, PlatformIcon, cx } from "@/components/ui";

export default function TranscribePage() {
  const [url, setUrl] = useState("");
  const [pick, setPick] = useState(transcripts[0].id);
  const [tried, setTried] = useState(false);
  const [copied, setCopied] = useState(false);
  const t = transcripts.find((x) => x.id === pick)!;
  const [text, setText] = useState(t.text);

  function choose(id: string) {
    setPick(id);
    setText(transcripts.find((x) => x.id === id)!.text);
  }

  return (
    <div>
      <h1 className="mb-5 text-2xl font-semibold tracking-[-0.01em]">Transcribe</h1>
      <div className="flex gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-[14px] border border-line p-1.5 pl-3.5">
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste a TikTok, Instagram, or YouTube URL" className="flex-1 text-sm outline-none" />
          <Button variant="soft" onClick={() => setTried(true)} disabled={!url.trim()}>
            Transcribe
          </Button>
        </div>
        <Button onClick={() => setTried(true)}>
          <Upload size={15} /> Upload
        </Button>
      </div>
      {tried && (
        <div className="mt-3">
          <NotHooked what="transcribing downloads the video and runs speech-to-text on it (whisper, deepgram, assemblyai). the samples below show what comes back." />
        </div>
      )}

      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">
        {transcripts.map((x) => (
          <button
            key={x.id}
            onClick={() => choose(x.id)}
            className={cx("flex w-[240px] shrink-0 items-center gap-2.5 rounded-xl border p-2 text-left text-sm", pick === x.id ? "border-[#ccc] shadow-sm" : "border-line")}
          >
            <span className="h-9 w-7 shrink-0 rounded bg-gradient-to-b from-[#555] to-[#111]" />
            <span className="truncate">{x.title}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
        <Card className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-sm font-medium">
                <PlatformIcon p={t.platform} size={14} /> Reference video
              </div>
              <div className="mt-1 line-clamp-1 font-semibold">{t.title}</div>
              <div className="text-xs text-muted">{t.creator}</div>
            </div>
            <Button className="shrink-0 py-1.5">
              Open original <ExternalLink size={13} />
            </Button>
          </div>
          <div className="mt-3 flex aspect-[9/12] items-center justify-center rounded-xl bg-gradient-to-b from-[#3b3b3b] to-[#0d0d0d] text-white">
            <span className="rounded-full bg-white/15 p-3">
              <Play size={22} fill="white" />
            </span>
          </div>
        </Card>
        <Card className="flex flex-col p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="font-semibold">Transcript</div>
            <div className="flex gap-1.5">
              <Button className="py-1 text-xs" onClick={() => setText(t.text)}>
                <RotateCcw size={13} /> Reset
              </Button>
              <Button
                className="py-1 text-xs"
                onClick={() => {
                  navigator.clipboard?.writeText(text);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1200);
                }}
              >
                <Copy size={13} /> {copied ? "Copied" : "Copy"}
              </Button>
              <a href="/film">
                <Button className="py-1 text-xs">
                  <Video size={13} /> Film
                </Button>
              </a>
            </div>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[340px] flex-1 resize-none rounded-xl border border-line bg-[#FAFAFA] p-4 text-[15px] leading-relaxed outline-none"
          />
          <p className="mt-2 text-xs text-muted">edit it into your own script, then hit film.</p>
        </Card>
      </div>
    </div>
  );
}
