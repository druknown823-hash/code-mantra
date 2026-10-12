// LabVault ZIP & Code Import/Export System
import React, { useState } from 'react';
import JSZip from 'jszip';
import { X, Download, Upload, FileCode, Archive, Check } from 'lucide-react';
import { useVaultStore } from '../../stores/useVaultStore';
import { triggerHaptic, analyzePastedCode } from '../../utils/clipboard';
import { VaultNode, QuestionBlock } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportExportModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const {
    workspace,
    nodes,
    blocks,
    variants,
    currentLanguage,
    createNode,
    createBlock,
    showToast,
    profile,
  } = useVaultStore();

  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  if (!isOpen) return null;

  // EXPORT AS ZIP (Mirroring tree hierarchy with real .java / .cpp files & index.md)
  const handleExportZip = async () => {
    try {
      setIsExporting(true);
      triggerHaptic(10);
      const zip = new JSZip();

      // Index of entire workspace
      let indexMd = `# ${workspace.name}\n${workspace.description}\n\n## Content Outline\n`;

      const activeNodes = nodes.filter((n) => !n.deleted_at);
      const nodeMap = new Map(activeNodes.map((n) => [n.id, n]));

      // Helper to compute node path in zip
      const getNodePath = (node: VaultNode): string => {
        const parts: string[] = [];
        let curr: VaultNode | undefined = node;
        while (curr) {
          parts.unshift(curr.title.replace(/[\/\\?%*:|"<>]/g, '_'));
          curr = curr.parent_id ? nodeMap.get(curr.parent_id) : undefined;
        }
        return parts.join('/');
      };

      for (const node of activeNodes) {
        const fullPath = getNodePath(node);
        indexMd += `- [${node.title}](./${fullPath})\n`;

        if (node.type === 'question') {
          const qBlocks = blocks.filter((b) => b.node_id === node.id && !b.deleted_at);

          // 1. Export Java program
          const javaSnippets = qBlocks
            .map((b) => variants[b.id]?.java?.code_content)
            .filter(Boolean)
            .join('\n\n');
          if (javaSnippets) {
            zip.file(`${fullPath}/Solution.java`, javaSnippets);
          }

          // 2. Export C++ program
          const cppSnippets = qBlocks
            .map((b) => variants[b.id]?.cpp?.code_content)
            .filter(Boolean)
            .join('\n\n');
          if (cppSnippets) {
            zip.file(`${fullPath}/Solution.cpp`, cppSnippets);
          }

          // 3. Export Question index.md
          let qMd = `# ${node.title}\n\n`;
          if (node.description_md) qMd += `## Description\n${node.description_md}\n\n`;
          if (node.sample_input) qMd += `### Sample Input\n\`\`\`\n${node.sample_input}\n\`\`\`\n\n`;
          if (node.sample_output) qMd += `### Expected Output\n\`\`\`\n${node.sample_output}\n\`\`\`\n\n`;
          zip.file(`${fullPath}/README.md`, qMd);
        } else {
          // Folder readme
          zip.file(`${fullPath}/README.md`, `# ${node.title}\n${node.description_md || ''}`);
        }
      }

      zip.file('index.md', indexMd);

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${workspace.name.replace(/\s+/g, '_')}_Archive.zip`;
      a.click();
      URL.revokeObjectURL(url);

      showToast('Exported complete workspace as ZIP!', { icon: 'check' });
      onClose();
    } catch (err) {
      console.error('Export ZIP error', err);
      showToast('Export failed', { icon: 'trash' });
    } finally {
      setIsExporting(false);
    }
  };

  // IMPORT FILE(S) (Auto-splits functions into blocks!)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsImporting(true);
      triggerHaptic(10);

      let importedCount = 0;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const text = await file.text();
        const fileName = file.name.replace(/\.(java|cpp|txt)$/, '');
        const ext = file.name.endsWith('.cpp') ? 'cpp' : 'java';

        // 1. Create a Question node for this file
        const questionId = crypto.randomUUID();
        const newQuestion: VaultNode = {
          id: questionId,
          workspace_id: workspace.id,
          parent_id: null,
          title: fileName,
          type: 'question',
          position_index: `imp_${Date.now()}_${i}`,
          description_md: `Imported from file: \`${file.name}\``,
          default_language: ext,
          status: 'todo',
          tags: ['imported'],
          is_pinned: false,
          deleted_at: null,
          created_by: profile.id,
          updated_by: profile.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        createNode(newQuestion);

        // 2. Smart split functions into blocks
        const analysis = analyzePastedCode(text);
        if (analysis.hasMultipleFunctions) {
          for (const fn of analysis.detectedFunctions) {
            const blockId = crypto.randomUUID();
            createBlock(
              {
                id: blockId,
                node_id: questionId,
                block_title: fn.title,
                position_index: `b_${Date.now()}`,
                deleted_at: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              ext === 'java' ? fn.code : '',
              ext === 'cpp' ? fn.code : ''
            );
          }
        } else {
          // Single block with full file text
          const blockId = crypto.randomUUID();
          createBlock(
            {
              id: blockId,
              node_id: questionId,
              block_title: 'Main Implementation',
              position_index: 'a0',
              deleted_at: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            ext === 'java' ? text : '',
            ext === 'cpp' ? text : ''
          );
        }

        importedCount++;
      }

      showToast(`Imported ${importedCount} files and split functions into blocks!`, {
        icon: 'check',
      });
      onClose();
    } catch (err) {
      console.error('Import error', err);
      showToast('Import failed', { icon: 'trash' });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-md bg-[#161b22] border-t sm:border border-[#30363d] rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#30363d]">
          <div className="flex items-center gap-2">
            <Archive size={18} className="text-[#58a6ff]" />
            <h3 className="text-base font-semibold text-[#f0f6fc]">
              Import & Export Code
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="touch-target p-1.5 text-[#8b949e] hover:text-[#f0f6fc] rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4 text-sm">
          {/* Export Section */}
          <div className="p-4 bg-[#0d1117] rounded-xl border border-[#30363d] space-y-2">
            <div className="flex items-center gap-2 text-[#f0f6fc] font-semibold">
              <Download size={16} className="text-[#3fb950]" />
              <span>Export Workspace as ZIP</span>
            </div>
            <p className="text-xs text-[#8b949e]">
              Downloads a structured ZIP mirroring your entire lab unit tree with runnable <code>.java</code> and <code>.cpp</code> files and documentation.
            </p>
            <button
              type="button"
              onClick={handleExportZip}
              disabled={isExporting}
              className="touch-target w-full py-2.5 bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 shadow"
            >
              <Download size={14} />
              <span>{isExporting ? 'Generating ZIP...' : 'Download ZIP Archive'}</span>
            </button>
          </div>

          {/* Import Section */}
          <div className="p-4 bg-[#0d1117] rounded-xl border border-[#30363d] space-y-2">
            <div className="flex items-center gap-2 text-[#f0f6fc] font-semibold">
              <Upload size={16} className="text-[#58a6ff]" />
              <span>Bulk Import Code Files</span>
            </div>
            <p className="text-xs text-[#8b949e]">
              Upload <code>.java</code> or <code>.cpp</code> source files. LabVault automatically detects function signatures and splits them into labelled code blocks!
            </p>
            <label className="touch-target w-full py-2.5 bg-[#21262d] hover:bg-[#30363d] text-[#f0f6fc] border border-[#30363d] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95">
              <Upload size={14} />
              <span>{isImporting ? 'Processing files...' : 'Choose Java / C++ Files'}</span>
              <input
                type="file"
                multiple
                accept=".java,.cpp,.cc,.c,.txt"
                onChange={handleFileUpload}
                disabled={isImporting}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="p-4 border-t border-[#30363d] bg-[#161b22] flex justify-end safe-area-bottom">
          <button
            type="button"
            onClick={onClose}
            className="touch-target px-5 py-2 bg-[#21262d] hover:bg-[#30363d] text-[#f0f6fc] border border-[#30363d] rounded-xl text-xs font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
