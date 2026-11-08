"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  AtSign,
  CalendarCheck,
  ChevronDown,
  ChevronRight,
  CircleUser,
  Clapperboard,
  Flame,
  Home,
  Layers,
  Lightbulb,
  Compass,
  HelpCircle,
  Megaphone,
  Menu,
  Moon,
  Plus,
  Settings,
  Mic,
  PenTool,
  Search,
  Timer,
  Video,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import { user } from "@/lib/mock";
import { cx } from "./ui";

type Item = { href: string; label: string; icon: LucideIcon; tint?: string };

const top: Item[] = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/campaigns", label: "Campaigns", icon: Megaphone },
];

const create: Item[] = [
  { href: "/ideation", label: "Ideation", icon: Lightbulb, tint: "#CA8A04" },
  { href: "/film", label: "Film", icon: Video, tint: "#DC2626" },
  { href: "/editing", label: "Editing", icon: Clapperboard, tint: "#7C3AED" },
  { href: "/scheduler", label: "Scheduler", icon: CalendarCheck, tint: "#059669" },
  { href: "/variations", label: "Variations", icon: Layers, tint: "#2563EB" },
];

const tools: Item[] = [
  { href: "/accounts", label: "Accounts", icon: CircleUser, tint: "#2563EB" },
  { href: "/transcribe", label: "Transcribe", icon: Mic, tint: "#0891B2" },
  { href: "/emails", label: "Emails", icon: AtSign, tint: "#DB2777" },
  { href: "/warm-up", label: "Warm-up", icon: Flame, tint: "#EA580C" },
  { href: "/timer", label: "Timer", icon: Timer, tint: "#65A30D" },
];

const all = [...top, ...create, ...tools];

function isActive(path: string, href: string) {
  return href === "/" ? path === "/" : path.startsWith(href);
}

// The 5x5 grid "v" mark. Lit squares spell the v; swap for your own mark.
const LIT = new Set([0, 4, 5, 9, 11, 13, 16, 18, 22]);
function Logo() {
  return (
    <svg width="20" height="20" viewBox="-1 -1 60 60" aria-hidden className="shrink-0 text-brand">
      {Array.from({ length: 25 }).map((_, i) => (
        <rect key={i} x={(i % 5) * 12} y={Math.floor(i / 5) * 12} width="10" height="10" rx="2.6" fill="currentColor" opacity={LIT.has(i) ? 1 : 0.22} />
      ))}
    </svg>
  );
}

function Row({ item, path, nested, onGo }: { item: Item; path: string; nested?: boolean; onGo: () => void }) {
  const Icon = item.icon;
  const active = isActive(path, item.href);
  return (
    <Link
      href={item.href}
      onClick={onGo}
      className={cx(
        "flex h-8 items-center gap-2 rounded-[7px] px-2.5 text-[14.5px] text-[#18181B] transition",
        active ? "bg-[#E8E8EA] font-medium" : "hover:bg-[#EDEDEF]",
      )}
    >
      {item.tint ? (
        <span
          className="flex h-5 w-5 items-center justify-center rounded-[5px]"
          style={{ background: item.tint + "1A", color: item.tint }}
        >
          <Icon size={12} strokeWidth={2} />
        </span>
      ) : (
        <Icon size={17} strokeWidth={1.7} className="text-[#3F3F46]" />
      )}
      <span>{item.label}</span>
    </Link>
  );
}

function Group({ label, icon: Icon, items, path, onGo }: { label: string; icon: LucideIcon; items: Item[]; path: string; onGo: () => void }) {
  const holdsActive = items.some((i) => isActive(path, i.href));
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={cx(
          "flex h-8 w-full items-center gap-2 rounded-[7px] px-2.5 text-[14.5px] font-medium text-[#18181B] hover:bg-[#EDEDEF]",
          holdsActive && !open && "bg-[#E8E8EA]",
        )}
      >
        <span
          className="flex h-[22px] w-[22px] items-center justify-center rounded-[6px] text-[#18181B]"
          style={{ background: "linear-gradient(135deg, rgba(76,239,219,.3), rgba(0,189,171,.26), rgba(0,128,117,.22))" }}
        >
          <Icon size={13} strokeWidth={1.8} />
        </span>
        <span className="flex-1 text-left">{label}</span>
        {open ? <ChevronDown size={16} className="text-muted" /> : <ChevronRight size={16} className="text-muted" />}
      </button>
      {open && (
        <div className="ml-[21px] mt-0.5 space-y-0.5 border-l border-[#E4E4E7] pl-2">
          {items.map((i) => (
            <Row key={i.href} item={i} path={path} nested onGo={onGo} />
          ))}
        </div>
      )}
    </div>
  );
}

