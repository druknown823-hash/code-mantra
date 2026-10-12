import React, { useState } from 'react';
import { X, Users, Key, Copy, Check, ShieldCheck, UserCheck, Eye, RefreshCw } from 'lucide-react';
import { useVaultStore } from '../../stores/useVaultStore';
import { copyToClipboard, triggerHaptic } from '../../utils/clipboard';
import { MemberRole } from '../../types';

export const MembersModal: React.FC = () => {
  const {
    isMembersOpen,
    setMembersOpen,
    workspace,
    role,
    setRole,
    profile,
    showToast,
  } = useVaultStore();

  const [isCopiedCode, setIsCopiedCode] = useState(false);
  const [isCopiedLink, setIsCopiedLink] = useState(false);

  if (!isMembersOpen) return null;

  const handleCopyCode = async () => {
    triggerHaptic(10);
    const ok = await copyToClipboard(workspace.join_code);
    if (ok) {
      setIsCopiedCode(true);
      showToast(`Join code "${workspace.join_code}" copied!`, { icon: 'copy' });
      setTimeout(() => setIsCopiedCode(false), 1500);
    }
  };

  const handleCopyLink = async () => {
    triggerHaptic(10);
    const joinUrl = `${window.location.origin}/join/${workspace.join_code}`;
    const ok = await copyToClipboard(joinUrl);
    if (ok) {
      setIsCopiedLink(true);
      showToast('Join link copied to clipboard!', { icon: 'copy' });
      setTimeout(() => setIsCopiedLink(false), 1500);
    }
  };

  const rolesList: { id: MemberRole; label: string; desc: string; icon: any }[] = [
    {
      id: 'admin',
      label: 'Admin',
      desc: 'Full control, member management, permanent deletes',
      icon: ShieldCheck,
    },
    {
      id: 'contributor',
      label: 'Contributor',
      desc: 'Can edit code blocks, create questions & folders',
      icon: UserCheck,
    },
    {
      id: 'viewer',
      label: 'Viewer',
      desc: 'Read and copy only. Edit buttons hidden',
      icon: Eye,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-lg bg-[#161b22] border-t sm:border border-[#30363d] rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#30363d]">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-[#58a6ff]" />
            <h3 className="text-base font-semibold text-[#f0f6fc]">
              Workspace Members & Access
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setMembersOpen(false)}
            className="touch-target p-1.5 text-[#8b949e] hover:text-[#f0f6fc] rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-sm">
          {/* Join Code Card */}
          <div className="p-4 bg-[#0d1117] rounded-xl border border-[#30363d] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#8b949e] uppercase">
                6-Digit Join Code (Valid 7 days)
              </span>
              <span className="text-[11px] text-[#3fb950] font-medium">Active</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 font-mono text-2xl font-bold tracking-widest text-[#58a6ff] bg-[#161b22] px-4 py-2 rounded-xl border border-[#30363d] text-center">
                {workspace.join_code}
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="touch-target px-4 py-2.5 bg-[#21262d] hover:bg-[#30363d] text-[#f0f6fc] border border-[#30363d] rounded-xl font-semibold flex items-center gap-1.5 transition-all active:scale-95"
              >
                {isCopiedCode ? <Check size={16} /> : <Copy size={16} />}
                <span>{isCopiedCode ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopyLink}
              className="w-full touch-target py-2 bg-[#1f6feb]/20 hover:bg-[#1f6feb]/30 text-[#58a6ff] rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border border-[#1f6feb]/40 transition-all"
            >
              {isCopiedLink ? <Check size={14} /> : <Key size={14} />}
              <span>Copy Invite Link (/join/{workspace.join_code})</span>
            </button>
          </div>

          {/* Test Role Switcher (Crucial for verifying Acceptance Criteria) */}
          <div>
            <label className="block text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-2">
              Active Member Role (Role Switcher)
            </label>
            <p className="text-xs text-[#8b949e] mb-2.5">
              Switch role to test that Viewers cannot edit and only have read/copy access:
            </p>

            <div className="space-y-2">
              {rolesList.map((r) => {
                const isCurrent = role === r.id;
                const Icon = r.icon;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic(5);
                      setRole(r.id);
                      showToast(`Role switched to ${r.label}`, { icon: 'info' });
                    }}
                    className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-all ${
                      isCurrent
                        ? 'bg-[#58a6ff]/15 border-[#58a6ff] text-[#f0f6fc]'
                        : 'bg-[#0d1117] border-[#30363d] text-[#8b949e] hover:bg-[#21262d]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className={isCurrent ? 'text-[#58a6ff]' : 'text-[#8b949e]'} />
                      <div>
                        <p className="font-semibold text-xs text-[#f0f6fc]">{r.label}</p>
                        <p className="text-[11px] text-[#8b949e]">{r.desc}</p>
                      </div>
                    </div>
                    {isCurrent && <Check size={16} className="text-[#58a6ff]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-[#30363d] bg-[#161b22] flex justify-end safe-area-bottom">
          <button
            type="button"
            onClick={() => setMembersOpen(false)}
            className="touch-target px-6 py-2 bg-[#21262d] hover:bg-[#30363d] text-[#f0f6fc] border border-[#30363d] rounded-xl font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
