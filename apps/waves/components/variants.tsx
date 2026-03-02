"use client";

import React, { useState, useEffect, useRef, CSSProperties } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

interface NavItemProps {
  title: string;
  desc: string;
  active: boolean;
  onClick: () => void;
}

interface StyleMap {
  [key: string]: CSSProperties;
}

// ── Styles ───────────────────────────────────────────────────────────────────

const s: StyleMap = {
  body: {
    backgroundColor: "#030305",
    color: "#EAEAEA",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    WebkitFontSmoothing: "antialiased",
    cursor: "crosshair",
  },
  universeLayer: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 0,
    pointerEvents: "none",
    overflow: "hidden",
  },
  nebulaCore: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "60vh",
    height: "60vh",
    background:
      "radial-gradient(circle at center, rgba(79,240,255,0.15) 0%, rgba(0,68,255,0.05) 40%, transparent 70%)",
    filter: "blur(60px)",
    mixBlendMode: "screen",
    animation: "pulse-nebula 10s ease-in-out infinite alternate",
  },
  cometTail: {
    position: "absolute",
    top: "40%",
    left: "55%",
    width: "2px",
    height: "40vh",
    background:
      "linear-gradient(to bottom, rgba(79,240,255,0) 0%, rgba(79,240,255,0.4) 50%, rgba(0,68,255,0.8) 100%)",
    transform: "rotate(-25deg)",
    filter: "blur(4px)",
    opacity: 0.6,
  },
  cometHead: {
    position: "absolute",
    top: "60%",
    left: "45%",
    width: "80px",
    height: "80px",
    background: "radial-gradient(circle, #ccfaff 0%, #0077ff 30%, transparent 70%)",
    filter: "blur(15px)",
    mixBlendMode: "screen",
    boxShadow: "0 0 40px rgba(79,240,255,0.4)",
  },
  interfaceLayer: {
    position: "relative",
    zIndex: 10,
    height: "100%",
    width: "100%",
    display: "grid",
    gridTemplateColumns: "280px 1fr 320px",
    gridTemplateRows: "80px 1fr 80px",
    padding: "2rem",
    background: "radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 100%)",
    cursor: "crosshair",
  },
  brand: {
    fontSize: "14px",
    letterSpacing: "0.05em",
    borderBottom: "1px solid transparent",
    paddingBottom: "4px",
    transition: "0.3s",
  },
  label: {
    fontSize: "10px",
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    color: "rgba(255,255,255,0.6)",
    marginBottom: "0.75rem",
    display: "block",
  },
  dataText: {
    fontSize: "13px",
    lineHeight: 1.5,
  },
  coordinate: {
    fontFamily: "'Courier New', monospace",
    fontSize: "11px",
    color: "#4ff0ff",
    opacity: 0.8,
  },
  navRail: {
    gridColumn: "1",
    gridRow: "2",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "2rem",
  },
  navItemBase: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    opacity: 0.4,
    transition: "all 0.4s ease",
    position: "relative",
    paddingLeft: "0px",
    cursor: "crosshair",
  },
  navItemActive: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    opacity: 1,
    transition: "all 0.4s ease",
    position: "relative",
    paddingLeft: "10px",
    cursor: "crosshair",
  },
  navActiveLine: {
    position: "absolute",
    left: 0,
    top: "50%",
    width: "4px",
    height: "1px",
    background: "#4ff0ff",
    boxShadow: "0 0 5px #4ff0ff",
  },
  navTitle: {
    fontSize: "16px",
    fontWeight: 400,
    letterSpacing: "-0.02em",
  },
  navDesc: {
    fontSize: "11px",
    color: "rgba(255,255,255,0.6)",
    maxWidth: "200px",
  },
  contextRail: {
    gridColumn: "3",
    gridRow: "2",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "3rem",
    borderLeft: "1px solid rgba(255,255,255,0.15)",
    paddingLeft: "2rem",
    background: "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 100%)",
  },
  eventCard: {
    marginBottom: "1rem",
  },
  eventDate: {
    fontFamily: "'Courier New', monospace",
    fontSize: "10px",
    color: "#4ff0ff",
    marginBottom: "4px",
  },
  eventName: {
    fontSize: "14px",
    marginBottom: "8px",
    fontWeight: 400,
    letterSpacing: "-0.02em",
  },
  observationInput: {
    background: "transparent",
    border: "none",
    borderBottom: "1px solid rgba(255,255,255,0.15)",
    color: "white",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    fontSize: "13px",
    padding: "8px 0",
    width: "100%",
    outline: "none",
    transition: "0.3s",
    resize: "none",
    cursor: "text",
  },
  observationInputFocus: {
    background: "transparent",
    border: "none",
    borderBottom: "1px solid #4ff0ff",
    color: "white",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    fontSize: "13px",
    padding: "8px 0",
    width: "100%",
    outline: "none",
    transition: "0.3s",
    resize: "none",
    cursor: "text",
  },
  btnLog: {
    marginTop: "1rem",
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "white",
    padding: "8px 16px",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    transition: "0.3s",
    width: "fit-content",
    cursor: "crosshair",
  },
  btnLogHover: {
    marginTop: "1rem",
    background: "rgba(79,240,255,0.05)",
    border: "1px solid #4ff0ff",
    color: "white",
    padding: "8px 16px",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    transition: "0.3s",
    width: "fit-content",
    cursor: "crosshair",
    boxShadow: "0 0 10px rgba(79,240,255,0.1)",
  },
  viewportCenter: {
    gridColumn: "2",
    gridRow: "2",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
  },
  reticle: {
    width: "300px",
    height: "300px",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "50%",
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  reticleDot: {
    width: "4px",
    height: "4px",
    background: "white",
    borderRadius: "50%",
    opacity: 0.5,
  },
  objectLabel: {
    position: "absolute",
    top: "65%",
    textAlign: "center",
    animation: "fade-in 2s ease-out forwards 1s",
    opacity: 0,
  },
  objectTitle: {
    fontSize: "24px",
    letterSpacing: "0.05em",
    // marginBottom: "0.5rem",
    textShadow: "0 0 10px rgba(0,0,0,0.8)",
    fontWeight: 400,
  },
  objectSubtitle: {
    fontSize: "12px",
    color: "rgba(255,255,255,0.6)",
  },
  bottomBar: {
    gridColumn: "1 / span 3",
    gridRow: "3",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderTop: "1px solid transparent",
  },
  quoteContainer: {
    maxWidth: "600px",
  },
  quote: {
    fontSize: "13px",
    lineHeight: 1.4,
    color: "rgba(255,255,255,0.85)",
  },
  statusIndicator: {
    fontSize: "10px",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#EAEAEA",
  },
  statusDot: {
    width: "6px",
    height: "6px",
    background: "#00ff00",
    borderRadius: "50%",
    boxShadow: "0 0 5px #00ff00",
    animation: "pulse-status 2s infinite",
  },
  topLeft: {
    gridColumn: "1",
    gridRow: "1",
    display: "flex",
    alignItems: "flex-start",
  },
  topRight: {
    gridColumn: "3",
    gridRow: "1",
    textAlign: "right",
  },
  locationIndicator: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "4px",
  },
};

