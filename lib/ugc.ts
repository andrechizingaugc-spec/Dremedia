// The Dremedia UGC library: viral short-form UGC videos and trend analytics,
// copied from DarkUGC (darkugc.com) on Nov 10, 2026. Views are as DarkUGC last
// recorded them. Refresh this file to update the site (see README).

import { LIBRARY } from "./dare";

export const SNAPSHOT_DATE = "2026-11-10";

/** "1.6M" -> 1600000 */
export function n(s: string | number): number {
  if (typeof s === "number") return s;
  const m = s.replace(/,/g, "").match(/([\d.]+)\s*([KMB])?/i);
  if (!m) return 0;
  return Math.round(parseFloat(m[1]) * ({ K: 1e3, M: 1e6, B: 1e9 }[(m[2] || "").toUpperCase() as "K" | "M" | "B"] ?? 1));
}

export type Detail = {
  summary: string;
  hookType: string;
  techniques: string[];
  scenes: string[];
  why: string;
  template: string;
  pain: string;
  benefit: string;
  pace: string;
  voice: string;
  music: string;
  ranks: { scope: string; rank: number; of: number }[];
  creatorTypical: string;
  followers: string;
  perDayAvg: string;
  perDayLately: string;
  remix: string[];
};

export type UgcVideo = {
  id: string;
  platform: "TikTok" | "Instagram";
  brand: string;
  creator: string;
  views: number;
  likes: number;
  er: number;
  posted: string;
  format: string;
  category: string;
  hook: string;
  dur: number;
  /** the campaign format (Bounty id) to film it as */
  copyAs?: string;
  detail?: Detail;
};

type Row = [id: string, brand: string, creator: string, views: string, likes: string, er: number, posted: string, format: string, category: string, hook: string, dur?: number, copyAs?: string];

// campaign format ids (see lib/dare.ts)
const F = {
  reaction: "3LiThdONgd3Xfxg0whJAV480n0V",
  thousand: "3LiTJTApU7IeDfqz1iSdqu3KuOO",
  speedrun: "3IkI5LsWMRQlBm18DIn7tqXs77u",
  bmw: "3LiSOOf6cMQxcAuou9lFJCmVUJe",
  porsche: "3JQbDnoWNNCCTH6NsQRk2cMiz21",
  ifHad: "3JVu1aVFA4pRfup0C4zTMddVPZH",
  marry: "3K9twrlq7tDwnqGx7A6OsGcf3mb",
  deleting: "3LiSvEdklCWFRqspx6qHKd4qpRN",
  yapping: "3IT7Zn0BVo7CntQMzf3Hj24s8GG",
  claude: "3J17698hAY546xIuHd88D75n7KR",
  colouring: "3JnPehFTBvPa2NWS23lz31FuYaD",
  coldCall: "3JQaG0E8QltxKxMEld0P9EYRz6n",
  maps: "3J7AaGReMEMEMHAc39dmcC7TRIZ",
  tier: "3LiT9Ld1NXEkc0ceEOIByhV5j8R",
  course: "3JnRJdsslDQGmOE9HUZTTWUfzFn",
  gta: "3JVsuk3CE0Veo6vBIqh1FTbCjEX",
  astra: "3J750ItQJfeBUEft8WyIVYpKETN",
};

