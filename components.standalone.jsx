// components.jsx — KTO Live Lobby UI building blocks
const { useState, useEffect, useRef, useLayoutEffect, useMemo } = React;

// ========== ICONS ==========
const Icon = {
  Pin: ({ filled = false, size = 16, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display:'block' }}>
      <path
        d={"M14 2L22 10L20.5 11.5C20.1 11.9 19.5 12 19 11.8L17 11L14.5 13.5C14.6 14 14.7 14.5 14.7 15C14.7 16.4 14.1 17.7 13 18.7L11.5 17.2L13 15.7L9 11.7L7.5 13.2L6 11.7C7 10.6 8.3 10 9.7 10C10.2 10 10.7 10.1 11.2 10.2L13.7 7.7L13 5.7C12.8 5.2 12.9 4.6 13.3 4.2L14 2Z"}
        fill={filled ? (color || '#fad749') : 'transparent'}
        stroke={filled ? 'none' : (color || '#828282')}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M11 13L4 20" stroke={filled ? (color || '#fad749') : (color || '#828282')} strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  Football: ({ size = 22, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.6"/>
      <path d="M12 5L15 8L14 12L10 12L9 8L12 5Z M14 12L17 15M10 12L7 15M15 8L19 8M9 8L5 8M12 16V20" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  ),
  Tennis: ({ size = 22, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.6"/>
      <path d="M5 5C8.5 8 8.5 16 5 19 M19 5C15.5 8 15.5 16 19 19" stroke={color} strokeWidth="1.4" strokeLinecap="round" fill="none"/>
    </svg>
  ),
  Basketball: ({ size = 22, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.6"/>
      <path d="M3 12H21 M12 3V21 M5.5 5.5C8 8 8 16 5.5 18.5 M18.5 5.5C16 8 16 16 18.5 18.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" fill="none"/>
    </svg>
  ),
  Volleyball: ({ size = 22, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.6"/>
      <path d="M12 3C9 8 9 16 12 21 M3 12C8 9 16 9 21 12 M5.5 5.5C9 9 15 15 18.5 18.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" fill="none"/>
    </svg>
  ),
  Hot: ({ size = 22, color = '#fad749' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2C12 2 13.5 4.5 13.5 7C13.5 8.5 12.5 9.5 12.5 11C12.5 12.1 13.4 13 14.5 13C15.6 13 16.5 12.1 16.5 11C16.5 10.5 16.4 10.1 16.2 9.7C17.6 11 18.5 12.9 18.5 15C18.5 18.6 15.6 21.5 12 21.5C8.4 21.5 5.5 18.6 5.5 15C5.5 12 7 9.5 9 7.5C9.5 9 10.5 9.5 11 9.5C11.5 9.5 12 9 12 8.5C12 7 10.5 6 10.5 4.5C10.5 3.5 11 2.5 12 2Z" fill={color}/>
    </svg>
  ),
  ChevronDown: ({ size = 20, color = '#828282', up = false }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ transform: up ? 'rotate(180deg)' : 'none', transition: 'transform 200ms ease' }}>
      <path d="M6 9L12 15L18 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Burger: ({ size = 22, color = '#fff' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 7H20 M4 12H20 M4 17H20" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Bell: ({ size = 22, color = '#fff' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M6 8C6 4.5 8.5 2.5 12 2.5C15.5 2.5 18 4.5 18 8V13L20 16H4L6 13V8Z" stroke={color} strokeWidth="1.6" strokeLinejoin="round"/>
      <path d="M10 19C10 20.1 10.9 21 12 21C13.1 21 14 20.1 14 19" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  TrendUp: ({ size=10, color='#00dd70' }) => (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none">
      <path d="M5 1L9 8H1L5 1Z" fill={color}/>
    </svg>
  ),
  TrendDown: ({ size=10, color='#d71920' }) => (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none">
      <path d="M5 9L9 2H1L5 9Z" fill={color}/>
    </svg>
  ),
  LiveDot: ({ size=10 }) => (
    <span style={{
      width: size, height: size, borderRadius: 99,
      background: '#00dd70', display:'inline-block',
      boxShadow:'0 0 0 0 rgba(0,221,112,0.6)',
      animation:'kto-pulse 1.6s ease-out infinite',
    }}/>
  ),
};

// ========== FLAG (CSS-drawn ovals to avoid emoji slop) ==========
function Flag({ code = 'intl', size = 22 }) {
  const f = window.FLAGS[code] || window.FLAGS.intl;
  // We use a simple two-tone rounded circle to feel like the Figma flag chips.
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: f.bg, position:'relative', overflow:'hidden',
      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.4)',
      flex: '0 0 auto',
    }}>
      <div style={{
        position:'absolute', inset:0,
        background: `linear-gradient(180deg, transparent 33%, ${f.stripe} 33%, ${f.stripe} 66%, transparent 66%)`,
        opacity: 0.85,
      }}/>
      {/* tiny white star/highlight to suggest detail */}
      <div style={{ position:'absolute', top: '50%', left:'50%', width: 4, height: 4, transform:'translate(-50%, -50%)', background: code === 'us' ? '#fff' : (code === 'br' ? '#fedd00' : 'transparent'), borderRadius:'50%' }}/>
    </div>
  );
}

