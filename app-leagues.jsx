// app-leagues.jsx — Live Lobby Pinning prototype with LEAGUE pinning
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
@keyframes kto-pin-pop { 0%{transform:scale(1);} 35%{transform:scale(1.35) rotate(-12deg);} 70%{transform:scale(0.92) rotate(6deg);} 100%{transform:scale(1) rotate(0);} }
.kto-pin-pop { animation: kto-pin-pop 360ms cubic-bezier(.2,1.2,.4,1); }
@keyframes kto-toast-in { from{opacity:0; transform: translate(-50%, 12px);} to{opacity:1; transform: translate(-50%, 0);} }
.scroll-area::-webkit-scrollbar { width: 0; }
`;
document.head.appendChild(styleEl);

const TABS = [
  { id: 'pin',        label: 'Pin',        icon: ({size, pinnedCount}) => <Icon.Pin filled={pinnedCount > 0} size={size}/> },
  { id: 'football',   label: 'Football',   icon: Icon.Football, count: 5 },
  { id: 'tennis',     label: 'Tennis',     icon: Icon.Tennis, count: 3 },
  { id: 'basketball', label: 'Basketball', icon: Icon.Basketball, count: 2 },
  { id: 'volleyball', label: 'Volleyball', icon: Icon.Volleyball, count: 1 },
];

// Pinned events float to the top WITHIN their own league.
function renderLeagueGroups(items, scopeKey, ctx) {
  const { pinnedIds, pinnedLeagues, handleTogglePin, handleToggleLeaguePin, cardRefs, leagueRefs, collapsedLeagues, toggleLeague, hidePinnedLeagues } = ctx;
  if (items.length === 0) {
    return { node: (
      <div style={{ padding: 40, textAlign:'center', color:'#828282', fontSize: 13 }}>
        No events available
      </div>
    ), leagueKeys: [] };
  }
  const seen = new Map();
  for (const e of items) {
    if (!seen.has(e.league)) seen.set(e.league, []);
    seen.get(e.league).push(e);
  }
  let groups = [...seen.entries()].map(([league, evs]) => ({
    league,
    country: window.LEAGUES[league]?.country || evs[0]?.flag || 'intl',
    events: evs,
  }));
  if (hidePinnedLeagues) {
    groups = groups.filter(g => !pinnedLeagues.includes(g.league));
  }
  // sort each group: pinned events first, then rest
  groups.forEach(g => {
    g.events = [
      ...g.events.filter(e => pinnedIds.includes(e.id)),
      ...g.events.filter(e => !pinnedIds.includes(e.id)),
    ];
  });

  const leagueKeys = groups.map(g => `${scopeKey}::${g.league}`);

  const node = groups.map(g => {
    const key = `${scopeKey}::${g.league}`;
    const isCollapsed = collapsedLeagues.has(key);
    const isLeaguePinned = pinnedLeagues.includes(g.league);
    return (
      <div key={key} ref={node => { if (node) leagueRefs.current[g.league] = node; }}>
        <window.UI.LeagueAccordion
          league={g.league}
          country={g.country}
          count={g.events.length}
          expanded={!isCollapsed}
          onToggle={() => toggleLeague(key)}
          isPinned={isLeaguePinned}
          onTogglePin={handleToggleLeaguePin ? () => handleToggleLeaguePin(g.league) : null}
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
      </div>
    );
  });
  return { node, leagueKeys };
}

function App() {
  const [events] = useState(() => window.INITIAL_EVENTS);
  const [pinnedIds, setPinnedIds] = useState([]);
  const [pinnedLeagues, setPinnedLeagues] = useState([]); // ordered: most recent first
  const [activeTab, setActiveTab] = useState('football');
  const [toast, setToast] = useState(null);
  const [collapsedLeagues, setCollapsedLeagues] = useState(() => new Set());

  const cardRefs = useRef({});
  const leagueRefs = useRef({});
  const scrollRef = useRef(null);

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
      if (allOpen) leagueKeys.forEach(k => next.add(k));
      else leagueKeys.forEach(k => next.delete(k));
      return next;
    });
  }, []);

  // Pin event: keep within its league, move to top of that league. Use FLIP.
  const handleTogglePin = useCallback((id) => {
    const isPinned = pinnedIds.includes(id);
    if (isPinned) {
      setPinnedIds(ids => ids.filter(x => x !== id));
      setToast({ kind: 'unpin', text: 'Removed from Pinned' });
      return;
    }
    const node = cardRefs.current[id];
    const fromRect = node?.getBoundingClientRect();
    setPinnedIds(ids => [id, ...ids]);
    setToast({ kind: 'pin', text: 'Pinned to top of league' });
    if (!fromRect) return;
    requestAnimationFrame(() => {
      const newNode = cardRefs.current[id];
      if (!newNode) return;
      const toRect = newNode.getBoundingClientRect();
      const dy = fromRect.top - toRect.top;
      if (Math.abs(dy) < 2) return;
      newNode.style.transform = `translateY(${dy}px)`;
      newNode.style.transition = 'none';
      newNode.style.zIndex = '5';
      newNode.style.boxShadow = '0 12px 32px rgba(0,0,0,0.6)';
      void newNode.offsetWidth;
      newNode.style.transition = 'transform 520ms cubic-bezier(.2,.9,.2,1), box-shadow 600ms ease';
      newNode.style.transform = 'translateY(0)';
      const cleanup = () => {
        newNode.style.transition = ''; newNode.style.transform = '';
        newNode.style.zIndex = ''; newNode.style.boxShadow = '';
        newNode.removeEventListener('transitionend', cleanup);
      };
      newNode.addEventListener('transitionend', cleanup);
      setTimeout(cleanup, 700);
    });
  }, [pinnedIds]);

  const handleToggleLeaguePin = useCallback((league) => {
    const isPinned = pinnedLeagues.includes(league);
    if (isPinned) {
      setPinnedLeagues(ls => ls.filter(x => x !== league));
      setToast({ kind: 'unpin', text: 'League unpinned' });
      return;
    }
    setPinnedLeagues(ls => [league, ...ls]);
    setToast({ kind: 'pin', text: 'League pinned' });
  }, [pinnedLeagues]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1600);
    return () => clearTimeout(t);
  }, [toast]);

  const totalPinnedCount = pinnedIds.length + pinnedLeagues.length;
  const showingPinTab = activeTab === 'pin';

  // visible events for current sport tab
  const visibleEvents = useMemo(() => {
    if (showingPinTab) return [];
    return events.filter(e => e.sport === activeTab);
  }, [events, activeTab, showingPinTab]);

  return (
    <IOSFrame>
      <div style={{
        height:'100%', display:'flex', flexDirection:'column',
        background:'#000', color:'#fff', overflow:'hidden', position:'relative',
      }}>
        <TopHeader pinnedCount={totalPinnedCount}/>
        <TabChips
          tabs={TABS}
          active={activeTab}
          onChange={setActiveTab}
          pinnedCount={totalPinnedCount}
        />

        <div
          ref={scrollRef}
          className="scroll-area"
          style={{ flex: 1, overflowY:'auto', padding:'4px 8px 80px', scrollbarWidth:'none' }}
        >
          {/* PIN TAB: pinned leagues replace events — all events of pinned leagues + individually pinned events under their league */}
          {showingPinTab && totalPinnedCount === 0 && (
            <EmptyState
              message="No Pinned events or leagues"
              hint="Tap the pin icon on a league header or event to pin it here."
            />
          )}

          {showingPinTab && totalPinnedCount > 0 && (() => {
            // gather all events from pinned leagues + individually pinned events whose league isn't already pinned
            const fromLeagues = events.filter(e => pinnedLeagues.includes(e.league));
            const fromEvents = events.filter(e => pinnedIds.includes(e.id) && !pinnedLeagues.includes(e.league));
            const merged = [...fromLeagues, ...fromEvents];
            // group by sport, preserve sport order from TABS
            const sportOrder = ['football','tennis','basketball','volleyball'];
            const sportGroups = sportOrder
              .map(sport => ({ sport, items: merged.filter(e => e.sport === sport) }))
              .filter(g => g.items.length > 0);

            return sportGroups.map(g => {
              const grp = renderLeagueGroups(g.items, `pin-${g.sport}`, {
                pinnedIds, pinnedLeagues, handleTogglePin, handleToggleLeaguePin,
                cardRefs, leagueRefs, collapsedLeagues, toggleLeague,
              });
              const allOpen = grp.leagueKeys.every(k => !collapsedLeagues.has(k));
              return (
                <React.Fragment key={g.sport}>
                  <SectionHeader
                    icon={
                      g.sport === 'football' ? <img src="assets/icon-soccer.svg" width="20" height="20" alt=""/> :
                      g.sport === 'tennis' ? <img src="assets/icon-tennis.svg" width="20" height="20" alt=""/> :
                      g.sport === 'basketball' ? <img src="assets/icon-basketball.svg" width="20" height="20" alt=""/> :
                      g.sport === 'volleyball' ? <img src="assets/icon-baseball.svg" width="20" height="20" alt=""/> : null
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

          {/* SPORT TAB */}
          {!showingPinTab && (() => {
            // Pinned-leagues block at the top (within current sport)
            const pinnedLeaguesInSport = pinnedLeagues.filter(l =>
              events.some(e => e.league === l && e.sport === activeTab)
            );
            const pinnedLeagueEvents = visibleEvents.filter(e => pinnedLeagues.includes(e.league));
            const restEvents = visibleEvents; // accordion render filters out pinned leagues

            const pinnedGrp = pinnedLeaguesInSport.length > 0
              ? renderLeagueGroups(pinnedLeagueEvents, `${activeTab}-pinned`, {
                  pinnedIds, pinnedLeagues, handleTogglePin, handleToggleLeaguePin,
                  cardRefs, leagueRefs, collapsedLeagues, toggleLeague,
                })
              : null;

            const restGrp = renderLeagueGroups(restEvents, activeTab, {
              pinnedIds, pinnedLeagues, handleTogglePin, handleToggleLeaguePin,
              cardRefs, leagueRefs, collapsedLeagues, toggleLeague,
              hidePinnedLeagues: true,
            });

            const allRestOpen = restGrp.leagueKeys.every(k => !collapsedLeagues.has(k));

            return (
              <>
                {pinnedGrp && (
                  <>
                    <SectionHeader
                      icon={<Icon.Pin filled size={20} color="#fad749"/>}
                      title="Pinned"
                      count={pinnedLeagueEvents.length}
                    />
                    {pinnedGrp.node}
                  </>
                )}
                <SectionHeader
                  icon={
                    activeTab === 'football' ? <img src="assets/icon-soccer.svg" width="20" height="20" alt=""/> :
                    activeTab === 'tennis' ? <img src="assets/icon-tennis.svg" width="20" height="20" alt=""/> :
                    activeTab === 'basketball' ? <img src="assets/icon-basketball.svg" width="20" height="20" alt=""/> :
                    activeTab === 'volleyball' ? <img src="assets/icon-baseball.svg" width="20" height="20" alt=""/> : null
                  }
                  title={TABS.find(t => t.id === activeTab)?.label || ''}
                  count={restEvents.filter(e => !pinnedLeagues.includes(e.league)).length}
                  allOpen={allRestOpen}
                  onToggleAll={() => toggleAllInScope(restGrp.leagueKeys)}
                />
                {restGrp.node}
              </>
            );
          })()}
        </div>

        {toast && (
          <div style={{
            position:'absolute', left:'50%', bottom: 24, transform:'translateX(-50%)',
            background:'#1e1e1e', border:'1px solid #323232', padding:'10px 14px', borderRadius: 99,
            display:'flex', alignItems:'center', gap: 8, color:'#fff', fontSize: 13, fontWeight: 500,
            boxShadow:'0 8px 24px rgba(0,0,0,0.6)',
            animation:'kto-toast-in 220ms cubic-bezier(.2,1.2,.4,1)', zIndex: 20,
          }}>
            <Icon.Pin filled size={14} color={toast.kind === 'pin' ? '#fad749' : '#828282'}/>
            <span>{toast.text}</span>
          </div>
        )}
      </div>
    </IOSFrame>
  );
}

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
