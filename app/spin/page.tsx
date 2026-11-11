"use client";

import { useEffect, useState } from "react";
import { SpinWheel } from "@/components/spin-wheel";
import { MANDATORY } from "@/lib/dare";

// The car wheel for the "BMW M4 in 30 days" format. Full screen, no menu, so
// it can be screen-recorded or keyed over footage. It always lands on the BMW
// M4; /spin/?car=Porsche%20911 makes it land on another car from the wheel.
const CARS = MANDATORY.find((c) => c.id === "m3")?.swaps ?? ["BMW M4"];
// mixed up so the target isn't the first slice and big names sit apart
const ORDER = [3, 0, 6, 1, 8, 4, 9, 2, 7, 5];
const WHEEL = ORDER.length === CARS.length ? ORDER.map((i) => CARS[i]) : CARS;

export default function SpinPage() {
  const [target, setTarget] = useState("BMW M4");
  useEffect(() => {
    document.title = "Spin the wheel";
    const car = new URLSearchParams(window.location.search).get("car");
    if (car && WHEEL.includes(car)) setTarget(car);
  }, []);
  return <SpinWheel cars={WHEEL} target={target} />;
}
