"use client";

import { useState } from "react";
import { cx } from "@/components/ui";
import { Panel, SectionTitle, Tag } from "@/components/ugc/ui";
import { Bar, CeoHead, CeoNav, Del, Loading } from "@/components/ugc/ceo";
import { DIVISIONS, DIV_STATUSES, nice, num, pct, uid, usd, useCeo, useToday, type Idea, type Interview } from "@/lib/ceo";

const CHECKS: Record<string, string[]> = {
  social: ["2 Creative clients have asked for ongoing posting or management", "A retainer price with a 50%+ margin worked out", "A freelancer who can deliver it, tested", "A monthly report template written"],
  studios: ["A niche with real demand and original angles (no repetitive or reused content)", "Cost per video and time to first income worked out", "A publishing system: research, script, voice, edit, thumbnail, all freelance", "A monetisation model checked against the platform's current rules"],
  commerce: ["Customer demand proven with a test (pre-orders, ad clicks, waitlist)", "Contribution margin of 30%+ after product, shipping, fees and ads", "Supplier quality and delivery times checked", "Returns and support process written"],
};

export default function CeoDivisions() {
  const [data, update, ready] = useCeo();
  const today = useToday();
  const [p, setP] = useState({ price: 0, product: 0, ship: 0, fees: 0, ads: 0 });
  if (!ready || !today) return <Loading />;

  const cm = p.price - p.product - p.ship - p.fees - p.ads;
  const yes = data.interviews.filter((i) => i.pay === "yes").length;
  const check = (id: string, v: boolean) => update((d) => ({ ...d, checks: { ...d.checks, [id]: v } }));
  const editIdea = (id: string, x: Partial<Idea>) => update((d) => ({ ...d, ideas: d.ideas.map((i) => (i.id === id ? { ...i, ...x } : i)) }));

  return (
    <div>
      <CeoNav />
      <CeoHead today={today} title="The Dre Media ecosystem" sub="Five divisions that feed each other. Each one launches only when the one before pays for it and its own checks are met." />

      <ol className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {DIVISIONS.map((d, i) => {
          const status = data.divisions[d.key] || d.status;
          const list = CHECKS[d.key];
          const met = list ? list.filter((_, j) => data.checks[`${d.key}-${j}`]).length : 0;
          return (
            <li key={d.key} className={cx("dm-panel p-5", status === "Active" && "border-dm-ink ring-1 ring-dm-ink")}>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[34px] font-semibold leading-none">{i + 1}</span>
                <select value={status} onChange={(e) => update((x) => ({ ...x, divisions: { ...x.divisions, [d.key]: e.target.value } }))} className="dm-field w-auto py-1.5 text-[13px]" aria-label={`Status of ${d.name}`}>
                  {DIV_STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <h2 className="mt-2 text-[18px] font-semibold">{d.name}</h2>
              <p className="mt-1 text-[14px] text-dm-muted">{d.role}</p>
              <p className="mt-2 text-[14px]">{d.rule}</p>
              {list && (
                <div className="mt-3">
                  <div className="dm-label">Ready to launch when · {met}/{list.length}</div>
                  <ul>
                    {list.map((c, j) => {
                      const id = `${d.key}-${j}`;
                      return (
                        <li key={id}>
                          <label className="flex min-h-[40px] cursor-pointer items-start gap-2.5 py-1 text-[13px]">
                            <input type="checkbox" checked={!!data.checks[id]} onChange={(e) => check(id, e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[rgb(var(--dm-ink))]" />
                            <span className={cx(data.checks[id] && "text-dm-muted line-through")}>{c}</span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <Panel className="p-5 md:p-6">
          <SectionTitle sub="Find the most valuable problem first. No code before 20 interviews and 5 people saying they'd pay.">Dre Connect: validation</SectionTitle>
          <div className="grid gap-2.5">
            <Bar label="Interviews" value={data.interviews.length} target={20} show={`${data.interviews.length} / 20`} />
            <Bar label="Would pay" value={yes} target={5} show={`${yes} / 5`} />
          </div>
          <form
            className="mt-4 grid gap-2.5 sm:grid-cols-[1fr_auto_auto] sm:items-end"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              update((d) => ({ ...d, interviews: [{ id: uid(), date: today, who: String(f.get("who")).trim(), side: f.get("side") === "brand" ? "brand" : "creator", problem: String(f.get("problem") || ""), pay: (String(f.get("pay")) as Interview["pay"]) || "maybe", note: "" }, ...d.interviews] }));
              e.currentTarget.reset();
            }}
          >
            <div><label className="dm-label" htmlFor="iw">Who</label><input id="iw" name="who" required className="dm-field" placeholder="Name or handle" /></div>
            <div><label className="dm-label" htmlFor="is">Side</label><select id="is" name="side" className="dm-field"><option value="creator">Creator</option><option value="brand">Brand</option></select></div>
            <div><label className="dm-label" htmlFor="ip">Would pay?</label><select id="ip" name="pay" className="dm-field"><option value="maybe">Maybe</option><option value="yes">Yes</option><option value="no">No</option></select></div>
            <div className="sm:col-span-3"><label className="dm-label" htmlFor="ipr">Their biggest problem, in their words</label><input id="ipr" name="problem" className="dm-field" /></div>
            <button className="dm-btn-primary h-[42px] sm:col-span-3 sm:justify-self-start">Log interview</button>
          </form>
          <ul className="mt-3 divide-y divide-dm-line">
            {data.interviews.map((i) => (
              <li key={i.id} className="flex items-start gap-3 py-2 text-[14px]">
                <span className="min-w-0 flex-1"><b>{i.who}</b> <span className="text-dm-muted">· {i.side} · {nice(i.date)}</span><br />{i.problem || <span className="text-dm-muted">No problem written</span>}</span>
                <Tag strong={i.pay === "yes"}>{i.pay}</Tag>
                <Del label={`Delete interview with ${i.who}`} onClick={() => update((d) => ({ ...d, interviews: d.interviews.filter((x) => x.id !== i.id) }))} />
              </li>
            ))}
          </ul>

          <h3 className="mt-5 text-[15px] font-semibold">Feature ideas, by priority</h3>
          <form
            className="mt-2 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const t = String(new FormData(e.currentTarget).get("idea") || "").trim();
              if (t) update((d) => ({ ...d, ideas: [...d.ideas, { id: uid(), title: t, priority: 2, status: "idea" }] }));
              e.currentTarget.reset();
            }}
          >
            <input name="idea" className="dm-field" placeholder="e.g. campaign finder for creators" aria-label="Feature idea" />
            <button className="dm-btn-ghost h-[42px]">Add</button>
          </form>
          <ul className="mt-2 divide-y divide-dm-line">
            {data.ideas.slice().sort((a, b) => a.priority - b.priority).map((i) => (
              <li key={i.id} className="flex items-center gap-2 py-1.5 text-[14px]">
                <select value={i.priority} onChange={(e) => editIdea(i.id, { priority: Number(e.target.value) })} className="dm-field w-auto py-1.5 text-[13px]" aria-label="Priority"><option value={1}>P1</option><option value={2}>P2</option><option value={3}>P3</option></select>
                <span className={cx("min-w-0 flex-1", i.status === "dropped" && "text-dm-muted line-through")}>{i.title}</span>
                <select value={i.status} onChange={(e) => editIdea(i.id, { status: e.target.value as Idea["status"] })} className="dm-field w-auto py-1.5 text-[13px]" aria-label="Status">{["idea", "validating", "mvp", "dropped"].map((s) => <option key={s}>{s}</option>)}</select>
                <Del label="Delete idea" onClick={() => update((d) => ({ ...d, ideas: d.ideas.filter((x) => x.id !== i.id) }))} />
              </li>
            ))}
          </ul>
        </Panel>

        <Panel className="p-5 md:p-6">
          <SectionTitle sub="Per order, before you launch any product">Commerce: contribution margin check</SectionTitle>
          <div className="grid grid-cols-2 gap-2.5">
            {([["price", "Selling price $"], ["product", "Product cost $"], ["ship", "Shipping $"], ["fees", "Payment + platform fees $"], ["ads", "Ad cost per order $"]] as const).map(([k, l]) => (
              <label key={k}><span className="dm-label">{l}</span><input type="number" min="0" step="0.01" value={p[k] || ""} onChange={(e) => setP({ ...p, [k]: num(e.target.value) })} className="dm-field" /></label>
            ))}
          </div>
          <div className="mt-4 flex gap-6">
            <div><div className="text-[12px] text-dm-muted">Per order</div><div className={cx("text-[32px] font-semibold tabular-nums", cm < 0 && "text-dm-bad")}>{usd(cm)}</div></div>
            <div><div className="text-[12px] text-dm-muted">Margin</div><div className={cx("text-[32px] font-semibold tabular-nums", p.price && cm / p.price < 0.3 ? "text-dm-bad" : "")}>{p.price ? pct(cm / p.price) : "—"}</div></div>
          </div>
          <p className="mt-2 text-[13px] text-dm-muted">Under 30% after ads, the product doesn't launch, however popular it looks.</p>
        </Panel>
      </div>
    </div>
  );
}
