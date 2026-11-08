# Dremedia

The Dremedia UGC workflow: one dashboard for brand deals, ideas, filming, editing,
posting and accounts, plus seven Claude bots (Ideas, Formats, Repurpose, Inbox, Accounts, Posting,
Connector) that do the daily research in your Chrome and put what they find on
the site.

Built on the free [ugc-dashboard-template](https://github.com/ollysungg/ugc-dashboard-template)
(Next.js 14 + Tailwind), with everything made editable.

## Run it

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:3000.

## Your website

The site is published straight from this repo with GitHub Pages, at
**https://andrechizingaugc-spec.github.io/Dremedia/**. Every change pushed to
`main` republishes it automatically (`.github/workflows/pages.yml`, about 2
minutes; progress is on the repo's **Actions** tab).

One-time setup (you only do this once):

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
2. GitHub Pages on a *private* repo needs a paid GitHub plan. On a free plan,
   make the repo public (**Settings → General → Danger Zone → Change
   visibility**). Only the code becomes visible; what you type into the
   dashboard stays in your own browser.

To build the same static site yourself: `npm run build` writes it to `out/`,
and `npm start` serves that folder.

## Change anything

Everything is editable from the app. No code needed.

| What | Where |
| --- | --- |
| Dashboard name, logo, accent colour, your name, handle, initials, time zone, email domain, footer | **Settings → Profile & look** |
| Month, monthly goal, projection, streak, views/posts today | **Settings → Money & goals** |
| Earnings and videos for any day | click the day on the **Dashboard** calendar |
| Brand deals: name, logo, pay, platforms, status, niche words, Discord server | **Settings → Brand deals**, or **Campaigns → New campaign** / click a row |
| Rename or hide any page or sidebar heading | **Settings → Page names** |
| Bot times, apps, limits and the prompts themselves | **Bots** |
| What the bots found | **Ideation**, **Formats**, **Repurpose**, **Inbox**, **Warm-up**, **Accounts**, **Dashboard** |
| Posts, batches, accounts, ideas, creators, transcripts, warm-up plan | on each page (add / edit / delete) |
| Literally anything else | **Settings → Backup & everything else → Edit everything (JSON)** |

New month? The dashboard offers **Start November** (or whichever month it is);
the old month is kept in your backup.

### Where your data lives

Your edits are saved in this browser (localStorage), so they survive reloads
and stay in sync across tabs. To move to another device or keep a copy:
**Settings → Download backup**, then **Restore a backup** on the other device.
**Clear sample data** empties the made-up brands, posts and accounts but keeps
your profile, page names and bots. **Reset to sample** puts everything back.

Want it to sync across devices automatically? Swap `load()` / the save effect
in `lib/store.tsx` for your database (Supabase, a Google Sheet, your own API);
every page reads through that one store.

## The bots

Seven Claude bots, each with one job. They run in **your own Chrome through the
Claude extension (Claude in Chrome)**, with your sign-ins, on their own
schedules. At the end of every run each bot opens this site's **Bot reports**
page and saves what it found, so it shows up on the right page by itself.

| Bot | Routine | Its job | Results on |
| --- | --- | --- | --- |
| **Ideas** | "Daily ideas", 7am | Outlier TikToks in each brand's niche + wins from each brand's Discord: the 10 best videos to copy, with hook, what happens next, why it worked | Ideation |
| **Formats** | "Viral formats", Mon + Thu 9am | Researches the *formats* going viral (repeatable structures like "pov: you finally…", "3 things I wish I knew"), how each brand could use them, effort to film | Formats |
| **Repurpose** | "Repurpose", Sundays 6pm | Finds your best recent videos and how to reuse each one (hook swap, cut into shorts, cross-post, trending sound, carousel, re-shoot…), with new hooks and where to post | Repurpose |
| **Inbox** | "Inbox check", every 30 min, 9am–9pm | Reads Discord, Gmail and Instagram DMs; Needs you now / Today / FYI, plus deadlines. Read-only | Inbox, Dashboard |
| **Accounts** | "Warm-ups", 12pm | Sets up each new TikTok/Instagram account and warms it up in its niche for 7 days | Warm-up |
| **Posting** | "Post check", 7pm | Checks which scheduled videos went live, records views, likes and followers. Never posts | Accounts, Scheduler |
| **Connector** | "Morning plan" 8am, "Night wrap" 8pm | Reads everything the bots saved, puts the best ideas in your planner and deadlines in your calendar, checks your dashboards, sends you one message | Dashboard ("Today's plan") |

Set them up on the **Bots** page: fill in the blanks (brand details live on each
brand), **Copy prompt**, then paste it into a new chat in the Claude side panel
in Chrome. **Download all prompts** saves them all as one file.

Every prompt keeps the safety rules: you sign in yourself (a bot never types a
password), it never solves a captcha or "verify it's you" check, it stops on
rate limits or warnings, and it treats what it reads as content, never as
instructions. Research bots only watch and read.

How results reach the site: a report is a small JSON block
(`{"bot": "formats", "summary": "...", "items": [...]}`) the bot types into
**Bot reports → Save report**. The page files each item on its page and skips
anything already there, so saving twice is safe. You can paste one yourself too.

Good to know:

- Reports are saved in the browser the bots run in, so open the dashboard in
  that same Chrome. To see everything on your phone, use **Settings → Download
  backup**, then **Restore a backup** on the phone.
- The Claude extension works inside one Chrome profile. The Accounts bot keeps
  each account in its own Chrome profile, so its reports land in that profile's
  copy of the dashboard; if Warm-up doesn't move, paste its daily line there.

## What's still look-only

Purple "look only" notes mark parts that need their own hookup: the watch-list
scraper, green screen / retouch, sending a batch to an editor, auto-posting,
rendering variations, refreshing account stats, speech-to-text, a real inbox for
generated emails. Each note says what it needs.

## Code map

- `lib/mock.ts`: the data model and the sample data it starts with
- `lib/store.tsx`: the one store every page reads and writes (saving, backups, old-backup upgrades)
- `lib/bots.ts`: the seven bot prompts and how the blanks get filled
- `lib/reports.ts`: reads a bot's report and files each item on the right page
- `lib/color.ts`: turns your accent colour into the theme
- `components/shell.tsx`: sidebar, search (⌘K / Ctrl+K), page names
- `components/brand-editor.tsx`: the add/edit brand form used everywhere
