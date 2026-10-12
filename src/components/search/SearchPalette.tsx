import React, { useState, useEffect } from 'react';
import { Search, X, FileCode, Folder, Hash, Filter, ArrowRight } from 'lucide-react';
import { useVaultStore } from '../../stores/useVaultStore';
import { VaultNode, CodeLanguage, QuestionStatus } from '../../types';

export const SearchPalette: React.FC = () => {
  const {
    isSearchOpen,
    setSearchOpen,
    nodes,
    blocks,
    variants,
    setSelectedNodeId,
    setCurrentLanguage,
  } = useVaultStore();

  const [query, setQuery] = useState('');
  const [filterLang, setFilterLang] = useState<CodeLanguage | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<QuestionStatus | 'all'>('all');

  // Handle Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setSearchOpen]);

  if (!isSearchOpen) return null;

  // Search logic across node title, description, tags, and block code
  const q = query.trim().toLowerCase();
  const results: Array<{
    node: VaultNode;
    matchingBlockTitle?: string;
    matchingCodeSnippet?: string;
    language?: CodeLanguage;
  }> = [];

  const activeNodes = nodes.filter((n) => !n.deleted_at);

  for (const node of activeNodes) {
    if (filterStatus !== 'all' && node.status !== filterStatus) continue;

    let matched = false;

    // Check title, description, tags
    if (
      !q ||
      node.title.toLowerCase().includes(q) ||
      node.description_md.toLowerCase().includes(q) ||
      node.tags.some((t) => t.toLowerCase().includes(q))
    ) {
      results.push({ node });
      matched = true;
    }

    // Check code in blocks
    if (!matched && q && node.type === 'question') {
      const nodeBlocks = blocks.filter((b) => b.node_id === node.id && !b.deleted_at);
      for (const block of nodeBlocks) {
        const langs: CodeLanguage[] = filterLang === 'all' ? ['java', 'cpp'] : [filterLang];
        for (const lang of langs) {
          const code = variants[block.id]?.[lang]?.code_content || '';
          if (code.toLowerCase().includes(q)) {
            // Find matching line preview
            const lines = code.split('\n');
            const matchLine = lines.find((l) => l.toLowerCase().includes(q)) || '';
            results.push({
              node,
              matchingBlockTitle: block.block_title,
              matchingCodeSnippet: matchLine.trim(),
              language: lang,
            });
            matched = true;
            break;
          }
        }
        if (matched) break;
      }
    }
  }

  const handleSelect = (item: typeof results[0]) => {
    setSelectedNodeId(item.node.id);
    if (item.language) {
      setCurrentLanguage(item.language);
    }
    setSearchOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center pt-16 sm:pt-0 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-xl bg-[#161b22] border border-[#30363d] rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[80vh] mx-3"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-[#30363d] flex items-center gap-3 bg-[#0d1117]">
          <Search size={18} className="text-[#58a6ff] flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions, units, tags, or code content..."
            autoFocus
            className="w-full bg-transparent text-sm text-[#f0f6fc] placeholder-[#8b949e] outline-none"
          />
          <button
            type="button"
            onClick={() => setSearchOpen(false)}
            className="p-1 text-[#8b949e] hover:text-[#f0f6fc] rounded"
          >
            <X size={18} />
          </button>
        </div>

        {/* Filter Chips Bar */}
        <div className="px-3.5 py-2 border-b border-[#30363d] flex items-center gap-2 overflow-x-auto text-xs no-scrollbar bg-[#161b22]">
          <span className="text-[#8b949e] flex items-center gap-1">
            <Filter size={12} />
            <span>Filter:</span>
          </span>

          <select
            value={filterLang}
            onChange={(e) => setFilterLang(e.target.value as any)}
            className="bg-[#0d1117] text-[#c9d1d9] border border-[#30363d] rounded px-2 py-0.5 text-xs outline-none"
          >
            <option value="all">All Languages</option>
            <option value="java">Java only</option>
            <option value="cpp">C++ only</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="bg-[#0d1117] text-[#c9d1d9] border border-[#30363d] rounded px-2 py-0.5 text-xs outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Completed</option>
          </select>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 text-sm">
          {results.length === 0 ? (
            <div className="text-center py-12 text-[#8b949e]">
              <Search size={32} className="mx-auto mb-2 opacity-40" />
              <p>No matching questions or code found.</p>
              <p className="text-xs mt-1">Try another keyword, tag, or function name.</p>
            </div>
          ) : (
            results.map((item, idx) => (
              <button
                key={`${item.node.id}-${idx}`}
                type="button"
                onClick={() => handleSelect(item)}
                className="w-full text-left p-3 rounded-xl border border-transparent hover:border-[#30363d] hover:bg-[#21262d] transition-all flex items-center justify-between group"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {item.node.type === 'folder' ? (
                      <Folder size={15} className="text-[#e3b341]" />
                    ) : (
                      <FileCode size={15} className="text-[#58a6ff]" />
                    )}
                    <span className="font-semibold text-xs text-[#f0f6fc] truncate">
                      {item.node.outline_number ? `${item.node.outline_number} ` : ''}
                      {item.node.title}
                    </span>
                    {item.language && (
                      <span className="text-[10px] font-mono uppercase font-bold px-1.5 py-0.5 rounded bg-[#0d1117] text-[#58a6ff] border border-[#30363d]">
                        {item.language}
                      </span>
                    )}
                  </div>

                  {item.matchingCodeSnippet ? (
                    <p className="font-mono text-xs text-[#3fb950] bg-[#0d1117] px-2 py-1 rounded truncate border border-[#30363d]">
                      {item.matchingCodeSnippet}
                    </p>
                  ) : item.node.description_md ? (
                    <p className="text-xs text-[#8b949e] truncate">
                      {item.node.description_md}
                    </p>
                  ) : null}
                </div>

                <ArrowRight size={14} className="text-[#8b949e] group-hover:text-[#58a6ff] transition-colors ml-2 flex-shrink-0" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