// Every video was checked to play as an embed on Nov 10. Left out because they don't
// play inside other sites (removed, or the creator turned embedding off):
// tt-7652877383795625247, tt-7654402510861405453, tt-7676089691975732502, tt-7686531408206056717, ig-DfS3bz2J7_t, ig-DdFKV7oSmQY
const ROWS: Row[] = [
  // ---- going viral this week
  ["ig-Dfa_L-WJ_HI", "Alarmy", "ailenmornings", "1.6M", "63K", 4, "2026-11-07", "App challenge struggle", "health-fitness", "WTH is my boyfriend's alarm", 62],
  ["ig-DfYT3wZRrP8", "Alarmy", "ailenmornings", "1.4M", "97K", 6.8, "2026-11-06", "App challenge struggle", "health-fitness", "WHAT is my boyfriend's alarm", 45],
  ["ig-Dfc-9e7I_g9", "PushClock", "autumn.pushclock", "983K", "7.8K", 0.8, "2026-11-07", "App challenge struggle", "health-fitness", "My bf changed my alarm so now I have to do THIS", 16],
  ["ig-Dfdjg0btnjC", "RecentFollow", "maggie.girltea", "879K", "22K", 2.6, "2026-11-08", "Text + cooking & chores", "social", "Having to force yourself to stop liking the only guy you didn't have to force yourself to like", 7],
  ["ig-DfQlYgrxlvr", "PushClock", "autumn.pushclock", "478K", "3.7K", 0.8, "2026-11-03", "App challenge struggle", "health-fitness", "Send this to a heavy sleeper", 14],
  ["ig-DfYipP6BoJV", "Cantina", "cartermcbride0", "446K", "28K", 6.4, "2026-11-06", "Acted sketch", "creative-tools", "What my little cousins do when they see me instead of saying hello", 10],
  ["tt-7704804246125890847", "TouchTunes", "tifffhunter", "425K", "6.5K", 1.6, "2026-11-05", "Dance, lip-sync & pose", "entertainment", "$10 in the TouchTunes is always worth it", 33],
  ["ig-DfY_N9vxe0G", "Suno", "oliviainthekitchen_", "408K", "4.9K", 1.2, "2026-11-06", "Text-message song", "creative-tools", "POV your new church group turns out to be a CULT", 61],
  ["tt-7703747828882885901", "Summary AI", "kathrine.works", "405K", "22K", 5.8, "2026-11-03", "Acted sketch", "productivity", "Sending the summary transcript to a lawyer for sure", 38],
  ["tt-7704482268085046558", "Closure", "haileyshealing", "321K", "61K", 19.2, "2026-11-05", "Text + daily moment", "health-fitness", "How long does it take your nervous system to heal after you go no contact?", 0],
  ["tt-7705740820720160022", "EQUALS", "ilovemusicandfun5", "318K", "2.5K", 0.8, "2026-11-08", "Dance, lip-sync & pose", "social", "When he asks for my Insta instead of my Equals", 0],
  // ---- this month
  ["ig-Dec88-WS8n_", "Astra AI", "ivy_learns", "41M", "1.6M", 4, "2026-10-13", "Screen demo", "education", "All medical students, ATTENTION", 26],
  ["ig-DeXpzHhuiSe", "Cantina", "aicreatormaddy", "7.7M", "302K", 3.9, "2026-10-11", "Reacts to the app", "creative-tools", "\"I GOTTA GO\"", 27],
  ["ig-DefwT7iPWZ-", "Alarmy", "ailenmornings", "7.7M", "523K", 6.9, "2026-10-15", "App challenge struggle", "health-fitness", "WTH is my boyfriend's alarm", 50],
  ["tt-7695383090243390727", "Kapi Cam", "irisday01", "6.9M", "38K", 0.6, "2026-10-11", "Montage", "creative-tools", "Konnichiwa (Kapi Cam photo montage)", 21],
  ["ig-DedE-aeuIWB", "Alarmy", "ailenmornings", "5.9M", "408K", 6.9, "2026-10-14", "App challenge struggle", "health-fitness", "Please, please, please.", 43],
  ["ig-DedzSAMET7j", "Focustown", "studyingwkristen", "5.9M", "171K", 2.9, "2026-10-14", "Explainer + screen", "productivity", "If you have an exam coming up that you have to study for, just pick a random flight.", 46],
  ["ig-DeX1ofwuO57", "NursifyAI", "kyleenursingstudent", "4.6M", "465K", 10.2, "2026-10-11", "Dance, lip-sync & pose", "education", "I swear I know all the other stuff", 0],
  ["tt-7698412054129970454", "Peekie", "investigatewithmia", "4.1M", "59K", 1.7, "2026-10-19", "Reacts to the app", "entertainment", "My gf's new obsession is a game where you stalk a guy's phone", 18],
  ["tt-7696006452212665622", "Replit", "kai.clm444", "3.7M", "397K", 12.5, "2026-10-13", "Reacts to the app", "developer-tools", "My sister is actually nuts, why is this her wedding invitation", 25],
  ["ig-Der5UrozwcW", "radcam", "jay.radcam", "3.6M", "113K", 3.1, "2026-10-19", "Screen demo", "creative-tools", "Don't tell your friends about this camera app", 15],
  ["tt-7695580335483981087", "Higgsfield", "theraguler", "2.9M", "787K", 33.4, "2026-10-12", "Dance, lip-sync & pose", "creative-tools", "Ts is having a stroke bro", 30],
  ["ig-De2eoeHhkaK", "Suno", "oliviainthekitchen_", "2.8M", "26K", 1, "2026-10-23", "Text-message song", "creative-tools", "I see both sides but the texts are still wild", 38],
  ["ig-Dea8jkGAkok", "Focustown", "studyingwkristen", "2.7M", "67K", 2.4, "2026-10-13", "Explainer + screen", "productivity", "Try this out if you have a test to study for!", 36],
  ["ig-De1P68AvppG", "Suno", "jadablue999", "2.6M", "34K", 1.3, "2026-10-23", "Text-message song", "creative-tools", "This is standard practice so idk if I can defend her but the text was wild", 41],
  ["tt-7695801498768330006", "Peekie", "investigatewithmia", "2.5M", "31K", 1.3, "2026-10-12", "Screen demo", "entertainment", "True crime girls you're gonna love this", 19],
  ["ig-DeY6Al7x2wl", "Tenmin", "study.with.wallakpu", "2.5M", "217K", 8.7, "2026-10-12", "App talks back", "education", "How do you say ice cream in Chinese?", 49],
  ["ig-DewiJ6kNZaq", "ReciBites", "sayantika.cooks", "2.4M", "12K", 0.5, "2026-10-21", "Screen demo", "food-drink", "WHEN DID THIS COME OUT?!", 18],
  ["tt-7699143069198847246", "Suno", "mimi.jams", "2.4M", "219K", 10.2, "2026-10-21", "Text-message song", "creative-tools", "This class mom is crazy!", 44],
  ["tt-7698651560292732182", "RecentFollow", "kia.girlhacks", "2.4M", "250K", 11, "2026-10-20", "Text + daily moment", "social", "Really pissed off a man last night at the bar", 0],
  ["ig-DeksB4KKOIx", "Closure", "elliee.clo", "1.3M", "130K", 10.2, "2026-10-16", "Text story → screen proof", "health-fitness", "guys I can confirm the October theory is 100% real", 0],
  // ---- biggest of the year
  ["tt-7634506571065740566", "EQUALS", "jerrylovesmusic", "70M", "1.4M", 2.1, "2026-04-30", "Text + daily moment", "social", "Wdym someone made an app combining IG and Spotify", 9],
  ["ig-DYpDsrKxYbn", "Cantina", "aicreatormaddy", "70M", "3.3M", 4.9, "2026-05-22", "AI message reaction", "creative-tools", "What do I even do?", 20],
  ["tt-7652221887036149022", "Retro", "paiige.memories", "59M", "713K", 1.6, "2026-06-17", "Reacts to the app", "social", "You NEED to see this", 22],
  ["ig-DX21bVJsJyV", "Natural Write", "studywitharyana", "58M", "825K", 1.4, "2026-05-03", "Reacts to the app", "productivity", "Bro... professors are evolving...", 8],
  ["tt-7627173579687300374", "BeautyCam", "kiaraleigh._", "58M", "793K", 1.6, "2026-04-10", "Screen demo", "creative-tools", "Girls you need this camera app!!!", 17],
  ["tt-7631353205917551894", "EQUALS", "diegoluvsmusic", "56M", "970K", 1.8, "2026-04-21", "Reacts to the app", "social", "Why do they do this", 8],
  ["tt-7654568537519869197", "Kalshi", "jonerfatcat", "55M", "159K", 0.3, "2026-06-23", "Explainer + screen", "finance", "Ronaldo's funeral happens today? Or does he finally score?", 42],
  ["tt-7692520314470731038", "Kalshi", "amir8nouri", "53M", "159K", 0.3, "2026-10-03", "Explainer + screen", "finance", "Subway, Target, Jersey Mike's, Papa Gino's?", 19],
  ["ig-DXer4lUEzcz", "Parakeet AI", "careerwithrithi", "52M", "595K", 1.1, "2026-04-23", "Secret AI helper", "productivity", "AI job interview is crazy", 0],
  ["tt-7628018302043950343", "EQUALS", "itspeachtime_", "52M", "974K", 2, "2026-04-12", "Dance, lip-sync & pose", "social", "Your phone is dry because you haven't downloaded Equals", 13],
  ["tt-7631664107971824918", "EQUALS", "mysteriusmusiclover", "47M", "1.2M", 2.7, "2026-04-22", "Text + daily moment", "social", "With my Equals bestie", 6],
  ["tt-7620877520291826977", "EQUALS", "vibewithcintia", "43M", "443K", 1.1, "2026-03-24", "Text + daily moment", "social", "Best app to meet new people", 5],
  ["tt-7648786304137743623", "Retro", "bs.memories", "42M", "384K", 1.3, "2026-06-07", "Explainer + screen", "social", "Anyone ready for summer yet?", 27],
  ["tt-7605393487021853965", "Summary AI", "girlatworkk", "40M", "735K", 1.9, "2026-02-11", "Acted sketch", "productivity", "pov: work-life balance", 19],
  ["tt-7636545088935562526", "status", "juni.yoyo", "39M", "438K", 1.2, "2026-05-05", "Dance, lip-sync & pose", "entertainment", "LOL app is called Status btw", 10],
  ["ig-DdmzsXziRAi", "Alarmy", "wakeupcallie", "34M", "2M", 5.9, "2026-09-22", "App challenge struggle", "health-fitness", "WHAT is my Husband's alarm", 31],
  ["tt-7690142460353301773", "Kapi Cam", "maioney5", "32M", "1.1M", 3.6, "2026-09-27", "Screen demo", "creative-tools", "low quality photos are always the best", 16],
  ["tt-7689259792774352142", "Kalshi", "itsbrandotv_", "30M", "60K", 0.2, "2026-09-25", "Explainer + screen", "finance", "Green Bay Packers versus the Falcons.", 0],
  ["tt-7673958134955642144", "Wizz", "travellifewithluna", "19M", "323K", 1.7, "2026-08-14", "Dance, lip-sync & pose", "social", "Flirty friendship never hurt anyone", 0],
  ["tt-7689439027698715918", "Kapi Cam", "maioney5", "14M", "181K", 1.4, "2026-09-25", "Input → AI result", "creative-tools", "Before / After", 11],
  ["tt-7681866992361508110", "Suno", "adrii.jamz", "11M", "644K", 6.6, "2026-09-05", "Text-message song", "creative-tools", "Just wait till you hear my husband's response to this", 79],
  ["tt-7676513776748842272", "Suno", "dani.evans8", "9.9M", "421K", 4.4, "2026-08-21", "Text-message song", "creative-tools", "I'll turn the crazy texts into songs", 41],
  ["tt-7674992698679364877", "Hello Nancy", "girltalkwithmadds", "8.5M", "519K", 6.4, "2026-08-17", "Text + daily moment", "health-fitness", "Bringing the fruits into our marriage was such a good idea", 7],
  ["tt-7676324506633391373", "Cupie", "couplecallswithju", "8.3M", "991K", 11.9, "2026-08-21", "Text + get ready", "relationships", "hot take: long distance isn't the problem. having the exact same call every night is", 0],
  ["tt-7691536981939014943", "Cantina", "shellyyy0707", "7.8M", "844K", 13, "2026-10-01", "Reacts to the app", "creative-tools", "wtf is THAT", 10],
  ["tt-7677195826837327124", "Kapi Cam", "soujiinnn", "6.9M", "73K", 1.2, "2026-08-23", "Screen demo", "creative-tools", "New camera app to try", 17],
  ["tt-7690929617070263573", "Kapi Cam", "siimipie", "6.6M", "502K", 8.2, "2026-09-29", "Screen demo", "creative-tools", "App name: kapicam", 19],
  ["tt-7685037655188327711", "Cantina", "techwithliv7", "6.5M", "681K", 15.8, "2026-09-13", "Acted sketch", "creative-tools", "Why did his hand never move", 19],
  // ---- relationships, fitness, productivity (the niches closest to Andre's campaigns)
  ["tt-7683908557669960981", "Tethered", "sevi.ldr", "4.6M", "975K", 31.1, "2026-09-10", "Lock screen reveal", "relationships", "Lowkey just craving a BIG hug from my baby right now", 20],
  ["tt-7677347847687130382", "Lovora", "love_with_aria", "4.1M", "187K", 6, "2026-08-23", "Lock screen reveal", "relationships", "POV: You're in a long distance relationship", 12],
  ["tt-7682125908718652694", "Lovora", "lovewithhenry", "4.1M", "290K", 8.8, "2026-09-05", "Lock screen reveal", "relationships", "Pov: you reached a flow state but forgot ur gf", 14],
  ["tt-7675960632419601695", "Tethered", "bella.longdistance", "3.7M", "619K", 22.3, "2026-08-20", "Lock screen reveal", "relationships", "\"You okay?\" No. I miss my bf.", 11],
  ["tt-7674042462184279309", "Hunch", "kylies.dating", "2.9M", "4K", 0.1, "2026-08-15", "Text + daily moment", "relationships", "And that's the truth of dating apps now", 0],
  ["ig-DchfDqVvGYD", "Wayk", "alexism.wakeup", "4.5M", "82K", 1.8, "2026-08-27", "App challenge struggle", "health-fitness", "My mornings just got worse", 16],
  ["tt-7692866211423472910", "Stompers", "jocelynwalking", "4.2M", "342K", 12.3, "2026-10-04", "Text story → screen proof", "health-fitness", "I'm way too competitive for this", 10],
  ["ig-DcjTPInpa60", "Stompers", "walkingwithkat", "3.6M", "88K", 2.5, "2026-08-27", "Text story → screen proof", "health-fitness", "No bc I'm checking Stompers every 10 min now", 9],
  ["ig-Db95HPBCSWi", "Focustown", "allie.studycorner", "4.7M", "314K", 6.7, "2026-08-13", "Explainer + screen", "productivity", "If you don't feel like reading, start by picking a random flight.", 47],
  ["tt-7685188590225378580", "Minutes AI", "malerie.frances", "4.4M", "168K", 3.8, "2026-09-14", "Explainer + screen", "productivity", "Managers, what do we think of this?", 0],
  ["tt-7675561907138383135", "Poke", "hkproductive", "3.3M", "621K", 18.6, "2026-08-19", "Tips & lessons", "productivity", "Phrases to calm a man down during an argument", 0],
  ["ig-DcEokHDRxbU", "Natural Write", "ay_.studies", "3.1M", "171K", 5.5, "2026-08-15", "Problem → app answer", "productivity", "POV: you have an essay to submit in 5 mins", 40],
  ["ig-DcuCrIRxSOk", "Forfeit", "susiequetie49", "2.4M", "84K", 3.6, "2026-08-31", "Explainer + screen", "productivity", "Swear I've never woken up this consistently until Forfeit", 21],
  // ---- AI money-making apps: the videos the campaign formats copy
  ["ig-DeiGVtUhKKm", "Krea AI", "sarahreal.ai", "4M", "118K", 3.1, "2026-10-15", "Explainer + screen", "creative-tools", "Watch this. (reacts to a viral AI short, then shows how)", 0, F.reaction],
  ["ig-DbEgH7sBVbK", "Viewmax", "robsmethods", "2.2M", "41K", 3.3, "2026-07-21", "Reacts to the app", "creative-tools", "Can someone tell me why they never teach this in school?", 0, F.reaction],
  ["tt-7667726002885250318", "Viewmax", "stacy.game.s", "1.1M", "49K", 4.4, "2026-07-28", "Reacts to the app", "creative-tools", "What!? This is generational advice", 0, F.reaction],
  ["tt-7664485023390731533", "Viewmax", "its_nephy9", "1M", "58K", 6.1, "2026-07-20", "Reacts to the app", "creative-tools", "Like why isn't this taught in schools?", 0, F.reaction],
  ["tt-7669262048466947335", "Viewmax", "jennycreatescontent", "699K", "20K", 3.1, "2026-08-02", "Reacts to the app", "creative-tools", "20 minutes a day and posting consistently is all you need", 0, F.reaction],
  ["tt-7671815142773951757", "Viewmax", "michelle26_mp4", "616K", "19K", 3.7, "2026-08-09", "Reacts to the app", "creative-tools", "What??", 0, F.reaction],
  ["ig-DbimRXNyaSu", "Krea AI", "tonskiuses.krea", "268K", "8.5K", 4.9, "2026-08-02", "Explainer + screen", "creative-tools", "Why don't they teach this??", 0, F.reaction],
  ["ig-DaRM2_7CiNa", "Composio", "mubs.io", "6.8M", "277K", 4.1, "2026-07-01", "Explainer + screen", "developer-tools", "Is it possible to become a millionaire by begging millionaires for $1?", 0, F.thousand],
  ["tt-7681110285658213652", "Composio", "alessio.hackss", "4.4M", "218K", 5, "2026-09-03", "Storytime & rant", "developer-tools", "I emailed over 5 million people and asked them each for $1", 0, F.thousand],
  ["tt-7531053771871292727", "Lovable", "noah.lousiana", "2.9M", "117K", 5.1, "2025-07-25", "Explainer + screen", "developer-tools", "I could code Call of Duty in 60 seconds with AI", 30, F.speedrun],
  ["tt-7681522595824422165", "Composio", "alessio.hackss", "2.8M", "175K", 6.2, "2026-09-04", "Storytime & rant", "developer-tools", "I emailed over 10 million people and asked them each for $1", 0, F.thousand],
  ["tt-7679452206931741972", "Composio", "alessio.hackss", "1.7M", "74K", 4.3, "2026-08-29", "Explainer + screen", "developer-tools", "Why would you get a job when you can just ask every millionaire for a dollar?", 0, F.thousand],
  ["ig-DSLtgSBChjd", "Viewmax", "joellmp4", "597K", "25K", 4.7, "2025-12-13", "Explainer + screen", "creative-tools", "Day 2 of testing unethical ways to make money online", 0, F.thousand],
  ["ig-DbGJMKPgOTB", "OpenArt", "stee.ugc", "1.1M", "25K", 2.5, "2026-07-22", "Explainer + screen", "creative-tools", "If I lost everything and had 28 days to get a BMW M4, this is exactly what I'd do", 0, F.bmw],
  ["ig-DbHOqJlPhH3", "OpenArt", "stee.ugc", "607K", "7K", 1.4, "2026-07-22", "Explainer + screen", "creative-tools", "How to get a Porsche 911 in 28 days", 0, F.porsche],
  ["ig-Da__imCMKcJ", "OpenArt", "stee.ugc", "235K", "7K", 3.1, "2026-07-20", "Explainer + screen", "creative-tools", "Laziest way to get a BMW M4", 0, F.ifHad],
  ["tt-7540348249459297558", "Faircado", "thea.faircad0thrifts", "6.8M", "420K", 6.2, "2025-08-19", "Text story → screen proof", "shopping", "I could KISS the Vinted employee that showed me this hack", 0, F.marry],
  ["ig-DdTK3nbRYxH", "Jobsuit", "amit.bhatiaaa", "2M", "40K", 2, "2026-09-15", "Reacts to the app", "business", "Girl, I'm sorry, but this girl deleted her video", 0, F.deleting],
  ["ig-DbKZS_ViycF", "Creao AI", "ashleyautomatesit", "537K", "17K", 4.1, "2026-07-24", "Screen demo", "creative-tools", "The Pinterest girlies are gatekeeping this side hustle", 0, F.deleting],
  ["ig-Da9dDfqC3a2", "Creao AI", "ashleyautomatesit", "3.4M", "104K", 3.4, "2026-07-19", "Screen demo", "creative-tools", "\"My 9-5 is enough, I don't need a side income\"", 0, F.yapping],
  ["ig-DZQq5b8y5-X", "Creao AI", "ashleyautomatesit", "2.7M", "59K", 2.6, "2026-06-06", "Screen demo", "creative-tools", "World Cup + YouTube Shorts = $$$", 0, F.claude],
  ["tt-7596865856852790542", "Higgsfield", "aibyjoe", "3.9M", "116K", 5.7, "2026-01-19", "Screen demo", "creative-tools", "Kling motion control demo (comment AI for the setup)", 18],
  ["ig-DcDBMVdtEtK", "OpenArt", "steeslovable", "774K", "16K", 2.2, "2026-08-15", "Screen demo", "creative-tools", "Claude + Shorts = $478/day (the same edit thecal.mp3 reposts)", 0, F.claude],
  ["ig-DZyhPXrxhWZ", "Medeo AI", "mmjasonyellow", "365K", "3.4K", 1, "2026-06-20", "Screen demo", "creative-tools", "Easy money with the World Cup", 25],
  ["ig-DbXL3cuCdFj", "Creao AI", "ashleyautomatesit", "104K", "2K", 3.8, "2026-07-29", "Screen demo", "creative-tools", "This is how you can make coloring books and make money from it", 0, F.colouring],
  ["tt-7631036581805067533", "Lovable", "s1lentsimulation", "6.9M", "566K", 11.2, "2026-04-21", "Explainer + screen", "developer-tools", "If you're a 17-year-old smart kid, you can literally call every local business", 64, F.coldCall],
  ["tt-7633075751037734158", "Lovable", "gozie.okenu", "5.2M", "477K", 10.7, "2026-04-26", "Acted sketch", "developer-tools", "If you're a 17-year-old smart kid (acted sketch)", 63, F.coldCall],
  ["tt-7640552797901032734", "Lovable", "crys.lovable", "3.5M", "351K", 15.5, "2026-05-16", "Explainer + screen", "developer-tools", "If you're a 17-year-old smart kid…", 59, F.maps],
  ["tt-7622154780714044702", "Lovable", "manu.codes", "2M", "139K", 8.7, "2026-03-28", "Screen demo", "developer-tools", "Charged them 1.3k while driving", 28, F.coldCall],
  ["tt-7638671621657513230", "Lovable", "crys.lovable", "1.7M", "151K", 12.9, "2026-05-11", "Screen demo", "developer-tools", "You can literally call every local business", 54, F.maps],
  ["tt-7655724103906675999", "BeFreed", "learning.withmatt", "5.1M", "390K", 7.8, "2026-06-26", "Tips & lessons", "education", "What psychology says about purple lovers", 0, F.tier],
  ["tt-7652519299520744734", "BeFreed", "learningwliam", "4.9M", "346K", 7.2, "2026-06-18", "Tips & lessons", "education", "S-tier hobbies for blue lovers", 0, F.tier],
  ["ig-DZEiY8aJOiz", "Dupe.com", "findsbyzachary", "2.7M", "38K", 1.4, "2026-06-02", "Reacts to the app", "shopping", "This girl better go into hiding, she just exposed the whole industry", 0, F.course],
  ["tt-7651826898703600904", "Composio", "walidsadvice", "2M", "117K", 5.9, "2026-06-16", "Explainer + screen", "developer-tools", "Someone just built GTA 6 in 10 hours using Claude", 0, F.gta],
  ["ig-DbfZeekzWiK", "Krea AI", "simran.tech_", "2M", "31K", 3.6, "2026-08-01", "Explainer + screen", "creative-tools", "Part time job ✗ Coloring books ✓", 0, F.colouring],
  ["ig-DTwKrV3kXl-", "Higgsfield", "justdval", "1.8M", "109K", 8, "2026-01-21", "Tips & lessons", "creative-tools", "This effect is called…", 83, F.astra],
  ["tt-7700271190992112916", "OpenArt", "sekiro.invo", "541K", "30K", 8.7, "2026-10-24", "Explainer + screen", "creative-tools", "OpenArt is printing with this (green screen)", 72],
  ["tt-7697805981333638407", "OpenArt", "meerhustles", "483K", "31K", 8.6, "2026-10-18", "Explainer + screen", "creative-tools", "The AI influencer + OpenArt method is crazy", 37],
  ["ig-DYctY2izoWA", "Medeo AI", "createwkiana", "241K", "11K", 7.4, "2026-05-17", "Explainer + screen", "creative-tools", "Yeah… this method is unmatched", 45],
  ["ig-DYiTasnBIXb", "Composio", "victor2up_", "2.6M", "93K", 3.6, "2026-05-19", "Acted sketch", "developer-tools", "This is a 1 million dollar engineer…", 0],
  ["tt-7685210787333426453", "Higgsfield", "ai.withsam.mp4", "1.9M", "108K", 9.2, "2026-09-14", "Acted sketch", "creative-tools", "Bro just pulled out $10k mid lecture", 91],
  ["tt-7689635610138529045", "Higgsfield", "createwfemi", "1.7M", "102K", 8.7, "2026-09-26", "Acted sketch", "creative-tools", "Show me your screen time", 97],
];

