"use client";

import { useState } from "react";
import { cx } from "@/components/ui";
import { CopyBtn, Panel, SectionTitle } from "@/components/ugc/ui";
import { Bar, CeoHead, CeoNav, Del, Loading, NumIn, TextIn } from "@/components/ugc/ceo";
import { CALL_QUESTIONS, FOLLOWUP, OFFERS, OUTREACH, STAGES, STAMP, TOUCH_KINDS, addDays, funnel, nice, num, pct, uid, usd, useCeo, useToday, weekStart, type Lead, type Stage } from "@/lib/ceo";

export default function CeoCrm() {
  const [data, update, ready] = useCeo();
  const today = useToday();
  const [q, setQ] = useState("");
  const [stage, setStage] = useState<"all" | Stage>("all");
  if (!ready || !today) return <Loading />;

  const s = data.settings, ws = weekStart(today);
  const f = funnel(data, ws, addDays(ws, 6));
  const all = funnel(data, "2000-01-01", "2999-12-31");
  const goal = num(s.emailsPerDay) * 5;
  const due = data.leads.filter((x) => x.next && x.next <= today && x.stage !== "won" && x.stage !== "lost");
  const won = data.leads.filter((x) => x.stage === "won");
  const shown = data.leads.filter((x) => (stage === "all" || x.stage === stage) && (!q || [x.brand, x.contact, x.email, x.signal].join(" ").toLowerCase().includes(q.toLowerCase())));

  const edit = (id: string, patch: Partial<Lead>) =>
    update((d) => ({
      ...d,
      leads: d.leads.map((x) => {
        if (x.id !== id) return x;
        const n: Lead = { ...x, ...patch };
        if (patch.stage) {
          const k = STAMP[patch.stage];
          if (k && !n[k]) n[k] = today;
          if (patch.stage === "emailed" && !x.next) n.next = addDays(today, 3);
          if (patch.stage === "won" || patch.stage === "lost") n.next = "";
        }
        return n;
      }),
    }));
  const touch = (l: Lead, kind: string, note: string) => {
    const t = { date: today, kind, note };
    const patch: Partial<Lead> = { touches: [t, ...l.touches] };
    if ((kind === "Email" || kind === "DM") && l.stage === "lead") Object.assign(patch, { stage: "emailed" as Stage });
    if (kind === "Follow-up") patch.next = addDays(today, 4);
    if (kind === "Proposal" && !["won", "lost"].includes(l.stage)) Object.assign(patch, { stage: "proposal" as Stage });
    edit(l.id, patch);
  };
  const add = (rows: Partial<Lead>[]) =>
    update((d) => ({ ...d, leads: [...rows.map((r) => ({ id: uid(), brand: "", contact: "", email: "", signal: "", stage: "lead" as Stage, value: null, next: "", touches: [], ...r })), ...d.leads] }));

  return (
    <div>
      <CeoNav />
      <CeoHead today={today} title="Brand CRM" sub={`${num(s.emailsPerDay)} personalised emails a day to brands that already pay for creator content. Only as many as you can keep high quality.`} />

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel className="p-5 md:p-6">
          <SectionTitle sub={`Week of ${nice(ws)}`}>Pipeline this week</SectionTitle>
          <div className="grid gap-2.5">
            <Bar label="Emails sent" value={f.emails} target={goal} show={`${f.emails} / ${goal}`} />
            <Bar label="Replies" value={f.replied} target={Math.max(1, Math.round(goal * 0.08))} show={`${f.replied} / ${Math.max(1, Math.round(goal * 0.08))}`} />
            <Bar label="Meetings" value={f.meetings} target={3} show={`${f.meetings} / 3`} />
            <Bar label="Proposals" value={f.proposals} target={2} show={`${f.proposals} / 2`} />
            <Bar label="Won" value={f.won} target={1} show={`${f.won} / 1`} />
          </div>
          <p className="mt-4 text-[14px] text-dm-muted">
            All time: {data.leads.length} prospects · {all.emailed} emailed · reply rate <b className="text-dm-ink">{all.emailed ? pct(all.replied / all.emailed) : "—"}</b> · meeting rate {all.replied ? pct(all.meetings / all.replied) : "—"} · close rate {all.proposals ? pct(all.won / all.proposals) : "—"}.
          </p>
          <p className="mt-1 text-[14px]"><b>{usd(won.reduce((t, x) => t + num(x.value), 0))}</b>/month signed across {won.length} deal{won.length === 1 ? "" : "s"}.</p>
        </Panel>
        <Panel className="p-5 md:p-6">
          <SectionTitle sub="Logging a follow-up sets the next one 4 days out">Follow-ups due</SectionTitle>
          {due.length ? (
            <ul className="divide-y divide-dm-line">
              {due.map((x) => (
                <li key={x.id} className="flex items-center justify-between gap-3 py-2 text-[14px]">
                  <span className="min-w-0"><b>{x.brand}</b> <span className="text-dm-muted">· {x.stage}</span></span>
                  <span className="flex items-center gap-2">
                    <span className="whitespace-nowrap font-semibold text-dm-bad">{nice(x.next)}</span>
                    <button className="dm-btn-ghost h-9 px-3 text-[13px]" onClick={() => touch(x, "Follow-up", "")}>Followed up</button>
                  </span>
                </li>
              ))}
            </ul>
          ) : <p className="text-[14px] text-dm-muted">Nothing due. Emailing a brand sets a follow-up 3 days later.</p>}
        </Panel>
      </div>

      <Panel className="mt-5 p-5 md:p-6">
        <SectionTitle sub="Open a brand for its contact details and outreach history.">Prospects</SectionTitle>
        <form
          className="grid gap-2.5 sm:grid-cols-[1fr_1fr_1fr_1fr_auto] sm:items-end"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            add([{ brand: String(fd.get("brand")).trim(), contact: String(fd.get("contact") || ""), email: String(fd.get("email") || ""), signal: String(fd.get("signal") || "") }]);
            e.currentTarget.reset();
          }}
        >
          <div><label className="dm-label" htmlFor="b">Brand</label><input id="b" name="brand" required className="dm-field" /></div>
          <div><label className="dm-label" htmlFor="c">Contact</label><input id="c" name="contact" className="dm-field" placeholder="Founder or growth lead" /></div>
          <div><label className="dm-label" htmlFor="e">Email or handle</label><input id="e" name="email" className="dm-field" /></div>
          <div><label className="dm-label" htmlFor="s">Signal seen</label><input id="s" name="signal" className="dm-field" placeholder="UGC ads, creator campaign, job post" /></div>
          <button className="dm-btn-primary h-[42px]">Add</button>
        </form>
        <details className="mt-2">
          <summary className="cursor-pointer py-2 text-[13px] text-dm-muted">Paste a list (one brand per line)</summary>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const names = String(new FormData(e.currentTarget).get("bulk") || "").split("\n").map((x) => x.trim()).filter(Boolean);
              if (names.length) add(names.map((brand) => ({ brand })));
              e.currentTarget.reset();
            }}
          >
            <textarea name="bulk" rows={4} className="dm-field" />
            <button className="dm-btn-ghost mt-2">Add all</button>
          </form>
        </details>

        <div className="mt-3 flex flex-wrap gap-2.5">
          <input value={q} onChange={(e) => setQ(e.target.value)} className="dm-field max-w-xs" placeholder="Search" aria-label="Search prospects" />
          <select value={stage} onChange={(e) => setStage(e.target.value as "all" | Stage)} className="dm-field w-auto" aria-label="Filter by stage">
            <option value="all">All stages ({data.leads.length})</option>
            {STAGES.map((x) => <option key={x} value={x}>{x} ({data.leads.filter((l) => l.stage === x).length})</option>)}
          </select>
        </div>

        <ul className="mt-3 grid gap-2">
          {shown.length ? shown.map((l) => (
            <li key={l.id}>
              <details className="rounded-xl border border-dm-line">
                <summary className="flex min-h-[52px] cursor-pointer list-none flex-wrap items-center gap-x-3 gap-y-1 px-3.5 py-2">
                  <b className="min-w-0 flex-1 truncate text-[15px]">{l.brand}</b>
                  <span className="text-[13px] text-dm-muted">{l.touches.length} touch{l.touches.length === 1 ? "" : "es"}</span>
                  {l.next && l.stage !== "won" && l.stage !== "lost" && <span className={cx("text-[13px]", l.next <= today ? "font-semibold text-dm-bad" : "text-dm-muted")}>next {nice(l.next)}</span>}
                  <select value={l.stage} onClick={(e) => e.stopPropagation()} onChange={(e) => edit(l.id, { stage: e.target.value as Stage })} className="dm-field w-auto py-1.5 text-[13px]" aria-label={`Stage for ${l.brand}`}>
                    {STAGES.map((x) => <option key={x}>{x}</option>)}
                  </select>
                </summary>
                <div className="border-t border-dm-line p-3.5">
                  <div className="grid gap-2.5 sm:grid-cols-3">
                    <div><span className="dm-label">Contact</span><TextIn label="Contact" value={l.contact} onSave={(v) => edit(l.id, { contact: v })} /></div>
                    <div><span className="dm-label">Email or handle</span><TextIn label="Email" value={l.email} onSave={(v) => edit(l.id, { email: v })} /></div>
                    <div><span className="dm-label">Signal</span><TextIn label="Signal" value={l.signal} onSave={(v) => edit(l.id, { signal: v })} /></div>
                    <div><span className="dm-label">Next follow-up</span><TextIn type="date" label="Next follow-up" value={l.next} onSave={(v) => edit(l.id, { next: v })} /></div>
                    <div><span className="dm-label">Deal value $/month</span><NumIn label="Deal value" value={l.value} onSave={(v) => edit(l.id, { value: v })} /></div>
                    <div className="flex items-end justify-end"><Del label={`Delete ${l.brand}`} onClick={() => update((d) => ({ ...d, leads: d.leads.filter((x) => x.id !== l.id) }))} /></div>
                  </div>
                  <form
                    className="mt-3 grid gap-2 sm:grid-cols-[auto_minmax(0,1fr)_auto]"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const fd = new FormData(e.currentTarget);
                      touch(l, String(fd.get("kind")), String(fd.get("note") || ""));
                      e.currentTarget.reset();
                    }}
                  >
                    <select name="kind" className="dm-field w-auto" aria-label="Kind of touch">{TOUCH_KINDS.map((k) => <option key={k}>{k}</option>)}</select>
                    <input name="note" className="dm-field" placeholder="What you sent or what they said" aria-label="Touch note" />
                    <button className="dm-btn-primary h-[42px]">Log</button>
                  </form>
                  {l.touches.length > 0 && (
                    <ol className="mt-3 space-y-1 text-[13px]">
                      {l.touches.map((t, i) => <li key={i}><span className="text-dm-muted">{nice(t.date)} · {t.kind}</span>{t.note ? ` · ${t.note}` : ""}</li>)}
                    </ol>
                  )}
                </div>
              </details>
            </li>
          )) : <li className="py-4 text-[14px] text-dm-muted">{data.leads.length ? "Nothing matches." : "No prospects yet. Add consumer apps already paying creators."}</li>}
        </ul>
      </Panel>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Panel className="p-5 md:p-6">
          <SectionTitle sub="Under 90 words. Replace every bracket with something specific." right={<CopyBtn text={OUTREACH} />}>First email</SectionTitle>
          <div className="whitespace-pre-wrap rounded-xl bg-dm-surface2 p-4 text-[14px] leading-relaxed">{OUTREACH}</div>
          <div className="mb-3 mt-5 flex items-end justify-between gap-2"><h3 className="text-[15px] font-semibold">Day-4 follow-up</h3><CopyBtn text={FOLLOWUP} /></div>
          <div className="whitespace-pre-wrap rounded-xl bg-dm-surface2 p-4 text-[14px] leading-relaxed">{FOLLOWUP}</div>
        </Panel>
        <Panel className="p-5 md:p-6">
          <SectionTitle sub="Ask first. Pitch one offer second. Book the next step before you hang up.">Discovery call</SectionTitle>
          <ol className="list-decimal space-y-2 pl-5 text-[14px] leading-relaxed">{CALL_QUESTIONS.map((x) => <li key={x}>{x}</li>)}</ol>
          <div className="mt-4 grid gap-2 text-[14px]">
            {OFFERS.map((o) => <div key={o.name} className="rounded-xl bg-dm-surface2 p-3"><b>{o.name}.</b> {o.text}</div>)}
          </div>
        </Panel>
      </div>
    </div>
  );
}
