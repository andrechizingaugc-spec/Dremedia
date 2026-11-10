"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useData } from "@/lib/store";
import { Button, Tabs, cx } from "@/components/ui";
import { LibraryCard } from "@/components/dare/parts";
import { PageTitle } from "@/components/dare/site";
import { FAMILIES, LIBRARY, fmtViews, type Family } from "@/lib/dare";

const SOURCES = ["All", "Dare example", "DarkUGC", "thecal.mp3", "Starred"] as const;
type Source = (typeof SOURCES)[number];
const SORTS = ["Most views", "Newest"] as const;
const PAGE = 12;

export default function LibraryPage() {
  const { data, update } = useData();
  const [family, setFamily] = useState<Family | "All">("All");
  const [source, setSource] = useState<Source>("All");
  const [sort, setSort] = useState<(typeof SORTS)[number]>("Most views");
  const [q, setQ] = useState("");
  const [shown, setShown] = useState(PAGE);
  useEffect(() => setShown(PAGE), [family, source, sort, q]);

  const starredList = data.dare.starred;
  const starred = useMemo(() => new Set(starredList), [starredList]);
  const star = (k: string) => update((x) => ({ ...x, dare: { ...x.dare, starred: x.dare.starred.includes(k) ? x.dare.starred.filter((s) => s !== k) : [...x.dare.starred, k] } }));

  const list = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    return LIBRARY.filter((v) => family === "All" || v.family === family)
      .filter((v) => (source === "All" ? true : source === "Starred" ? starred.has(v.key) : v.source === source))
      .filter((v) => words.every((w) => `${v.hook} ${v.creator} ${v.brand} ${v.family}`.toLowerCase().includes(w)))
      .sort((a, b) => (sort === "Newest" ? (b.posted || "").localeCompare(a.posted || "") : b.views - a.views));
  }, [family, source, sort, q, starred]);

  const total = LIBRARY.reduce((s, v) => s + v.views, 0);

  return (
    <div>
      <PageTitle
        title="Video library"
        sub={`${LIBRARY.length} videos that play right here: Dare's examples, thecal.mp3's reposts and the top videos from Dare's competitors on DarkUGC (${fmtViews(total)} views between them). Each one says which Dare format to copy it as.`}
      />

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <label className="flex h-9 min-w-[220px] flex-1 items-center gap-2 rounded-lg border border-line bg-white px-3 text-sm focus-within:border-brand">
          <Search size={15} className="text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search hooks, creators, brands" className="min-w-0 flex-1 bg-transparent outline-none" aria-label="Search the library" />
        </label>
        <Tabs items={SOURCES} value={source} onChange={setSource} count={(s) => (s === "All" ? LIBRARY.length : s === "Starred" ? starred.size : LIBRARY.filter((v) => v.source === s).length)} />
        <Tabs items={SORTS} value={sort} onChange={setSort} />
      </div>

      <div className="no-scrollbar mb-4 flex gap-1.5 overflow-x-auto" role="group" aria-label="Format type">
        {(["All", ...FAMILIES] as const).map((fam) => (
          <button key={fam} onClick={() => setFamily(fam)} aria-pressed={family === fam} className={cx("shrink-0 rounded-lg border px-3 py-1.5 text-[13px]", family === fam ? "border-transparent bg-ink text-white" : "border-line bg-white")}>
            {fam} <span className={cx("text-[11px]", family === fam ? "text-white/70" : "text-muted")}>{fam === "All" ? LIBRARY.length : LIBRARY.filter((v) => v.family === fam).length}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 min-[460px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {list.slice(0, shown).map((v) => (
          <LibraryCard key={v.key} v={v} starred={starred.has(v.key)} onStar={() => star(v.key)} />
        ))}
      </div>
      {list.length === 0 && <div className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-muted">No videos match. Clear the search or pick another filter.</div>}
      {list.length > shown && (
        <div className="mt-4 text-center">
          <Button onClick={() => setShown(shown + PAGE)}>Show {Math.min(PAGE, list.length - shown)} more</Button>
        </div>
      )}
    </div>
  );
}
