"use client";

import { useState } from "react";
import { CalendarClock, FolderOpen, MessageSquare, Plus, Search, Trash2 } from "lucide-react";
import { batches, type Batch } from "@/lib/mock";
import { BrandTile, Button, Card, NotHooked, cx } from "@/components/ui";

const tabs = ["All", "Active", "Review", "Done"] as const;
const inTab = (b: Batch, t: (typeof tabs)[number]) =>
  t === "All" || (t === "Active" ? b.state === "draft" || b.state === "editing" : t === "Review" ? b.state === "review" : b.state === "approved");

const stateLabel: Record<Batch["state"], [string, string]> = {
  draft: ["Unsent draft", "#A3A3A3"],
  editing: ["With your editor", "#F59E0B"],
  review: ["Ready for review", "#3B82F6"],
  approved: ["Approved", "#22A05B"],
};

export default function EditingPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const [list, setList] = useState(batches);
  const [showNew, setShowNew] = useState(false);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-[-0.01em]">Your batches</h1>
        <div className="flex flex-wrap gap-2">
          <Button>
            <FolderOpen size={15} /> Library
          </Button>
          <Button>
            <CalendarClock size={15} /> Live editor schedule
          </Button>
          <Button>
            <MessageSquare size={15} /> Editor feedback
          </Button>
          <Button variant="primary" onClick={() => setShowNew(true)}>
            <Plus size={16} /> New batch
          </Button>
        </div>
      </div>

      {showNew && (
        <div className="mb-4">
          <NotHooked what="a new batch uploads your footage + the reference video, then hands it to an editor (a queue, an editor picker and pings). wire it to your storage and your editors' chat." />
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-lg bg-[#EFEFF0] p-0.5">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={cx("h-7 rounded-md px-2.5 text-[13px] font-medium", t === tab ? "bg-white shadow-[0_1px_2px_rgba(0,0,0,.08),0_0_0_.5px_rgba(0,0,0,.04)]" : "text-[#52525B]")}>
              {t}
            </button>
          ))}
        </div>
        <label className="flex flex-1 items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm">
          <Search size={15} className="text-muted" />
          <input placeholder="Find a batch or editor" className="w-full outline-none" />
        </label>
      </div>

      <div className="space-y-3">
        {list
          .filter((b) => inTab(b, tab))
          .map((b) => {
            const [label, color] = stateLabel[b.state];
            return (
              <Card key={b.id} className="p-4">
                <div className="grid items-center gap-4 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
                  <div className="flex items-center gap-3">
                    <BrandTile id={b.brand} />
                    <span className="font-semibold">{b.title}</span>
                  </div>
                  <div className="text-sm">
                    <div className="text-xs text-muted">Editor</div>
                    {b.editor ?? "Not assigned"}
                  </div>
                  <div className="text-sm">
                    <div className="text-xs text-muted">{b.state === "draft" ? "Submission" : "Turnaround"}</div>
                    {b.state === "draft" ? "Not sent" : b.turnaround}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="h-2 w-2 rounded-full" style={{ background: color }} /> {label}
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  {b.total ? (
                    <div className="w-52">
                      <div className="text-xs">
                        <b>
                          {b.done} / {b.total}
                        </b>{" "}
                        <span className="text-muted">Back</span>
                      </div>
                      <div className="mt-1 h-1.5 rounded-full bg-[#ECECEC]">
                        <div className="h-1.5 rounded-full bg-[#3E8E57]" style={{ width: ((b.done ?? 0) / b.total) * 100 + "%" }} />
                      </div>
                    </div>
                  ) : (
                    <Button variant="primary" className="py-1.5">
                      Finish it
                    </Button>
                  )}
                  {b.state !== "draft" && <Button className="py-1.5">Open</Button>}
                  <button onClick={() => setList((l) => l.filter((x) => x.id !== b.id))} className="p-1 text-muted hover:text-ink" aria-label="delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </Card>
            );
          })}
      </div>
    </div>
  );
}
