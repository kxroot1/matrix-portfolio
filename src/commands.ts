// ═══════════════════════════════════════════════════════════
//  COMMAND DEFINITIONS & FILE SYSTEM
// ═══════════════════════════════════════════════════════════

export interface CommandResult {
  lines: string[];
  typed?: boolean;  // true = use typing animation
}

// ─── GitHub Config ──────────────────────────────────────────
const GITHUB_USERNAME = 'Khalil307-ak';
const GITHUB_API = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=15`;

// ─── Virtual File System ────────────────────────────────────
export const virtualFiles: Record<string, string[]> = {
  'bio.txt': [
    '<span class="text-cyan glow-cyan">╔══════════════════════════════════════╗</span>',
    '<span class="text-cyan glow-cyan">║        BIOGRAPHICAL DATA FILE        ║</span>',
    '<span class="text-cyan glow-cyan">╚══════════════════════════════════════╝</span>',
    '',
    '<span class="text-green-bright glow">Name:</span>       Khalil',
    '<span class="text-green-bright glow">Alias:</span>      khalildev',
    '<span class="text-green-bright glow">Role:</span>       Student & Full-Stack Explorer',
    '<span class="text-green-bright glow">Location:</span>   Morocco 🇲🇦',
    '',
    '<span class="text-comment">// A curious student passionate about building things that work.</span>',
    '<span class="text-comment">// Focused on Python, Flask, and Hardware — always learning,</span>',
    '<span class="text-comment">// always experimenting, always breaking stuff to understand it.</span>',
  ],

  'cv.pdf': [
    '<span class="text-amber glow-amber">⚠  cv.pdf is a binary file.</span>',
    '<span class="text-green-dim">   In a real deployment, this would trigger a download.</span>',
    '<span class="text-green-dim">   For now, run <span class="text-green-bright">cat resume.txt</span> for a readable version.</span>',
  ],

  'resume.txt': [
    '<span class="text-cyan glow-cyan">┌────────────────────────────────────────┐</span>',
    '<span class="text-cyan glow-cyan">│            CURRICULUM VITAE            │</span>',
    '<span class="text-cyan glow-cyan">└────────────────────────────────────────┘</span>',
    '',
    '<span class="section-header">▸ CURRENT STATUS</span>',
    '',
    '  <span class="text-green-bright">Student</span> <span class="text-comment">// Full-Stack Explorer</span>',
    '  <span class="text-green-dim">• Learning and building full-stack web applications</span>',
    '  <span class="text-green-dim">• Focused on Python, Flask, and backend development</span>',
    '  <span class="text-green-dim">• Exploring hardware projects and IoT</span>',
    '',
    '<span class="section-header">▸ CORE SKILLS</span>',
    '',
    '  <span class="text-amber">▹</span> <span class="text-green-bright">Python</span> <span class="text-green-dim">— Flask, scripting, automation</span>',
    '  <span class="text-amber">▹</span> <span class="text-green-bright">Web Dev</span> <span class="text-green-dim">— HTML/CSS/JS, React, Vite</span>',
    '  <span class="text-amber">▹</span> <span class="text-green-bright">Hardware</span> <span class="text-green-dim">— Arduino, Raspberry Pi, IoT</span>',
    '  <span class="text-amber">▹</span> <span class="text-green-bright">Tools</span> <span class="text-green-dim">— Git, Linux, VS Code, Docker</span>',
    '',
    '<span class="section-header">▸ EDUCATION</span>',
    '',
    '  <span class="text-green-bright">Student</span> <span class="text-comment">// Morocco</span>',
    '  <span class="text-green-dim">• Computer Science & Software Development</span>',
    '  <span class="text-green-dim">• Self-taught in web development & hardware hacking</span>',
    '',
    '<span class="section-header">▸ INTERESTS</span>',
    '',
    '  <span class="text-amber">✦</span> Open-source contributions',
    '  <span class="text-amber">✦</span> Building creative tools & side projects',
    '  <span class="text-amber">✦</span> Hardware tinkering & embedded systems',
  ],

  'secret.txt': [
    '<span class="text-red">╔══════════════════════════════════════╗</span>',
    '<span class="text-red">║     ⚠  CLASSIFIED — EYES ONLY  ⚠     ║</span>',
    '<span class="text-red">╚══════════════════════════════════════╝</span>',
    '',
    '<span class="text-green-dim">  "The Matrix has you..."</span>',
    '',
    '<span class="text-green-dim">  Follow the white rabbit. 🐇</span>',
    '<span class="text-green-dim">  Try typing: <span class="text-green-bright glow">matrix</span></span>',
  ],

  'readme.md': [
    '<span class="text-cyan glow-cyan">## README.md</span>',
    '',
    '<span class="text-green-dim">Welcome to my terminal portfolio.</span>',
    '<span class="text-green-dim">Type <span class="text-green-bright">help</span> to see available commands.</span>',
    '',
    '<span class="text-green-dim">This portfolio was built with:</span>',
    '  <span class="text-amber">•</span> TypeScript + Vite',
    '  <span class="text-amber">•</span> Tailwind CSS v4',
    '  <span class="text-amber">•</span> Canvas API (Matrix Rain)',
    '  <span class="text-amber">•</span> Custom terminal emulator',
    '',
    '<span class="text-comment">// "Wake up, Neo..."</span>',
  ],
};

// ─── Command Handlers ───────────────────────────────────────

export async function getCommandResult(input: string): Promise<CommandResult | 'clear' | 'matrix' | null> {
  const trimmed = input.trim();
  const [cmd, ...args] = trimmed.split(/\s+/);
  const command = cmd.toLowerCase();

  switch (command) {
    case '':
      return { lines: [] };

    case 'help':
      return helpCommand();

    case 'about':
      return aboutCommand();

    case 'projects':
      return await projectsCommand();

    case 'skills':
      return skillsCommand();

    case 'contact':
      return contactCommand();

    case 'ls':
      return lsCommand();

    case 'cat':
      return catCommand(args);

    case 'clear':
      return 'clear';

    case 'matrix':
      return 'matrix';

    case 'whoami':
      return { lines: ['<span class="text-green-bright glow">khalildev</span>'] };

    case 'date':
      return { lines: [`<span class="text-green-dim">${new Date().toString()}</span>`] };

    case 'pwd':
      return { lines: ['<span class="text-green-dim">/home/khalil/portfolio</span>'] };

    case 'uname':
      return { lines: ['<span class="text-green-dim">MatrixOS 4.2.0 x86_64 GNU/Linux</span>'] };

    case 'echo':
      return { lines: [`<span class="text-green-dim">${args.join(' ')}</span>`] };

    case 'sudo':
      return {
        lines: [
          '<span class="text-red">⚠  Permission denied.</span>',
          '<span class="text-green-dim">Nice try. This incident will be reported. 😏</span>',
        ],
      };

    case 'exit':
      return {
        lines: [
          '<span class="text-amber glow-amber">Logout request received...</span>',
          '<span class="text-green-dim">There is no exit from the Matrix.</span>',
        ],
      };

    case 'history':
      return { lines: ['<span class="text-green-dim">Use ↑/↓ arrow keys to navigate command history.</span>'] };

    default:
      return {
        lines: [
          `<span class="text-red">bash: ${escapeHtml(command)}: command not found</span>`,
          '<span class="text-green-dim">Type <span class="text-green-bright">help</span> to see available commands.</span>',
        ],
      };
  }
}

// ─── Available Commands (for tab completion) ────────────────
export const AVAILABLE_COMMANDS = [
  'help', 'about', 'projects', 'skills', 'contact',
  'ls', 'cat', 'clear', 'matrix', 'whoami', 'date',
  'pwd', 'uname', 'echo', 'sudo', 'exit', 'history',
];

// ─── Individual Command Outputs ─────────────────────────────

function helpCommand(): CommandResult {
  return {
    lines: [
      '',
      '<span class="text-cyan glow-cyan">╔════════════════════════════════════════════════════╗</span>',
      '<span class="text-cyan glow-cyan">║              AVAILABLE COMMANDS                    ║</span>',
      '<span class="text-cyan glow-cyan">╠════════════════════════════════════════════════════╣</span>',
      '<span class="text-cyan glow-cyan">║</span>  <span class="text-green-bright glow">help</span>       <span class="text-green-dim">— Show this help menu</span>             <span class="text-cyan glow-cyan">║</span>',
      '<span class="text-cyan glow-cyan">║</span>  <span class="text-green-bright glow">about</span>      <span class="text-green-dim">— Who am I?</span>                       <span class="text-cyan glow-cyan">║</span>',
      '<span class="text-cyan glow-cyan">║</span>  <span class="text-green-bright glow">projects</span>   <span class="text-green-dim">— Live repos from GitHub</span>           <span class="text-cyan glow-cyan">║</span>',
      '<span class="text-cyan glow-cyan">║</span>  <span class="text-green-bright glow">skills</span>     <span class="text-green-dim">— Technical skill matrix</span>           <span class="text-cyan glow-cyan">║</span>',
      '<span class="text-cyan glow-cyan">║</span>  <span class="text-green-bright glow">contact</span>    <span class="text-green-dim">— Reach out to me</span>                <span class="text-cyan glow-cyan">║</span>',
      '<span class="text-cyan glow-cyan">║</span>  <span class="text-green-bright glow">ls</span>         <span class="text-green-dim">— List virtual files</span>              <span class="text-cyan glow-cyan">║</span>',
      '<span class="text-cyan glow-cyan">║</span>  <span class="text-green-bright glow">cat</span> [file]  <span class="text-green-dim">— Read a file</span>                    <span class="text-cyan glow-cyan">║</span>',
      '<span class="text-cyan glow-cyan">║</span>  <span class="text-green-bright glow">clear</span>      <span class="text-green-dim">— Clear the terminal</span>              <span class="text-cyan glow-cyan">║</span>',
      '<span class="text-cyan glow-cyan">║</span>  <span class="text-green-bright glow">matrix</span>     <span class="text-green-dim">— Enter the Matrix 🐇</span>             <span class="text-cyan glow-cyan">║</span>',
      '<span class="text-cyan glow-cyan">║</span>  <span class="text-green-bright glow">whoami</span>     <span class="text-green-dim">— Display current user</span>            <span class="text-cyan glow-cyan">║</span>',
      '<span class="text-cyan glow-cyan">║</span>  <span class="text-green-bright glow">history</span>    <span class="text-green-dim">— View command history</span>            <span class="text-cyan glow-cyan">║</span>',
      '<span class="text-cyan glow-cyan">╚════════════════════════════════════════════════════╝</span>',
      '',
      '<span class="text-comment">  Tip: Use ↑/↓ for history, Tab for auto-complete</span>',
      '',
    ],
  };
}

function aboutCommand(): CommandResult {
  return {
    typed: true,
    lines: [
      '',
      '<span class="ascii-art">  ██╗  ██╗██╗  ██╗ █████╗ ██╗     ██╗██╗     </span>',
      '<span class="ascii-art">  ██║ ██╔╝██║  ██║██╔══██╗██║     ██║██║     </span>',
      '<span class="ascii-art">  █████╔╝ ███████║███████║██║     ██║██║     </span>',
      '<span class="ascii-art">  ██╔═██╗ ██╔══██║██╔══██║██║     ██║██║     </span>',
      '<span class="ascii-art">  ██║  ██╗██║  ██║██║  ██║███████╗██║███████╗</span>',
      '<span class="ascii-art">  ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝╚══════╝</span>',
      '',
      '<span class="section-header">▸ ABOUT ME</span>',
      '',
      '  <span class="text-green-dim">I\'m <span class="text-green-bright glow">Khalil</span>, a student and full-stack explorer</span>',
      '  <span class="text-green-dim">based in <span class="text-amber">Morocco</span> 🇲🇦.</span>',
      '',
      '  <span class="text-green-dim">I build things with <span class="text-green-bright">Python</span>, <span class="text-green-bright">Flask</span>, and love tinkering</span>',
      '  <span class="text-green-dim">with <span class="text-green-bright">hardware</span> — from Arduinos to Raspberry Pis.</span>',
      '',
      '  <span class="text-green-dim">I\'m driven by curiosity. I break things to learn how they</span>',
      '  <span class="text-green-dim">work, and then I build something better.</span>',
      '',
      '  <span class="text-green-dim">Currently exploring full-stack web development, IoT,</span>',
      '  <span class="text-green-dim">and creative coding projects.</span>',
      '',
      '  <span class="text-comment">// "Stay hungry, stay foolish."</span>',
      '',
    ],
  };
}

// ─── Live GitHub Projects ───────────────────────────────────
interface GitHubRepo {
  name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  html_url: string;
  fork: boolean;
}

async function projectsCommand(): Promise<CommandResult> {
  const lines: string[] = [
    '',
    '<span class="section-header">▸ PROJECTS</span>  <span class="text-comment">// fetched live from GitHub</span>',
    '',
    '<span class="text-green-dim">  ⏳ Connecting to GitHub API...</span>',
  ];

  try {
    const response = await fetch(GITHUB_API);

    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}`);
    }

    const repos: GitHubRepo[] = await response.json();
    const filtered = repos.filter((r) => !r.fork); // skip forks

    // Remove the "Connecting..." line by replacing the array
    lines.pop();
    lines.push(`<span class="text-green-dim">  ✓ Connected — ${filtered.length} repositories found.</span>`);
    lines.push('');

    if (filtered.length === 0) {
      lines.push('<span class="text-amber">  No repositories found.</span>');
    } else {
      for (const repo of filtered) {
        const name = escapeHtml(repo.name);
        const desc = repo.description
          ? escapeHtml(repo.description)
          : '<span class="text-comment">No description</span>';
        const lang = repo.language
          ? `<span class="text-amber">${escapeHtml(repo.language)}</span>`
          : '<span class="text-comment">—</span>';
        const stars = repo.stargazers_count;
        const url = repo.html_url;

        lines.push(`  <span class="text-cyan glow-cyan">┌─</span> <span class="text-green-bright glow">${name}</span>`);
        lines.push(`  <span class="text-cyan glow-cyan">│</span>  ${desc}`);
        lines.push(`  <span class="text-cyan glow-cyan">│</span>  ⭐ ${stars}  ·  ${lang}  ·  <a class="terminal-link" href="${url}" target="_blank">${url}</a>`);
        lines.push(`  <span class="text-cyan glow-cyan">└──────────────────────────────────</span>`);
        lines.push('');
      }
    }

    lines.push(`<span class="text-comment">  // Source: github.com/${GITHUB_USERNAME}</span>`);
    lines.push('');

  } catch (error) {
    lines.pop(); // Remove "Connecting..." line on error
    lines.push('<span class="text-red">  ✗ ERROR: Failed to fetch repositories.</span>');
    lines.push(`<span class="text-red">    ${error instanceof Error ? escapeHtml(error.message) : 'Unknown error'}</span>`);
    lines.push('');
    lines.push('<span class="text-green-dim">  Check your connection or visit:</span>');
    lines.push(`  <a class="terminal-link" href="https://github.com/${GITHUB_USERNAME}" target="_blank">https://github.com/${GITHUB_USERNAME}</a>`);
    lines.push('');
  }

  return { lines };
}

