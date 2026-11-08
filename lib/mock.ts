// Sample data for the template. Every number and name here is made up.
// Swap each export for a real query (supabase, your own api, a sheet) when you
// wire a page up. The pages only read these shapes, so nothing else changes.

export type Platform = "tiktok" | "instagram" | "youtube" | "facebook";

export type Brand = {
  id: string;
  name: string;
  /** logo in /public/brands */
  logo: string;
  pay: string;
  perDay: number;
  avg: number;
  earned: number;
  status: "Active" | "Paused";
  needsAccounts: boolean;
  platforms: Platform[];
};

export const user = { first: "Alex", handle: "@alexmakesugc", initials: "AL" };

export const brands: Brand[] = [
  { id: "liftoff", name: "Liftoff", logo: "/brands/liftoff.png", pay: "$25 / video", perDay: 3, avg: 61, earned: 4400, status: "Active", needsAccounts: true, platforms: ["tiktok", "youtube", "facebook", "instagram"] },
  { id: "turbo", name: "Turbo", logo: "/brands/turbo.png", pay: "$25 / video", perDay: 3, avg: 44, earned: 2780, status: "Active", needsAccounts: true, platforms: ["instagram", "facebook"] },
  { id: "candle", name: "Candle", logo: "/brands/candle.png", pay: "$20 / video", perDay: 2, avg: 28, earned: 1590, status: "Active", needsAccounts: false, platforms: ["instagram", "tiktok", "facebook"] },
  { id: "pumpfun", name: "Pumpfun", logo: "/brands/pumpfun.png", pay: "$500 / mo + $1 / 1k", perDay: 2, avg: 36, earned: 1080, status: "Active", needsAccounts: false, platforms: ["instagram"] },
  { id: "composio", name: "Composio", logo: "/brands/composio.png", pay: "$15 / video", perDay: 2, avg: 19, earned: 745, status: "Active", needsAccounts: false, platforms: ["instagram", "tiktok", "youtube"] },
  { id: "ideogram", name: "Ideogram", logo: "/brands/ideogram.png", pay: "$25 / video", perDay: 0, avg: 22, earned: 286, status: "Paused", needsAccounts: false, platforms: ["instagram"] },
];

export const brandById = (id: string) => brands.find((b) => b.id === id) ?? brands[0];

/** money calendar for the month: [day, videos, dollars] */
export const month = { name: "October", goal: 10000, firstWeekday: 3 /* 0 = mon */, days: 31 };
export const calendar: { day: number; videos: number; earned: number }[] = Array.from({ length: 31 }, (_, i) => {
  const day = i + 1;
  const videos = day > 31 ? 0 : [1, 2, 1, 0, 2, 4, 2, 9, 12, 8, 6, 7, 11, 9, 10, 6, 13, 3, 7, 9, 8, 12, 14, 5, 4, 15, 9, 11, 8, 6, 3][i];
  return { day, videos, earned: videos * 48 + (day % 3) * 15 };
});

export const stats = { streak: 19, viewsToday: "14K", postsToday: 3 };

export type Creator = { name: string; views: string; videos: number; color: string; pic?: string };
export const creators: Creator[] = [
  { name: "mycherievy", views: "18.2M", videos: 37, color: "#F97316", pic: "/ideas/v1.jpg" },
  { name: "wendy.studying", views: "11.4M", videos: 30, color: "#0EA5E9", pic: "/ideas/v2.jpg" },
  { name: "bigspoonx19", views: "9.8M", videos: 23, color: "#A855F7", pic: "/ideas/v5.jpg" },
];

// real ugc outliers (short silent loops in public/ideas)
export type IdeaVideo = { id: string; caption: string; creator: string; platform: Platform; views: string; outlier: string; src: string; poster: string };
export const ideaVideos: IdeaVideo[] = [
  { id: "v1", caption: "how it feels after the call ends", creator: "mycherievy", platform: "instagram", views: "7.4M", outlier: "100x", src: "/ideas/v1.mp4", poster: "/ideas/v1.jpg" },
  { id: "v2", caption: "trying to get rejected from a university with a 100% acceptance rate", creator: "wendy.studying", platform: "tiktok", views: "4.6M", outlier: "62x", src: "/ideas/v2.mp4", poster: "/ideas/v2.jpg" },
  { id: "v3", caption: "pov: you finally mastered 3d websites", creator: "webloved", platform: "tiktok", views: "3.6M", outlier: "48x", src: "/ideas/v3.mp4", poster: "/ideas/v3.jpg" },
  { id: "v4", caption: "bro is living in 2099", creator: "jacob.scruggmp4", platform: "instagram", views: "3.5M", outlier: "31x", src: "/ideas/v4.mp4", poster: "/ideas/v4.jpg" },
  { id: "v5", caption: "facetiming and texting is getting dry for my long distance gf and me", creator: "bigspoonx19", platform: "instagram", views: "2.6M", outlier: "22x", src: "/ideas/v5.mp4", poster: "/ideas/v5.jpg" },
  { id: "v6", caption: "you don't need a part time job", creator: "tiasia.ugc", platform: "instagram", views: "1.8M", outlier: "14x", src: "/ideas/v6.mp4", poster: "/ideas/v6.jpg" },
];