// ── Sub-components ───────────────────────────────────────────────────────────

const NavItem: React.FC<NavItemProps> = ({ title, desc, active, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const isHighlighted = active || hovered;

  return (
    <div
      style={isHighlighted ? s.navItemActive : s.navItemBase}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {active && <span style={s.navActiveLine} />}
      <span style={s.navTitle}>{title}</span>
      <span style={s.navDesc}>{desc}</span>
    </div>
  );
};

const StarField: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const stars: HTMLDivElement[] = [];

    for (let i = 0; i < 400; i++) {
      const star = document.createElement("div");
      star.classList.add("astra-star");

      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = Math.random() < 0.95 ? Math.random() * 2 : Math.random() * 3 + 1;
      const duration = Math.random() * 3 + 2 + "s";
      const delay = Math.random() * 5 + "s";

      star.style.left = x + "%";
      star.style.top = y + "%";
      star.style.width = size + "px";
      star.style.height = size + "px";
      star.style.animationDuration = duration;
      star.style.animationDelay = delay;
      star.style.opacity = String(Math.random() * 0.7 + 0.1);

      container.appendChild(star);
      stars.push(star);
    }

    const handleMouseMove = (e: MouseEvent) => {
      const x = (window.innerWidth - e.pageX) / 100;
      const y = (window.innerHeight - e.pageY) / 100;
      container.style.transform = `translateX(${x}px) translateY(${y}px)`;
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      stars.forEach((star) => {
        if (container.contains(star)) container.removeChild(star);
      });
    };
  }, []);

  return (
    <div ref={containerRef} style={s.universeLayer}>
      <div style={s.nebulaCore} />
      <div style={s.cometTail} />
      <div style={s.cometHead} />
    </div>
  );
};

