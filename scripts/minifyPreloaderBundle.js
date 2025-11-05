#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC = path.join(__dirname, '../extensions/preloaders/assets/preloader.bundle.dev.js');
const OUT = path.join(__dirname, '../extensions/preloaders/assets/preloader.bundle.js');

if (!fs.existsSync(SRC)) {
  console.error('Source not found:', SRC);
  process.exit(1);
}

const code = fs.readFileSync(SRC, 'utf8');

// Lightweight JS minifier (whitespace & comment stripper). For production-grade, use esbuild/terser.
const minifyJs = (js) => {
  return js
    // remove block comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // remove line comments (safe-ish; avoids URLs)
    .replace(/(^|\s+)\/\/.*$/gm, '$1')
    // collapse whitespace
    .replace(/\s+/g, ' ')
    // trim before/after punctuation
    .replace(/\s*([{}();,:])\s*/g, '$1')
    // trim
    .trim();
};

const min = minifyJs(code);
fs.writeFileSync(OUT, min);
console.log('Minified preloader bundle ->', OUT);


