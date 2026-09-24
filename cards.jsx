/* global React, KIcon, SportBall, Flag, Crest, FOMO_GRADIENTS */

// ─── FOMO banner — the "GRÊMIO FIGHTING HARD FOR THE WIN!" pill ────
function FomoBanner({ message, variant = "default", marquee = false }) {
  const grad = FOMO_GRADIENTS[variant] || FOMO_GRADIENTS.default;
  return (
    <div className={"kto-fomo " + (marquee ? "is-marquee" : "")} style={{
      background: grad, color: "#000", fontSize: 11, fontWeight: 800,
      letterSpacing: "0.04em", textAlign: "center",
      borderRadius: 6, padding: "5px 8px", lineHeight: "14px",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
      position: "relative", overflow: "hidden",
    }}>
      <KIcon name="flame-fill" size={12} color="#000"/>
      <span style={{ whiteSpace: "nowrap" }}>{message}</span>
      <KIcon name="flame-fill" size={12} color="#000"/>
    </div>
  );
}

// ─── Sizzling / Trending level badge ───────────────────────────────
function LevelBadge({ level }) {
  if (!level) return null;
  const map = {
    sizzling: { bg: "linear-gradient(90deg,#FA9600,#FF5353)", text: "Sizzling", color: "#000", icon: "flame-fill" },
    trending: { bg: "rgba(250,150,0,0.16)", text: "Trending", color: "#FA9600", icon: "arrowU" },
  };
  const v = map[level]; if (!v) return null;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 3,
      background: v.bg, color: v.color, fontSize: 10, fontWeight: 800,
      borderRadius: 4, padding: "1px 5px 1px 4px", lineHeight: "12px",
      letterSpacing: "0.02em", textTransform: "none",
    }}>
      <KIcon name={v.icon} size={10} color={v.color}/>
      {v.text}
    </span>
  );
}

// ─── Odds button (used inside cards) ───────────────────────────────
function OddsBtn({ label, value, trend, wide, selected, onClick }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, background: selected ? "#FAD749" : "#323232",
      color: selected ? "#000" : "#fff",
      border: "none", borderRadius: 6, padding: "6px 6px",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 1,
      cursor: "pointer", fontFamily: "inherit", minWidth: 0,
      transition: "background 150ms",
    }}>
      <span style={{ fontSize: 10, opacity: 0.65, maxWidth: "100%",
        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {label}
      </span>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
        <span style={{ fontSize: 15, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{value}</span>
        {trend === "up" && <span style={{ color: selected ? "#006600" : "#00DD70", fontSize: 8 }}>▲</span>}
        {trend === "down" && <span style={{ color: selected ? "#990000" : "#FF6D6D", fontSize: 8 }}>▼</span>}
      </span>
    </button>
  );
}

// ─── Live-bet velocity chip (FOMO data signal) ─────────────────────
function BetVelocity({ count }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 3,
      color: "#FA9600", fontSize: 10, fontWeight: 700, letterSpacing: "0.02em",
      whiteSpace: "nowrap", flexShrink: 0,
    }}>
      <KIcon name="bolt" size={10} color="#FA9600"/>
      {count.toLocaleString("pt-BR")}/5min
    </span>
  );
}

