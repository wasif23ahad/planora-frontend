"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-9999 flex flex-col gap-3 pointer-events-none sm:max-w-md w-[calc(100%-2rem)]">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              pointer-events-auto animate-slide-up flex items-center gap-3 px-6 py-4 rounded-2xl border ambient-shadow backdrop-blur-md
              ${toast.type === 'success' ? 'bg-primary/10 border-primary/20 text-primary' : ''}
              ${toast.type === 'error' ? 'bg-error/10 border-error/20 text-error' : ''}
              ${toast.type === 'info' ? 'bg-accent/10 border-accent/20 text-accent' : ''}
              ${toast.type === 'warning' ? 'bg-warn/10 border-warn/20 text-warn' : ''}
            `}
          >
            <span className="material-symbols-outlined text-[20px]">
              {toast.type === 'success' ? 'check_circle' : 
               toast.type === 'error' ? 'error' : 
               toast.type === 'warning' ? 'warning' : 'info'}
            </span>
            <p className="text-sm font-headline font-semibold tracking-tight">{toast.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
