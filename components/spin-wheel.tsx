"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// A filming prop for the "BMW M4 in 30 days" format, in the style of the
// original video: a blue panel with car names rolling past a highlight box,
// that always stops on the target car (BMW M4 unless ?car= says otherwise).
// What makes it engaging on camera:
//   - a short pull-back before it goes
//   - motion blur and a tick sound for every name that passes the box
//   - a long slow-down that crawls off the car before it and into the target
//   - a little overshoot and settle, then the box flashes gold with a chord
// Keys: Space spins, H hides the controls, B switches the background
// (dark, green screen for keying), M mutes.

// ---------- sound (Web Audio, made on the first tap so browsers allow it) ----------

function useSound() {
  const ctx = useRef<AudioContext | null>(null);
  const muted = useRef(false);
  const get = () => {
    if (muted.current) return null;
    if (!ctx.current) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctx.current = new AC();
    }
    if (ctx.current.state === "suspended") ctx.current.resume();
    return ctx.current;
  };
  const tick = (slow: number) => {
    const c = get();
    if (!c) return;
    const t = c.currentTime;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = "square";
    // slower ticks get lower and louder: the tension builds as it crawls
    o.frequency.setValueAtTime(1600 - slow * 700, t);
    o.frequency.exponentialRampToValueAtTime(400, t + 0.03);
    g.gain.setValueAtTime(0.04 + slow * 0.1, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    o.connect(g).connect(c.destination);
    o.start(t);
    o.stop(t + 0.06);
  };
  const win = () => {
    const c = get();
    if (!c) return;
    const t = c.currentTime;
    const b = c.createOscillator();
    const bg = c.createGain();
    b.type = "sine";
    b.frequency.setValueAtTime(140, t);
    b.frequency.exponentialRampToValueAtTime(40, t + 0.5);
    bg.gain.setValueAtTime(0.45, t);
    bg.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    b.connect(bg).connect(c.destination);
    b.start(t);
    b.stop(t + 0.7);
    [523.25, 659.25, 783.99, 1046.5].forEach((hz, i) => {
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = "triangle";
      o.frequency.value = hz;
      const at = t + 0.06 + i * 0.08;
      g.gain.setValueAtTime(0, at);
      g.gain.linearRampToValueAtTime(0.13, at + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, at + 1.5);
      o.connect(g).connect(c.destination);
      o.start(at);
      o.stop(at + 1.6);
    });
  };
  return { tick, win, muted };
}

// ---------- the reel ----------

type Phase = "idle" | "spinning" | "won";
const BACKGROUNDS = [
  { name: "Dark", css: "radial-gradient(ellipse at center, #1a2250 0%, #05071a 75%)" },
  { name: "Green screen", css: "#00B140" },
];
const VISIBLE = 5; // rows on show; the middle one is in the box
const REPS = 14; // copies of the list in the strip, so it can roll a long way
const mod = (a: number, n: number) => ((a % n) + n) % n;

