"use client";

// The Dre Media CEO command centre (app/ugc/ceo), built from the "AI CEO Operating
// System". Everything typed here is saved in this browser only (localStorage), like
// the rest of the site. The repo and the site are public, so no personal earnings,
// balances or goals are written into this file: they are entered on the site.

import { useEffect, useState } from "react";

// ---------------------------------------------------------------- types

export type Day = { c?: Record<string, boolean>; hours?: number | null; note?: string; top3?: string[] };
export type Campaign = { id: string; brand: string; platform: string; payPer: number; threshold: number; perDay: number; status: "active" | "paused" | "ended"; deadline: string; payStatus: string; notes: string };
export type Log = { posted: number | null; qual: number | null };
export type Stage = "lead" | "emailed" | "replied" | "meeting" | "proposal" | "won" | "lost";
export type Touch = { date: string; kind: string; note: string };
export type Lead = { id: string; brand: string; contact: string; email: string; signal: string; stage: Stage; value: number | null; next: string; c?: string; r?: string; k?: string; p?: string; w?: string; touches: Touch[] };
export type Client = { id: string; name: string; division: "Creative" | "Social"; offer: string; fee: number; recurring: boolean; due: number; delivered: number; qc: number; creatorCost: number; editCost: number; deadline: string; status: "active" | "done"; rights: boolean; results: string };
export type Creator = { id: string; name: string; niche: string; platforms: string; portfolio: string; rate: number; availability: string; stage: "applied" | "testing" | "approved" | "rejected"; quality: string; assigned: string; owed: number; paid: number };
export type Entry = { id: string; kind: "earned" | "expense"; date: string; div: string; source: string; amount: number; method: string; receivedOn: string; cost: "direct" | "operating"; note: string };
export type Who = "Me" | "AI" | "Freelancer" | "Employee" | "Ops manager";
export type Task = { id: string; title: string; div: string; due: string; done: boolean; who: Who; doneOn?: string };
export type Decision = { id: string; date: string; decision: string; why: string };
export type Interview = { id: string; date: string; who: string; side: "creator" | "brand"; problem: string; pay: "yes" | "maybe" | "no"; note: string };
export type Idea = { id: string; title: string; priority: number; status: "idea" | "validating" | "mvp" | "dropped" };
export type Settings = { target: number; targetCur: "USD" | "ZAR"; fx: number; tax: number; costs: number; emergency: number; cash: number; baseline: number; wealthZar: number; equityZar: number; millionZar: number; emailsPerDay: number };
export type Review = { working: string; notWorking: string; stop: string; improve: string; opportunity: string; top3: string };
export type Ceo = {
  v: 2;
  settings: Settings;
  days: Record<string, Day>;
  campaigns: Campaign[];
  logs: Record<string, Log>; // `${date}|${campaignId}`
  leads: Lead[];
  clients: Client[];
  creators: Creator[];
  money: Entry[];
  tasks: Task[];
  decisions: Decision[];
  interviews: Interview[];
  ideas: Idea[];
  checks: Record<string, boolean>;
  divisions: Record<string, string>;
  lessons: Record<string, { done: boolean; note: string }>;
  reviews: Record<string, Review>;
};

// ---------------------------------------------------------------- the operating system

export const START = "2026-11-25"; // day 1 of 90; day 90 is 22 Feb 2027

export const MISSION = "Build Dre Media into a profitable, scalable creative agency, then a portfolio of connected businesses and technology products that runs with minimal dependence on the founder's daily involvement. One ecosystem, not four businesses competing for the same hours.";
export const PRIORITIES = [
  "Establish predictable cash flow",
  "Build a profitable UGC agency",
  "Create repeatable business systems",
  "Introduce recurring revenue services",
  "Recruit and manage a team",
  "Build scalable digital assets",
  "Develop our own creator technology platform",
  "Build long-term personal wealth and business equity",
];
export const PROTOCOL: [string, string][] = [
  ["Understand", "Find the real objective. Use what's already decided; never re-ask answered questions."],
  ["Investigate", "Check current facts where accuracy matters. Don't guess at important numbers."],
  ["Plan", "Break it into stages: what, why, what it depends on, how success is measured."],
  ["Execute", "Do the work with the tools available instead of describing it."],
  ["Verify", "Test it, recalculate the numbers, separate confirmed facts from assumptions."],
  ["Report", "What's done, what works, what's unfinished, what needs approval, what's next."],
];
export const GUARDRAILS = [
  "Living expenses, emergency savings and personal security come first. A budget is not permission to spend it.",
  "Never confuse money earned with money received, or revenue with profit, cash or valuation.",
  "Never subcontract work from an existing creator campaign. For agency work, the brand agrees the creator arrangement, usage rights, deliverables and terms first.",
  "No subscription, tool or hire until its economic value is shown. Try existing AI tools first.",
  "Be careful with creator agreements, usage rights, ad permissions, exclusivity, payment terms, customer data, influencer disclosures and platform terms.",
  "South African tax and company obligations go to the accountant. No false certainty.",
  "Facts, assumptions, estimates and targets are always labelled as such.",
];

