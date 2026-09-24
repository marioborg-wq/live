// Sample data for the Hot tab — modeled directly on the Figma frames.

window.SPORT_TABS = [
  { id: "pin",  label: "",          icon: "pin" },
  { id: "hot",  label: "Hot",       icon: "flame" },
  { id: "fb",   label: "Football",  icon: "football" },
  { id: "tn",   label: "Tennis",    icon: "tennis" },
  { id: "bb",   label: "Basketball",icon: "basketball" },
  { id: "vb",   label: "Volleyball",icon: "volleyball" },
  { id: "us",   label: "US Football",icon: "amfootball" },
];

// Each hot event has: liveStatus, league, country, sport, home/away (name, score, color),
// market, level (Sizzling/Trending), odds, fomoMessage (the "FOMO" headline above the card).
window.HOT_EVENTS = {
  mixed: [
    {
      id: "h-gre-fla",
      sport: "fb",
      league: "Copa Libertadores",
      country: "br",
      live: "2º TEMPO, 42'",
      kickoff: "Today 21:00",
      home: { name: "Grêmio",    short: "Grêmio",  score: 1, color: "#0093D0", colorTo: "#000" },
      away: { name: "Flamengo",  short: "Flamengo",score: 1, color: "#D00027", colorTo: "#000" },
      market: "Next Goal",
      level: "sizzling",
      betsLast5: 2143,
      fomoMessage: "GRÊMIO FIGHTING HARD FOR THE WIN!",
      odds: [
        { label: "Grêmio",   value: "1.89", trend: "up" },
        { label: "No goal",  value: "2.24" },
        { label: "Flamengo", value: "1.81", trend: "down" },
      ],
    },
    {
      id: "h-okc-ind",
      sport: "bb",
      league: "NBA",
      country: "us",
      live: "Q4 01:14",
      kickoff: "Today 21:00",
      home: { name: "Oklahoma City Thunder", short: "OKC",  score: 92, color: "#007AC1", colorTo: "#EF3B24" },
      away: { name: "Indiana Pacers",        short: "Pacers", score: 89, color: "#FDBB30", colorTo: "#002D62" },
      market: "Match Winner",
      level: "sizzling",
      betsLast5: 1847,
      fomoMessage: "AMAZING PACERS COME BACK IN FINAL MINUTES!",
      odds: [
        { label: "OKC",    value: "1.89" },
        { label: "Pacers", value: "1.92", trend: "up" },
      ],
    },
    {
      id: "h-sin-alc",
      sport: "tn",
      league: "Roland-Garros · QF",
      country: "fr",
      live: "SET 3 · GAME 5",
      kickoff: "Live",
      home: { name: "Jannik Sinner",  short: "Sinner",  score: "2", color: "#E2553A", colorTo: "#7A2010", setLine: "6 4 4" },
      away: { name: "Carlos Alcaraz", short: "Alcaraz", score: "1", color: "#D8B400", colorTo: "#5A4900", setLine: "3 6 5" },
      market: "Match Winner",
      level: "trending",
      betsLast5: 1612,
      fomoMessage: "ALCARAZ ONE BREAK FROM TURNING IT AROUND!",
      odds: [
        { label: "Sinner",  value: "1.42", trend: "down" },
        { label: "Alcaraz", value: "2.85", trend: "up" },
      ],
    },
    {
      id: "h-mci-ars",
      sport: "fb",
      league: "Premier League",
      country: "en",
      live: "2º TEMPO, 88'",
      kickoff: "Today 17:30",
      home: { name: "Man City", short: "Man City", score: 2, color: "#6CABDD", colorTo: "#1C2C5B" },
      away: { name: "Arsenal",  short: "Arsenal",  score: 2, color: "#EF0107", colorTo: "#063672" },
      market: "Next Goal",
      level: "sizzling",
      betsLast5: 1455,
      fomoMessage: "TWO MINUTES LEFT — ANYONE CAN WIN IT!",
      odds: [
        { label: "Man City", value: "3.40" },
        { label: "No goal",  value: "1.55", trend: "down" },
        { label: "Arsenal",  value: "4.10", trend: "up" },
      ],
    },
    {
      id: "h-djo-med",
      sport: "tn",
      league: "ATP Madrid · SF",
      country: "es",
      live: "SET 2 · TB",
      kickoff: "Live",
      home: { name: "Novak Djokovic",  short: "Djokovic",  score: "1", color: "#0033A0", colorTo: "#001A52" },
      away: { name: "Daniil Medvedev", short: "Medvedev",  score: "0", color: "#E10600", colorTo: "#700300" },
      market: "Set Winner",
      level: "trending",
      betsLast5: 1102,
      fomoMessage: "DJOKO PUSHED TO A TIE-BREAK FOR THE FIRST TIME!",
      odds: [
        { label: "Djokovic", value: "1.62" },
        { label: "Medvedev", value: "2.32", trend: "up" },
      ],
    },
  ],
};

