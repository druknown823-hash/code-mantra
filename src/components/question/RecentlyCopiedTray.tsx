import React from 'react';
import { X, History, Copy, Check } from 'lucide-react';
import { useVaultStore } from '../../stores/useVaultStore';
import { copyToClipboard, triggerHaptic } from '../../utils/clipboard';

export const RecentlyCopiedTray: React.FC = () => {
  const {
    isRecentCopiedOpen,
    setRecentCopiedOpen,
    recentCopies,
    showToast,
  } = useVaultStore();

  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (!isRecentCopiedOpen) return null;

  const handleCopy = async (item: any) => {
    triggerHaptic(10);
    const ok = await copyToClipboard(item.text);
    if (ok) {
      setCopiedId(item.id);
      showToast(`Re-copied "${item.title}" (${item.lineCount} lines)`, { icon: 'copy' });
      setTimeout(() => setCopiedId(null), 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-lg bg-[#161b22] border-t sm:border border-[#30363d] rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[80vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#30363d]">
          <div className="flex items-center gap-2">
            <History size={18} className="text-[#58a6ff]" />
            <h3 className="text-base font-semibold text-[#f0f6fc]">Recently Copied Snippets</h3>
          </div>
          <button
            type="button"
            onClick={() => setRecentCopiedOpen(false)}
            className="touch-target p-1.5 text-[#8b949e] hover:text-[#f0f6fc] rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 text-sm">
          {recentCopies.length === 0 ? (
            <div className="text-center py-12 text-[#8b949e]">
              <History size={36} className="mx-auto mb-2 opacity-40" />
              <p>No recently copied snippets yet.</p>
              <p className="text-xs mt-1">Tap Copy on any block or program to see history here.</p>
            </div>
          ) : (
            recentCopies.map((item) => {
              const isJustCopied = copiedId === item.id;
              return (
                <div
                  key={item.id}
                  className="p-3 bg-[#0d1117] border border-[#30363d] rounded-xl flex items-center justify-between gap-3 hover:border-[#58a6ff]/40 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono uppercase font-bold px-1.5 py-0.5 rounded bg-[#21262d] text-[#58a6ff] border border-[#30363d]">
                        {item.language}
                      </span>
                      <h4 className="text-xs font-semibold text-[#f0f6fc] truncate">
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-xs text-[#8b949e]">
                      {item.lineCount} lines • {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(item)}
                    className={`touch-target px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
                      isJustCopied
                        ? 'bg-[#238636] text-white'
                        : 'bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9]'
                    }`}
                  >
                    {isJustCopied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{isJustCopied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
