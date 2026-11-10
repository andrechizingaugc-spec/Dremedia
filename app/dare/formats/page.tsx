"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { Card, CopyButton, Tabs } from "@/components/ui";
import { DareExamples, FormatChips } from "@/components/dare/parts";
import { PageTitle } from "@/components/dare/site";
import { BOUNTY_FORMAT, DARE_FORMATS, LIBRARY, type Effort } from "@/lib/dare";

const ORDER: Record<Effort, number> = { easy: 0, medium: 1, hard: 2 };
const FILTERS = ["All", "Easy", "No talking"] as const;

export default function FormatsPage() {
  const [only, setOnly] = useState<(typeof FILTERS)[number]>("All");
  const list = DARE_FORMATS.filter((f) => (only === "Easy" ? f.effort === "easy" : only === "No talking" ? f.talking === false : true)).sort((a, b) => ORDER[a.effort] - ORDER[b.effort]);
  const refs = (id: string) => LIBRARY.filter((v) => v.formatId === id && v.source !== "Dare example").length;

  return (
    <div>
      <PageTitle title="Dare's formats" sub={`All ${DARE_FORMATS.length} formats on Dare's Bounty campaign, with Dare's own example videos, the brief and the script. Easiest first.`}>
        <Tabs items={FILTERS} value={only} onChange={setOnly} count={(t) => DARE_FORMATS.filter((f) => (t === "Easy" ? f.effort === "easy" : t === "No talking" ? f.talking === false : true)).length} />
      </PageTitle>

      <div className="grid gap-3 lg:grid-cols-2">
        {list.map((f) => (
          <Card key={f.id} className="grid gap-4 p-4 sm:grid-cols-[180px_1fr]">
            <DareExamples f={f} className="mx-auto w-full max-w-[260px] sm:max-w-none" />
            <div className="min-w-0 space-y-2">
              <h2 className="font-semibold leading-snug">{f.title}</h2>
              <FormatChips f={f} />
              <p className="text-[13px] leading-relaxed">
                <span className="text-muted">Brief: </span>
                {f.brief}
              </p>
              {f.steps && (
                <details className="text-[13px]">
                  <summary className="cursor-pointer font-medium">Shot by shot</summary>
                  <ol className="mt-1 list-decimal space-y-1 pl-5 leading-relaxed">
                    {f.steps.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
                </details>
              )}
              {f.script && (
                <details className="text-[13px]">
                  <summary className="cursor-pointer font-medium">Dare's script</summary>
                  <p className="mt-1 whitespace-pre-line rounded-lg bg-side px-3 py-2 leading-relaxed">{f.script}</p>
                  <CopyButton text={f.script} label="Copy script" className="mt-2" />
                </details>
              )}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[13px]">
                <a href={BOUNTY_FORMAT(f.id)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-brand-text hover:underline">
                  Open on Bounty <ExternalLink size={12} />
                </a>
                {refs(f.id) > 0 && <span className="text-muted">· {refs(f.id)} viral versions in the Library</span>}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
