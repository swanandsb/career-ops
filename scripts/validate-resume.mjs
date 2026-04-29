#!/usr/bin/env node

import { readFileSync } from 'fs';
import { resolve } from 'path';

const inputArg = process.argv[2];
if (!inputArg) {
  console.error('Usage: node scripts/validate-resume.mjs <resume.html>');
  process.exit(1);
}

const filePath = resolve(inputArg);
let html;
try {
  html = readFileSync(filePath, 'utf8');
} catch (err) {
  console.error(`Failed to read file: ${filePath}`);
  console.error(err.message);
  process.exit(1);
}

const lineStarts = buildLineStarts(html);
const checks = [];

checks.push(checkBulletLength(html, lineStarts));
checks.push(checkTechnologiesPerJob(html, lineStarts));
checks.push(checkJobChronology(html, lineStarts));
checks.push(checkSummaryWordCount(html, lineStarts));
checks.push(checkRequiredKeywords(html));
checks.push(checkAcronymExpansion(html));
checks.push(checkCssTruncationRules(html, lineStarts));
checks.push(checkUnicodeIssues(html, lineStarts));

let totalIssues = 0;
for (const check of checks) {
  totalIssues += check.violations.length;
}

for (const check of checks) {
  const status = check.violations.length === 0 ? 'PASS' : 'FAIL';
  console.log(`${status} - ${check.name}`);
  for (const violation of check.violations) {
    console.log(`  - ${violation}`);
  }
}

console.log(`Summary: ${totalIssues} issues found`);
process.exit(totalIssues > 0 ? 1 : 0);

function buildLineStarts(text) {
  const starts = [0];
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '\n') starts.push(i + 1);
  }
  return starts;
}

function lineForIndex(index, starts) {
  let lo = 0;
  let hi = starts.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (starts[mid] <= index) lo = mid + 1;
    else hi = mid - 1;
  }
  return hi + 1;
}

function stripTags(value) {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function checkBulletLength(text, starts) {
  const violations = [];
  const matches = [...text.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)];
  for (const match of matches) {
    const bulletText = stripTags(match[1]);
    if (bulletText.length > 140) {
      const line = lineForIndex(match.index, starts);
      violations.push(`[line ${line}] ${bulletText.length} chars: "${bulletText}"`);
    }
  }
  return { name: 'Bullet length (<= 140 chars)', violations };
}

function checkTechnologiesPerJob(text, starts) {
  const violations = [];
  const divMatches = [...text.matchAll(/<div\b[^>]*class="([^"]*)"[^>]*>/gi)];
  const jobMatches = divMatches.filter((m) => m[1].split(/\s+/).includes('job'));
  for (let i = 0; i < jobMatches.length; i++) {
    const start = jobMatches[i].index;
    const end = i + 1 < jobMatches.length ? jobMatches[i + 1].index : text.length;
    const jobChunk = text.slice(start, end);
    if (!/Technologies:\s*/i.test(jobChunk)) {
      const line = lineForIndex(start, starts);
      violations.push(`[line ${line}] Missing "Technologies:" line in .job block #${i + 1}`);
    }
  }
  return { name: 'Technologies line per .job', violations };
}

function checkJobChronology(text, starts) {
  const violations = [];
  const divMatches = [...text.matchAll(/<div\b[^>]*class="([^"]*)"[^>]*>/gi)];
  const jobMatches = divMatches.filter((m) => m[1].split(/\s+/).includes('job'));
  const entries = [];
  for (let i = 0; i < jobMatches.length; i++) {
    const start = jobMatches[i].index;
    const end = i + 1 < jobMatches.length ? jobMatches[i + 1].index : text.length;
    const jobChunk = text.slice(start, end);
    const periodMatch = jobChunk.match(/class="job-period"[^>]*>([\s\S]*?)<\/span>/i);
    const companyMatch = jobChunk.match(/class="job-company"[^>]*>([\s\S]*?)<\/span>/i);
    const periodText = periodMatch ? stripTags(periodMatch[1]).trim() : '';
    const companyText = companyMatch ? stripTags(companyMatch[1]).trim() : '(unknown company)';
    const line = lineForIndex(start, starts);
    const sortKey = parseJobPeriodStartKey(periodText);
    entries.push({ line, companyText, periodText, sortKey });
  }
  for (let i = 0; i < entries.length; i++) {
    if (entries[i].sortKey === null) {
      violations.push(
        `[line ${entries[i].line}] Could not parse start date from job-period: "${entries[i].periodText}"`
      );
    }
  }
  for (let i = 0; i < entries.length - 1; i++) {
    const cur = entries[i];
    const next = entries[i + 1];
    if (cur.sortKey === null || next.sortKey === null) continue;
    if (cur.sortKey < next.sortKey) {
      violations.push(
        `[line ${cur.line}] Out of order: "${cur.companyText}" (starts ${cur.periodText}) appears before "${next.companyText}" (${next.periodText}) — must be reverse chronological by start date`
      );
    }
  }
  return { name: 'Work experience chronology (reverse by start date)', violations };
}

/** Numeric sort key: higher = more recent start. Null if unparseable. */
function parseJobPeriodStartKey(periodPlain) {
  if (!periodPlain) return null;
  const left = periodPlain.split('|')[0].trim();
  const startSegment = left.split(/\s*-\s*/)[0].trim();
  const m = startSegment.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (!m) return null;
  const year = parseInt(m[2], 10);
  const monthIdx = monthNameToIndex(m[1]);
  if (monthIdx === null || Number.isNaN(year)) return null;
  return year * 12 + monthIdx;
}

