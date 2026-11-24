"use client";

import { useState } from "react";
import { Panel, SectionTitle, Stat } from "@/components/ugc/ui";
import { CeoHead, CeoNav, Del, Loading, NumIn, TextIn } from "@/components/ugc/ceo";
import { num, uid, usd, useCeo, useToday, type Creator } from "@/lib/ceo";

const STAGES: Creator["stage"][] = ["applied", "testing", "approved", "rejected"];
const STEPS = [
  ["Source", "Post a short brief in Discord and your community: niche, pay per video, what a test involves."],
  ["Screen", "Look at 3 of their videos: hook, lighting, sound, energy on camera."],
  ["Paid test", "2 videos on a real brief, paid at your normal rate. Never unpaid spec work."],
  ["Score", "Hook, delivery, lighting, turnaround, each out of 5. Approve at 4+ overall."],
  ["Assign", "Match by niche and past score. Brief, deadline and payment date in writing."],
  ["Pay on time", "Pay within the days you promised, even if the client pays late. That's what keeps a bench loyal."],
];

export default function CeoCreators() {
  const [data, update, ready] = useCeo();
  const today = useToday();
  const [stage, setStage] = useState<"all" | Creator["stage"]>("all");
  if (!ready || !today) return <Loading />;

  const c = data.creators;
  const approved = c.filter((x) => x.stage === "approved");
  const owed = c.reduce((t, x) => t + num(x.owed), 0), paid = c.reduce((t, x) => t + num(x.paid), 0);
  const shown = c.filter((x) => stage === "all" || x.stage === stage);
  const edit = (id: string, p: Partial<Creator>) => update((d) => ({ ...d, creators: d.creators.map((x) => (x.id === id ? { ...x, ...p } : x)) }));

  return (
    <div>
      <CeoNav />
      <CeoHead today={today} title="Creator management" sub="The bench that lets Dre Media deliver without you on camera. Recruit, test, score, assign and pay on time." />
      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
        <Stat label="Approved" value={`${approved.length} / 10`} sub="Target by day 62" />
        <Stat label="In testing" value={c.filter((x) => x.stage === "testing").length} />
        <Stat label="Owed to creators" value={<span className={owed > 0 ? "text-dm-bad" : ""}>{usd(owed)}</span>} />
        <Stat label="Paid to creators" value={usd(paid)} />
      </div>

      <Panel className="mt-5 p-5 md:p-6">
        <SectionTitle right={
          <select value={stage} onChange={(e) => setStage(e.target.value as "all" | Creator["stage"])} className="dm-field w-auto" aria-label="Filter by stage">
            <option value="all">All ({c.length})</option>
            {STAGES.map((s) => <option key={s} value={s}>{s} ({c.filter((x) => x.stage === s).length})</option>)}
          </select>
        }>Creator profiles</SectionTitle>
        <form
          className="grid gap-2.5 sm:grid-cols-[1fr_1fr_1fr_0.7fr_auto] sm:items-end"
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            update((d) => ({ ...d, creators: [...d.creators, { id: uid(), name: String(f.get("name")).trim(), niche: String(f.get("niche") || ""), platforms: String(f.get("platforms") || ""), portfolio: "", rate: num(f.get("rate")), availability: "", stage: "applied", quality: "", assigned: "", owed: 0, paid: 0 }] }));
            e.currentTarget.reset();
          }}
        >
          <div><label className="dm-label" htmlFor="n">Name</label><input id="n" name="name" required className="dm-field" /></div>
          <div><label className="dm-label" htmlFor="ni">Niche</label><input id="ni" name="niche" className="dm-field" placeholder="Tech, beauty, fitness…" /></div>
          <div><label className="dm-label" htmlFor="pl">Platforms</label><input id="pl" name="platforms" className="dm-field" placeholder="TikTok, Instagram" /></div>
          <div><label className="dm-label" htmlFor="r">$ per video</label><input id="r" name="rate" type="number" min="0" defaultValue={50} className="dm-field" /></div>
          <button className="dm-btn-primary h-[42px]">Add</button>
        </form>

        <ul className="mt-4 grid gap-2">
          {shown.length ? shown.map((x) => (
            <li key={x.id}>
              <details className="rounded-xl border border-dm-line">
                <summary className="flex min-h-[52px] cursor-pointer list-none flex-wrap items-center gap-x-3 gap-y-1 px-3.5 py-2 text-[14px]">
                  <b className="min-w-0 flex-1 truncate text-[15px]">{x.name}</b>
                  <span className="text-dm-muted">{x.niche || "No niche"} · {usd(x.rate)}/video{x.quality ? ` · ${x.quality}/5` : ""}{num(x.owed) > 0 ? ` · owed ${usd(x.owed)}` : ""}</span>
                  <select value={x.stage} onClick={(e) => e.stopPropagation()} onChange={(e) => edit(x.id, { stage: e.target.value as Creator["stage"] })} className="dm-field w-auto py-1.5 text-[13px]" aria-label={`Stage for ${x.name}`}>{STAGES.map((s) => <option key={s}>{s}</option>)}</select>
                </summary>
                <div className="grid gap-2.5 border-t border-dm-line p-3.5 sm:grid-cols-3">
                  <div><span className="dm-label">Niche</span><TextIn label="Niche" value={x.niche} onSave={(v) => edit(x.id, { niche: v })} /></div>
                  <div><span className="dm-label">Platforms</span><TextIn label="Platforms" value={x.platforms} onSave={(v) => edit(x.id, { platforms: v })} /></div>
                  <div><span className="dm-label">Portfolio link</span><TextIn label="Portfolio link" value={x.portfolio} placeholder="https://" onSave={(v) => edit(x.id, { portfolio: v })} /></div>
                  <div><span className="dm-label">Rate $/video</span><NumIn label="Rate" value={x.rate} onSave={(v) => edit(x.id, { rate: v ?? 0 })} /></div>
                  <div><span className="dm-label">Availability</span><TextIn label="Availability" value={x.availability} placeholder="e.g. 10 videos a week" onSave={(v) => edit(x.id, { availability: v })} /></div>
                  <div>
                    <span className="dm-label">Quality score</span>
                    <select value={x.quality} onChange={(e) => edit(x.id, { quality: e.target.value })} className="dm-field" aria-label="Quality score">{["", "1", "2", "3", "4", "5"].map((s) => <option key={s} value={s}>{s ? s + " / 5" : "Not scored"}</option>)}</select>
                  </div>
                  <div><span className="dm-label">Assigned to</span><TextIn label="Assigned campaign" value={x.assigned} placeholder="Client or campaign" onSave={(v) => edit(x.id, { assigned: v })} /></div>
                  <div><span className="dm-label">Owed $</span><NumIn label="Owed" value={x.owed} onSave={(v) => edit(x.id, { owed: v ?? 0 })} /></div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1"><span className="dm-label">Paid $ to date</span><NumIn label="Paid" value={x.paid} onSave={(v) => edit(x.id, { paid: v ?? 0 })} /></div>
                    <button className="dm-btn-ghost h-[42px] px-3 text-[13px]" disabled={!num(x.owed)} onClick={() => edit(x.id, { paid: num(x.paid) + num(x.owed), owed: 0 })}>Mark paid</button>
                  </div>
                  {x.portfolio.startsWith("https://") && <a href={x.portfolio} target="_blank" rel="noreferrer" className="text-[13px] text-dm-muted underline hover:text-dm-ink">Open portfolio</a>}
                  <div className="flex justify-end sm:col-span-3"><Del label={`Delete ${x.name}`} onClick={() => update((d) => ({ ...d, creators: d.creators.filter((y) => y.id !== x.id) }))} /></div>
                </div>
              </details>
            </li>
          )) : <li className="py-4 text-[14px] text-dm-muted">{c.length ? "Nobody at this stage." : "No creators yet. Recruit 5 from Discord and your community by 8 Dec."}</li>}
        </ul>
      </Panel>

      <Panel className="mt-5 p-5 md:p-6">
        <SectionTitle sub="The same steps every time, so a coordinator can run them later">Recruitment and management process</SectionTitle>
        <ol className="grid gap-3 md:grid-cols-2">
          {STEPS.map(([k, v], i) => (
            <li key={k} className="flex gap-3 text-[14px]"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-dm-ink text-[12px] font-semibold text-dm-bg">{i + 1}</span><span><b>{k}.</b> {v}</span></li>
          ))}
        </ol>
      </Panel>
    </div>
  );
}
