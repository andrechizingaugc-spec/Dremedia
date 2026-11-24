"use client";

import { useState } from "react";
import { cx } from "@/components/ui";
import { Panel, Seg, SectionTitle } from "@/components/ugc/ui";
import { CeoHead, CeoNav, Del, Loading } from "@/components/ugc/ceo";
import { DIVS, LADDER, PHASES, WHO, dayN, nice, uid, useCeo, useToday, type Task, type Who } from "@/lib/ceo";

const RULES = [
  "No new division until the one before meets its gate.",
  "No new campaigns that need your face.",
  "No hire or subscription before its economic value is shown.",
  "Check platform terms before contacting a brand you met through a platform.",
  "One full day off a week, minimum.",
];

export default function CeoPlan() {
  const [data, update, ready] = useCeo();
  const today = useToday();
  const [show, setShow] = useState<"open" | "done" | "all">("open");
  if (!ready || !today) return <Loading />;

  const n = dayN(today);
  const tasks = data.tasks.filter((t) => show === "all" || (show === "open" ? !t.done : t.done)).sort((a, b) => ((a.due || "9") < (b.due || "9") ? -1 : 1));
  const edit = (id: string, p: Partial<Task>) => update((d) => ({ ...d, tasks: d.tasks.map((x) => (x.id === id ? { ...x, ...p } : x)) }));
  const check = (id: string, v: boolean) => update((d) => ({ ...d, checks: { ...d.checks, [id]: v } }));

  return (
    <div>
      <CeoNav />
      <CeoHead today={today} title="The 90-day plan" sub="A phase ends when its gate is met. If you miss a gate, extend the phase. Don't skip ahead." />

      <div className="grid gap-4 lg:grid-cols-3">
        {PHASES.map((p) => {
          const on = n >= p.from && n <= p.to;
          const met = p.gate.every((_, i) => data.checks[`g${p.n}-${i}`]);
          const box = (id: string, text: string) => (
            <li key={id}>
              <label className="flex min-h-[40px] cursor-pointer items-start gap-2.5 py-1 text-[14px]">
                <input type="checkbox" checked={!!data.checks[id]} onChange={(e) => check(id, e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[rgb(var(--dm-ink))]" />
                <span className={cx(data.checks[id] && "text-dm-muted line-through")}>{text}</span>
              </label>
            </li>
          );
          return (
            <Panel key={p.n} className={cx("p-5", on && "border-dm-ink ring-1 ring-dm-ink")}>
              <div className="flex items-baseline justify-between">
                <span className="text-[40px] font-semibold leading-none tracking-[-0.03em]">{p.n}</span>
                <span className={cx("text-[12px]", met ? "font-semibold text-dm-good" : on ? "font-semibold" : "text-dm-muted")}>{met ? "Gate met" : on ? "Now" : `Days ${p.from}–${p.to}`}</span>
              </div>
              <h2 className="mt-2 text-[18px] font-semibold leading-snug">{p.name}</h2>
              <p className="text-[13px] text-dm-muted">{p.dates}</p>
              <div className="dm-label mt-3">Priorities</div>
              <ul>{p.work.map((w, i) => box(`w${p.n}-${i}`, w))}</ul>
              <div className="dm-label mt-3">Gate, day {p.to}</div>
              <ul className="rounded-xl bg-dm-surface2 px-3 py-1">{p.gate.map((g, i) => box(`g${p.n}-${i}`, g))}</ul>
            </Panel>
          );
        })}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <Panel className="p-5 md:p-6">
          <SectionTitle right={<Seg label="Show tasks" value={show} onChange={setShow} options={[{ value: "open", label: "Open" }, { value: "done", label: "Done" }, { value: "all", label: "All" }]} />}>Tasks</SectionTitle>
          <form
            className="grid gap-2.5 sm:grid-cols-[minmax(0,2fr)_1fr_1fr_1fr_auto] sm:items-end"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              update((d) => ({ ...d, tasks: [...d.tasks, { id: uid(), title: String(f.get("title")).trim(), div: String(f.get("div")), due: String(f.get("due") || ""), done: false, who: String(f.get("who")) as Who }] }));
              e.currentTarget.reset();
            }}
          >
            <div><label className="dm-label" htmlFor="tt">Task</label><input id="tt" name="title" required className="dm-field" /></div>
            <div><label className="dm-label" htmlFor="td">Division</label><select id="td" name="div" defaultValue="Creative" className="dm-field">{DIVS.map((d) => <option key={d}>{d}</option>)}</select></div>
            <div><label className="dm-label" htmlFor="tw">Who</label><select id="tw" name="who" className="dm-field">{WHO.map((w) => <option key={w}>{w}</option>)}</select></div>
            <div><label className="dm-label" htmlFor="tdu">Due</label><input id="tdu" name="due" type="date" className="dm-field" /></div>
            <button className="dm-btn-primary h-[42px]">Add</button>
          </form>
          <ul className="mt-3 divide-y divide-dm-line">
            {tasks.length ? tasks.map((t) => (
              <li key={t.id} className="flex items-start gap-2 py-2">
                <label className="flex min-h-[44px] flex-1 cursor-pointer items-start gap-3 pt-1">
                  <input type="checkbox" checked={t.done} onChange={(e) => edit(t.id, { done: e.target.checked, doneOn: e.target.checked ? today : undefined })} className="mt-0.5 h-5 w-5 shrink-0 accent-[rgb(var(--dm-ink))]" />
                  <span className={cx("w-14 shrink-0 pt-0.5 text-[12px]", !t.done && t.due && t.due < today ? "font-semibold text-dm-bad" : "text-dm-muted")}>{t.due ? nice(t.due) : "—"}</span>
                  <span className={cx("text-[14px]", t.done && "text-dm-muted line-through")}>{t.title}<span className="block text-[12px] text-dm-muted">{t.div}</span></span>
                </label>
                <select value={t.who || "Me"} onChange={(e) => edit(t.id, { who: e.target.value as Who })} className="dm-field w-auto py-1.5 text-[13px]" aria-label="Who does it">{WHO.map((w) => <option key={w}>{w}</option>)}</select>
                <Del label={`Delete ${t.title}`} onClick={() => update((d) => ({ ...d, tasks: d.tasks.filter((x) => x.id !== t.id) }))} />
              </li>
            )) : <li className="py-4 text-[14px] text-dm-muted">No tasks here.</li>}
          </ul>
        </Panel>

        <div className="grid content-start gap-5">
          <Panel className="p-5 md:p-6">
            <SectionTitle sub="Every task sits on one rung. Move it down as soon as the numbers allow.">Who does what</SectionTitle>
            <ol className="divide-y divide-dm-line">
              {LADDER.map(([who, what]) => (
                <li key={who} className="py-2.5 text-[14px]"><b>{who}</b> · {data.tasks.filter((t) => !t.done && (t.who || "Me") === who).length} open<br /><span className="text-dm-muted">{what}</span></li>
              ))}
            </ol>
            <p className="mt-3 text-[13px] text-dm-muted">The first role worth paying for is a part-time campaign coordinator at 2 active clients. Their cost should be under a third of the gross profit they free up.</p>
          </Panel>
          <Panel className="p-5 md:p-6">
            <SectionTitle>Standing rules</SectionTitle>
            <ul className="list-disc space-y-1.5 pl-5 text-[14px]">{RULES.map((r) => <li key={r}>{r}</li>)}</ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