const GlobalStyles: React.FC = () => {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      * { box-sizing: border-box; margin: 0; padding: 0; cursor: crosshair; }
      html, body, #root { height: 100%; width: 100%; overflow: hidden; background-color: #030305; }
      .astra-star {
        position: absolute;
        background: white;
        border-radius: 50%;
        opacity: 0;
        animation: astra-twinkle var(--duration, 4s) ease-in-out infinite;
        box-shadow: 0 0 2px rgba(255,255,255,0.8);
      }
      @keyframes astra-twinkle {
        0%, 100% { opacity: 0.2; transform: scale(0.8); }
        50% { opacity: 1; transform: scale(1.2); }
      }
      @keyframes pulse-nebula {
        0% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.05); }
      }
      @keyframes pulse-status {
        0% { opacity: 0.5; }
        50% { opacity: 1; }
        100% { opacity: 0.5; }
      }
      @keyframes fade-in {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      input, button { cursor: crosshair; }
      textarea { cursor: text; }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
};

// ── Main Component ───────────────────────────────────────────────────────────

const navItems = [
  { title: "Star Map", desc: "Real-time AR visualization of local constellations." },
  { title: "Deep Field", desc: "Identify distant galaxies and nebulae." },
  { title: "Events", desc: "Track comets, eclipses, and conjunctions." },
  { title: "Library", desc: "Catalog of 88 constellations." },
];

export default function AstraPage() {
  const [activeNav, setActiveNav] = useState(0);
  const [visibility, setVisibility] = useState("");
  const [magnitude, setMagnitude] = useState("");
  const [visibilityFocused, setVisibilityFocused] = useState(false);
  const [magnitudeFocused, setMagnitudeFocused] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setVisibility("");
    setMagnitude("");
  };

  return (
    <div style={s.body}>
      <GlobalStyles />
      <StarField />

      <div style={s.interfaceLayer}>
        {/* Top Left */}
        <div style={s.topLeft}>
          <div style={s.brand}>ASTRA TELESCOPE</div>
        </div>

        {/* Top Right */}
        <div style={s.topRight}>
          <div style={s.locationIndicator}>
            <span style={s.label}>Observatory Location</span>
            <span style={s.dataText}>Mauna Kea, HI</span>
            <span style={s.coordinate}>19.8207° N, 155.4681° W</span>
          </div>
        </div>

        {/* Nav Rail */}
        <div style={s.navRail}>
          {navItems.map((item, index) => (
            <NavItem
              key={index}
              title={item.title}
              desc={item.desc}
              active={activeNav === index}
              onClick={() => setActiveNav(index)}
            />
          ))}
        </div>

        {/* Viewport Center */}
        <div style={s.viewportCenter}>
          <div style={s.reticle}>
            <div style={s.reticleDot} />
          </div>
          <div style={s.objectLabel}>
            <div style={s.objectTitle}>Comet C/2023 A3</div>
            <div style={s.objectSubtitle}>Tsuchinshan–ATLAS • Magnitude 0.4</div>
          </div>
        </div>

        {/* Context Rail */}
        <div style={s.contextRail}>
          <div>
            <span style={s.label}>Upcoming Events</span>
            <div style={s.eventCard}>
              <div style={s.eventDate}>OCT 12 — 21:00 UTC</div>
              <div style={s.eventName}>Perihelion Approach</div>
              <div style={s.navDesc}>Optimal visibility in Northern Hemisphere. Look West.</div>
            </div>
            <div style={s.eventCard}>
              <div style={s.eventDate}>NOV 18 — 02:30 UTC</div>
              <div style={s.eventName}>Leonids Peak</div>
              <div style={s.navDesc}>~15 meteors per hour.</div>
            </div>
          </div>

          <div>
            <span style={s.label}>Captain&apos;s Log</span>
            <textarea
              style={visibilityFocused ? s.observationInputFocus : s.observationInput}
              rows={1}
              placeholder="Note visibility conditions..."
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              onFocus={() => setVisibilityFocused(true)}
              onBlur={() => setVisibilityFocused(false)}
            />
            <textarea
              style={magnitudeFocused ? s.observationInputFocus : s.observationInput}
              rows={1}
              placeholder="Record magnitude..."
              value={magnitude}
              onChange={(e) => setMagnitude(e.target.value)}
              onFocus={() => setMagnitudeFocused(true)}
              onBlur={() => setMagnitudeFocused(false)}
            />
            <button
              style={btnHovered ? s.btnLogHover : s.btnLog}
              onMouseEnter={() => setBtnHovered(true)}
              onMouseLeave={() => setBtnHovered(false)}
              onClick={handleSave}
            >
              {saved ? "Entry Saved ✓" : "Save Entry"}
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={s.bottomBar}>
          <div style={s.quoteContainer}>
            <p style={s.quote}>
              &ldquo;We are all in the gutter, but some of us are looking at the stars.&rdquo;
            </p>
          </div>
          <div style={s.statusIndicator}>
            <div style={s.statusDot} />
            System Operational • Sky Clear
          </div>
        </div>
      </div>
    </div>
  );
}