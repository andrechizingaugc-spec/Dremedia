"use client";

import Link from "next/link";
import { ArrowLeft, Download, ExternalLink } from "lucide-react";
import { cx } from "@/components/ui";
import { VideoPlayer, openUrl } from "@/components/video";
import { formatById } from "@/lib/dare";
import { ALL_VIDEOS, VIDEOS, ageDays, anyVideoById, clipOf, formatMedian, libraryRank, n, perDay, playbookFor, xMedian, type UgcVideo } from "@/lib/ugc";
import { FormatCard } from "./campaign";
import { CopyBtn, LINK, Panel, SaveBtn, SectionTitle, Stat, Tag, VideoGrid, downloadUrl, fmt, shortDate } from "./ui";

const nice = (c: string) => c.replace(/-/g, " ").replace(/^\w/, (m) => m.toUpperCase());

function Block({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <div className="mb-1.5 text-[12px] font-medium uppercase tracking-[0.06em] text-dm-muted">{title}</div>
      {children}
    </div>
  );
}

/** a short read on where the video is in its life */
function growthNote(v: UgcVideo) {
  const d = v.detail;
  const age = ageDays(v);
  if (d?.perDayLately && d.perDayAvg) {
    const ratio = n(d.perDayLately) / n(d.perDayAvg);
    if (ratio < 0.15) return `It grew about ${d.perDayAvg} views a day on average and only ${d.perDayLately} a day lately, so it has peaked. The idea is proven: make your version now.`;
    return `It's still climbing: ${d.perDayLately} views a day lately against ${d.perDayAvg} on average.`;
  }
  if (age <= 7) return `Only ${age} day${age === 1 ? "" : "s"} old and already at ${fmt(v.views)}. It's still growing, so this format is hot right now.`;
  return `About ${fmt(perDay(v))} views a day over ${age} days since it went up.`;
}

