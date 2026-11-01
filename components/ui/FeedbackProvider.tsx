"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { Check, CircleAlert, Info, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import NeoDialog from "@/components/ui/NeoDialog";

type ToastKind = "success" | "error" | "info";
type ToastItem = { id: number; message: string; kind: ToastKind; exiting: boolean; instant: boolean };
type ConfirmOptions = { title: string; description: string; confirmLabel?: string; cancelLabel?: string };
type ToastApi = {
  success: (message: string, duration?: number) => void;
  error: (message: string, options?: { duration?: number }) => void;
  info: (message: string, duration?: number) => void;
};

const ToastContext = createContext<ToastApi | null>(null);
const ConfirmContext = createContext<((options: ConfirmOptions) => Promise<boolean>) | null>(null);

export function useToast() {
  const value = useContext(ToastContext);
  if (!value) throw new Error("useToast must be used inside FeedbackProvider");
  return value;
}

export function useConfirmDialog() {
  const value = useContext(ConfirmContext);
  if (!value) throw new Error("useConfirmDialog must be used inside FeedbackProvider");
  return value;
}

export default function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [confirmOptions, setConfirmOptions] = useState<ConfirmOptions | null>(null);
  const confirmResolver = useRef<((confirmed: boolean) => void) | null>(null);
  const nextId = useRef(0);
  const timers = useRef(new Map<number, number>());

  const dismissToast = useCallback((id: number, instantly = false) => {
    const timer = timers.current.get(id);
    if (timer) window.clearTimeout(timer);
    timers.current.delete(id);
    setToasts((current) => current.map((toast) => toast.id === id
      ? { ...toast, exiting: true, instant: instantly }
      : toast));
  }, []);

  const pushToast = useCallback((message: string, kind: ToastKind, duration = 4500) => {
    const id = ++nextId.current;
    setToasts((current) => [...current, { id, message, kind, exiting: false, instant: false }]);
    timers.current.set(id, window.setTimeout(() => dismissToast(id), duration));
  }, [dismissToast]);

  const toastApi = useMemo<ToastApi>(() => ({
    success: (message, duration) => pushToast(message, "success", duration),
    error: (message, options) => pushToast(message, "error", options?.duration),
    info: (message, duration) => pushToast(message, "info", duration),
  }), [pushToast]);

  const confirm = useCallback((options: ConfirmOptions) => new Promise<boolean>((resolve) => {
    if (confirmResolver.current) confirmResolver.current(false);
    confirmResolver.current = resolve;
    setConfirmOptions(options);
  }), []);

  const resolveConfirm = useCallback((confirmed: boolean) => {
    confirmResolver.current?.(confirmed);
    confirmResolver.current = null;
    setConfirmOptions(null);
  }, []);

  return (
    <ToastContext.Provider value={toastApi}>
      <ConfirmContext.Provider value={confirm}>
        {children}
        <div className="pointer-events-none fixed bottom-4 left-4 z-[120] w-[min(24rem,calc(100vw-2rem))] sm:bottom-6 sm:left-6" aria-live="polite" aria-relevant="additions text">
          <motion.div layout className="flex flex-col gap-3">
          <AnimatePresence initial={false}>
          {toasts.map((toast) => {
            const Icon = toast.kind === "success" ? Check : toast.kind === "error" ? CircleAlert : Info;
            const color = toast.kind === "success" ? "bg-acid" : toast.kind === "error" ? "bg-coral" : "bg-violet";
            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: 28, scale: 0.97 }}
                animate={toast.exiting ? { opacity: 0, y: -28, scale: 0.97 } : { opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -28, scale: 0.97 }}
                transition={toast.exiting
                  ? { duration: toast.instant ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }
                  : { type: "spring", stiffness: 420, damping: 34 }}
                onAnimationComplete={() => {
                  if (toast.exiting) setToasts((current) => current.filter((item) => item.id !== toast.id));
                }}
                role={toast.kind === "error" ? "alert" : "status"}
                className={`pointer-events-auto flex items-start gap-3 border-[3px] border-ink ${color} p-3 text-ink shadow-[5px_5px_0_var(--palette-ink)]`}
              >
                <Icon size={18} strokeWidth={3} className="mt-0.5 shrink-0" />
                <p className="flex-1 break-words text-sm font-bold leading-5">{toast.message}</p>
                <button type="button" onClick={() => dismissToast(toast.id, true)} aria-label="Dismiss notification" className="grid size-6 shrink-0 place-items-center border-2 border-ink bg-paper hover:bg-pink">
                  <X size={13} strokeWidth={3} />
                </button>
              </motion.div>
            );
          })}
          </AnimatePresence>
          </motion.div>
        </div>
        <NeoDialog
          open={Boolean(confirmOptions)}
          title={confirmOptions?.title ?? "Confirm action"}
          description={confirmOptions?.description}
          onClose={() => resolveConfirm(false)}
        >
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => resolveConfirm(false)} className="border-2 border-ink bg-paper px-4 py-2.5 text-xs font-black shadow-[2px_2px_0_var(--palette-ink)] hover:bg-violet">
              {confirmOptions?.cancelLabel ?? "Cancel"}
            </button>
            <button type="button" onClick={() => resolveConfirm(true)} className="border-2 border-ink bg-coral px-4 py-2.5 text-xs font-black shadow-[3px_3px_0_var(--palette-ink)] hover:bg-pink">
              {confirmOptions?.confirmLabel ?? "Confirm"}
            </button>
          </div>
        </NeoDialog>
      </ConfirmContext.Provider>
    </ToastContext.Provider>
  );
}
