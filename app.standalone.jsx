// app.jsx — Live Lobby Pinning prototype
const { useState, useEffect, useRef, useLayoutEffect, useMemo, useCallback } = React;
const { Icon, Flag, StatusBar, TopHeader, TabChips, EventCard, SectionHeader, EmptyState, LeagueAccordion } = window.UI;

// ========== global keyframes / styles ==========
const styleEl = document.createElement('style');
styleEl.textContent = `
@keyframes kto-pulse {
  0% { box-shadow: 0 0 0 0 rgba(0,221,112,0.55); }
  70% { box-shadow: 0 0 0 6px rgba(0,221,112,0); }
  100% { box-shadow: 0 0 0 0 rgba(0,221,112,0); }
}
@keyframes kto-pin-pop {
  0% { transform: scale(1); }
  35% { transform: scale(1.35) rotate(-12deg); }
  70% { transform: scale(0.92) rotate(6deg); }
  100% { transform: scale(1) rotate(0); }
}
.kto-pin-pop { animation: kto-pin-pop 360ms cubic-bezier(.2,1.2,.4,1); }
@keyframes kto-flyup {
  0% { transform: translateY(var(--from)) scale(1); opacity: 0.95; }
  60% { transform: translateY(calc(var(--to) * 1.04)) scale(1.01); }
  100% { transform: translateY(var(--to)) scale(1); opacity: 1; }
}
@keyframes kto-badge-bump {
  0% { transform: scale(1); }
  40% { transform: scale(1.45); }
  100% { transform: scale(1); }
}
.kto-badge-bump { animation: kto-badge-bump 320ms cubic-bezier(.2,1.4,.4,1); }
@keyframes kto-toast-in {
  from { opacity: 0; transform: translate(-50%, 12px); }
  to { opacity: 1; transform: translate(-50%, 0); }
}
.scroll-area::-webkit-scrollbar { width: 0; }
`;
document.head.appendChild(styleEl);

const TABS = [
  { id: 'pin',        label: 'Pin',        icon: ({size,color}) => <Icon.Pin filled size={size} color={color || '#fad749'}/> },
  { id: 'hottest',    label: 'Hottest',    icon: ({size,color}) => <Icon.Hot size={size} color={color === '#fff' ? '#fad749' : color}/> },
  { id: 'football',   label: 'Football',   icon: Icon.Football, count: 5 },
  { id: 'tennis',     label: 'Tennis',     icon: Icon.Tennis, count: 3 },
  { id: 'basketball', label: 'Basketball', icon: Icon.Basketball, count: 2 },
  { id: 'volleyball', label: 'Volleyball', icon: Icon.Volleyball, count: 1 },
];

// ========== helper: group events by league + render accordions ==========
function renderLeagueGroups(items, scopeKey, ctx) {
  const { pinnedIds, handleTogglePin, cardRefs, collapsedLeagues, toggleLeague } = ctx;
  if (items.length === 0) {
    return { node: (
      <div style={{ padding: 40, textAlign:'center', color:'#828282', fontSize: 13 }}>
        No events available
      </div>
    ), leagueKeys: [] };
  }
  // group preserving first-seen order
  const seen = new Map();
  for (const e of items) {
    if (!seen.has(e.league)) seen.set(e.league, []);
    seen.get(e.league).push(e);
  }
  const groups = [...seen.entries()].map(([league, evs]) => ({
    league,
    country: window.LEAGUES[league]?.country || evs[0]?.flag || 'intl',
    events: evs,
  }));
  const leagueKeys = groups.map(g => `${scopeKey}::${g.league}`);

  const node = groups.map(g => {
    const key = `${scopeKey}::${g.league}`;
    const isCollapsed = collapsedLeagues.has(key);
    return (
      <window.UI.LeagueAccordion
        key={key}
        league={g.league}
        country={g.country}
        count={g.events.length}
        expanded={!isCollapsed}
        onToggle={() => toggleLeague(key)}
      >
        <div>
          {g.events.map((e, i) => (
            <div key={e.id} ref={node => { if (node) cardRefs.current[e.id] = node; }}>
              <window.UI.EventCard
                event={e}
                isPinned={pinnedIds.includes(e.id)}
                onTogglePin={handleTogglePin}
                isLast={i === g.events.length - 1}
              />
            </div>
          ))}
        </div>
      </window.UI.LeagueAccordion>
    );
  });
  return { node, leagueKeys };
}

