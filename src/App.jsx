import { useState, useEffect } from "react";
import { THEMES, THEME_IDS } from "./themes";

const C = {
  teal:   { bg:"#E1F5EE", border:"#5DCAA5", text:"#085041", mid:"#1D9E75" },
  purple: { bg:"#EEEDFE", border:"#AFA9EC", text:"#3C3489", mid:"#7F77DD" },
  amber:  { bg:"#FAEEDA", border:"#EF9F27", text:"#633806", mid:"#BA7517" },
  blue:   { bg:"#E6F1FB", border:"#85B7EB", text:"#0C447C", mid:"#378ADD" },
  coral:  { bg:"#FAECE7", border:"#F0997B", text:"#4A1B0C", mid:"#D85A30" },
};

const card = {
  background: "var(--color-background-primary)",
  border: "0.5px solid var(--color-border-tertiary)",
  borderRadius: 12,
  padding: "1rem 1.125rem",
};
const surface = {
  background: "var(--color-background-secondary)",
  borderRadius: 8,
  padding: "0.75rem 1rem",
};

const pill = (c, label) => (
  <span style={{
    background: c.bg, color: c.text,
    border: `0.5px solid ${c.border}`,
    borderRadius: 20, padding: "2px 10px",
    fontSize: 12, fontWeight: 500,
  }}>{label}</span>
);

const STEPS = [
  {
    icon: "1", color: C.purple,
    title: "Someone writes down a fact",
    plain: "Any person can submit a knowledge claim — like 'The boiling point of water at sea level is 100°C' — and point to sources that back it up. That's it. No special credentials required.",
    why: "Anyone can contribute. The more facts in the system, the more useful it is.",
  },
  {
    icon: "2", color: C.blue,
    title: "The system checks it — no humans involved",
    plain: "Software automatically asks three questions: Do the sources actually say this? Do other trusted sources agree? Do other verified facts in the database support it? The answers produce a single agreement score.",
    why: "There are no editors, no committees, no opinions. The score comes from evidence, not authority.",
  },
  {
    icon: "3", color: C.teal,
    title: "Businesses pay to look things up",
    plain: "AI companies, research tools, and apps pay a small fee each time they ask AXIOM for a verified fact — the same way you might pay to look something up in a professional database. No subscription. Pay per question.",
    why: "This is where real money enters the system. It comes from businesses, not from users.",
  },
  {
    icon: "4", color: C.amber,
    title: "The person who submitted the fact gets paid",
    plain: "Every time a business queries your fact, you automatically receive a small cut of their fee. You don't have to do anything — the protocol handles the split and sends it to your account.",
    why: "Your earnings grow as long as your fact keeps getting used. Submit once, earn forever.",
  },
  {
    icon: "5", color: C.coral,
    title: "The system finds its own gaps",
    plain: "Every hour, AXIOM checks which questions businesses are asking that no verified fact can answer. Those missing pieces become cash bounties, posted automatically and paid to whoever submits the verified answer first.",
    why: "The demand from real businesses tells the network exactly what to build next — no guesswork, no roadmap meetings.",
  },
];

const ROLES = [
  {
    role: "Contributor",
    tagline: "I share knowledge",
    color: C.purple,
    start: "You write facts, back them with sources, and collect a small fee every time a business looks that fact up.",
    actions: ["Write a fact and link your sources", "The system checks it automatically — no approval needed", "Earn a cut each time a business queries your fact"],
    earn: "A share of the fee each time your fact is queried",
    risk: "Low — a weak submission just scores low and earns little. No penalty.",
  },
  {
    role: "Staker",
    tagline: "I back other facts",
    color: C.teal,
    start: "You put tokens behind facts you believe in. When businesses query those facts, you earn a cut of the fee — proportional to how much you put in.",
    actions: ["Browse already-submitted facts", "Put tokens behind the ones you trust", "Collect a share of the fee each time those facts are queried"],
    earn: "A share of query fees on every fact you've backed",
    risk: "Medium — if you back a fact that later scores poorly, your earnings drop.",
  },
  {
    role: "Developer",
    tagline: "I build with it",
    color: C.blue,
    start: "You query the AXIOM API and get back verified, scored facts your app can trust — without hiring a research team.",
    actions: ["Call the AXIOM API with a question", "Get back a verified fact and its agreement score", "Pay only for the queries you make — no monthly fee"],
    earn: "N/A — you pay per query; what you gain is reliable data",
    risk: "None — pay only for what you use",
  },
];