function skillsCommand(): CommandResult {
  const bar = (pct: number) =>
    `<div class="skill-bar"><div class="skill-bar-track"><div class="skill-bar-fill" style="width:${pct}%"></div></div><span class="text-green-dim">${pct}%</span></div>`;

  return {
    lines: [
      '',
      '<span class="section-header">▸ SKILL MATRIX</span>',
      '',
      '<span class="text-cyan glow-cyan">  ┌─ Backend & Scripting ──────────────────┐</span>',
      `  <span class="text-green-bright">  Python</span>                ${bar(90)}`,
      `  <span class="text-green-bright">  Flask</span>                 ${bar(82)}`,
      `  <span class="text-green-bright">  SQL / Databases</span>      ${bar(70)}`,
      `  <span class="text-green-bright">  REST APIs</span>            ${bar(75)}`,
      '<span class="text-cyan glow-cyan">  └───────────────────────────────────────┘</span>',
      '',
      '<span class="text-cyan glow-cyan">  ┌─ Frontend & Web ────────────────────────┐</span>',
      `  <span class="text-green-bright">  HTML / CSS</span>           ${bar(85)}`,
      `  <span class="text-green-bright">  JavaScript / TS</span>      ${bar(78)}`,
      `  <span class="text-green-bright">  React</span>                ${bar(70)}`,
      `  <span class="text-green-bright">  Tailwind CSS</span>         ${bar(75)}`,
      '<span class="text-cyan glow-cyan">  └───────────────────────────────────────┘</span>',
      '',
      '<span class="text-cyan glow-cyan">  ┌─ Hardware & Tools ────────────────────┐</span>',
      `  <span class="text-green-bright">  Arduino / ESP</span>        ${bar(80)}`,
      `  <span class="text-green-bright">  Raspberry Pi</span>         ${bar(72)}`,
      `  <span class="text-green-bright">  Git / GitHub</span>         ${bar(85)}`,
      `  <span class="text-green-bright">  Linux</span>                ${bar(78)}`,
      '<span class="text-cyan glow-cyan">  └───────────────────────────────────────┘</span>',
      '',
    ],
  };
}

