"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { VideoPlayer } from "@/components/video";
import { FormatCard } from "@/components/ugc/campaign";
import { PageHead } from "@/components/ugc/site";
import { CopyBtn, Panel, Seg, Tag, fmt } from "@/components/ugc/ui";
import { DARE_FORMATS, type Effort } from "@/lib/dare";
import { ALL_VIDEOS, PLAYBOOKS, VIDEOS, clipOf, formatMedian, toDare } from "@/lib/ugc";

const VIEWS = [
  { value: "campaign", label: "Dare formats" },
  { value: "proven", label: "Proven scripts" },
  { value: "formats", label: "Video styles" },
] as const;
type View = (typeof VIEWS)[number]["value"];

const EFFORTS = [
  { value: "all", label: "All" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
] as const;

function Proven() {
  const vids = VIDEOS.filter((v) => v.detail).sort((a, b) => b.views - a.views);
  const types = Array.from(new Set(vids.map((v) => v.detail!.hookType)));
  const [type, setType] = useState("");
  const shown = vids.filter((v) => !type || v.detail!.hookType === type);
  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-1.5">
        {["", ...types].map((t) => (
          <button key={t || "all"} onClick={() => setType(t)} aria-pressed={type === t} className={type === t ? "rounded-full bg-dm-accent px-3 py-1 text-[13px] font-medium text-dm-accent-fg" : "rounded-full border border-dm-line bg-dm-surface px-3 py-1 text-[13px] text-dm-muted hover:text-dm-ink"}>
            {t ? `${t} hooks` : "All hooks"}
          </button>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {shown.map((v) => {
          const d = v.detail!;
          return (
            <Panel key={v.id} className="flex gap-4 p-4">
              <VideoPlayer clip={clipOf(v)} title={v.hook} creator={v.creator} showOpen={false} className="w-[118px] shrink-0 sm:w-[150px]" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 text-[12px] text-dm-muted">
                  <b className="text-[14px] font-semibold text-dm-ink">{fmt(v.views)}</b> views · {v.brand}
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  <Tag strong>{d.hookType}</Tag>
                  <Tag>{v.format}</Tag>
                </div>
                <p className="mt-2 text-[15px] font-semibold leading-snug">“{v.hook}”</p>
                <div className="mt-3 rounded-xl bg-dm-surface2 px-3 py-2.5 text-[13px] leading-relaxed">{toDare(d.template, v.brand)}</div>
                <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-dm-muted">{d.why}</p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <CopyBtn text={toDare(d.template, v.brand)} label="Copy Dare script" />
                  <Link href={`/ugc/video/${v.id}`} className="text-[13px] font-medium hover:underline">
                    Analytics & copy it →
                  </Link>
                </div>
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}

function Campaign() {
  const [effort, setEffort] = useState<"all" | Effort>("all");
  const [quiet, setQuiet] = useState(false);
  const list = DARE_FORMATS.filter((f) => (effort === "all" || f.effort === effort) && (!quiet || f.talking === false));
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Seg label="Effort" options={EFFORTS} value={effort} onChange={setEffort} />
        <label className="flex items-center gap-2 text-[13px] text-dm-muted">
          <input type="checkbox" checked={quiet} onChange={(e) => setQuiet(e.target.checked)} className="h-4 w-4 accent-current" /> No talking only
        </label>
        <span className="text-[13px] text-dm-muted">{list.length} formats</span>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {list.map((f) => (
          <FormatCard key={f.id} f={f} />
        ))}
      </div>
    </div>
  );
}

function Formats() {
  const names = Object.keys(PLAYBOOKS)
    .filter((name) => ALL_VIDEOS.some((v) => v.format === name))
    .sort((a, b) => formatMedian(b) - formatMedian(a));
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {names.map((name) => {
        const p = PLAYBOOKS[name];
        const med = formatMedian(name);
        const count = ALL_VIDEOS.filter((v) => v.format === name).length;
        return (
          <Panel key={name} className="flex flex-col p-4">
            <h3 className="text-[16px] font-semibold">{name}</h3>
            <p className="mt-1 text-[13px] leading-relaxed text-dm-muted">{p.what}</p>
            <div className="mt-3 flex gap-4 text-[12px] text-dm-muted">
              <span>
                <b className="text-[15px] font-semibold text-dm-ink">{fmt(med)}</b> median views
              </span>
              <span>
                <b className="text-[15px] font-semibold text-dm-ink">{count}</b> videos in the library
              </span>
            </div>
            <ol className="mt-3 list-decimal space-y-1 pl-5 text-[13px] leading-relaxed">
              {p.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            <div className="mt-3 rounded-xl bg-dm-surface2 px-3 py-2.5 text-[13px] leading-relaxed">{p.template}</div>
            <div className="mt-auto flex items-center gap-3 pt-3">
              <CopyBtn text={`${name}\n${p.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\nTemplate: ${p.template}`} label="Copy" />

            </div>
          </Panel>
        );
      })}
    </div>
  );
}

export default function ScriptsPage() {
  const [view, setView] = useState<View>("campaign");
  useEffect(() => {
    const h = window.location.hash.slice(1);
    if (h === "campaign" || h === "formats" || h === "proven") setView(h);
  }, []);
  return (
    <div>
      <PageHead
        eyebrow="Scripts"
        title="Dare scripts"
        sub="Every Dare format with its example video, brief and shot list, scripts from the viral videos they copy (already switched to Dare), and how each video style is built."
      />
      <Seg
        label="Show"
        options={VIEWS}
        value={view}
        onChange={(x) => {
          setView(x);
          history.replaceState(null, "", "#" + x);
        }}
        className="mb-6 w-fit"
      />
      {view === "proven" && <Proven />}
      {view === "campaign" && <Campaign />}
      {view === "formats" && <Formats />}
    </div>
  );
}
