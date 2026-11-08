"use client";

import { useState } from "react";
import { ArrowUpRight, ChevronDown, ChevronRight, RefreshCw, Search, UserCog } from "lucide-react";
import { accounts, brands, type Platform } from "@/lib/mock";
import { BrandTile, Button, Card, NotHooked, PlatformIcon, cx } from "@/components/ui";

const filters: ("all" | Platform)[] = ["all", "facebook", "instagram", "youtube", "tiktok"];

export default function AccountsPage() {
  const [pick, setPick] = useState(accounts[0].id);
  const [plat, setPlat] = useState<(typeof filters)[number]>("all");
  const [openBrands, setOpenBrands] = useState<string[]>([accounts[0].brand]);
  const [q, setQ] = useState("");
  const [refreshed, setRefreshed] = useState(false);
  const a = accounts.find((x) => x.id === pick)!;
  const connected = accounts.filter((x) => x.scheduler).length;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-baseline gap-3">
          <h1 className="text-2xl font-semibold tracking-[-0.01em]">Accounts</h1>
          <span className="text-sm text-muted">
            {accounts.length} accounts · <span className="text-[#2E7D46]">{connected} connected to the scheduler</span>
          </span>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setRefreshed(true)}>
            <RefreshCw size={15} /> refresh all accounts
          </Button>
          <Button>
            <UserCog size={15} /> manage account
          </Button>
        </div>
      </div>
      {refreshed && (
        <div className="mb-4">
          <NotHooked what="refreshing pulls followers, views and every tracked post from each platform. that needs a scraper or each platform's api on a schedule." />
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-[270px_1fr]">
        <Card className="h-fit p-3">
          <div className="mb-2 px-1 font-semibold">Brand deals</div>
          <label className="mb-2 flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm">
            <Search size={15} className="text-muted" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="search accounts" className="w-full outline-none" />
          </label>
          <div className="mb-2 flex gap-1 rounded-lg bg-side p-1">
            {filters.map((f) => (
              <button key={f} onClick={() => setPlat(f)} className={cx("flex flex-1 items-center justify-center rounded-lg py-1 text-sm", plat === f && "bg-white shadow-sm")}>
                {f === "all" ? "all" : <PlatformIcon p={f} />}
              </button>
            ))}
          </div>
          {brands.map((b) => {
            const mine = accounts.filter((x) => x.brand === b.id && (plat === "all" || x.platform === plat) && x.handle.includes(q.toLowerCase()));
            if (!mine.length) return null;
            const isOpen = openBrands.includes(b.id);
            return (
              <div key={b.id}>
                <button
                  onClick={() => setOpenBrands((o) => (isOpen ? o.filter((x) => x !== b.id) : [...o, b.id]))}
                  className="flex w-full items-center gap-2.5 rounded-lg px-1.5 py-2 text-sm"
                >
                  <BrandTile id={b.id} size={22} />
                  <span className="flex-1 text-left">{b.name}</span>
                  <span className="text-muted">{mine.length}</span>
                  {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                </button>
                {isOpen &&
                  mine.map((x) => (
                    <button
                      key={x.id}
                      onClick={() => setPick(x.id)}
                      className={cx("ml-3 flex w-[calc(100%-12px)] items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-sm", pick === x.id && "bg-side")}
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-side text-xs">{x.handle[1].toUpperCase()}</span>
                      <span>
                        {x.handle}
                        <span className="flex items-center gap-1 text-xs text-muted">
                          <PlatformIcon p={x.platform} size={12} /> {x.platform}
                        </span>
                      </span>
                    </button>
                  ))}
              </div>
            );
          })}
        </Card>

        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex flex-wrap items-start gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-side text-lg">{a.handle[1].toUpperCase()}</span>
              <div className="flex-1">
                <div className="text-xl font-semibold">{a.handle}</div>
                <div className="mt-0.5 flex items-center gap-3 text-sm">
                  <span className="flex items-center gap-1">
                    <PlatformIcon p={a.platform} size={14} /> {a.platform}
                  </span>
                  <span className="flex items-center gap-1">
                    <BrandTile id={a.brand} size={16} /> {brands.find((b) => b.id === a.brand)?.name}
                  </span>
                </div>
                <div className="mt-2 text-sm">
                  <b>{a.followers}</b> <span className="text-muted">Followers</span>
                </div>
              </div>
              <Button>
                view profile <ArrowUpRight size={14} />
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              <span className="rounded-lg border border-line px-2.5 py-1">
                Post tracking <span className="text-money">● on</span>
              </span>
              <span className="rounded-lg border border-line px-2.5 py-1">
                Scheduler {a.scheduler ? <span className="text-money">● connected</span> : <span className="text-muted">● not connected</span>}
              </span>
            </div>
          </Card>
          <Card className="p-4">
            <div className="mb-3 font-semibold">Post performance</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                [a.views, "Views"],
                [a.likes, "Likes"],
                [a.comments, "Comments"],
                [a.engagement, "Engagement"],
              ].map(([v, l]) => (
                <div key={l} className="rounded-xl border border-line p-3">
                  <div className="text-xl font-semibold">{v}</div>
                  <div className="text-sm text-muted">{l}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
