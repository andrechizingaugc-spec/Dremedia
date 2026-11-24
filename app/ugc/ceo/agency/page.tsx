"use client";

import { useState } from "react";
import { cx } from "@/components/ui";
import { Panel, Seg, SectionTitle, Stat } from "@/components/ugc/ui";
import { CeoHead, CeoNav, Del, Loading, NumIn, TextIn } from "@/components/ugc/ceo";
import { OFFERS, SOP, margin, num, pct, uid, usd, useCeo, useToday, type Client } from "@/lib/ceo";

export default function CeoAgency() {
  const [data, update, ready] = useCeo();
  const today = useToday();
  const [div, setDiv] = useState<"all" | "Creative" | "Social">("all");
  // the quick pricing check
  const [fee, setFee] = useState(1500), [vids, setVids] = useState(10), [rate, setRate] = useState(55), [edit$, setEdit] = useState(4);
  if (!ready || !today) return <Loading />;

  const active = data.clients.filter((c) => c.status === "active");
  const fees = active.reduce((t, c) => t + num(c.fee), 0);
  const contrib = active.reduce((t, c) => t + margin(c).contribution, 0);
  const recurring = active.filter((c) => c.recurring).reduce((t, c) => t + num(c.fee), 0);
  const shown = data.clients.filter((c) => div === "all" || c.division === div);
  const edit = (id: string, p: Partial<Client>) => update((d) => ({ ...d, clients: d.clients.map((c) => (c.id === id ? { ...c, ...p } : c)) }));
  const calc = { contribution: fee - (vids * rate + vids * edit$) };

  return (
    <div>
      <CeoNav />
      <CeoHead today={today} title="Agency clients" sub="Dre Media Creative (UGC campaigns) and Dre Media Social (retainers). Every client is tracked for delivery and for what it really earns." />

      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
        <Stat label="Active clients" value={active.length} sub="Target 3 by day 90" />
        <Stat label="Fees this cycle" value={usd(fees)} />
        <Stat label="Contribution margin" value={fees ? pct(contrib / fees) : "—"} sub={`${usd(contrib)} after creators and editing · target 50%+`} />
        <Stat label="Recurring" value={usd(recurring)} sub="From retainers" />
      </div>

      <Panel className="mt-5 p-5 md:p-6">
        <SectionTitle right={<Seg label="Division" value={div} onChange={setDiv} options={[{ value: "all", label: "All" }, { value: "Creative", label: "Creative" }, { value: "Social", label: "Social" }]} />}>Clients</SectionTitle>
        <form
          className="grid gap-2.5 sm:grid-cols-[1.3fr_1fr_1fr_0.8fr_auto] sm:items-end"
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            const division = f.get("division") === "Social" ? "Social" : "Creative";
            const offer = String(f.get("offer"));
            update((d) => ({ ...d, clients: [...d.clients, { id: uid(), name: String(f.get("name")).trim(), division, offer, fee: num(f.get("fee")), recurring: division === "Social" || offer.startsWith("B"), due: offer.startsWith("A") ? 10 : 20, delivered: 0, qc: 0, creatorCost: 0, editCost: 0, deadline: "", status: "active", rights: false, results: "" }] }));
            e.currentTarget.reset();
          }}
        >
          <div><label className="dm-label" htmlFor="cn">Client</label><input id="cn" name="name" required className="dm-field" /></div>
          <div><label className="dm-label" htmlFor="cv">Division</label><select id="cv" name="division" className="dm-field"><option>Creative</option><option>Social</option></select></div>
          <div><label className="dm-label" htmlFor="co">Offer</label><select id="co" name="offer" className="dm-field"><option>A · UGC Ad Pack</option><option>B · Managed campaign</option><option>Social retainer</option><option>Custom</option></select></div>
          <div><label className="dm-label" htmlFor="cf">Fee $</label><input id="cf" name="fee" type="number" min="0" defaultValue={1500} className="dm-field" /></div>
          <button className="dm-btn-primary h-[42px]">Add client</button>
        </form>

        <ul className="mt-4 grid gap-3">
          {shown.length ? shown.map((c) => {
            const mg = margin(c);
            return (
              <li key={c.id} className={cx("rounded-xl border p-3.5", c.status === "active" && !c.rights ? "border-dm-bad" : "border-dm-line")}>
                <div className="flex flex-wrap items-center gap-2">
                  <b className="text-[16px]">{c.name}</b>
                  <span className="text-[13px] text-dm-muted">{c.division} · {c.offer}{c.recurring ? " · recurring" : ""}</span>
                  <span className={cx("text-[13px] font-semibold", mg.pct != null && mg.pct < 0.5 ? "text-dm-bad" : "text-dm-good")}>{usd(mg.contribution)} contribution · {mg.pct == null ? "—" : pct(mg.pct)}</span>
                  <span className="ml-auto flex items-center gap-1">
                    <select value={c.status} onChange={(e) => edit(c.id, { status: e.target.value as Client["status"] })} className="dm-field w-auto py-1.5 text-[13px]" aria-label="Status"><option>active</option><option>done</option></select>
                    <Del label={`Delete ${c.name}`} onClick={() => update((d) => ({ ...d, clients: d.clients.filter((x) => x.id !== c.id) }))} />
                  </span>
                </div>
                <label className="mt-2 flex min-h-[40px] cursor-pointer items-center gap-2 text-[14px]">
                  <input type="checkbox" checked={c.rights} onChange={(e) => edit(c.id, { rights: e.target.checked })} className="h-5 w-5 accent-[rgb(var(--dm-ink))]" />
                  <span className={cx(!c.rights && c.status === "active" && "font-semibold text-dm-bad")}>Brand agreed the creator arrangement, usage rights, deliverables, payment terms and disclosures</span>
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-8">
                  <div><span className="dm-label">Fee $</span><NumIn label="Fee" value={c.fee} onSave={(v) => edit(c.id, { fee: v ?? 0 })} /></div>
                  <div><span className="dm-label">Creator cost $</span><NumIn label="Creator cost" value={c.creatorCost} onSave={(v) => edit(c.id, { creatorCost: v ?? 0 })} /></div>
                  <div><span className="dm-label">Editing $</span><NumIn label="Editing cost" value={c.editCost} onSave={(v) => edit(c.id, { editCost: v ?? 0 })} /></div>
                  <div><span className="dm-label">Deliverables</span><NumIn label="Deliverables due" value={c.due} onSave={(v) => edit(c.id, { due: v ?? 0 })} /></div>
                  <div><span className="dm-label">Delivered</span><NumIn label="Delivered" value={c.delivered} onSave={(v) => edit(c.id, { delivered: v ?? 0 })} /></div>
                  <div><span className="dm-label">QC passed</span><NumIn label="QC passed" value={c.qc} onSave={(v) => edit(c.id, { qc: v ?? 0 })} /></div>
                  <div className="col-span-2"><span className="dm-label">Deadline</span><TextIn type="date" label="Deadline" value={c.deadline} onSave={(v) => edit(c.id, { deadline: v })} className={cx(c.deadline && c.deadline < today && c.status === "active" && "border-dm-bad text-dm-bad")} /></div>
                </div>
                <div className="mt-2.5 grid gap-2.5 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-end">
                  <label className="flex min-h-[42px] items-center gap-2 text-[14px]"><input type="checkbox" checked={c.recurring} onChange={(e) => edit(c.id, { recurring: e.target.checked })} className="h-5 w-5 accent-[rgb(var(--dm-ink))]" />Recurring retainer</label>
                  <div><span className="dm-label">Results and client feedback</span><TextIn label="Results" value={c.results} placeholder="Views, installs, best hook, what the client said" onSave={(v) => edit(c.id, { results: v })} /></div>
                </div>
              </li>
            );
          }) : <li className="py-4 text-[14px] text-dm-muted">No clients yet. The first managed campaign delivered and paid is the Phase 2 gate.</li>}
        </ul>
      </Panel>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Panel className="p-5 md:p-6">
          <SectionTitle sub="Check every quote before you send it">Pricing and profitability check</SectionTitle>
          <div className="grid grid-cols-2 gap-2.5">
            <label><span className="dm-label">Client fee $</span><input type="number" min="0" value={fee} onChange={(e) => setFee(num(e.target.value))} className="dm-field" /></label>
            <label><span className="dm-label">Videos</span><input type="number" min="0" value={vids} onChange={(e) => setVids(num(e.target.value))} className="dm-field" /></label>
            <label><span className="dm-label">Creator $ per video</span><input type="number" min="0" value={rate} onChange={(e) => setRate(num(e.target.value))} className="dm-field" /></label>
            <label><span className="dm-label">Editing $ per video</span><input type="number" min="0" value={edit$} onChange={(e) => setEdit(num(e.target.value))} className="dm-field" /></label>
          </div>
          <div className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-1">
            <div><div className="text-[12px] text-dm-muted">Contribution</div><div className="text-[32px] font-semibold tabular-nums">{usd(calc.contribution)}</div></div>
            <div><div className="text-[12px] text-dm-muted">Margin</div><div className={cx("text-[32px] font-semibold tabular-nums", fee && calc.contribution / fee < 0.5 ? "text-dm-bad" : "")}>{fee ? pct(calc.contribution / fee) : "—"}</div></div>
            <div><div className="text-[12px] text-dm-muted">Price per video</div><div className="text-[32px] font-semibold tabular-nums">{vids ? usd(fee / vids) : "—"}</div></div>
          </div>
          <p className="mt-2 text-[13px] text-dm-muted">Under 50%: raise the price, cut scope, or lower creator cost without lowering quality. Your QC and client time (6–8 hours a month per client) isn't in this number yet.</p>
          <div className="mt-4 grid gap-2 text-[14px]">{OFFERS.map((o) => <div key={o.name} className="rounded-xl bg-dm-surface2 p-3"><b>{o.name}.</b> {o.text}</div>)}</div>
        </Panel>
        <Panel className="p-5 md:p-6">
          <SectionTitle sub="Every client, every time, in this order">Campaign workflow and QC</SectionTitle>
          <ol className="space-y-2.5">
            {SOP.map(([k, v], i) => (
              <li key={k} className="flex gap-3 text-[14px]"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-dm-ink text-[12px] font-semibold text-dm-bg">{i + 1}</span><span><b>{k}.</b> {v}</span></li>
            ))}
          </ol>
        </Panel>
      </div>
    </div>
  );
}
