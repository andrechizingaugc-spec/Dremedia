"use client";

import { useEffect, useState } from "react";
import { SpinWheel } from "@/components/spin-wheel";

// The car spinner for the "BMW M4 in 30 days" format, styled like the original
// video: names rolling past a box. Full screen, no menu, so it can be
// screen-recorded or keyed over footage. It always lands on the BMW M4;
// /spin/?car=Porsche%20911 makes it land on another car (added if missing).
const CARS = ["Rolls Royce", "Range Rover", "BMW M4", "Lamborghini", "Mercedes Benz", "Porsche 911", "Ferrari", "G-Wagon", "Audi RS6", "Nissan GT-R", "Toyota Supra", "Tesla"];

export default function SpinPage() {
  const [target, setTarget] = useState("BMW M4");
  const [cars, setCars] = useState(CARS);
  useEffect(() => {
    document.title = "Spin";
    const car = new URLSearchParams(window.location.search).get("car")?.trim();
    if (!car || car === "BMW M4") return;
    const known = CARS.find((c) => c.toLowerCase() === car.toLowerCase() || car.toLowerCase().startsWith(c.toLowerCase()));
    if (known && known === car) setTarget(known);
    else {
      // a car from the plan that isn't on the list takes the M4's place
      setCars(CARS.map((c) => (c === "BMW M4" ? car : c)).filter((c, i, a) => a.indexOf(c) === i));
      setTarget(car);
    }
  }, []);
  return <SpinWheel key={target} cars={cars} target={target} />;
}
