import React, { useState } from 'react';
import { X, MessageSquare, CheckCircle2, Circle, Send, Trash2 } from 'lucide-react';
import { useVaultStore } from '../../stores/useVaultStore';
import { triggerHaptic } from '../../utils/clipboard';

export const CommentsSheet: React.FC = () => {
  const {
    commentModalBlockId,
    setCommentModalBlockId,
    blocks,
    comments,
    addComment,
    toggleResolveComment,
    deleteComment,
    profile,
    role,
  } = useVaultStore();

  const [newCommentText, setNewCommentText] = useState('');
  const [lineRef, setLineRef] = useState<string>('');

  if (!commentModalBlockId) return null;

  const currentBlock = blocks.find((b) => b.id === commentModalBlockId);
  const blockComments = comments.filter((c) => c.block_id === commentModalBlockId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    triggerHaptic(5);
    const parsedLine = lineRef ? parseInt(lineRef, 10) : null;
    addComment(commentModalBlockId, newCommentText.trim(), isNaN(parsedLine as any) ? null : parsedLine);
    setNewCommentText('');
    setLineRef('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-lg bg-[#161b22] border-t sm:border border-[#30363d] rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#30363d]">
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-[#58a6ff]" />
            <div>
              <h3 className="text-base font-semibold text-[#f0f6fc]">
                Comments & Review
              </h3>
              <p className="text-xs text-[#8b949e]">
                {currentBlock?.block_title || 'Code Block'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setCommentModalBlockId(null)}
            className="touch-target p-1.5 text-[#8b949e] hover:text-[#f0f6fc] rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        {/* Comment list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
          {blockComments.length === 0 ? (
            <div className="text-center py-10 text-[#8b949e]">
              <MessageSquare size={32} className="mx-auto mb-2 opacity-40" />
              <p>No comments on this block yet.</p>
              <p className="text-xs mt-1">Leave a note, review feedback, or edge-case reminder.</p>
            </div>
          ) : (
            blockComments.map((comment) => (
              <div
                key={comment.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  comment.resolved
                    ? 'bg-[#0d1117]/50 border-[#30363d]/50 opacity-75'
                    : 'bg-[#0d1117] border-[#30363d]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-black"
                      style={{ backgroundColor: comment.profile?.avatar_color || '#58a6ff' }}
                    >
                      {comment.profile?.display_name?.charAt(0) || 'U'}
                    </div>
                    <span className="text-xs font-medium text-[#f0f6fc]">
                      {comment.profile?.display_name || 'Member'}
                    </span>
                    {comment.line_ref && (
                      <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-[#21262d] text-[#58a6ff] border border-[#30363d]">
                        Line {comment.line_ref}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => toggleResolveComment(comment.id)}
                      className={`text-xs flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                        comment.resolved
                          ? 'text-[#3fb950] hover:bg-[#238636]/20'
                          : 'text-[#8b949e] hover:text-[#f0f6fc]'
                      }`}
                    >
                      {comment.resolved ? (
                        <>
                          <CheckCircle2 size={14} />
                          <span>Resolved</span>
                        </>
                      ) : (
                        <>
                          <Circle size={14} />
                          <span>Resolve</span>
                        </>
                      )}
                    </button>

                    {(comment.user_id === profile.id || role === 'admin') && (
                      <button
                        type="button"
                        onClick={() => deleteComment(comment.id)}
                        className="p-1 text-[#8b949e] hover:text-[#da3633] rounded"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-[#c9d1d9] leading-relaxed whitespace-pre-wrap">
                  {comment.body}
                </p>
                <span className="text-[10px] text-[#8b949e] mt-1.5 block">
                  {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Footer input form */}
        {role !== 'viewer' && (
          <form onSubmit={handleSubmit} className="p-3 border-t border-[#30363d] bg-[#161b22] space-y-2 safe-area-bottom">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Line # (opt)"
                value={lineRef}
                onChange={(e) => setLineRef(e.target.value)}
                className="w-24 bg-[#0d1117] border border-[#30363d] rounded-lg px-2.5 py-2 text-xs text-[#c9d1d9] placeholder-[#8b949e] outline-none font-mono"
              />
              <input
                type="text"
                placeholder="Write comment or review suggestion..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-xs text-[#c9d1d9] placeholder-[#8b949e] outline-none"
              />
              <button
                type="submit"
                disabled={!newCommentText.trim()}
                className="touch-target px-3.5 py-2 bg-[#58a6ff] hover:bg-[#79c0ff] disabled:opacity-40 text-black font-semibold rounded-lg text-xs flex items-center justify-center transition-all"
              >
                <Send size={14} />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
