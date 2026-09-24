/* global React, KIcon, SportBall, Flag, Crest, FOMO_GRADIENTS, SPORT_TABS */

// ─── Status bar + browser chrome (kto.bet.br pill) ─────────────────
function PhoneStatusBar() {
  return (
    <div style={{
      height: 38, padding: "0 18px 0 22px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      color: "#fff", fontSize: 14, fontWeight: 600, fontVariantNumeric: "tabular-nums",
    }}>
      <span>20:34</span>
      <span style={{ width: 90, height: 24, borderRadius: 12, background: "#000" }}/>
      <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
        <svg width="17" height="10" viewBox="0 0 17 10" fill="#fff"><rect x="0" y="6" width="3" height="4" rx="1"/><rect x="4.5" y="4" width="3" height="6" rx="1"/><rect x="9" y="2" width="3" height="8" rx="1"/><rect x="13.5" y="0" width="3" height="10" rx="1"/></svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="#fff"><path d="M7.5 2.5a8 8 0 015.7 2.4l1-1A9.5 9.5 0 007.5 1 9.5 9.5 0 00.8 3.9l1 1A8 8 0 017.5 2.5zm0 3a5 5 0 013.5 1.5l1-1A6.5 6.5 0 007.5 4 6.5 6.5 0 003 6l1 1a5 5 0 013.5-1.5zM5.5 8a2.8 2.8 0 014 0L7.5 10z"/></svg>
        <svg width="22" height="11" viewBox="0 0 22 11" fill="none"><rect x="0.5" y="0.5" width="18" height="10" rx="2.5" stroke="#fff" opacity="0.5"/><rect x="2" y="2" width="15" height="7" rx="1.5" fill="#fff"/><rect x="19.5" y="3.5" width="2" height="4" rx="1" fill="#fff" opacity="0.6"/></svg>
      </span>
    </div>
  );
}

function BrowserBar() {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8, padding: "8px 12px 10px",
      background: "#323232",
    }}>
      <span style={{ color: "#fff", fontSize: 18, fontWeight: 500, opacity: 0.85 }}>AA</span>
      <div style={{
        flex: 1, height: 32, borderRadius: 10, background: "#000",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        color: "#fff", fontSize: 14,
      }}>
        <span style={{
          display: "inline-flex", width: 18, height: 14, alignItems: "center",
          justifyContent: "center", color: "#fff",
        }}>
          <svg width="11" height="13" viewBox="0 0 11 13" fill="#fff">
            <path d="M2 5V3.5A3.5 3.5 0 015.5 0 3.5 3.5 0 019 3.5V5h1v8H1V5h1zm2 0h3V3.5A1.5 1.5 0 005.5 2 1.5 1.5 0 004 3.5V5z"/>
          </svg>
        </span>
        figma.com
      </div>
      <span style={{ color: "#fff" }}><KIcon name="refresh" size={20} color="#fff"/></span>
    </div>
  );
}

