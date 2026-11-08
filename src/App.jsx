import React, { useEffect, useState } from "react";
import TradeAid from "./TradeAid";
import Markets from "./Markets";
import { T, SITE, FEATURES, MODULES, LIBRARY } from "./data";

const fonts = {
  sans: "'DM Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  serif: "'Cormorant Garamond', Georgia, serif",
};

const EdHead = ({ eyebrow, title, description }) => (
  <div className="ed-head">
    <div className="eyebrow">{eyebrow}</div>
    <h2>{title}</h2>
    {description ? <p>{description}</p> : null}
  </div>
);

const EdCard = ({ kicker, title, description, variant }) => (
  <article className={`ed-card ${variant || ""}`}>
    <div className="ed-kicker">{kicker}</div>
    <h3>{title}</h3>
    <p>{description}</p>
  </article>
);

const EdModule = ({ label, headline, description, outcomes, variant }) => (
  <article className={`ed-module ${variant || ""}`}>
    <div className="ed-kicker">{label}</div>
    <h3>{headline}</h3>
    <p>{description}</p>
    <ul>{outcomes.map((item) => <li key={item}>{item}</li>)}</ul>
  </article>
);

const QuoteBar = ({ label, text }) => (
  <div style={{ maxWidth: 920, margin: "0 auto", padding: "48px 24px", borderRadius: 4, background: T.surface, border: `1px solid ${T.line}`, color: T.ink, fontFamily: fonts.serif, fontSize: 24, lineHeight: 1.4, fontWeight: 300, fontStyle: "italic" }}>
    <div style={{ color: T.text, letterSpacing: "0.18em", fontSize: 11, textTransform: "uppercase", marginBottom: 16, fontFamily: fonts.sans, fontWeight: 500 }}>{label}</div>
    {text}
  </div>
);

const RotatingWordmark = ({ size = 440 }) => {
  const r = size / 2 - 20;
  const cx = size / 2;
  const cy = size / 2;
  const d = `M ${cx},${cy} m -${r},0 a ${r},${r} 0 1,1 ${r * 2},0 a ${r},${r} 0 1,1 -${r * 2},0`;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotating-wordmark" style={{ display: "block" }}>
      <defs>
        <path id="tradeaid-circle" d={d} fill="none" />
      </defs>
      <text fill={T.burgundy} fontFamily={fonts.serif} fontSize={size * 0.065} fontWeight="400" letterSpacing="0.22em">
        <textPath href="#tradeaid-circle" startOffset="0%">
          TRADEAID · LEARN FIRST · TRADE LATER · THE MARKET IS A SKILL ·
        </textPath>
      </text>
    </svg>
  );
};

const Hero = ({ onOpenExperience, scrollTo }) => (
  <section className="hero-section">
    <div className="hero-inner fade-in">
      <div className="hero-copy">
        <div className="section-label">TRADEAID · EST. 2026</div>
        <h1 className="hero-title">Trade with <em style={{ fontStyle: "italic", color: "#8B6023", fontWeight: 400 }}>clarity</em>.</h1>
        <p className="hero-text">A quiet place to learn the market — before you trade it.</p>
        <div className="hero-actions">
          <button className="btn-outline" onClick={() => scrollTo("philosophy")}>START READING</button>
        </div>
      </div>
      <div className="hero-stage fade-in">
        <RotatingWordmark size={440} />
        <div className="hero-stage-card card-a">
          <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(244,235,220,0.7)", marginBottom: 10 }}>Lecture 03</div>
          <div style={{ fontFamily: fonts.serif, fontSize: 22, fontWeight: 400, lineHeight: 1.25 }}>Position sizing is a <em style={{ fontStyle: "italic", color: "#E8B55F" }}>mathematical</em> discipline.</div>
          <div style={{ fontFamily: fonts.sans, fontSize: 11, color: "rgba(244,235,220,0.65)", marginTop: 14, letterSpacing: "0.05em" }}>6 min · intermediate</div>
        </div>
        <div className="hero-stage-card card-b">
          <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: T.burgundy, marginBottom: 10 }}>Paper · 1952</div>
          <div style={{ fontFamily: fonts.serif, fontSize: 20, fontWeight: 400, color: T.ink, lineHeight: 1.25 }}>Portfolio Selection</div>
          <div style={{ fontFamily: fonts.sans, fontSize: 12, color: T.text, marginTop: 10, lineHeight: 1.55, fontWeight: 300 }}>H. Markowitz — the founding paper of modern portfolio theory.</div>
        </div>
        <div className="hero-stage-card card-c">
          <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(244,235,220,0.75)", marginBottom: 8 }}>Non-negotiable</div>
          <div style={{ fontFamily: fonts.serif, fontSize: 40, fontWeight: 300, lineHeight: 1, letterSpacing: "-0.02em" }}>1%</div>
          <div style={{ fontFamily: fonts.sans, fontSize: 11, color: "rgba(244,235,220,0.78)", marginTop: 8, lineHeight: 1.5, fontWeight: 300 }}>Maximum account risk per trade.</div>
        </div>
      </div>
    </div>
  </section>
);

