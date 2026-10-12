// LabVault Breadcrumb Bar with Auto-Scroll & Top Status Icons
import React, { useEffect, useRef } from 'react';
import { Menu, ChevronRight, History, Search, WifiOff, Users } from 'lucide-react';
import { useVaultStore } from '../../stores/useVaultStore';
import { getBreadcrumbPath } from '../../utils/tree';

export const BreadcrumbBar: React.FC = () => {
  const {
    workspace,
    nodes,
    selectedNodeId,
    setSelectedNodeId,
    setDrawerOpen,
    setSearchOpen,
    setRecentCopiedOpen,
    isOnline,
    presenceUsers,
    appPerspective,
    setAppPerspective,
  } = useVaultStore();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const breadcrumbPath = getBreadcrumbPath(selectedNodeId, nodes);

  // Auto-scroll breadcrumbs to the far right on node change
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, [selectedNodeId, breadcrumbPath]);

  return (
    <header className="h-14 bg-[#161b22] border-b border-[#30363d] px-3 flex items-center justify-between gap-2 z-30 select-none">
      {/* Left: Mobile Drawer Hamburger & Scrollable Crumb Trail */}
      <div className="flex items-center gap-1.5 min-w-0 flex-1">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="lg:hidden touch-target p-2 text-[#8b949e] hover:text-[#f0f6fc] rounded-lg flex-shrink-0"
          aria-label="Toggle navigation drawer"
        >
          <Menu size={20} />
        </button>

        {/* Horizontally scrollable breadcrumb bar */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap text-xs text-[#8b949e] py-1"
        >
          <button
            type="button"
            onClick={() => setSelectedNodeId(null)}
            className="hover:text-[#f0f6fc] font-medium transition-colors flex-shrink-0"
          >
            {workspace.name}
          </button>

          {breadcrumbPath.map((crumb, idx) => (
            <React.Fragment key={crumb.id}>
              <ChevronRight size={13} className="text-[#6e7681] flex-shrink-0" />
              <button
                type="button"
                onClick={() => setSelectedNodeId(crumb.id)}
                className={`truncate max-w-[120px] sm:max-w-[160px] transition-colors ${
                  idx === breadcrumbPath.length - 1
                    ? 'text-[#f0f6fc] font-semibold'
                    : 'hover:text-[#f0f6fc]'
                }`}
                title={crumb.title}
              >
                {crumb.title}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Right: Perspective Toggle, Recently Copied Tray, Search */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {/* Quick Mode Toggle */}
        <div className="hidden sm:flex items-center bg-[#212121] p-0.5 rounded-xl border border-[#333333] text-xs">
          <button
            type="button"
            onClick={() => setAppPerspective('mobile')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              appPerspective === 'mobile'
                ? 'bg-[#58a6ff] text-black font-semibold'
                : 'text-[#8b949e] hover:text-[#f0f6fc]'
            }`}
          >
            📱 Phone (Copy)
          </button>
          <button
            type="button"
            onClick={() => setAppPerspective('computer')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              appPerspective === 'computer'
                ? 'bg-[#58a6ff] text-black font-semibold'
                : 'text-[#8b949e] hover:text-[#f0f6fc]'
            }`}
          >
            💻 Laptop (Upload)
          </button>
        </div>

        {/* Recently Copied Tray Shortcut */}
        <button
          type="button"
          onClick={() => setRecentCopiedOpen(true)}
          className="touch-target p-2 text-[#8b949e] hover:text-[#58a6ff] rounded-lg transition-colors"
          title="Recently Copied Snippets"
          aria-label="Recently Copied Snippets"
        >
          <History size={18} />
        </button>

        {/* Search */}
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="touch-target p-2 text-[#8b949e] hover:text-[#f0f6fc] rounded-lg transition-colors"
          title="Search (⌘K)"
          aria-label="Search"
        >
          <Search size={18} />
        </button>
      </div>
    </header>
  );
};