function monthNameToIndex(name) {
  const prefix = name.toLowerCase().replace(/\.$/, '').slice(0, 3);
  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const idx = months.indexOf(prefix);
  return idx === -1 ? null : idx;
}

function checkSummaryWordCount(text, starts) {
  const violations = [];
  const summaryMatch = text.match(/<[^>]*class="[^"]*\bsummary-text\b[^"]*"[^>]*>([\s\S]*?)<\/[^>]+>/i);
  if (!summaryMatch) {
    violations.push('Missing .summary-text element');
    return { name: 'Summary length (<= 100 words)', violations };
  }
  const summaryText = stripTags(summaryMatch[1]);
  const words = summaryText ? summaryText.split(/\s+/).length : 0;
  if (words > 100) {
    const line = lineForIndex(summaryMatch.index, starts);
    violations.push(`[line ${line}] Summary has ${words} words`);
  }
  return { name: 'Summary length (<= 100 words)', violations };
}

function checkRequiredKeywords(text) {
  const violations = [];
  const bodyText = stripTags(text).toLowerCase();
  const required = ['llm', 'rag', 'python', 'api', 'deployment', 'production', 'ai'];
  const missing = required.filter((kw) => !new RegExp(`\\b${escapeRegex(kw)}\\b`, 'i').test(bodyText));
  if (missing.length > 0) {
    violations.push(`[line 1] Missing required keywords: ${missing.join(', ')}`);
  }
  return { name: 'Required keyword coverage', violations };
}

function checkAcronymExpansion(text) {
  const violations = [];
  const requiredExpanded = [
    'Retrieval-Augmented Generation (RAG)',
    'Large Language Model (LLM)',
    'Model Context Protocol (MCP)',
  ];
  for (const phrase of requiredExpanded) {
    if (!text.includes(phrase)) {
      violations.push(`[line 1] Missing expanded acronym: "${phrase}"`);
    }
  }
  return { name: 'Acronym expansion presence', violations };
}

function checkCssTruncationRules(text, starts) {
  const violations = [];
  const styleMatches = [...text.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)];
  if (styleMatches.length === 0) {
    return { name: 'CSS truncation/content hiding', violations };
  }

  const contentSelectors = [
    '.summary-text',
    '.job',
    '.job li',
    '.project',
    '.project-desc',
    '.skill-item',
    '.edu-item',
    '.certifications-inline',
  ];

  for (const styleMatch of styleMatches) {
    const css = styleMatch[1];
    const blockRegex = /([^{}]+)\{([^{}]+)\}/g;
    for (const blockMatch of css.matchAll(blockRegex)) {
      const selectors = blockMatch[1];
      const declarations = blockMatch[2];
      const hasHideRule = /display\s*:\s*none|overflow\s*:\s*hidden/i.test(declarations);
      if (!hasHideRule) continue;

      const selectorList = selectors.split(',').map((s) => s.trim());
      const isProjectCapRule =
        /display\s*:\s*none/i.test(declarations) &&
        selectorList.some((s) =>
          /\.project\s*:\s*nth-of-type\s*\(\s*n\s*\+\s*[34]\s*\)/i.test(s)
        );

      const impactsContent = selectorList.some((selector) =>
        contentSelectors.some((contentSel) => selectorTouchesContentSelector(selector, contentSel))
      );
      if (!impactsContent || isProjectCapRule) continue;

      const absoluteIndex = styleMatch.index + styleMatch[0].indexOf(blockMatch[0]);
      const line = lineForIndex(absoluteIndex, starts);
      violations.push(`[line ${line}] Content selector with hiding rule: "${selectors.trim()}"`);
    }
  }

  return { name: 'CSS truncation/content hiding', violations };
}

function checkUnicodeIssues(text, starts) {
  const violations = [];
  const riskyChars = {
    '\u2014': 'em dash',
    '\u2013': 'en dash',
    '\u2018': 'left single quote',
    '\u2019': 'right single quote',
    '\u201C': 'left double quote',
    '\u201D': 'right double quote',
    '\u2022': 'bullet',
  };

  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const lineNo = i + 1;
    const line = lines[i];

    for (const [char, name] of Object.entries(riskyChars)) {
      if (line.includes(char)) {
        violations.push(`[line ${lineNo}] Found ${name}: "${char}"`);
      }
    }

    const nonAscii = line.match(/[^\x00-\x7F]/g);
    if (nonAscii) {
      for (const ch of nonAscii) {
        if (!Object.prototype.hasOwnProperty.call(riskyChars, ch)) {
          violations.push(`[line ${lineNo}] Non-ASCII character: "${ch}" (U+${ch.codePointAt(0).toString(16).toUpperCase()})`);
        }
      }
    }
  }

  return { name: 'Unicode ATS safety', violations };
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * True if `selector` references the same class / compound as `contentSel`
 * (e.g. `.job` matches `.job` or `.job.foo` but not `.job-location`).
 */
function selectorTouchesContentSelector(selector, contentSel) {
  if (contentSel.includes(' ')) {
    return selector.includes(contentSel.trim());
  }
  if (!contentSel.startsWith('.')) {
    return selector.includes(contentSel);
  }
  const cls = escapeRegex(contentSel.slice(1));
  const re = new RegExp(`\\.${cls}(?![a-zA-Z0-9_-])`);
  return re.test(selector);
}
