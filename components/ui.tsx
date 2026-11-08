import type { ReactNode } from "react";
import { Plug } from "lucide-react";
import { brandById, type Platform } from "@/lib/mock";

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("rounded-card border border-line bg-white", className)}>{children}</div>;
}

export function Button({
  children,
  variant = "outline",
  className,
  ...rest
}: { variant?: "primary" | "outline" | "soft" } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const look = {
    primary: "bg-brand text-white hover:bg-brand-hover border-transparent",
    outline: "bg-white text-ink border-line hover:bg-side",
    soft: "bg-brand-wash text-brand-text border-transparent hover:brightness-95",
  }[variant];
  return (
    <button
      {...rest}
      className={cx(
        "inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border px-3 text-[13px] font-medium transition disabled:opacity-50",
        look,
        className,
      )}
    >
      {children}
    </button>
  );
}

export function PageHeader({ title, sub, children }: { title: string; sub?: ReactNode; children?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h1 className="text-2xl font-semibold tracking-[-0.01em]">{title}</h1>
        {sub && <div className="text-sm text-muted">{sub}</div>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}

/** The brand's logo on a rounded square, like the real campaigns list. */
export function BrandTile({ id, size = 36 }: { id: string; size?: number }) {
  const b = brandById(id);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={b.logo}
      alt=""
      width={size}
      height={size}
      className="shrink-0 rounded-[9px] border border-black/5 bg-white object-cover"
      style={{ width: size, height: size, borderRadius: size * 0.25 }}
    />
  );
}

const platformFile: Record<Platform, string> = { tiktok: "tiktok.svg", instagram: "ig.svg", youtube: "yt.svg", facebook: "fb.png" };

export function PlatformIcon({ p, size = 16 }: { p: Platform; size?: number }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/platforms/${platformFile[p]}`} alt={p} width={size} height={size} className="inline-block shrink-0" style={{ width: size, height: size }} />;
}

/**
 * Marks a part of the page that only shows the look. The real version needs
 * its own hookup (an api, a worker, an extension), so the button does nothing.
 */
export function NotHooked({ what }: { what: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-dashed border-[#D9C9F5] bg-[#FAF7FF] px-3.5 py-2.5 text-[13px] text-[#5B3FA0]">
      <Plug size={15} className="mt-0.5 shrink-0" />
      <span>
        <b className="font-semibold">look only.</b> {what}
      </span>
    </div>
  );
}

export function Dot({ color }: { color: string }) {
  return <span className="inline-block h-2 w-2 rounded-full" style={{ background: color }} />;
}

export function Stat({ label, value, sub, green }: { label: string; value: ReactNode; sub?: ReactNode; green?: boolean }) {
  return (
    <div>
      <div className="text-[13px] text-muted">{label}</div>
      <div className={cx("mt-1 text-[22px] font-semibold tracking-tight", green && "text-money")}>{value}</div>
      {sub && <div className="mt-0.5 text-xs text-muted">{sub}</div>}
    </div>
  );
}

export const money = (n: number) => "$" + n.toLocaleString("en-US");