function contactCommand(): CommandResult {
  return {
    lines: [
      '',
      '<span class="section-header">▸ CONTACT / CONNECT</span>',
      '',
      '<span class="text-cyan glow-cyan">  ╔════════════════════════════════════════════════════════════════════╗</span>',
      '<span class="text-cyan glow-cyan">  ║  COMMUNICATION CHANNELS                                         ║</span>',
      '<span class="text-cyan glow-cyan">  ╠════════════════════════════════════════════════════════════════════╣</span>',
      '<span class="text-cyan glow-cyan">  ║</span>                                                                    <span class="text-cyan glow-cyan">║</span>',
      '<span class="text-cyan glow-cyan">  ║</span>  <span class="text-amber">📧 Email:</span>    <a class="terminal-link" href="mailto:khalil.akram307@gmail.com">khalil.akram307@gmail.com</a>                      <span class="text-cyan glow-cyan">║</span>',
      '<span class="text-cyan glow-cyan">  ║</span>  <span class="text-amber">🔗 GitHub:</span>   <a class="terminal-link" href="https://github.com/Khalil307-ak" target="_blank">github.com/Khalil307-ak</a>                        <span class="text-cyan glow-cyan">║</span>',
      '<span class="text-cyan glow-cyan">  ║</span>  <span class="text-amber">💼 LinkedIn:</span> <a class="terminal-link" href="https://www.linkedin.com/in/khalil-agourram-6786892b2/" target="_blank">linkedin.com/in/khalil-agourram</a>                <span class="text-cyan glow-cyan">║</span>',
      '<span class="text-cyan glow-cyan">  ║</span>  <span class="text-amber">🐦 X:</span>        <a class="terminal-link" href="https://x.com/kx_root" target="_blank">@kx_root</a>                                       <span class="text-cyan glow-cyan">║</span>',
      '<span class="text-cyan glow-cyan">  ║</span>                                                                    <span class="text-cyan glow-cyan">║</span>',
      '<span class="text-cyan glow-cyan">  ╚════════════════════════════════════════════════════════════════════╝</span>',
      '',
      '<span class="text-comment">  // Feel free to reach out — always happy to connect. 🤝</span>',
      '',
    ],
  };
}