export function VideoDetail({ id }: { id: string }) {
  const v = anyVideoById(id);
  if (!v)
    return (
      <div className="py-20 text-center">
        <p className="text-dm-muted">That video isn't in the library.</p>
        <Link href="/ugc" className="dm-btn-primary mt-4">
          Back to Discover
        </Link>
      </div>
    );

  const d = v.detail;
  const pb = playbookFor(v.format);
  const campaign = v.copyAs ? formatById(v.copyAs) : undefined;
  const dl = downloadUrl(v);
  const rank = libraryRank(v);
  const xm = xMedian(v);
  const fm = formatMedian(v.format);
  const creatorTypical = d && d.creatorTypical !== "–" ? n(d.creatorTypical) : 0;
  const related = ALL_VIDEOS.filter((x) => x.id !== v.id && x.format === v.format).sort((a, b) => b.views - a.views);
  const template = d?.template || pb.template;
  const fullScript = [`Hook: ${v.hook}`, d ? `\nStructure:\n${d.scenes.map((s, i) => `${i + 1}. ${s}`).join("\n")}` : `\nSteps:\n${pb.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`, `\nTemplate: ${template}`].join("\n");

  return (
    <div>
      <Link href="/ugc" className={cx("mb-5 inline-flex items-center gap-1.5 text-[13px]", LINK)}>
        <ArrowLeft size={14} /> Discover
      </Link>

      <div className="grid gap-6 md:grid-cols-[minmax(0,320px)_1fr] md:gap-10">
        <div className="mx-auto w-full max-w-[340px] md:sticky md:top-24 md:self-start">
          <VideoPlayer clip={clipOf(v)} title={v.hook} creator={v.creator} linkClassName={LINK} />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <SaveBtn id={v.id} className="dm-btn-ghost h-9 w-9 justify-center p-0" />
            {dl && (
              <a href={dl} target="_blank" rel="noreferrer" className="dm-btn-ghost h-9 px-3.5 text-[13px]">
                <Download size={14} /> Download
              </a>
            )}
            <a href={openUrl(clipOf(v), v.creator)} target="_blank" rel="noreferrer" className="dm-btn-ghost h-9 px-3.5 text-[13px]">
              Open on {v.platform} <ExternalLink size={12} />
            </a>
          </div>
        </div>

        <div className="min-w-0">
          <div className="text-[13px] text-dm-muted">
            {v.brand} · @{v.creator} · {v.platform} · posted {shortDate(v.posted)}
            {v.dur > 0 && ` · ${v.dur}s`}
          </div>
          <h1 className="mt-2 text-[26px] font-semibold leading-tight tracking-[-0.02em] md:text-[32px]">“{v.hook}”</h1>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Tag strong>{v.format}</Tag>
            <Tag>{nice(v.category)}</Tag>
            {d && <Tag>{d.hookType} hook</Tag>}
            {campaign && <Tag strong>Fits your campaign</Tag>}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3">
            <Stat label="Views" value={fmt(v.views)} sub={rank ? `#${rank} of ${VIDEOS.length} in this library` : "thecal.mp3, same campaign"} />
            <Stat label="Likes" value={v.likes ? fmt(v.likes) : "–"} sub={v.er ? `${v.er}% engagement rate` : "not tracked"} />
            <Stat label="Views per day" value={fmt(perDay(v))} sub={`over ${ageDays(v)} days since posting`} />
            <Stat label="vs its format" value={xm ? `${xm >= 10 ? Math.round(xm) : xm.toFixed(1)}×` : "–"} sub={fm ? `a typical ${v.format} video gets ${fmt(fm)}` : "no median for this format yet"} />
            {d ? (
              <Stat label="vs the creator" value={creatorTypical ? `${Math.max(1, Math.round(v.views / creatorTypical))}×` : "–"} sub={creatorTypical ? `their videos usually get ${d.creatorTypical}` : `${d.followers} followers`} />
            ) : (
              <Stat label="Engagement" value={v.er ? `${v.er}%` : "–"} sub="likes and comments ÷ views" />
            )}
            {d ? <Stat label="DarkUGC rank" value={`#${d.ranks[0].rank.toLocaleString()}`} sub={`of ${d.ranks[0].of.toLocaleString()} ${d.ranks[0].scope} videos`} /> : <Stat label="Format" value={<span className="text-[18px]">{v.format}</span>} sub={pb.what} />}
          </div>

          <Panel className="mt-3 p-4 text-[14px] leading-relaxed">
            <b>Growth.</b> {growthNote(v)}
            {d && d.ranks.length > 1 && (
              <span className="mt-2 block text-[13px] text-dm-muted">
                Ranked {d.ranks.map((r) => `#${r.rank.toLocaleString()} of ${r.of.toLocaleString()} in ${r.scope}`).join(" · ")} on DarkUGC.
              </span>
            )}
          </Panel>

          <section className="mt-8">
            <SectionTitle sub={d ? "From DarkUGC's breakdown of this video" : `How ${v.format} videos are built`} right={<CopyBtn text={fullScript} label="Copy script" />}>
              Script
            </SectionTitle>
            <Panel className="space-y-5 p-5">
              {d && <p className="text-[15px] leading-relaxed">{d.summary}</p>}
              <Block title={d ? `Hook · ${d.hookType}` : "Hook"}>
                <p className="text-[18px] font-semibold leading-snug">“{v.hook}”</p>
              </Block>
              <Block title={d ? "Structure, scene by scene" : "How to film it"}>
                <ol className="list-decimal space-y-1.5 pl-5 text-[14px] leading-relaxed">
                  {(d ? d.scenes : pb.steps).map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ol>
              </Block>
              <Block title="Template: fill in the brackets">
                <div className="flex items-start gap-2 rounded-xl bg-dm-surface2 px-3.5 py-3">
                  <p className="flex-1 text-[15px] leading-relaxed">{template}</p>
                </div>
              </Block>
              {d && (
                <>
                  <Block title="Why it works">
                    <p className="text-[14px] leading-relaxed">{d.why}</p>
                  </Block>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Block title="Problem it shows">
                      <p className="text-[14px] leading-relaxed">{d.pain}</p>
                    </Block>
                    <Block title="What the app gives">
                      <p className="text-[14px] leading-relaxed">{d.benefit}</p>
                    </Block>
                  </div>
                  <Block title="Production">
                    <div className="flex flex-wrap gap-1.5">
                      <Tag>{d.pace} pace</Tag>
                      <Tag>{d.voice}</Tag>
                      <Tag>{d.music}</Tag>
                      {d.techniques.map((t) => (
                        <Tag key={t}>{t}</Tag>
                      ))}
                    </div>
                  </Block>
                  <Block title="Remix it: 3 ideas">
                    <ul className="list-disc space-y-1 pl-5 text-[14px] leading-relaxed">
                      {d.remix.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  </Block>
                </>
              )}
              {!d && <p className="text-[13px] text-dm-muted">{pb.what}</p>}
            </Panel>
          </section>

          {campaign && (
            <section className="mt-8">
              <SectionTitle sub="This is the campaign format that copies this video. Film it this way and submit it under this format.">Film it for your campaign</SectionTitle>
              <FormatCard f={campaign} />
            </section>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <SectionTitle sub={`Other ${v.format} videos, most views first`}>More like this</SectionTitle>
          <VideoGrid items={related} step={4} />
        </section>
      )}
    </div>
  );
}
