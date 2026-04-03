// ═══════════════════════════════════════════════════════════
//  MATRIX TERMINAL — MAIN ENTRY POINT
// ═══════════════════════════════════════════════════════════

import './style.css';
import { getCommandResult, AVAILABLE_COMMANDS, virtualFiles } from './commands';
import { typeLines, printLine, printLines } from './typing';
import { MatrixRain } from './matrix-rain';

// ─── State ──────────────────────────────────────────────────
let commandHistory: string[] = [];
let historyIndex: number = -1;
let isProcessing: boolean = false;

// ─── DOM Elements ───────────────────────────────────────────
let terminalOutput: HTMLElement;
let inputField: HTMLInputElement;
let matrixRain: MatrixRain;

// ─── Prompt HTML ────────────────────────────────────────────
const PROMPT_HTML = `<span class="prompt"><span class="prompt-user">khalil@portfolio</span>:<span class="prompt-path">~</span><span class="prompt-symbol">$</span></span> `;

// ─── Boot Sequence ──────────────────────────────────────────
const BOOT_LINES = [
  '<span class="text-green-dim">[    0.000000] MatrixOS v4.2.0 — Initializing kernel...</span>',
  '<span class="text-green-dim">[    0.001337] Mounting encrypted filesystem...</span>',
  '<span class="text-green-dim">[    0.002048] Network interfaces: <span class="text-green-bright">ONLINE</span></span>',
  '<span class="text-green-dim">[    0.003072] Firewall rules loaded: 47 rules active</span>',
  '<span class="text-green-dim">[    0.004096] Intrusion Detection System: <span class="text-green-bright">ARMED</span></span>',
  '<span class="text-green-dim">[    0.005120] Secure shell daemon started on port 22</span>',
  '<span class="text-green-dim">[    0.006144] Loading user profile: <span class="text-green-bright">khalildev</span></span>',
  '<span class="text-green-dim">[    0.007168] Clearance level: <span class="text-amber">5 — FULL ACCESS</span></span>',
  '<span class="text-green-dim">[    0.008192] System ready. Welcome back.</span>',
  '',
];

const WELCOME_ART = [
  '',
  '<span class="ascii-art"> ███╗   ███╗ █████╗ ████████╗██████╗ ██╗██╗  ██╗</span>',
  '<span class="ascii-art"> ████╗ ████║██╔══██╗╚══██╔══╝██╔══██╗██║╚██╗██╔╝</span>',
  '<span class="ascii-art"> ██╔████╔██║███████║   ██║   ██████╔╝██║ ╚███╔╝ </span>',
  '<span class="ascii-art"> ██║╚██╔╝██║██╔══██║   ██║   ██╔══██╗██║ ██╔██╗ </span>',
  '<span class="ascii-art"> ██║ ╚═╝ ██║██║  ██║   ██║   ██║  ██║██║██╔╝ ██╗</span>',
  '<span class="ascii-art"> ╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝</span>',
  '',
  '<span class="text-green-bright glow">  ┌──────────────────────────────────────────────┐</span>',
  '<span class="text-green-bright glow">  │   KHALIL — Student & Full-Stack Portfolio       │</span>',
  '<span class="text-green-bright glow">  │   "There is no spoon."                       │</span>',
  '<span class="text-green-bright glow">  └──────────────────────────────────────────────┘</span>',
  '',
  '<span class="text-green-dim">  Type <span class="text-green-bright glow">help</span> to see available commands.</span>',
  '<span class="text-green-dim">  Type <span class="text-green-bright glow">matrix</span> to enter the Matrix.</span>',
  '',
];

// ─── Initialize ─────────────────────────────────────────────
function init(): void {
  const app = document.getElementById('app')!;

  // Build terminal structure
  app.innerHTML = `
    <div class="terminal-container" id="terminal-output"></div>
    <div class="input-area" id="input-area">
      <span class="prompt">
        <span class="prompt-user">khalil@portfolio</span>:<span class="prompt-path">~</span><span class="prompt-symbol">$</span>
      </span>&nbsp;
      <input
        type="text"
        id="terminal-input"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
        placeholder="type a command..."
        aria-label="Terminal input"
      />
    </div>
  `;

  terminalOutput = document.getElementById('terminal-output')!;
  inputField = document.getElementById('terminal-input') as HTMLInputElement;
  matrixRain = new MatrixRain();

  // Event listeners
  inputField.addEventListener('keydown', handleKeyDown);
  document.addEventListener('click', () => {
    if (!matrixRain.isActive()) {
      inputField.focus();
    }
  });

  // Focus input on load
  inputField.focus();

  // Run boot sequence
  runBootSequence();
}

// ─── Boot Sequence ──────────────────────────────────────────
async function runBootSequence(): Promise<void> {
  isProcessing = true;

  // Boot lines with delays
  for (const line of BOOT_LINES) {
    printLine(terminalOutput, line, 'boot-line');
    await delay(80 + Math.random() * 120);
  }

  await delay(300);

  // Welcome art
  printLines(terminalOutput, WELCOME_ART);

  scrollToBottom();
  isProcessing = false;
  inputField.focus();
}

