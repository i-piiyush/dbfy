"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function NeoBrutalCursor() {
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supportsCustomCursor = window.matchMedia("(hover: hover) and (pointer: fine)").matches
      && navigator.maxTouchPoints === 0;
    if (!supportsCustomCursor) return;

    const landingRoute = document.querySelector(".landing-route");
    landingRoute?.classList.add("has-neo-cursor");
    setPortalTarget(document.body);

    return () => landingRoute?.classList.remove("has-neo-cursor");
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!portalTarget || !cursor) return;

    const moveCursor = (event: PointerEvent) => {
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      cursor.style.opacity = "1";
    };
    const hideCursor = () => {
      cursor.style.opacity = "0";
    };

    window.addEventListener("pointermove", moveCursor, { passive: true });
    window.addEventListener("blur", hideCursor);
    document.addEventListener("pointerleave", hideCursor);

    return () => {
      window.removeEventListener("pointermove", moveCursor);
      window.removeEventListener("blur", hideCursor);
      document.removeEventListener("pointerleave", hideCursor);
    };
  }, [portalTarget]);

  if (!portalTarget) return null;

  return createPortal(
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="neo-brutal-cursor"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 31,
        height: 46,
        opacity: 0,
        pointerEvents: "none",
        zIndex: 120,
        willChange: "transform, opacity",
      }}
    >
      <svg viewBox="0 0 21 31" width="31" height="46" fill="none">
        <path d="M3 3v22l6-5.7 4.5 9.4 3.6-1.7-4.4-9.3 7.2-.2L3 3Z" fill="#7156ff" stroke="#171717" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M1.5 1.5v22l6-5.7 4.5 9.4 3.6-1.7-4.4-9.3 7.2-.2L1.5 1.5Z" fill="#c9ff55" stroke="#171717" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="m17 2 .8 2 2.1.8-2.1.8-.8 2-.8-2-2.1-.8 2.1-.8.8-2Z" fill="#ff8fc7" stroke="#171717" strokeWidth=".8" strokeLinejoin="round" />
      </svg>
    </div>,
    portalTarget,
  );
}
