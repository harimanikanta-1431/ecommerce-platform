"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Toast = {
  id: number;
  title: string;
  description?: string;
};

type ToastContextValue = {
  showToast: (toast: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = Date.now();
      setToasts((current) => [{ ...toast, id }, ...current].slice(0, 3));
      window.setTimeout(() => removeToast(id), 3200);
    },
    [removeToast],
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-3 bottom-4 z-50 flex flex-col gap-2 sm:inset-x-auto sm:right-4 sm:w-96">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 rounded-lg border border-zinc-200 bg-white p-4 text-zinc-950 shadow-2xl shadow-zinc-900/15"
          >
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold">{toast.title}</p>
              {toast.description ? (
                <p className="mt-1 text-sm text-zinc-600">
                  {toast.description}
                </p>
              ) : null}
            </div>
            <Button
              aria-label="Dismiss notification"
              type="button"
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => removeToast(toast.id)}
            >
              <X className="size-4" />
            </Button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}
