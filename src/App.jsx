import React, { useEffect, useState } from "react";
import TradeAid from "./TradeAid";
import { T, SITE, FEATURES, MODULES, LIBRARY } from "./data";

const fonts = {
  sans: "'DM Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  serif: "'Cormorant Garamond', Georgia, serif",
};

const SectionHeading = ({ eyebrow, title, description }) => (
  <section style={{ padding: "100px 0 40px", maxWidth: 920, margin: "0 auto" }}>
    <div style={{ color: T.text, textTransform: "uppercase", letterSpacing: "0.18em", fontSize: 11, marginBottom: 18, fontFamily: fonts.sans, fontWeight: 500 }}>{eyebrow}</div>
    <h2 style={{ fontFamily: fonts.serif, fontSize: 48, lineHeight: 1.05, margin: 0, color: T.black, fontWeight: 300 }}>{title}</h2>
    {description ? <p style={{ color: T.text, maxWidth: 680, fontSize: 16, lineHeight: 1.75, marginTop: 24, fontFamily: fonts.sans, fontWeight: 300 }}>{description}</p> : null}
  </section>
);

const Card = ({ title, description, accent }) => (
  <article style={{ background: T.card, borderRadius: 4, padding: "32px", border: `1px solid ${T.line}`, minWidth: 260, flex: "1 1 260px", margin: "12px" }}>
    <div style={{ color: T.text, fontFamily: fonts.sans, fontSize: 11, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>{accent}</div>
    <h3 style={{ fontFamily: fonts.serif, fontSize: 32, margin: "0 0 14px", color: T.black, fontWeight: 300 }}>{title}</h3>
    <p style={{ color: T.text, lineHeight: 1.75, margin: 0, fontFamily: fonts.sans, fontWeight: 300 }}>{description}</p>
  </article>
);

const ModuleCard = ({ label, headline, description, outcomes }) => (
  <article style={{ background: T.surface, borderRadius: 4, padding: "32px", border: `1px solid ${T.line}`, flex: "1 1 320px", margin: "12px" }}>
    <div style={{ color: T.text, fontFamily: fonts.sans, fontSize: 11, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>{label}</div>
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

const Hero = ({ onOpenExperience, scrollTo }) => (
  <section className="hero-section">
    <div className="hero-inner fade-in">
      <div className="hero-copy">
        <div className="section-label">TRADEAID</div>
        <h1 className="hero-title">Trade with clarity.</h1>
        <p className="hero-text">Real-time signals. Zero noise.</p>
        <div className="hero-actions">
          <button className="btn-outline" onClick={() => scrollTo("philosophy")}>START TRACKING</button>
        </div>
      </div>
      <div className="hero-chart surface-card fade-in">
        <div className="hero-chart-labels">
          <span>Live pulse</span>
          <span>USD</span>
        </div>
        <svg className="chart-svg" viewBox="0 0 360 200" fill="none" preserveAspectRatio="none">
          <path className="chart-path" d="M10 170 C80 130 130 150 180 110 C230 70 290 90 350 40" stroke="#1A1A1A" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  </section>
);

const Nav = ({ active, setActive, scrollTo, scrolled }) => (
  <header className={`navbar ${scrolled ? 'solid' : 'transparent'}`}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ fontFamily: fonts.serif, fontSize: 20, fontWeight: 400, color: T.black }}>TradeAid</div>
    </div>
    <nav className="nav-links">
      {[ 'Markets', 'Watchlist', 'Portfolio', 'Signals', 'Settings' ].map((label) => (
        <button key={label} onClick={() => scrollTo(label.toLowerCase())} className={`nav-link ${active === label.toLowerCase() ? 'active' : ''}`}>{label}</button>
      ))}
    </nav>
    <div className="nav-right">
      <div className="avatar" aria-hidden="true"></div>
      <button className="nav-link">Sign In</button>
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

  if (active === "App") {
    return (
      <div style={{ minHeight: "100vh", background: T.bg, color: T.black, fontFamily: fonts.sans }}>
        <Nav active={active} setActive={setActive} scrollTo={scrollTo} scrolled={scrolled} />
        <div style={{ padding: "24px", maxWidth: 1180, margin: "0 auto" }}>
          <button onClick={() => setActive("home")} style={{ border: `1px solid ${T.line}`, background: T.surface, color: T.black, borderRadius: 4, padding: "12px 22px", cursor: "pointer", fontFamily: fonts.sans, fontSize: 13, letterSpacing: "0.15em", textTransform: "uppercase" }}>← Return to site</button>
        </div>
        <TradeAid />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.black, fontFamily: fonts.sans }}>
      <Nav active={active} setActive={setActive} scrollTo={scrollTo} scrolled={scrolled} />
      <main>
        <Hero onOpenExperience={() => setActive("App")} scrollTo={scrollTo} />
        <section id="philosophy" style={{ padding: "0 24px 0", background: T.bg }}>
          <div className="section-label">Thinking</div>
          <h2 className="section-title">A refined logic for market decisions.</h2>
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
            <button onClick={() => setActive("App")} style={{ border: "1px solid #B8860B", background: T.gold, color: T.black, borderRadius: 4, padding: "18px 32px", fontFamily: fonts.sans, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>Open the experience</button>
          </div>
        </section>
      </main>
      <PageFooter />
    </div>
  );
};

export default App;
