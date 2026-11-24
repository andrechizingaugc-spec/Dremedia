"use client";

import { cx } from "@/components/ui";
import { Panel, SectionTitle } from "@/components/ugc/ui";
import { CeoHead, CeoNav, Loading } from "@/components/ugc/ceo";
import { GUARDRAILS, LESSONS, MISSION, PRIORITIES, PROTOCOL, dayN, useCeo, useToday } from "@/lib/ceo";

export default function CeoAcademy() {
  const [data, update, ready] = useCeo();
  const today = useToday();
  if (!ready || !today) return <Loading />;

  const week = Math.max(1, Math.ceil(dayN(today) / 7));
  const done = LESSONS.filter((l) => data.lessons[l.id]?.done).length;
  const current = LESSONS.find((l) => !data.lessons[l.id]?.done);
  const setLesson = (id: string, p: Partial<{ done: boolean; note: string }>) =>
    update((d) => ({ ...d, lessons: { ...d.lessons, [id]: { ...{ done: false, note: "" }, ...(d.lessons[id] || {}), ...p } } }));

  return (
    <div>
      <CeoNav />
      <CeoHead today={today} title="CEO Academy" sub="How to go from the person doing all the work to the person who builds and runs the company. One lesson at a time, each with a drill you do in this dashboard.">
        <div className="text-right">
          <div className="text-[34px] font-semibold leading-none tabular-nums">{done}/{LESSONS.length}</div>
          <div className="text-[12px] text-dm-muted">lessons done</div>
        </div>
      </CeoHead>

      <Panel className="p-5 md:p-6">
        <SectionTitle sub="The rules this whole dashboard is built on">The Dre Media operating system</SectionTitle>
        <p className="max-w-3xl text-[16px] leading-relaxed">{MISSION}</p>
        <div className="mt-5 grid gap-6 lg:grid-cols-3">
          <div>
            <h3 className="text-[15px] font-semibold">Priorities, in order</h3>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-[14px]">{PRIORITIES.map((p) => <li key={p}>{p}</li>)}</ol>
          </div>
          <div>
            <h3 className="text-[15px] font-semibold">How every big task is done</h3>
            <ol className="mt-2 space-y-1.5 text-[14px]">
              {PROTOCOL.map(([k, v], i) => <li key={k}><b>{i + 1}. {k}.</b> <span className="text-dm-muted">{v}</span></li>)}
            </ol>
          </div>
          <div>
            <h3 className="text-[15px] font-semibold">Guardrails</h3>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[14px]">{GUARDRAILS.map((g) => <li key={g}>{g}</li>)}</ul>
          </div>
        </div>
      </Panel>

      <h2 className="mb-3 mt-8 text-[19px] font-semibold">Lessons · you're in week {Math.min(week, 13)}</h2>
      <ol className="grid gap-3 lg:grid-cols-2">
        {LESSONS.map((l, i) => {
          const st = data.lessons[l.id] || { done: false, note: "" };
          const now = current?.id === l.id;
          return (
            <li key={l.id} id={l.id} className="scroll-mt-24">
              <details open={now} className={cx("dm-panel p-4 md:p-5", now && "border-dm-ink ring-1 ring-dm-ink")}>
                <summary className="flex cursor-pointer list-none items-start gap-3">
                  <span className={cx("flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold", st.done ? "bg-dm-ink text-dm-bg" : "border border-dm-line")}>{st.done ? "✓" : i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12px] text-dm-muted">Week {l.week}{now ? " · next up" : ""}</span>
                    <span className={cx("block text-[16px] font-semibold leading-snug", st.done && "text-dm-muted")}>{l.title}</span>
                  </span>
                </summary>
                <div className="mt-3 pl-10 text-[14px] leading-relaxed">
                  <p>{l.idea}</p>
                  <p className="mt-3 rounded-xl bg-dm-surface2 p-3"><b>Rule:</b> {l.rule}</p>
                  <p className="mt-3"><b>Drill:</b> {l.drill}</p>
                  <label className="dm-label mt-3" htmlFor={`n-${l.id}`}>What I learned doing it</label>
                  <textarea id={`n-${l.id}`} rows={2} defaultValue={st.note} onBlur={(e) => e.target.value !== st.note && setLesson(l.id, { note: e.target.value })} className="dm-field" />
                  <label className="mt-2 flex min-h-[44px] cursor-pointer items-center gap-2">
                    <input type="checkbox" checked={st.done} onChange={(e) => setLesson(l.id, { done: e.target.checked })} className="h-5 w-5 accent-[rgb(var(--dm-ink))]" />
                    Drill done
                  </label>
                </div>
              </details>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
