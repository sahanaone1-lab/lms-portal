import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, Info, X, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  exiting?: boolean;
}

interface ToastContextType {
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const TOAST_DURATION = 4500;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 350);
  }, []);

  const addToast = useCallback((type: ToastType, message: string, title?: string) => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, type, message, title }]);
    setTimeout(() => removeToast(id), TOAST_DURATION);
  }, [removeToast]);

  const value: ToastContextType = {
    success: (msg, title) => addToast('success', msg, title),
    error:   (msg, title) => addToast('error', msg, title),
    info:    (msg, title) => addToast('info', msg, title),
    warning: (msg, title) => addToast('warning', msg, title),
  };

  const icons: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />,
    error:   <XCircle className="h-5 w-5 text-rose-400 flex-shrink-0" />,
    info:    <Info className="h-5 w-5 text-[#0F4C81] flex-shrink-0" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0" />,
  };
  const bars: Record<ToastType, string> = {
    success: 'bg-emerald-400', error: 'bg-rose-400', info: 'bg-[#0F4C81]', warning: 'bg-amber-400',
  };
  const borders: Record<ToastType, string> = {
    success: 'border-emerald-500/30', error: 'border-rose-500/30', info: 'border-[#0F4C81]/30', warning: 'border-amber-500/30',
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-5 right-5 z-[9998] flex flex-col gap-3 pointer-events-none w-80 max-w-[calc(100vw-2.5rem)]">
        {toasts.map((toast) => (
          <div key={toast.id} className={`relative overflow-hidden rounded-xl border shadow-2xl pointer-events-auto bg-[#0f1923] ${borders[toast.type]} ${toast.exiting ? 'animate-toast-out' : 'animate-toast-in'}`} style={{ boxShadow: '0 10px 40px -8px rgba(0,0,0,0.5)' }}>
            <div className={`absolute top-0 left-0 h-0.5 ${bars[toast.type]}`} style={{ animation: `loadingBar ${TOAST_DURATION}ms linear forwards` }} />
            <div className="flex items-start gap-3 p-4">
              {icons[toast.type]}
              <div className="flex-1 min-w-0">
                {toast.title && <p className="text-xs font-bold text-white/90 font-display mb-0.5">{toast.title}</p>}
                <p className="text-xs text-white/75 leading-relaxed">{toast.message}</p>
              </div>
              <button onClick={() => removeToast(toast.id)} className="text-white/40 hover:text-white/80 transition-colors cursor-pointer flex-shrink-0 mt-0.5">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};
