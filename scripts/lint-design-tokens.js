#!/usr/bin/env node
/**
 * lint-design-tokens.js — Enforces DESIGN-TOKENS.md color rules
 * 
 * Scans all .tsx, .ts, .css, and .jsx files for forbidden hex colors.
 * Run standalone or wire into pre-commit hook.
 * 
 * Usage:
 *   node scripts/lint-design-tokens.js           # scan all files
 *   node scripts/lint-design-tokens.js --staged   # scan git staged files only
 * 
 * Exit code 1 if violations found. Exit code 0 if clean.
 * 
 * Added: May 27, 2026 — Harness engineering: self-enforcing design system
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

// ─── FORBIDDEN COLORS (from docs/DESIGN-TOKENS.md) ───
// These were retired because they compete with or clash with the approved palette.
const FORBIDDEN = [
  { hex: '#4ade80', name: 'green',  reason: 'competes with cyan' },
  { hex: '#2dd4bf', name: 'teal',   reason: 'too close to cyan' },
  { hex: '#fb7185', name: 'coral',  reason: 'clashes with magenta' },
  { hex: '#fb923c', name: 'orange', reason: 'too red, replaced by amber' },
  { hex: '#3b82f6', name: 'blue',   reason: 'too close to cyan' },
];

// rgb()/rgba() equivalents of the forbidden hexes (any spacing, any alpha)
const FORBIDDEN_RGB = [
  { pattern: /rgba?\(\s*74\s*,\s*222\s*,\s*128/g,  name: 'green rgb()',  reason: 'competes with cyan' },
  { pattern: /rgba?\(\s*45\s*,\s*212\s*,\s*191/g,  name: 'teal rgb()',   reason: 'too close to cyan' },
  { pattern: /rgba?\(\s*251\s*,\s*113\s*,\s*133/g, name: 'coral rgb()',  reason: 'clashes with magenta' },
  { pattern: /rgba?\(\s*251\s*,\s*146\s*,\s*60/g,  name: 'orange rgb()', reason: 'too red, replaced by amber' },
  { pattern: /rgba?\(\s*59\s*,\s*130\s*,\s*246/g,  name: 'blue rgb()',   reason: 'too close to cyan' },
];

// Also check common Tailwind utility classes that map to forbidden colors
const FORBIDDEN_TAILWIND = [
  { pattern: /\btext-green-\d{3}\b/g, name: 'green Tailwind class' },
  { pattern: /\bbg-green-\d{3}\b/g, name: 'green Tailwind class' },
  { pattern: /\bborder-green-\d{3}\b/g, name: 'green Tailwind class' },
  { pattern: /\btext-teal-\d{3}\b/g, name: 'teal Tailwind class' },
  { pattern: /\bbg-teal-\d{3}\b/g, name: 'teal Tailwind class' },
  { pattern: /\btext-orange-\d{3}\b/g, name: 'orange Tailwind class' },
  { pattern: /\bbg-orange-\d{3}\b/g, name: 'orange Tailwind class' },
  { pattern: /\btext-blue-500\b/g, name: 'blue-500 Tailwind class (too close to cyan)' },
  { pattern: /\bbg-blue-500\b/g, name: 'blue-500 Tailwind class (too close to cyan)' },
];

// File extensions to scan
const SCAN_EXTENSIONS = ['.tsx', '.ts', '.jsx', '.css', '.scss'];

// Directories to skip (.claude = vendored skills/tooling, not site code)
const SKIP_DIRS = ['node_modules', '.next', '.git', 'dist', 'build', '.vercel', '.claude'];

// ─── FILE DISCOVERY ───

function getFilesToScan() {
  const stagedOnly = process.argv.includes('--staged');
  
  if (stagedOnly) {
    try {
      const staged = execSync('git diff --cached --name-only --diff-filter=ACM', {
        cwd: ROOT,
        encoding: 'utf-8',
      }).trim();
      if (!staged) return [];
      return staged.split('\n')
        .filter(f => SCAN_EXTENSIONS.some(ext => f.endsWith(ext)))
        .map(f => path.join(ROOT, f));
    } catch {
      console.warn('⚠️  git not available — scanning all files');
    }
  }
  
  // Scan all files recursively
  const files = [];
  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (SKIP_DIRS.includes(entry.name)) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (SCAN_EXTENSIONS.some(ext => entry.name.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }
  walk(ROOT);
  return files;
}

// ─── SCANNING ───

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const violations = [];
  const relPath = path.relative(ROOT, filePath);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Check forbidden hex colors (case-insensitive)
    for (const color of FORBIDDEN) {
      if (line.toLowerCase().includes(color.hex.toLowerCase())) {
        // Skip if it's in a comment about forbidden colors
        if (line.includes('FORBIDDEN') || line.includes('forbidden') || line.includes('Retired') || line.includes('banned')) continue;
        violations.push({
          file: relPath,
          line: lineNum,
          color: color.name,
          hex: color.hex,
          reason: color.reason,
          text: line.trim().substring(0, 80),
        });
      }
    }

    // Check forbidden rgb()/rgba() equivalents
    for (const rgb of FORBIDDEN_RGB) {
      rgb.pattern.lastIndex = 0;
      if (rgb.pattern.test(line)) {
        if (line.includes('FORBIDDEN') || line.includes('forbidden') || line.includes('Retired') || line.includes('banned')) continue;
        violations.push({
          file: relPath,
          line: lineNum,
          color: rgb.name,
          hex: '(rgb)',
          reason: rgb.reason,
          text: line.trim().substring(0, 80),
        });
      }
    }

    // Check forbidden Tailwind classes
    for (const tw of FORBIDDEN_TAILWIND) {
      tw.pattern.lastIndex = 0; // reset regex
      if (tw.pattern.test(line)) {
        violations.push({
          file: relPath,
          line: lineNum,
          color: tw.name,
          hex: '(Tailwind)',
          reason: 'Use var(--cyan), var(--magenta), var(--purple), or var(--amber) instead',
          text: line.trim().substring(0, 80),
        });
      }
    }
  }

  return violations;
}

// ─── MAIN ───

function main() {
  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║  IHE DESIGN TOKEN LINT                       ║');
  console.log('╚══════════════════════════════════════════════╝\n');

  const files = getFilesToScan();
  console.log(`Scanning ${files.length} files...\n`);

  let allViolations = [];

  for (const file of files) {
    const violations = scanFile(file);
    allViolations = allViolations.concat(violations);
  }

  if (allViolations.length === 0) {
    console.log('  ✅ No forbidden colors found. Design system clean.\n');
    process.exit(0);
  }

  console.log(`  ❌ ${allViolations.length} violation(s) found:\n`);
  
  for (const v of allViolations) {
    console.log(`  ${v.file}:${v.line}`);
    console.log(`    Color: ${v.color} (${v.hex})`);
    console.log(`    Reason: ${v.reason}`);
    console.log(`    Line: ${v.text}`);
    console.log('');
  }

  console.log('  Use CSS variables from docs/DESIGN-TOKENS.md instead:');
  console.log('    var(--cyan)    → #00d4ff');
  console.log('    var(--magenta) → #b040a8');
  console.log('    var(--purple)  → #a78bfa');
  console.log('    var(--amber)   → #f59e0b\n');

  process.exit(1);
}

main();