// full breakdowns from DarkUGC's video analysis
const D: Record<string, Detail> = {
  "ig-Dec88-WS8n_": {
    summary: "A creator demos an interactive 3D anatomy app on a tablet: exploded skeleton, muscles, lungs and heart.",
    hookType: "Shock", techniques: ["Face to camera", "Text overlay", "Movement"],
    scenes: ["On camera holding a tablet: the skeleton explodes apart, she reacts in shock.", "Over-the-shoulder: the muscle system explodes, single muscles highlighted.", "Rotating and zooming into the 3D lungs.", "Close-up rotating the 3D heart."],
    why: "Visually arresting 3D graphics plus a hook that calls out one high-intent audience (medical students) drives instant engagement.",
    template: "All [target audience], ATTENTION! Check out this [feature] on [App Name].",
    pain: "Memorising anatomy from 2D textbooks is hard.", benefit: "Take apart detailed 3D anatomy from any angle.",
    pace: "medium", voice: "No voice", music: "Dramatic strings building into an energetic beat",
    ranks: [{ scope: "Screen demo", rank: 2, of: 1713 }, { scope: "Education", rank: 2, of: 6792 }, { scope: "Library", rank: 22, of: 24752 }],
    creatorTypical: "350K", followers: "26K", perDayAvg: "2.1M", perDayLately: "71K",
    remix: ["Voiceover quiz questions over the 3D heart.", "Textbook diagram vs the 3D model side by side.", "A student prepping for an anatomy exam with the app."],
  },
  "ig-DdmzsXziRAi": {
    summary: "A woman frantically solves alarm-app missions on her husband's ringing phone to turn off a loud alarm.",
    hookType: "POV", techniques: ["Face to camera", "Text overlay", "Sound effect", "Humor"],
    scenes: ["Reacts to the absurdly loud alarm in bed and reaches for the phone.", "Completes a typing challenge while commenting on the noise.", "The app makes her chant motivational words on beat.", "The app wants a photo of a pillow: she scans it, the alarm stops, she tosses the phone."],
    why: "Shows the product's features organically through real, chaotic reactions to near-impossible missions.",
    template: "WHAT is my [partner/roommate]'s alarm [show the extreme mission UI while frantically completing tasks]",
    pain: "An alarm that refuses to turn off.", benefit: "Forces you fully awake with multi-step missions.",
    pace: "fast", voice: "On camera", music: "Chaotic alarm melody and electronic vocal",
    ranks: [{ scope: "App challenge struggle", rank: 3, of: 336 }, { scope: "Health & Fitness", rank: 3, of: 2791 }, { scope: "Library", rank: 32, of: 24752 }],
    creatorTypical: "60K", followers: "1.9K", perDayAvg: "912K", perDayLately: "11K",
    remix: ["A roommate walking in trying to shut it off.", "A parent dismissing a teenager's maths-mission alarm.", "A speedrun: beat every mission in under 30 seconds."],
  },
  "tt-7690142460353301773": {
    summary: "Shows how to get low-quality vintage photos with a Nokia filter in a camera app.",
    hookType: "Bold claim", techniques: ["Text overlay", "Trending sound"],
    scenes: ["Montage of aesthetic lo-fi photos with the hook text.", "Screen recording: open the app, pick the Nokia filter.", "The resulting retro selfie clip."],
    why: "Rides the Y2K / digicam trend and shows a one-tap fix by screen recording.",
    template: "[Aesthetic photos] low quality photos are always the best. Open [App]! Select [Filter]. [Show results].",
    pain: "Wanting a vintage look without an old camera.", benefit: "Retro lo-fi photos in one tap.",
    pace: "fast", voice: "No voice", music: "Upbeat pop",
    ranks: [{ scope: "Screen demo", rank: 4, of: 1713 }, { scope: "Creative Tools", rank: 4, of: 1891 }, { scope: "Library", rank: 38, of: 24752 }],
    creatorTypical: "3.1M", followers: "7.4K", perDayAvg: "1M", perDayLately: "16",
    remix: ["Before/after: a modern photo turned lo-fi.", "Test several retro filters in a row.", "Night-time flash photos with the app."],
  },
  "ig-Dfa_L-WJ_HI": {
    summary: "A woman wakes up to her boyfriend's alarm app and has to complete missions to turn it off.",
    hookType: "Problem", techniques: ["Face to camera", "Text overlay", "Movement"],
    scenes: ["In bed, annoyed by the loud alarm.", "Types a tongue-twister mission.", "A voice mission: 'wakey wakey let's get ready' on beat.", "Walks to the bathroom to photograph the toilet to dismiss it."],
    why: "Relatable frustration plus curiosity about extreme alarm tasks shows the app off naturally.",
    template: "WTH is my [partner/roommate]'s alarm [complete the morning alarm missions on camera]",
    pain: "Normal alarms get snoozed.", benefit: "Forces you out of bed with interactive challenges.",
    pace: "medium", voice: "On camera", music: "Electronic alarm melody",
    ranks: [{ scope: "App challenge struggle", rank: 55, of: 336 }, { scope: "Library", rank: 2382, of: 24752 }],
    creatorTypical: "597K", followers: "3.8K", perDayAvg: "1.6M", perDayLately: "",
    remix: ["Waking up for an early flight with the missions.", "A roommate reacting to someone doing squats for an alarm.", "Testing each mission difficulty as a heavy sleeper."],
  },
  "tt-7676324506633391373": {
    summary: "A creator brushes her hair while a text overlay shares a hot take on long-distance calls.",
    hookType: "Bold claim", techniques: ["Text overlay", "Movement"],
    scenes: ["Puts on a hoodie and brushes her hair while the hot take sits on screen."],
    why: "A bold contrarian take provokes instant curiosity and agreement from the exact audience.",
    template: "hot take: [common problem] isn't the problem. [specific recurring issue] is",
    pain: "Boring, repetitive nightly calls.", benefit: "Variety and connection on couple calls.",
    pace: "medium", voice: "No voice", music: "Upbeat pop instrumental",
    ranks: [{ scope: "Text + get ready", rank: 5, of: 677 }, { scope: "Relationships", rank: 15, of: 2385 }, { scope: "Library", rank: 318, of: 24752 }],
    creatorTypical: "–", followers: "567", perDayAvg: "127K", perDayLately: "2.3K",
    remix: ["The repetitive call vs a fun interactive call.", "Pair the text with reactions on FaceTime.", "List 3 questions to ask instead of 'how was your day'."],
  },
  "ig-DedzSAMET7j": {
    summary: "A student studies for as long as a random flight takes to land, inside a virtual study-world app.",
    hookType: "Curiosity gap", techniques: ["Face to camera", "Text overlay", "Direct address", "Movement"],
    scenes: ["Introduces the flight-tracker method to set the study length.", "Tablet view: opens the app, picks the airport and a 25-minute ticket.", "The virtual plane fills with other people studying; she locks in."],
    why: "Pairs a viral study gimmick with a cute gamified app, so the demo never feels like an ad.",
    template: "If you have [upcoming task], just pick a random [flight/train]. They finish in [time], that's how long I'll work. For this I use [App]…",
    pain: "No motivation or structure before an exam.", benefit: "Gamified focus sessions with real people worldwide.",
    pace: "medium", voice: "Voiceover", music: "Chill lo-fi",
    ranks: [{ scope: "Explainer + screen", rank: 57, of: 3747 }, { scope: "Productivity", rank: 23, of: 1691 }, { scope: "Library", rank: 500, of: 24752 }],
    creatorTypical: "228K", followers: "25K", perDayAvg: "2.3M", perDayLately: "",
    remix: ["Pick a random train instead of a flight.", "A 50-minute flight challenge with a friend.", "Before/after of your virtual room after a 4-hour flight."],
  },
  "ig-DbGJMKPgOTB": {
    summary: "A side-hustle tutorial: turn Airbnb listing photos into AI video walkthroughs and sell them to the owners.",
    hookType: "Curiosity gap", techniques: ["Face to camera", "Text overlay", "Pattern interrupt", "Direct address"],
    scenes: ["The scenario: needing money for a car, without courses or OnlyFans.", "Step one: copy the photos from a nice Airbnb listing.", "Paste them into the AI tool with a prompt; it generates a walkthrough.", "Pitch the owner for $500; comment for the prompt."],
    why: "An aspirational hook paired with a step-by-step side hustle that shows the product seamlessly.",
    template: "If I lost everything and had [time] to buy [dream item], here's what I'd do. Go to [platform], grab photos, open [tool], use this prompt, sell it to [client] for [price]. Comment [keyword] for the prompt.",
    pain: "Wanting fast money with just a laptop.", benefit: "Pro walkthrough videos from photos, to sell.",
    pace: "fast", voice: "On camera", music: "Upbeat electronic",
    ranks: [{ scope: "Explainer + screen", rank: 382, of: 3747 }, { scope: "OpenArt", rank: 1, of: 123 }, { scope: "Library", rank: 3411, of: 24752 }],
    creatorTypical: "146K", followers: "28K", perDayAvg: "12K", perDayLately: "",
    remix: ["Do it for real estate agents instead of Airbnb hosts.", "Side-by-side: static photos vs the generated video.", "Local businesses' ads from their Yelp photos."],
  },
  "tt-7631036581805067533": {
    summary: "Tests a business idea: find a local business on Google Maps without a website and build one with AI.",
    hookType: "Curiosity gap", techniques: ["Face to camera", "Text overlay", "Trending sound"],
    scenes: ["Listens to an interview clip about pitching AI websites to local businesses.", "Searches Google Maps for a business with no website and copies its details.", "Pastes the details into the AI builder with a prompt.", "Shows the finished website and the call to action."],
    why: "Hooks with viral advice, then gives instant proof with a step-by-step demo.",
    template: "React to [viral advice clip]. Let's test that out. Step 1: find [lead on Google Maps]. Step 2: copy their info. Step 3: go to [tool] with [prompt]. In minutes you have [result].",
    pain: "Building sites for clients takes skill and time.", benefit: "A full site for a local business in minutes.",
    pace: "medium", voice: "Creator + app", music: "4 Raws (Slowed)",
    ranks: [{ scope: "Explainer + screen", rank: 49, of: 3747 }, { scope: "Developer Tools", rank: 4, of: 340 }, { scope: "Library", rank: 414, of: 24752 }],
    creatorTypical: "–", followers: "11K", perDayAvg: "38K", perDayLately: "617",
    remix: ["The same workflow for restaurants or cafés.", "A real cold call using the generated site.", "Split screen: building by hand vs with AI."],
  },
  "ig-DaRM2_7CiNa": {
    summary: "A green-screen story: 'I emailed every millionaire and asked for $1', with the stats and the AI tool behind it.",
    hookType: "Curiosity gap", techniques: ["Face to camera", "Text overlay", "Controversy"],
    scenes: ["The hypothetical: ask every millionaire for $1.", "How many millionaires exist and how many he found.", "A diagram of the responses.", "The AI integration that sent the emails.", "The replies: no, questions, and the final total."],
    why: "An outrageous curiosity hook plus data visuals make the tool plug feel like an organic part of the story.",
    template: "Is it possible to [unusual goal] by asking [huge group]? Well I contacted [number]. Here are the stats: [breakdown]. If you're wondering how, I used [tool] to [automate it].",
    pain: "Doing thousands of actions by hand is impossible.", benefit: "Connect AI to apps to automate huge workflows.",
    pace: "medium", voice: "On camera", music: "Subtle ambient synth",
    ranks: [{ scope: "Explainer + screen", rank: 50, of: 3747 }, { scope: "Composio", rank: 1, of: 155 }, { scope: "Library", rank: 423, of: 24752 }],
    creatorTypical: "168K", followers: "1.7K", perDayAvg: "56K", perDayLately: "24",
    remix: ["Ask 1,000 companies for a sponsorship.", "Email professors to review a startup idea.", "Apply to 10,000 jobs automatically."],
  },
  "ig-DeiGVtUhKKm": {
    summary: "Reacts to a viral AI-animated short, then shows how to make one with ChatGPT and an AI video tool.",
    hookType: "Reaction", techniques: ["Face to camera", "Pattern interrupt", "Movement", "Trending sound"],
    scenes: ["Watches and reacts to an odd 3D animated egg video.", "'You watched that entire video, didn't you?' plus its views and estimated revenue.", "ChatGPT: ideas and a scene-by-scene breakdown.", "The AI video tool: pick Seedance 2.5, paste, generate.", "The generated clip, then 'comment AI for the guide'."],
    why: "An odd viral clip buys instant retention before it turns into an actionable AI workflow.",
    template: "You just watched that entire video, didn't you? So did [number] people, and it made [amount]. Here's how: ask [AI] for a script, paste it into [tool], and in minutes you have a video. Comment [keyword] for the guide.",
    pain: "Making viral animations from scratch is hard.", benefit: "Generate viral animated Shorts with AI.",
    pace: "fast", voice: "Creator + app", music: "Upbeat synth",
    ranks: [{ scope: "Explainer + screen", rank: 97, of: 3747 }, { scope: "Krea AI", rank: 1, of: 17 }, { scope: "Library", rank: 816, of: 24752 }],
    creatorTypical: "106K", followers: "5.5K", perDayAvg: "308K", perDayLately: "4.6K",
    remix: ["Use satisfying or miniature-cooking clips as the hook.", "Split screen: prompt entry and live generation.", "Bedtime stories or myth-buster niches."],
  },
  "ig-Da9dDfqC3a2": {
    summary: "Generates aesthetic digital planners with AI and sells them on Etsy, shown with text only.",
    hookType: "Problem", techniques: ["Face to camera", "Text overlay"],
    scenes: ["Disgusted face at the idea of relying on a 9-5.", "Pinterest search for inspiration.", "Drop the image into the AI tool with a prompt.", "The tool builds a printable planner.", "The Etsy dashboard with orders."],
    why: "A relatable objection, then an easy step-by-step side hustle with tangible output and proof.",
    template: "When someone says [limiting belief about their job]: 1. Find inspo on Pinterest 2. Drop it into [AI tool] 3. Use this prompt 4. Sell on [marketplace].",
    pain: "Relying only on a 9-5.", benefit: "Make sellable digital products with AI.",
    pace: "fast", voice: "No voice", music: "Upbeat hip-hop",
    ranks: [{ scope: "Screen demo", rank: 77, of: 1713 }, { scope: "Creao AI", rank: 1, of: 9 }, { scope: "Library", rank: 1009, of: 24752 }],
    creatorTypical: "438K", followers: "17K", perDayAvg: "36K", perDayLately: "",
    remix: ["Flashcards or resume templates instead of planners.", "Bundle several products for a bigger order.", "Manual design time vs AI generation."],
  },
  "tt-7652519299520744734": {
    summary: "A colour-psychology list ('S-tier hobbies for blue lovers') with an app plugged in at number two.",
    hookType: "Bold claim", techniques: ["Face to camera", "Text overlay", "Direct address"],
    scenes: ["Colour psychology intro and traits of blue lovers.", "Hobby 1: meditation and journaling.", "Hobby 2: reading, with the book-summary app plug.", "Hobby 3: astronomy.", "Follow and comment your favourite colour."],
    why: "A personal curiosity hook keeps people watching, and the app slots in naturally as one item of the list.",
    template: "Psychology shows your favourite [category] says [trait]. If you like [item], try these: 1. [hobby] 2. [hobby] with [App] 3. [hobby].",
    pain: "No time to read whole books.", benefit: "Learn daily in 10–15 minute summaries.",
    pace: "medium", voice: "On camera", music: "Lo-fi ambient",
    ranks: [{ scope: "Tips & lessons", rank: 8, of: 1428 }, { scope: "BeFreed", rank: 3, of: 71 }, { scope: "Library", rank: 622, of: 24752 }],
    creatorTypical: "143K", followers: "17K", perDayAvg: "38K", perDayLately: "219",
    remix: ["Green lovers with nature apps.", "Habits for introverts with learning apps.", "Red lovers with fitness apps."],
  },
};

