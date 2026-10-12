"use client";

import { useEffect, useRef } from "react";
import ThemeToggle from "./theme-toggle";
import PortfolioMotion, { usePortfolioMotion } from "./portfolio-motion";
import styles from "./lost-signal.module.css";

// Original vector lettering, layered to form the depth of the three digits.
const digits = "M30 205 151 20H211L94 202H203V126H254V202H284V251H254V326H203V251H30ZM455 16C372 16 331 74 331 173S372 330 455 330 579 272 579 173 538 16 455 16ZM455 65C501 65 524 102 524 173S501 281 455 281 386 244 386 173 409 65 455 65ZM620 205 741 20H801L684 202H793V126H844V202H874V251H844V326H793V251H620Z";

function ErrorScene({ homeHref }: { homeHref: string }) {
  const fieldRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const holding = useRef(false);
  const { motion, toggleMotion } = usePortfolioMotion();

  useEffect(() => {
    const field = fieldRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!field || !canvas || !context) return;
    let width = 1;
    let height = 1;
    let frame = 0;
    let lastTime = 0;
    let energy = 0;
    let pointerX = 0.5;
    let pointerY = 0.4;

    const draw = (time: number) => {
      if (time - lastTime < 32 && motion) {
        frame = requestAnimationFrame(draw);
        return;
      }
      lastTime = time;
      energy += ((holding.current && motion ? 1 : 0) - energy) * 0.075;
      const light = document.documentElement.dataset.theme === "light";
      const colour = light ? "101, 70, 143" : "196, 181, 253";
      const centerX = width * (0.5 + (pointerX - 0.5) * 0.04);
      const centerY = height * 0.40;
      const drift = motion ? Math.sin(time * 0.00025) * height * 0.02 : 0;
      context.clearRect(0, 0, width, height);

      for (let line = 0; line < 5; line++) {
        const spread = (line - 2) * height * 0.43;
        const startY = centerY + spread + drift;
        const endY = centerY + spread * 0.85 - drift;
        context.beginPath();
        context.moveTo(-width * 0.05, startY);
        context.bezierCurveTo(width * 0.3, centerY - spread * 0.2, width * 0.7, centerY - spread * 0.2, width * 1.05, endY);
        context.strokeStyle = `rgba(${colour}, ${0.13 + energy * 0.16})`;
        context.lineWidth = 0.8;
        context.stroke();
      }

      if (motion) {
        // Small moving signals follow the field; a held press releases a pulse.
        for (let spark = 0; spark < 6; spark++) {
          const progress = (time * 0.000045 + spark / 6) % 1;
          const x = width * progress;
          const y = centerY + Math.sin(progress * Math.PI) * (spark % 2 ? -1 : 1) * height * 0.13;
          context.beginPath();
          context.arc(x, y, 1.2, 0, Math.PI * 2);
          context.fillStyle = `rgba(${colour}, ${0.35 + energy * 0.4})`;
          context.fill();
        }
        if (energy > 0.02) {
          const originX = width * pointerX;
          const originY = height * pointerY;
          context.lineWidth = 1.15;
          context.shadowBlur = 14;
          context.shadowColor = `rgba(${colour}, 0.7)`;
          for (let bolt = 0; bolt < 7; bolt++) {
            const angle = (bolt / 7) * Math.PI * 2 + time * 0.00007;
            const length = Math.max(width, height) * 0.7 * energy;
            context.beginPath();
            context.moveTo(originX, originY);
            for (let point = 1; point <= 18; point++) {
              const distance = (point / 18) * length;
              const jitter = Math.sin(point * 18.3 + bolt * 7 + time * 0.013) * 13 * energy;
              context.lineTo(originX + Math.cos(angle) * distance + Math.sin(angle) * jitter, originY + Math.sin(angle) * distance - Math.cos(angle) * jitter);
            }
            context.strokeStyle = `rgba(${colour}, ${energy * 0.5})`;
            context.stroke();
          }
          context.shadowBlur = 0;
        }
      }
      field.style.setProperty("--charge", energy.toFixed(3));
      if (motion && !document.hidden) frame = requestAnimationFrame(draw);
    };
    const resize = () => {
      const bounds = field.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      if (!motion) draw(0);
    };
    const move = (event: PointerEvent) => {
      const bounds = field.getBoundingClientRect();
      pointerX = Math.min(1, Math.max(0, (event.clientX - bounds.left) / width));
      pointerY = Math.min(1, Math.max(0, (event.clientY - bounds.top) / height));
      if (motion) {
        field.style.setProperty("--tilt-x", `${(0.5 - pointerY) * 12}deg`);
        field.style.setProperty("--tilt-y", `${(pointerX - 0.5) * 16}deg`);
      }
    };
    const press = (event: PointerEvent) => {
      if (event.button !== 0 || (event.target instanceof Element && event.target.closest("a, button"))) return;
      move(event);
      holding.current = true;
    };
    const release = () => { holding.current = false; };
    const reset = () => {
      release();
      field.style.setProperty("--tilt-x", "0deg");
      field.style.setProperty("--tilt-y", "0deg");
    };
    const visibility = () => {
      cancelAnimationFrame(frame);
      release();
      if (!document.hidden) frame = requestAnimationFrame(draw);
    };
    const observer = new ResizeObserver(resize);
    const themeObserver = new MutationObserver(() => { if (!motion) draw(0); });
    observer.observe(field);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    resize();
    frame = requestAnimationFrame(draw);
    field.addEventListener("pointermove", move, { passive: true });
    field.addEventListener("pointerdown", press);
    field.addEventListener("pointerleave", reset);
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    window.addEventListener("blur", reset);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      themeObserver.disconnect();
      reset();
      field.removeEventListener("pointermove", move);
      field.removeEventListener("pointerdown", press);
      field.removeEventListener("pointerleave", reset);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      window.removeEventListener("blur", reset);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [motion]);

  return (
    <div className={styles.page}>
      <a className="skip-link" href="#lost-content">Skip to content</a>
      <header className={styles.header}>
        <a className="brand" href={homeHref} aria-label="Shalom Rubaramira, home">
          <span className="brand-mark">S.</span>
          <span className="brand-copy"><strong>Shalom Rubaramira</strong><small>CYBERSECURITY &amp; RISK ANALYSIS</small></span>
        </a>
        <div className={styles.headerActions}>
          <a className={styles.contact} href={`${homeHref}#contact`}>Let&apos;s talk <span aria-hidden="true">↗</span></a>
          <ThemeToggle />
        </div>
      </header>
      <main className={styles.field} ref={fieldRef} id="lost-content" tabIndex={-1}>
        <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
        <div className={styles.content}>
          <p className={styles.eyebrow}><span /> SIGNAL LOST / ERROR 404</p>
          <h1 className={styles.title}>
            <span className={styles.srOnly}>404. Page not found.</span>
            <svg className={styles.digits} viewBox="0 0 930 390" aria-hidden="true" focusable="false">
              <defs>
                <path id="lost-digits" d={digits} fillRule="evenodd" />
                <linearGradient id="lost-face" x1="0" y1="0" x2="0.75" y2="1">
                  <stop offset="0" stopColor="var(--digit-top)" /><stop offset="0.48" stopColor="var(--digit-mid)" /><stop offset="1" stopColor="var(--digit-bottom)" />
                </linearGradient>
                <linearGradient id="lost-edge" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="var(--digit-edge)" /><stop offset="0.45" stopColor="var(--digit-mid)" /><stop offset="0.75" stopColor="var(--digit-edge)" /><stop offset="1" stopColor="var(--digit-bottom)" />
                </linearGradient>
              </defs>
              <g className={styles.depth}>
                {Array.from({ length: 24 }, (_, index) => <use key={index} href="#lost-digits" transform={`translate(${30 - index * 1.25} ${30 - index * 1.25})`} />)}
              </g>
              <use href="#lost-digits" fill="url(#lost-face)" stroke="url(#lost-edge)" strokeWidth="1.5" />
            </svg>
          </h1>
          <p className={styles.message}>Looks like this connection led nowhere.<br />The page may have moved or no longer exists.</p>
          <nav className={styles.links} aria-label="Find your way back">
            <a href={homeHref}>Back to home <span aria-hidden="true">↗</span></a>
            <a href={`${homeHref}#work`}>Explore my work <span aria-hidden="true">↗</span></a>
          </nav>
        </div>
        <div className={styles.interaction}>
          <button className={styles.pulse} type="button" disabled={!motion}
            onPointerDown={() => { holding.current = true; }}
            onPointerUp={() => { holding.current = false; }}
            onPointerLeave={() => { holding.current = false; }}
            onBlur={() => { holding.current = false; }}
            onKeyDown={(event) => { if (event.key === " " || event.key === "Enter") { event.preventDefault(); holding.current = true; } }}
            onKeyUp={(event) => { if (event.key === " " || event.key === "Enter") { event.preventDefault(); holding.current = false; } }}
          ><span aria-hidden="true">ϟ</span> Hold to send a pulse</button>
          <p>{motion ? "Touch the field. Find a little spark." : "A quiet moment in the signal."}</p>
        </div>
      </main>
      <footer className={styles.footer}>
        <span>EVERY CONNECTION HAS A WAY BACK.</span>
        <button type="button" onClick={toggleMotion} aria-pressed={motion} aria-label={motion ? "Pause effects" : "Play effects"}>{motion ? "Ⅱ Pause effects" : "▷ Play effects"}</button>
      </footer>
    </div>
  );
}

export default function LostSignal({ homeHref }: { homeHref: string }) {
  return <PortfolioMotion><ErrorScene homeHref={homeHref} /></PortfolioMotion>;
}
