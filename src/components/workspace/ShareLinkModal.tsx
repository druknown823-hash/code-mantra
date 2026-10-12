import React, { useState } from 'react';
import { X, Share2, Copy, Check, Shield, Clock } from 'lucide-react';
import { useVaultStore } from '../../stores/useVaultStore';
import { copyToClipboard, triggerHaptic } from '../../utils/clipboard';

export const ShareLinkModal: React.FC = () => {
  const {
    isShareModalOpen,
    setShareModalOpen,
    selectedNodeId,
    nodes,
    showToast,
  } = useVaultStore();

  const [isCopied, setIsCopied] = useState(false);
  const [expiryDays, setExpiryDays] = useState('7');
  const [isPublicEnabled, setIsPublicEnabled] = useState(true);

  if (!isShareModalOpen) return null;

  const targetNode = nodes.find((n) => n.id === selectedNodeId);
  const shareToken = (targetNode?.id || 'demo').substring(0, 8);
  const shareUrl = `${window.location.origin}/share/${shareToken}`;

  const handleCopy = async () => {
    triggerHaptic(10);
    const ok = await copyToClipboard(shareUrl);
    if (ok) {
      setIsCopied(true);
      showToast('Public read-only share link copied!', { icon: 'copy' });
      setTimeout(() => setIsCopied(false), 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-md bg-[#161b22] border-t sm:border border-[#30363d] rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#30363d]">
          <div className="flex items-center gap-2">
            <Share2 size={18} className="text-[#58a6ff]" />
            <div>
              <h3 className="text-base font-semibold text-[#f0f6fc]">Public Read-Only Link</h3>
              <p className="text-xs text-[#8b949e] truncate max-w-xs">
                {targetNode?.title || 'Current Item'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShareModalOpen(false)}
            className="touch-target p-1.5 text-[#8b949e] hover:text-[#f0f6fc] rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4 text-sm">
          {/* Public access toggle */}
          <div className="p-3 bg-[#0d1117] rounded-xl border border-[#30363d] flex items-center justify-between">
            <div>
              <p className="font-semibold text-xs text-[#f0f6fc]">Enable Public Sharing</p>
              <p className="text-[11px] text-[#8b949e]">Allow anyone with the link to read and copy</p>
            </div>
            <input
              type="checkbox"
              checked={isPublicEnabled}
              onChange={(e) => setIsPublicEnabled(e.target.checked)}
              className="w-5 h-5 accent-[#58a6ff] cursor-pointer"
            />
          </div>

          {isPublicEnabled ? (
            <>
              {/* Generated link */}
              <div>
                <label className="block text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-1.5">
                  Shareable Read-Only URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-2 text-xs font-mono text-[#58a6ff] select-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="touch-target px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow"
                  >
                    {isCopied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{isCopied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Expiry selection */}
              <div>
                <label className="block text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-1.5">
                  Link Expiration
                </label>
                <select
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-2 text-xs text-[#c9d1d9] outline-none"
                >
                  <option value="1">Expires in 24 hours</option>
                  <option value="7">Expires in 7 days</option>
                  <option value="30">Expires in 30 days</option>
                  <option value="never">Never expires</option>
                </select>
              </div>
            </>
          ) : (
            <p className="text-xs text-[#8b949e] p-3 text-center bg-[#0d1117] rounded-xl">
              Public link is currently disabled. Toggle above to generate an access URL.
            </p>
          )}
        </div>

        <div className="p-4 border-t border-[#30363d] bg-[#161b22] flex justify-end safe-area-bottom">
          <button
            type="button"
            onClick={() => setShareModalOpen(false)}
            className="touch-target px-5 py-2 bg-[#21262d] hover:bg-[#30363d] text-[#f0f6fc] border border-[#30363d] rounded-xl text-xs font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