export const VIDEOS: UgcVideo[] = (() => {
  const seen = new Set<string>();
  const out: UgcVideo[] = [];
  for (const [id, brand, creator, views, likes, er, posted, format, category, hook, dur, copyAs] of ROWS) {
    if (seen.has(id)) continue;
    seen.add(id);
    out.push({ id, platform: id.startsWith("tt-") ? "TikTok" : "Instagram", brand, creator, views: n(views), likes: n(likes), er, posted, format, category, hook, dur: dur || 0, copyAs, detail: D[id] });
  }
  return out;
})();

export const videoById = (id: string) => VIDEOS.find((v) => v.id === id);
export const clipOf = (v: UgcVideo) => (v.platform === "TikTok" ? { kind: "tiktok" as const, id: v.id.slice(3) } : { kind: "instagram" as const, id: v.id.slice(3) });

// ---------------------------------------------------------------- trends by period (DarkUGC, Nov 10 2026)

export type Group = { name: string; videos: number; prev?: number; total: string; median: string; change?: string };
export type Period = {
  key: "week" | "month" | "quarter" | "year";
  label: string;
  days: number;
  since: string;
  videos: number;
  prevVideos: number;
  formats: Group[];
  hooks: Group[];
  brands: Group[];
  creators: { handle: string; videos: number; total: string }[];
};