export const DIVISIONS = [
  { key: "creative", name: "Dre Media Creative", role: "UGC production, campaign management, creator recruitment and matching, editing, ad creatives, QC.", rule: "The starting business: generates revenue and reputation. Moves you from creator to agency founder.", status: "Active" },
  { key: "social", name: "Dre Media Social", role: "Instagram and TikTok management, content calendars, editing, community, reporting.", rule: "Recurring retainers with outsourced execution. Validate in Phase 3 by selling to Creative clients first.", status: "Locked" },
  { key: "studios", name: "Dre Media Studios", role: "Owned YouTube channels with researchers, writers, voice, editors, thumbnails.", rule: "Only once economics, a publishing system and monetisation are validated. Never low-quality or repetitive channels.", status: "Locked" },
  { key: "commerce", name: "Dre Media Commerce", role: "Product research and validation, brand, store, ad creatives, fulfilment, support.", rule: "Never launch because a product looks popular. Validate demand and contribution margin first.", status: "Paused" },
  { key: "connect", name: "Dre Connect", role: "Future platform where creators find campaigns and brands find creators.", rule: "Find the most valuable problem, prove people pay, then build the smallest product around it. A separate product, not part of this dashboard.", status: "Research" },
];
export const DIV_STATUSES = ["Active", "Starting", "Research", "Validating", "Locked", "Paused", "Stopped"];
export const DIVS = ["Own UGC", "Creative", "Social", "Studios", "Commerce", "Dre Connect", "CEO"];
export const WHO: Who[] = ["Me", "AI", "Freelancer", "Employee", "Ops manager"];
export const METHODS = ["Bank", "PayPal", "Wise", "Platform balance"];

export const STAGES: Stage[] = ["lead", "emailed", "replied", "meeting", "proposal", "won", "lost"];
export const STAMP: Partial<Record<Stage, "c" | "r" | "k" | "p" | "w">> = { emailed: "c", replied: "r", meeting: "k", proposal: "p", won: "w" };
export const TOUCH_KINDS = ["Email", "Follow-up", "DM", "Call", "Proposal", "Note"];

export const PHASES = [
  {
    n: 1, name: "Foundation and cash flow", from: 1, to: 21, dates: "25 Nov – 15 Dec",
    work: ["Reconcile my finances", "Protect current UGC earnings", "Improve the UGC production process", "Create Dre Media's brand positioning", "Develop the first agency offer", "Build a simple internal dashboard", "Establish a targeted prospecting system"],
    gate: ["Last 3 months reconciled: earned vs received", "First offer written with price and deliverables", "100+ researched brands emailed"],
  },
  {
    n: 2, name: "Agency validation", from: 22, to: 62, dates: "16 Dec – 25 Jan",
    work: ["Direct brand acquisition", "Sales calls and proposals", "First managed UGC campaign", "Creator recruitment", "Campaign delivery", "Client satisfaction", "Documented operations", "Campaign profitability"],
    gate: ["First managed campaign delivered and paid", "Its margin confirmed at 50%+", "Delivery SOPs written"],
  },
  {
    n: 3, name: "Systemisation and expansion", from: 63, to: 90, dates: "26 Jan – 22 Feb",
    work: ["Repeatable campaign delivery", "Delegate proven work", "Recruit the first justified team member", "Improve recurring revenue", "Validate social media management", "Research the creator technology platform", "Identify the first viable platform MVP"],
    gate: ["Monthly target hit", "3 clients signed", "1 recurring retainer", "No client over 50% of revenue"],
  },
];

