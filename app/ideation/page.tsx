"use client";

import { useState } from "react";
import { Bookmark, BookmarkCheck, Eye, Plus, Search } from "lucide-react";
import { brands, creators, ideaVideos } from "@/lib/mock";
import { BrandTile, Button, Card, NotHooked, PlatformIcon, cx } from "@/components/ui";

const tabs = ["Watch list", "Inspiration bank", "Planner"] as const;

export default function IdeationPage() {
  const [brand, setBrand] = useState("all");
  const [tab, setTab] = useState<(typeof tabs)[number]>("Watch list");
  const [saved, setSaved] = useState<string[]>(["v2"]);
  const [filmed, setFilmed] = useState<string[]>([]);
  const toggle = (id: string) => setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const shown = tab === "Watch list" ? ideaVideos : ideaVideos.filter((v) => saved.includes(v.id));

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-baseline gap-3">
        <h1 className="text-2xl font-semibold tracking-[-0.01em]">Ideation</h1>
        <span className="text-sm text-muted">
          <b className="text-ink">{saved.length - filmed.length}</b> to film this week · <b className="text-ink">{filmed.length}</b> done ·{" "}
          <b className="text-ink">{ideaVideos.length}</b> in bank
        </span>
      </div>

      <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto">
        <button
          onClick={() => setBrand("all")}
          className={cx("shrink-0 rounded-lg border px-3.5 py-2 text-sm", brand === "all" ? "border-transparent bg-side font-medium" : "border-line")}
        >
          All brands
        </button>
        {brands.map((b, i) => (
          <button
            key={b.id}
            onClick={() => setBrand(b.id)}
            className={cx("flex shrink-0 items-center gap-2 rounded-lg border px-3 py-1.5 text-sm", brand === b.id ? "border-transparent bg-side font-medium" : "border-line")}
          >
            <BrandTile id={b.id} size={22} /> {b.name} <span className="text-xs text-muted">0/{[140, 6, 14, 21, 9, 3][i]}</span>
          </button>
        ))}
      </div>

      <div className="mb-5 inline-flex rounded-lg bg-[#EFEFF0] p-0.5">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={cx("h-7 rounded-md px-2.5 text-[13px] font-medium", t === tab ? "bg-white shadow-[0_1px_2px_rgba(0,0,0,.08),0_0_0_.5px_rgba(0,0,0,.04)]" : "text-[#52525B]")}>
            {t}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <Card className="hidden h-fit space-y-4 p-4 lg:block">
          <div className="font-semibold">Filters</div>
          {[
            ["Sort by", "Most views"],
            ["Columns", "3 columns"],
            ["Outliers", "All videos"],
            ["Length", "Any length"],
          ].map(([l, v]) => (
            <div key={l}>
              <div className="mb-1.5 text-[13px] text-muted">{l}</div>
              <div className="rounded-lg border border-line px-3 py-2 text-sm">{v}</div>
            </div>
          ))}
          <div>
            <div className="mb-1.5 text-[13px] text-muted">Platform</div>
            <div className="flex gap-1 rounded-lg bg-side p-1">
              <span className="flex-1 rounded-lg bg-white py-1 text-center text-sm shadow-sm">All</span>
              {(["instagram", "tiktok", "youtube"] as const).map((p) => (
                <span key={p} className="flex flex-1 items-center justify-center">
                  <PlatformIcon p={p} />
                </span>
              ))}
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          {tab === "Watch list" && (
            <>
              <Card className="p-4">
                <div className="mb-3 text-[15px] font-medium">
                  Creators <span className="text-sm font-normal text-muted">{ideaVideos.length} videos · {creators.length} creators · all time</span>
                </div>
                <div className="flex flex-wrap gap-6">
                  <div className="flex flex-col items-center gap-1.5 text-xs">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-[#bbb]">
                      <Plus size={18} />
                    </span>
                    Manage creators
                  </div>
                  {creators.map((c, i) => (
                    <div key={c.name} className="flex flex-col items-center gap-0.5 text-xs">
                      <span
                        className="relative flex h-12 w-12 items-center justify-center rounded-full bg-cover bg-center text-sm font-semibold text-white"
                        style={{ backgroundColor: c.color, backgroundImage: c.pic ? `url(${c.pic})` : undefined }}
                      >
                        {!c.pic && c.name[0].toUpperCase()}
                        <span className="absolute -left-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-ink text-[9px] text-white">{i + 1}</span>
                      </span>
                      <span className="mt-1 font-medium">{c.name}</span>
                      <span className="text-muted">{c.views} views</span>
                    </div>
                  ))}
                </div>
              </Card>
              <NotHooked what="the watch list fills itself from the creators you follow (a scraper pulls their newest videos and ranks the outliers). here it shows sample videos." />
            </>
          )}
          {tab === "Inspiration bank" && <NotHooked what="the bank is every video you saved with the bookmark. it lives in your browser here; in the real one it saves to your account." />}
          {tab === "Planner" && (
            <Card className="divide-y divide-line">
              {ideaVideos
                .filter((v) => saved.includes(v.id))
                .map((v) => (
                  <label key={v.id} className="flex cursor-pointer items-center gap-3 px-4 py-3 text-sm">
                    <input
                      type="checkbox"
                      checked={filmed.includes(v.id)}
                      onChange={() => setFilmed((f) => (f.includes(v.id) ? f.filter((x) => x !== v.id) : [...f, v.id]))}
                      className="h-4 w-4 accent-[#00BDAB]"
                    />
                    <span className={cx("flex-1", filmed.includes(v.id) && "text-muted line-through")}>{v.caption}</span>
                    <span className="text-xs text-muted">{v.creator}</span>
                  </label>
                ))}
              {saved.length === 0 && <div className="p-4 text-sm text-muted">bookmark videos in the watch list to plan them here.</div>}
            </Card>
          )}

          {tab !== "Planner" && (
            <>
              <div className="flex gap-2">
                <label className="flex flex-1 items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm">
                  <Search size={15} className="text-muted" />
                  <input placeholder="search videos" className="w-full outline-none" />
                </label>
                <Button>Select to film</Button>
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {shown.map((v, i) => (
                  <div
                    key={v.id}
                    className="relative aspect-[9/14] overflow-hidden rounded-[14px] bg-[#111] text-white"
                  >
                    <video src={v.src} poster={v.poster} autoPlay muted loop playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute left-2.5 top-2.5 flex gap-1.5 text-[11px]">
                      <span className="rounded-md bg-[#DDF6E2] px-1.5 py-0.5 font-semibold text-[#2E7D46]">{v.outlier}</span>
                      <span className="rounded-md bg-black/50 px-1.5 py-0.5">#{i + 1}</span>
                    </div>
                    <button onClick={() => toggle(v.id)} className="absolute right-2.5 top-2.5 rounded-lg bg-white p-1.5 text-ink" aria-label="save">
                      {saved.includes(v.id) ? <BookmarkCheck size={15} className="text-brand" /> : <Bookmark size={15} />}
                    </button>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-10">
                      <div className="line-clamp-2 text-[13px] font-medium">{v.caption}</div>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5">
                          <span className="rounded bg-white p-0.5 text-ink">
                            <PlatformIcon p={v.platform} size={12} />
                          </span>
                          {v.creator}
                        </span>
                        <span className="flex items-center gap-1 rounded-md bg-white/90 px-1.5 py-0.5 font-semibold text-[#3B5BDB]">
                          <Eye size={12} /> {v.views}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
