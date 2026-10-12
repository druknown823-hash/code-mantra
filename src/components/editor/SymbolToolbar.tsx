import React from 'react';
import { Undo, Redo } from 'lucide-react';
import { triggerHaptic } from '../../utils/clipboard';

interface Props {
  onInsertSymbol: (symbol: string) => void;
  onUndo?: () => void;
  onRedo?: () => void;
}

const SYMBOLS = [
  { label: 'Tab', value: '    ' },
  { label: '{', value: '{' },
  { label: '}', value: '}' },
  { label: '(', value: '(' },
  { label: ')', value: ')' },
  { label: '[', value: '[' },
  { label: ']', value: ']' },
  { label: ';', value: ';' },
  { label: '<', value: '<' },
  { label: '>', value: '>' },
  { label: '#', value: '#' },
  { label: '&', value: '&' },
  { label: '*', value: '*' },
  { label: ':', value: ':' },
  { label: '"', value: '"' },
  { label: "'", value: "'" },
  { label: '->', value: '->' },
  { label: '=', value: '=' },
  { label: '!', value: '!' },
];

export const SymbolToolbar: React.FC<Props> = ({
  onInsertSymbol,
  onUndo,
  onRedo,
}) => {
  const handleSymbolClick = (value: string) => {
    triggerHaptic(5);
    onInsertSymbol(value);
  };

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto px-2 py-2 bg-[#161b22] border-t border-[#30363d] no-scrollbar select-none z-30">
      {onUndo && (
        <button
          type="button"
          onClick={() => { triggerHaptic(5); onUndo(); }}
          className="flex-shrink-0 touch-target h-10 px-3 bg-[#21262d] hover:bg-[#30363d] active:scale-95 text-[#c9d1d9] rounded-lg border border-[#30363d] text-sm font-medium transition-all"
          aria-label="Undo"
        >
          <Undo size={16} />
        </button>
      )}

      {onRedo && (
        <button
          type="button"
          onClick={() => { triggerHaptic(5); onRedo(); }}
          className="flex-shrink-0 touch-target h-10 px-3 bg-[#21262d] hover:bg-[#30363d] active:scale-95 text-[#c9d1d9] rounded-lg border border-[#30363d] text-sm font-medium transition-all"
          aria-label="Redo"
        >
          <Redo size={16} />
        </button>
      )}

      <div className="w-[1px] h-6 bg-[#30363d] mx-1 flex-shrink-0" />

      {SYMBOLS.map((sym) => (
        <button
          key={sym.label}
          type="button"
          onClick={() => handleSymbolClick(sym.value)}
          className="flex-shrink-0 touch-target h-10 px-3.5 bg-[#21262d] hover:bg-[#30363d] active:scale-95 text-[#f0f6fc] rounded-lg border border-[#30363d] font-mono text-base font-semibold transition-all"
        >
          {sym.label}
        </button>
      ))}
    </div>
  );
};