export type Kind = "ceo" | "film" | "sat" | "sun";
export const KIND: Record<Kind, string> = { ceo: "CEO day", film: "Batch-film day", sat: "Review day", sun: "Day off" };
export const SCHEDULE: Record<Kind, [string, string, string][]> = {
  ceo: [
    ["sales", "Hour 1", "Sales: 20–30 personalised emails to researched brands"],
    ["follow", "Hour 2", "Follow-ups, meetings and proposals"],
    ["deliver", "Hour 3", "Delivery: creator briefs, QC, client updates"],
    ["post", "Hour 4", "Post today's campaign videos and log what qualified"],
    ["ceo", "Hour 5", "CEO hour: numbers, alerts, improve one SOP"],
  ],
  film: [
    ["sales", "Hour 1", "Sales: 20–30 personalised emails to researched brands"],
    ["film", "Hour 2–3", "Batch film 10–12 videos in one session"],
    ["editor", "Hour 3", "Hand footage to the editor"],
    ["post", "Hour 4", "Post today's campaign videos and log what qualified"],
    ["bench", "Hour 5", "Creators: recruit, test, give feedback"],
  ],
  sat: [
    ["review", "1 hour", "Weekly CEO review and decision log"],
    ["post", "Any time", "Post today's campaign videos and log what qualified"],
    ["plan", "30 min", "Set next week's 3 priorities"],
  ],
  sun: [["off", "All day", "Day off taken. Rest is part of the plan"]],
};

export const OUTREACH = `Subject: your [app] creator ads

Hi [name], I saw your [specific ad or hook]. I run creator campaigns for consumer apps and post 7 videos a day myself; about half clear 1,000 views, and my videos have passed 1M views. Your hook in [ad] takes 3 seconds to show the product. I'd test [specific alternative]. I can deliver 10 ad-ready creator videos with 3 hooks each in 10 days. Worth a 15-minute call this week?

Andre, Founder, Dremedia`;
export const FOLLOWUP = `Subject: re: your [app] creator ads

Hi [name], one more idea: [a second specific hook for their product]. Happy to send a 20-second test video of it so you can judge before any call. Want me to?

Andre`;
export const CALL_QUESTIONS = [
  "What are you running for creator content now, and what does it cost a month?",
  "Which videos worked best in the last 30 days, and how do you measure it?",
  "Which one number must this content move: installs, sign-ups, sales?",
  "Who else decides, and what would they need to see?",
  "If the first 10 videos beat what you have, what happens next month?",
];
export const OFFERS = [
  { name: "Offer A · UGC Ad Pack", text: "10 ad-ready videos, 3 creators, 3 hooks each, 10 days. $1,500. Pilot $1,000–1,200 for a case study." },
  { name: "Offer B · Managed creator campaign", text: "$2,000/month to recruit, brief, QC and track 10–20 creators, plus the creator budget at cost +10%. 2-month minimum." },
];
export const SOP: [string, string][] = [
  ["Agree", "Brand signs off the creator arrangement, usage rights, deliverables, payment terms and disclosures before anyone films."],
  ["Brief", "One page per creator: product, audience, 3 hooks, do's and don'ts, deadline."],
  ["Test", "New creators make 2 paid test videos before client work."],
  ["QC", "Hook in 2 seconds, product clear, clean sound, white captions with a thin black outline, no dead air."],
  ["Deliver", "Named files, all hook variants, a day early."],
  ["Report", "Winning hooks, the numbers, the next test. Ask for results and a quote for the case study."],
];
export const LADDER: [Who, string][] = [
  ["Me", "Sales calls, negotiation, strategy, client relationships, filming my own campaign."],
  ["AI", "Brand research lists, first drafts of emails, scripts, briefs, reports, call notes."],
  ["Freelancer", "Editing (already), creator bench, then a campaign coordinator at 2 clients."],
  ["Employee", "Nobody until a role has been full-time freelance work for 3 months and pays for itself."],
  ["Ops manager", "At about $20,000/month for 2 months, to run delivery day to day."],
];