// ─── HOT EVENT CARD (the centerpiece) ──────────────────────────────
function HotEventCard({ event, glow = "border", onSelect, selection, showVelocity = true }) {
  const { live, kickoff, league, home, away, market, level, odds, sport } = event;
  const isTennis = sport === "tn";

  const glowStyle = {
    none: {},
    border: { boxShadow: "0 0 0 1px rgba(255,83,83,0.5), 0 6px 22px -10px rgba(255,83,83,0.6)" },
    pulse: { animation: "kto-hot-pulse 2.2s ease-in-out infinite" },
    flame: { boxShadow: "inset 0 0 0 1px rgba(250,150,0,0.6), 0 0 28px -8px rgba(250,150,0,0.45)" },
  }[glow] || {};

  return (
    <div style={{
      background: "#1E1E1E", borderRadius: 12, padding: 10,
      display: "flex", flexDirection: "column", gap: 6,
      ...glowStyle,
    }}>
      {/* Top row: time + kickoff · league */}
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        fontSize: 10, fontWeight: 700, letterSpacing: "0.04em",
      }}>
        {sport === "fb" && <SportBall kind="football" size={12}/>}
        {sport === "bb" && <SportBall kind="basketball" size={12}/>}
        {sport === "tn" && <SportBall kind="tennis" size={12}/>}
        <span style={{ color: "#00DD70" }}>{live}</span>
        <span style={{ color: "#828282", fontWeight: 500 }}>· {kickoff}</span>
        <span style={{ flex: 1 }}/>
        <span style={{ color: "#828282", display: "inline-flex", alignItems: "center", gap: 4 }}>
          <Flag code={event.country}/> {league}
        </span>
      </div>

      {/* Teams + score */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "2px 2px" }}>
        <ParticipantRow team={home} sport={sport}/>
        <ParticipantRow team={away} sport={sport}/>
      </div>

      {/* Market row */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 2px", minWidth: 0 }}>
        <span style={{
          color: "#fff", fontSize: 11, fontWeight: 600,
          whiteSpace: "nowrap", flexShrink: 0,
        }}>{market}</span>
        <LevelBadge level={level}/>
        <span style={{ flex: 1 }}/>
        {showVelocity && event.betsLast5 && (
          <BetVelocity count={event.betsLast5}/>
        )}
      </div>

      {/* Odds */}
      <div style={{ display: "flex", gap: 6 }}>
        {odds.map((o, i) => (
          <OddsBtn key={i} {...o}
            selected={selection === `${event.id}-${i}`}
            onClick={() => onSelect && onSelect(`${event.id}-${i}`, event, o)}/>
        ))}
      </div>
    </div>
  );
}

function ParticipantRow({ team, sport }) {
  const isTennis = sport === "tn";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Crest color={team.color} colorTo={team.colorTo} initial={team.short[0]} size={20}/>
      <span style={{
        color: "#fff", fontSize: 13, fontWeight: 600, flex: 1,
        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
      }}>{team.short}</span>
      {isTennis && team.setLine && (
        <span style={{ color: "#828282", fontSize: 12, fontVariantNumeric: "tabular-nums", letterSpacing: "0.16em" }}>
          {team.setLine}
        </span>
      )}
      <span style={{ color: "#fff", fontSize: 15, fontWeight: 700, fontVariantNumeric: "tabular-nums", minWidth: 16, textAlign: "right" }}>
        {team.score}
      </span>
    </div>
  );
}

// ─── Standard (secondary) event card — Football / Basketball list ──
function StdEventCard({ event, onSelect, selection }) {
  const { live, kickoff, league, home, away, market, level, odds, oddLabel } = event;
  return (
    <div style={{
      background: "#1E1E1E", borderRadius: 12, padding: 10,
      display: "flex", flexDirection: "column", gap: 6,
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        fontSize: 10, fontWeight: 700, letterSpacing: "0.04em",
      }}>
        <span style={{ color: "#00DD70" }}>{live}</span>
        <span style={{ color: "#828282", fontWeight: 500 }}>· {kickoff}</span>
        <span style={{ flex: 1 }}/>
        <span style={{ color: "#828282", display: "inline-flex", alignItems: "center", gap: 4 }}>
          <Flag code={event.country}/> {league}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "2px 2px" }}>
        <ParticipantRow team={home}/>
        <ParticipantRow team={away}/>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 2px" }}>
        <span style={{ color: "#fff", fontSize: 11, fontWeight: 600 }}>{market}</span>
        <LevelBadge level={level}/>
        <span style={{ flex: 1 }}/>
        {oddLabel && (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 3,
            background: "rgba(250,215,73,0.12)", color: "#FAD749",
            fontSize: 10, fontWeight: 800, borderRadius: 4, padding: "1px 5px",
          }}>
            <KIcon name="bolt" size={10} color="#FAD749"/> {oddLabel}
          </span>
        )}
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {odds.map((o, i) => (
          <OddsBtn key={i} {...o}
            selected={selection === `${event.id}-${i}`}
            onClick={() => onSelect && onSelect(`${event.id}-${i}`, event, o)}/>
        ))}
      </div>
    </div>
  );
}

window.FomoBanner = FomoBanner;
window.LevelBadge = LevelBadge;
window.OddsBtn = OddsBtn;
window.BetVelocity = BetVelocity;
window.HotEventCard = HotEventCard;
window.StdEventCard = StdEventCard;
window.ParticipantRow = ParticipantRow;
