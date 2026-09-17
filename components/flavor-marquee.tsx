"use client";

import { useEffect, useRef, useState } from "react";
import { Flame, Leaf, Pause, Play, UtensilsCrossed } from "lucide-react";

export function FlavorMarquee() {
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      node.classList.toggle("is-in-view", entry.isIntersecting);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className="flavor-marquee" data-paused={paused}>
      <div className="flavor-track">
        {[0, 1].map((copy) => (
          <div
            className="flavor-group"
            key={copy}
            aria-hidden={copy === 1 ? true : undefined}
          >
            <span>
              <Flame /> Stone-baked. Never ordinary.
            </span>
            <i aria-hidden="true">✦</i>
            <span>
              <Leaf /> Fresh ingredients, real flavor.
            </span>
            <i aria-hidden="true">✦</i>
            <span>
              <UtensilsCrossed /> Good food brings us together.
            </span>
            <i aria-hidden="true">✦</i>
            <span>
              Made with love in Dina <b className="orange">♥</b>
            </span>
            <i aria-hidden="true">✦</i>
          </div>
        ))}
      </div>
      <button
        className="marquee-toggle icon-button"
        onClick={() => setPaused(!paused)}
        aria-label={paused ? "Play moving banner" : "Pause moving banner"}
        aria-pressed={paused}
      >
        {paused ? <Play size={14} /> : <Pause size={14} />}
      </button>
    </div>
  );
}
