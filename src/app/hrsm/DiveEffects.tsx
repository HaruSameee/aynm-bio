"use client";

import { useEffect, useRef } from "react";

import styles from "./hrsm.module.css";

/** 各ゾーンの見出しがこの水深に来るように、スクロール位置を水深へ写像する */
const ZONE_DEPTHS: ReadonlyArray<readonly [id: string, depth: number]> = [
  ["about", 10],
  ["works", 200],
  ["links", 1000],
];
const BOTTOM_DEPTH = 1200;

function zoneName(depth: number) {
  if (depth < 1) return "水面";
  if (depth < 200) return "表層";
  if (depth < 1000) return "中深層";
  return "漸深層";
}

type Particle = { x: number; y: number; r: number; s: number; p: number; k: number };

/** 背景の泡・マリンスノー・発光体（canvas）と右端の水深ゲージ */
export default function DiveEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const depthRef = useRef<HTMLElement>(null);
  const zoneRef = useRef<HTMLSpanElement>(null);
  const rulerRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const depthEl = depthRef.current;
    const zoneEl = zoneRef.current;
    const ruler = rulerRef.current;
    const mark = markRef.current;
    const g = canvas?.getContext("2d");
    if (!canvas || !g || !depthEl || !zoneEl || !ruler || !mark) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const css = getComputedStyle(canvas);
    const INK = css.getPropertyValue("--ink").trim() || "#0b2a44";
    const FOAM = css.getPropertyValue("--foam").trim() || "#eef8f7";
    const LANTERN = css.getPropertyValue("--lantern").trim() || "#ffe6a3";

    let anchors: Array<[number, number]> = [[0, 0]];
    let frac = 0;
    let W = 0;
    let H = 0;

    const particles: Particle[] = Array.from({ length: 48 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * 1.6,
      s: 0.2 + Math.random() * 0.6,
      p: Math.random() * Math.PI * 2,
      k: Math.random(),
    }));

    function measure() {
      const vh = window.innerHeight;
      const max = Math.max(1, document.documentElement.scrollHeight - vh);
      const at = (id: string) => {
        const el = document.getElementById(id);
        return el ? Math.max(0, el.getBoundingClientRect().top + window.scrollY - vh * 0.42) : max;
      };
      anchors = [[0, 0], ...ZONE_DEPTHS.map(([id, d]) => [at(id), d] as [number, number]), [max, BOTTOM_DEPTH]];
      for (let i = 1; i < anchors.length; i++) {
        anchors[i][0] = Math.max(anchors[i][0], anchors[i - 1][0] + 1);
      }
    }

    function depthAt(y: number) {
      for (let i = 1; i < anchors.length; i++) {
        const [y0, d0] = anchors[i - 1];
        const [y1, d1] = anchors[i];
        if (y <= y1) return d0 + (d1 - d0) * Math.max(0, (y - y0) / (y1 - y0));
      }
      return anchors[anchors.length - 1][1];
    }

    function draw(step: number) {
      if (!g) return;
      g.clearRect(0, 0, W, H);
      const t = performance.now() / 1000;
      for (const q of particles) {
        const bubble = q.k > frac * 1.15;
        if (step) {
          q.y += ((bubble ? -q.s * 1.5 : q.s * 0.45) * step) / H;
          q.x += (Math.sin(t * 0.6 + q.p) * 0.25 * step) / W;
          if (q.y < -0.03) q.y = 1.03;
          else if (q.y > 1.03) q.y = -0.03;
        }
        const px = q.x * W;
        const py = q.y * H;
        g.beginPath();
        if (bubble) {
          g.arc(px, py, q.r * 2.1, 0, Math.PI * 2);
          g.globalAlpha = 0.5;
          g.fillStyle = FOAM;
          g.fill();
          g.globalAlpha = 0.2;
          g.strokeStyle = INK;
          g.lineWidth = 1;
          g.stroke();
        } else if (q.k < 0.14) {
          g.arc(px, py, q.r * 1.1, 0, Math.PI * 2);
          g.globalAlpha = 0.55 + 0.35 * Math.sin(t * 1.3 + q.p);
          g.fillStyle = LANTERN;
          g.shadowColor = LANTERN;
          g.shadowBlur = 10;
          g.fill();
          g.shadowBlur = 0;
        } else {
          g.arc(px, py, q.r * 0.8, 0, Math.PI * 2);
          g.globalAlpha = 0.32;
          g.fillStyle = FOAM;
          g.fill();
        }
      }
      g.globalAlpha = 1;
    }

    function update() {
      if (!depthEl || !zoneEl || !ruler || !mark) return;
      const last = anchors[anchors.length - 1][0];
      const y = Math.min(Math.max(window.scrollY, 0), last);
      const d = Math.round(depthAt(y));
      frac = last > 0 ? y / last : 0;
      depthEl.textContent = d.toLocaleString("en-US");
      zoneEl.textContent = zoneName(d);
      mark.style.transform = `translateY(${frac * ruler.clientHeight}px)`;
      if (reduce) draw(0);
    }

    function size() {
      if (!canvas || !g) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function relayout() {
      size();
      measure();
      update();
    }

    let raf = 0;
    let prev = 0;
    function loop(now: number) {
      const step = Math.min(48, now - prev) / 16.7;
      prev = now;
      draw(step * 0.9);
      raf = requestAnimationFrame(loop);
    }

    let alive = true;
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", relayout);
    document.fonts?.ready.then(() => {
      if (alive) relayout();
    });
    relayout();

    if (reduce) {
      draw(0);
    } else {
      raf = requestAnimationFrame((t) => {
        prev = t;
        loop(t);
      });
    }

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", relayout);
    };
  }, []);

  return (
    <>
      <canvas aria-hidden="true" className={styles.drift} ref={canvasRef} />
      <aside aria-hidden="true" className={styles.gauge}>
        <div className={styles.chip}>
          <span>
            水深 <b ref={depthRef}>0</b> m
          </span>
          <span ref={zoneRef}>水面</span>
        </div>
        <div className={styles.ruler} ref={rulerRef}>
          <i className={styles.mark} ref={markRef} />
        </div>
      </aside>
    </>
  );
}
