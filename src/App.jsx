import React, { useEffect, useState } from "react";
import TradeAid from "./TradeAid";
import Markets from "./Markets";
import { T, SITE, FEATURES, MODULES, LIBRARY } from "./data";

const fonts = {
  sans: "'DM Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  serif: "'Cormorant Garamond', Georgia, serif",
};

const SectionHeading = ({ eyebrow, title, description }) => (
  <section style={{ padding: "100px 0 40px", maxWidth: 920, margin: "0 auto" }}>
    <div style={{ color: T.burgundy, textTransform: "uppercase", letterSpacing: "0.18em", fontSize: 11, marginBottom: 18, fontFamily: fonts.sans, fontWeight: 500 }}>{eyebrow}</div>
    <h2 style={{ fontFamily: fonts.serif, fontSize: 48, lineHeight: 1.05, margin: 0, color: T.black, fontWeight: 300 }}>{title}</h2>
    {description ? <p style={{ color: T.text, maxWidth: 680, fontSize: 16, lineHeight: 1.75, marginTop: 24, fontFamily: fonts.sans, fontWeight: 300 }}>{description}</p> : null}
  </section>
);

const Card = ({ title, description, accent }) => (
  <article style={{ background: T.card, borderRadius: 4, padding: "32px", border: `1px solid ${T.line}`, minWidth: 260, flex: "1 1 260px", margin: "12px" }}>
    <div style={{ color: T.burgundy, fontFamily: fonts.sans, fontSize: 11, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>{accent}</div>
    <h3 style={{ fontFamily: fonts.serif, fontSize: 32, margin: "0 0 14px", color: T.black, fontWeight: 300 }}>{title}</h3>
    <p style={{ color: T.text, lineHeight: 1.75, margin: 0, fontFamily: fonts.sans, fontWeight: 300 }}>{description}</p>
  </article>
);

const ModuleCard = ({ label, headline, description, outcomes }) => (
  <article style={{ background: T.surface, borderRadius: 4, padding: "32px", border: `1px solid ${T.line}`, flex: "1 1 320px", margin: "12px" }}>
    <div style={{ color: T.burgundy, fontFamily: fonts.sans, fontSize: 11, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>{label}</div>
    <h3 style={{ fontFamily: fonts.serif, fontSize: 32, margin: "0 0 18px", color: T.black, fontWeight: 300 }}>{headline}</h3>
    <p style={{ color: T.text, lineHeight: 1.75, margin: 0, marginBottom: 20, fontFamily: fonts.sans, fontWeight: 300 }}>{description}</p>
    <ul style={{ listStyle: "none", padding: 0, margin: 0, color: T.text }}>
      {outcomes.map((item) => (
        <li key={item} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
          <span style={{ color: T.black, fontWeight: 300, fontSize: 16, lineHeight: 1 }}>•</span>
          <span style={{ lineHeight: 1.75, fontFamily: fonts.sans, fontWeight: 300 }}>{item}</span>
        </li>
      ))}
    </ul>
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

const SectionGrid = ({ items }) => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))", gap: 18, marginTop: 38 }}>
    {items.map((item) => <Card key={item.title} {...item} />)}
  </div>
);

const CurriculumGrid = () => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px,1fr))", gap: 18, marginTop: 38 }}>
    {MODULES.map((module) => <ModuleCard key={module.id} {...module} />)}
  </div>
);

const LibraryPreview = () => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))", gap: 18, marginTop: 32 }}>
    {LIBRARY.map((item) => (
      <article key={item.title} style={{ background: T.card, borderRadius: 26, border: `1px solid ${T.line}`, padding: "26px" }}>
        <div style={{ color: T.goldDeep, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>{item.year}</div>
        <h3 style={{ fontFamily: fonts.serif, fontSize: 20, margin: "0 0 14px", color: T.ink }}>{item.title}</h3>
        <p style={{ color: T.grey, lineHeight: 1.8, margin: 0 }}>{item.note}</p>
        <div style={{ marginTop: 18, color: T.greyLight, fontSize: 13 }}>{item.author}</div>
      </article>
    ))}
  </div>
);

const PageFooter = () => (
  <footer style={{ padding: "60px 24px", color: T.grey, borderTop: `1px solid ${T.line}`, background: T.bgAlt }}>
    <div style={{ maxWidth: 920, margin: "0 auto", display: "grid", gap: 14, fontSize: 14, lineHeight: 1.8 }}>
      <div style={{ fontFamily: fonts.serif, fontSize: 18, color: T.ink }}>TradeAid</div>
      <div>Designed to help serious learners build market skill through structured learning, practical tools, and disciplined practice.</div>
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
        <section id="philosophy" style={{ padding: "0 24px 0", background: T.bg }}>
          <div className="section-label">Thinking</div>
          <h2 className="section-title">A refined logic for <em style={{ fontStyle: "italic", color: T.goldDeep, fontWeight: 400 }}>market decisions</em>.</h2>
          <p className="section-copy">TradeAid is built to favor clarity and process over signal-chasing and noise.</p>
          <div className="grid-3" style={{ marginTop: 38 }}>
            {[
              { title: "Evidence-led", description: "Rules and practices are rooted in market science and risk-aware behavior.", accent: "Method" },
              { title: "Minimal design", description: "Every interaction is intended to feel calm, precise, and deliberate.", accent: "System" },
              { title: "Capital first", description: "The priority is skill preservation before pursuit of returns.", accent: "Focus" },
            ].map((item) => <Card key={item.title} {...item} />)}
          </div>
        </section>
        <section id="curriculum" style={{ padding: "0 24px 0" }}>
          <SectionHeading eyebrow="System" title="A simple structure for serious learning." description="Three core modules center the work: foundations, discipline, and edge." />
          <div className="grid-3">
            {MODULES.map((module) => <ModuleCard key={module.id} {...module} />)}
          </div>
        </section>
        <section id="practice" style={{ padding: "0 24px 0", background: T.bg }}>
          <SectionHeading eyebrow="Practice" title="The experience is the proof." description="Tools, simulations, and review are the way knowledge becomes skill." />
          <div className="grid-3">
            {[
              { title: "Simulations", description: "Practice trades with real decision points.", accent: "Action" },
              { title: "Review", description: "Measure choices with objective feedback.", accent: "Insight" },
              { title: "Repeat", description: "Build consistency through disciplined process.", accent: "Habit" },
            ].map((item) => <Card key={item.title} {...item} />)}
          </div>
        </section>
        <section id="signals" style={{ padding: "0 24px 80px" }}>
          <SectionHeading eyebrow="Experience" title="Enter the TradeAid system." description="This is where the curriculum and tools come together in a single flow." />
          <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
            <button onClick={() => setActive("App")} style={{ border: `1px solid ${T.emerald}`, background: T.emerald, color: T.bg, borderRadius: 4, padding: "18px 36px", fontFamily: fonts.sans, fontSize: 11, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>Open the experience →</button>
          </div>
        </section>
      </main>
      <PageFooter />
    </div>
  );
};

export default App;
