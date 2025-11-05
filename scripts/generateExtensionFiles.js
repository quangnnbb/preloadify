#!/usr/bin/env node

/**
 * Script to generate extension files from shared loader definitions
 * This ensures the extension files stay in sync with the admin app
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the shared definitions
import { loaderDefinitions } from '../app/shared/loaderDefinitions.js';

const EXTENSIONS_DIR = path.join(__dirname, '../extensions/preloaders/assets');

// Ensure the extensions directory exists
if (!fs.existsSync(EXTENSIONS_DIR)) {
  console.error('Extensions directory not found:', EXTENSIONS_DIR);
  process.exit(1);
}

// Simple minifiers for CSS and HTML inside template literals
const minifyCss = (css) => {
  if (!css || typeof css !== 'string') return css || '';
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // strip comments
    .replace(/\n|\r|\t/g, ' ') // newlines/tabs to spaces
    .replace(/\s{2,}/g, ' ') // collapse spaces
    .replace(/\s*([:;,{}])\s*/g, '$1') // trim around tokens
    .replace(/;}/g, '}') // remove dangling semicolons
    .trim();
};

const minifyHtml = (html) => {
  if (!html || typeof html !== 'string') return html || '';
  return html
    .replace(/<!--([\s\S]*?)-->/g, '') // strip comments
    .replace(/\n|\r|\t/g, ' ') // newlines/tabs to spaces
    .replace(/\s{2,}/g, ' ') // collapse spaces
    .replace(/>\s+</g, '><') // trim between tags
    .trim();
};

// Generate individual loader files
Object.entries(loaderDefinitions).forEach(([key, config]) => {
  const fileName = `${key}.js`;
  const filePath = path.join(EXTENSIONS_DIR, fileName);
  
  const fileContent = `// ${config.name} Loader Configuration (minified)
export const ${key}Config = {
  css: \`${minifyCss(config.css)}\`,
  html: \`${minifyHtml(config.html)}\`
};`;

  fs.writeFileSync(filePath, fileContent);
  console.log(`Generated: ${fileName}`);
});

// Update config.json
const configJson = {};
Object.entries(loaderDefinitions).forEach(([key, config]) => {
  configJson[key] = {
    css: `${key}.css`,
    html: `${key}.html`,
    name: config.name,
    description: config.description
  };
});

const configPath = path.join(EXTENSIONS_DIR, 'config.json');
fs.writeFileSync(configPath, JSON.stringify(configJson, null, 2));
console.log('Generated: config.json');

console.log('\n✅ Extension files generated successfully!');
console.log('All loader definitions are now in sync between admin app and extension.');
