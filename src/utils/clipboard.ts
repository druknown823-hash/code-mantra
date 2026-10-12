// LabVault Clipboard & Smart Snippet Engine
import { CodeLanguage, CopyOptions, QuestionBlock, BlockVariant, CopyTemplate, VaultNode } from '../types';

/**
 * Robust cross-browser clipboard copy with iOS Safari / unsecure context fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // 1. Try modern navigator.clipboard
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      triggerHaptic();
      return true;
    } catch (err) {
      console.warn('navigator.clipboard failed, attempting fallback...', err);
    }
  }

  // 2. Hidden textarea fallback (crucial for older mobile Safari / WebViews)
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.setAttribute('readonly', '');
    textArea.setAttribute('aria-hidden', 'true');
    document.body.appendChild(textArea);

    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, text.length);

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    if (successful) {
      triggerHaptic();
      return true;
    }
  } catch (err) {
    console.error('execCommand copy fallback failed', err);
  }

  return false;
}

/**
 * Mobile haptic pulse (10ms)
 */
export function triggerHaptic(duration = 10) {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(duration);
    } catch {
      // Ignored if device lacks vibration motor
    }
  }
}

/**
 * Read text from clipboard with permission handling
 */
export async function readClipboardText(): Promise<string | null> {
  if (navigator.clipboard && navigator.clipboard.readText) {
    try {
      return await navigator.clipboard.readText();
    } catch (err) {
      console.warn('Clipboard read access denied or unavailable', err);
    }
  }
  return null;
}

/**
 * Deduplicate and hoist imports / includes to the top of assembled code
 */
export function hoistAndDeduplicateHeaders(code: string, language: CodeLanguage): string {
  const lines = code.split('\n');
  const headerLines: string[] = [];
  const bodyLines: string[] = [];
  const seenHeaders = new Set<string>();

  const isHeader = (line: string) => {
    const trimmed = line.trim();
    if (language === 'java') {
      return trimmed.startsWith('import ') || trimmed.startsWith('package ');
    } else {
      return trimmed.startsWith('#include') || trimmed.startsWith('using namespace');
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (isHeader(line)) {
      if (!seenHeaders.has(trimmed)) {
        seenHeaders.add(trimmed);
        headerLines.push(line);
      }
    } else {
      bodyLines.push(line);
    }
  }

  if (headerLines.length === 0) return code;

  // Clean trailing empty lines from headers
  return headerLines.join('\n') + '\n\n' + bodyLines.join('\n').trimStart();
}

/**
 * Assemble multiple code blocks into a single cohesive program
 */
export function assembleFullProgram(
  blocks: QuestionBlock[],
  variants: Record<string, Record<string, BlockVariant>>,
  language: CodeLanguage,
  options: CopyOptions,
  template?: CopyTemplate
): string {
  const selectedBlocks = blocks.filter(b => 
    !options.selectedBlockIds || options.selectedBlockIds.includes(b.id)
  );

  const blockSnippets: string[] = [];

  for (const block of selectedBlocks) {
    const variant = variants[block.id]?.[language];
    const opposite = variants[block.id]?.[language === 'java' ? 'cpp' : 'java'];
    const code = variant?.code_content?.trim() || opposite?.code_content?.trim() || '';

    if (options.separator === 'banner' && block.block_title?.trim()) {
      const banner = `// ==========================================\n// Function: ${block.block_title}\n// ==========================================`;
      blockSnippets.push(`${banner}\n${code}`);
    } else {
      blockSnippets.push(code);
    }
  }

  const joinSeparator = options.separator === 'none' ? '\n' : '\n\n';
  let assembled = blockSnippets.join(joinSeparator);

  // Apply boilerplate wrapper if enabled
  if (options.wrapInBoilerplate && template) {
    assembled = `${template.prefix || ''}${assembled}${template.suffix || ''}`;
  }

  // Deduplicate and hoist imports
  if (options.deduplicateImports) {
    assembled = hoistAndDeduplicateHeaders(assembled, language);
  }

  return assembled;
}

export interface DetectedFunction {
  title: string;
  code: string;
  startLine: number;
  endLine: number;
}

export interface PasteAnalysis {
  detectedLanguage: CodeLanguage | null;
  detectedFunctions: DetectedFunction[];
  lineCount: number;
  hasMultipleFunctions: boolean;
}

/**
 * Smart paste analysis: Detects functions in Java / C++ and auto-detects language
 */
export function analyzePastedCode(code: string): PasteAnalysis {
  const lineCount = code.split('\n').length;

  // 1. Language heuristics
  let javaScore = 0;
  let cppScore = 0;

  if (code.includes('System.out') || code.includes('System.err')) javaScore += 3;
  if (code.includes('public static') || code.includes('public class')) javaScore += 3;
  if (code.includes('import java.') || code.includes('Scanner sc')) javaScore += 3;
  if (code.includes('boolean ') || code.includes('String[] args')) javaScore += 2;

  if (code.includes('#include') || code.includes('<iostream>') || code.includes('<bits/stdc++.h>')) cppScore += 4;
  if (code.includes('using namespace std') || code.includes('std::')) cppScore += 3;
  if (code.includes('cout <<') || code.includes('cin >>') || code.includes('endl')) cppScore += 3;
  if (code.includes('nullptr') || code.includes('printf(') || code.includes('scanf(')) cppScore += 2;

  let detectedLanguage: CodeLanguage | null = null;
  if (javaScore > cppScore && javaScore >= 2) detectedLanguage = 'java';
  if (cppScore > javaScore && cppScore >= 2) detectedLanguage = 'cpp';

  // 2. Parse functions using brace matching
  const lines = code.split('\n');
  const functions: DetectedFunction[] = [];

  // Match Java and C++ function signatures
  // e.g. "public static int isFull() {" or "void insertElement(int val) {"
  const sigRegex = /(?:(?:public|private|protected|static|final|inline|virtual|synchronized)\s+)*(?:[\w<>\[\],*&]+)\s+([a-zA-Z_]\w*)\s*\(([^)]*)\)\s*\{?$/;

  let currentFn: { title: string; startLine: number; startIdx: number } | null = null;
  let braceDepth = 0;
  let currentFnBraceStart = 0;
  let currentFnLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!currentFn) {
      const match = trimmed.match(sigRegex);
      // Skip control flow keywords like if, for, while, switch
      const disallowed = ['if', 'for', 'while', 'switch', 'catch'];
      if (match && !disallowed.includes(match[1])) {
        const fnName = match[1];
        const params = match[2]?.trim() || '';
        const title = `${fnName}(${params ? '...' : ''})`;
        currentFn = { title, startLine: i, startIdx: i };
        currentFnLines = [line];
        braceDepth = 0;
        
        // Count braces on the declaration line
        for (const ch of line) {
          if (ch === '{') braceDepth++;
          if (ch === '}') braceDepth--;
        }
        currentFnBraceStart = braceDepth;
        continue;
      }
    } else {
      currentFnLines.push(line);
      for (const ch of line) {
        if (ch === '{') braceDepth++;
        if (ch === '}') braceDepth--;
      }

      // If function closed
      if (braceDepth <= 0 && currentFnBraceStart > 0) {
        functions.push({
          title: currentFn.title,
          code: currentFnLines.join('\n'),
          startLine: currentFn.startLine,
          endLine: i,
        });
        currentFn = null;
        currentFnLines = [];
        braceDepth = 0;
      }
    }
  }

  return {
    detectedLanguage,
    detectedFunctions: functions,
    lineCount,
    hasMultipleFunctions: functions.length > 1,
  };
}

