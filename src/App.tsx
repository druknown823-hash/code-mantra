import React, { useEffect } from 'react';
import { useVaultStore } from './stores/useVaultStore';
import { BreadcrumbBar } from './components/navigation/BreadcrumbBar';
import { TreeDrawer } from './components/tree/TreeDrawer';
import { QuestionPage } from './components/question/QuestionPage';
import { FolderView } from './components/question/FolderView';
import { WorkspaceHomeView } from './components/question/WorkspaceHomeView';
import { EditorModal } from './components/editor/EditorModal';
import { HistorySheet } from './components/question/HistorySheet';
import { CommentsSheet } from './components/question/CommentsSheet';
import { CopyOptionsSheet } from './components/question/CopyOptionsSheet';
import { SmartPasteModal } from './components/question/SmartPasteModal';
import { RecentlyCopiedTray } from './components/question/RecentlyCopiedTray';
import { SearchPalette } from './components/search/SearchPalette';
import { GenerateSeriesModal } from './components/tree/GenerateSeriesModal';
import { MoveNodeModal } from './components/tree/MoveNodeModal';
import { MembersModal } from './components/workspace/MembersModal';
import { TrashModal } from './components/workspace/TrashModal';
import { ShareLinkModal } from './components/workspace/ShareLinkModal';
import { OnboardingModal } from './components/workspace/OnboardingModal';
import { ToastContainer } from './components/common/ToastContainer';

export const App: React.FC = () => {
  const { nodes, selectedNodeId, refreshFromStorage } = useVaultStore();

  // Listen to network online/offline events
  useEffect(() => {
    const handleOnline = () => useVaultStore.setState({ isOnline: true });
    const handleOffline = () => useVaultStore.setState({ isOnline: false });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Register service worker if available
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('SW registration skipped', err);
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const selectedNode = selectedNodeId
    ? nodes.find((n) => n.id === selectedNodeId && !n.deleted_at)
    : null;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0d1117] text-[#c9d1d9] font-sans">
      {/* Sidebar Navigation */}
      <TreeDrawer />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Sticky Breadcrumb Bar */}
        <BreadcrumbBar />

        {/* Dynamic Center View */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {selectedNode?.type === 'question' ? (
            <QuestionPage node={selectedNode} />
          ) : selectedNode?.type === 'folder' ? (
            <FolderView node={selectedNode} />
          ) : (
            <WorkspaceHomeView />
          )}
        </main>
      </div>

      {/* Floating Notifications */}
      <ToastContainer />

      {/* Modals & Bottom Sheets */}
      <EditorModal />
      <HistorySheet />
      <CommentsSheet />
      <CopyOptionsSheet />
      <SmartPasteModal />
      <RecentlyCopiedTray />
      <SearchPalette />
      <GenerateSeriesModal />
      <MoveNodeModal />
      <MembersModal />
      <TrashModal />
      <ShareLinkModal />
      <OnboardingModal />
    </div>
  );
};

export default App;
