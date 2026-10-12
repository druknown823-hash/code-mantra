import fs from 'fs';
import path from 'path';

const dataDir = path.resolve('data/ds Cources(pract)/Cources(pract)');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.md'));

console.log(`Found ${files.length} markdown files in directory.`);

// Helper to extract clean title like "1.11.1" from "1 11 1 3f65e3ac...md"
function extractTitle(fileName, fileContent) {
  const firstLine = fileContent.split('\n')[0].trim();
  if (firstLine.startsWith('# ')) {
    return firstLine.substring(2).trim();
  }
  const prefix = fileName.replace(/\s+[a-f0-9]{32}\.md$/, '');
  return prefix.replace(/\s+/g, '.');
}

// Custom sort for dotted numerical strings e.g. 1.1.1 vs 1.10.1 vs 1.11.1
function compareTitles(a, b) {
  const aParts = a.split('.').map(n => parseInt(n, 10));
  const bParts = b.split('.').map(n => parseInt(n, 10));
  for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
    const aVal = aParts[i] || 0;
    const bVal = bParts[i] || 0;
    if (aVal !== bVal) return aVal - bVal;
  }
  return a.localeCompare(b);
}

const parsedSolutions = [];

for (const file of files) {
  const filePath = path.join(dataDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  const pageTitle = extractTitle(file, content);
  const blocks = [];

  let currentLabel = '';
  let inCodeBlock = false;
  let currentCode = [];
  let currentLang = 'cpp';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith('# ')) {
      continue;
    }

    if (trimmed.startsWith('```')) {
      if (!inCodeBlock) {
        // Starting code fence
        inCodeBlock = true;
        const langPart = trimmed.substring(3).trim();
        currentLang = langPart || 'cpp';
        currentCode = [];
      } else {
        // Ending code fence
        inCodeBlock = false;
        const codeText = currentCode.join('\n').trim();
        let blockTitle = currentLabel.trim();
        // If there is no explicit label, don't invent "Main Solution" placeholder
        if (!blockTitle || blockTitle === 'Main Solution') {
          blockTitle = '';
        }

        // Auto-detect if C++ or Java; for this DS course, all code with cin/cout/etc is cpp
        const isCppCode = codeText.includes('cin') || 
                          codeText.includes('cout') || 
                          codeText.includes('#include') || 
                          codeText.includes('nullptr') || 
                          codeText.includes('std::') ||
                          codeText.includes('malloc') ||
                          currentLang === 'cpp';

        blocks.push({
          label: blockTitle,
          code: codeText,
          lang: isCppCode ? 'cpp' : (currentLang === 'java' ? 'java' : 'cpp')
        });

        currentLabel = '';
        currentCode = [];
      }
      continue;
    }

    if (inCodeBlock) {
      currentCode.push(line);
    } else {
      if (trimmed.length > 0) {
        currentLabel = trimmed;
      }
    }
  }

  parsedSolutions.push({
    title: pageTitle,
    blocks
  });
}

parsedSolutions.sort((a, b) => compareTitles(a.title, b.title));

console.log(`Successfully parsed ${parsedSolutions.length} solutions in order:`);
for (const s of parsedSolutions) {
  console.log(`- ${s.title}: ${s.blocks.length} block(s) -> [${s.blocks.map(b => b.label).join(', ')}]`);
}

fs.writeFileSync('scripts/parsedData.json', JSON.stringify(parsedSolutions, null, 2));
