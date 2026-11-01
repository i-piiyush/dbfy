"use client";

import { useEffect, useRef, useState } from "react";
import { AuthPageLoader } from "@/components/AuthPageShell";

export default function AuthPageReadyGate({
  children,
  mode,
}: {
  children: React.ReactNode;
  mode: "sign-in" | "sign-up";
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [formReady, setFormReady] = useState(false);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const checkForForm = () => {
      if (content.querySelector("input.cl-formFieldInput")) {
        setFormReady(true);
        observer.disconnect();
      }
    };

    const observer = new MutationObserver(checkForForm);
    observer.observe(content, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
    checkForForm();

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={contentRef} hidden={!formReady}>
        {children}
      </div>
      {!formReady && <AuthPageLoader mode={mode} />}
    </>
  );
}