export type Lesson = { id: string; week: number; title: string; idea: string; rule: string; drill: string };
export const LESSONS: Lesson[] = [
  { id: "l1", week: 1, title: "Earned, received, profit and value are different numbers", idea: "Earned is what a platform approved. Received is what reached your bank, PayPal or Wise, sometimes a month later. Profit is what's left after costs and tax. Value is what a buyer would pay for the business. Plans made with the wrong number fail quietly.", rule: "No forecast until the last 3 months are reconciled, earned against received.", drill: "Log every payout since July in Money, with the date it was earned and the date it was received." },
  { id: "l2", week: 1, title: "Concentration risk: one client is one point of failure", idea: "When one campaign pays most of your income, that brand runs your business. A rule change or paused budget can take it all in one email. Agencies fix this with several clients, none bigger than about half of revenue.", rule: "Largest source under 50% of revenue by day 90.", drill: "Read the concentration alert on the Overview and write in the decision log what you'd do if that source stopped tomorrow." },
  { id: "l3", week: 2, title: "Sell to people who are already buying", idea: "An app already running creator campaigns or UGC-style ads has budget and belief. You only need to show you're better or cheaper, not that UGC works.", rule: "Only add brands with a visible signal: creator campaigns, UGC ads or job posts.", drill: "Add 20 brands to the CRM today, each with the signal you saw." },
  { id: "l4", week: 2, title: "An offer is an outcome, a deliverable, a deadline and a price", idea: "'I make UGC' isn't an offer. 'Ten ad-ready videos with three hooks each in ten days for $1,500' is. Clear offers close faster because buyers can picture what they get.", rule: "Every offer fits in one sentence with a number, a deadline and a price.", drill: "Put Offers A and B on your portfolio page, one sentence each." },
  { id: "l5", week: 3, title: "Sales is a funnel you can measure", idea: "Emails × reply rate × meeting rate × close rate = clients. Know your rates and you know what one client costs in effort. Fix the weakest stage: the message for replies, the call for closes.", rule: "20–30 personalised emails a day. Under 5% replies after 200: change the message, not the volume.", drill: "Send 25 a day for 5 days, then read your reply rate in the CRM." },
  { id: "l6", week: 3, title: "On a discovery call, ask before you pitch", idea: "The client talks 70% of the call. Ask what they run now, what it costs, what worked, which number must move and who decides. Then pitch the one offer that answers them, in their words.", rule: "Five questions first, one offer second, the next step booked before you hang up.", drill: "Practise the five questions in the CRM out loud twice before your first call." },
  { id: "l7", week: 4, title: "Contribution margin decides if you can grow", idea: "Contribution margin is the fee minus what it costs to deliver: creators and editing. Under about 40%, growth makes you busier, not richer. At $1,500 for 10 videos with creators at $50–60 and editing at $4, it's about 57%.", rule: "Agency contribution margin 50%+. Never price below what pays creators properly.", drill: "Before every quote, enter the fee and costs in Agency and check the margin." },
  { id: "l8", week: 5, title: "Delivery is a system, not a favour", idea: "Agree → brief → test → QC → deliver → report. When every client goes through the same steps, someone else can run them. A step written down is an SOP; a step in your head is a job only you can do.", rule: "Any task done twice gets written down as an SOP.", drill: "Write your brief template and QC checklist this week." },
  { id: "l9", week: 6, title: "Case studies sell the next client", idea: "Strangers trust proof over promises. One page with the problem, what you made and the numbers after beats any pitch. That's why the first client gets a lower price in exchange for a case study.", rule: "No delivery ends without asking for results and a quote.", drill: "Draft the case-study page now with blanks for client 1's numbers." },
  { id: "l10", week: 7, title: "Me, AI, freelancer, employee, ops manager", idea: "Every task belongs on one rung. Do it yourself only if it needs your judgement or face. Give drafts and research to AI, repeatable work to freelancers, and hire employees only once a role is proven full-time and pays for itself.", rule: "A hire's cost must be under a third of the gross profit it frees up or creates.", drill: "Set the 'who' on every open task in Plan, and log a week of hours by task." },
  { id: "l11", week: 8, title: "Pay tax first, then protect yourself, then grow", idea: "Not all money in your account is yours. Tax comes off first, then living costs and an emergency fund, then a business reserve. Only then reinvest and pay yourself more. That order keeps you alive when a client pays late.", rule: "Tax set-aside, then 3 months of essentials saved, then 30% reserve / 30% reinvest / 40% pay.", drill: "Open a separate account for tax and move this month's set-aside into it." },
  { id: "l12", week: 9, title: "The CEO's week: review, decide, rest", idea: "CEOs run a rhythm, not a longer to-do list. Every week, look at the numbers, decide what to stop and what to improve, write down the decision, and take a full day off.", rule: "Saturday review and Sunday off, every week.", drill: "Do this week's review and log at least one decision with its reason." },
  { id: "l13", week: 10, title: "Recurring revenue beats one-off projects", idea: "A $1,500 project has to be resold every month. A $2,000 retainer pays every month without new selling, so your sales time goes to the next client. Offer B and Social exist to turn one-off clients into retainers.", rule: "Every Offer A client hears a retainer proposal before delivery ends.", drill: "Write the retainer proposal for your first client using their case-study numbers." },
  { id: "l14", week: 11, title: "Validate before you build: the Dre Connect rule", idea: "Most platforms fail because they solve a problem nobody pays for. Talk to 10 creators and 10 brands, find the problem that repeats and hurts, and ask if they'd pay. Build the smallest version only when they say yes.", rule: "No code for Dre Connect before 20 interviews and 5 people saying they'd pay.", drill: "Log your first 3 interviews in Divisions → Dre Connect." },
  { id: "l15", week: 12, title: "Focus: say no to good ideas", idea: "Every division competes for the same 5 hours. Founders who launch YouTube, e-commerce and software together end up with four half-built businesses. Park ideas behind a gate and come back when the current division pays for the next.", rule: "No new division until the one before meets its gate.", drill: "Move every parked idea into Plan → Tasks with 'parked' in the title." },
];