const Nav = ({ active, setActive, scrollTo, scrolled, goPage, openAuth }) => (
  <header className={`navbar ${scrolled ? 'solid' : 'transparent'}`}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <button onClick={() => goPage("home")} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0, fontFamily: fonts.serif, fontSize: 20, fontWeight: 400, color: T.black }}>TradeAid</button>
    </div>
    <nav className="nav-links">
      {[ 'Markets', 'Watchlist', 'Portfolio', 'Signals', 'Settings' ].map((label) => {
        const id = label.toLowerCase();
        const isPage = id === "markets";
        return (
          <button key={label} onClick={() => isPage ? goPage(id) : scrollTo(id)} className={`nav-link ${active === id ? 'active' : ''}`}>{label}</button>
        );
      })}
    </nav>
    <div className="nav-right" style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <button onClick={() => openAuth("signin")} className="nav-link">Sign In</button>
      <button onClick={() => openAuth("signup")} style={{ background: T.emerald, color: T.bg, border: `1px solid ${T.emerald}`, borderRadius: 4, padding: "10px 20px", fontFamily: fonts.sans, fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer" }}>Sign Up</button>
    </div>
  </header>
);

const PageFooter = () => (
  <footer style={{ padding: "80px 28px 60px", color: T.text, borderTop: `1px solid ${T.line}`, background: T.bg }}>
    <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 40, alignItems: "start" }}>
      <div>
        <div style={{ fontFamily: fonts.serif, fontSize: 24, color: T.ink, fontWeight: 400, marginBottom: 14 }}>TradeAid</div>
        <div style={{ fontFamily: fonts.sans, fontSize: 14, lineHeight: 1.75, fontWeight: 300, color: T.text, maxWidth: 320 }}>A quiet place to learn the market — before you trade it. Research-grounded, simulation-based, no money at risk.</div>
      </div>
      <div>
        <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 12, letterSpacing: "0.26em", textTransform: "uppercase", color: T.burgundy, marginBottom: 16 }}>Explore</div>
        <div style={{ display: "grid", gap: 10, fontSize: 14, lineHeight: 1.6 }}>
          <div>Markets</div><div>Curriculum</div><div>Library</div><div>Simulator</div>
        </div>
      </div>
      <div>
        <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 12, letterSpacing: "0.26em", textTransform: "uppercase", color: T.burgundy, marginBottom: 16 }}>About</div>
        <div style={{ display: "grid", gap: 10, fontSize: 14, lineHeight: 1.6 }}>
          <div>Our method</div><div>Research</div><div>Voice & tone</div><div>Contact</div>
        </div>
      </div>
      <div>
        <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 12, letterSpacing: "0.26em", textTransform: "uppercase", color: T.burgundy, marginBottom: 16 }}>Legal</div>
        <div style={{ display: "grid", gap: 10, fontSize: 14, lineHeight: 1.6 }}>
          <div>Terms</div><div>Privacy</div><div>Disclaimer</div>
        </div>
      </div>
    </div>
    <div style={{ maxWidth: 1280, margin: "64px auto 0", paddingTop: 24, borderTop: `1px solid ${T.line}`, fontSize: 12, color: T.textSoft, lineHeight: 1.7, fontWeight: 300 }}>
      TradeAid is an educational demonstration. Nothing here constitutes financial, investment, or tax advice; simulated data and sign-in are illustrative. Trading involves substantial risk of loss. Consult a licensed financial professional before any investment decision.
    </div>
  </footer>
);

