// The data model for the whole dashboard, plus the sample data it starts with.
//
// Nothing here is read directly by the pages any more: everything goes through
// the store in lib/store.tsx, which keeps your edits in this browser. Change
// anything from the Settings page (or the "Edit everything" JSON box there).
// The sample numbers and names below are made up.

export type Platform = "tiktok" | "instagram" | "youtube" | "facebook";
export const PLATFORMS: Platform[] = ["tiktok", "instagram", "youtube", "facebook"];
export const platformName: Record<Platform, string> = { tiktok: "TikTok", instagram: "Instagram", youtube: "YouTube", facebook: "Facebook" };

export type Brand = {
  id: string;
  name: string;
  /** a path in /public/brands, an https link, or an uploaded image (data url). empty shows the first letter */
  logo: string;
  pay: string;
  perDay: number;
  avg: number;
  earned: number;
  status: "Active" | "Paused";
  needsAccounts: boolean;
  platforms: Platform[];
  /** what the brand is, in a few words. used by the Ideas bot */
  about: string;
  /** niche words to search, comma separated. used by the Ideas bot */
  niche: string;
  /** the brand's campaign server on Discord. used by the Ideas bot */
  discord: string;
};

export type Profile = {
  workspace: string;
  /** optional image for the sidebar mark. empty uses the grid "v" mark */
  logo: string;
  /** accent colour, hex */
  color: string;
  first: string;
  handle: string;
  initials: string;
  emailDomain: string;
  emailPrefix: string;
  timezone: string;
  footer: string;
};

export type DayMoney = { videos: number; earned: number };
export type Money = { year: number; month: number /* 0 = jan */; goal: number; projected: number; days: DayMoney[] };
export type Stats = { streak: number; viewsToday: string; postsToday: number };
export type NavItem = { label: string; hidden: boolean };

export type Creator = { name: string; views: string; videos: number; color: string; pic?: string };
export type IdeaVideo = {
  id: string;
  caption: string;
  creator: string;
  platform: Platform;
  views: string;
  outlier: string;
  src?: string;
  poster?: string;
  url?: string;
  brand?: string;
};
export type Batch = { id: string; brand: string; title: string; state: "draft" | "editing" | "review" | "approved"; editor?: string; done?: number; total?: number; turnaround?: string };
export type Post = { id: string; brand: string; date: string /* yyyy-mm-dd */; time: string; caption: string; state: "queued" | "posted" };
export type ReadyBatch = { brand: string; n: number };
export type Account = { id: string; brand: string; handle: string; platform: Platform; followers: string; views: string; likes: string; comments: string; engagement: string; scheduler: boolean };
export type Transcript = { id: string; title: string; creator: string; platform: Platform; text: string; url?: string };
export type EmailCode = { platform: string; ago: string; code: string; to: string };
export type StartingEmail = { address: string; note: string; created: string };
export type VariationRender = { id: string; brand: string; title: string; status: string; count: number };
export type WarmStep = { day: string; task: string };

/** an account the Accounts bot is warming up */
export type WarmAccount = {
  id: string;
  handle: string;
  platform: "tiktok" | "instagram";
  brand: string;
  niche: string;
  name: string;
  bio: string;
  link: string;
  days: number;
  last: string;
  stopped: boolean;
};

export type BotState = {
  vars: Record<string, string>;
  /** your own version of the prompt. empty uses the built-in one */
  template: string;
  /** the bot's latest update, pasted from its chat */
  update: string;
  updatedAt: string;
};
export type CustomBot = { id: string; name: string; routine: string; schedule: string; prompt: string; update: string; updatedAt: string };
export type Bots = { ideas: BotState; inbox: BotState; accounts: BotState; connector: BotState; custom: CustomBot[] };
export type BuiltInBot = Exclude<keyof Bots, "custom">;

