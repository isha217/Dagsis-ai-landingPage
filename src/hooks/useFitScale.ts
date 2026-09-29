"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Scale factor (≤ 1) that makes `ref`'s content fit in the viewport height
 * minus `reservePx`. Used by pinned sections so a short browser window
 * shrinks the layout slightly instead of cutting it off.
 */
export function useFitScale(ref: RefObject<HTMLElement | null>, active: boolean, reservePx: number) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el || !active) {
      setScale(1);
      return;
    }
    const update = () => {
      // offsetHeight ignores transforms, so this is the unscaled height.
      const needed = el.offsetHeight;
      const available = window.innerHeight - reservePx;
      setScale(needed > 0 ? Math.min(1, available / needed) : 1);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [ref, active, reservePx]);

  return scale;
}
