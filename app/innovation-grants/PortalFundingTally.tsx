"use client";

import { useEffect, useRef } from "react";

export default function PortalFundingTally({ amount }: { amount: number }) {
  const valueRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = valueRef.current;
    if (!node) return;

    const formatted = `$${amount.toLocaleString("en-US")}`;
    node.setAttribute("aria-label", formatted);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.textContent = formatted;
      return;
    }

    const startedAt = performance.now();
    let frame = 0;
    const tally = (now: number) => {
      const progress = Math.min((now - startedAt) / 850, 1);
      const value = Math.round(amount * (1 - Math.pow(1 - progress, 3)));
      node.textContent = `$${value.toLocaleString("en-US")}`;
      if (progress < 1) frame = requestAnimationFrame(tally);
    };
    frame = requestAnimationFrame(tally);
    return () => cancelAnimationFrame(frame);
  }, [amount]);

  return <b id="fundingTotal" ref={valueRef}>{`$${amount.toLocaleString("en-US")}`}</b>;
}