function Sidebar({ path, onGo }: { path: string; onGo: () => void }) {
  return (
    <div className="flex h-full flex-col px-3 pb-3 pt-[5px]">
      <div className="mb-2 flex h-8 items-center gap-2 pl-2.5 pr-0.5">
        <Logo />
        <span className="flex-1 text-[15px] font-semibold tracking-[-0.01em]">Velocity Creators</span>
      </div>
      <div className="mb-3 flex h-8 items-center gap-2 rounded-lg border border-[#E5E5E9] bg-white pl-2.5 pr-1.5 text-sm text-[#8C8C96]">
        <Search size={15} /> Search
        <span className="ml-auto flex gap-1">
          <kbd className="rounded border border-[#E5E5E9] px-1 font-sans text-[11px]">⌘</kbd>
          <kbd className="rounded border border-[#E5E5E9] px-1 font-sans text-[11px]">K</kbd>
        </span>
      </div>
      <nav className="no-scrollbar flex-1 space-y-0.5 overflow-y-auto">
        {top.map((i) => (
          <Row key={i.href} item={i} path={path} onGo={onGo} />
        ))}
        <div className="px-2.5 pb-1.5 pt-3.5 text-[12.5px] font-medium text-[#8C8C96]">Workspace</div>
        <Group label="Create" icon={PenTool} items={create} path={path} onGo={onGo} />
        <Group label="Tools" icon={Wrench} items={tools} path={path} onGo={onGo} />
      </nav>
      <div className="mt-3 flex items-center gap-2.5 px-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand to-[#2E8C79] text-xs font-semibold text-white">
          {user.initials}
        </span>
        <div className="flex-1 leading-tight">
          <div className="text-sm font-semibold">{user.first}</div>
          <div className="text-xs text-muted">{user.handle}</div>
        </div>
        <Settings size={17} className="text-[#52525B]" />
        <Moon size={17} className="ml-2 text-[#52525B]" />
      </div>
    </div>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const [menu, setMenu] = useState(false);
  const current = all.find((i) => isActive(path, i.href)) ?? top[0];
  const CurrentIcon = current.icon;

  return (
    <div className="flex h-screen">
      <aside className="hidden w-[262px] shrink-0 md:block">
        <Sidebar path={path} onGo={() => {}} />
      </aside>
      {menu && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMenu(false)} />
          <div className="absolute inset-y-0 left-0 w-[270px] bg-page shadow-xl">
            <Sidebar path={path} onGo={() => setMenu(false)} />
          </div>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col pb-2 pr-2 pt-[5px] max-md:pl-2">
        <div className="mb-[6px] flex h-8 items-center gap-1.5">
          <button className="rounded-lg p-1.5 hover:bg-[#EDEDEF] md:hidden" onClick={() => setMenu(true)} aria-label="menu">
            {menu ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div className="flex h-8 w-[200px] items-center gap-2.5 rounded-[9px] border border-[#ECECEF] bg-white pl-[11px] pr-2.5 text-[13px] font-medium text-[#18181B]">
            <CurrentIcon size={16} className="text-[#5B5B65]" />
            {current.label}
          </div>
          <Plus size={16} className="ml-2 text-[#A1A1AA]" />
          <div className="ml-auto flex items-center gap-3 pr-1.5 text-[#52525B]">
            <HelpCircle size={18} strokeWidth={1.7} />
            <Compass size={18} strokeWidth={1.7} />
          </div>
        </div>
        <main className="min-h-0 flex-1 overflow-y-auto rounded-[10px] border border-[#E5E5E9] bg-white shadow-[0_1px_2px_rgba(17,17,26,0.05)]">
          <div className="mx-auto max-w-[1180px] px-4 py-6 md:px-6">
            {children}
            <p className="mt-10 text-center text-xs text-[#A1A1AA]">free template. sample numbers. parts marked "look only" are yours to hook up.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
