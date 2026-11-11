"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// A filming prop for the "BMW M4 in 30 days" format: a car wheel that always
// lands on the target car (BMW M4 unless ?car= names another one on the wheel).
// What makes it engaging on camera:
//   - a wind-up pull-back before the release
//   - a pointer that flaps on every peg, with a tick sound per peg
//   - motion blur at speed and chasing rim lights
//   - a long slow-down that hangs on the car before the target, then creeps
//     over the edge into it (the near miss)
//   - a reveal: everything else dims, the rim flashes, confetti and a chord
// Keys: Space spins, H hides the controls, B switches the background
// (dark, green screen for keying, white), M mutes.

const SEG_COLORS = ["#DC2626", "#18181B", "#EA580C", "#27272A", "#2563EB", "#18181B", "#059669", "#27272A", "#7C3AED", "#18181B"];

/** splits a car name into a small make line and a big model line */
function label(name: string): [string, string] {
  const known: Record<string, [string, string]> = {
    "BMW M4": ["BMW", "M4"],
    "Porsche 911": ["Porsche", "911"],
    "G-Wagon": ["Mercedes", "G-Wagon"],
    "Lamborghini Urus": ["Lamborghini", "Urus"],
    "Range Rover Sport": ["Range Rover", "Sport"],
    "Audi RS6": ["Audi", "RS6"],
    "Mercedes-AMG C63": ["Mercedes-AMG", "C63"],
    "Nissan GT-R": ["Nissan", "GT-R"],
    "Toyota Supra": ["Toyota", "Supra"],
    "Tesla Model S Plaid": ["Tesla", "S Plaid"],
  };
  if (known[name]) return known[name];
  const i = name.indexOf(" ");
  return i < 0 ? ["", name] : [name.slice(0, i), name.slice(i + 1)];
}

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
    o.frequency.setValueAtTime(1700 - slow * 700, t);
    o.frequency.exponentialRampToValueAtTime(400, t + 0.03);
    g.gain.setValueAtTime(0.05 + slow * 0.1, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    o.connect(g).connect(c.destination);
    o.start(t);
    o.stop(t + 0.06);
  };
  const whoosh = () => {
    const c = get();
    if (!c) return;
    const t = c.currentTime;
    const buf = c.createBuffer(1, c.sampleRate * 0.6, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const s = c.createBufferSource();
    s.buffer = buf;
    const f = c.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.setValueAtTime(300, t);
    f.frequency.exponentialRampToValueAtTime(2500, t + 0.5);
    const g = c.createGain();
    g.gain.setValueAtTime(0.25, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    s.connect(f).connect(g).connect(c.destination);
    s.start(t);
  };
  const win = () => {
    const c = get();
    if (!c) return;
    const t = c.currentTime;
    // low boom
    const b = c.createOscillator();
    const bg = c.createGain();
    b.type = "sine";
    b.frequency.setValueAtTime(140, t);
    b.frequency.exponentialRampToValueAtTime(40, t + 0.5);
    bg.gain.setValueAtTime(0.5, t);
    bg.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    b.connect(bg).connect(c.destination);
    b.start(t);
    b.stop(t + 0.7);
    // rising arpeggio into a held chord
    [523.25, 659.25, 783.99, 1046.5].forEach((hz, i) => {
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = "triangle";
      o.frequency.value = hz;
      const at = t + 0.08 + i * 0.09;
      g.gain.setValueAtTime(0, at);
      g.gain.linearRampToValueAtTime(0.14, at + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, at + 1.6);
      o.connect(g).connect(c.destination);
      o.start(at);
      o.stop(at + 1.7);
    });
  };
  return { tick, whoosh, win, muted };
}

// ---------- confetti ----------

function burst(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const dpr = window.devicePixelRatio || 1;
  const w = (canvas.width = window.innerWidth * dpr);
  const h = (canvas.height = window.innerHeight * dpr);
  const colors = ["#FACC15", "#FFFFFF", "#DC2626", "#2563EB", "#F97316", "#22C55E"];
  const parts = Array.from({ length: 220 }, (_, i) => {
    const fromLeft = i % 2 === 0;
    const a = (fromLeft ? -60 : -120) + (Math.random() - 0.5) * 50;
    const v = (14 + Math.random() * 16) * dpr;
    return {
      x: fromLeft ? 0 : w,
      y: h * 0.75,
      vx: Math.cos((a * Math.PI) / 180) * v,
      vy: Math.sin((a * Math.PI) / 180) * v,
      s: (6 + Math.random() * 8) * dpr,
      r: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.4,
      c: colors[i % colors.length],
    };
  });
  let frame = 0;
  const step = () => {
    frame++;
    ctx.clearRect(0, 0, w, h);
    for (const p of parts) {
      p.vy += 0.45 * dpr;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2 * Math.abs(Math.cos(p.r * 2)) + 1);
      ctx.restore();
    }
    if (frame < 260) requestAnimationFrame(step);
    else ctx.clearRect(0, 0, w, h);
  };
  requestAnimationFrame(step);
}