export const PERIODS: Period[] = [
  {
    key: "week", label: "This week", days: 7, since: "2026-11-04", videos: 96, prevVideos: 172,
    formats: [
      { name: "App challenge struggle", videos: 14, prev: 12, total: "6M", median: "207K" },
      { name: "Text-message song", videos: 11, prev: 15, total: "1.8M", median: "143K" },
      { name: "Text + daily moment", videos: 12, prev: 22, total: "1.6M", median: "108K" },
      { name: "Dance, lip-sync & pose", videos: 8, prev: 11, total: "1.4M", median: "127K" },
      { name: "Text + cooking & chores", videos: 4, prev: 7, total: "1.1M", median: "72K" },
      { name: "Explainer + screen", videos: 10, prev: 22, total: "906K", median: "72K" },
      { name: "Lock screen reveal", videos: 7, prev: 12, total: "577K", median: "90K" },
      { name: "App talks back", videos: 5, prev: 16, total: "576K", median: "75K" },
    ],
    hooks: [
      { name: "Curiosity gap", videos: 31, prev: 65, total: "4.9M", median: "87K" },
      { name: "Problem", videos: 11, prev: 20, total: "3.7M", median: "127K" },
      { name: "POV", videos: 16, prev: 16, total: "2.6M", median: "101K" },
      { name: "Relatable", videos: 5, prev: 11, total: "1.5M", median: "70K" },
      { name: "Story", videos: 12, prev: 15, total: "1.5M", median: "91K" },
      { name: "Bold claim", videos: 8, prev: 18, total: "692K", median: "72K" },
      { name: "Question", videos: 4, prev: 8, total: "534K", median: "77K" },
      { name: "Reaction", videos: 4, prev: 4, total: "441K", median: "88K" },
    ],
    brands: [
      { name: "Alarmy", videos: 5, prev: 3, total: "3.5M", median: "192K" },
      { name: "PushClock", videos: 7, prev: 7, total: "2.2M", median: "221K" },
      { name: "Suno", videos: 11, prev: 15, total: "1.8M", median: "143K" },
      { name: "RecentFollow", videos: 5, prev: 7, total: "1.2M", median: "79K" },
      { name: "Hello Nancy", videos: 6, prev: 7, total: "872K", median: "108K" },
      { name: "Tethered", videos: 7, prev: 11, total: "526K", median: "76K" },
      { name: "EQUALS", videos: 3, prev: 10, total: "465K", median: "83K" },
      { name: "Ladder", videos: 4, prev: 0, total: "457K", median: "111K" },
    ],
    creators: [
      { handle: "ailenmornings", videos: 4, total: "3.3M" },
      { handle: "autumn.pushclock", videos: 7, total: "2.2M" },
      { handle: "maggie.girltea", videos: 1, total: "879K" },
      { handle: "selflovewithmaddixoxo", videos: 6, total: "872K" },
      { handle: "oliviainthekitchen_", videos: 4, total: "820K" },
      { handle: "jadablue999", videos: 3, total: "629K" },
    ],
  },
  {
    key: "month", label: "This month", days: 30, since: "2026-10-11", videos: 1118, prevVideos: 2720,
    formats: [
      { name: "Screen demo", videos: 92, prev: 182, total: "81M", median: "181K", change: "-13%" },
      { name: "Explainer + screen", videos: 185, prev: 512, total: "48M", median: "126K", change: "-31%" },
      { name: "App talks back", videos: 107, prev: 276, total: "29M", median: "119K", change: "-42%" },
      { name: "Text + daily moment", videos: 127, prev: 303, total: "28M", median: "120K", change: "-33%" },
      { name: "App challenge struggle", videos: 43, prev: 36, total: "27M", median: "185K", change: "+1%" },
      { name: "Reacts to the app", videos: 45, prev: 130, total: "19M", median: "133K", change: "-33%" },
      { name: "Text-message song", videos: 59, prev: 114, total: "18M", median: "92K", change: "-44%" },
      { name: "Lock screen reveal", videos: 90, prev: 200, total: "17M", median: "112K", change: "-44%" },
      { name: "Text story → screen proof", videos: 45, prev: 91, total: "11M", median: "130K", change: "-44%" },
      { name: "Dance, lip-sync & pose", videos: 53, prev: 110, total: "11M", median: "121K", change: "-23%" },
      { name: "Text + cooking & chores", videos: 40, prev: 131, total: "9.9M", median: "97K", change: "-69%" },
      { name: "Acted sketch", videos: 34, prev: 77, total: "9.4M", median: "132K", change: "-40%" },
    ],
    hooks: [
      { name: "Curiosity gap", videos: 364, prev: 650, total: "92M", median: "115K", change: "-31%" },
      { name: "Shock", videos: 73, prev: 252, total: "62M", median: "152K", change: "-31%" },
      { name: "POV", videos: 125, prev: 455, total: "40M", median: "146K", change: "-30%" },
      { name: "Problem", videos: 115, prev: 194, total: "38M", median: "126K", change: "-21%" },
      { name: "Story", videos: 94, prev: 174, total: "23M", median: "115K", change: "-39%" },
      { name: "Bold claim", videos: 109, prev: 374, total: "23M", median: "132K", change: "-38%" },
      { name: "Question", videos: 67, prev: 206, total: "19M", median: "119K", change: "-51%" },
      { name: "Reaction", videos: 44, prev: 76, total: "14M", median: "117K", change: "-20%" },
      { name: "Relatable", videos: 54, prev: 102, total: "12M", median: "139K", change: "-8%" },
      { name: "List", videos: 24, prev: 93, total: "3.3M", median: "109K", change: "-29%" },
    ],
    brands: [
      { name: "Astra AI", videos: 18, prev: 106, total: "48M", median: "149K" },
      { name: "Suno", videos: 63, prev: 118, total: "22M", median: "93K" },
      { name: "Alarmy", videos: 17, prev: 11, total: "21M", median: "328K" },
      { name: "Pingo AI", videos: 50, prev: 112, total: "13M", median: "93K" },
      { name: "RecentFollow", videos: 52, prev: 73, total: "12M", median: "99K" },
      { name: "Focustown", videos: 13, prev: 6, total: "12M", median: "228K" },
      { name: "Tethered", videos: 60, prev: 123, total: "11M", median: "105K" },
      { name: "Tenmin", videos: 25, prev: 38, total: "9.8M", median: "194K" },
    ],
    creators: [
      { handle: "ivy_learns", videos: 2, total: "41M" },
      { handle: "ailenmornings", videos: 11, total: "19M" },
      { handle: "studyingwkristen", videos: 12, total: "11M" },
      { handle: "investigatewithmia", videos: 5, total: "7.2M" },
      { handle: "oliviainthekitchen_", videos: 23, total: "6.1M" },
      { handle: "victoria.blessed70", videos: 16, total: "5.8M" },
    ],
  },
  {
    key: "quarter", label: "Last 90 days", days: 90, since: "2026-08-13", videos: 6523, prevVideos: 7212,
    formats: [
      { name: "Explainer + screen", videos: 1144, prev: 1082, total: "558M", median: "166K" },
      { name: "Screen demo", videos: 488, prev: 550, total: "341M", median: "196K" },
      { name: "Text + daily moment", videos: 792, prev: 785, total: "339M", median: "174K" },
      { name: "App talks back", videos: 629, prev: 914, total: "310M", median: "199K" },
      { name: "Text + cooking & chores", videos: 280, prev: 262, total: "205M", median: "292K" },
      { name: "Reacts to the app", videos: 294, prev: 316, total: "193M", median: "168K" },
      { name: "Lock screen reveal", videos: 414, prev: 342, total: "178M", median: "199K" },
      { name: "Tips & lessons", videos: 404, prev: 534, total: "132M", median: "152K" },
    ],
    hooks: [
      { name: "Curiosity gap", videos: 1674, prev: 1892, total: "707M", median: "152K" },
      { name: "POV", videos: 1006, prev: 1075, total: "578M", median: "205K" },
      { name: "Bold claim", videos: 821, prev: 865, total: "460M", median: "204K" },
      { name: "Shock", videos: 569, prev: 624, total: "386M", median: "203K" },
      { name: "Question", videos: 454, prev: 529, total: "263M", median: "206K" },
      { name: "Problem", videos: 554, prev: 722, total: "236M", median: "170K" },
      { name: "Story", videos: 410, prev: 361, total: "192M", median: "187K" },
      { name: "Relatable", videos: 249, prev: 245, total: "118M", median: "169K" },
    ],
    brands: [
      { name: "FollowSpy", videos: 311, prev: 298, total: "276M", median: "402K" },
      { name: "Kalshi", videos: 40, prev: 20, total: "162M", median: "158K" },
      { name: "Suno", videos: 216, prev: 58, total: "115M", median: "165K" },
      { name: "Pingo AI", videos: 221, prev: 199, total: "102M", median: "206K" },
      { name: "Astra AI", videos: 152, prev: 79, total: "96M", median: "186K" },
      { name: "Airlearn", videos: 185, prev: 425, total: "94M", median: "280K" },
      { name: "Tethered", videos: 221, prev: 124, total: "86M", median: "160K" },
      { name: "Kapi Cam", videos: 16, prev: 7, total: "82M", median: "2M" },
    ],
    creators: [
      { handle: "lily.girltea", videos: 37, total: "90M" },
      { handle: "amir8nouri", videos: 2, total: "73M" },
      { handle: "maioney5", videos: 6, total: "51M" },
      { handle: "investigatewithmia", videos: 22, total: "47M" },
      { handle: "growthwithharper", videos: 30, total: "43M" },
      { handle: "ivy_learns", videos: 5, total: "43M" },
    ],
  },
  {
    key: "year", label: "This year", days: 365, since: "2025-11-10", videos: 20436, prevVideos: 3947,
    formats: [
      { name: "Explainer + screen", videos: 3185, prev: 482, total: "2B", median: "183K", change: "-39%" },
      { name: "Text + daily moment", videos: 2469, prev: 549, total: "1.9B", median: "227K", change: "-23%" },
      { name: "App talks back", videos: 2294, prev: 253, total: "1.4B", median: "228K", change: "-47%" },
      { name: "Dance, lip-sync & pose", videos: 1157, prev: 295, total: "1.4B", median: "196K", change: "-36%" },
      { name: "Reacts to the app", videos: 867, prev: 222, total: "1.1B", median: "236K", change: "-48%" },
      { name: "Screen demo", videos: 1364, prev: 317, total: "984M", median: "194K", change: "-52%" },
      { name: "Text story → screen proof", videos: 1005, prev: 388, total: "747M", median: "252K", change: "-22%" },
      { name: "Text + cooking & chores", videos: 759, prev: 10, total: "691M", median: "420K", change: "+83%" },
      { name: "Acted sketch", videos: 740, prev: 163, total: "685M", median: "261K", change: "-33%" },
      { name: "Lock screen reveal", videos: 979, prev: 264, total: "545M", median: "264K", change: "-44%" },
      { name: "Tips & lessons", videos: 1268, prev: 132, total: "486M", median: "181K", change: "-6%" },
      { name: "App challenge struggle", videos: 334, prev: 1, total: "474M", median: "278K", change: "-30%" },
    ],
    hooks: [],
    brands: [],
    creators: [],
  },
];