// ---------------------------------------------------------------- dates and numbers

const z = (n: number) => String(n).padStart(2, "0");
export const ymd = (d: Date) => `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
export const parseDay = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
};
export const addDays = (s: string, n: number) => {
  const d = parseDay(s);
  d.setDate(d.getDate() + n);
  return ymd(d);
};
export const diffDays = (a: string, b: string) => Math.round((parseDay(b).getTime() - parseDay(a).getTime()) / 864e5);
export const todayStr = () => ymd(new Date());
export const dayN = (d: string) => diffDays(START, d) + 1;
export const kindOf = (d: string): Kind => {
  const w = parseDay(d).getDay();
  return w === 0 ? "sun" : w === 6 ? "sat" : w === 2 || w === 4 ? "film" : "ceo";
};
export const phaseOf = (n: number) => PHASES.find((p) => n >= p.from && n <= p.to) ?? (n < 1 ? PHASES[0] : PHASES[2]);
export const weekStart = (d: string) => addDays(d, -((parseDay(d).getDay() + 6) % 7));
export const inRange = (d: string | undefined, a: string, b: string) => !!d && d >= a && d <= b;
export const nice = (s: string) => (s ? parseDay(s).toLocaleDateString("en-ZA", { day: "numeric", month: "short" }) : "");
export const monthName = (m: string) => parseDay(m + "-01").toLocaleDateString("en-ZA", { month: "long", year: "numeric" });
export const num = (v: unknown) => {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? ""));
  return isFinite(n) ? n : 0;
};
export const usd = (n: number) => (n < 0 ? "−$" : "$") + Math.abs(Math.round(n)).toLocaleString("en-US");
export const zar = (n: number) => (n < 0 ? "−R" : "R") + Math.abs(Math.round(n)).toLocaleString("en-US").replace(/,/g, " ");
export const pct = (n: number) => Math.round(n * 100) + "%";
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
export const logKey = (d: string, id: string) => `${d}|${id}`;

/** the monthly target in dollars, whichever currency it was set in */
export const targetUsd = (s: Settings) => (s.targetCur === "ZAR" ? num(s.target) / (num(s.fx) || 1) : num(s.target));

export const doneShare = (data: Ceo, d: string) => {
  const t = SCHEDULE[kindOf(d)];
  const c = data.days[d]?.c || {};
  return t.filter((x) => c[x[0]]).length / t.length;
};

/** earned by earned date, received by received date: the two are different on purpose */
export function periodStats(data: Ceo, from: string, to: string) {
  const earned = data.money.filter((x) => x.kind === "earned" && inRange(x.date, from, to));
  const exp = data.money.filter((x) => x.kind === "expense" && inRange(x.date, from, to));
  const rev = earned.reduce((s, x) => s + num(x.amount), 0);
  const received = data.money.filter((x) => x.kind === "earned" && inRange(x.receivedOn, from, to)).reduce((s, x) => s + num(x.amount), 0);
  const direct = exp.filter((x) => x.cost === "direct").reduce((s, x) => s + num(x.amount), 0);
  const opex = exp.filter((x) => x.cost !== "direct").reduce((s, x) => s + num(x.amount), 0);
  const by: Record<string, number> = {};
  earned.forEach((x) => {
    const k = (x.source || x.div || "Other").trim().toLowerCase();
    by[k] = (by[k] || 0) + num(x.amount);
  });
  const top = Math.max(0, ...Object.values(by));
  const tax = rev * num(data.settings.tax);
  return { rev, received, direct, opex, costs: direct + opex, gross: rev - direct, net: rev - direct - opex - tax, tax, share: rev ? top / rev : null };
}
export const monthStats = (data: Ceo, m: string) => periodStats(data, m + "-01", m + "-31");

/** earned but not yet in your account, and how much of it is older than 30 days */
export function unpaid(data: Ceo, today: string) {
  const open = data.money.filter((x) => x.kind === "earned" && !x.receivedOn);
  return { total: open.reduce((s, x) => s + num(x.amount), 0), old: open.filter((x) => x.date < addDays(today, -30)).reduce((s, x) => s + num(x.amount), 0), count: open.length };
}

export function ugcStats(data: Ceo, from: string, to: string, campaignId?: string) {
  let posted = 0, qual = 0, earned = 0;
  for (const c of data.campaigns) {
    if (campaignId && c.id !== campaignId) continue;
    for (let d = from; d <= to; d = addDays(d, 1)) {
      const l = data.logs[logKey(d, c.id)];
      if (!l) continue;
      posted += num(l.posted);
      qual += num(l.qual);
      earned += num(l.qual) * num(c.payPer);
    }
  }
  return { posted, qual, hit: posted ? qual / posted : null, earned };
}

export function funnel(data: Ceo, from: string, to: string) {
  const p = data.leads;
  const n = (k: "c" | "r" | "k" | "p" | "w") => p.filter((x) => inRange(x[k], from, to)).length;
  const emails = p.reduce((s, x) => s + x.touches.filter((t) => (t.kind === "Email" || t.kind === "Follow-up") && inRange(t.date, from, to)).length, 0);
  return { emailed: n("c"), emails, replied: n("r"), meetings: n("k"), proposals: n("p"), won: n("w") };
}

export const margin = (c: Client) => {
  const contribution = num(c.fee) - num(c.creatorCost) - num(c.editCost);
  return { contribution, pct: num(c.fee) ? contribution / num(c.fee) : null };
};

export type Alert = { level: "bad" | "warn"; text: string; href: string };
export function alerts(data: Ceo, today: string): Alert[] {
  const out: Alert[] = [];
  const s = data.settings, wk = addDays(today, -6), m = today.slice(0, 7);
  const due = data.leads.filter((x) => x.next && x.next <= today && x.stage !== "won" && x.stage !== "lost");
  if (due.length) out.push({ level: "warn", text: `${due.length} brand follow-up${due.length > 1 ? "s" : ""} due`, href: "/ugc/ceo/crm" });
  const late = data.tasks.filter((t) => !t.done && t.due && t.due < today);
  if (late.length) out.push({ level: "bad", text: `${late.length} overdue task${late.length > 1 ? "s" : ""}`, href: "/ugc/ceo/plan" });
  const ms = monthStats(data, m);
  if (ms.share != null && ms.share > 0.5) out.push({ level: "warn", text: `${pct(ms.share)} of this month's revenue comes from one source`, href: "/ugc/ceo/money" });
  const u = unpaid(data, today);
  if (u.old > 0) out.push({ level: "bad", text: `${usd(u.old)} earned over 30 days ago and not yet received`, href: "/ugc/ceo/money" });
  const us = ugcStats(data, wk, today);
  if (us.hit != null && us.hit < 0.5) out.push({ level: "warn", text: `Campaign hit rate ${pct(us.hit)} over 7 days (target 60%)`, href: "/ugc/ceo/ugc" });
  let hours = 0, off = false;
  for (let d = wk; d <= today; d = addDays(d, 1)) {
    hours += num(data.days[d]?.hours);
    if (data.days[d]?.c?.off) off = true;
  }
  if (hours > 35) out.push({ level: "bad", text: `${hours} hours in 7 days: above the 35-hour plan. Burnout risk`, href: "/ugc/ceo/review" });
  if (!off && dayN(today) > 7) out.push({ level: "warn", text: "No full day off in the last 7 days", href: "/ugc/ceo" });
  const soon = data.clients.filter((c) => c.status === "active" && c.deadline && c.deadline <= addDays(today, 3));
  if (soon.length) out.push({ level: soon.some((c) => c.deadline < today) ? "bad" : "warn", text: `${soon.length} client deadline${soon.length > 1 ? "s" : ""} within 3 days`, href: "/ugc/ceo/agency" });
  const noRights = data.clients.filter((c) => c.status === "active" && !c.rights);
  if (noRights.length) out.push({ level: "bad", text: `${noRights.length} active client${noRights.length > 1 ? "s" : ""} without usage rights and terms agreed`, href: "/ugc/ceo/agency" });
  const owed = data.creators.reduce((t, c) => t + num(c.owed), 0);
  if (owed > 0) out.push({ level: "warn", text: `${usd(owed)} owed to creators`, href: "/ugc/ceo/creators" });
  if (num(s.costs) > 0 && num(s.cash) / num(s.costs) < 3) out.push({ level: "bad", text: `Runway ${(num(s.cash) / num(s.costs)).toFixed(1)} months: under 3`, href: "/ugc/ceo/money" });
  return out;
}