// ---------- the wheel ----------

const SIZE = 1000;
const C = SIZE / 2;
const R = 440; // segment radius
const pt = (deg: number, r: number) => [C + r * Math.sin((deg * Math.PI) / 180), C - r * Math.cos((deg * Math.PI) / 180)];
const mod = (a: number, n: number) => ((a % n) + n) % n;

type Phase = "idle" | "spinning" | "won";
const BACKGROUNDS = [
  { name: "Dark", css: "radial-gradient(ellipse at center, #26262b 0%, #09090b 70%)", ink: "#fff" },
  { name: "Green screen", css: "#00B140", ink: "#fff" },
  { name: "White", css: "#ffffff", ink: "#0A0A0A" },
];

export function SpinWheel({ cars, target }: { cars: string[]; target: string }) {
  const n = cars.length;
  const seg = 360 / n;
  const targetIdx = Math.max(0, cars.indexOf(target));

  const wheelRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<SVGGElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const confettiRef = useRef<HTMLCanvasElement>(null);
  const rot = useRef(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [controls, setControls] = useState(true);
  const [bg, setBg] = useState(0);
  const [muted, setMuted] = useState(false);
  const [caption, setCaption] = useState("What car am I getting in 30 days?");
  const sound = useSound();
  sound.muted.current = muted;

  const setRot = (deg: number, blur = 0) => {
    rot.current = deg;
    const el = wheelRef.current;
    if (!el) return;
    el.style.transform = `rotate(${deg}deg)`;
    el.style.filter = blur > 0.3 ? `blur(${blur.toFixed(2)}px)` : "none";
  };

  const flap = (speed: number) => {
    pointerRef.current?.animate([{ transform: `rotate(${-14 - Math.min(speed, 1) * 16}deg)` }, { transform: "rotate(0deg)" }], {
      duration: 90 + (1 - Math.min(speed, 1)) * 200,
      easing: "cubic-bezier(.2,1.6,.4,1)",
    });
  };

  const spin = useCallback(() => {
    if (phase === "spinning") return;
    setPhase("spinning");
    sound.whoosh();

    const start = rot.current;
    const windup = 16;
    const windupMs = 520;
    // land just past the edge we enter from (the wheel turns clockwise, so the
    // pointer moves through each segment from its end towards its start)
    const into = 0.08 + Math.random() * 0.08;
    const landAt = (targetIdx + 1 - into) * seg; // wheel angle under the pointer
    const turns = 7 + Math.floor(Math.random() * 2);
    const base = start - windup;
    let end = base + turns * 360;
    end += mod(-landAt - end, 360);
    const total = end - base;
    const dur = 7000 + Math.random() * 800;

    let t0 = 0;
    let lastPeg = Math.floor(start / seg);
    let lastR = start;
    let lastT = 0;
    const frame = (now: number) => {
      if (!t0) t0 = lastT = now;
      const el = now - t0;
      let r: number;
      if (el < windupMs) {
        const k = el / windupMs;
        r = start - windup * (0.5 - Math.cos(Math.PI * k) / 2);
      } else {
        const k = Math.min(1, (el - windupMs) / dur);
        r = base + total * (1 - Math.pow(1 - k, 4));
      }
      const dt = Math.max(1, now - lastT);
      const v = Math.abs(r - lastR) / dt; // deg per ms
      lastR = r;
      lastT = now;
      setRot(r, Math.min(6, v * 3.2));
      const peg = Math.floor(r / seg);
      if (peg !== lastPeg) {
        lastPeg = peg;
        const speed = Math.min(1, v / 0.6);
        flap(speed);
        sound.tick(1 - speed);
      }
      if (el < windupMs + dur) requestAnimationFrame(frame);
      else {
        setRot(end);
        setTimeout(() => {
          setPhase("won");
          sound.win();
          if (confettiRef.current) burst(confettiRef.current);
          stageRef.current?.animate(
            [{ transform: "translate(0,0) scale(1)" }, { transform: "translate(-6px,4px) scale(1.03)" }, { transform: "translate(5px,-3px) scale(1.02)" }, { transform: "translate(0,0) scale(1)" }],
            { duration: 420, easing: "ease-out" },
          );
        }, 280);
      }
    };
    requestAnimationFrame(frame);
  }, [phase, seg, targetIdx, sound]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.isContentEditable) return;
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

  const segments = useMemo(
    () =>
      cars.map((car, i) => {
        const a0 = i * seg;
        const a1 = (i + 1) * seg;
        const [x0, y0] = pt(a0, R);
        const [x1, y1] = pt(a1, R);
        const d = `M${C},${C} L${x0},${y0} A${R},${R} 0 0 1 ${x1},${y1} Z`;
        return { car, i, d, mid: a0 + seg / 2, color: SEG_COLORS[i % SEG_COLORS.length], lines: label(car) };
      }),
    [cars, seg],
  );

  const won = phase === "won";
  const B = BACKGROUNDS[bg];
  const bulbs = 36;

  return (
    <div className="fixed inset-0 flex select-none flex-col items-center justify-center overflow-hidden" style={{ background: B.css, color: B.ink }}>
      <style>{`
        @keyframes sw-chase { 0%,100% { opacity: .25 } 33% { opacity: 1 } }
        @keyframes sw-blink { 0%,49% { opacity: 1 } 50%,100% { opacity: .2 } }
        @keyframes sw-glow { 0%,100% { opacity: .55 } 50% { opacity: 1 } }
        @keyframes sw-pop { 0% { transform: scale(.3) rotate(-6deg); opacity: 0 } 60% { transform: scale(1.12) rotate(1deg); opacity: 1 } 100% { transform: scale(1) rotate(0) } }
        @keyframes sw-pulse { 0%,100% { transform: scale(1) } 50% { transform: scale(1.04) } }
        .sw-bulb { animation: sw-chase 1.8s infinite }
        [data-phase=spinning] .sw-bulb { animation-duration: .36s }
        [data-phase=won] .sw-bulb { animation: sw-blink .3s steps(1) infinite }
        [data-phase=won] .sw-bulb:nth-child(odd) { animation-delay: .15s }
        .sw-win { animation: sw-glow .6s ease-in-out infinite }
        .sw-banner { animation: sw-pop .55s cubic-bezier(.2,1.4,.4,1) both, sw-pulse 1.4s .6s ease-in-out infinite }
        .sw-spin-btn:hover { filter: brightness(1.1) }
      `}</style>

      <canvas ref={confettiRef} className="pointer-events-none fixed inset-0 z-30 h-full w-full" />

      <h1
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => setCaption(e.currentTarget.textContent || "")}
        className="z-10 mb-[6vmin] max-w-[90vw] rounded-lg px-3 text-center text-[clamp(22px,4.6vmin,52px)] font-extrabold leading-tight tracking-tight outline-none focus:ring-2 focus:ring-yellow-400"
        style={{ textShadow: bg === 2 ? "none" : "0 3px 12px rgba(0,0,0,.45)" }}
      >
        {caption}
      </h1>

      <div ref={stageRef} data-phase={phase} className="relative aspect-square w-[min(92vw,78vh,760px)]">
        {/* the turning part */}
        <div ref={wheelRef} className="absolute inset-0 will-change-transform" style={{ transform: "rotate(0deg)" }}>
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-full w-full">
            <defs>
              <radialGradient id="sw-shade" cx="50%" cy="50%" r="50%">
                <stop offset="55%" stopColor="#000" stopOpacity="0" />
                <stop offset="100%" stopColor="#000" stopOpacity=".35" />
              </radialGradient>
              <linearGradient id="sw-gold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FDE68A" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>
            </defs>
            {segments.map((s) => {
              const isWin = won && s.i === targetIdx;
              return (
                <g key={s.car} style={{ opacity: won && !isWin ? 0.28 : 1, transition: "opacity .5s" }}>
                  <path d={s.d} fill={isWin ? "url(#sw-gold)" : s.color} stroke="#0a0a0a" strokeWidth={3} />
                  <g transform={`rotate(${s.mid} ${C} ${C})`}>
                    <g transform={`rotate(-90 ${C} ${C - R * 0.58})`}>
                      {s.lines[0] && (
                        <text x={C} y={C - R * 0.58 - 20} textAnchor="middle" fontSize={26} fontWeight={600} fill={isWin ? "#3b1d00" : "rgba(255,255,255,.75)"} style={{ letterSpacing: 1, textTransform: "uppercase" }}>
                          {s.lines[0]}
                        </text>
                      )}
                      <text x={C} y={C - R * 0.58 + 26} textAnchor="middle" fontSize={s.lines[1].length > 6 ? 40 : 52} fontWeight={900} fill={isWin ? "#1c0d00" : "#fff"}>
                        {s.lines[1]}
                      </text>
                    </g>
                  </g>
                </g>
              );
            })}
            {segments.map((s) => {
              const [x, y] = pt(s.i * seg, R - 14);
              return <circle key={`peg${s.i}`} cx={x} cy={y} r={9} fill="url(#sw-gold)" stroke="#78350f" strokeWidth={2} />;
            })}
            <circle cx={C} cy={C} r={R} fill="url(#sw-shade)" pointerEvents="none" />
            {won && (
              <path
                className="sw-win"
                d={segments[targetIdx].d}
                fill="none"
                stroke="#FDE047"
                strokeWidth={14}
                strokeLinejoin="round"
                style={{ filter: "drop-shadow(0 0 18px #FACC15)" }}
              />
            )}
          </svg>
        </div>

        {/* the still parts: rim with lights, hub, pointer */}
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
          <circle cx={C} cy={C} r={R + 24} fill="none" stroke="#0a0a0a" strokeWidth={44} />
          <circle cx={C} cy={C} r={R + 3} fill="none" stroke="url(#sw-gold)" strokeWidth={6} />
          <circle cx={C} cy={C} r={R + 46} fill="none" stroke="url(#sw-gold)" strokeWidth={6} />
          <g>
            {Array.from({ length: bulbs }, (_, i) => {
              const [x, y] = pt((i * 360) / bulbs + 5, R + 24);
              return (
                <circle
                  key={i}
                  className="sw-bulb"
                  cx={x}
                  cy={y}
                  r={9}
                  fill="#FEF9C3"
                  style={{ animationDelay: `${-(i % 3) * (phase === "spinning" ? 0.12 : 0.6)}s`, filter: "drop-shadow(0 0 6px #FACC15)" }}
                />
              );
            })}
          </g>
        </svg>

        <button
          onClick={spin}
          disabled={phase === "spinning"}
          aria-label="Spin the wheel"
          className="sw-spin-btn absolute left-1/2 top-1/2 z-10 grid aspect-square w-[17%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[5px] border-amber-400 text-[clamp(12px,2.6vmin,24px)] font-black tracking-wider text-white shadow-[0_6px_24px_rgba(0,0,0,.5),inset_0_-6px_12px_rgba(0,0,0,.4)] transition disabled:cursor-default"
          style={{ background: "radial-gradient(circle at 35% 30%, #3f3f46, #09090b)" }}
        >
          {phase === "spinning" ? "" : won ? "AGAIN" : "SPIN"}
        </button>

        {/* pointer: pivots at its top, flaps on each peg */}
        <svg viewBox="0 0 100 130" className="pointer-events-none absolute left-1/2 top-[-4.5%] z-20 w-[9%] -translate-x-1/2 overflow-visible">
          <g ref={pointerRef} style={{ transformOrigin: "50px 22px", transformBox: "view-box" }}>
            <path d="M50 124 L16 30 A36 36 0 1 1 84 30 Z" fill="#DC2626" stroke="#fff" strokeWidth={6} strokeLinejoin="round" style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,.5))" }} />
            <circle cx={50} cy={22} r={11} fill="#fff" />
          </g>
        </svg>

        {won && (
          <div className="pointer-events-none absolute inset-x-[-6%] top-1/2 z-20 -translate-y-1/2 text-center">
            <div
              className="sw-banner mx-auto inline-block rounded-2xl px-[5vmin] py-[2vmin] text-[#1c0d00] shadow-[0_10px_40px_rgba(0,0,0,.55)]"
              style={{ background: "linear-gradient(135deg,#FDE68A,#F59E0B 55%,#D97706)" }}
            >
              <div className="text-[clamp(30px,10vmin,110px)] font-black leading-none tracking-tight">{target}</div>
              <div className="mt-[1vmin] text-[clamp(14px,3.2vmin,34px)] font-extrabold uppercase tracking-[.2em]">in 30 days</div>
            </div>
          </div>
        )}
      </div>

      {!controls && (
        <button className="fixed bottom-0 right-0 z-40 h-14 w-14 opacity-0" onClick={() => setControls(true)} aria-label="Show controls" />
      )}
      {controls && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex flex-wrap items-center justify-center gap-2 p-3 text-[13px] text-white">
          <div className="flex flex-wrap items-center gap-2 rounded-xl bg-black/70 px-3 py-2 backdrop-blur">
            <button className="rounded-lg bg-amber-400 px-3 py-1.5 font-bold text-black disabled:opacity-50" onClick={spin} disabled={phase === "spinning"}>
              Spin (Space)
            </button>
            <button className="rounded-lg bg-white/10 px-3 py-1.5 hover:bg-white/20" onClick={() => setBg((b) => (b + 1) % BACKGROUNDS.length)}>
              Background: {B.name} (B)
            </button>
            <button className="rounded-lg bg-white/10 px-3 py-1.5 hover:bg-white/20" onClick={() => setMuted((m) => !m)}>
              Sound: {muted ? "off" : "on"} (M)
            </button>
            <button className="rounded-lg bg-white/10 px-3 py-1.5 hover:bg-white/20" onClick={() => setControls(false)}>
              Hide for filming (H)
            </button>
            <span className="text-white/60">Lands on {target} · tap the title to edit it</span>
          </div>
        </div>
      )}
    </div>
  );
}
