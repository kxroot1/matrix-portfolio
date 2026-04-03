// ═══════════════════════════════════════════════════════════
//  TYPING ANIMATION ENGINE
// ═══════════════════════════════════════════════════════════

export interface TypingOptions {
  speed?: number;       // ms per character
  lineDelay?: number;   // ms between lines
  humanize?: boolean;   // random variation
}

const DEFAULT_OPTIONS: TypingOptions = {
  speed: 12,
  lineDelay: 60,
  humanize: true,
};

/**
 * Types out HTML content line-by-line with a character-by-character animation.
 * Returns a promise that resolves when complete.
 */
export async function typeLines(
  container: HTMLElement,
  lines: string[],
  options: TypingOptions = {}
): Promise<void> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  for (const line of lines) {
    const lineEl = document.createElement('div');
    lineEl.className = 'terminal-line';
    container.appendChild(lineEl);

    // If the line contains HTML tags, we need to type carefully
    if (line.includes('<')) {
      await typeHTML(lineEl, line, opts);
    } else {
      await typeText(lineEl, line, opts);
    }

    scrollToBottom(container);
    await delay(opts.lineDelay!);
  }
}

/**
 * Types plain text character by character.
 */
async function typeText(
  element: HTMLElement,
  text: string,
  opts: TypingOptions
): Promise<void> {
  for (let i = 0; i < text.length; i++) {
    element.textContent += text[i];
    scrollToBottom(element.closest('.terminal-container') as HTMLElement);
    const d = opts.humanize
      ? opts.speed! + Math.random() * opts.speed! * 0.5
      : opts.speed!;
    await delay(d);
  }
}

/**
 * For lines with HTML, insert the full HTML at once (no char-by-char on tags).
 */
async function typeHTML(
  element: HTMLElement,
  html: string,
  opts: TypingOptions
): Promise<void> {
  // For complex HTML, we just fade it in
  element.innerHTML = html;
  await delay(opts.speed! * 3);
}

/**
 * Instantly prints lines (no typing animation) — for faster output.
 */
export function printLines(
  container: HTMLElement,
  lines: string[]
): void {
  for (const line of lines) {
    const lineEl = document.createElement('div');
    lineEl.className = 'terminal-line';
    lineEl.innerHTML = line || '&nbsp;';
    container.appendChild(lineEl);
  }
  scrollToBottom(container);
}

/**
 * Print a single line instantly.
 */
export function printLine(
  container: HTMLElement,
  html: string,
  className: string = ''
): HTMLElement {
  const lineEl = document.createElement('div');
  lineEl.className = `terminal-line ${className}`.trim();
  lineEl.innerHTML = html || '&nbsp;';
  container.appendChild(lineEl);
  scrollToBottom(container);
  return lineEl;
}

function scrollToBottom(container: HTMLElement | null): void {
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