/** median views for a format over the last year, to say how far a video beat its format */
export function formatMedian(format: string) {
  const g = PERIODS[3].formats.find((f) => f.name === format) ?? PERIODS[2].formats.find((f) => f.name === format);
  return g ? n(g.median) : 0;
}

export const CATEGORIES = Array.from(new Set(VIDEOS.map((v) => v.category))).sort();
export const FORMATS = Array.from(new Set(VIDEOS.map((v) => v.format))).sort();

// ---------------------------------------------------------------- thecal.mp3: same campaign, one edit reposted


export const THECAL_VIDEOS: UgcVideo[] = LIBRARY.filter((v) => v.source === "thecal.mp3").map((v) => ({
  id: "ig-" + v.clip.id,
  platform: "Instagram" as const,
  brand: "Campaign",
  creator: v.creator,
  views: v.views,
  likes: 0,
  er: 0,
  posted: v.posted,
  format: "Screen demo",
  category: "creative-tools",
  hook: v.hook === "a repost of the same edit" || v.hook === "a typical repost" ? "Claude + Shorts = $X/day (repost of his one edit)" : v.hook,
  dur: 14,
  copyAs: F.claude,
}));

/** everything the site can show: viral videos from DarkUGC, then thecal.mp3's reposts */
export const ALL_VIDEOS: UgcVideo[] = [...VIDEOS, ...THECAL_VIDEOS.filter((t) => !VIDEOS.some((v) => v.id === t.id))];
export const anyVideoById = (id: string) => ALL_VIDEOS.find((v) => v.id === id);