export type Batch = { id: string; brand: string; title: string; state: "draft" | "editing" | "review" | "approved"; editor?: string; done?: number; total?: number; turnaround?: string };
export const batches: Batch[] = [
  { id: "b1", brand: "turbo", title: "Turbo. nov 1", state: "draft" },
  { id: "b2", brand: "liftoff", title: "Liftoff. oct 30", state: "editing", editor: "Riley", done: 4, total: 10, turnaround: "due in 6h" },
  { id: "b3", brand: "candle", title: "Candle. oct 28", state: "review", editor: "Riley", done: 8, total: 8, turnaround: "7h 12m" },
  { id: "b4", brand: "liftoff", title: "Liftoff. oct 25", state: "approved", editor: "Casey", done: 12, total: 12, turnaround: "5h 14m" },
  { id: "b5", brand: "pumpfun", title: "Pumpfun. oct 22", state: "approved", editor: "Casey", done: 6, total: 6, turnaround: "9h 34m" },
];

export type Post = { id: string; brand: string; day: number; time: string; caption: string; state: "queued" | "posted" };
export const weekDays = ["Sun 26", "Mon 27", "Tue 28", "Wed 29", "Thu 30", "Fri 31", "Sat 1"];
export const posts: Post[] = [
  { id: "p1", brand: "liftoff", day: 0, time: "9:00 am", caption: "pov: you finally learned to fly", state: "posted" },
  { id: "p2", brand: "turbo", day: 0, time: "1:30 pm", caption: "my edits got 3x faster", state: "posted" },
  { id: "p3", brand: "candle", day: 1, time: "10:15 am", caption: "the app that keeps me focused", state: "posted" },
  { id: "p4", brand: "liftoff", day: 2, time: "9:00 am", caption: "lesson 1 vs lesson 10", state: "posted" },
  { id: "p5", brand: "composio", day: 3, time: "12:00 pm", caption: "i automated my whole inbox", state: "posted" },
  { id: "p6", brand: "pumpfun", day: 4, time: "6:00 pm", caption: "i launched a coin in 60 seconds", state: "posted" },
  { id: "p7", brand: "liftoff", day: 5, time: "9:00 am", caption: "first solo flight", state: "queued" },
  { id: "p8", brand: "turbo", day: 5, time: "3:00 pm", caption: "editing on my phone now", state: "queued" },
  { id: "p9", brand: "candle", day: 6, time: "11:00 am", caption: "how i plan 30 videos in an hour", state: "queued" },
];

export type Account = { id: string; brand: string; handle: string; platform: Platform; followers: string; views: string; likes: string; comments: string; engagement: string; scheduler: boolean };
export const accounts: Account[] = [
  { id: "a1", brand: "liftoff", handle: "@alexflies", platform: "tiktok", followers: "12.4K", views: "1.2M", likes: "88K", comments: "1.9K", engagement: "7.4%", scheduler: true },
  { id: "a2", brand: "liftoff", handle: "@alexflies", platform: "instagram", followers: "6.1K", views: "430K", likes: "31K", comments: "640", engagement: "7.3%", scheduler: true },
  { id: "a3", brand: "turbo", handle: "@alexedits", platform: "tiktok", followers: "3.3K", views: "210K", likes: "12K", comments: "310", engagement: "5.8%", scheduler: false },
  { id: "a4", brand: "candle", handle: "@alexfocus", platform: "instagram", followers: "2.8K", views: "160K", likes: "9.1K", comments: "220", engagement: "5.8%", scheduler: true },
  { id: "a5", brand: "pumpfun", handle: "@alexcoins", platform: "tiktok", followers: "1.9K", views: "98K", likes: "5.2K", comments: "140", engagement: "5.4%", scheduler: false },
  { id: "a6", brand: "composio", handle: "@alexbuilds", platform: "youtube", followers: "940", views: "51K", likes: "2.3K", comments: "60", engagement: "4.6%", scheduler: false },
];

export const transcripts = [
  {
    id: "t1",
    title: "this is your sign to stop doing it manually",
    creator: "@sam.creates",
    platform: "tiktok" as Platform,
    text:
      "Okay so if you're still doing this by hand, I need you to stop.\n\nI used to spend two hours every night on this. Two hours. Then I found this app and now it takes me about four minutes.\n\nHere's how it works. You open it, you tap this, and it just does the whole thing for you.\n\nHonestly the best part is you never have to think about it again. Link's in my bio if you want to try it.",
  },
  {
    id: "t2",
    title: "3 things i wish i knew before my first brand deal",
    creator: "@jordan.ugc",
    platform: "instagram" as Platform,
    text:
      "Three things I wish someone told me before my first brand deal.\n\nOne. Your rate is not your follower count. Brands pay for the video, not your audience.\n\nTwo. Always ask how many revisions are included before you film anything.\n\nThree. Batch everything. Film ten videos in one sitting, not one a day.",
  },
];

export const emailCodes = [
  { platform: "Instagram", ago: "2m ago", code: "873410", to: "alex-6m7jrp@yourdomain.com" },
  { platform: "TikTok", ago: "1h ago", code: "321368", to: "alex-bnbipe@yourdomain.com" },
  { platform: "TikTok", ago: "3d ago", code: "314744", to: "alex-4p2hix@yourdomain.com" },
];

export const startingEmails = [
  { address: "alex-6m7jrp@yourdomain.com", note: "Instagram. Liftoff", created: "2d ago" },
  { address: "alex-jasxuj@yourdomain.com", note: "TikTok. Turbo", created: "9d ago" },
  { address: "alex-i35x4k@yourdomain.com", note: "TikTok. Pumpfun", created: "13d ago" },
];

export const variationRenders = [
  { id: "r1", brand: "liftoff", title: "hook swap x5", status: "Ready", count: 5 },
  { id: "r2", brand: "turbo", title: "caption styles x3", status: "Ready", count: 3 },
  { id: "r3", brand: "candle", title: "music swap x4", status: "Rendering", count: 4 },
];