// ========== STATUS BAR ==========
function StatusBar() {
  return (
    <div style={{
      height: 44, padding: '0 24px', display:'flex',
      justifyContent:'space-between', alignItems:'center',
      fontSize: 15, fontWeight: 600, color: '#fff', flex:'0 0 auto',
    }}>
      <span>20:34</span>
      <div style={{ display:'flex', gap: 6, alignItems:'center' }}>
        <svg width="18" height="11" viewBox="0 0 18 11" fill="none"><rect x="0" y="3" width="3" height="8" rx="1" fill="#fff"/><rect x="5" y="2" width="3" height="9" rx="1" fill="#fff"/><rect x="10" y="1" width="3" height="10" rx="1" fill="#fff"/><rect x="15" y="0" width="3" height="11" rx="1" fill="#fff"/></svg>
        <svg width="16" height="11" viewBox="0 0 16 11" fill="none"><path d="M8 2.5C10 2.5 11.8 3.3 13 4.6L14.5 3.1C12.7 1.3 10.4 0.4 8 0.4C5.6 0.4 3.3 1.3 1.5 3.1L3 4.6C4.2 3.3 6 2.5 8 2.5Z M8 6C9 6 9.8 6.4 10.4 7L12 5.4C10.9 4.3 9.5 3.7 8 3.7C6.5 3.7 5.1 4.3 4 5.4L5.6 7C6.2 6.4 7 6 8 6Z M8 8.5L10 10.5L8 12.5L6 10.5L8 8.5Z" fill="#fff"/></svg>
        <div style={{ width:24, height: 11, border: '1px solid #fff', borderRadius: 3, position:'relative', padding: 1 }}>
          <div style={{ width: '85%', height: '100%', background: '#fff', borderRadius: 1 }}/>
          <div style={{ position:'absolute', right:-3, top:3, width: 2, height: 5, background:'#fff', borderRadius:1 }}/>
        </div>
      </div>
    </div>
  );
}

// ========== TOP HEADER (KTO logo + balance + nav) ==========
function TopHeader({ pinnedCount }) {
  return (
    <div style={{
      height: 56, padding: '0 12px', display:'flex',
      alignItems:'center', justifyContent:'space-between',
      background:'#000', borderBottom:'1px solid #1e1e1e', flex:'0 0 auto',
    }}>
      <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
        <button style={btn('icon')}><Icon.Burger /></button>
        <button style={{ ...btn('icon'), gap: 2, paddingRight: 6 }}>
          <Icon.Bell size={20}/>
          <span style={{ fontSize: 13, color:'#fff', fontWeight: 500 }}>3</span>
          <Icon.ChevronDown size={14}/>
        </button>
      </div>
      <img src={window.__resources.logoKto} alt="KTO" style={{ height: 22 }}/>
      <div style={{ display:'flex', alignItems:'center', gap: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color:'#fff' }}>R$ 3.300,00</span>
        <div style={{
          width: 24, height: 24, borderRadius:'50%', background:'#00dd70',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize: 14, fontWeight: 800, color: '#000',
        }}>$</div>
      </div>
    </div>
  );
}

function btn(kind) {
  if (kind === 'icon') return {
    background:'transparent', border:'none', color:'#fff',
    display:'flex', alignItems:'center', gap: 4, padding:'6px 4px',
    cursor:'pointer', borderRadius: 6,
  };
  return {};
}

