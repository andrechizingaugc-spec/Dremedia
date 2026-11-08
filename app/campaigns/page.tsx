"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Plus, Search } from "lucide-react";
import { brands, calendar } from "@/lib/mock";
import { BrandTile, Button, Card, PlatformIcon, cx, money } from "@/components/ui";

const ranges = ["This month", "7d", "30d", "90d", "All"];
const tabs = ["All", "Active", "Paused", "Needs accounts"] as const;

export default function CampaignsPage() {
  const [range, setRange] = useState(ranges[0]);
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const [q, setQ] = useState("");

  const total = brands.reduce((s, b) => s + b.earned, 0);
  const videos = calendar.reduce((s, d) => s + d.videos, 0);
  const projected = 12000;
  const needs = brands.filter((b) => b.needsAccounts).length;

  const rows = useMemo(
    () =>
      brands
        .filter((b) => tab === "All" || (tab === "Needs accounts" ? b.needsAccounts : b.status === tab))
        .filter((b) => b.name.toLowerCase().includes(q.toLowerCase()))
        .sort((a, b) => b.earned - a.earned),
    [tab, q],
  );
  const count = (t: (typeof tabs)[number]) =>
    brands.filter((b) => t === "All" || (t === "Needs accounts" ? b.needsAccounts : b.status === t)).length;
  const max = Math.max(...brands.map((b) => b.earned));

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-[-0.01em]">Campaigns</h1>
        <Button variant="primary">
          <Plus size={16} /> New campaign
        </Button>
      </div>

      <div className="mb-4 inline-flex rounded-lg bg-[#EFEFF0] p-0.5">
        {ranges.map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={cx("h-7 rounded-md px-2.5 text-[13px] font-medium", r === range ? "bg-white shadow-[0_1px_2px_rgba(0,0,0,.08),0_0_0_.5px_rgba(0,0,0,.04)]" : "text-[#52525B]")}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-[1.2fr_1fr_1.1fr]">
        <Card className="p-5">
          <div className="flex items-baseline justify-between gap-2 text-[15px] font-medium">
            Earned this month <span className="whitespace-nowrap text-xs font-normal text-muted">All campaigns</span>
          </div>
          <div className="mt-2 text-[34px] font-semibold tracking-tight text-money">{money(total)}</div>
          <div className="mt-3 h-2 rounded-full bg-[#ECECEC]">
            <div className="h-2 rounded-full bg-brand" style={{ width: Math.min(100, (total / projected) * 100) + "%" }} />
          </div>
          <div className="mt-3 text-sm text-muted">
            <b className="text-ink">{money(total)}</b> this pay cycle · {Math.round((total / projected) * 100)}% of {money(projected)} projected
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-baseline justify-between gap-2 text-[15px] font-medium">
            Videos posted <span className="whitespace-nowrap text-xs font-normal text-muted">This month</span>
          </div>
          <div className="mt-2 text-[34px] font-semibold tracking-tight">{videos}</div>
          <div className="mt-8 text-sm text-muted">
            <b className="text-ink">{money(Math.round(total / videos))}</b> average per video posted
          </div>
        </Card>
        <Card className="p-5">
          <div className="text-[15px] font-medium">Earned per day</div>
          <div className="text-xs text-muted">31 days of posting</div>
          <div className="mt-1 text-[28px] font-semibold text-money">{money(Math.round(total / 31))}</div>
          <div className="mt-2 flex h-12 items-end gap-[3px]">
            {calendar.map((d) => (
              <div key={d.day} className="flex-1 rounded-sm bg-money/80" style={{ height: Math.max(3, (d.earned / 700) * 48) }} />
            ))}
          </div>
        </Card>
      </div>

      {needs > 0 && (
        <Card className="mt-4 flex items-center justify-between px-4 py-3">
          <span className="flex items-center gap-2.5 text-sm">
            <span className="h-2 w-2 rounded-full bg-[#F59E0B]" /> {needs} campaigns need accounts connected
          </span>
          <Button>
            Connect accounts <ArrowRight size={15} />
          </Button>
        </Card>
      )}

      <Card className="mt-4 overflow-hidden p-3">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-lg bg-[#EFEFF0] p-0.5">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cx("h-7 rounded-md px-2.5 text-[13px] font-medium", t === tab ? "bg-white shadow-[0_1px_2px_rgba(0,0,0,.08),0_0_0_.5px_rgba(0,0,0,.04)]" : "text-[#52525B]")}
              >
                {t} <span className="ml-1 text-xs text-muted">{count(t)}</span>
              </button>
            ))}
          </div>
          <label className="ml-auto flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm">
            <Search size={15} className="text-muted" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="search campaigns" className="w-40 outline-none" />
          </label>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="whitespace-nowrap bg-side text-left text-[13px] text-muted">
                <th className="rounded-l-lg px-3 py-2.5 font-normal">Campaign</th>
                <th className="px-3 font-normal">Pay</th>
                <th className="px-3 font-normal">Posting</th>
                <th className="px-3 font-normal">Avg / video</th>
                <th className="px-3 font-normal">Earned / month</th>
                <th className="rounded-r-lg px-3 font-normal">Share</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => (
                <tr key={b.id} className="border-b border-line last:border-0">
                  <td className="px-3 py-3.5">
                    <div className="flex items-center gap-3">
                      <BrandTile id={b.id} />
                      <div>
                        <div className="font-semibold">{b.name}</div>
                        <div className="mt-0.5 flex flex-wrap items-center gap-2 whitespace-nowrap text-xs">
                          <span className={b.status === "Active" ? "text-money" : "text-muted"}>● {b.status}</span>
                          {b.platforms.map((p) => (
                            <PlatformIcon key={p} p={p} size={13} />
                          ))}
                          {b.needsAccounts && (
                            <span className="rounded-full border border-line px-2 py-0.5 text-[11px]">
                              <span className="text-[#F59E0B]">●</span> Connect accounts
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3">{b.pay}</td>
                  <td className="whitespace-nowrap px-3 text-muted">{b.perDay ? `${b.perDay} / day` : "paused"}</td>
                  <td className="px-3">{money(b.avg)}</td>
                  <td className="px-3 font-semibold text-money">{money(b.earned)}</td>
                  <td className="px-3">
                    <div className="h-1.5 w-24 rounded-full bg-[#ECECEC]">
                      <div className="h-1.5 rounded-full bg-brand" style={{ width: (b.earned / max) * 100 + "%" }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
