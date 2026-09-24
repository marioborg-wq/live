/* global React */

// ─── Icons (inline SVG) ────────────────────────────────────────────
const KIcon = ({ name, size = 16, color = "currentColor", fill = "none", strokeWidth = 2 }) => {
  const paths = {
    pin: <path d="M12 2 9 9l-7 1 5 5-1 7 6-3 6 3-1-7 5-5-7-1z" fill={fill}/>,
    "pin-fill": <path d="M12 2 9 9l-7 1 5 5-1 7 6-3 6 3-1-7 5-5-7-1z" fill={color} stroke={color}/>,
    flame: <path d="M13 3s3 2 3 6c0 2-1 3-1 3s3 1 3 5a6 6 0 01-12 0c0-3 2-5 3-6-1-1-1-2-1-3 2 0 3-2 5-5z" fill={fill}/>,
    "flame-fill": <path d="M13 3s3 2 3 6c0 2-1 3-1 3s3 1 3 5a6 6 0 01-12 0c0-3 2-5 3-6-1-1-1-2-1-3 2 0 3-2 5-5z" fill={color} stroke={color}/>,
    menu: <><path d="M3 6h18M3 12h18M3 18h18"/></>,
    bell: <><path d="M6 8a6 6 0 1112 0c0 7 3 9 3 9H3s3-2 3-9zM10 21a2 2 0 004 0"/></>,
    deposit: <><path d="M4 9a3 3 0 013-3h10a3 3 0 013 3v9a3 3 0 01-3 3H7a3 3 0 01-3-3z"/><path d="M8 6V5a4 4 0 018 0v1"/></>,
    chevD: <path d="M6 9l6 6 6-6"/>,
    chevR: <path d="M9 18l6-6-6-6"/>,
    chevU: <path d="M6 15l6-6 6 6"/>,
    refresh: <><path d="M3 12a9 9 0 0115-7l3 3M21 12a9 9 0 01-15 7l-3-3"/><path d="M21 3v6h-6M3 21v-6h6"/></>,
    bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7z" fill={color}/>,
    eye: <><circle cx="12" cy="12" r="3"/><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/></>,
    fire: <path d="M13 3s3 2 3 6c0 2-1 3-1 3s3 1 3 5a6 6 0 01-12 0c0-3 2-5 3-6-1-1-1-2-1-3 2 0 3-2 5-5z"/>,
    shirt: <path d="M4 5l3-2h10l3 2-2 4-3-1v12H6V8L3 9z" fill={fill}/>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v5h1"/></>,
    timer: <><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/></>,
    arrowU: <path d="M12 19V5M5 12l7-7 7 7"/>,
    arrowD: <path d="M12 5v14M5 12l7 7 7-7"/>,
    star: <path d="M12 2l3 7 7 .5-5.5 4.5L18 21l-6-3.5L6 21l1.5-7L2 9.5 9 9z"/>,
    play: <path d="M5 3l16 9-16 9z" fill={color}/>,
    home: <><path d="M3 12l9-9 9 9"/><path d="M5 10v10h14V10"/></>,
    bets: <><path d="M4 4h16v5H4z"/><path d="M4 13h16v7H4z"/></>,
    live: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    az: <><path d="M4 6h16M4 12h16M4 18h16"/></>,
    account: <><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a6 6 0 0116 0v2"/></>,
    close: <><path d="M18 6L6 18M6 6l12 12"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    ribbon: <path d="M4 4h16v18l-8-4-8 4z"/>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0 }}>
      {paths[name] ?? null}
    </svg>
  );
};

