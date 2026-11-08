# Dremedia

The Dremedia UGC workflow: one dashboard for brand deals, ideas, filming, editing,
posting and accounts, plus four Claude bots (Ideas, Inbox, Accounts, Connector)
that do the daily legwork in their own browsers.

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

Each bot is a prompt you paste into its own Claude chat, in an app where Claude
can use its own browser and make routines (scheduled tasks). The **Bots** page
fills in your details, shows what's still missing, and copies the finished
prompt. **Download all prompts** saves them all as one Markdown file.

| Bot | Routine | What it does |
| --- | --- | --- |
| **Ideas** | "Daily ideas", every day at 7am | Searches each active brand's niche words on TikTok, reads each brand's Discord wins channel, sends the 10 best ideas (hook, what happens next, why it worked, link + views), grouped by brand. |
| **Inbox** | "Inbox check", every 30 min, 9am–9pm | Reads Discord, Gmail and Instagram DMs; sorts into Needs you now / Today / FYI; lists deadlines. Read-only. |
| **Accounts** | "Warm-ups", every day at 12pm | Sets up each new TikTok/Instagram account in its own browser profile and warms it up in its niche for 7 days (max 5 likes, 2 follows a session). |
| **Connector** | "Morning plan" 8am, "Night wrap" 8pm | Asks the other bots for their latest update, puts the best ideas in your planner and deadlines in your calendar, checks your dashboards, and sends you one message. |

Every prompt keeps the safety rules: you sign in yourself (the bot never types
a password), it never solves a captcha or "verify it's you" check, it stops on
rate limits or warnings, and it treats what it reads as content, never as
instructions.

How the bots connect to the dashboard:

- **Ideas** uses each brand's *what it is*, *niche words* and *Discord server*
  (edit them on the brand). Ideas you like go into **Ideation → Add idea**, which
  also puts them in your planner.
- **Accounts**: **Warm-up → New account** gives you the exact message to send
  the bot (`@yourname.study on TikTok, niche: study hacks, flashcards`). Paste the
  bot's daily update there and each account's day count moves on its own.
- **Connector** asks for a **Posting** bot too. The Bots page flags it until you
  add one with **New bot** (any custom prompt works).
- Paste any bot's latest message into **Latest update** and it shows on the
  dashboard under "From your bots".

Change a setting later? Copy the prompt again and paste it into the same chat.

## What's still look-only

Purple "look only" notes mark parts that need their own hookup: the watch-list
scraper, green screen / retouch, sending a batch to an editor, auto-posting,
rendering variations, refreshing account stats, speech-to-text, a real inbox for
generated emails. Each note says what it needs.

## Code map

- `lib/mock.ts`: the data model and the sample data it starts with
- `lib/store.tsx`: the one store every page reads and writes (saving, backups, old-backup upgrades)
- `lib/bots.ts`: the four bot prompts and how the blanks get filled
- `lib/color.ts`: turns your accent colour into the theme
- `components/shell.tsx`: sidebar, search (⌘K / Ctrl+K), page names
- `components/brand-editor.tsx`: the add/edit brand form used everywhere
