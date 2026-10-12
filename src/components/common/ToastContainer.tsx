import React from 'react';
import { Check, Copy, Info, Trash2, RotateCcw } from 'lucide-react';
import { useVaultStore } from '../../stores/useVaultStore';
import { triggerHaptic } from '../../utils/clipboard';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useVaultStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 left-0 right-0 z-50 pointer-events-none flex flex-col items-center gap-2 px-4 select-none">
      {toasts.map((toast) => {
        return (
          <div
            key={toast.id}
            className="pointer-events-auto max-w-sm w-full bg-[#161b22] border border-[#30363d] text-[#f0f6fc] px-4 py-3 rounded-2xl shadow-2xl flex items-center justify-between gap-3 text-xs font-semibold animate-in slide-in-from-bottom-3 duration-200"
          >
            <div className="flex items-center gap-2 min-w-0">
              {toast.icon === 'trash' ? (
                <Trash2 size={16} className="text-[#da3633] flex-shrink-0" />
              ) : toast.icon === 'copy' ? (
                <Copy size={16} className="text-[#58a6ff] flex-shrink-0" />
              ) : (
                <Check size={16} className="text-[#3fb950] flex-shrink-0" />
              )}
              <span className="truncate">{toast.message}</span>
            </div>

            {toast.undoAction && (
              <button
                type="button"
                onClick={() => {
                  triggerHaptic(10);
                  toast.undoAction!();
                  removeToast(toast.id);
                }}
                className="touch-target px-2.5 py-1 bg-[#21262d] hover:bg-[#30363d] text-[#58a6ff] rounded-lg text-xs font-bold flex items-center gap-1 transition-all active:scale-95"
              >
                <RotateCcw size={12} />
                <span>Undo</span>
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};