// ---------------------------------------------------------------- numbers for one video

const DAY = 86_400_000;
const at = (s: string) => new Date(s + "T12:00:00Z").getTime();
/** days between posting and the snapshot (at least 1) */
export const ageDays = (v: UgcVideo) => Math.max(1, Math.round((at(SNAPSHOT_DATE) - at(v.posted)) / DAY));
export const perDay = (v: UgcVideo) => v.views / ageDays(v);
/** inside a window ending on the snapshot day */
export const postedWithin = (v: UgcVideo, days: number) => days <= 0 || at(SNAPSHOT_DATE) - at(v.posted) <= days * DAY;

const byViews = [...VIDEOS].sort((a, b) => b.views - a.views);
export const libraryRank = (v: UgcVideo) => byViews.findIndex((x) => x.id === v.id) + 1;
export const xMedian = (v: UgcVideo) => {
  const m = formatMedian(v.format);
  return m ? v.views / m : 0;
};
/** the videos that fit Andre's campaigns: they copy a campaign format or sell an AI creative or dev tool */
export const fitsCampaign = (v: UgcVideo) => !!v.copyAs || v.category === "creative-tools" || v.category === "developer-tools";

// ---------------------------------------------------------------- how to film each format

export type Playbook = { what: string; steps: string[]; template: string };

