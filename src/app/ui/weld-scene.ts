import { Component, ElementRef, NgZone, afterNextRender, inject, viewChild } from '@angular/core';

interface Spark {
  x: number; y: number; px: number; py: number;
  vx: number; vy: number; life: number; max: number; w: number;
}
interface Bead { x: number; t: number }

/**
 * Живая сцена сварки на canvas: горелка бежит по трубе, оставляя раскалённый шов,
 * летят искры с физикой (гравитация, отскок). Горелка следует за курсором мыши.
 * Выключается при prefers-reduced-motion, вне экрана и на скрытой вкладке.
 */
@Component({
  selector: 'app-weld-scene',
  template: `<canvas #cv aria-hidden="true"></canvas>`,
  styles: `
    :host { position: absolute; inset: 0; pointer-events: none; display: block; }
    canvas { width: 100%; height: 100%; display: block; }
  `,
})
export class WeldScene {
  private readonly cv = viewChild.required<ElementRef<HTMLCanvasElement>>('cv');
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);

  constructor() {
    afterNextRender(() => this.zone.runOutsideAngular(() => this.start()));
  }

  private start(): void {
    const canvas = this.cv().nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let glowRgb = '255 150 60';
    const readTheme = () => {
      glowRgb = getComputedStyle(this.host.nativeElement).getPropertyValue('--scene-glow-rgb').trim() || glowRgb;
    };
    readTheme();
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

    let W = 0, H = 0, dpr = 1;
    const resize = () => {
      const r = this.host.nativeElement.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(this.host.nativeElement);

    const sparks: Spark[] = [];
    const beads: Bead[] = [];
    let t = 0;
    let torchX = W * 0.1;
    let dir = 1;
    let mouseX: number | null = null;
    let mouseAt = 0;

    const pipeTop = () => H - Math.min(120, H * 0.18) - 40;
    const pipeH = () => Math.min(120, H * 0.18);

    const emit = (x: number, y: number, n: number, power = 1) => {
      for (let i = 0; i < n && sparks.length < 520; i++) {
        const a = -Math.PI * (0.05 + Math.random() * 0.9);
        const s = (1.5 + Math.random() * 6.5) * power;
        sparks.push({ x, y, px: x, py: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0, max: 40 + Math.random() * 60, w: 0.6 + Math.random() * 1.4 });
      }
    };

    const onMove = (e: PointerEvent) => {
      const r = this.host.nativeElement.getBoundingClientRect();
      if (e.clientY < r.top || e.clientY > r.bottom) { mouseX = null; return; }
      mouseX = e.clientX - r.left;
      mouseAt = performance.now();
      if (Math.random() < 0.35) emit(mouseX, e.clientY - r.top, 1, 0.6);
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    const drawPipe = (top: number, h: number) => {
      const g = ctx.createLinearGradient(0, top, 0, top + h);
      g.addColorStop(0, '#2a323c');
      g.addColorStop(0.18, '#6b7886');
      g.addColorStop(0.32, '#aab6c3');
      g.addColorStop(0.5, '#59656f');
      g.addColorStop(0.8, '#1d242c');
      g.addColorStop(1, '#0e1216');
      ctx.fillStyle = g;
      ctx.fillRect(-10, top, W + 20, h);
      // стык труб (кольцевой шов) — вертикальные линии
      ctx.fillStyle = 'rgb(0 0 0 / .35)';
      for (const f of [0.22, 0.58, 0.9]) ctx.fillRect(W * f, top, 2, h);
    };

    const frame = () => {
      t += 1;
      if (t % 30 === 0) readTheme();
      ctx.clearRect(0, 0, W, H);
      const top = pipeTop();
      const ph = pipeH();
      drawPipe(top, ph);

      // движение горелки: автопилот «туда-обратно» или за курсором
      const following = mouseX !== null && performance.now() - mouseAt < 2500;
      if (following) {
        torchX += (mouseX! - torchX) * 0.08;
      } else {
        torchX += dir * Math.max(1.2, W / 520);
        if (torchX > W * 0.96) dir = -1;
        if (torchX < W * 0.04) dir = 1;
      }
      const seamY = top + 3;
      beads.push({ x: torchX, t });
      while (beads.length && t - beads[0].t > 260) beads.shift();

      // остывающий шов
      ctx.lineCap = 'round';
      for (let i = 1; i < beads.length; i++) {
        const a = beads[i];
        const b = beads[i - 1];
        if (Math.abs(a.x - b.x) > 40) continue;
        const age = (t - a.t) / 260;
        const r = age < 0.08 ? 255 : 255 - age * 120;
        const gch = age < 0.08 ? 240 : Math.max(40, 190 - age * 330);
        const bch = age < 0.08 ? 190 : Math.max(20, 80 - age * 160);
        ctx.strokeStyle = `rgb(${r} ${gch} ${bch} / ${Math.max(0.12, 1 - age * 0.85)})`;
        ctx.lineWidth = 5 - age * 2.2;
        ctx.beginPath();
        ctx.moveTo(b.x, seamY);
        ctx.lineTo(a.x, seamY);
        ctx.stroke();
      }

      // свечение дуги на трубе и в воздухе
      const flick = 0.82 + Math.random() * 0.36;
      ctx.globalCompositeOperation = 'lighter';
      const glow = ctx.createRadialGradient(torchX, seamY, 0, torchX, seamY, 190 * flick);
      glow.addColorStop(0, 'rgb(255 235 190 / .85)');
      glow.addColorStop(0.15, `rgb(${glowRgb} / .5)`);
      glow.addColorStop(1, `rgb(${glowRgb} / 0)`);
      ctx.fillStyle = glow;
      ctx.fillRect(torchX - 200, seamY - 200, 400, 400);

      // искры
      emit(torchX, seamY - 4, 5 + Math.floor(Math.random() * 5));
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.px = s.x; s.py = s.y;
        s.vy += 0.2;
        s.vx *= 0.992;
        s.x += s.vx; s.y += s.vy; s.life++;
        if (s.y > seamY && s.vy > 0 && s.x > 0 && s.x < W && s.y < top + ph) {
          s.y = seamY; s.vy *= -0.38; s.vx *= 0.8;
        }
        if (s.life > s.max || s.y > H + 20 || s.x < -20 || s.x > W + 20) { sparks.splice(i, 1); continue; }
        const k = 1 - s.life / s.max;
        ctx.strokeStyle = `rgb(255 ${Math.round(150 + 90 * k)} ${Math.round(60 + 120 * k * k)} / ${k})`;
        ctx.lineWidth = s.w * (0.5 + k);
        ctx.beginPath();
        ctx.moveTo(s.px, s.py);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
      }
      ctx.globalCompositeOperation = 'source-over';

      // горелка
      ctx.fillStyle = '#1b2128';
      ctx.strokeStyle = '#5b6773';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(torchX - 20, seamY - 120);
      ctx.lineTo(torchX + 12, seamY - 126);
      ctx.lineTo(torchX + 7, seamY - 26);
      ctx.lineTo(torchX - 3, seamY - 20);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = '#d7dee6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(torchX, seamY - 20);
      ctx.lineTo(torchX, seamY - 3);
      ctx.stroke();
      // яркое ядро дуги
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = `rgb(255 255 240 / ${0.7 + Math.random() * 0.3})`;
      ctx.beginPath();
      ctx.arc(torchX, seamY - 3, 4 + Math.random() * 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    };

    if (reduced) {
      // один статичный кадр
      torchX = W * 0.45;
      for (let i = 0; i < 60; i++) frame();
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      return;
    }

    let raf = 0;
    let visible = true;
    const loop = () => {
      if (visible && !document.hidden) frame();
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(this.host.nativeElement);
    raf = requestAnimationFrame(loop);

    // очистка при уничтожении компонента
    const mo = new MutationObserver(() => {
      if (!document.contains(canvas)) {
        cancelAnimationFrame(raf);
        io.disconnect(); ro.disconnect(); mo.disconnect();
        window.removeEventListener('pointermove', onMove);
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }
}