// ========== TAB CHIPS (Pin / Hottest / Football / Tennis / Basketball / Volleyball) ==========
function TabChips({ tabs, active, onChange, pinnedCount }) {
  const ref = useRef(null);
  return (
    <div style={{
      display:'flex', gap: 8, padding: '8px 12px',
      overflowX: 'auto', scrollbarWidth:'none', flex:'0 0 auto',
      background:'#000', borderBottom:'1px solid #1e1e1e',
    }} ref={ref}>
      {tabs.map(t => {
        const isActive = t.id === active;
        const isPin = t.id === 'pin';
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            style={{
              display:'flex', alignItems:'center', gap: 6,
              padding: '0 10px', height: 36,
              borderRadius: 12,
              border: isActive ? '1px solid rgba(0,221,112,0.3)' : '1px solid #1e1e1e',
              background: isActive ? 'rgba(0,221,112,0.18)' : 'transparent',
              color: isActive ? '#00dd70' : '#fff',
              fontFamily:'Inter', fontSize: 14, fontWeight: 500,
              cursor:'pointer', whiteSpace:'nowrap', flex:'0 0 auto',
              transition:'background 180ms ease, color 180ms ease, border-color 180ms ease',
            }}
          >
            {isPin && t.icon ? <t.icon size={18} color="#fad749" /> : null}
            <span>{t.label}</span>
            {isPin && (
              <span style={{
                minWidth: 18, height: 18, padding:'0 5px', borderRadius: 99,
                background: pinnedCount > 0 ? '#fad749' : '#3c3c3c',
                color: pinnedCount > 0 ? '#000' : '#828282',
                fontSize: 11, fontWeight: 800,
                display:'inline-flex', alignItems:'center', justifyContent:'center',
                transition:'background 200ms, color 200ms, transform 220ms cubic-bezier(.2,1.2,.4,1)',
                transform: pinnedCount > 0 ? 'scale(1)' : 'scale(0.95)',
              }}>{pinnedCount}</span>
            )}
            {!isPin && t.count != null && (
              <span style={{ display:'none' }}>{t.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ========== EVENT CARD ==========
function EventCard({ event, isPinned, onTogglePin, isPinning, isLast }) {
  const sport = window.SPORTS[event.sport];
  const [oddsFlash, setOddsFlash] = useState({});

  return (
    <div
      data-event-id={event.id}
      style={{
        position:'relative',
        background:'#1e1e1e',
        padding: '10px 12px 12px',
        display:'flex', flexDirection:'column', gap: 6,
        borderRadius: isLast ? '0 0 12px 12px' : 0,
        borderBottom: isLast ? 'none' : '2px solid #000',
        opacity: isPinning ? 0 : 1,
        transition: 'opacity 150ms ease',
      }}
    >
      {/* top row: live + minute + league */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', fontSize: 11, color:'#828282' }}>
        <div style={{ display:'flex', alignItems:'center', gap: 6 }}>
          <Icon.LiveDot size={6}/>
          <span style={{ color:'#00dd70', fontWeight: 700, fontSize: 11, letterSpacing: 0.3 }}>LIVE</span>
          <span style={{ color:'#00dd70', fontWeight: 600, fontSize: 11 }}>{event.live.minute}</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap: 6 }}>
          <span style={{ fontSize: 11, color:'#828282' }}>{event.league}</span>
        </div>
      </div>

      {/* participants + score */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap: 4, marginTop: 2 }}>
        <div style={{ display:'flex', flexDirection:'column', gap: 4 }}>
          <ParticipantRow name={event.home.name} sport={event.sport}/>
          <ParticipantRow name={event.away.name} sport={event.sport}/>
        </div>
        <ScoreColumn event={event}/>
      </div>

      {/* market label + fomo */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop: 4 }}>
        <span style={{ fontSize: 12, color:'#828282' }}>{event.market}</span>
        <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
          {event.fomo === 'Trending' && <Fomo color="#00dd70" label="Trending" icon="trend"/>}
          {event.fomo === 'Hot' && <Fomo color="#fad749" label="Hot" icon="hot"/>}
          {/* PIN BUTTON */}
          <button
            onClick={(e) => { e.stopPropagation(); onTogglePin(event.id); }}
            aria-label={isPinned ? 'Unpin event' : 'Pin event'}
            style={{
              width: 28, height: 28, borderRadius: 8,
              background: isPinned ? 'rgba(250,215,73,0.15)' : 'transparent',
              border: isPinned ? '1px solid rgba(250,215,73,0.4)' : '1px solid #323232',
              display:'flex', alignItems:'center', justifyContent:'center',
              cursor: 'pointer', padding: 0,
              transition:'background 180ms, border-color 180ms, transform 180ms',
            }}
          >
            <Icon.Pin filled={isPinned} size={15} color={isPinned ? '#fad749' : '#828282'}/>
          </button>
        </div>
      </div>

      {/* odds row */}
      <div style={{ display:'grid', gridTemplateColumns: event.twoWay ? '1fr 1fr' : '1fr 1fr 1fr', gap: 6, marginTop: 2 }}>
        {event.odds.map((o, i) => (
          <OddsButton key={i} odds={o} twoWay={event.twoWay}/>
        ))}
      </div>
    </div>
  );
}

function ParticipantRow({ name, sport }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
      <span style={{ fontSize: 13, color:'#fff', fontWeight: 500 }}>{name}</span>
    </div>
  );
}

function ScoreColumn({ event }) {
  if (event.home.sets) {
    // tennis / volleyball
    const h = event.home, a = event.away;
    return (
      <div style={{ display:'grid', gridTemplateColumns:`repeat(${h.sets.length}, 18px)`, gap: 2, alignItems:'center', fontFamily:'Inter', fontSize: 13, fontWeight: 700, color:'#00dd70' }}>
        {h.sets.map((s, i) => (
          <span key={'h'+i} style={{ textAlign:'center', color: '#00dd70' }}>{s}</span>
        ))}
        {a.sets.map((s, i) => (
          <span key={'a'+i} style={{ textAlign:'center', color: '#00dd70' }}>{s}</span>
        ))}
      </div>
    );
  }
  return (
    <div style={{ display:'flex', flexDirection:'column', gap: 4, alignItems:'flex-end', fontFamily:'Inter', fontSize: 14, fontWeight: 700, color:'#00dd70', minWidth: 18 }}>
      <span>{event.home.score}</span>
      <span>{event.away.score}</span>
    </div>
  );
}

function Fomo({ color, label, icon }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap: 4, color, fontSize: 11, fontWeight: 600 }}>
      {icon === 'trend' && <Icon.TrendUp color={color}/>}
      {icon === 'hot' && <Icon.Hot color={color} size={12}/>}
      {icon === 'boost' && <span style={{ fontSize: 9, fontWeight: 800, padding:'1px 4px', background: color, color: '#000', borderRadius: 3 }}>×2</span>}
      <span>{label}</span>
    </div>
  );
}

function OddsButton({ odds, twoWay }) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        height: 38, borderRadius: 6,
        background:'#323232', border:'none',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding: '0 10px', color:'#fff', cursor:'pointer',
        transition:'transform 100ms ease, background 150ms ease',
        transform: pressed ? 'scale(0.97)' : 'scale(1)',
      }}
    >
      <span style={{ fontSize: 11, color:'#828282', fontWeight: 500, textOverflow:'ellipsis', overflow:'hidden', whiteSpace:'nowrap', flex:1, textAlign:'left' }}>
        {twoWay ? odds.label : odds.label}
      </span>
      <span style={{ display:'inline-flex', alignItems:'center', gap: 4, fontSize: 14, fontWeight: 700, color: '#fad749' }}>
        {odds.trend === 'up' && <Icon.TrendUp color="#fad749"/>}
        {odds.trend === 'down' && <Icon.TrendDown color="#fad749"/>}
        {odds.price}
      </span>
    </button>
  );
}