// Football & Basketball events listed in the "Football"/"Football & Basketball"
// accordion-style sections below the Hot strip.
window.SECONDARY_EVENTS = {
  fb: [
    {
      id: "s-sao-tor",
      league: "Copa Sudamericana", country: "br",
      live: "2º TEMPO, 38'", kickoff: "Wed 18:00",
      home: { name: "São Paulo FC", short: "São Paulo", score: 2, color: "#E10600", colorTo: "#000" },
      away: { name: "Torque",       short: "Torque",    score: 0, color: "#000", colorTo: "#444" },
      market: "Match Winner", level: "sizzling", oddLabel: "Oddão 5",
      odds: [
        { label: "1", value: "1.60" },
        { label: "X", value: "3.80" },
        { label: "2", value: "5.20" },
      ],
    },
    {
      id: "s-atl-pue",
      league: "Copa Sudamericana", country: "br",
      live: "2º TEMPO, 35'", kickoff: "Today 21:00",
      home: { name: "Atlético Mineiro", short: "Atlético MG", score: 1, color: "#000", colorTo: "#FFFFFF" },
      away: { name: "Puerto Cabello",   short: "Puerto Cab.", score: 0, color: "#E10600", colorTo: "#000" },
      market: "Match Winner", level: "trending", oddLabel: "Oddão 1",
      odds: [
        { label: "1", value: "1.34" },
        { label: "X", value: "4.40" },
        { label: "2", value: "9.80" },
      ],
    },
    {
      id: "s-pal-flu",
      league: "Brasileirão Série A", country: "br",
      live: "1º TEMPO, 12'", kickoff: "Today 22:00",
      home: { name: "Palmeiras", short: "Palmeiras", score: 0, color: "#006437", colorTo: "#003319" },
      away: { name: "Fluminense", short: "Fluminense", score: 0, color: "#7E1830", colorTo: "#005D2D" },
      market: "Match Winner", level: null, oddLabel: null,
      odds: [
        { label: "1", value: "1.85" },
        { label: "X", value: "3.40" },
        { label: "2", value: "4.20" },
      ],
    },
  ],
  bb: [
    {
      id: "s-lal-bos",
      league: "NBA", country: "us",
      live: "Q3 08:22", kickoff: "Live",
      home: { name: "LA Lakers", short: "Lakers",  score: 78, color: "#552583", colorTo: "#FDB927" },
      away: { name: "Boston Celtics", short: "Celtics", score: 72, color: "#007A33", colorTo: "#BA9653" },
      market: "Match Winner", level: "trending", oddLabel: null,
      odds: [
        { label: "Lakers",  value: "2.10" },
        { label: "Celtics", value: "1.72" },
      ],
    },
    {
      id: "s-gsw-mia",
      league: "NBA", country: "us",
      live: "Q2 04:11", kickoff: "Live",
      home: { name: "Golden State", short: "Warriors",  score: 41, color: "#1D428A", colorTo: "#FFC72C" },
      away: { name: "Miami Heat",   short: "Heat",      score: 38, color: "#98002E", colorTo: "#F9A01B" },
      market: "Match Winner", level: null, oddLabel: null,
      odds: [
        { label: "Warriors", value: "1.55" },
        { label: "Heat",     value: "2.45" },
      ],
    },
  ],
};
