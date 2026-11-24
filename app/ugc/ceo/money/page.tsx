"use client";

import { useRef, useState } from "react";
import { Download, Upload } from "lucide-react";
import { cx } from "@/components/ui";
import { Panel, SectionTitle } from "@/components/ugc/ui";
import { Bar, CeoHead, CeoNav, Del, Loading, NumIn } from "@/components/ugc/ceo";
import { CEO_KEY, DIVS, METHODS, monthName, monthStats, nice, num, pct, restore, targetUsd, uid, unpaid, usd, useCeo, useToday, zar, type Settings } from "@/lib/ceo";

const SETTINGS: [keyof Settings, string, string?][] = [
  ["target", "Monthly revenue target"],
  ["fx", "Rand per $1", "0.01"],
  ["tax", "Tax set-aside (0.3 = 30%)", "0.01"],
  ["costs", "Essential monthly living costs ($)"],
  ["emergency", "Emergency savings so far ($)"],
  ["cash", "Business cash available ($)"],
  ["baseline", "Earned before this dashboard ($)"],
  ["wealthZar", "Personal net worth: cash + investments − debts (R)"],
  ["equityZar", "Your estimate of Dre Media's value (R)"],
  ["millionZar", "Your millionaire threshold (R)"],
  ["emailsPerDay", "Personalised emails per day"],
];