// ─── Sport ball icons (small circles in tab nav) ───────────────────
const SportBall = ({ kind, size = 18, active = false }) => {
  const c = active ? "#fff" : "#cfcfcf";
  const bg = active ? "transparent" : "transparent";
  if (kind === "football") {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" fill={bg}>
        <circle cx="10" cy="10" r="9" fill="#fff"/>
        <path d="M10 2l2 3-2 2-2-2zm-7 8l3-2 2 2-2 2zm14 0l-3-2-2 2 2 2zm-7 8l2-3-2-2-2 2z" fill="#000"/>
        <path d="M10 7l2 2-1 3h-2l-1-3z" fill="#000"/>
      </svg>
    );
  }
  if (kind === "tennis") {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="9" fill="#D9FAEA" stroke="#00DD70" strokeWidth="0.6"/>
        <path d="M3 6c4 1 9 1 14 0M3 14c4-1 9-1 14 0" stroke="#fff" strokeWidth="1.2" fill="none"/>
      </svg>
    );
  }
  if (kind === "basketball") {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="9" fill="#FA9600"/>
        <path d="M10 1v18M1 10h18M3 4c4 4 10 4 14 0M3 16c4-4 10-4 14 0" stroke="#000" strokeWidth="0.8" fill="none"/>
      </svg>
    );
  }
  if (kind === "volleyball") {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="9" fill="#fff"/>
        <path d="M10 1c-2 6 0 12 6 17M10 1c2 6 0 12-6 17M1 10c5-2 11-2 18 0" stroke="#FA9600" strokeWidth="0.9" fill="none"/>
      </svg>
    );
  }
  if (kind === "amfootball") {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20">
        <ellipse cx="10" cy="10" rx="9" ry="6" fill="#7A3A1A"/>
        <path d="M6 10h8M10 8v4" stroke="#fff" strokeWidth="1" fill="none"/>
      </svg>
    );
  }
  return null;
};

// ─── Country flag (small rounded square) ───────────────────────────
const Flag = ({ code, size = 14 }) => {
  const flags = {
    br: <><rect width="20" height="14" fill="#009C3B"/><polygon points="10,2 18,7 10,12 2,7" fill="#FFDF00"/><circle cx="10" cy="7" r="3" fill="#002776"/></>,
    en: <><rect width="20" height="14" fill="#fff"/><path d="M0 0l20 14M20 0L0 14" stroke="#C8102E" strokeWidth="2"/><path d="M10 0v14M0 7h20" stroke="#C8102E" strokeWidth="3"/></>,
    us: <><rect width="20" height="14" fill="#fff"/><path d="M0 1.5h20M0 4.5h20M0 7.5h20M0 10.5h20M0 13.5h20" stroke="#B22234"/><rect width="9" height="7" fill="#3C3B6E"/></>,
    es: <><rect width="20" height="14" fill="#AA151B"/><rect y="3.5" width="20" height="7" fill="#F1BF00"/></>,
    fr: <><rect width="20" height="14" fill="#fff"/><rect width="6.7" height="14" fill="#0055A4"/><rect x="13.3" width="6.7" height="14" fill="#EF4135"/></>,
  };
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 20 14" style={{ borderRadius: 1, flexShrink: 0 }}>
      {flags[code] ?? <rect width="20" height="14" fill="#3C3C3C"/>}
    </svg>
  );
};

// ─── Team crest (round monogram chip) ──────────────────────────────
const Crest = ({ color = "#DA0000", colorTo = "#900000", initial = "?", size = 22 }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%",
    background: `linear-gradient(135deg, ${color}, ${colorTo})`,
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    color: "#fff", fontSize: size * 0.42, fontWeight: 800, flexShrink: 0,
    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
  }}>{initial}</div>
);

// ─── Helpers ───────────────────────────────────────────────────────
const FOMO_GRADIENTS = {
  default: "linear-gradient(90deg, #FA9600 0%, #FF5353 100%)",
  yellow:  "linear-gradient(90deg, #FAD749 0%, #FA9600 100%)",
  red:     "linear-gradient(90deg, #FF5353 0%, #B81A1A 100%)",
  green:   "linear-gradient(90deg, #00DD70 0%, #00A047 100%)",
};

window.KIcon = KIcon;
window.SportBall = SportBall;
window.Flag = Flag;
window.Crest = Crest;
window.FOMO_GRADIENTS = FOMO_GRADIENTS;