function lsCommand(): CommandResult {
  const files = Object.keys(virtualFiles);
  const formatted = files.map((f) => {
    const icon = f.endsWith('.txt')
      ? '📄'
      : f.endsWith('.pdf')
      ? '📎'
      : f.endsWith('.md')
      ? '📝'
      : '📁';
    const color = f === 'secret.txt' ? 'text-red' : 'text-green-bright';
    return `  ${icon} <span class="${color}">${f}</span>`;
  });

  return {
    lines: [
      '',
      '<span class="text-comment">  drwxr-xr-x  khalil  ~/portfolio</span>',
      '',
      ...formatted,
      '',
      `<span class="text-green-dim">  ${files.length} files found.</span>`,
      '<span class="text-comment">  Use <span class="text-green-bright">cat [filename]</span> to read a file.</span>',
      '',
    ],
  };
}

function catCommand(args: string[]): CommandResult {
  if (args.length === 0) {
    return {
      lines: [
        '<span class="text-red">Usage: cat [filename]</span>',
        '<span class="text-green-dim">Run <span class="text-green-bright">ls</span> to see available files.</span>',
      ],
    };
  }

  const filename = args[0].toLowerCase();
  const content = virtualFiles[filename];

  if (!content) {
    return {
      lines: [
        `<span class="text-red">cat: ${escapeHtml(filename)}: No such file or directory</span>`,
        '<span class="text-green-dim">Run <span class="text-green-bright">ls</span> to see available files.</span>',
      ],
    };
  }

  return { lines: ['', ...content, ''] };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
