import React from 'react';
import { useFamilyStore } from '../../store/useFamilyStore';
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const toasts = useFamilyStore((state) => state.toasts);
  const removeToast = useFamilyStore((state) => state.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
      {toasts.map((toast) => {
        let icon = <Info className="w-5 h-5 text-blue-500 shrink-0" />;
        let borderClass = 'border-stone-200';
        let bgClass = 'bg-[#FFFDF9]';

        if (toast.type === 'success') {
          icon = <CheckCircle2 className="w-5 h-5 text-[#819B84] shrink-0" />;
          borderClass = 'border-[#819B84]/30';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
          borderClass = 'border-amber-300';
        } else if (toast.type === 'error') {
          icon = <XCircle className="w-5 h-5 text-rose-500 shrink-0" />;
          borderClass = 'border-rose-300';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl shadow-lg border ${borderClass} ${bgClass} text-[#2C2724] text-sm animate-in fade-in slide-in-from-top-2 duration-200`}
          >
            <div className="flex items-center gap-2.5">
              {icon}
              <span className="font-medium text-xs sm:text-sm">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-stone-600 ml-2"
              aria-label="Cerrar notificación"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