export type Data = {
  version: 1;
  profile: Profile;
  money: Money;
  pastMonths: Money[];
  stats: Stats;
  nav: Record<string, NavItem>;
  brands: Brand[];
  creators: Creator[];
  ideaVideos: IdeaVideo[];
  saved: string[];
  filmed: string[];
  filmScript: string;
  batches: Batch[];
  posts: Post[];
  ready: ReadyBatch[];
  accounts: Account[];
  transcripts: Transcript[];
  emails: StartingEmail[];
  emailCodes: EmailCode[];
  renders: VariationRender[];
  warmPlan: WarmStep[];
  warmups: WarmAccount[];
  bots: Bots;
};

// ---------------------------------------------------------------- helpers

/**
 * Where the site lives. On GitHub Pages it's "/<repo name>" (set by the deploy
 * workflow); locally it's empty. Files in /public must be loaded through
 * asset() so they work in both places.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const asset = (src: string | undefined) => (src && BASE_PATH && src.startsWith("/") && !src.startsWith("//") && !src.startsWith(BASE_PATH + "/") ? BASE_PATH + src : src || "");

export const uid = (prefix = "") => prefix + Math.random().toString(36).slice(2, 9);

export const slug = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || uid("b");

/** yyyy-mm-dd in local time */
export const isoDay = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
/** 0 = monday */
export const firstWeekday = (year: number, month: number) => (new Date(year, month, 1).getDay() + 6) % 7;
export const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function emptyMonth(year: number, month: number, goal = 10000, projected = 12000): Money {
  return { year, month, goal, projected, days: Array.from({ length: daysInMonth(year, month) }, () => ({ videos: 0, earned: 0 })) };
}

export const blankBrand = (): Brand => ({
  id: "",
  name: "",
  logo: "",
  pay: "",
  perDay: 1,
  avg: 0,
  earned: 0,
  status: "Active",
  needsAccounts: false,
  platforms: ["tiktok"],
  about: "",
  niche: "",
  discord: "",
});

// ---------------------------------------------------------------- navigation

export type NavKey = { key: string; label: string; group: "top" | "create" | "tools" | "heading" };

/** every page and sidebar heading you can rename or hide in Settings */
export const NAV: NavKey[] = [
  { key: "/", label: "Dashboard", group: "top" },
  { key: "/campaigns", label: "Campaigns", group: "top" },
  { key: "/bots", label: "Bots", group: "top" },
  { key: "#workspace", label: "Workspace", group: "heading" },
  { key: "#create", label: "Create", group: "heading" },
  { key: "/ideation", label: "Ideation", group: "create" },
  { key: "/film", label: "Film", group: "create" },
  { key: "/editing", label: "Editing", group: "create" },
  { key: "/scheduler", label: "Scheduler", group: "create" },
  { key: "/variations", label: "Variations", group: "create" },
  { key: "#tools", label: "Tools", group: "heading" },
  { key: "/accounts", label: "Accounts", group: "tools" },
  { key: "/transcribe", label: "Transcribe", group: "tools" },
  { key: "/emails", label: "Emails", group: "tools" },
  { key: "/warm-up", label: "Warm-up", group: "tools" },
  { key: "/timer", label: "Timer", group: "tools" },
  { key: "/settings", label: "Settings", group: "top" },
];

const defaultNav = () => Object.fromEntries(NAV.map((n) => [n.key, { label: n.label, hidden: false }]));

// ---------------------------------------------------------------- bots

export const defaultBots = (): Bots => ({
  ideas: {
    vars: { time: "7am", scroll: "10", days: "14", outlier: "3", pick: "10" },
    template: "",
    update: "",
    updatedAt: "",
  },
  inbox: {
    vars: {
      apps: "Discord DMs and my campaign servers, Gmail, Instagram DMs",
      who: "my campaign managers, my editor, brands",
      every: "30 minutes",
      from: "9am",
      to: "9pm",
    },
    template: "",
    update: "",
    updatedAt: "",
  },
  accounts: {
    vars: { time: "12pm", minutes: "15", likes: "5", follows: "2", days: "7" },
    template: "",
    update: "",
    updatedAt: "",
  },
  connector: {
    vars: {
      bots: "Ideas, Inbox, Posting, Accounts",
      calendar: "Google Calendar",
      planner: "my content calendar in Notion",
      dashboards: "each brand's creator dashboard, my payouts page",
      morning: "8am",
      night: "8pm",
      ideas: "3",
    },
    template: "",
    update: "",
    updatedAt: "",
  },
  custom: [],
});