// ---------------------------------------------------------------- the store

export const CEO_KEY = "dremedia-ceo-v2";
const EVENT = "dremedia-ceo";

export const INITIAL: Ceo = {
  v: 2,
  settings: { target: 6000, targetCur: "USD", fx: 16.5, tax: 0.3, costs: 0, emergency: 0, cash: 0, baseline: 0, wealthZar: 0, equityZar: 0, millionZar: 1000000, emailsPerDay: 25 },
  days: {},
  campaigns: [],
  logs: {},
  leads: [],
  clients: [],
  creators: [],
  money: [],
  tasks: [
    { id: "t0", title: "One hour: export payouts and bank/PayPal/Wise statements, total Sep, Oct and Nov (earned vs received)", div: "CEO", due: "2026-11-25", done: false, who: "Me" },
    { id: "t1", title: "Add your active campaign in UGC and log today's posted and qualified videos", div: "Own UGC", due: "2026-11-25", done: false, who: "Me" },
    { id: "t2", title: "Read campaign contracts and platform terms: non-circumvention, subcontracting, exclusivity", div: "CEO", due: "2026-11-28", done: false, who: "Me" },
    { id: "t3", title: "Write Dre Media's positioning and Offers A and B on the portfolio page", div: "Creative", due: "2026-12-01", done: false, who: "Me" },
    { id: "t4", title: "Research the first 100 brands already paying creators (AI drafts the list, you check it)", div: "Creative", due: "2026-12-04", done: false, who: "AI" },
    { id: "t5", title: "Recruit and test 5 creators from Discord and the community (2 paid videos each)", div: "Creative", due: "2026-12-08", done: false, who: "Me" },
  ],
  decisions: [],
  interviews: [],
  ideas: [],
  checks: {},
  divisions: {},
  lessons: {},
  reviews: {},
};

