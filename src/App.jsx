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
    title: "Someone submits a fact",
    plain: "A user writes a knowledge claim — like 'The boiling point of water at sea level is 100°C' — and backs it with sources.",
    why: "This builds the database. Anyone can contribute.",
  },
  {
    icon: "2", color: C.blue,
    title: "The system scores it automatically",
    plain: "Three math engines check the claim: (1) Does the evidence support it statistically? (2) Do credible sources cite it? (3) Do other verified facts agree?",
    why: "No human editors. No opinions. Pure math gives it a trust score from 0–100.",
  },
  {
    icon: "3", color: C.teal,
    title: "Developers pay to query it",
    plain: "AI companies, researchers, and apps pay a small fee every time they ask AXIOM a question — like looking up a trusted fact database.",
    why: "This is where real money enters the system. Not from users — from businesses.",
  },
  {
    icon: "4", color: C.amber,
    title: "Contributors get paid",
    plain: "Every query that uses your submitted fact earns you a share of the fee. The higher your fact's trust score, the more it gets queried, the more you earn.",
    why: "You earn passively. The better your contribution, the more you make.",
  },
  {
    icon: "5", color: C.coral,
    title: "The network grows itself",
    plain: "The system constantly scans for missing knowledge — gaps where developers ask questions but no verified fact exists. It posts bounties for those gaps.",
    why: "The market demand literally tells the network what to build next. No guesswork.",
  },
];

const ROLES = [
  {
    role: "Contributor",
    tagline: "I share knowledge",
    color: C.purple,
    actions: ["Submit a fact or finding", "Attach sources (papers, data, books)", "Earn every time your fact is queried"],
    earn: "Per query on your contributions",
    risk: "Low — bad submissions just score low, no penalty",
  },
  {
    role: "Staker",
    tagline: "I back other facts",
    color: C.teal,
    actions: ["Browse facts in the marketplace", "Stake AXM tokens on facts you believe in", "Earn a yield when those facts get queried"],
    earn: "Yield on your staked amount",
    risk: "Medium — staking wrong facts loses yield",
  },
  {
    role: "Developer",
    tagline: "I build with it",
    color: C.blue,
    actions: ["Query the AXIOM API", "Get machine-readable verified facts", "Pay per query, no subscriptions"],
    earn: "N/A — you pay, you gain accuracy",
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
          <div style={{ ...surface, marginTop: 4 }}>
            <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 500 }}>The self-sustaining loop</p>
            <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
              More developers querying → more fee revenue → more contributor earnings → more contributors → better knowledge → more developers querying. The system feeds itself.
            </p>
          </div>
        </div>
      )}

      {/* Roles */}
      {tab === "roles" && (
        <div>
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
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div>
                    <p style={{ margin: "0 0 2px", fontSize: 16, fontWeight: 500 }}>{r.role}</p>
                    <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)" }}>{r.tagline}</p>
                  </div>
                  {pill(r.color, r.role)}
                </div>
                <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)" }}>What you do</p>
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
          <p style={{ margin: "0 0 8px", fontSize: 13, color: "var(--color-text-secondary)" }}>
            Real submitted facts — click any to see its trust breakdown.
          </p>
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
                  <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 500 }}>Trust score breakdown</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {[
                      { label: "Statistical evidence (Bayesian)", pct: 40, color: C.purple },
                      { label: "Citation depth & source authority", pct: 35, color: C.teal },
                      { label: "Peer stake consensus", pct: 25, color: C.amber },
                    ].map(m => (
                      <div key={m.label}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                          <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{m.label}</span>
                          <span style={{ fontSize: 12, fontWeight: 500 }}>{m.pct}% weight</span>
                        </div>
                        <div style={{ background: "var(--color-background-secondary)", borderRadius: 4, height: 5 }}>
                          <div style={{ width: `${(f.score / 100) * m.pct}%`, height: "100%", background: m.color.mid, borderRadius: 4 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    {[
                      { label: "Weekly earnings", value: `$${f.weeklyEarn.toFixed(2)}` },
                      { label: "Monthly est.", value: `$${(f.weeklyEarn * 4.3).toFixed(2)}` },
                      { label: "Total queries", value: f.queries.toLocaleString() },
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
            <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 500 }}>What are gap bounties?</p>
            <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
              Every hour the network scans which facts developers are trying to query but can't find. Those missing facts become bounties — paid in AXM tokens to whoever fills the gap first with a verified submission.
            </p>
          </div>
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
                    <p style={{ margin: 0, fontSize: 11, color: "var(--color-text-tertiary)" }}>bounty reward</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "0.875rem", ...surface, border: `0.5px solid ${C.amber.border}`, background: C.amber.bg }}>
            <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 500, color: C.amber.text }}>Bounties are not posted by people.</p>
            <p style={{ margin: 0, fontSize: 13, color: C.amber.text, lineHeight: 1.5 }}>
              They are detected automatically by the graph. Developer demand × citation void × adjacent fact confidence = bounty value. You cannot fake a gap or game the reward size.
            </p>
          </div>
        </div>
      )}

      {/* Simulate */}
      {tab === "simulate" && (
        <div>
          <div style={{ ...card, marginBottom: 10 }}>
            <p style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 500 }}>How much can you earn as a Staker?</p>
            <p style={{ margin: "0 0 10px", fontSize: 13, color: "var(--color-text-secondary)" }}>
              Stakers back existing facts with AXM tokens. When those facts get queried by developers, you earn a share of the fee — proportional to your stake.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: "var(--color-text-secondary)", whiteSpace: "nowrap" }}>Your stake</span>
              <input type="range" min={50} max={5000} step={50} value={stakeAmt}
                onChange={e => setStakeAmt(Number(e.target.value))} style={{ flex: 1 }} />
              <span style={{ fontSize: 14, fontWeight: 500, minWidth: 72, textAlign: "right" }}>{stakeAmt} AXM</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 8 }}>
              {[
                { label: "Daily yield", value: `$${(weeklyYield / 7).toFixed(3)}` },
                { label: "Weekly yield", value: `$${weeklyYield.toFixed(2)}` },
                { label: "Annual yield", value: `$${annualYield.toFixed(0)}` },
                { label: "APY", value: `${apy.toFixed(1)}%` },
                { label: "Break-even", value: `${Math.ceil(stakeAmt / (stakeAmt * 0.00082))} days` },
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
            <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 500, color: C.teal.text }}>Where does the yield actually come from?</p>
            <p style={{ margin: 0, fontSize: 13, color: C.teal.text, lineHeight: 1.5 }}>
              Developer API fees → split between the contributor who submitted the fact, and stakers who backed it. No inflation. No token printing. Real business revenue, distributed by the protocol.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