const FACTS = [
  { title: "Water boils at 100°C at sea level", field: "Chemistry", score: 99.8, weeklyEarn: 14.20, queries: 8840, icon: "H₂O" },
  { title: "Human resting heart rate: 60–100 bpm", field: "Medicine", score: 98.1, weeklyEarn: 9.74, queries: 6120, icon: "bpm" },
  { title: "Speed of light in vacuum: 299,792,458 m/s", field: "Physics", score: 99.9, weeklyEarn: 18.55, queries: 11600, icon: "c" },
  { title: "Bitcoin SHA-256 proof-of-work collision resistance", field: "Crypto", score: 91.4, weeklyEarn: 5.33, queries: 3340, icon: "∑" },
  { title: "LLM hallucination rate rises with context length", field: "AI", score: 78.2, weeklyEarn: 2.11, queries: 1320, icon: "AI" },
];

const BOUNTIES = [
  { title: "Verified long-term side effect rate of GLP-1 agonists", reward: 200, field: "Medicine", hunters: 4 },
  { title: "Energy cost per token for frontier LLMs (2024–2025)", reward: 140, field: "AI", hunters: 9 },
  { title: "Yield curve inversion lead time variance 1950–2025", reward: 90, field: "Economics", hunters: 6 },
];

function ScoreRing({ score }) {
  const r = 22, circ = 2 * Math.PI * r;
  const fill = circ - (score / 100) * circ;
  const col = score >= 95 ? "#1D9E75" : score >= 80 ? "#378ADD" : score >= 65 ? "#BA7517" : "#D85A30";
  return (
    <svg width={56} height={56} viewBox="0 0 56 56">
      <circle cx={28} cy={28} r={r} fill="none" stroke="var(--color-border-tertiary)" strokeWidth={4} />
      <circle cx={28} cy={28} r={r} fill="none" stroke={col} strokeWidth={4}
        strokeDasharray={circ} strokeDashoffset={fill} strokeLinecap="round"
        transform="rotate(-90 28 28)" />
      <text x={28} y={33} textAnchor="middle" fontSize={11} fontWeight={500} fill={col}>{score.toFixed(0)}</text>
    </svg>
  );
}

function Tab({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: "6px 16px", fontSize: 13, borderRadius: 8,
      border: "0.5px solid var(--color-border-secondary)",
      background: active ? "var(--color-background-secondary)" : "transparent",
      fontWeight: active ? 500 : 400,
      cursor: "pointer",
      color: "var(--color-text-primary)",
    }}>
      {label}
    </button>
  );
}

const SWATCH_BG = {
  light: "#ffffff",
  dark:  "#1a1a1a",
  ocean: "#0d1b2a",
  dusk:  "#1c1420",
  sand:  "#faf7f2",
};
const SWATCH_BORDER = {
  light: "#cccccc",
  dark:  "#555555",
  ocean: "#2a4560",
  dusk:  "#3d2a4a",
  sand:  "#d4c9b0",
};