const App = () => {
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [authIntent, setAuthIntent] = useState(null); // "signin" | "signup" | null

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    setActive(id);
    const offset = id === "home" ? 0 : 92;
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - offset, behavior: "smooth" });
    }
  };

  const goPage = (id) => {
    setActive(id);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const openAuth = (intent) => {
    setAuthIntent(intent);
    setActive("App");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  if (active === "App") {
    return (
      <div style={{ minHeight: "100vh", background: T.bg, color: T.black, fontFamily: fonts.sans }}>
        <header style={{ position: "sticky", top: 0, zIndex: 40, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", minHeight: 68, background: T.bg, borderBottom: `1px solid ${T.line}` }}>
          <button onClick={() => goPage("home")} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0, fontFamily: fonts.serif, fontSize: 20, fontWeight: 400, color: T.black }}>TradeAid</button>
          <button onClick={() => setActive("home")} style={{ border: `1px solid ${T.line}`, background: "transparent", color: T.black, borderRadius: 4, padding: "10px 18px", cursor: "pointer", fontFamily: fonts.sans, fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase" }}>← Return to site</button>
        </header>
        <TradeAid embedded entryStage={authIntent ? "auth" : "welcome"} authIntent={authIntent} />
      </div>
    );
  }

  if (active === "markets") {
    return (
      <div style={{ minHeight: "100vh", background: T.bg, color: T.black, fontFamily: fonts.sans }}>
        <Nav active={active} setActive={setActive} scrollTo={scrollTo} scrolled={scrolled} goPage={goPage} openAuth={openAuth} />
        <Markets />
        <PageFooter />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.black, fontFamily: fonts.sans }}>
      <Nav active={active} setActive={setActive} scrollTo={scrollTo} scrolled={scrolled} goPage={goPage} openAuth={openAuth} />
      <main>
        <Hero onOpenExperience={() => setActive("App")} scrollTo={scrollTo} />

        <section id="philosophy" className="ed-section">
          <EdHead
            eyebrow="Thinking"
            title={<>A refined logic for <em>market decisions</em>.</>}
            description="TradeAid is built to favor clarity and process over signal-chasing and noise. Every page, every lesson, every button follows the same principle: slow enough to think."
          />
          <div className="ed-grid-3">
            <EdCard kicker="Method" title={<>Evidence-<em>led</em>.</>} description="Rules and practices are rooted in market science and risk-aware behavior — not slogans, not hunches." />
            <EdCard kicker="System" variant="dark" title={<>Minimal <em>design</em>.</>} description="Every interaction is intended to feel calm, precise, and deliberate. No dopamine farming, no flashing panels." />
            <EdCard kicker="Focus" title={<>Capital <em>first</em>.</>} description="The priority is skill preservation before pursuit of returns. Survive the market; the rest follows." />
          </div>
        </section>

        <div className="ed-divider"><hr /></div>

        <section id="curriculum" className="ed-section">
          <EdHead
            eyebrow="System"
            title={<>A simple structure for <em>serious</em> learning.</>}
            description="Three core modules center the work: foundations, discipline, and edge. Each module pairs lectures with hands-on practice and a short written exam."
          />
          <div className="ed-grid-3">
            {MODULES.map((module, i) => (
              <EdModule key={module.id} {...module} variant={i === 1 ? "dark" : ""} />
            ))}
          </div>
        </section>

        <div className="ed-divider"><hr /></div>

        <section id="practice" className="ed-section">
          <EdHead
            eyebrow="Practice"
            title={<>The <em>experience</em> is the proof.</>}
            description="Tools, simulations, and review are the way knowledge becomes skill. You will practice more than you will read."
          />
          <div className="ed-grid-3">
            <EdCard kicker="Action" title={<><em>Simulations</em>.</>} description="Take real decisions on simulated markets — wrong choices cost nothing except a lesson." />
            <EdCard kicker="Insight" variant="wine" title={<><em>Review</em>.</>} description="Every trade is graded on process, not outcome. Good decisions can lose; bad decisions can win. Only the pattern matters." />
            <EdCard kicker="Habit" title={<><em>Repeat</em>.</>} description="Small reps, every session. That is the entire secret." />
          </div>
        </section>

        <section id="signals" className="ed-cta">
          <div className="ed-cta-inner">
            <div className="eyebrow">Experience</div>
            <h2>Step inside the <em>system</em>.</h2>
            <p>The curriculum, the simulator, the research library, and the toolkit — in a single, quiet flow. No cost, no credit card, no real money at risk.</p>
            <button onClick={() => setActive("App")} className="btn-emerald">Open TradeAid →</button>
          </div>
        </section>
      </main>
      <PageFooter />
    </div>
  );
};

export default App;
