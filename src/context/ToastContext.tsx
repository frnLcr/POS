import React, { createContext, useContext, useState, useCallback } from 'react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContextType {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const add = useCallback((message: string, type: Toast['type']) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const success = useCallback((msg: string) => add(msg, 'success'), [add]);
  const error   = useCallback((msg: string) => add(msg, 'error'),   [add]);
  const info    = useCallback((msg: string) => add(msg, 'info'),    [add]);

  const bgClass: Record<Toast['type'], string> = {
    success: 'bg-emerald-600',
    error:   'bg-red-600',
    info:    'bg-blue-600'
  };

  const icon: Record<Toast['type'], string> = {
    success: '✓',
    error:   '✕',
    info:    'ℹ'
  };

  return (
    <ToastContext.Provider value={{ success, error, info }}>
      {children}

      {/* Toast container */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`${bgClass[toast.type]} text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 min-w-64 max-w-sm animate-slide-in pointer-events-auto`}
          >
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold shrink-0">
              {icon[toast.type]}
            </span>
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast debe usarse dentro de ToastProvider');
  return ctx;
};
