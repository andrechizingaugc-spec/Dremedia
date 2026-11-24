"use client";

import { useState } from "react";
import { Panel, SectionTitle } from "@/components/ugc/ui";
import { CeoHead, CeoNav, Del, Loading } from "@/components/ugc/ceo";
import { addDays, funnel, margin, nice, num, pct, periodStats, ugcStats, uid, usd, useCeo, useToday, weekStart, type Review } from "@/lib/ceo";

const QUESTIONS: [keyof Review, string][] = [
  ["working", "What is working?"],
  ["notWorking", "What is not working?"],
  ["stop", "What should stop?"],
  ["improve", "What should improve?"],
  ["opportunity", "What is the biggest opportunity?"],
  ["top3", "The three most important priorities next week"],
];
const EMPTY: Review = { working: "", notWorking: "", stop: "", improve: "", opportunity: "", top3: "" };

export default function CeoReview() {
  const [data, update, ready] = useCeo();
  const today = useToday();
  const [back, setBack] = useState(0);
  if (!ready || !today) return <Loading />;

  const ws = addDays(weekStart(today), -7 * back), we = addDays(ws, 6);
  const fin = periodStats(data, ws, we);
  const f = funnel(data, ws, we);
  const ug = ugcStats(data, ws, we);
  const active = data.clients.filter((c) => c.status === "active");
  const fees = active.reduce((t, c) => t + num(c.fee), 0), contrib = active.reduce((t, c) => t + margin(c).contribution, 0);
  const doneTasks = data.tasks.filter((t) => t.doneOn && t.doneOn >= ws && t.doneOn <= we).length;
  const delegable = data.tasks.filter((t) => !t.done && t.who !== "Me").length;
  let hours = 0, offDays = 0;
  for (let d = ws; d <= we; d = addDays(d, 1)) {
    hours += num(data.days[d]?.hours);
    if (data.days[d]?.c?.off) offDays++;
  }
  const r = data.reviews[ws] || EMPTY;
  const areas: [string, [string, string][]][] = [
    ["Financial", [["Earned", usd(fin.rev)], ["Received", usd(fin.received)], ["Costs", usd(fin.costs)], ["Net profit", usd(fin.net)], ["Cash available", usd(num(data.settings.cash))]]],
    ["Sales", [["Emails", String(f.emails)], ["Replies", String(f.replied)], ["Meetings", String(f.meetings)], ["Proposals", String(f.proposals)], ["Won", String(f.won)]]],
    ["UGC", [["Posted", String(ug.posted)], ["Qualified", String(ug.qual)], ["Hit rate", ug.hit == null ? "—" : pct(ug.hit)], ["Estimated", usd(ug.earned)]]],
    ["Agency", [["Active clients", String(active.length)], ["Margin", fees ? pct(contrib / fees) : "—"], ["Creators approved", String(data.creators.filter((c) => c.stage === "approved").length)]]],
    ["Team", [["Tasks done", String(doneTasks)], ["Ready to delegate", String(delegable)], ["Owed to creators", usd(data.creators.reduce((t, c) => t + num(c.owed), 0))]]],
    ["Founder", [["Hours", String(hours)], ["Days off", String(offDays)], ["Burnout check", hours > 35 || offDays === 0 ? "At risk" : "OK"]]],
  ];

  return (
    <div>
      <CeoNav />
      <CeoHead today={today} title="Weekly CEO review" sub="Every Saturday, one hour. The numbers fill themselves in from the rest of the dashboard; you answer the six questions and log decisions.">
        <div className="flex items-center gap-2">
          <button className="dm-btn-ghost h-9" onClick={() => setBack(back + 1)}>← Earlier</button>
          <span className="whitespace-nowrap text-[14px]">Week of {nice(ws)}</span>
          <button className="dm-btn-ghost h-9" disabled={back === 0} onClick={() => setBack(back - 1)}>Later →</button>
        </div>
      </CeoHead>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {areas.map(([name, rows]) => (
          <Panel key={name} className="p-4">
            <h2 className="text-[15px] font-semibold">{name}</h2>
            <dl className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-1 text-[14px]">
              {rows.map(([k, v]) => [<dt key={k} className="text-dm-muted">{k}</dt>, <dd key={k + "v"} className="text-right tabular-nums">{v}</dd>])}
            </dl>
          </Panel>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <Panel className="p-5 md:p-6">
          <SectionTitle sub="Honest answers. One line each is enough.">The six questions</SectionTitle>
          <div className="grid gap-3">
            {QUESTIONS.map(([k, q]) => (
              <div key={k + ws}>
                <label className="dm-label" htmlFor={`q-${k}`}>{q}</label>
                <textarea
                  id={`q-${k}`}
                  rows={k === "top3" ? 3 : 2}
                  defaultValue={r[k]}
                  onBlur={(e) => e.target.value !== r[k] && update((d) => ({ ...d, reviews: { ...d.reviews, [ws]: { ...EMPTY, ...(d.reviews[ws] || {}), [k]: e.target.value } } }))}
                  className="dm-field"
                />
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="p-5 md:p-6">
          <SectionTitle sub="What you decided and why, so future-you and any team member can see the reasoning.">Decision log</SectionTitle>
          <form
            className="grid gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const f2 = new FormData(e.currentTarget);
              update((d) => ({ ...d, decisions: [{ id: uid(), date: today, decision: String(f2.get("decision")).trim(), why: String(f2.get("why") || "") }, ...d.decisions] }));
              e.currentTarget.reset();
            }}
          >
            <input name="decision" required className="dm-field" placeholder="Decision" aria-label="Decision" />
            <input name="why" className="dm-field" placeholder="Why: the reason or the number behind it" aria-label="Reason" />
            <button className="dm-btn-primary h-[42px] justify-self-start">Log decision</button>
          </form>
          <ul className="mt-3 divide-y divide-dm-line">
            {data.decisions.length ? data.decisions.map((x) => (
              <li key={x.id} className="flex items-start gap-2 py-2 text-[14px]">
                <span className="min-w-0 flex-1"><span className="text-[12px] text-dm-muted">{nice(x.date)}</span><br /><b>{x.decision}</b>{x.why && <span className="text-dm-muted"> · {x.why}</span>}</span>
                <Del label="Delete decision" onClick={() => update((d) => ({ ...d, decisions: d.decisions.filter((y) => y.id !== x.id) }))} />
              </li>
            )) : <li className="py-3 text-[14px] text-dm-muted">No decisions logged yet. Log each big call here with the reason behind it.</li>}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