// ─── KTO header (aligned with Pinning prototype) ───────────────────
function KtoHeader({ balance = "R$ 3.300,00" }) {
  return (
    <div style={{
      height: 56, padding: "0 12px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: "#000", borderBottom: "1px solid #1E1E1E", flex: "0 0 auto",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button style={btn({ padding: "6px 4px", borderRadius: 6, gap: 4 })}>
          <KIcon name="menu" size={22} color="#fff"/>
        </button>
        <button style={btn({ padding: "6px 4px", borderRadius: 6, gap: 2, paddingRight: 6 })}>
          <KIcon name="bell" size={20} color="#fff"/>
          <span style={{ fontSize: 13, color: "#fff", fontWeight: 500 }}>3</span>
          <KIcon name="chevD" size={14} color="#fff"/>
        </button>
      </div>
      <KtoLogo/>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", fontVariantNumeric: "tabular-nums" }}>{balance}</span>
        <div style={{
          width: 24, height: 24, borderRadius: "50%", background: "#00DD70",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, fontWeight: 800, color: "#000",
        }}>$</div>
      </div>
    </div>
  );
}

function KtoLogo() {
  return (
    <img src="assets/logo-kto.svg" alt="KTO" style={{ height: 22, display: "block" }}/>
  );
}

function btn(extra = {}) {
  return {
    background: "none", border: "none", padding: 4, cursor: "pointer",
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    color: "#fff", ...extra,
  };
}

// ─── Sport tabs (aligned with Pinning prototype) ───────────────────
function SportTabs({ active, onSelect, pinnedCount = 0 }) {
  return (
    <div style={{
      display: "flex", gap: 8, padding: "8px 12px",
      overflowX: "auto", scrollbarWidth: "none", flex: "0 0 auto",
      background: "#000", borderBottom: "1px solid #1E1E1E",
    }}>
      {SPORT_TABS.map(t => {
        const isActive = active === t.id;
        const isHot = t.id === "hot";
        const isPin = t.id === "pin";
        // Active state shared green treatment (mirrors Pinning's active chip);
        // Hot keeps its flame icon coloured green when active for continuity.
        const activeBg = "rgba(0,221,112,0.18)";
        const activeBorder = "2px solid rgba(0,221,112,0.3)";
        const inactiveBorder = "2px solid #1E1E1E";
        const color = isActive ? "#00DD70" : "#fff";
        return (
          <button key={t.id} onClick={() => onSelect(t.id)} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "0 10px", height: 36,
            borderRadius: 12,
            border: isActive ? activeBorder : inactiveBorder,
            background: isActive ? activeBg : "transparent",
            color,
            fontFamily: "inherit", fontSize: 14, fontWeight: 500,
            cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
            transition: "background 180ms ease, color 180ms ease, border-color 180ms ease",
          }}>
            {t.icon === "pin" && (
              <img
                src={isActive || pinnedCount > 0 ? "assets/pin-selected.svg" : "assets/pin-not-selected.svg"}
                width={16} height={16} alt="" style={{ display: "block" }}
              />
            )}
            {t.icon === "flame" && (
              <img src="assets/icon-hot.svg" width={18} height={18} alt="" style={{ display: "block" }}/>
            )}
            {t.label && <span>{t.label}</span>}
            {isPin && (
              <span style={{
                minWidth: 18, height: 18, padding: "0 5px", borderRadius: 99,
                background: pinnedCount > 0 ? "#FAD749" : "#3C3C3C",
                color: pinnedCount > 0 ? "#000" : "#828282",
                fontSize: 11, fontWeight: 800,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}>{pinnedCount}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Section heading with sport icon + chevron expand ──────────────
function SectionHeading({ title, sport, refreshing, onChevron, expanded = true, badge }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8, padding: "10px 6px 6px",
      minWidth: 0,
    }}>
      {sport === "hot"
        ? <KIcon name="flame-fill" size={18} color="#FA9600"/>
        : <SportBall kind={sport} size={18} active/>}
      <span className="kto-h4" style={{
        color: "#fff", fontSize: 16, fontWeight: 700, lineHeight: 1,
        whiteSpace: "nowrap",
      }}>
        {title}
      </span>
      {refreshing && (
        <span title="Refreshes every 60s" style={{
          color: "#00DD70", display: "inline-flex", alignItems: "center", gap: 4,
          fontSize: 9, fontWeight: 700, letterSpacing: "0.05em",
        }}>
          <span className="kto-pulse-dot"/>
        </span>
      )}
      <span style={{ flex: 1 }}/>
      {badge && (
        <span style={{
          background: "rgba(0,221,112,0.15)", color: "#00DD70",
          fontSize: 9, fontWeight: 700, padding: "2px 5px", borderRadius: 4,
          letterSpacing: "0.04em", whiteSpace: "nowrap",
        }}>{badge}</span>
      )}
      <button onClick={onChevron} style={{ ...btn(), padding: 2 }}>
        <KIcon name={expanded ? "chevU" : "chevD"} size={14} color="#828282"/>
      </button>
    </div>
  );
}

// ─── Múltiplas View toggle row ────────────────────────────────────
function MultiplasRow() {
  return (
    <div style={{
      display: "flex", alignItems: "center", padding: "6px 6px",
      gap: 10, color: "#fff",
    }}>
      <span style={{
        width: 28, height: 16, borderRadius: 10, background: "#3C3C3C",
        position: "relative", flexShrink: 0,
      }}>
        <span style={{
          position: "absolute", top: 2, left: 2,
          width: 12, height: 12, borderRadius: "50%", background: "#828282",
        }}/>
      </span>
      <span style={{ fontSize: 13, fontWeight: 500 }}>Múltiplas View</span>
      <span style={{ flex: 1 }}/>
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        fontSize: 13, fontWeight: 600,
      }}>
        Winner
        <KIcon name="chevD" size={14} color="#fff"/>
      </span>
    </div>
  );
}

window.PhoneStatusBar = PhoneStatusBar;
window.BrowserBar = BrowserBar;
window.KtoHeader = KtoHeader;
window.KtoLogo = KtoLogo;
window.SportTabs = SportTabs;
window.SectionHeading = SectionHeading;
window.MultiplasRow = MultiplasRow;
window._btn = btn;
