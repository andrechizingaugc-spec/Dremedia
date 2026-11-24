"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { cx } from "@/components/ui";
import { Panel, SectionTitle, Stat } from "@/components/ugc/ui";
import { Bar, Board90, CeoHead, CeoNav, Loading, NumIn } from "@/components/ugc/ceo";
import {
  KIND, LESSONS, SCHEDULE, addDays, alerts, dayN, funnel, kindOf, monthName, monthStats, nice, num, pct, targetUsd, ugcStats, unpaid, usd, useCeo, useToday, weekStart, type Day,
} from "@/lib/ceo";

export default function CeoOverview() {
  const [data, update, ready] = useCeo();
  const today = useToday();
  const [picked, setPicked] = useState("");
  if (!ready || !today) return <Loading />;

  const sel = picked || today;
  const s = data.settings, m = today.slice(0, 7);
  const st = monthStats(data, m);
  const target = targetUsd(s) || 6000;
  const u = unpaid(data, today);
  const ws = weekStart(today);
  const f = funnel(data, ws, today);
  const ug = ugcStats(data, addDays(today, -6), today);
  const rec: Day = data.days[sel] || {};
  const tpl = SCHEDULE[kindOf(sel)];
  const setDay = (patch: Partial<Day>) => update((d) => ({ ...d, days: { ...d.days, [sel]: { ...(d.days[sel] || {}), ...patch } } }));
  const al = alerts(data, today);
  const top3 = rec.top3 || ["", "", ""];

  // daily planner
  const delegate = data.tasks.filter((t) => !t.done && t.who !== "Me").slice(0, 4);
  const hot = data.leads.filter((l) => ["replied", "meeting", "proposal"].includes(l.stage)).slice(0, 4);
  const weekdays = Math.min(5, Math.max(1, ((new Date().getDay() + 6) % 7) + 1));
  const emailPace = f.emails / (num(s.emailsPerDay) * weekdays || 1);
  const metrics: [string, number, string][] = [
    ["Revenue pace", st.rev / ((target * Math.min(30, Number(today.slice(8)))) / 30 || 1), `${usd(st.rev)} earned, ${usd(target)} target`],
    ["Email volume", emailPace, `${f.emails} emails this week, ${num(s.emailsPerDay)} a day planned`],
    ["Reply rate", f.emailed ? f.replied / f.emailed / 0.08 : 1, f.emailed ? `${pct(f.replied / f.emailed)} replies, target 8%` : "No emails yet this week"],
    ["Campaign hit rate", ug.hit == null ? 1 : ug.hit / 0.6, ug.hit == null ? "No videos logged" : `${pct(ug.hit)} qualifying, target 60%`],
  ];
  const weakest = metrics.slice().sort((a, b) => a[1] - b[1])[0];
  const lesson = LESSONS.find((l) => !data.lessons[l.id]?.done);
  const runway = num(s.costs) > 0 ? (num(s.cash) / num(s.costs)).toFixed(1) + " mo" : "—";

  return (
    <div>
      <CeoNav />
      <CeoHead today={today} title="Dre Media command centre" sub="Cash flow first, then a profitable agency, then systems that run without you on camera." />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <Panel className="p-5 md:p-6">
          <div className="text-[13px] text-dm-muted">Earned in {monthName(m)}</div>
          <div className="mt-1 text-[56px] font-semibold leading-none tracking-[-0.03em] tabular-nums md:text-[72px]">{usd(st.rev)}</div>
          <div className="mt-2 text-[15px]">
            of the {s.targetCur === "ZAR" ? `R${num(s.target).toLocaleString("en-US")} (${usd(target)})` : usd(target)} target · <b>{pct(st.rev / target)}</b>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-dm-surface2">
            <div className="h-full rounded-full bg-dm-ink transition-[width] duration-700 motion-reduce:transition-none" style={{ width: Math.min(100, (st.rev / target) * 100) + "%" }} />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            <Stat label="Received" value={usd(st.received)} sub="Landed this month" />
            <Stat label="Costs" value={usd(st.costs)} sub={`${usd(st.direct)} direct`} />
            <Stat label="Net profit" value={usd(st.net)} sub="After costs and tax set-aside" />
            <Stat label="Earned, not received" value={usd(u.total)} sub={u.old ? <span className="text-dm-bad">{usd(u.old)} over 30 days</span> : "All recent"} />
            <Stat label="Cash available" value={usd(num(s.cash))} sub={`Runway ${runway}`} />
            <Stat label="Biggest source" value={<span className={cx(st.share != null && st.share > 0.5 && "text-dm-bad")}>{st.share == null ? "—" : pct(st.share)}</span>} sub="Target under 50%" />
          </div>
        </Panel>

        <Panel className="p-5 md:p-6">
          <SectionTitle sub="One square a day, filling as you tick that day's checklist. Tap a day to open it.">The 90-day board</SectionTitle>
          <Board90 data={data} today={today} sel={sel} onPick={setPicked} />
        </Panel>
      </div>

      <Panel className={cx("mt-5 p-5 md:p-6", al.length > 0 && "border-dm-ink")}>
        <SectionTitle sub="Worked out from your numbers. Each one links to where you fix it.">Business alerts</SectionTitle>
        {al.length ? (
          <ul className="grid gap-2 sm:grid-cols-2">
            {al.map((a) => (
              <li key={a.text}>
                <Link href={a.href} className="flex min-h-[44px] items-center gap-3 rounded-xl bg-dm-surface2 px-3 py-2 text-[14px] hover:bg-dm-line/60">
                  <AlertTriangle size={16} className={cx("shrink-0", a.level === "bad" ? "text-dm-bad" : "text-dm-warn")} />
                  <span className="min-w-0 flex-1">{a.text}</span>
                  <ArrowRight size={14} className="shrink-0 text-dm-muted" />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[14px] text-dm-muted">No alerts. Alerts appear when follow-ups are due, money is late, one client gets too big, deadlines close in, or you work too many hours.</p>
        )}
      </Panel>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <Panel className="p-5 md:p-6">
          <SectionTitle
            sub={`${KIND[kindOf(sel)]} · day ${dayN(sel)}`}
            right={sel !== today ? <button className="dm-btn-ghost h-9" onClick={() => setPicked("")}>Back to today</button> : undefined}
          >
            {sel === today ? "Daily CEO planner" : nice(sel)}
          </SectionTitle>

          <div className="mb-4">
            <div className="dm-label">The 3 highest-priority actions</div>
            <div className="grid gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i + sel} className="flex items-center gap-2">
                  <span className="w-5 text-[18px] font-semibold">{i + 1}</span>
                  <input
                    aria-label={`Priority ${i + 1}`}
                    defaultValue={top3[i] || ""}
                    onBlur={(e) => {
                      if (e.target.value === (top3[i] || "")) return;
                      const next = [...top3];
                      next[i] = e.target.value;
                      setDay({ top3: next });
                    }}
                    className="dm-field"
                    placeholder={i === 0 ? "The one thing that moves revenue today" : ""}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="dm-label">Must be completed</div>
          <ul className="divide-y divide-dm-line">
            {tpl.map(([id, when, what]) => {
              const on = !!rec.c?.[id];
              return (
                <li key={id}>
                  <label className="flex min-h-[48px] cursor-pointer items-start gap-3 py-2.5">
                    <input type="checkbox" checked={on} onChange={(e) => setDay({ c: { ...(rec.c || {}), [id]: e.target.checked } })} className="mt-0.5 h-5 w-5 shrink-0 accent-[rgb(var(--dm-ink))]" />
                    <span className="w-16 shrink-0 pt-0.5 text-[12px] text-dm-muted">{when}</span>
                    <span className={cx("text-[15px]", on && "text-dm-muted line-through")}>{what}</span>
                  </label>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 grid grid-cols-[8rem_minmax(0,1fr)] items-end gap-3">
            <div><span className="dm-label">Hours worked</span><NumIn label="Hours worked" step="0.5" value={rec.hours} onSave={(v) => setDay({ hours: v })} /></div>
            <div>
              <label className="dm-label" htmlFor="note">What moved the business?</label>
              <input id="note" key={sel} defaultValue={rec.note || ""} onBlur={(e) => e.target.value !== (rec.note || "") && setDay({ note: e.target.value })} className="dm-field" />
            </div>
          </div>
        </Panel>

        <div className="grid content-start gap-5">
          <Panel className="p-5 md:p-6">
            <SectionTitle sub={weakest[2]}>Metric to improve: {weakest[0]}</SectionTitle>
            <div className="grid gap-2.5">
              <Bar label="Emails" value={f.emails} target={num(s.emailsPerDay) * 5} show={`${f.emails} / ${num(s.emailsPerDay) * 5}`} />
              <Bar label="Replies" value={f.replied} target={Math.max(1, Math.round(num(s.emailsPerDay) * 5 * 0.08))} show={`${f.replied} / ${Math.max(1, Math.round(num(s.emailsPerDay) * 5 * 0.08))}`} />
              <Bar label="Meetings" value={f.meetings} target={3} show={`${f.meetings} / 3`} />
              <Bar label="Proposals" value={f.proposals} target={2} show={`${f.proposals} / 2`} />
              <Bar label="Hit rate (7d)" value={ug.hit || 0} target={1} show={ug.hit == null ? "—" : `${pct(ug.hit)} / 60%`} warn={ug.hit != null && ug.hit < 0.5} />
            </div>
          </Panel>

          <Panel className="p-5 md:p-6">
            <SectionTitle right={<Link href="/ugc/ceo/crm" className="text-[13px] text-dm-muted hover:text-dm-ink">CRM →</Link>}>Revenue opportunities</SectionTitle>
            {hot.length ? (
              <ul className="divide-y divide-dm-line text-[14px]">
                {hot.map((l) => (
                  <li key={l.id} className="flex justify-between gap-3 py-2"><b className="min-w-0 truncate">{l.brand}</b><span className="whitespace-nowrap text-dm-muted">{l.stage}{l.value ? ` · ${usd(l.value)}/mo` : ""}</span></li>
                ))}
              </ul>
            ) : <p className="text-[14px] text-dm-muted">No brand has replied yet. Replies, meetings and proposals show here.</p>}
          </Panel>

          <Panel className="p-5 md:p-6">
            <SectionTitle right={<Link href="/ugc/ceo/plan" className="text-[13px] text-dm-muted hover:text-dm-ink">Plan →</Link>}>Can be delegated</SectionTitle>
            {delegate.length ? (
              <ul className="divide-y divide-dm-line text-[14px]">
                {delegate.map((t) => (
                  <li key={t.id} className="flex justify-between gap-3 py-2"><span className="min-w-0">{t.title}</span><span className="whitespace-nowrap text-dm-muted">{t.who}</span></li>
                ))}
              </ul>
            ) : <p className="text-[14px] text-dm-muted">Nothing marked for AI, freelancers or the team. Set "who" on tasks in Plan.</p>}
          </Panel>

          {lesson && (
            <Panel className="p-5 md:p-6">
              <div className="text-[12px] text-dm-muted">CEO lesson · week {lesson.week}</div>
              <h3 className="mt-1 text-[17px] font-semibold leading-snug">{lesson.title}</h3>
              <p className="mt-2 text-[14px]"><b>Drill:</b> {lesson.drill}</p>
              <Link href={`/ugc/ceo/academy#${lesson.id}`} className="dm-btn-ghost mt-3 h-9">Open the lesson</Link>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}