function ThemeSwitcher({ currentTheme, onThemeChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1.5rem" }}>
      <span style={{ fontSize: 12, color: "var(--color-text-secondary)", marginRight: 4 }}>Theme</span>
      {THEME_IDS.map((id) => (
        <button
          key={id}
          title={THEMES[id].name}
          onClick={() => onThemeChange(id)}
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: SWATCH_BG[id],
            border: currentTheme === id
              ? "2.5px solid var(--color-text-primary)"
              : `1.5px solid ${SWATCH_BORDER[id]}`,
            cursor: "pointer",
            padding: 0,
            transition: "transform 0.1s",
            transform: currentTheme === id ? "scale(1.2)" : "scale(1)",
            outline: "none",
          }}
          aria-label={THEMES[id].name}
          aria-pressed={currentTheme === id}
        />
      ))}
      <span style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginLeft: 4 }}>
        {THEMES[currentTheme].name}
      </span>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("how");
  const [stakeAmt, setStakeAmt] = useState(500);
  const [selectedRole, setSelectedRole] = useState(0);
  const [expandedFact, setExpandedFact] = useState(null);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("axiom-theme");
    if (saved && THEME_IDS.includes(saved)) setTheme(saved);
  }, []);

  useEffect(() => {
    const vars = THEMES[theme];
    Object.entries(vars).forEach(([key, val]) => {
      if (key.startsWith("--")) document.documentElement.style.setProperty(key, val);
    });
    document.body.style.background = vars["--color-background-primary"];
    document.body.style.transition = "background 0.2s";
    localStorage.setItem("axiom-theme", theme);
  }, [theme]);

  const weeklyYield = stakeAmt * 0.00082 * 7;
  const annualYield = stakeAmt * 0.00082 * 365;
  const apy = (annualYield / stakeAmt) * 100;

  return (
    <div style={{
      fontFamily: "var(--font-sans)",
      color: "var(--color-text-primary)",
      padding: "1.5rem",
      maxWidth: 680,
      margin: "0 auto",
      minHeight: "100vh",
      transition: "color 0.2s",
    }}>
      <ThemeSwitcher currentTheme={theme} onThemeChange={setTheme} />

      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontSize: 22, fontWeight: 500, margin: "0 0 4px", letterSpacing: "-0.3px" }}>AXIOM</p>
        <p style={{ fontSize: 15, color: "var(--color-text-secondary)", margin: "0 0 12px" }}>
          A marketplace where verified knowledge earns money — automatically.
        </p>
        <div style={{ display: "flex", gap: 8, padding: "12px 14px", ...surface, flexWrap: "wrap" }}>
          {[
            { label: "You submit facts →", sub: "earn when they're used" },
            { label: "Developers pay →", sub: "to query verified data" },
            { label: "The network pays you →", sub: "passively, forever" },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, minWidth: 140 }}>
              <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 500 }}>{s.label}</p>
              <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)" }}>{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Nav */}
      <div style={{ display: "flex", gap: 6, marginBottom: "1.25rem", flexWrap: "wrap" }}>
        {[
          ["how", "How it works"],
          ["roles", "Who earns what"],
          ["market", "Live knowledge market"],
          ["bounties", "Gap bounties"],
          ["simulate", "Earnings calculator"],
        ].map(([id, label]) => (
          <Tab key={id} label={label} active={tab === id} onClick={() => setTab(id)} />
        ))}
      </div>

      {/* How it works */}
      {tab === "how" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ ...surface, marginBottom: 2 }}>
            <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 500 }}>The core loop</p>
            <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
              Businesses pay to look up facts → that money goes to the people who wrote and backed those facts → that attracts more contributors → the database gets better → more businesses use it. One cycle, self-reinforcing.
            </p>
          </div>
          {STEPS.map((s, i) => (
            <div key={i} style={{ ...card, display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: s.color.bg, border: `0.5px solid ${s.color.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 500, color: s.color.text, flexShrink: 0,
              }}>
                {s.icon}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 500 }}>{s.title}</p>
                <p style={{ margin: "0 0 6px", fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>{s.plain}</p>
                <div style={{
                  background: s.color.bg, borderRadius: 6, padding: "6px 10px",
                  fontSize: 12, color: s.color.text, border: `0.5px solid ${s.color.border}`,
                }}>
                  Why this matters: {s.why}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Roles */}
      {tab === "roles" && (
        <div>
          <p style={{ margin: "0 0 10px", fontSize: 13, color: "var(--color-text-secondary)" }}>
            Who are you in this system? Pick the role that fits.
          </p>
          <div style={{ display: "flex", gap: 8, marginBottom: "1rem", flexWrap: "wrap" }}>
            {ROLES.map((r, i) => (
              <button key={i} onClick={() => setSelectedRole(i)} style={{
                flex: 1, minWidth: 120, padding: "10px 14px", borderRadius: 10,
                border: `0.5px solid ${selectedRole === i ? r.color.border : "var(--color-border-tertiary)"}`,
                background: selectedRole === i ? r.color.bg : "var(--color-background-primary)",
                cursor: "pointer", textAlign: "left",
              }}>
                <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 500, color: selectedRole === i ? r.color.text : "var(--color-text-primary)" }}>{r.role}</p>
                <p style={{ margin: 0, fontSize: 12, color: selectedRole === i ? r.color.text : "var(--color-text-secondary)" }}>{r.tagline}</p>
              </button>
            ))}
          </div>
          {(() => {
            const r = ROLES[selectedRole];
            return (
              <div style={card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div>
                    <p style={{ margin: "0 0 2px", fontSize: 16, fontWeight: 500 }}>{r.role}</p>
                    <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)" }}>{r.tagline}</p>
                  </div>
                  {pill(r.color, r.role)}
                </div>
                <p style={{ margin: "0 0 14px", fontSize: 14, lineHeight: 1.5 }}>{r.start}</p>
                <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)" }}>Step by step</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                  {r.actions.map((a, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: r.color.mid, flexShrink: 0, marginTop: 5 }} />
                      <p style={{ margin: 0, fontSize: 13 }}>{a}</p>
                    </div>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div style={surface}>
                    <p style={{ margin: "0 0 2px", fontSize: 11, color: "var(--color-text-secondary)" }}>How you earn</p>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>{r.earn}</p>
                  </div>
                  <div style={surface}>
                    <p style={{ margin: "0 0 2px", fontSize: 11, color: "var(--color-text-secondary)" }}>Your risk</p>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>{r.risk}</p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Market */}
      {tab === "market" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ ...surface, marginBottom: 2 }}>
            <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 500 }}>What you're looking at</p>
            <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
              Each card is a fact that has been submitted and checked by the system. The number in the ring is an agreement score from 0–100 — it's not a grade. It measures how consistently independent sources, citations, and other verified facts all point to the same conclusion. Click any fact to see how the score breaks down.
            </p>
          </div>
          {FACTS.map((f, i) => (
            <div key={i} onClick={() => setExpandedFact(expandedFact === i ? null : i)} style={{
              ...card, cursor: "pointer",
              border: `0.5px solid ${expandedFact === i ? C.purple.border : "var(--color-border-tertiary)"}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 8,
                  background: C.purple.bg, border: `0.5px solid ${C.purple.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 500, color: C.purple.text, flexShrink: 0,
                }}>
                  {f.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: "0 0 3px", fontSize: 14, fontWeight: 500, lineHeight: 1.3 }}>{f.title}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)" }}>{f.field} · {f.queries.toLocaleString()} queries this week</p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <ScoreRing score={f.score} />
                </div>
              </div>
              {expandedFact === i && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: "0.5px solid var(--color-border-tertiary)" }}>
                  <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 500 }}>How the score was calculated</p>
                  <p style={{ margin: "0 0 10px", fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
                    A score of {f.score.toFixed(1)} means {f.score >= 95 ? "this fact has been cross-checked across a very large number of independent sources and none of them contradict it." : f.score >= 80 ? "this fact is well-supported across most sources checked, with very few contradictions." : "this fact has reasonable support but some sources are still catching up or partially conflicting."}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {[
                      { label: "How many independent sources agree", pct: 40, color: C.purple },
                      { label: "How credible and linked those sources are", pct: 35, color: C.teal },
                      { label: "How many people have staked tokens backing it", pct: 25, color: C.amber },
                    ].map(m => (
                      <div key={m.label}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                          <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{m.label}</span>
                          <span style={{ fontSize: 12, fontWeight: 500 }}>{m.pct}% of score</span>
                        </div>
                        <div style={{ background: "var(--color-background-secondary)", borderRadius: 4, height: 5 }}>
                          <div style={{ width: `${(f.score / 100) * m.pct}%`, height: "100%", background: m.color.mid, borderRadius: 4 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    {[
                      { label: "Contributor earns / week", value: `$${f.weeklyEarn.toFixed(2)}` },
                      { label: "Monthly estimate", value: `$${(f.weeklyEarn * 4.3).toFixed(2)}` },
                      { label: "Queries this week", value: f.queries.toLocaleString() },
                    ].map(m => (
                      <div key={m.label} style={surface}>
                        <p style={{ margin: "0 0 2px", fontSize: 11, color: "var(--color-text-secondary)" }}>{m.label}</p>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>{m.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Bounties */}
      {tab === "bounties" && (
        <div>
          <div style={{ ...surface, marginBottom: "1rem" }}>
            <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 500 }}>What is a gap bounty?</p>
            <p style={{ margin: "0 0 8px", fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
              Imagine a developer's AI tool tries to look up "the long-term side effects of GLP-1 drugs" and AXIOM has no verified fact for it. That gap gets detected automatically. The system posts a cash reward — paid in AXM tokens — to whoever submits the first properly sourced, verified answer.
            </p>
            <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
              The reward size is set by how often that question is being asked and how valuable the answer would be. Nobody decides it manually.
            </p>
          </div>
          <p style={{ margin: "0 0 8px", fontSize: 12, color: "var(--color-text-tertiary)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px" }}>Open bounties right now</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {BOUNTIES.map((b, i) => (
              <div key={i} style={card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 500, lineHeight: 1.3 }}>{b.title}</p>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      {pill(C.blue, b.field)}
                      <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>{b.hunters} researchers working on this</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p style={{ margin: "0 0 2px", fontSize: 18, fontWeight: 500, color: C.amber.text }}>{b.reward} AXM</p>
                    <p style={{ margin: 0, fontSize: 11, color: "var(--color-text-tertiary)" }}>first to verify wins this</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "0.875rem", ...surface, border: `0.5px solid ${C.amber.border}`, background: C.amber.bg }}>
            <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 500, color: C.amber.text }}>Nobody posts these. The system does.</p>
            <p style={{ margin: 0, fontSize: 13, color: C.amber.text, lineHeight: 1.5 }}>
              Bounties are generated by real developer demand — questions that got asked but couldn't be answered. The reward size reflects how urgently that gap needs to be filled. You can't fake demand, and you can't game the reward.
            </p>
          </div>
        </div>
      )}

      {/* Simulate */}
      {tab === "simulate" && (
        <div>
          <div style={{ ...card, marginBottom: 10 }}>
            <p style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 500 }}>Earnings calculator — Staker role</p>
            <p style={{ margin: "0 0 4px", fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
              A Staker puts tokens behind facts they believe in.
            </p>
            <p style={{ margin: "0 0 14px", fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
              When a business queries one of those facts through the API, the fee gets split — part goes to the person who submitted the fact, part goes to everyone who staked tokens on it. Move the slider to see what your cut would look like.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: "var(--color-text-secondary)", whiteSpace: "nowrap" }}>Tokens you put in</span>
              <input type="range" min={50} max={5000} step={50} value={stakeAmt}
                onChange={e => setStakeAmt(Number(e.target.value))} style={{ flex: 1 }} />
              <span style={{ fontSize: 14, fontWeight: 500, minWidth: 72, textAlign: "right" }}>{stakeAmt} AXM</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 8 }}>
              {[
                { label: "You earn per day", value: `$${(weeklyYield / 7).toFixed(3)}` },
                { label: "You earn per week", value: `$${weeklyYield.toFixed(2)}` },
                { label: "You earn per year", value: `$${annualYield.toFixed(0)}` },
                { label: "Annual return rate", value: `${apy.toFixed(1)}%` },
                { label: "Days to earn your stake back", value: `${Math.ceil(stakeAmt / (stakeAmt * 0.00082))} days` },
                { label: "Network tier", value: stakeAmt > 2000 ? "Top 5%" : stakeAmt > 500 ? "Top 20%" : "Entry" },
              ].map(m => (
                <div key={m.label} style={surface}>
                  <p style={{ margin: "0 0 2px", fontSize: 11, color: "var(--color-text-secondary)" }}>{m.label}</p>
                  <p style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>{m.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ ...surface, border: `0.5px solid ${C.teal.border}`, background: C.teal.bg }}>
            <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 500, color: C.teal.text }}>This is real fee revenue — not new tokens.</p>
            <p style={{ margin: 0, fontSize: 13, color: C.teal.text, lineHeight: 1.5 }}>
              Your earnings come from the fees businesses pay to query the API. When a developer's app looks up a fact you've staked, you get a cut of what they paid. The protocol handles the split automatically. No new tokens are created to pay you.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
