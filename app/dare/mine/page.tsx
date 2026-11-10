"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { uid } from "@/lib/mock";
import { useData } from "@/lib/store";
import { Button, Card, Field } from "@/components/ui";
import { VideoPlayer, parseClip, resolveClip } from "@/components/video";
import { Chip } from "@/components/dare/parts";
import { PageTitle } from "@/components/dare/site";
import { FAMILIES } from "@/lib/dare";

export default function MyVideosPage() {
  const { data, update } = useData();
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const [family, setFamily] = useState<string>(FAMILIES[0]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const mine = data.dare.mine;

  const add = async () => {
    setBusy(true);
    const clip = await resolveClip(url);
    setBusy(false);
    if (!clip)
      return setError(
        /tiktok\.com\/t\/|(vm|vt)\.tiktok/.test(url)
          ? "TikTok's short share link couldn't be read. Open it in your browser, copy the full address (tiktok.com/@name/video/…) and paste that."
          : "That link didn't work. Paste a TikTok, Instagram reel, YouTube Short or DarkUGC video link.",
      );
    // keep a link the player can always read, even if it came in as a short link
    const saved = clip.kind === "tiktok" && !parseClip(url) ? `https://www.tiktok.com/@tiktok/video/${clip.id}` : url.trim();
    update((x) => ({ ...x, dare: { ...x.dare, mine: [{ id: uid("v"), url: saved, note: note.trim(), family, addedAt: new Date().toISOString() }, ...x.dare.mine] } }));
    setUrl("");
    setNote("");
    setError("");
  };

  return (
    <div>
      <PageTitle title="My videos" sub="Paste any TikTok, Instagram reel, YouTube Short or DarkUGC link and it plays here, next to your note. Use it for new videos you want to copy, or your own posts." />

      <Card className="mb-4 p-4">
        <form
          className="grid gap-3 sm:grid-cols-[1fr_1fr_180px_auto] sm:items-end"
          onSubmit={(e) => {
            e.preventDefault();
            add();
          }}
        >
          <Field label="Link">
            <input className="field" value={url} onChange={(e) => (setUrl(e.target.value), setError(""))} placeholder="https://www.tiktok.com/@…/video/…" />
          </Field>
          <Field label="Note (optional)">
            <input className="field" value={note} onChange={(e) => setNote(e.target.value)} placeholder="why it works, what to copy" />
          </Field>
          <Field label="Type">
            <select className="field" value={family} onChange={(e) => setFamily(e.target.value)}>
              {FAMILIES.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </Field>
          <Button variant="primary" type="submit" disabled={!url.trim() || busy}>
            <Plus size={15} /> {busy ? "Adding…" : "Add"}
          </Button>
        </form>
        {error && (
          <p role="alert" className="mt-2 text-[13px] text-[#B91C1C]">
            {error}
          </p>
        )}
      </Card>

      {mine.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-muted">No videos yet. Paste a link above.</div>
      ) : (
        <div className="grid grid-cols-1 gap-3 min-[460px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mine.map((m) => {
            const clip = parseClip(m.url);
            return (
              <Card key={m.id} className="flex flex-col p-3">
                {clip ? <VideoPlayer clip={clip} /> : <p className="text-sm text-muted">This link can't be played: {m.url}</p>}
                <div className="mt-2 flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <Chip>{m.family}</Chip>
                    {m.note && <p className="mt-1 text-[13px] leading-snug">{m.note}</p>}
                  </div>
                  <button
                    onClick={() => confirm("Remove this video?") && update((x) => ({ ...x, dare: { ...x.dare, mine: x.dare.mine.filter((y) => y.id !== m.id) } }))}
                    aria-label="Remove video"
                    className="p-1 text-muted hover:text-ink"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