function read(): Ceo {
  try {
    const raw = JSON.parse(localStorage.getItem(CEO_KEY) || "null");
    if (!raw || typeof raw !== "object") return INITIAL;
    return { ...INITIAL, ...raw, settings: { ...INITIAL.settings, ...(raw.settings || {}) } };
  } catch {
    return INITIAL;
  }
}

/** The command-centre data: [data, update, ready]. `ready` is false until the browser copy has loaded. */
export function useCeo() {
  const [data, setData] = useState<Ceo>(INITIAL);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const sync = () => setData(read());
    sync();
    setReady(true);
    const onStorage = (e: StorageEvent) => e.key === CEO_KEY && sync();
    window.addEventListener("storage", onStorage);
    window.addEventListener(EVENT, sync);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(EVENT, sync);
    };
  }, []);
  const update = (fn: (d: Ceo) => Ceo) => {
    const next = fn(read());
    setData(next);
    try {
      localStorage.setItem(CEO_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(EVENT));
    } catch {
      /* private browsing: works for this visit only */
    }
  };
  return [data, update, ready] as const;
}

/** Replace everything with a backup file. Returns false if the file isn't a command-centre backup. */
export function restore(text: string): boolean {
  try {
    const raw = JSON.parse(text);
    if (!raw || raw.v !== 2 || !raw.settings) return false;
    localStorage.setItem(CEO_KEY, JSON.stringify({ ...INITIAL, ...raw }));
    window.dispatchEvent(new Event(EVENT));
    return true;
  } catch {
    return false;
  }
}

/** today's date, set after the page loads so the static build never bakes in a date */
export function useToday() {
  const [t, setT] = useState("");
  useEffect(() => setT(todayStr()), []);
  return t;
}