export const PLAYBOOKS: Record<string, Playbook> = {
  "App challenge struggle": {
    what: "You fight the app on camera: an alarm, a game or a task it won't let you skip.",
    steps: ["Open on the problem mid-moment (alarm ringing, you half asleep).", "Do the app's challenge on camera and react honestly.", "Show the screen at the hard part so people see what it asks.", "End on relief or defeat, with the app name in the caption."],
    template: "WHAT is my [partner/roommate]'s [app type] [frantically complete the app's challenges on camera]",
  },
  "Text + cooking & chores": {
    what: "A relatable thought on screen while you do something ordinary with your hands.",
    steps: ["Film yourself cooking, cleaning or folding, no talking.", "Put one punchy relatable line on screen in the first second.", "Mention the app in a second text card or the caption.", "Keep it under 10 seconds so people rewatch it."],
    template: "[relatable feeling about dating, money or work] (text on screen while you [cook/clean])",
  },
  "Acted sketch": {
    what: "A short skit where the app is the punchline.",
    steps: ["Set up a familiar situation in one line (boss, cousin, lecture).", "Play both sides or get a friend.", "The app solves it or causes the twist.", "Cut the moment the joke lands."],
    template: "pov: [familiar situation] … [the app appears as the twist]",
  },
  "Dance, lip-sync & pose": {
    what: "A trend sound with a line of text about the app.",
    steps: ["Pick a trending sound that's still rising.", "Film one clean take of the move or lip-sync.", "Add one line of text that ties the trend to the app.", "Name the app in the text or caption."],
    template: "[trend move] + text: \"when [situation the app fixes]\"",
  },
  "Text-message song": {
    what: "Crazy texts turned into a song with an AI music app.",
    steps: ["Screenshot a wild text thread (yours or fake names).", "Hook: tease the texts in the first line.", "Generate the song and play it over the screenshots.", "React at the funniest line."],
    template: "POV: [wild situation in texts] … so I turned the texts into a song",
  },
  "Text + daily moment": {
    what: "One relatable line over an everyday clip, app named in the text.",
    steps: ["Film any everyday moment: driving, walking, sitting in bed.", "One strong line on screen that says something people feel.", "The app is the answer in a second line or the caption.", "No talking needed."],
    template: "[relatable truth] … [app] fixed this for me",
  },
  "Screen demo": {
    what: "Show the app doing the thing, screen first, no setup.",
    steps: ["Hook with the result or a call-out to who it's for.", "Screen-record the exact taps, fast.", "Show the finished result big.", "Say or write where to get it."],
    template: "All [audience], ATTENTION! Check out this [feature] on [app].",
  },
  "Reacts to the app": {
    what: "You react, surprised, to what the app just did.",
    steps: ["Start on your face mid-reaction.", "Cut to the screen to show what caused it.", "React again, bigger.", "Tell people the app name."],
    template: "Wait… [app] can do THIS? [show the result]",
  },
  Montage: {
    what: "Fast cuts of results made with the app over a sound.",
    steps: ["Make 6 to 10 results with the app.", "Cut them to the beat of a trending sound.", "Put the app name on the first frame.", "Keep it short so it loops."],
    template: "[app name] [montage of results on beat]",
  },
  "Explainer + screen": {
    what: "Talk to camera, then prove it on the screen.",
    steps: ["Hook with a claim or a 'if you have X, do this' line.", "Explain the method in 2 to 3 short steps.", "Show the screen for each step.", "Close with the result and a comment keyword."],
    template: "If you have [goal or problem], just [simple method]. For this I use [app]…",
  },
  "App talks back": {
    what: "You ask the app something and its answer is the content.",
    steps: ["Ask a question people are curious about.", "Show the app's reply on screen or out loud.", "React or ask a follow-up.", "End on the funniest or most useful answer."],
    template: "I asked [app] [question] and it said…",
  },
  "Text story → screen proof": {
    what: "A story told in on-screen text, then the screenshot that proves it.",
    steps: ["Open with the end of the story as the hook.", "Tell it in 2 or 3 text cards over b-roll.", "Show the app screenshot as proof.", "Ask people to comment theirs."],
    template: "[surprising result] … here's the proof [app screenshot]",
  },
  "AI message reaction": {
    what: "Read out an AI message and react to how real it sounds.",
    steps: ["Show the message on screen.", "React in the first second.", "Read the best line out loud.", "Name the app."],
    template: "What do I even do? [read the AI's message] …",
  },
  "Secret AI helper": {
    what: "Use AI secretly in a high-stakes moment (interview, exam, call).",
    steps: ["Set the scene: the moment and the stakes.", "Show the AI feeding you answers.", "Show it working.", "Text: the app name."],
    template: "AI [interview/exam/call] is crazy… [show the helper working]",
  },
  "Input → AI result": {
    what: "Before and after: what you put in, what the AI gave back.",
    steps: ["Show the plain input.", "Show the tap that runs the AI.", "Reveal the result full screen.", "Repeat with a second example if short."],
    template: "Before / After [your input → the AI result]",
  },
  "Text + get ready": {
    what: "A bold take on screen while you get ready.",
    steps: ["Film yourself doing hair, makeup or getting dressed.", "One contrarian line on screen.", "The app is the fix in the caption.", "No talking."],
    template: "hot take: [common problem] isn't the problem. [specific recurring issue] is",
  },
  "Lock screen reveal": {
    what: "Show your phone's lock screen widget from the app in a feel-good moment.",
    steps: ["Text sets the feeling (missing someone, a goal).", "Pick up the phone and show the widget.", "React.", "App name in the caption."],
    template: "POV: [feeling] … [show the lock screen widget]",
  },
  "Confrontation with proof": {
    what: "Someone accuses you; the app's record proves you right.",
    steps: ["Open on the accusation line.", "Act out the back and forth.", "Pull up the app's proof.", "End on their reaction."],
    template: "So [person] told me [accusation]… [show the app's record]",
  },
  "Tips & lessons": {
    what: "A numbered list of tips with the app as one of them.",
    steps: ["Hook with a personal or curious angle.", "Give 3 quick tips.", "Make the app tip number 2.", "Ask people to comment theirs."],
    template: "Psychology shows [personal hook]. Try these: 1. [tip] 2. [tip with app] 3. [tip]",
  },
  "Problem → app answer": {
    what: "An urgent problem, then the app solves it on screen.",
    steps: ["POV the panic moment.", "Open the app.", "Show it fixing the problem.", "Relief."],
    template: "POV: you have [urgent problem] in [short time] [app fixes it]",
  },
  "Storytime & rant": {
    what: "Tell a wild story to camera, the app is how you did it.",
    steps: ["Hook with the most surprising line.", "Tell the story fast with numbers.", "Reveal the app as the how.", "Ask a question to drive comments."],
    template: "I [did something huge] … here's what happened. I used [app] to do it.",
  },
};

export const playbookFor = (format: string): Playbook => PLAYBOOKS[format] ?? PLAYBOOKS["Explainer + screen"];