function App() {
  const [events, setEvents] = useState(() => window.INITIAL_EVENTS);
  const [pinnedIds, setPinnedIds] = useState([]); // ordered: most recent first
  const [activeTab, setActiveTab] = useState('hottest');
  const [animatingId, setAnimatingId] = useState(null); // event currently flying
  const [badgeBump, setBadgeBump] = useState(0);
  const [toast, setToast] = useState(null);
  const [collapsedLeagues, setCollapsedLeagues] = useState(() => new Set()); // leagues that user collapsed

  const toggleLeague = useCallback((key) => {
    setCollapsedLeagues(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }, []);

  const toggleAllInScope = useCallback((leagueKeys) => {
    setCollapsedLeagues(prev => {
      const allOpen = leagueKeys.every(k => !prev.has(k));
      const next = new Set(prev);
      if (allOpen) {
        // close all in scope
        leagueKeys.forEach(k => next.add(k));
      } else {
        // open all in scope
        leagueKeys.forEach(k => next.delete(k));
      }
      return next;
    });
  }, []);

  // refs to event card DOM nodes by id, used to measure for FLIP anim
  const cardRefs = useRef({});
  const scrollRef = useRef(null);

  // filtered events shown in main list (for active tab, excluding "pin" view)
  const visibleEvents = useMemo(() => {
    if (activeTab === 'hottest') return events.filter(e => e.hot);
    if (activeTab === 'pin') return events.filter(e => pinnedIds.includes(e.id));
    return events.filter(e => e.sport === activeTab);
  }, [events, activeTab, pinnedIds]);

  // partition into pinned (in display order) + rest (in their natural order)
  const pinnedVisible = useMemo(
    () => pinnedIds.map(id => visibleEvents.find(e => e.id === id)).filter(Boolean),
    [pinnedIds, visibleEvents]
  );
  const restVisible = useMemo(
    () => visibleEvents.filter(e => !pinnedIds.includes(e.id)),
    [visibleEvents, pinnedIds]
  );

  // ========= PIN HANDLER WITH FLIP ANIMATION =========
  const handleTogglePin = useCallback((id) => {
    const isCurrentlyPinned = pinnedIds.includes(id);

    if (isCurrentlyPinned) {
      // unpin — simple no-anim removal
      setPinnedIds(ids => ids.filter(x => x !== id));
      setToast({ kind: 'unpin', text: 'Removed from Pinned' });
      return;
    }

    // 1. measure current rect of the tapped card
    const node = cardRefs.current[id];
    if (!node) {
      setPinnedIds(ids => [id, ...ids]);
      return;
    }
    const fromRect = node.getBoundingClientRect();

    // 2. apply state change (this re-renders with the card now at top)
    setPinnedIds(ids => [id, ...ids]);
    setBadgeBump(b => b + 1);
    setToast({ kind: 'pin', text: 'Pinned to top' });

    // 3. on next frame, measure new rect, apply FLIP transform, then animate to identity
    requestAnimationFrame(() => {
      const newNode = cardRefs.current[id];
      if (!newNode) return;
      const toRect = newNode.getBoundingClientRect();
      const dy = fromRect.top - toRect.top;
      if (Math.abs(dy) < 2) return;
      setAnimatingId(id);
      // Set start transform
      newNode.style.transform = `translateY(${dy}px)`;
      newNode.style.transition = 'none';
      newNode.style.zIndex = '5';
      newNode.style.boxShadow = '0 12px 32px rgba(0,0,0,0.6)';
      // Force reflow then animate to 0
      void newNode.offsetWidth;
      newNode.style.transition = 'transform 520ms cubic-bezier(.2,.9,.2,1), box-shadow 600ms ease';
      newNode.style.transform = 'translateY(0)';
      const cleanup = () => {
        newNode.style.transition = '';
        newNode.style.transform = '';
        newNode.style.zIndex = '';
        newNode.style.boxShadow = '';
        newNode.removeEventListener('transitionend', cleanup);
        setAnimatingId(null);
      };
      newNode.addEventListener('transitionend', cleanup);
      // safety fallback
      setTimeout(cleanup, 700);
    });
  }, [pinnedIds]);

  // toast auto-dismiss
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1600);
    return () => clearTimeout(t);
  }, [toast]);

  const pinnedCount = pinnedIds.length;
  const showingPinTab = activeTab === 'pin';

  return (
    <IOSFrame>
      <div style={{
        height:'100%', display:'flex', flexDirection:'column',
        background:'#000', color:'#fff', overflow:'hidden',
        position:'relative',
      }}>
        <TopHeader pinnedCount={pinnedCount}/>
        <TabChips
          tabs={TABS}
          active={activeTab}
          onChange={setActiveTab}
          pinnedCount={pinnedCount}
        />

        {/* SCROLL AREA */}
        <div
          ref={scrollRef}
          className="scroll-area"
          style={{
            flex: 1, overflowY:'auto', padding:'4px 8px 80px',
            scrollbarWidth:'none',
          }}
        >
          {showingPinTab && pinnedCount === 0 && (
            <EmptyState
              message="No Pinned events"
              hint="Tap the pin icon on any live event to pin it to the top of your lobby."
            />
          )}

          {/* GROUP-BY-SPORT RENDER for Pin + Hottest tabs */}
          {(showingPinTab || activeTab === 'hottest') && (() => {
            const list = showingPinTab
              ? pinnedIds.map(id => events.find(e => e.id === id)).filter(Boolean)
              : [
                  ...pinnedIds.filter(id => events.find(e => e.id === id && e.hot)).map(id => events.find(e => e.id === id)),
                  ...events.filter(e => e.hot && !pinnedIds.includes(e.id)),
                ];
            const order = activeTab === 'hottest'
              ? ['tennis','football','basketball','volleyball']
              : ['football','tennis','basketball','volleyball'];

            const groups = order
              .map(sport => ({ sport, items: list.filter(e => e.sport === sport) }))
              .filter(g => g.items.length > 0);

            return groups.map(g => {
              const grp = renderLeagueGroups(g.items, `${activeTab}-${g.sport}`, { pinnedIds, handleTogglePin, cardRefs, collapsedLeagues, toggleLeague });
              const allOpen = grp.leagueKeys.every(k => !collapsedLeagues.has(k));
              return (
              <React.Fragment key={g.sport}>
                <SectionHeader
                  icon={
                    g.sport === 'football' ? <img src={window.__resources.iconSoccer} width="20" height="20" alt=""/> :
                    g.sport === 'tennis' ? <img src={window.__resources.iconTennis} width="20" height="20" alt=""/> :
                    g.sport === 'basketball' ? <img src={window.__resources.iconBasketball} width="20" height="20" alt=""/> :
                    g.sport === 'volleyball' ? <img src={window.__resources.iconBaseball} width="20" height="20" alt=""/> :
                    null
                  }
                  title={window.SPORTS[g.sport]?.label || g.sport}
                  count={g.items.length}
                  allOpen={allOpen}
                  onToggleAll={() => toggleAllInScope(grp.leagueKeys)}
                />
                {grp.node}
              </React.Fragment>
              );
            });
          })()}

          {/* SINGLE-SPORT TAB RENDER (Football / Tennis / Basketball / Volleyball) */}
          {!showingPinTab && activeTab !== 'hottest' && (
            <>
              {pinnedVisible.length > 0 && (
                <>
                  <SectionHeader
                    icon={<Icon.Pin filled size={18} color="#fad749"/>}
                    title="Pinned"
                    count={pinnedVisible.length}
                  />
                  <div style={{ borderRadius: 12, overflow:'hidden', background:'#1e1e1e', marginBottom: 8 }}>
                    {pinnedVisible.map((e, i) => (
                      <div key={e.id} ref={node => { if (node) cardRefs.current[e.id] = node; }}>
                        <EventCard event={e} isPinned={true} onTogglePin={handleTogglePin} isLast={i === pinnedVisible.length - 1}/>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {(() => {
                const grp = renderLeagueGroups(restVisible, activeTab, { pinnedIds, handleTogglePin, cardRefs, collapsedLeagues, toggleLeague });
                const allOpen = grp.leagueKeys.every(k => !collapsedLeagues.has(k));
                return (
                  <>
                    <SectionHeader
                      icon={
                        activeTab === 'football' ? <img src={window.__resources.iconSoccer} width="20" height="20" alt=""/> :
                        activeTab === 'tennis' ? <img src={window.__resources.iconTennis} width="20" height="20" alt=""/> :
                        activeTab === 'basketball' ? <img src={window.__resources.iconBasketball} width="20" height="20" alt=""/> :
                        activeTab === 'volleyball' ? <img src={window.__resources.iconBaseball} width="20" height="20" alt=""/> :
                        null
                      }
                      title={TABS.find(t => t.id === activeTab)?.label || ''}
                      count={restVisible.length}
                      allOpen={allOpen}
                      onToggleAll={() => toggleAllInScope(grp.leagueKeys)}
                    />
                    {grp.node}
                  </>
                );
              })()}
            </>
          )}
        </div>

        {/* TOAST */}
        {toast && (
          <div style={{
            position:'absolute', left:'50%', bottom: 24,
            transform:'translateX(-50%)',
            background:'#1e1e1e', border:'1px solid #323232',
            padding:'10px 14px', borderRadius: 99,
            display:'flex', alignItems:'center', gap: 8,
            color:'#fff', fontSize: 13, fontWeight: 500,
            boxShadow:'0 8px 24px rgba(0,0,0,0.6)',
            animation:'kto-toast-in 220ms cubic-bezier(.2,1.2,.4,1)',
            zIndex: 20,
          }}>
            <Icon.Pin filled size={14} color={toast.kind === 'pin' ? '#fad749' : '#828282'}/>
            <span>{toast.text}</span>
          </div>
        )}
      </div>
    </IOSFrame>
  );
}

// ========== iOS frame wrapper (uses copied starter component) ==========
function IOSFrame({ children }) {
  const Frame = window.IOSDevice;
  if (!Frame) {
    return <div style={{ width: 390, height: 844, background:'#000', borderRadius: 36, overflow:'hidden' }}>{children}</div>;
  }
  return (
    <Frame width={390} height={844} dark>
      <div style={{ paddingTop: 50, height: '100%' }}>{children}</div>
    </Frame>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