// ---------------------------------------------------------------- sample data

const sampleCalendar = [1, 2, 1, 0, 2, 4, 2, 9, 12, 8, 6, 7, 11, 9, 10, 6, 13, 3, 7, 9, 8, 12, 14, 5, 4, 15, 9, 11, 8, 6, 3];

/** posts are placed on the current week so the scheduler looks alive on first open */
function samplePosts(): Post[] {
  const now = new Date();
  const sunday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
  const day = (n: number) => isoDay(new Date(sunday.getFullYear(), sunday.getMonth(), sunday.getDate() + n));
  return [
    { id: "p1", brand: "liftoff", date: day(0), time: "9:00 am", caption: "pov: you finally learned to fly", state: "posted" },
    { id: "p2", brand: "turbo", date: day(0), time: "1:30 pm", caption: "my edits got 3x faster", state: "posted" },
    { id: "p3", brand: "candle", date: day(1), time: "10:15 am", caption: "the app that keeps me focused", state: "posted" },
    { id: "p4", brand: "liftoff", date: day(2), time: "9:00 am", caption: "lesson 1 vs lesson 10", state: "posted" },
    { id: "p5", brand: "composio", date: day(3), time: "12:00 pm", caption: "i automated my whole inbox", state: "posted" },
    { id: "p6", brand: "pumpfun", date: day(4), time: "6:00 pm", caption: "i launched a coin in 60 seconds", state: "posted" },
    { id: "p7", brand: "liftoff", date: day(5), time: "9:00 am", caption: "first solo flight", state: "queued" },
    { id: "p8", brand: "turbo", date: day(5), time: "3:00 pm", caption: "editing on my phone now", state: "queued" },
    { id: "p9", brand: "candle", date: day(6), time: "11:00 am", caption: "how i plan 30 videos in an hour", state: "queued" },
  ];
}

