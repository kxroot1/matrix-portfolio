// ═══════════════════════════════════════════════════════════
//  MATRIX RAIN EFFECT
// ═══════════════════════════════════════════════════════════

export class MatrixRain {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private columns: number = 0;
  private drops: number[] = [];
  private animationId: number = 0;
  private active: boolean = false;
  private chars: string =
    'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*()';

  constructor() {
    this.canvas = document.getElementById('matrix-canvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  private resize(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    const fontSize = 14;
    this.columns = Math.floor(this.canvas.width / fontSize);
    this.drops = new Array(this.columns).fill(1);
  }

  start(): void {
    if (this.active) return;
    this.active = true;
    this.canvas.classList.add('active');
    this.resize();
    this.animate();

    // Listen for any key press to stop
    const stopHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'q' || e.key === 'Enter') {
        this.stop();
        window.removeEventListener('keydown', stopHandler);
      }
    };
    window.addEventListener('keydown', stopHandler);
  }

  stop(): void {
    this.active = false;
    cancelAnimationFrame(this.animationId);
    this.canvas.classList.remove('active');
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private animate = (): void => {
    if (!this.active) return;

    const fontSize = 14;

    // Translucent black to create fade trails
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

    for (let i = 0; i < this.drops.length; i++) {
      const char = this.chars[Math.floor(Math.random() * this.chars.length)];
      const x = i * fontSize;
      const y = this.drops[i] * fontSize;

      // Bright leading character
      if (Math.random() > 0.3) {
        this.ctx.fillStyle = '#39ff14';
        this.ctx.shadowColor = '#39ff14';
        this.ctx.shadowBlur = 15;
      } else {
        this.ctx.fillStyle = '#00ff41';
        this.ctx.shadowColor = '#00ff41';
        this.ctx.shadowBlur = 8;
      }

      // Occasionally a bright white character (head of stream)
      if (Math.random() > 0.96) {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.shadowColor = '#ffffff';
        this.ctx.shadowBlur = 20;
      }

      this.ctx.fillText(char, x, y);
      this.ctx.shadowBlur = 0;

      // Reset drop to top after passing the screen
      if (y > this.canvas.height && Math.random() > 0.975) {
        this.drops[i] = 0;
      }
      this.drops[i]++;
    }

    this.animationId = requestAnimationFrame(this.animate);
  };

  isActive(): boolean {
    return this.active;
  }
}
