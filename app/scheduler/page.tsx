"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Globe, Pause, Plus, SlidersHorizontal } from "lucide-react";
import { brands, posts, weekDays, type Post } from "@/lib/mock";
import { BrandTile, Button, Card, NotHooked, cx } from "@/components/ui";

const tabs = ["Calendar", "Queue", "Posted"] as const;

export default function SchedulerPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Calendar");
  const [only, setOnly] = useState("all");
  const [list, setList] = useState<Post[]>(posts);
  const [ready, setReady] = useState([
    { brand: "liftoff", n: 10 },
    { brand: "candle", n: 8 },
  ]);
  const [note, setNote] = useState(false);

  const visible = list.filter((p) => only === "all" || p.brand === only);
  const queued = list.filter((p) => p.state === "queued").length;
  const posted = list.filter((p) => p.state === "posted").length;

  function scheduleReady() {
    // drops each ready video into the next open day, round robin
    let day = 5;
    const add: Post[] = ready.flatMap((r) =>
      Array.from({ length: Math.min(r.n, 2) }, (_, i) => ({
        id: `${r.brand}-${i}-${Date.now()}`,
        brand: r.brand,
        day: Math.min(6, day++),
        time: i % 2 ? "6:00 pm" : "12:00 pm",
        caption: "new video from your editor",
        state: "queued" as const,
      })),
    );
    setList((l) => [...l, ...add]);
    setReady([]);
    setNote(true);
  }

  return (
    <div>
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.01em]">Scheduler</h1>
          <p className="mt-1 text-sm text-muted">4 slots open this week</p>
        </div>
        <Button variant="primary">
          <Plus size={16} /> New post
        </Button>
      </div>

      <Card className="mb-4 flex flex-wrap items-center gap-5 p-4">
        <div className="pr-5 md:border-r md:border-line">
          <div className="text-[28px] font-semibold">4</div>
          <div className="text-[13px] text-muted">Open slots this week</div>
        </div>
        <div>
          <div className="flex -space-x-1">
            {brands.map((b) => (
              <span key={b.id} className="relative">
                <BrandTile id={b.id} size={28} />
                {b.needsAccounts && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#F59E0B]" />}
              </span>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="h-2 w-2 rounded-full bg-[#F59E0B]" /> {brands.filter((b) => b.needsAccounts).length} campaigns need fixing
            <Button className="py-1">Fix accounts</Button>
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          {[
            [queued, "Queued"],
            [0, "Publishing"],
            [posted, "Posted"],
          ].map(([n, l]) => (
            <div key={l} className="min-w-[76px] rounded-xl bg-side px-3 py-2 text-center">
              <div className="text-xl font-semibold">{n}</div>
              <div className="text-xs text-muted">{l}</div>
            </div>
          ))}
        </div>
      </Card>

      {ready.length > 0 && (
        <Card className="mb-4 p-4">
          <div className="mb-2 text-sm text-muted">From your editor</div>
          <div className="space-y-2">
            {ready.map((r) => (
              <div key={r.brand} className="flex items-center gap-3 rounded-xl border border-line px-3 py-2 text-sm">
                <BrandTile id={r.brand} size={22} />
                <b>{brands.find((b) => b.id === r.brand)?.name}</b>
                <span className="text-muted">{r.n} videos ready</span>
                <span className="ml-auto text-muted">Pick videos</span>
              </div>
            ))}
          </div>
          <button onClick={scheduleReady} className="mt-3 w-full rounded-xl border border-brand/40 bg-brand-wash py-2 text-sm text-brand-text">
            randomize & schedule all {ready.length} batches together
          </button>
        </Card>
      )}
      {note && (
        <div className="mb-4">
          <NotHooked what="the posts land on the calendar, but nothing goes out. posting for real needs each account connected through a posting api (tiktok, instagram, youtube) and a worker that publishes on time." />
        </div>
      )}

      <div className="mb-3 inline-flex rounded-lg bg-[#EFEFF0] p-0.5">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={cx("h-7 rounded-md px-2.5 text-[13px] font-medium", t === tab ? "bg-white shadow-[0_1px_2px_rgba(0,0,0,.08),0_0_0_.5px_rgba(0,0,0,.04)]" : "text-[#52525B]")}>
            {t}
          </button>
        ))}
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        <span className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm">
          <Globe size={14} /> Times in <b>New York</b>
        </span>
        <button onClick={() => setOnly("all")} className={cx("rounded-lg border px-3 py-1.5 text-sm", only === "all" ? "border-transparent bg-side font-medium" : "border-line")}>
          All
        </button>
        {brands.map((b) => (
          <button
            key={b.id}
            onClick={() => setOnly(b.id)}
            className={cx("flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-sm", only === b.id ? "border-transparent bg-side font-medium" : "border-line")}
          >
            <BrandTile id={b.id} size={18} /> {b.name}
          </button>
        ))}
        <Button className="py-1.5">
          <SlidersHorizontal size={14} /> Balance schedule
        </Button>
        <Button className="py-1.5">
          <Pause size={14} /> Pause posting
        </Button>
      </div>

      {tab === "Calendar" ? (
        <Card className="overflow-x-auto p-3">
          <div className="mb-3 flex items-center gap-2 text-sm">
            <Button className="px-2 py-1">
              <ChevronLeft size={15} />
            </Button>
            <Button className="px-2 py-1">
              <ChevronRight size={15} />
            </Button>
            <b>Oct 26 to Nov 1</b> <span className="text-muted">This week</span>
          </div>
          <div className="grid min-w-[760px] grid-cols-7 gap-2">
            {weekDays.map((d, i) => (
              <div key={d} className="min-h-[220px] rounded-xl bg-side p-2">
                <div className="mb-2 text-xs font-medium text-muted">{d}</div>
                <div className="space-y-1.5">
                  {visible
                    .filter((p) => p.day === i)
                    .map((p) => (
                      <div key={p.id} className="rounded-lg border border-line bg-white p-2 text-xs">
                        <div className="flex items-center gap-1.5">
                          <BrandTile id={p.brand} size={16} />
                          <span className="whitespace-nowrap text-muted">{p.time}</span>
                        </div>
                        <div className="mt-1 line-clamp-2">{p.caption}</div>
                        <div className={cx("mt-1 text-[11px]", p.state === "posted" ? "text-money" : "text-[#B7791F]")}>{p.state === "posted" ? "posted" : "queued"}</div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card className="divide-y divide-line">
          {visible
            .filter((p) => (tab === "Queue" ? p.state === "queued" : p.state === "posted"))
            .map((p) => (
              <div key={p.id} className="flex items-center gap-3 px-4 py-3 text-sm">
                <BrandTile id={p.brand} size={26} />
                <span className="flex-1">{p.caption}</span>
                <span className="text-muted">
                  {weekDays[p.day]} · {p.time}
                </span>
              </div>
            ))}
        </Card>
      )}
    </div>
  );
}