export function makeSample(): Data {
  return {
    version: 1,
    profile: {
      workspace: "Dremedia",
      logo: "",
      color: "#00BDAB",
      first: "Alex",
      handle: "@alexmakesugc",
      initials: "AL",
      emailDomain: "yourdomain.com",
      emailPrefix: "alex",
      timezone: "New York",
      footer: "sample numbers. change anything in Settings. parts marked \"look only\" are yours to hook up.",
    },
    money: {
      year: 2026,
      month: 9,
      goal: 10000,
      projected: 12000,
      days: sampleCalendar.map((videos, i) => ({ videos, earned: videos * 48 + ((i + 1) % 3) * 15 })),
    },
    pastMonths: [],
    stats: { streak: 19, viewsToday: "14K", postsToday: 3 },
    nav: defaultNav(),
    brands: [
      { ...blankBrand(), id: "liftoff", name: "Liftoff", logo: "/brands/liftoff.png", pay: "$25 / video", perDay: 3, avg: 61, earned: 4400, status: "Active", needsAccounts: true, platforms: ["tiktok", "youtube", "facebook", "instagram"] },
      { ...blankBrand(), id: "turbo", name: "Turbo", logo: "/brands/turbo.png", pay: "$25 / video", perDay: 3, avg: 44, earned: 2780, status: "Active", needsAccounts: true, platforms: ["instagram", "facebook"] },
      { ...blankBrand(), id: "candle", name: "Candle", logo: "/brands/candle.png", pay: "$20 / video", perDay: 2, avg: 28, earned: 1590, status: "Active", needsAccounts: false, platforms: ["instagram", "tiktok", "facebook"] },
      { ...blankBrand(), id: "pumpfun", name: "Pumpfun", logo: "/brands/pumpfun.png", pay: "$500 / mo + $1 / 1k", perDay: 2, avg: 36, earned: 1080, status: "Active", needsAccounts: false, platforms: ["instagram"] },
      { ...blankBrand(), id: "composio", name: "Composio", logo: "/brands/composio.png", pay: "$15 / video", perDay: 2, avg: 19, earned: 745, status: "Active", needsAccounts: false, platforms: ["instagram", "tiktok", "youtube"] },
      { ...blankBrand(), id: "ideogram", name: "Ideogram", logo: "/brands/ideogram.png", pay: "$25 / video", perDay: 0, avg: 22, earned: 286, status: "Paused", needsAccounts: false, platforms: ["instagram"] },
    ],
    creators: [
      { name: "mycherievy", views: "18.2M", videos: 37, color: "#F97316", pic: "/ideas/v1.jpg" },
      { name: "wendy.studying", views: "11.4M", videos: 30, color: "#0EA5E9", pic: "/ideas/v2.jpg" },
      { name: "bigspoonx19", views: "9.8M", videos: 23, color: "#A855F7", pic: "/ideas/v5.jpg" },
    ],
    // real ugc outliers (short silent loops in public/ideas)
    ideaVideos: [
      { id: "v1", caption: "how it feels after the call ends", creator: "mycherievy", platform: "instagram", views: "7.4M", outlier: "100x", src: "/ideas/v1.mp4", poster: "/ideas/v1.jpg" },
      { id: "v2", caption: "trying to get rejected from a university with a 100% acceptance rate", creator: "wendy.studying", platform: "tiktok", views: "4.6M", outlier: "62x", src: "/ideas/v2.mp4", poster: "/ideas/v2.jpg" },
      { id: "v3", caption: "pov: you finally mastered 3d websites", creator: "webloved", platform: "tiktok", views: "3.6M", outlier: "48x", src: "/ideas/v3.mp4", poster: "/ideas/v3.jpg" },
      { id: "v4", caption: "bro is living in 2099", creator: "jacob.scruggmp4", platform: "instagram", views: "3.5M", outlier: "31x", src: "/ideas/v4.mp4", poster: "/ideas/v4.jpg" },
      { id: "v5", caption: "facetiming and texting is getting dry for my long distance gf and me", creator: "bigspoonx19", platform: "instagram", views: "2.6M", outlier: "22x", src: "/ideas/v5.mp4", poster: "/ideas/v5.jpg" },
      { id: "v6", caption: "you don't need a part time job", creator: "tiasia.ugc", platform: "instagram", views: "1.8M", outlier: "14x", src: "/ideas/v6.mp4", poster: "/ideas/v6.jpg" },
    ],
    saved: ["v2"],
    filmed: [],
    filmScript: "hook: if you're still doing this by hand, stop.\n\nshow the problem in one line.\n\nshow the app doing it in 3 taps.\n\ncta: link's in my bio.",
    batches: [
      { id: "b1", brand: "turbo", title: "Turbo. nov 1", state: "draft" },
      { id: "b2", brand: "liftoff", title: "Liftoff. oct 30", state: "editing", editor: "Riley", done: 4, total: 10, turnaround: "due in 6h" },
      { id: "b3", brand: "candle", title: "Candle. oct 28", state: "review", editor: "Riley", done: 8, total: 8, turnaround: "7h 12m" },
      { id: "b4", brand: "liftoff", title: "Liftoff. oct 25", state: "approved", editor: "Casey", done: 12, total: 12, turnaround: "5h 14m" },
      { id: "b5", brand: "pumpfun", title: "Pumpfun. oct 22", state: "approved", editor: "Casey", done: 6, total: 6, turnaround: "9h 34m" },
    ],
    posts: samplePosts(),
    ready: [
      { brand: "liftoff", n: 10 },
      { brand: "candle", n: 8 },
    ],
    accounts: [
      { id: "a1", brand: "liftoff", handle: "@alexflies", platform: "tiktok", followers: "12.4K", views: "1.2M", likes: "88K", comments: "1.9K", engagement: "7.4%", scheduler: true },
      { id: "a2", brand: "liftoff", handle: "@alexflies", platform: "instagram", followers: "6.1K", views: "430K", likes: "31K", comments: "640", engagement: "7.3%", scheduler: true },
      { id: "a3", brand: "turbo", handle: "@alexedits", platform: "tiktok", followers: "3.3K", views: "210K", likes: "12K", comments: "310", engagement: "5.8%", scheduler: false },
      { id: "a4", brand: "candle", handle: "@alexfocus", platform: "instagram", followers: "2.8K", views: "160K", likes: "9.1K", comments: "220", engagement: "5.8%", scheduler: true },
      { id: "a5", brand: "pumpfun", handle: "@alexcoins", platform: "tiktok", followers: "1.9K", views: "98K", likes: "5.2K", comments: "140", engagement: "5.4%", scheduler: false },
      { id: "a6", brand: "composio", handle: "@alexbuilds", platform: "youtube", followers: "940", views: "51K", likes: "2.3K", comments: "60", engagement: "4.6%", scheduler: false },
    ],
    transcripts: [
      {
        id: "t1",
        title: "this is your sign to stop doing it manually",
        creator: "@sam.creates",
        platform: "tiktok",
        text: "Okay so if you're still doing this by hand, I need you to stop.\n\nI used to spend two hours every night on this. Two hours. Then I found this app and now it takes me about four minutes.\n\nHere's how it works. You open it, you tap this, and it just does the whole thing for you.\n\nHonestly the best part is you never have to think about it again. Link's in my bio if you want to try it.",
      },
      {
        id: "t2",
        title: "3 things i wish i knew before my first brand deal",
        creator: "@jordan.ugc",
        platform: "instagram",
        text: "Three things I wish someone told me before my first brand deal.\n\nOne. Your rate is not your follower count. Brands pay for the video, not your audience.\n\nTwo. Always ask how many revisions are included before you film anything.\n\nThree. Batch everything. Film ten videos in one sitting, not one a day.",
      },
    ],
    emails: [
      { address: "alex-6m7jrp@yourdomain.com", note: "Instagram. Liftoff", created: "2d ago" },
      { address: "alex-jasxuj@yourdomain.com", note: "TikTok. Turbo", created: "9d ago" },
      { address: "alex-i35x4k@yourdomain.com", note: "TikTok. Pumpfun", created: "13d ago" },
    ],
    emailCodes: [
      { platform: "Instagram", ago: "2m ago", code: "873410", to: "alex-6m7jrp@yourdomain.com" },
      { platform: "TikTok", ago: "1h ago", code: "321368", to: "alex-bnbipe@yourdomain.com" },
      { platform: "TikTok", ago: "3d ago", code: "314744", to: "alex-4p2hix@yourdomain.com" },
    ],
    renders: [
      { id: "r1", brand: "liftoff", title: "hook swap x5", status: "Ready", count: 5 },
      { id: "r2", brand: "turbo", title: "caption styles x3", status: "Ready", count: 3 },
      { id: "r3", brand: "candle", title: "music swap x4", status: "Rendering", count: 4 },
    ],
    warmPlan: [
      { day: "Day 1-2", task: "scroll your niche for 20 min. like 10 posts. no posting." },
      { day: "Day 3-4", task: "follow 10 creators in your niche. leave 5 real comments." },
      { day: "Day 5", task: "fill in the bio and profile picture. save 10 posts." },
      { day: "Day 6", task: "post your first video. keep scrolling the niche for 15 min." },
      { day: "Day 7+", task: "post daily. keep 10 min of niche scrolling before each post." },
    ],
    warmups: [
      { id: "w1", handle: "@yourname.study", platform: "tiktok", brand: "candle", niche: "study hacks, flashcards", name: "", bio: "", link: "", days: 2, last: "", stopped: false },
    ],
    bots: defaultBots(),
  };
}

/** your settings and bots, with every sample list emptied. used by "Start fresh" */
export function makeEmpty(keep: Data): Data {
  const now = new Date();
  return {
    ...makeSample(),
    profile: keep.profile,
    nav: keep.nav,
    bots: keep.bots,
    money: emptyMonth(now.getFullYear(), now.getMonth(), keep.money.goal, keep.money.projected),
    pastMonths: keep.pastMonths,
    stats: { streak: 0, viewsToday: "0", postsToday: 0 },
    brands: [],
    creators: [],
    ideaVideos: [],
    saved: [],
    filmed: [],
    batches: [],
    posts: [],
    ready: [],
    accounts: [],
    transcripts: [],
    emails: [],
    emailCodes: [],
    renders: [],
    warmups: [],
  };
}
