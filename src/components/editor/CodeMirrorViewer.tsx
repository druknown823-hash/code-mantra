// LabVault Read-Only CodeMirror Viewer (Fast, Mobile Optimized, No Keyboard Popups)
import React, { useEffect, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, lineNumbers, highlightActiveLineGutter } from '@codemirror/view';
import { oneDark } from '@codemirror/theme-one-dark';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { CodeLanguage } from '../../types';
import { copyToClipboard } from '../../utils/clipboard';
import { useVaultStore } from '../../stores/useVaultStore';

interface Props {
  code: string;
  language: CodeLanguage;
  lineWrapping?: boolean;
  fontSize?: number;
  onCopyLine?: (lineText: string) => void;
}

export const CodeMirrorViewer: React.FC<Props> = ({
  code,
  language,
  lineWrapping = false,
  fontSize = 14,
  onCopyLine,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const showToast = useVaultStore((s) => s.showToast);

  useEffect(() => {
    if (!containerRef.current) return;

    // Destroy existing view
    if (viewRef.current) {
      viewRef.current.destroy();
    }

    const langExtension = language === 'java' ? java() : cpp();

    const lineClickHandler = EditorView.domEventHandlers({
      click(event, view) {
        const target = event.target as HTMLElement;
        if (target.classList.contains('cm-gutterElement')) {
          const lineNum = parseInt(target.textContent || '', 10);
          if (!isNaN(lineNum)) {
            const line = view.state.doc.line(lineNum);
            const lineText = line.text;
            copyToClipboard(lineText);
            showToast(`Copied line ${lineNum}`, { icon: 'copy' });
            if (onCopyLine) onCopyLine(lineText);
          }
        }
      },
    });

    const extensions = [
      lineNumbers(),
      highlightActiveLineGutter(),
      langExtension,
      oneDark,
      EditorState.readOnly.of(true),
      lineClickHandler,
      EditorView.theme({
        '&': {
          fontSize: `${fontSize}px`,
          backgroundColor: 'transparent !important',
        },
        '.cm-scroller': {
          overflowX: 'auto',
          fontFamily: 'var(--font-mono, "JetBrains Mono", "Fira Code", monospace)',
          lineHeight: '1.6',
        },
        '.cm-content': {
          padding: '8px 0',
          caretColor: 'transparent',
        },
        '.cm-line': {
          padding: '0 8px',
        },
        '.cm-gutters': {
          backgroundColor: 'transparent',
          borderRight: '1px solid #30363d',
          color: '#6e7681',
          cursor: 'pointer',
        },
        '.cm-gutterElement:hover': {
          color: '#58a6ff',
        },
      }),
    ];

    if (lineWrapping) {
      extensions.push(EditorView.lineWrapping);
    }

    const state = EditorState.create({
      doc: code,
      extensions,
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
  }, [code, language, lineWrapping, fontSize]);

  return (
    <div 
      ref={containerRef} 
      className="w-full overflow-hidden rounded-md bg-[#0d1117]/80 text-sm select-text"
      style={{ minHeight: '60px' }}
    />
  );
};
