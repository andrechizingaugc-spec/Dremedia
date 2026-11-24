"use client";

import { cx } from "@/components/ui";
import { Panel, SectionTitle, Stat } from "@/components/ugc/ui";
import { CeoHead, CeoNav, Del, Loading, NumIn, TextIn } from "@/components/ugc/ceo";
import { addDays, kindOf, KIND, logKey, monthName, nice, num, pct, ugcStats, uid, usd, useCeo, useToday, type Campaign } from "@/lib/ceo";

const LESS_WORK = [
  "Film in 2 batch sessions a week instead of every day.",
  "Remake proven winners: 4 of every 7 posts copy a format that already cleared the view bar.",
  "The editor does captions, cuts and exports. You only film and approve.",
  "Schedule posts in advance where the platform and campaign allow it.",
  "Only change what the campaign agreement allows. Your face stays on your slot.",
];

export default function CeoUgc() {
  const [data, update, ready] = useCeo();
  const today = useToday();
  if (!ready || !today) return <Loading />;

  const m = today.slice(0, 7);
  const active = data.campaigns.filter((c) => c.status === "active");
  const ms = ugcStats(data, m + "-01", today);
  const days = Array.from({ length: 14 }, (_, i) => addDays(today, -i));
  const months = Array.from(new Set(Object.keys(data.logs).map((k) => k.slice(0, 7)).concat(m))).sort().reverse().slice(0, 6);
  const edit = (id: string, p: Partial<Campaign>) => update((d) => ({ ...d, campaigns: d.campaigns.map((c) => (c.id === id ? { ...c, ...p } : c)) }));
  const setLog = (date: string, id: string, f: "posted" | "qual", v: number | null) =>
    update((d) => {
      const k = logKey(date, id);
      return { ...d, logs: { ...d.logs, [k]: { ...{ posted: null, qual: null }, ...(d.logs[k] || {}), [f]: v } } };
    });

  return (
    <div>
      <CeoNav />
      <CeoHead today={today} title="UGC campaigns" sub="Your own creator income. Protect it, raise the share of videos that qualify, and cut the work around it without breaking any campaign terms." />

      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
        <Stat label={`Posted in ${monthName(m)}`} value={ms.posted} />
        <Stat label="Qualified" value={ms.qual} />
        <Stat label="Hit rate" value={<span className={cx(ms.hit != null && ms.hit < 0.5 && "text-dm-bad")}>{ms.hit == null ? "—" : pct(ms.hit)}</span>} sub="Target 60%" />
        <Stat label="Estimated earnings" value={usd(ms.earned)} sub="Qualified × pay. Log what's approved in Money." />
      </div>

      <Panel className="mt-5 p-5 md:p-6">
        <SectionTitle sub="Brand, pay per qualifying video, view threshold, videos a day, payment status.">Campaigns</SectionTitle>
        <form
          className="grid gap-2.5 sm:grid-cols-[1.4fr_1fr_0.8fr_0.8fr_0.7fr_auto] sm:items-end"
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            update((d) => ({ ...d, campaigns: [...d.campaigns, { id: uid(), brand: String(f.get("brand")).trim(), platform: String(f.get("platform") || ""), payPer: num(f.get("payPer")), threshold: num(f.get("threshold")), perDay: num(f.get("perDay")), status: "active", deadline: "", payStatus: "", notes: "" }] }));
            e.currentTarget.reset();
          }}
        >
          <div><label className="dm-label" htmlFor="cb">Brand or campaign</label><input id="cb" name="brand" required className="dm-field" /></div>
          <div><label className="dm-label" htmlFor="cp">Where it's run</label><input id="cp" name="platform" className="dm-field" placeholder="e.g. a UGC platform" /></div>
          <div><label className="dm-label" htmlFor="cpp">$ per qualifying video</label><input id="cpp" name="payPer" type="number" min="0" step="0.01" required className="dm-field" /></div>
          <div><label className="dm-label" htmlFor="ct">View threshold</label><input id="ct" name="threshold" type="number" min="0" defaultValue={1000} className="dm-field" /></div>
          <div><label className="dm-label" htmlFor="cd">Videos a day</label><input id="cd" name="perDay" type="number" min="0" defaultValue={7} className="dm-field" /></div>
          <button className="dm-btn-primary h-[42px]">Add</button>
        </form>
        <ul className="mt-4 grid gap-3">
          {data.campaigns.length ? data.campaigns.map((c) => {
            const cs = ugcStats(data, m + "-01", today, c.id);
            return (
              <li key={c.id} className="rounded-xl border border-dm-line p-3.5">
                <div className="flex flex-wrap items-center gap-2">
                  <b className="text-[16px]">{c.brand}</b>
                  <span className="text-[13px] text-dm-muted">{c.platform} · {usd(c.payPer)} per video over {num(c.threshold).toLocaleString("en-US")} views · {c.perDay} a day · ceiling {usd(c.payPer * c.perDay * 30)}/month</span>
                  <span className="ml-auto flex items-center gap-1">
                    <select value={c.status} onChange={(e) => edit(c.id, { status: e.target.value as Campaign["status"] })} className="dm-field w-auto py-1.5 text-[13px]" aria-label="Status">{["active", "paused", "ended"].map((s) => <option key={s}>{s}</option>)}</select>
                    <Del label={`Delete ${c.brand}`} onClick={() => update((d) => ({ ...d, campaigns: d.campaigns.filter((x) => x.id !== c.id) }))} />
                  </span>
                </div>
                <div className="mt-2.5 grid gap-2.5 sm:grid-cols-[1fr_1fr_2fr]">
                  <div><span className="dm-label">Ends</span><TextIn type="date" label="Campaign end date" value={c.deadline} onSave={(v) => edit(c.id, { deadline: v })} /></div>
                  <div><span className="dm-label">Payment status</span><TextIn label="Payment status" value={c.payStatus} placeholder="e.g. approved, paid 3 Dec" onSave={(v) => edit(c.id, { payStatus: v })} /></div>
                  <div><span className="dm-label">Rules and notes</span><TextIn label="Notes" value={c.notes} placeholder="Face required, posting rules, exclusivity" onSave={(v) => edit(c.id, { notes: v })} /></div>
                </div>
                <div className="mt-2 text-[13px] text-dm-muted">This month: {cs.posted} posted · {cs.qual} qualified · {cs.hit == null ? "—" : pct(cs.hit)} hit rate · {usd(cs.earned)} estimated</div>
              </li>
            );
          }) : <li className="text-[14px] text-dm-muted">Add your active campaign to start logging.</li>}
        </ul>
      </Panel>

      {active.length > 0 && (
        <Panel className="mt-5 p-5 md:p-6">
          <SectionTitle sub="Posted and qualified per day. Fill it in each evening; it takes 20 seconds.">Daily log, last 14 days</SectionTitle>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-[14px]">
              <thead>
                <tr className="border-b-2 border-dm-ink text-left text-[12px] text-dm-muted">
                  <th className="py-2 pr-3 font-medium">Day</th>
                  {active.map((c) => <th key={c.id} colSpan={2} className="py-2 pr-3 font-medium">{c.brand}: posted / qualified</th>)}
                  <th className="py-2 text-right font-medium">Earned</th>
                </tr>
              </thead>
              <tbody>
                {days.map((d) => {
                  const ds = ugcStats(data, d, d);
                  return (
                    <tr key={d} className={cx("border-b border-dm-line", d === today && "bg-dm-surface2")}>
                      <td className="whitespace-nowrap py-1.5 pr-3">{nice(d)} <span className="text-[12px] text-dm-muted">{KIND[kindOf(d)]}</span></td>
                      {active.map((c) => {
                        const l = data.logs[logKey(d, c.id)];
                        return [
                          <td key={c.id + "p"} className="w-20 py-1.5 pr-1.5"><NumIn label={`${c.brand} posted ${nice(d)}`} value={l?.posted} onSave={(v) => setLog(d, c.id, "posted", v)} className="py-1.5 text-right" /></td>,
                          <td key={c.id + "q"} className="w-20 py-1.5 pr-3"><NumIn label={`${c.brand} qualified ${nice(d)}`} value={l?.qual} onSave={(v) => setLog(d, c.id, "qual", v)} className="py-1.5 text-right" /></td>,
                        ];
                      })}
                      <td className="py-1.5 text-right tabular-nums">{ds.qual ? usd(ds.earned) : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Panel className="p-5 md:p-6">
          <SectionTitle sub="Estimated from the log">Performance history</SectionTitle>
          <table className="w-full text-[14px] tabular-nums">
            <thead><tr className="border-b-2 border-dm-ink text-[12px] text-dm-muted"><th className="py-2 text-left font-medium">Month</th><th className="py-2 text-right font-medium">Posted</th><th className="py-2 text-right font-medium">Qualified</th><th className="py-2 text-right font-medium">Hit rate</th><th className="py-2 text-right font-medium">Estimate</th></tr></thead>
            <tbody>
              {months.map((k) => {
                const x = ugcStats(data, k + "-01", k + "-31");
                return <tr key={k} className="border-b border-dm-line"><td className="py-2">{monthName(k)}</td><td className="py-2 text-right">{x.posted}</td><td className="py-2 text-right">{x.qual}</td><td className="py-2 text-right">{x.hit == null ? "—" : pct(x.hit)}</td><td className="py-2 text-right">{usd(x.earned)}</td></tr>;
              })}
            </tbody>
          </table>
        </Panel>
        <Panel className="p-5 md:p-6">
          <SectionTitle sub="Less filming, editing and posting, inside your agreements">Cut the workload</SectionTitle>
          <ul className="list-disc space-y-1.5 pl-5 text-[14px]">{LESS_WORK.map((x) => <li key={x}>{x}</li>)}</ul>
          <p className="mt-3 text-[13px] text-dm-muted">Want to know why some videos qualify and others don't? Share the videos or analytics exports in chat and Claude will compare hooks, the first 3 seconds, retention and structure, and give you tests to run.</p>
        </Panel>
      </div>
    </div>
  );
}
