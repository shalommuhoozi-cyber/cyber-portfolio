"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import ThemeToggle from "./theme-toggle";
import PortfolioMotion, { usePortfolioMotion } from "./portfolio-motion";
import styles from "./connection-error.module.css";

const outgoingPath = "M146 260 L245 203 L301 235";
const incomingPath = "M357 267 L425 306 L531 245";
const completePath = "M146 260 L245 203 L425 306 L531 245";

function NetworkPath({ connecting }: { connecting: boolean }) {
  return (
    <figure className={styles.network} data-connecting={connecting} aria-label={connecting ? "Illustration of the restored route to the portfolio home page" : "Illustration of a broken route between a request and the portfolio home page"}>
      <div className={styles.diagramHeader} aria-hidden="true">
        <span>PATH / {connecting ? "RESTORED" : "UNRESOLVED"}</span>
        <span className={styles.routeState}><i /> {connecting ? "CONNECTED" : "LINK INTERRUPTED"}</span>
      </div>
      <svg className={styles.diagram} viewBox="0 75 660 385" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="route-tile" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--tile-top)" /><stop offset="1" stopColor="var(--tile-bottom)" />
          </linearGradient>
          <linearGradient id="route-grid" x1="0" y1="0" x2="0.6" y2="1">
            <stop offset="0" stopColor="var(--accent)" stopOpacity="0.12" /><stop offset="0.55" stopColor="var(--accent)" stopOpacity="0.35" /><stop offset="1" stopColor="var(--accent)" stopOpacity="0.06" />
          </linearGradient>
          <radialGradient id="route-ground"><stop offset="0" stopColor="var(--accent)" stopOpacity="0.13" /><stop offset="1" stopColor="var(--accent)" stopOpacity="0" /></radialGradient>
          <filter id="route-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="3" /></filter>
        </defs>
        <ellipse cx="330" cy="320" rx="280" ry="150" fill="url(#route-ground)" />
        <g className={styles.grid} stroke="url(#route-grid)">
          {Array.from({ length: 11 }, (_, index) => {
            const part = index / 10;
            return <g key={index}>
              <line x1={30 + part * 300} y1={270 - part * 173} x2={330 + part * 300} y2={443 - part * 173} />
              <line x1={30 + part * 300} y1={270 + part * 173} x2={330 + part * 300} y2={97 + part * 173} />
            </g>;
          })}
        </g>
        <g className={styles.routeShadow} transform="translate(0 10)" fill="none"><path d={outgoingPath} /><path d={incomingPath} /></g>
        <g fill="none" strokeLinejoin="round">
          <path className={styles.outgoing} d={outgoingPath} /><path className={styles.incoming} d={incomingPath} />
          <path className={styles.bridgeHint} d="M301 235 L357 267" /><path className={styles.bridge} d="M301 235 L357 267" />
          <path className={styles.connectedRoute} d={completePath} />
        </g>
        <g className={styles.brokenEnds}>
          <circle cx="301" cy="235" r="5" /><circle cx="357" cy="267" r="5" />
          <path d="m316 232 7 12-7 5 9 14" fill="none" /><path d="m340 242-7 12 7 5-9 14" fill="none" />
        </g>
        <g className={styles.breakLabel}>
          <line x1="329" y1="285" x2="329" y2="323" /><rect x="272" y="327" width="114" height="27" rx="13.5" />
          <text x="329" y="344" textAnchor="middle">NO DESTINATION</text>
        </g>
        <circle className={styles.packetGlow} r="7" style={{ offsetPath: `path("${outgoingPath}")` }} filter="url(#route-glow)" />
        <circle className={styles.packet} r="3" style={{ offsetPath: `path("${outgoingPath}")` }} />
        <circle className={styles.returnSignal} r="4" style={{ offsetPath: `path("${completePath}")` }} />
        <g className={styles.node}>
          <ellipse className={styles.nodeShadow} cx="146" cy="277" rx="45" ry="15" />
          <path className={styles.tileSide} d="M108 238 146 260 184 238V253L146 275 108 253Z" />
          <path className={styles.tileTop} d="m108 238 38-22 38 22-38 22Z" />
          <path className={styles.nodeIcon} d="m137 233 19 4-10 5-2 8Z" />
          <line className={styles.nodeGuide} x1="146" y1="210" x2="146" y2="173" />
          <text className={styles.nodeIndex} x="146" y="151" textAnchor="middle">01 / REQUEST</text>
          <text className={styles.nodeName} x="146" y="169" textAnchor="middle">You are here</text>
        </g>
        <g className={`${styles.node} ${styles.homeNode}`}>
          <ellipse className={styles.nodeShadow} cx="531" cy="262" rx="45" ry="15" />
          <path className={styles.tileSide} d="M493 223 531 245 569 223V238L531 260 493 238Z" />
          <path className={styles.tileTop} d="m493 223 38-22 38 22-38 22Z" />
          <path className={styles.nodeIcon} d="m519 223 12-10 12 10m-20-3v12h16v-12m-10 12v-6h4v6" />
          <line className={styles.nodeGuide} x1="531" y1="195" x2="531" y2="158" />
          <text className={styles.nodeIndex} x="531" y="136" textAnchor="middle">02 / HOME</text>
          <text className={styles.nodeName} x="531" y="154" textAnchor="middle">A known route</text>
          <circle className={styles.arrivalRing} cx="531" cy="245" r="29" />
        </g>
      </svg>
      <figcaption className={styles.diagramCaption}><span>REQUEST → HOME</span><span>{connecting ? "ROUTE RECONNECTED" : "ONE CONNECTION AWAY"}</span></figcaption>
    </figure>
  );
}

