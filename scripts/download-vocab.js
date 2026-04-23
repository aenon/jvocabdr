#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const VOCABULARY_SOURCES = {
  'oxford-5000': {
    name: 'Oxford 5000',
    url: 'https://raw.githubusercontent.com/winterdl/oxford-5000-vocabulary-audio-definition/main/data/oxford_5000.json',
    license: 'Oxford (non-commercial)',
    levels: ['A1', 'A2', 'B1', 'B2', 'C1'],
    format: 'json',
  },
  'oxford-3000': {
    name: 'Oxford 3000',
    url: 'https://raw.githubusercontent.com/winterdl/oxford-5000-vocabulary-audio-definition/main/data/oxford_3000.json',
    license: 'Oxford (non-commercial)',
    levels: ['A1', 'A2', 'B1', 'B2'],
    format: 'json',
  },
  'cefr-j': {
    name: 'CEFR-J Vocabulary',
    url: 'https://raw.githubusercontent.com/openlanguageprofiles/olp-en-cefrj/master/olp-en-cefrj.json',
    license: 'CC BY-SA 4.0 (cite CEFR-J)',
    levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
    format: 'json',
  },
  'words-cefr': {
    name: 'Words CEFR Dataset',
    url: 'https://raw.githubusercontent.com/Maximax67/Words-CEFR-Dataset/main/csv/word_pos.csv',
    license: 'MIT',
    levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
    format: 'csv',
  },
  'efllex': {
    name: 'EFLLex (CEFR-graded)',
    url: 'http://cental.uclouvain.be/cefrlex/static/resources/en/EFLLex.tsv',
    license: 'CC BY-NC-SA 4.0',
    levels: ['A1', 'A2', 'B1', 'B2', 'C1'],
    format: 'tsv',
  },
};

const args = process.argv.slice(2);

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  console.log(`
Vocabulary Download Script

Usage: node download-vocab.js [options]

Options:
  --list, -l              List all available sources
  --download <names>      Download specific sources (comma-separated)
  --download-all         Download all sources
  --output <dir>         Output directory (default: data/downloads)

Examples:
  node download-vocab.js --list
  node download-vocab.js --download oxford-5000,oxford-3000
  node download-vocab.js --download-all
`);
  process.exit(0);
}

if (args.includes('--list') || args.includes('-l')) {
  console.log('\nAvailable Vocabulary Sources:\n');
  for (const [key, source] of Object.entries(VOCABULARY_SOURCES)) {
    console.log(`  ${key}`);
    console.log(`    Name: ${source.name}`);
    console.log(`    Levels: ${source.levels.join(', ')}`);
    console.log(`    License: ${source.license}`);
    console.log(`    Format: ${source.format}`);
    console.log();
  }
  process.exit(0);
}

let outputDir = 'data/downloads';
let downloadNames = [];

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--output' && args[i + 1]) {
    outputDir = args[i + 1];
    i++;
  } else if (args[i] === '--download' && args[i + 1]) {
    downloadNames = args[i + 1].split(',');
    i++;
  } else if (args[i] === '--download-all') {
    downloadNames = Object.keys(VOCABULARY_SOURCES);
  }
}

if (downloadNames.length === 0) {
  console.error('Error: No sources specified. Use --download or --download-all');
  process.exit(1);
}

async function downloadFile(url, filepath) {
  console.log(`Downloading ${url}...`);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const text = await response.text();
    fs.writeFileSync(filepath, text);
    console.log(`  Saved to ${filepath}`);
    return true;
  } catch (err) {
    console.error(`  Failed: ${err.message}`);
    return false;
  }
}

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });

  console.log(`\nDownloading to ${outputDir}/\n`);
  
  const results = {};
  
  for (const name of downloadNames) {
    const source = VOCABULARY_SOURCES[name];
    if (!source) {
      console.error(`Unknown source: ${name}`);
      continue;
    }
    
    const ext = source.format;
    const filepath = path.join(outputDir, `${name}.${ext}`);
    results[name] = await downloadFile(source.url, filepath);
  }

  console.log('\n--- Summary ---');
  for (const [name, success] of Object.entries(results)) {
    const source = VOCABULARY_SOURCES[name];
    console.log(`  ${success ? '✓' : '✗'} ${source.name}`);
  }
}

main();