// ========== SECTION HEADER (Pinned / Popular) ==========
function SectionHeader({ icon, title, count, allOpen, onToggleAll }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 4px 6px' }}>
      <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
        {icon}
        <span style={{ fontSize: 17, fontWeight: 700, color:'#fff' }}>{title}</span>
        {count != null && <span style={{ fontSize: 13, color:'#828282', fontWeight: 500 }}>{count}</span>}
      </div>
      {onToggleAll ? (
        <button
          onClick={onToggleAll}
          aria-label={allOpen ? 'Collapse all' : 'Expand all'}
          style={{
            background:'transparent', border:'none', padding: 4,
            display:'flex', alignItems:'center', justifyContent:'center',
            cursor:'pointer', color:'#fff',
          }}
        >
          <img
            src={allOpen ? window.__resources.iconCloseAll : window.__resources.iconOpenAll}
            width="27" height="27" alt=""
            style={{ display:'block' }}
          />
        </button>
      ) : (
        <Icon.ChevronDown size={20} up/>
      )}
    </div>
  );
}

// ========== EMPTY STATE ==========
function EmptyState({ message, hint }) {
  return (
    <div style={{
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      gap: 14, padding: '80px 24px', textAlign:'center',
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        background:'#1e1e1e', display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <Icon.Pin filled size={26} color="#fad749"/>
      </div>
      <div style={{ fontSize: 17, fontWeight: 700, color:'#fff' }}>{message}</div>
      <div style={{ fontSize: 13, color:'#828282', maxWidth: 240 }}>{hint}</div>
    </div>
  );
}

window.UI = {
  Icon, Flag, StatusBar, TopHeader, TabChips, EventCard, SectionHeader, EmptyState,
};

// ========== LEAGUE ACCORDION ==========
function LeagueAccordion({ league, country, count, expanded, onToggle, children }) {
  return (
    <div style={{ borderRadius: 12, overflow:'hidden', background:'#1e1e1e', marginBottom: 8 }}>
      <button
        onClick={onToggle}
        style={{
          width:'100%', height: 44, padding: '0 12px',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          background:'transparent', border:'none', cursor:'pointer',
          color:'#fff', textAlign:'left',
        }}
      >
        <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
          <Flag code={country || 'intl'} size={20}/>
          <span style={{ fontSize: 14, fontWeight: 600, color:'#fff' }}>{league}</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
          <span style={{ fontSize: 13, color:'#828282' }}>{count}</span>
          <Icon.ChevronDown size={18} up={expanded}/>
        </div>
      </button>
      {expanded && <div style={{ height: 2, background: '#000' }}/>}
      {expanded && children}
    </div>
  );
}

window.UI.LeagueAccordion = LeagueAccordion;
