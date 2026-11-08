"use client";

import { useState } from "react";
import { ArrowUpRight, RefreshCw } from "lucide-react";
import { Button, Card, NotHooked, PlatformIcon, cx } from "@/components/ui";

const plan = [
  { day: "Day 1-2", task: "scroll your niche for 20 min. like 10 posts. no posting." },
  { day: "Day 3-4", task: "follow 10 creators in your niche. leave 5 real comments." },
  { day: "Day 5", task: "fill in the bio and profile picture. save 10 posts." },
  { day: "Day 6", task: "post your first video. keep scrolling the niche for 15 min." },
  { day: "Day 7+", task: "post daily. keep 10 min of niche scrolling before each post." },
];

export default function WarmUpPage() {
  const [done, setDone] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);

  return (
    <div>
      <h1 className="mb-5 text-2xl font-semibold tracking-[-0.01em]">Warm-up</h1>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-[15px]">
          <PlatformIcon p="instagram" size={20} />
          <PlatformIcon p="tiktok" size={20} /> Works on Instagram and TikTok
        </span>
        <Button variant="primary" onClick={() => setChecked(true)}>
          Open warm-up <ArrowUpRight size={15} />
        </Button>
      </div>

      <Card className="mb-4 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="font-semibold">Your extension</div>
          <Button className="py-1 text-xs" onClick={() => setChecked(true)}>
            <RefreshCw size={13} /> Check again
          </Button>
        </div>
        <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-line">
          <div className="border-r border-line p-4">
            <div className="text-sm">Installed</div>
            <div className="mt-1 text-xl font-semibold">Not found</div>
          </div>
          <div className="p-4">
            <div className="text-sm">Latest version</div>
            <div className="mt-1 text-xl font-semibold">1.0.0</div>
          </div>
        </div>
        {checked && (
          <div className="mt-4">
            <NotHooked what="the warm-up runs as a chrome extension that scrolls, likes and watches in your niche for you on a schedule. build the extension, then have this card ask it for its version." />
          </div>
        )}
      </Card>

      <Card className="p-5">
        <div className="mb-1 font-semibold">Manual warm-up plan</div>
        <p className="mb-4 text-sm text-muted">no extension yet? do it by hand. tick each day off as you go.</p>
        <div className="space-y-2">
          {plan.map((p, i) => (
            <label key={p.day} className={cx("flex cursor-pointer items-start gap-3 rounded-xl border border-line p-3 text-sm", done.includes(i) && "bg-side")}>
              <input
                type="checkbox"
                checked={done.includes(i)}
                onChange={() => setDone((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]))}
                className="mt-0.5 h-4 w-4 accent-[#00BDAB]"
              />
              <span className="w-16 shrink-0 font-semibold">{p.day}</span>
              <span className={cx(done.includes(i) && "text-muted line-through")}>{p.task}</span>
            </label>
          ))}
        </div>
      </Card>
    </div>
  );
}