export function SpinWheel({ cars, target }: { cars: string[]; target: string }) {
  const n = cars.length;
  const targetIdx = Math.max(0, cars.indexOf(target));
  const home = n * 2; // strip position the reel goes back to before each spin

  const stripRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const pos = useRef(home + mod(targetIdx - 3, n)); // which row sits in the box (fractional)
  const [centre, setCentre] = useState(pos.current);
  const [phase, setPhase] = useState<Phase>("idle");
  const [controls, setControls] = useState(true);
  const [bg, setBg] = useState(0);
  const [muted, setMuted] = useState(false);
  const sound = useSound();
  sound.muted.current = muted;

  const place = (p: number, blur = 0) => {
    pos.current = p;
    const el = stripRef.current;
    if (!el) return;
    el.style.transform = `translateY(calc(${-(p - (VISIBLE - 1) / 2)} * var(--row)))`;
    el.style.filter = blur > 0.3 ? `blur(${blur.toFixed(2)}px)` : "none";
  };

  useEffect(() => {
    place(pos.current);
  }, []);

  const spin = useCallback(() => {
    if (phase === "spinning") return;
    setPhase("spinning");

    // same name in the box, but back near the top of the strip
    const start = home + mod(Math.round(pos.current) - home, n);
    place(start);
    setCentre(start);
    const windup = 0.35;
    const windupMs = 380;
    const base = start - windup;
    const loops = 4 + Math.floor(Math.random() * 2);
    let end = home + targetIdx;
    while (end - base < loops * n) end += n;
    const overshoot = 0.12; // rolls a touch past, then settles back
    const total = end + overshoot - base;
    const dur = 6200 + Math.random() * 900;
    const settleMs = 420;

    let t0 = 0;
    let lastRow = start;
    let lastP = start;
    let lastT = 0;
    const frame = (now: number) => {
      if (!t0) t0 = lastT = now;
      const el = now - t0;
      let p: number;
      if (el < windupMs) {
        p = start - windup * Math.sin((Math.PI / 2) * (el / windupMs));
      } else if (el < windupMs + dur) {
        const k = (el - windupMs) / dur;
        p = base + total * (1 - Math.pow(1 - k, 4));
      } else {
        const k = Math.min(1, (el - windupMs - dur) / settleMs);
        p = end + overshoot * (1 - (1 - Math.cos(Math.PI * k)) / 2);
      }
      const dt = Math.max(1, now - lastT);
      const v = Math.abs(p - lastP) / dt; // rows per ms
      lastP = p;
      lastT = now;
      place(p, Math.min(5, v * 90));
      const row = Math.round(p);
      if (row !== lastRow) {
        lastRow = row;
        setCentre(row);
        sound.tick(1 - Math.min(1, v / 0.03));
      }
      if (el < windupMs + dur + settleMs) requestAnimationFrame(frame);
      else {
        place(end);
        setCentre(end);
        setPhase("won");
        sound.win();
        boxRef.current?.animate([{ transform: "scale(1)" }, { transform: "scale(1.08)" }, { transform: "scale(1)" }], { duration: 380, easing: "ease-out" });
      }
    };
    requestAnimationFrame(frame);
  }, [phase, home, n, targetIdx, sound]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        spin();
      } else if (e.key === "h" || e.key === "H") setControls((s) => !s);
      else if (e.key === "b" || e.key === "B") setBg((b) => (b + 1) % BACKGROUNDS.length);
      else if (e.key === "m" || e.key === "M") setMuted((m) => !m);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [spin]);

  const won = phase === "won";
  const strip = Array.from({ length: n * REPS }, (_, i) => cars[i % n]);

  return (
    <div className="fixed inset-0 flex select-none items-center justify-center overflow-hidden" style={{ background: BACKGROUNDS[bg].css }}>
      <style>{`
        @keyframes sr-flash { 0%,100% { box-shadow: 0 0 0 0 rgba(250,204,21,0), inset 0 0 18px rgba(250,204,21,.25) } 50% { box-shadow: 0 0 28px 4px rgba(250,204,21,.7), inset 0 0 28px rgba(250,204,21,.45) } }
        .sr-won { border-color: #FACC15 !important; animation: sr-flash .7s ease-in-out infinite }
      `}</style>

      <div
        onClick={spin}
        className="relative w-[min(86vw,520px)] cursor-pointer overflow-hidden rounded-xl"
        style={
          {
            "--row": "min(9vh, 15vw, 64px)",
            height: `calc(${VISIBLE} * var(--row))`,
            background: "linear-gradient(180deg, rgba(30,44,120,.92), rgba(22,32,96,.92))",
            boxShadow: "0 20px 60px rgba(0,0,0,.45)",
          } as React.CSSProperties
        }
      >
        {/* names fade out towards the top and bottom edge */}
        <div
          className="absolute inset-0"
          style={{
            WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 30%, #000 70%, transparent 100%)",
            maskImage: "linear-gradient(180deg, transparent 0%, #000 30%, #000 70%, transparent 100%)",
          }}
        >
          <div ref={stripRef} className="will-change-transform">
            {strip.map((car, i) => {
              const inBox = i === centre;
              return (
                <div
                  key={i}
                  className="flex items-center justify-center font-bold text-white"
                  style={{
                    height: "var(--row)",
                    fontSize: "calc(var(--row) * .36)",
                    opacity: won && !inBox ? 0.45 : 1,
                    transform: won && inBox ? "scale(1.15)" : "none",
                    transition: "opacity .4s, transform .4s cubic-bezier(.2,1.6,.4,1)",
                    textShadow: "0 2px 6px rgba(0,0,0,.35)",
                  }}
                >
                  {car}
                </div>
              );
            })}
          </div>
        </div>

        {/* the highlight box */}
        <div
          ref={boxRef}
          className={`pointer-events-none absolute inset-x-[16%] rounded-md border-2 transition-colors ${won ? "sr-won" : ""}`}
          style={{ top: `calc(${(VISIBLE - 1) / 2} * var(--row) + var(--row) * .08)`, height: "calc(var(--row) * .84)", borderColor: "rgba(244,200,200,.75)" }}
        />
      </div>

      {!controls && <button className="fixed bottom-0 right-0 z-40 h-14 w-14 opacity-0" onClick={() => setControls(true)} aria-label="Show controls" />}
      {controls && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center p-3 text-[13px] text-white">
          <div className="flex flex-wrap items-center justify-center gap-2 rounded-xl bg-black/70 px-3 py-2 backdrop-blur">
            <button className="rounded-lg bg-amber-400 px-3 py-1.5 font-bold text-black disabled:opacity-50" onClick={spin} disabled={phase === "spinning"}>
              Spin (Space)
            </button>
            <button className="rounded-lg bg-white/10 px-3 py-1.5 hover:bg-white/20" onClick={() => setBg((b) => (b + 1) % BACKGROUNDS.length)}>
              Background: {BACKGROUNDS[bg].name} (B)
            </button>
            <button className="rounded-lg bg-white/10 px-3 py-1.5 hover:bg-white/20" onClick={() => setMuted((m) => !m)}>
              Sound: {muted ? "off" : "on"} (M)
            </button>
            <button className="rounded-lg bg-white/10 px-3 py-1.5 hover:bg-white/20" onClick={() => setControls(false)}>
              Hide for filming (H)
            </button>
            <span className="text-white/60">Lands on {target}</span>
          </div>
        </div>
      )}
    </div>
  );
}