/**
 * Format complete question as Markdown report for lab submissions
 */
export function generateQuestionMarkdown(
  node: VaultNode,
  blocks: QuestionBlock[],
  variants: Record<string, Record<string, BlockVariant>>,
  language: CodeLanguage
): string {
  const lines: string[] = [];
  lines.push(`# ${node.outline_number ? `${node.outline_number} ` : ''}${node.title}`);
  lines.push(`**Language**: ${language === 'java' ? 'Java' : 'C++'} | **Status**: ${node.status.toUpperCase()}`);
  if (node.tags && node.tags.length > 0) {
    lines.push(`**Tags**: ${node.tags.map(t => `\`#${t}\``).join(' ')}`);
  }
  lines.push('');

  if (node.description_md) {
    lines.push('## Problem Statement');
    lines.push(node.description_md);
    lines.push('');
  }

  if (node.sample_input || node.sample_output) {
    lines.push('### Test Specifications');
    if (node.sample_input) {
      lines.push('**Sample Input:**');
      lines.push('```text\n' + node.sample_input + '\n```');
    }
    if (node.sample_output) {
      lines.push('**Sample Output:**');
      lines.push('```text\n' + node.sample_output + '\n```');
    }
    lines.push('');
  }

  lines.push('## Solution Code Blocks');
  for (const block of blocks) {
    const code = variants[block.id]?.[language]?.code_content || '// No implementation';
    lines.push(`### ${block.block_title}`);
    lines.push('```' + (language === 'java' ? 'java' : 'cpp'));
    lines.push(code);
    lines.push('```');
    lines.push('');
  }

  if (node.console_output) {
    lines.push('## Execution & Test Results');
    lines.push('```text\n' + node.console_output + '\n```');
    lines.push('');
  }

  lines.push('---');
  lines.push(`*Generated with LabVault on ${new Date().toLocaleDateString()}*`);

  return lines.join('\n');
}