function ErrorScene({ homeHref }: { homeHref: string }) {
  const [connecting, setConnecting] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { motion, toggleMotion } = usePortfolioMotion();

  useEffect(() => () => { if (timer.current !== null) clearTimeout(timer.current); }, []);

  const reconnect = (event: MouseEvent<HTMLAnchorElement>) => {
    // Preserve native links for modified clicks, reduced motion and no JS.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    if (connecting) { event.preventDefault(); return; }
    if (!motion) return;
    event.preventDefault();
    setConnecting(true);
    timer.current = setTimeout(() => { window.location.assign(homeHref); }, 1250);
  };

  return (
    <div className={styles.page}>
      <a className="skip-link" href="#lost-content">Skip to content</a>
      <header className={styles.header}>
        <a className="brand" href={homeHref} aria-label="Shalom Rubaramira, home">
          <span className="brand-mark">S.</span>
          <span className="brand-copy"><strong>Shalom Rubaramira</strong><small>CYBERSECURITY &amp; RISK ANALYSIS</small></span>
        </a>
        <div className={styles.headerActions}>
          <a className={styles.contact} href={`${homeHref}#contact`}>Let&apos;s talk <span aria-hidden="true">↗</span></a><ThemeToggle />
        </div>
      </header>
      <main className={styles.main} id="lost-content" tabIndex={-1}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}><span>404</span> PAGE NOT FOUND</p>
          <h1 className={styles.title}>Lost<br /><em>connection.</em></h1>
          <p className={styles.message}>The page you&apos;re looking for has moved or doesn&apos;t exist. Let&apos;s get you back to a known route.</p>
          <nav className={styles.links} aria-label="Find your way back" aria-busy={connecting}>
            <a className={styles.reconnect} href={homeHref} onClick={reconnect} aria-disabled={connecting || undefined}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m8 8-2-2m10 10 2 2M7 4l-3 3 5 5 3-3Zm10 16 3-3-5-5-3 3ZM10 14l4-4" /></svg>
              {connecting ? "Reconnecting..." : "Reconnect"}<span aria-hidden="true">↗</span>
            </a>
            <a className={styles.workLink} href={`${homeHref}#work`}>Explore my work <span aria-hidden="true">↗</span></a>
          </nav>
          <p className={styles.status} role="status" aria-live="polite">{connecting ? "Route restored. Taking you home." : "Reconnect to return to my portfolio."}</p>
        </div>
        <NetworkPath connecting={connecting} />
      </main>
      <footer className={styles.footer}>
        <span>SHALOM RUBARAMIRA <i>/</i> CYBERSECURITY &amp; RISK ANALYSIS</span>
        <button type="button" onClick={toggleMotion} aria-pressed={motion} aria-label={motion ? "Pause effects" : "Play effects"}>{motion ? "Ⅱ Pause effects" : "▷ Play effects"}</button>
      </footer>
    </div>
  );
}

export default function ConnectionError({ homeHref }: { homeHref: string }) {
  return <PortfolioMotion><ErrorScene homeHref={homeHref} /></PortfolioMotion>;
}
