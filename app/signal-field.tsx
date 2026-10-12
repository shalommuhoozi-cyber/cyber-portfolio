"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { usePortfolioMotion } from "./portfolio-motion";

const concepts = [
  {
    id: "network",
    title: "Network security",
    angle: 34,
    radius: 32,
    summary: "Segment networks and control traffic to limit where threats can travel. Applied in my simulated three-campus network.",
    tools: "SEGMENTATION / FIREWALLS / BGP",
  },
  {
    id: "detection",
    title: "Threat detection",
    angle: 100,
    radius: 32,
    summary: "Monitor network activity and use Snort IDS rules to surface suspicious scans and denial-of-service patterns.",
    tools: "SNORT IDS / MONITORING / ALERTS",
  },
  {
    id: "encryption",
    title: "Encryption",
    angle: 190,
    radius: 32,
    summary: "Protect information in transit with encrypted IPsec tunnels and TLS-enabled services, supported by a public key infrastructure.",
    tools: "IPsec / TLS / PKI",
  },
  {
    id: "access",
    title: "Access control",
    angle: 260,
    radius: 32,
    summary: "Give users and services only the access they need. Validate firewall policies against allowed and denied traffic.",
    tools: "LEAST PRIVILEGE / FIREWALL POLICIES",
  },
  {
    id: "risk",
    title: "Risk assessment",
    angle: 320,
    radius: 33,
    summary: "Identify weaknesses, assess their potential impact, and prioritise practical controls. Communicate the findings clearly.",
    tools: "THREAT ANALYSIS / CONTROL ASSESSMENT",
  },
];

export default function SignalField() {
  const radarRef = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState(0);
  const [visible, setVisible] = useState(false);
  const [tabActive, setTabActive] = useState(true);
  const { motion, toggleMotion } = usePortfolioMotion();
  const concept = concepts[selected];
  const running = motion && visible && tabActive;

  useEffect(() => {
    const element = radarRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.1 });
    observer.observe(element);
    const onVisibility = () => setTabActive(!document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <aside ref={radarRef} className="security-radar" aria-labelledby="radar-title" data-running={running}>
      <div className="radar-heading">
        <h2 id="radar-title">SECURITY / RADAR</h2>
        <span>05 CONCEPTS</span>
      </div>

      <div className="radar-screen" role="group" aria-label="Explore security concepts" aria-describedby="radar-instructions">
        <div className="radar-face" aria-hidden="true">
          <span className="radar-ring radar-ring-middle" />
          <span className="radar-ring radar-ring-inner" />
          <span className="radar-crosshair radar-crosshair-x" />
          <span className="radar-crosshair radar-crosshair-y" />
          <span className="radar-sweep" />
          <svg className="radar-connection" viewBox="0 0 100 100">
            <line x1="50" y1="50" x2={50 + Math.sin(concept.angle * Math.PI / 180) * concept.radius} y2={50 - Math.cos(concept.angle * Math.PI / 180) * concept.radius} />
          </svg>
          <span className="radar-centre"><span>SR</span><small>DEFENCE<br />IN DEPTH</small></span>
        </div>
        <span className="radar-bearing radar-bearing-n" aria-hidden="true">000</span>
        <span className="radar-bearing radar-bearing-e" aria-hidden="true">090</span>
        <span className="radar-bearing radar-bearing-s" aria-hidden="true">180</span>
        <span className="radar-bearing radar-bearing-w" aria-hidden="true">270</span>
        {concepts.map((item, index) => {
          const radians = item.angle * Math.PI / 180;
          const style = {
            left: `${50 + Math.sin(radians) * item.radius}%`,
            top: `${50 - Math.cos(radians) * item.radius}%`,
            "--hit-time": `${item.angle / 360 * 12}s`,
          } as CSSProperties;
          return (
            <button
              key={item.id}
              type="button"
              className="radar-node"
              style={style}
              aria-pressed={selected === index}
              aria-controls="radar-detail"
              onClick={() => setSelected(index)}
              onFocus={() => setSelected(index)}
              onPointerEnter={(event) => { if (event.pointerType === "mouse") setSelected(index); }}
            >
              <span className="radar-blip" aria-hidden="true" />
              <span className="radar-node-label">{item.title}</span>
            </button>
          );
        })}
      </div>

      <div className="radar-detail" id="radar-detail" aria-live="polite" aria-atomic="true">
        <div className="radar-detail-title"><span aria-hidden="true">0{selected + 1}</span><h3>{concept.title}</h3><span aria-hidden="true">↗</span></div>
        <p>{concept.summary}</p>
        <small>{concept.tools}</small>
      </div>
      <div className="radar-controls">
        <p id="radar-instructions">Select a point to explore.</p>
        <button type="button" className="motion-toggle" aria-pressed={motion} onClick={toggleMotion} aria-label={motion ? "Pause animations" : "Play animations"}>
          <span aria-hidden="true">{motion ? "Ⅱ" : "▷"}</span><span>{motion ? "Pause sweep" : "Play sweep"}</span>
        </button>
      </div>
    </aside>
  );
}