// ─── Key Handler ────────────────────────────────────────────
function handleKeyDown(e: KeyboardEvent): void {
  if (isProcessing) {
    e.preventDefault();
    return;
  }

  switch (e.key) {
    case 'Enter':
      e.preventDefault();
      submitCommand();
      break;

    case 'Tab':
      e.preventDefault();
      handleTabCompletion();
      break;

    case 'ArrowUp':
      e.preventDefault();
      navigateHistory(-1);
      break;

    case 'ArrowDown':
      e.preventDefault();
      navigateHistory(1);
      break;

    case 'l':
      if (e.ctrlKey) {
        e.preventDefault();
        clearTerminal();
      }
      break;

    case 'c':
      if (e.ctrlKey) {
        e.preventDefault();
        // Print current line with ^C and reset
        printLine(terminalOutput, `${PROMPT_HTML}${escapeHtml(inputField.value)}<span class="text-red">^C</span>`);
        inputField.value = '';
        historyIndex = -1;
        scrollToBottom();
      }
      break;
  }
}

// ─── Submit Command ─────────────────────────────────────────
async function submitCommand(): Promise<void> {
  const input = inputField.value;
  inputField.value = '';
  historyIndex = -1;

  // Echo the command to output
  printLine(terminalOutput, `${PROMPT_HTML}${escapeHtml(input)}`);

  // Add to history (skip empty and duplicates)
  const trimmed = input.trim();
  if (trimmed && (commandHistory.length === 0 || commandHistory[0] !== trimmed)) {
    commandHistory.unshift(trimmed);
    if (commandHistory.length > 100) commandHistory.pop();
  }

  // Process command
  const result = await getCommandResult(input);

  if (result === 'clear') {
    clearTerminal();
    return;
  }

  if (result === 'matrix') {
    printLine(terminalOutput, '<span class="text-green-bright glow">Initiating Matrix rain sequence...</span>');
    printLine(terminalOutput, '<span class="text-green-dim">Press <span class="text-green-bright">Esc</span>, <span class="text-green-bright">Q</span>, or <span class="text-green-bright">Enter</span> to exit.</span>');
    await delay(800);
    matrixRain.start();
    return;
  }

  if (result === null) return;

  // Output with optional typing animation
  isProcessing = true;

  if (result.typed) {
    await typeLines(terminalOutput, result.lines, { speed: 8, lineDelay: 40 });
  } else {
    printLines(terminalOutput, result.lines);
  }

  scrollToBottom();
  isProcessing = false;
  inputField.focus();
}

// ─── Tab Completion ─────────────────────────────────────────
function handleTabCompletion(): void {
  const input = inputField.value.trimStart();
  const parts = input.split(/\s+/);

  if (parts.length <= 1) {
    // Complete command names
    const partial = parts[0].toLowerCase();
    const matches = AVAILABLE_COMMANDS.filter((cmd) => cmd.startsWith(partial));

    if (matches.length === 1) {
      inputField.value = matches[0] + ' ';
    } else if (matches.length > 1) {
      // Show all matches
      printLine(terminalOutput, `${PROMPT_HTML}${escapeHtml(input)}`);
      const matchHtml = matches
        .map((m) => `<span class="text-green-bright">${m}</span>`)
        .join('    ');
      printLine(terminalOutput, `<div class="tab-popup">${matchHtml}</div>`);
      scrollToBottom();

      // Fill common prefix
      const common = findCommonPrefix(matches);
      if (common.length > partial.length) {
        inputField.value = common;
      }
    }
  } else if (parts[0].toLowerCase() === 'cat' && parts.length === 2) {
    // Complete filenames for cat command
    const partial = parts[1].toLowerCase();
    const files = Object.keys(virtualFiles);
    const matches = files.filter((f) => f.startsWith(partial));

    if (matches.length === 1) {
      inputField.value = `cat ${matches[0]}`;
    } else if (matches.length > 1) {
      printLine(terminalOutput, `${PROMPT_HTML}${escapeHtml(input)}`);
      const matchHtml = matches
        .map((m) => `<span class="text-green-bright">${m}</span>`)
        .join('    ');
      printLine(terminalOutput, `<div class="tab-popup">${matchHtml}</div>`);
      scrollToBottom();

      const common = findCommonPrefix(matches);
      if (common.length > partial.length) {
        inputField.value = `cat ${common}`;
      }
    }
  }
}

function findCommonPrefix(strings: string[]): string {
  if (strings.length === 0) return '';
  let prefix = strings[0];
  for (let i = 1; i < strings.length; i++) {
    while (!strings[i].startsWith(prefix)) {
      prefix = prefix.slice(0, -1);
    }
  }
  return prefix;
}

// ─── Command History Navigation ─────────────────────────────
function navigateHistory(direction: number): void {
  if (commandHistory.length === 0) return;

  historyIndex += direction;

  if (historyIndex < 0) {
    historyIndex = -1;
    inputField.value = '';
    return;
  }

  if (historyIndex >= commandHistory.length) {
    historyIndex = commandHistory.length - 1;
  }

  inputField.value = commandHistory[historyIndex];

  // Move cursor to end
  setTimeout(() => {
    inputField.setSelectionRange(inputField.value.length, inputField.value.length);
  }, 0);
}

// ─── Clear Terminal ─────────────────────────────────────────
function clearTerminal(): void {
  terminalOutput.innerHTML = '';
}

// ─── Utilities ──────────────────────────────────────────────
function scrollToBottom(): void {
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─── Launch ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
