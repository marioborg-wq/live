/* global React, KIcon, SectionHeading, MultiplasRow, HotEventCard, StdEventCard,
   FomoBanner, HOT_EVENTS, SECONDARY_EVENTS, FOMO_GRADIENTS, SportBall */

function HotTab({ mode, tweaks, selection, onSelect }) {
  const events = window.HOT_EVENTS.mixed;
  const sec    = window.SECONDARY_EVENTS;
  const limit  = tweaks.maxHot || 3;

  // 3 modes: "mixed" (default Hot tab), "football", "basketball"
  let primary, primaryTitle, primarySport;
  if (mode === "football") {
    primary = events.filter(e => e.sport === "fb").slice(0, 1);
    primaryTitle = "Hottest Now";
    primarySport = "football";
  } else if (mode === "basketball") {
    primary = events.filter(e => e.sport === "bb").slice(0, 1);
    primaryTitle = "Hottest Now";
    primarySport = "basketball";
  } else {
    primary = events.slice(0, limit);
    primaryTitle = "Hottest Now";
    primarySport = "hot";
  }

  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: 10,
      padding: "8px 8px 24px",
    }}>
      {/* HOTTEST NOW section */}
      <div>
        <SectionHeading
          title={primaryTitle}
          sport={primarySport}
          refreshing
          badge={tweaks.showBadge ? "AUTO · TOP 5" : null}
        />
        <MultiplasRow/>
        <div style={{ display: "flex", flexDirection: "column", gap: tweaks.cardGap || 10, paddingTop: 4 }}>
          {primary.map(ev => (
            <div key={ev.id} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {tweaks.fomoStyle !== "none" && (
                <FomoBanner
                  message={ev.fomoMessage}
                  variant={tweaks.fomoColor}
                  marquee={tweaks.fomoStyle === "marquee"}
                />
              )}
              <HotEventCard
                event={ev}
                glow={tweaks.cardGlow}
                showVelocity={tweaks.showVelocity}
                selection={selection}
                onSelect={onSelect}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Secondary sport block */}
      {mode === "basketball" ? (
        <SportBlock
          title="Basketball" sport="basketball" code="bb"
          items={sec.bb} selection={selection} onSelect={onSelect}
        />
      ) : (
        <SportBlock
          title="Football" sport="football" code="fb"
          items={sec.fb.slice(0, mode === "football" ? 2 : 2)}
          selection={selection} onSelect={onSelect}
        />
      )}
    </div>
  );
}

function SportBlock({ title, sport, code, items, selection, onSelect }) {
  return (
    <div>
      <SectionHeading title={title} sport={sport}/>
      <MultiplasRow/>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 4 }}>
        {items.map(ev => (
          <StdEventCard key={ev.id} event={ev} selection={selection} onSelect={onSelect}/>
        ))}
      </div>
    </div>
  );
}

window.HotTab = HotTab;
window.SportBlock = SportBlock;