export default function CeoMoney() {
  const [data, update, ready] = useCeo();
  const today = useToday();
  const [msg, setMsg] = useState("");
  const [kind, setKind] = useState<"earned" | "expense">("earned");
  const file = useRef<HTMLInputElement>(null);
  if (!ready || !today) return <Loading />;

  const s = data.settings, fx = num(s.fx) || 16.5, m = today.slice(0, 7);
  const cur = monthStats(data, m);
  const u = unpaid(data, today);
  const lifetime = num(s.baseline) + data.money.filter((x) => x.kind === "earned").reduce((t, x) => t + num(x.amount), 0);
  const million = num(s.millionZar) || 1e6;
  const safety = num(s.costs) * 3;
  const gp = Math.max(0, cur.gross - cur.opex - cur.tax);
  const months = Array.from(new Set(data.money.flatMap((x) => [x.date.slice(0, 7), (x.receivedOn || "").slice(0, 7)]).filter(Boolean).concat(m))).sort().reverse();
  const entries = data.money.slice().sort((a, b) => (a.date < b.date ? 1 : -1));
  const setS = (k: keyof Settings, v: number | null) => update((d) => ({ ...d, settings: { ...d.settings, [k]: v ?? 0 } }));
  const received = (id: string, on: string) => update((d) => ({ ...d, money: d.money.map((x) => (x.id === id ? { ...x, receivedOn: on } : x)) }));

  const backup = () => {
    const blob = new Blob([localStorage.getItem(CEO_KEY) || JSON.stringify(data)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `dremedia-ceo-backup-${today}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div>
      <CeoNav />
      <CeoHead today={today} title="Money" sub="Earned is what a platform or client approved. Received is what reached your bank, PayPal or Wise. Profit is what's left. This page never mixes them." />

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel className="p-5 md:p-6">
          <SectionTitle sub={`Wealth is measured in rand. At R${fx} per $1.`}>Your {zar(million)} goal, three ways</SectionTitle>
          <div className="grid gap-3">
            <Bar label="Earned (all time)" value={lifetime * fx} target={million} show={zar(lifetime * fx)} />
            <Bar label="Net worth" value={num(s.wealthZar)} target={million} show={zar(num(s.wealthZar))} />
            <Bar label="Business value" value={num(s.equityZar)} target={million} show={zar(num(s.equityZar))} />
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-dm-muted">Earned is revenue, not wealth. Net worth is what you own minus what you owe. Business value is an estimate until a buyer or valuer puts a number on it, and it only grows once the business runs without you. Set all three in Settings.</p>

          <h3 className="mt-5 text-[15px] font-semibold">Protect the founder first</h3>
          <div className="mt-2 grid gap-2.5">
            <Bar label="Emergency fund" value={num(s.emergency)} target={safety || 1} show={safety ? `${usd(num(s.emergency))} / ${usd(safety)}` : "Set costs"} warn={!!safety && num(s.emergency) < safety} />
          </div>
          <p className="mt-2 text-[13px] text-dm-muted">Target: 3 months of essential costs saved before any business spending beyond the starter budget.</p>
          <h3 className="mt-4 text-[15px] font-semibold">This month's profit after tax: {usd(gp)}</h3>
          <div className="mt-2 grid gap-2.5">
            <Bar label="Reserve 30%" value={30} target={100} show={usd(gp * 0.3)} />
            <Bar label="Reinvest 30%" value={30} target={100} show={usd(gp * 0.3)} />
            <Bar label="Pay yourself" value={40} target={100} show={usd(gp * 0.4)} />
          </div>
          <p className="mt-2 text-[13px] text-dm-muted">Tax set-aside this month: {usd(cur.tax)}. Your accountant confirms the real rate and obligations.</p>
        </Panel>

        <Panel className="p-5 md:p-6">
          <SectionTitle sub="Reconcile first: one entry per payout since July, with both dates.">Log money</SectionTitle>
          <div role="radiogroup" aria-label="Type" className="mb-3 flex gap-1 rounded-full border border-dm-line bg-dm-surface p-1">
            {(["earned", "expense"] as const).map((k) => (
              <button key={k} role="radio" aria-checked={kind === k} onClick={() => setKind(k)} className={cx("flex-1 rounded-full px-3 py-1.5 text-[13px]", kind === k ? "bg-dm-accent font-medium text-dm-accent-fg" : "text-dm-muted")}>{k === "earned" ? "Money earned" : "Expense"}</button>
            ))}
          </div>
          <form
            key={kind}
            className="grid gap-2.5 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const amount = num(f.get("amount"));
              update((d) => ({ ...d, money: [...d.money, { id: uid(), kind, date: String(f.get("date")), div: String(f.get("div")), source: String(f.get("source") || ""), amount, method: String(f.get("method") || ""), receivedOn: kind === "expense" ? String(f.get("date")) : String(f.get("receivedOn") || ""), cost: f.get("cost") === "direct" ? "direct" : "operating", note: String(f.get("note") || "") }] }));
              setMsg(`Logged ${usd(amount)}.`);
              e.currentTarget.reset();
            }}
          >
            <div><label className="dm-label" htmlFor="md">{kind === "earned" ? "Date earned or approved" : "Date paid"}</label><input id="md" name="date" type="date" defaultValue={today} required className="dm-field" /></div>
            {kind === "earned" ? (
              <div><label className="dm-label" htmlFor="mr">Date received (blank if not yet)</label><input id="mr" name="receivedOn" type="date" className="dm-field" /></div>
            ) : (
              <div><label className="dm-label" htmlFor="mc">Cost type</label><select id="mc" name="cost" className="dm-field"><option value="direct">Direct: creators, editors for a client</option><option value="operating">Operating: tools, data, admin</option></select></div>
            )}
            <div><label className="dm-label" htmlFor="ma">Amount ($)</label><input id="ma" name="amount" type="number" step="0.01" min="0" required className="dm-field" /></div>
            <div><label className="dm-label" htmlFor="mv">Division</label><select id="mv" name="div" className="dm-field">{DIVS.map((d) => <option key={d}>{d}</option>)}</select></div>
            <div><label className="dm-label" htmlFor="ms">{kind === "earned" ? "Source: platform, client" : "Paid to"}</label><input id="ms" name="source" className="dm-field" /></div>
            <div><label className="dm-label" htmlFor="mm">Method</label><select id="mm" name="method" className="dm-field">{METHODS.map((x) => <option key={x}>{x}</option>)}</select></div>
            <div className="sm:col-span-2"><label className="dm-label" htmlFor="mn">Note</label><input id="mn" name="note" className="dm-field" /></div>
            <button className="dm-btn-primary h-[42px]">Add</button>
          </form>
          {msg && <p className="mt-2 text-[13px] text-dm-muted" role="status">{msg}</p>}
        </Panel>
      </div>

      {u.count > 0 && (
        <Panel className="mt-5 p-5 md:p-6">
          <SectionTitle sub="Money you've earned that hasn't reached your account. Mark it when it lands.">Earned, not yet received · {usd(u.total)}</SectionTitle>
          <ul className="divide-y divide-dm-line">
            {data.money.filter((x) => x.kind === "earned" && !x.receivedOn).map((x) => (
              <li key={x.id} className="flex flex-wrap items-center gap-3 py-2 text-[14px]">
                <span className={cx("w-16", x.date < today.slice(0, 8) + "01" && "font-semibold text-dm-bad")}>{nice(x.date)}</span>
                <span className="min-w-0 flex-1">{x.source || x.div} <span className="text-dm-muted">· {x.method}</span></span>
                <span className="tabular-nums">{usd(x.amount)}</span>
                <button className="dm-btn-ghost h-9 px-3 text-[13px]" onClick={() => received(x.id, today)}>Received today</button>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <Panel className="mt-5 p-5 md:p-6">
        <SectionTitle sub={`Target ${s.targetCur === "ZAR" ? `R${num(s.target).toLocaleString("en-US")} (${usd(targetUsd(s))})` : usd(targetUsd(s))} a month`}>By month</SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-[14px] tabular-nums">
            <thead><tr className="border-b-2 border-dm-ink text-[12px] text-dm-muted"><th className="py-2 text-left font-medium">Month</th>{["Earned", "Received", "Direct costs", "Gross profit", "Operating", "Tax set-aside", "Net profit", "vs target"].map((h) => <th key={h} className="py-2 text-right font-medium">{h}</th>)}</tr></thead>
            <tbody>
              {months.map((k) => {
                const x = monthStats(data, k);
                const t = targetUsd(s) || 1;
                return (
                  <tr key={k} className="border-b border-dm-line">
                    <td className="py-2">{monthName(k)}</td>
                    <td className="py-2 text-right">{usd(x.rev)}</td><td className="py-2 text-right">{usd(x.received)}</td><td className="py-2 text-right">{usd(x.direct)}</td><td className="py-2 text-right">{usd(x.gross)}</td><td className="py-2 text-right">{usd(x.opex)}</td><td className="py-2 text-right">{usd(x.tax)}</td>
                    <td className={cx("py-2 text-right", x.net < 0 && "text-dm-bad")}>{usd(x.net)}</td>
                    <td className={cx("py-2 text-right", x.rev >= t && "font-semibold text-dm-good")}>{pct(x.rev / t)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <h3 className="mt-6 text-[15px] font-semibold">All entries</h3>
        <ul className="mt-1 divide-y divide-dm-line">
          {entries.length ? entries.map((x) => (
            <li key={x.id} className="grid grid-cols-[4.5em_minmax(0,1fr)_auto_auto] items-center gap-2 py-2 text-[14px]">
              <span className="text-dm-muted">{nice(x.date)}</span>
              <span className="min-w-0 truncate">{x.source || x.div} <span className="text-dm-muted">· {x.div} · {x.method}{x.kind === "earned" ? (x.receivedOn ? ` · received ${nice(x.receivedOn)}` : " · not received") : ` · ${x.cost}`}{x.note ? " · " + x.note : ""}</span></span>
              <span className={cx("whitespace-nowrap text-right tabular-nums", x.kind === "expense" && "text-dm-muted")}>{x.kind === "expense" ? "−" : ""}{usd(num(x.amount))}</span>
              <Del label="Delete entry" onClick={() => update((d) => ({ ...d, money: d.money.filter((y) => y.id !== x.id) }))} />
            </li>
          )) : <li className="py-4 text-[14px] text-dm-muted">No entries yet. Start with the payouts you can see on each platform and in your bank, PayPal and Wise.</li>}
        </ul>
      </Panel>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <Panel className="p-5 md:p-6">
          <SectionTitle sub="Private to this browser. Nothing here is in the site's public code.">Settings</SectionTitle>
          <div className="grid gap-2.5 sm:grid-cols-2">
            <div>
              <span className="dm-label">Target currency</span>
              <select value={s.targetCur} onChange={(e) => update((d) => ({ ...d, settings: { ...d.settings, targetCur: e.target.value === "ZAR" ? "ZAR" : "USD" } }))} className="dm-field" aria-label="Target currency"><option value="USD">US dollars</option><option value="ZAR">South African rand</option></select>
            </div>
            {SETTINGS.map(([k, label, step]) => (
              <div key={k}><span className="dm-label">{label}{k === "target" ? ` (${s.targetCur})` : ""}</span><NumIn label={label} step={step || "1"} value={s[k] as number} onSave={(v) => setS(k, v)} /></div>
            ))}
          </div>
        </Panel>
        <Panel className="p-5 md:p-6">
          <SectionTitle sub="Your data lives in this browser. Download a backup weekly, and restore it on another device to carry it over.">Backup</SectionTitle>
          <div className="flex flex-wrap gap-2">
            <button onClick={backup} className="dm-btn-primary"><Download size={15} /> Download backup</button>
            <button onClick={() => file.current?.click()} className="dm-btn-ghost"><Upload size={15} /> Restore a backup</button>
            <input
              ref={file}
              type="file"
              accept="application/json,.json"
              hidden
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                setMsg(restore(await f.text()) ? "Backup restored." : "That file isn't a command-centre backup.");
                e.target.value = "";
              }}
            />
          </div>
          {msg && <p className="mt-2 text-[13px] text-dm-muted" role="status">{msg}</p>}
        </Panel>
      </div>
    </div>
  );
}
