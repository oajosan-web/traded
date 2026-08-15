import React, { useState, useEffect, useRef } from "react";

/* ============================================================
   TradeAid v3 — learn the market before you trade it.
   Demo app: simulated sign-in, simulated market, no real money.
   ============================================================ */

const T = {
  bg: "#FAFAF8", bgAlt: "#F2EFE9", card: "#F7F4EE", line: "#E8E4DF",
  ink: "#1A1A1A", grey: "#6B6B6B", greyLight: "#8B8B8B",
  gold: "#B8860B", goldSoft: "#F2E8B0", goldDeep: "#8B6023",
  burgundy: "#8B3A3A", burgundySoft: "#F2E4E0",
  emerald: "#1D2E28", emeraldSoft: "#DCE5E1", emeraldMid: "#2F4A40",
  green: "#1D2E28", greenSoft: "#DCE5E1",
};
const sans = "'DM Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const serif = "'Cormorant Garamond', Georgia, serif";
const mono = "'IBM Plex Mono', 'SF Mono', Consolas, monospace";

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap');
    * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
    html, body { min-height: 100%; margin: 0; padding: 0; background: ${T.bg}; color: ${T.ink}; font-family: ${sans}; }
    body { background: ${T.bg}; }
    button, input, textarea, select { font: inherit; }
    button { font-family: ${sans}; transition: transform .12s ease, opacity .12s ease, background .15s ease, border-color .15s ease; }
    button:active { transform: scale(0.985); }
    input, select { font-family: ${sans}; }
    input:focus, select:focus { outline: none; border-color: ${T.ink} !important; }
    a { color: ${T.burgundy}; text-decoration: none; font-weight: 600; }
    a:hover { text-decoration: underline; text-underline-offset: 3px; }
    @keyframes rise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes pop { 0% { transform: scale(.7); opacity: 0; } 70% { transform: scale(1.04); } 100% { transform: scale(1); opacity: 1; } }
    .rise { animation: rise .4s ease both; } .rise2 { animation: rise .4s .07s ease both; } .rise3 { animation: rise .4s .14s ease both; }
    .pop { animation: pop .3s ease both; }
    .hoverlift { transition: transform .15s ease, box-shadow .15s ease; }
    .hoverlift:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(26,24,22,.06); }
    @media (max-width: 780px) { .grid2 { grid-template-columns: 1fr !important; } .navlabel { display: none; } .statgrid { grid-template-columns: repeat(2, 1fr) !important; } }
    @media (prefers-reduced-motion: reduce) { .rise,.rise2,.rise3,.pop { animation: none; } }
  `}</style>
);

/* ============================== ICONS (no emojis) ============================== */
function Icon({ name, size = 18, color = "currentColor", strokeWidth = 2 }) {
  const P = { fill: "none", stroke: color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    home: <path {...P} d="M3 10.5 L12 3.5 L21 10.5 V20 H14.5 V14.5 H9.5 V20 H3 Z" />,
    book: <><path {...P} d="M4 5.5 C4 4.5 4.8 4 5.8 4 H19 V18 H6 C4.9 18 4 18.9 4 20 V5.5 Z" /><path {...P} d="M4 20 C4 18.9 4.9 18 6 18 H19 V21 H6 C4.9 21 4 20.5 4 20 Z" /><line {...P} x1="8" y1="8" x2="15" y2="8" /></>,
    chart: <><line {...P} x1="4" y1="20" x2="20" y2="20" /><rect {...P} x="6" y="11" width="3.4" height="6" rx="1" /><rect {...P} x="10.5" y="6" width="3.4" height="11" rx="1" /><rect {...P} x="15" y="9" width="3.4" height="8" rx="1" /></>,
    check: <><circle {...P} cx="12" cy="12" r="8.5" /><path {...P} d="M8.5 12.2 L11 14.7 L15.7 9.6" /></>,
    sliders: <><line {...P} x1="5" y1="6" x2="19" y2="6" /><line {...P} x1="5" y1="12" x2="19" y2="12" /><line {...P} x1="5" y1="18" x2="19" y2="18" /><circle cx="9" cy="6" r="2.1" fill={color} /><circle cx="15" cy="12" r="2.1" fill={color} /><circle cx="8" cy="18" r="2.1" fill={color} /></>,
    user: <><circle {...P} cx="12" cy="8" r="3.6" /><path {...P} d="M5 20 C5.5 16 8.4 14.3 12 14.3 C15.6 14.3 18.5 16 19 20" /></>,
    bolt: <path d="M13 2 L4.5 13.5 H11 L9.5 22 L19.5 9.5 H13 Z" fill={color} stroke="none" />,
    award: <><circle {...P} cx="12" cy="9" r="5.2" /><path {...P} d="M8.8 13.4 L7.5 21 L12 18.6 L16.5 21 L15.2 13.4" /></>,
    cap: <><path {...P} d="M12 4 L22 9 L12 14 L2 9 Z" /><path {...P} d="M6.5 11.3 V16 C6.5 17.7 9 19 12 19 C15 19 17.5 17.7 17.5 16 V11.3" /><line {...P} x1="22" y1="9" x2="22" y2="14.5" /></>,
    doc: <><path {...P} d="M6 3 H14.5 L19 7.5 V21 H6 Z" /><path {...P} d="M14.5 3 V7.5 H19" /><line {...P} x1="9" y1="12" x2="16" y2="12" /><line {...P} x1="9" y1="15.5" x2="16" y2="15.5" /></>,
    trend: <><polyline {...P} points="4,17 9.5,11 13,14 20,6.5" /><polyline {...P} points="15,6.5 20,6.5 20,11.5" /></>,
    shield: <><path {...P} d="M12 3 L19.5 6 V11 C19.5 16 16.5 19.5 12 21 C7.5 19.5 4.5 16 4.5 11 V6 Z" /><path {...P} d="M9 11.7 L11.3 14 L15.3 9.5" /></>,
    calc: <><rect {...P} x="5.5" y="3.5" width="13" height="17" rx="2" /><line {...P} x1="9" y1="7.5" x2="15" y2="7.5" /><circle cx="9.3" cy="12" r="1.1" fill={color} /><circle cx="14.7" cy="12" r="1.1" fill={color} /><circle cx="9.3" cy="16.3" r="1.1" fill={color} /><circle cx="14.7" cy="16.3" r="1.1" fill={color} /></>,
    flame: <path {...P} d="M12 3 C13 6 16.5 8 16.5 12.5 C16.5 16 14.5 19 12 19 C9.5 19 7.5 16 7.5 12.5 C7.5 10.5 8.5 9 9.5 8 C9.5 10 10.5 11 11 11 C11 8 11 5 12 3 Z" />,
    chevron: <polyline {...P} points="7,10 12,15 17,10" />,
    arrowR: <><line {...P} x1="4" y1="12" x2="19" y2="12" /><polyline {...P} points="13,6 19,12 13,18" /></>,
    eye: <><path {...P} d="M2.5 12 C5 7.5 8.3 5.5 12 5.5 C15.7 5.5 19 7.5 21.5 12 C19 16.5 15.7 18.5 12 18.5 C8.3 18.5 5 16.5 2.5 12 Z" /><circle {...P} cx="12" cy="12" r="2.8" /></>,
    hand: <><rect {...P} x="4" y="13" width="6" height="7" rx="1.5" /><path {...P} d="M10 15 L14.5 10.5 C15.3 9.7 16.6 9.7 17.4 10.5 C18.2 11.3 18.2 12.6 17.4 13.4 L12.5 18.3 C11.4 19.4 9.9 20 8.4 20" /><path {...P} d="M13 4 L13 8 M11 6 L15 6" /></>,
    seed: <><path {...P} d="M12 21 V11" /><path {...P} d="M12 11 C12 7 9 4.5 5 4.5 C5 8.5 8 11 12 11 Z" /><path {...P} d="M12 13.5 C12 10.5 14.5 8.5 18 8.5 C18 12 15.5 13.5 12 13.5 Z" /></>,
    target: <><circle {...P} cx="12" cy="12" r="8.5" /><circle {...P} cx="12" cy="12" r="4.8" /><circle cx="12" cy="12" r="1.6" fill={color} /></>,
    library: <><line {...P} x1="5" y1="4" x2="5" y2="20" /><line {...P} x1="10" y1="4" x2="10" y2="20" /><path {...P} d="M14 4.5 L18.5 19.5" /><line {...P} x1="3" y1="20" x2="21" y2="20" /></>,
    pie: <><path {...P} d="M12 3 A9 9 0 1 1 3.5 14.5 L12 12 Z" /><path {...P} d="M14 2.5 A9 9 0 0 1 21 9.5 L14 9.5 Z" /></>,
    logout: <><path {...P} d="M14 4 H6 V20 H14" /><line {...P} x1="10" y1="12" x2="21" y2="12" /><polyline {...P} points="17,8 21,12 17,16" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0, display: "block" }}>{paths[name]}</svg>;
}

/* ============================== DATA ============================== */
const sch = (q) => `https://scholar.google.com/scholar?q=${encodeURIComponent(q)}`;

const LIBRARY = [
  { a: "Markowitz, H.", y: 1952, t: "Portfolio Selection", j: "The Journal of Finance", note: "The founding paper of modern portfolio theory: diversification is the only free lunch — combining imperfectly correlated assets lowers risk without lowering expected return." },
  { a: "Sharpe, W.", y: 1964, t: "Capital Asset Prices: A Theory of Market Equilibrium under Conditions of Risk", j: "The Journal of Finance", note: "Introduces the CAPM and the idea that only non-diversifiable (market) risk is compensated — the intellectual basis for index investing." },
  { a: "Fama, E.", y: 1970, t: "Efficient Capital Markets: A Review of Theory and Empirical Work", j: "The Journal of Finance", note: "The efficient markets hypothesis: prices rapidly absorb available information, which is why beating the market consistently is so hard." },
  { a: "Kahneman, D. & Tversky, A.", y: 1979, t: "Prospect Theory: An Analysis of Decision under Risk", j: "Econometrica", note: "Losses hurt roughly twice as much as equivalent gains feel good. The Nobel-winning foundation of behavioral finance — and of most trading mistakes." },
  { a: "Shefrin, H. & Statman, M.", y: 1985, t: "The Disposition to Sell Winners Too Early and Ride Losers Too Long", j: "The Journal of Finance", note: "Names the disposition effect: the systematic tendency to cut winners and hold losers, the inverse of sound trade management." },
  { a: "Jegadeesh, N. & Titman, S.", y: 1993, t: "Returns to Buying Winners and Selling Losers: Implications for Stock Market Efficiency", j: "The Journal of Finance", note: "Documents momentum: past 3–12 month winners tend to keep outperforming — one of the most persistent anomalies in finance." },
  { a: "Odean, T.", y: 1998, t: "Are Investors Reluctant to Realize Their Losses?", j: "The Journal of Finance", note: "Using 10,000 brokerage accounts, shows investors are far more likely to sell winning positions than losing ones — and pay for it." },
  { a: "Barber, B. & Odean, T.", y: 2000, t: "Trading Is Hazardous to Your Wealth: The Common Stock Investment Performance of Individual Investors", j: "The Journal of Finance", note: "Across 66,465 households, the most active traders underperformed the market by about 6.5 percentage points a year. Activity itself was the cost." },
  { a: "Lo, A., Mamaysky, H. & Wang, J.", y: 2000, t: "Foundations of Technical Analysis: Computational Algorithms, Statistical Inference, and Empirical Implementation", j: "The Journal of Finance", note: "A rigorous test of chart patterns: several (including head-and-shoulders variants) carry modest statistical information — context and discipline still decide whether it's tradeable." },
  { a: "Barber, B., Lee, Y., Liu, Y. & Odean, T.", y: 2014, t: "The Cross-Section of Speculator Skill: Evidence from Day Trading", j: "Journal of Financial Markets", note: "Studying the entire Taiwanese market over 15 years: fewer than 1% of day traders earned reliable net profits. The single most important statistic for an aspiring trader." },
  { a: "Harvey, C., Liu, Y. & Zhu, H.", y: 2016, t: "…and the Cross-Section of Expected Returns", j: "The Review of Financial Studies", note: "Hundreds of published 'factors' fail proper statistical scrutiny. Why most backtested edges are mirages of multiple testing." },
  { a: "Gollwitzer, P.", y: 1999, t: "Implementation Intentions: Strong Effects of Simple Plans", j: "American Psychologist", note: "If-then plans dramatically improve follow-through under pressure. The psychology behind writing your trading rules before the trade." },
];

const TRACKS = {
  beginner: {
    label: "Beginner", icon: "seed",
    blurb: "Module I builds first principles: what securities are, how orders work, and the risk rules that keep capital intact.",
    lessons: [
      {
        id: "b1", title: "Equity securities: what you actually own", minutes: 4,
        abstract: "A share of stock is a fractional claim on a firm's residual cash flows and assets. Price is the market's continuously updated estimate of those cash flows' present value.",
        points: [
          "Shareholders earn returns two ways: capital appreciation and dividends. Both ultimately trace back to the firm's earnings power.",
          "Prices move when new information changes expectations — earnings, guidance, macro data, and shifts in the crowd's risk appetite.",
          "Volatility is not malfunction; it is the market repricing uncertainty in real time.",
        ],
        research: [{ f: "Fama's efficient markets work explains why prices react almost instantly to public news: thousands of participants compete to act on information first, leaving little of it unpriced.", c: "Fama (1970)" }],
        refs: [{ a: "Fama, E.", y: 1970, t: "Efficient Capital Markets", j: "The Journal of Finance" }],
        takeaway: "You are buying a claim on a business, not a ticker symbol.", visual: "trend",
      },
      {
        id: "b2", title: "Investing vs. speculation: the evidence", minutes: 6,
        abstract: "The empirical record on short-term retail trading is unambiguous and worth confronting before committing capital to either approach.",
        points: [
          "Investing compounds business value over years; day trading attempts to capture intraday price noise. Different games, different math, different odds.",
          "The academically documented base rate: the overwhelming majority of active retail traders underperform, and the most active underperform the most.",
          "Best practice is sequencing: build a diversified long-term core first, and treat short-term trading as a skill pursued only with strictly fenced-off risk capital.",
        ],
        research: [
          { f: "Tracking 66,465 US households, the most active fifth of traders earned about 6.5 percentage points a year less than the market — trading costs and bad timing consumed their returns.", c: "Barber & Odean (2000)" },
          { f: "Across every day trader in Taiwan over 15 years, fewer than 1% were predictably profitable after costs. Skill exists, but it is rare and concentrated.", c: "Barber, Lee, Liu & Odean (2014)" },
        ],
        refs: [
          { a: "Barber, B. & Odean, T.", y: 2000, t: "Trading Is Hazardous to Your Wealth", j: "The Journal of Finance" },
          { a: "Barber, B. et al.", y: 2014, t: "The Cross-Section of Speculator Skill", j: "Journal of Financial Markets" },
        ],
        takeaway: "Respect the base rates before you bet against them.", visual: "split",
      },
      {
        id: "b3", title: "Market microstructure: orders, spreads, and slippage", minutes: 5,
        abstract: "Every trade transacts against a bid-ask spread. Understanding order types is understanding who controls the price of your fill — you or the market.",
        points: [
          "Market orders prioritize speed and surrender price control; limit orders fix your price and surrender certainty of execution.",
          "The spread is a real, recurring cost. In fast or thinly traded names, market orders can fill far from the quote — that gap is slippage.",
          "Professional default: limit orders for entries, with market orders reserved for urgent exits where being out matters more than the last few cents.",
        ],
        research: [{ f: "Transaction costs — spreads, fees, and market impact — are a primary reason active approaches underperform passive ones in aggregate; society's bill for active investing runs to tens of billions annually.", c: "French (2008)" }],
        refs: [{ a: "French, K.", y: 2008, t: "Presidential Address: The Cost of Active Investing", j: "The Journal of Finance" }],
        takeaway: "Limit orders are seatbelts. Wear them.", visual: "orders",
      },
      {
        id: "b4", title: "The 1% rule and the mathematics of ruin", minutes: 6,
        abstract: "Position-level risk limits exist because losses compound asymmetrically. Survival, not profit, is the first objective of risk management.",
        points: [
          "Cap the loss on any single trade at 1% of total capital. On a $10,000 account, no trade may lose more than $100.",
          "Risk is not position size. Shares = (Account × 1%) ÷ (Entry − Stop). A wide stop forces a small position; a tight stop permits a larger one.",
          "At 1% risk, even 20 consecutive losses — a brutal streak — draws the account down roughly 18%. At 10% risk, the same streak is near-total ruin.",
        ],
        research: [{ f: "Optimal-betting mathematics (the Kelly criterion) shows that over-sizing positions relative to your true edge doesn't just add volatility — beyond a threshold it guarantees long-run ruin even with a winning strategy.", c: "Kelly (1956)" }],
        refs: [{ a: "Kelly, J.", y: 1956, t: "A New Interpretation of Information Rate", j: "Bell System Technical Journal" }],
        takeaway: "Professionals size from risk. Amateurs size from conviction.", visual: "risk",
      },
      {
        id: "b5", title: "Stop losses and the disposition effect", minutes: 5,
        abstract: "The pre-committed exit is the trader's primary defense against the best-documented bias in behavioral finance: the refusal to realize losses.",
        points: [
          "A stop loss is an exit decided before entry, placed below a meaningful chart level — not at a round number that merely 'feels' acceptable.",
          "Once set, a stop is never widened. Widening a stop converts a defined risk into an undefined one at the exact moment judgment is most impaired.",
          "Pair every stop with a profit target of at least twice the risked amount, fixing the trade's geometry in advance.",
        ],
        research: [
          { f: "Prospect theory shows losses are felt roughly twice as intensely as equivalent gains — which is precisely why traders freeze instead of exiting losers.", c: "Kahneman & Tversky (1979)" },
          { f: "In real brokerage data, investors were about 50% more likely to sell a winning position than a losing one, and the losers they kept went on to underperform the winners they sold.", c: "Odean (1998)" },
        ],
        refs: [
          { a: "Kahneman, D. & Tversky, A.", y: 1979, t: "Prospect Theory", j: "Econometrica" },
          { a: "Odean, T.", y: 1998, t: "Are Investors Reluctant to Realize Their Losses?", j: "The Journal of Finance" },
        ],
        takeaway: "The stop loss automates the decision your biases will sabotage.", visual: "stop",
      },
      {
        id: "b6", title: "Diversification and the case for indexing", minutes: 5,
        abstract: "Modern portfolio theory and five decades of fund-performance data converge on the same prescription for a long-term core: broad, cheap, automatic.",
        points: [
          "Combining many imperfectly correlated assets reduces portfolio volatility without proportionally reducing expected return — diversification's 'free lunch'.",
          "Low-cost index funds hold hundreds of firms for a few basis points a year; persistent stock-picking skill that survives fees is rare.",
          "Dollar-cost averaging — fixed amounts on a fixed schedule — removes timing decisions and enforces buying through downturns, when it matters most.",
        ],
        research: [
          { f: "Markowitz formalized why diversification works: portfolio risk depends on how assets move together, not just how risky each is alone.", c: "Markowitz (1952)" },
          { f: "Decomposing mutual fund returns into luck versus skill, very few active managers demonstrate enough skill to cover their own costs.", c: "Fama & French (2010)" },
        ],
        refs: [
          { a: "Markowitz, H.", y: 1952, t: "Portfolio Selection", j: "The Journal of Finance" },
          { a: "Fama, E. & French, K.", y: 2010, t: "Luck versus Skill in the Cross-Section of Mutual Fund Returns", j: "The Journal of Finance" },
        ],
        takeaway: "Boring, automatic, diversified — that is what compounds.", visual: "pie",
      },
      {
        id: "b7", title: "Simulated practice and deliberate skill-building", minutes: 4,
        abstract: "Expertise research is clear: skill develops through structured practice with immediate feedback — which is exactly what a journaled paper-trading regimen provides.",
        points: [
          "Log 50–100 simulated trades before risking capital: setup, entry, stop, target, outcome, and emotional state for each.",
          "Review weekly. Recurring errors — chasing, oversizing, premature exits — become visible in the data around trade 30.",
          "Transition to real money only after sustained simulated profitability, then start at minimum size: live execution introduces fear and greed the simulator cannot.",
        ],
        research: [{ f: "Studies of expert performance find that what separates experts is not hours alone but deliberate practice: focused repetition with feedback against explicit standards — the function a trading journal serves.", c: "Ericsson, Krampe & Tesch-Römer (1993)" }],
        refs: [{ a: "Ericsson, K. et al.", y: 1993, t: "The Role of Deliberate Practice in the Acquisition of Expert Performance", j: "Psychological Review" }],
        takeaway: "Tuition paid in simulated money is the cheapest education in markets.", visual: "journal",
      },
    ],
  },
  intermediate: {
    label: "Intermediate", icon: "trend",
    blurb: "Module II develops the quantitative core: expectancy, position mathematics, chart literacy, and the regulatory and behavioral terrain.",
    lessons: [
      {
        id: "i1", title: "Position sizing as a mathematical discipline", minutes: 6,
        abstract: "Share count is an output, never an input. Every professional sizing framework derives quantity from pre-defined risk.",
        points: [
          "Shares = Risk$ ÷ (Entry − Stop). The stop's distance dictates size; conviction dictates nothing.",
          "Cap aggregate open risk as well: many professionals keep the combined risk of all open positions under 3–5% of capital.",
          "Volatile instruments demand wider stops, which automatically force smaller positions — the formula self-adjusts to the terrain.",
        ],
        research: [{ f: "Betting-theory results show position size has an optimum: bet too large relative to your edge and growth turns negative even when each individual bet is favorable.", c: "Kelly (1956)" }],
        refs: [{ a: "Kelly, J.", y: 1956, t: "A New Interpretation of Information Rate", j: "Bell System Technical Journal" }],
        takeaway: "Conviction selects the trade. Mathematics selects the size.", visual: "risk",
      },
      {
        id: "i2", title: "Expectancy: the only number that matters", minutes: 6,
        abstract: "A strategy's long-run profitability is fully described by one equation. Win rate alone is a vanity metric.",
        points: [
          "Expectancy = (Win% × Average Win) − (Loss% × Average Loss). Positive expectancy, repeated, is the entire business.",
          "A 40% win rate with 2.5:1 reward-to-risk outperforms a 65% win rate at 0.8:1. Run both through the Tools tab and verify.",
          "Demand a minimum 2:1 reward-to-risk at entry; it grants the breathing room to be wrong more often than right and still profit.",
        ],
        research: [{ f: "The behavioral pull toward high win rates is prospect theory in action: frequent small wins feel better than the math performs. Profitable traders invert this preference deliberately.", c: "Kahneman & Tversky (1979)" }],
        refs: [{ a: "Kahneman, D. & Tversky, A.", y: 1979, t: "Prospect Theory", j: "Econometrica" }],
        takeaway: "Win rate is vanity. Expectancy is sanity.", visual: "rr",
      },
      {
        id: "i3", title: "Price action: candlesticks, levels, and what the evidence supports", minutes: 7,
        abstract: "Technical analysis occupies contested academic ground. The honest position: some patterns carry modest information, and none replace risk management.",
        points: [
          "A candle encodes open, high, low, close. Bodies express conviction; wicks express rejection of an attempted price.",
          "Support and resistance are zones of repeated historical reversal — the only logical places to anchor stops and entries.",
          "A pattern's location is its meaning. A hammer into multi-touch support is information; the same candle mid-range is noise. Drill this in Practice → Patterns.",
        ],
        research: [{ f: "Applying statistical pattern-recognition to decades of US stocks, several classic chart patterns were found to carry incremental information about return distributions — real, but modest, and far from a standalone system.", c: "Lo, Mamaysky & Wang (2000)" }],
        refs: [{ a: "Lo, A., Mamaysky, H. & Wang, J.", y: 2000, t: "Foundations of Technical Analysis", j: "The Journal of Finance" }],
        takeaway: "Location first, pattern second, confirmation third.", visual: "candle",
      },
      {
        id: "i4", title: "The regulatory and cost environment", minutes: 6,
        abstract: "Rules, taxes, and frictions are parameters of the strategy, not afterthoughts. Several are specifically designed around retail day trading.",
        points: [
          "US Pattern Day Trader rule: four or more day trades within five business days in a margin account under $25,000 triggers trading restrictions.",
          "Short-term capital gains (under one year) are taxed as ordinary income — a structural headwind that long-term investors don't face.",
          "Margin amplifies losses precisely when judgment is worst. The professional beginner's allocation to leverage is zero.",
        ],
        research: [{ f: "Aggregate evidence on trading costs shows frictions — spreads, fees, taxes, and impact — are the decisive gap between gross and net returns for active participants.", c: "French (2008)" }],
        refs: [{ a: "French, K.", y: 2008, t: "The Cost of Active Investing", j: "The Journal of Finance" }],
        takeaway: "Net of costs is the only P&L that exists.", visual: "rules",
      },
      {
        id: "i5", title: "Behavioral finance applied: your documented biases", minutes: 6,
        abstract: "The major retail trading errors are not random; they are systematic, predicted by theory, and visible in brokerage data. Knowing them is the first countermeasure.",
        points: [
          "Disposition effect: the urge to sell winners and hold losers. Countermeasure: mechanical stops and targets set pre-entry.",
          "Revenge trading after losses converts a planned 1R loss into an unplanned disaster. Countermeasure: a hard daily loss limit (e.g., 3%) that ends the session unconditionally.",
          "Overconfidence rises with activity. Countermeasure: a written plan that defines the only setups you are permitted to take.",
        ],
        research: [
          { f: "Investors in large brokerage samples realized gains at far higher rates than losses, and their overall returns suffered for it.", c: "Odean (1998)" },
          { f: "Higher trading frequency correlated strongly with worse net performance across tens of thousands of households — overconfidence has a measurable price.", c: "Barber & Odean (2000)" },
        ],
        refs: [
          { a: "Odean, T.", y: 1998, t: "Are Investors Reluctant to Realize Their Losses?", j: "The Journal of Finance" },
          { a: "Barber, B. & Odean, T.", y: 2000, t: "Trading Is Hazardous to Your Wealth", j: "The Journal of Finance" },
        ],
        takeaway: "Trade your plan, or your biases will trade for you.", visual: "brain",
      },
      {
        id: "i6", title: "The trading journal as a research instrument", minutes: 5,
        abstract: "A journal converts anecdote into data. It is the only tool that lets you study the one strategy that matters: your own, as actually executed.",
        points: [
          "Record per trade: setup type, entry, stop, target, size, R-multiple result, plan adherence, and emotional state.",
          "Grade process, not outcome. A planned loss executed correctly is an A; an unplanned win is a C that teaches bad habits.",
          "Monthly, compute your real expectancy from the journal and compare it to your assumed one. The gap is your curriculum.",
        ],
        research: [{ f: "Goal-setting research shows specific, measured standards with feedback loops reliably improve performance over vague intentions — the journal operationalizes exactly that.", c: "Locke & Latham (2002)" }],
        refs: [{ a: "Locke, E. & Latham, G.", y: 2002, t: "Building a Practically Useful Theory of Goal Setting", j: "American Psychologist" }],
        takeaway: "The journal is the mirror your P&L cannot be.", visual: "journal",
      },
    ],
  },
  advanced: {
    label: "Advanced", icon: "target",
    blurb: "Module III stress-tests the edge: backtest validity, volatility regimes, drawdown control, and defense against manipulation.",
    lessons: [
      {
        id: "a1", title: "Backtesting and the multiple-testing trap", minutes: 7,
        abstract: "Most discovered 'edges' are statistical artifacts. The literature on backtest overfitting is among the most practically important reading for any systematic trader.",
        points: [
          "Test simple, pre-written rules out-of-sample. Every parameter you tune to the past increases the odds you've memorized noise.",
          "Include costs, slippage, and realistic fills; most paper edges die at this step alone.",
          "Treat a backtest as a hypothesis filter, not a profit forecast. Forward-test small before believing anything.",
        ],
        research: [
          { f: "Re-examining hundreds of published return 'factors' under proper multiple-testing corrections, the majority fail — academic finance itself has an overfitting problem.", c: "Harvey, Liu & Zhu (2016)" },
          { f: "Researchers demonstrated mathematically how easy it is to produce a spectacular backtest from pure noise by trying enough configurations — and named the practice charlatanism.", c: "Bailey et al. (2014)" },
        ],
        refs: [
          { a: "Harvey, C., Liu, Y. & Zhu, H.", y: 2016, t: "…and the Cross-Section of Expected Returns", j: "Review of Financial Studies" },
          { a: "Bailey, D. et al.", y: 2014, t: "Pseudo-Mathematics and Financial Charlatanism", j: "Notices of the AMS" },
        ],
        takeaway: "If it only works in hindsight, it does not work.", visual: "trend",
      },
      {
        id: "a2", title: "Volatility, liquidity, and regime-aware sizing", minutes: 6,
        abstract: "The same setup carries different risk in different regimes. Average True Range and liquidity metrics let sizing adapt mechanically.",
        points: [
          "ATR quantifies a stock's normal movement; a stop inside one ATR is positioned to be hit by noise rather than by being wrong.",
          "Illiquid and low-float names gap and slip violently — liquidity is a risk dimension as real as direction.",
          "In high-volatility regimes, the sizing formula self-corrects: wider stops, smaller positions, identical dollar risk.",
        ],
        research: [{ f: "Illiquidity is a priced risk: harder-to-trade stocks must offer higher expected returns to compensate, and their trading costs spike exactly when you most need to exit.", c: "Amihud (2002)" }],
        refs: [{ a: "Amihud, Y.", y: 2002, t: "Illiquidity and Stock Returns", j: "Journal of Financial Markets" }],
        takeaway: "Adjust to the market's energy, or it adjusts you.", visual: "candle",
      },
      {
        id: "a3", title: "Scaling: structured entries and exits", minutes: 5,
        abstract: "Partial exits and planned adds can improve the equity curve's geometry — but only when written into the plan before entry.",
        points: [
          "Scaling out at targets banks profit while a remainder runs, trading some expectancy for a smoother curve and steadier psychology.",
          "Averaging down without pre-defined structure is the disposition effect with leverage — the mechanism behind most catastrophic retail losses.",
          "Any add must keep total position risk inside the original per-trade cap. The plan scales; hope doubles down.",
        ],
        research: [{ f: "The documented tendency to add to losers rather than winners is the disposition effect compounding itself — brokerage data shows the positions investors add to underperform the ones they trim.", c: "Odean (1998)" }],
        refs: [{ a: "Odean, T.", y: 1998, t: "Are Investors Reluctant to Realize Their Losses?", j: "The Journal of Finance" }],
        takeaway: "Plans scale. Hope doubles down.", visual: "rr",
      },
      {
        id: "a4", title: "Drawdown mathematics and circuit breakers", minutes: 6,
        abstract: "Recovery requirements grow nonlinearly with drawdown depth. Capital preservation rules are therefore asymmetrically valuable.",
        points: [
          "A 20% drawdown needs +25% to recover; 50% needs +100%; 75% needs +300%. The math of losing is brutally convex.",
          "Install circuit breakers: down 3% in a day, stop trading; down 6–8% in a month, halve size until the curve recovers.",
          "In drawdown, the objective function changes from maximizing gain to surviving small. Edge returns; blown accounts do not.",
        ],
        research: [{ f: "Volatility drag is arithmetic, not opinion: a sequence of +50%/−50% returns loses 25% of capital. Reducing variance directly raises compounded growth for the same average return.", c: "standard result; see Markowitz (1952)" }],
        refs: [{ a: "Markowitz, H.", y: 1952, t: "Portfolio Selection", j: "The Journal of Finance" }],
        takeaway: "Defense is the offense that keeps you in the game.", visual: "stop",
      },
      {
        id: "a5", title: "Market manipulation: a field guide", minutes: 5,
        abstract: "Manipulation is empirically documented, prosecuted, and aimed disproportionately at the instruments retail speculators favor.",
        points: [
          "Pump-and-dump anatomy: accumulate quietly, promote loudly, distribute into the induced demand. Low-float small caps are the preferred vehicle.",
          "Paid promotion, urgency, 'guaranteed' returns, and unverifiable screenshots are the reliable tells. Real edge is not retailed for $99.",
          "The one-sentence test: if you cannot state a falsifiable reason a trade should work, you do not have a reason — you have someone else's exit liquidity.",
        ],
        research: [{ f: "A systematic study of SEC manipulation cases found manipulated stocks are disproportionately small, illiquid, and information-poor — and that manipulators profit precisely by inducing others to chase.", c: "Aggarwal & Wu (2006)" }],
        refs: [{ a: "Aggarwal, R. & Wu, G.", y: 2006, t: "Stock Market Manipulations", j: "The Journal of Business" }],
        takeaway: "If it sounds too good to be true, you are the exit liquidity.", visual: "rules",
      },
      {
        id: "a6", title: "The written trading plan: implementation intentions", minutes: 6,
        abstract: "A one-page document separating professionals from gamblers, with direct support from the psychology of self-regulation.",
        points: [
          "Contents: markets traded, permitted setups (with criteria), risk per trade, daily and monthly loss limits, review cadence.",
          "Format every rule as if-then: 'If price closes below the stop level, then I exit at market.' Pre-loaded decisions execute under pressure; deliberation does not.",
          "Amend rules only at scheduled reviews, with journal evidence — never mid-trade, never mid-drawdown.",
        ],
        research: [{ f: "Implementation intentions — pre-committed if-then plans — roughly double goal attainment rates across domains by delegating action control to the situation rather than to willpower in the moment.", c: "Gollwitzer (1999)" }],
        refs: [{ a: "Gollwitzer, P.", y: 1999, t: "Implementation Intentions: Strong Effects of Simple Plans", j: "American Psychologist" }],
        takeaway: "Amateurs have opinions. Professionals have documents.", visual: "journal",
      },
    ],
  },
};

const QUIZ_BANK = {
  beginner: [
    { q: "Your account is $5,000. Under the 1% rule, your maximum loss on one trade is:", options: ["$500", "$50", "$5", "$1,000"], answer: 1, why: "1% of $5,000 is $50. The rule caps your loss per trade — position size is then derived from it." },
    { q: "You want to buy a fast-moving stock without overpaying. The appropriate order type is:", options: ["Market order", "Limit order", "Stop order", "Whichever fills fastest"], answer: 1, why: "Limit orders fix your price. Market orders in fast tape can fill far from the quote — that gap is slippage." },
    { q: "Per Barber & Odean (2000), the most active retail traders in their 66,465-household sample:", options: ["Beat the market by 6.5 points", "Matched the market", "Underperformed by about 6.5 points annually", "Were not studied"], answer: 2, why: "Activity itself was the cost: trading frictions and poor timing consumed roughly 6.5 percentage points a year." },
    { q: "Price reaches your stop loss. Best practice is to:", options: ["Move the stop lower", "Average down", "Let it trigger and exit", "Remove the stop"], answer: 2, why: "The stop encoded a decision made with a clear head. Widening it converts defined risk into undefined risk at the worst moment." },
    { q: "The evidence-backed default for long-term wealth building is:", options: ["Concentrated stock picks", "Active day trading", "Low-cost diversified index funds with regular contributions", "Holding cash for a crash"], answer: 2, why: "Markowitz's diversification math plus decades of fund data: broad, cheap, and automatic wins after costs for nearly everyone." },
    { q: "Before trading real capital, the recommended preparation is:", options: ["A weekend of videos", "50–100 journaled simulated trades over 2–3 months", "One mentor's hot list", "Opening a margin account"], answer: 1, why: "Deliberate practice with feedback (Ericsson et al., 1993) is how skill forms. The journal is the feedback mechanism." },
  ],
  intermediate: [
    { q: "Entry $50.00, stop $48.00, risk budget $100. Correct position size:", options: ["100 shares", "50 shares", "2 shares", "200 shares"], answer: 1, why: "$100 ÷ ($50 − $48) = 50 shares. Quantity is the output of the risk equation, never the input." },
    { q: "A 40% win rate is profitable when:", options: ["Trade frequency rises", "Average win sufficiently exceeds average loss", "Leverage is added", "It cannot be"], answer: 1, why: "Expectancy = (Win% × AvgWin) − (Loss% × AvgLoss). At 2.5:1 reward-to-risk, 40% wins is a strong business." },
    { q: "Per Lo, Mamaysky & Wang (2000), classic chart patterns:", options: ["Are pure superstition", "Carry modest statistical information, context-dependent", "Guarantee profits", "Only work in crypto"], answer: 1, why: "Their pattern-recognition study found real but modest informativeness — supportive of disciplined use, fatal to blind faith." },
    { q: "The disposition effect (Shefrin & Statman, 1985) describes the tendency to:", options: ["Diversify too much", "Sell winners early and ride losers", "Trade too rarely", "Ignore dividends"], answer: 1, why: "Odean (1998) measured it in brokerage data: investors realized gains far more readily than losses, to their detriment." },
    { q: "The US Pattern Day Trader rule restricts margin accounts under $25,000 that execute:", options: ["Any day trade", "4+ day trades within 5 business days", "10 trades per month", "Options trades"], answer: 1, why: "Four or more day trades in five business days triggers PDT status and trading restrictions." },
    { q: "After two consecutive losses you feel compelled to win it back immediately. The professional response:", options: ["Increase size", "Stop for the day — this is revenge trading", "Switch tickers", "Widen stops"], answer: 1, why: "A hard daily loss limit exists precisely for this moment. Revenge trading converts planned 1R losses into unplanned disasters." },
  ],
  advanced: [
    { q: "A backtest looks spectacular after tuning nine parameters to historical data. Per Bailey et al. (2014), this is most likely:", options: ["A durable edge", "Backtest overfitting — noise memorized as signal", "Alpha", "Ready for size"], answer: 1, why: "Enough configurations will always produce a beautiful curve from randomness. Out-of-sample validation with simple rules is the antidote." },
    { q: "A stock's ATR is $2.40. A $0.50 stop is:", options: ["Tight and efficient", "Inside normal noise — positioned to be hit randomly", "Irrelevant to sizing", "Only for shorts"], answer: 1, why: "Stops inside one ATR get tagged by ordinary fluctuation. Widen the stop and shrink the size; dollar risk stays constant." },
    { q: "A 50% drawdown requires what return to recover?", options: ["50%", "75%", "100%", "150%"], answer: 2, why: "$10,000 → $5,000 is −50%; the road back is +100%. The convexity of recovery is the entire case for drawdown control." },
    { q: "Per Harvey, Liu & Zhu (2016), most published return factors:", options: ["Replicate robustly", "Fail proper multiple-testing scrutiny", "Are tradeable at retail", "Concern only bonds"], answer: 1, why: "Hundreds of 'discoveries' shrink or vanish under corrected significance thresholds — a caution for every backtester." },
    { q: "Aggarwal & Wu (2006) found manipulated stocks are disproportionately:", options: ["Large-cap and liquid", "Small, illiquid, and information-poor", "Dividend payers", "Index members"], answer: 1, why: "Manipulation needs thin liquidity and scarce information to move price — exactly the profile of hyped low-float names." },
    { q: "Your plan caps daily losses at 3%; you're down 3% with two setups remaining. You:", options: ["Take only the best one", "Take both at half size", "Stop — the limit is unconditional", "Switch to options"], answer: 2, why: "Gollwitzer (1999): pre-committed if-then rules work because they execute without deliberation. A negotiable circuit breaker is not a circuit breaker." },
  ],
};

const PATTERNS = [
  { name: "Hammer", candles: [[70,72,66,67],[66,67,58,60],[59,61,52,54],[53,55,40,52]], options: ["Hammer", "Shooting star", "Doji", "Bearish engulfing"], answer: 0, hint: "Note the long lower wick after a decline.", why: "Small body at the top, long lower wick, after a downtrend: sellers drove price down and buyers rejected it forcefully." },
  { name: "Bullish engulfing", candles: [[62,64,55,57],[56,58,49,51],[49,52,46,48],[46,60,45,59]], options: ["Doji", "Bullish engulfing", "Hammer", "Morning star"], answer: 1, hint: "Compare the final body to the one before it.", why: "The final body completely engulfs the prior bearish body — demand overwhelmed the previous session's entire range." },
  { name: "Doji", candles: [[40,46,38,44],[44,50,43,49],[49,55,48,53],[53,56,49,53]], options: ["Hammer", "Marubozu", "Doji", "Bearish engulfing"], answer: 2, hint: "Where did the final candle open versus close?", why: "Open ≈ close with wicks both sides: equilibrium. After a sustained advance, indecision often precedes a turn — wait for confirmation." },
  { name: "Shooting star", candles: [[40,43,38,42],[42,46,41,45],[45,49,44,48],[48,62,47,49]], options: ["Hammer", "Shooting star", "Bullish engulfing", "Doji"], answer: 1, hint: "The long wick points up this time, after a rally.", why: "Long upper wick, small body at the lows, after an advance: buyers attempted continuation and were rejected hard." },
  { name: "Bearish engulfing", candles: [[40,44,38,43],[43,47,42,46],[46,50,45,49],[51,52,38,40]], options: ["Bearish engulfing", "Hammer", "Morning star", "Doji"], answer: 0, hint: "The final body swallows the prior one — which direction?", why: "A bearish body engulfs the prior bullish body at the highs — supply just erased the buyers' entire prior session." },
  { name: "Morning star", candles: [[64,66,55,57],[56,58,47,49],[47,49,44,46],[47,60,46,58]], options: ["Evening star", "Doji", "Morning star", "Shooting star"], answer: 2, hint: "Three acts: decline, pause, reversal.", why: "Decline, then a small indecision candle, then a strong advance — sellers exhausting and buyers assuming control across three sessions." },
];

const GLOSSARY = [
  ["Bid / Ask", "The highest price buyers will pay vs. the lowest sellers will accept. The gap is the spread — a recurring cost on every round trip."],
  ["Stop loss", "A pre-committed exit price for a losing position. Decided before entry; never widened after."],
  ["Limit order", "An order that executes only at your price or better. Price control over execution certainty."],
  ["Position sizing", "Deriving share count from risk: Shares = Risk$ ÷ (Entry − Stop)."],
  ["R-multiple", "Result measured in units of initial risk. Risk $100, gain $250 → +2.5R."],
  ["Expectancy", "(Win% × avg win) − (Loss% × avg loss). The per-trade economics of a strategy."],
  ["Drawdown", "Decline from the equity peak. A 50% drawdown requires +100% to recover."],
  ["ATR", "Average True Range — a stock's typical movement. Stops inside 1 ATR invite random exits."],
  ["Slippage", "Difference between expected and actual fill price. Largest in fast or thin markets."],
  ["PDT rule", "US regulation: 4+ day trades in 5 business days in a sub-$25K margin account triggers restrictions."],
  ["Disposition effect", "The documented bias toward selling winners early and holding losers (Shefrin & Statman, 1985)."],
  ["Dollar-cost averaging", "Investing fixed amounts on a fixed schedule, removing timing decisions."],
  ["Float", "Shares genuinely available to trade. Low float invites violent, manipulable moves."],
  ["Profit factor", "Gross profits ÷ gross losses. Above 1.5 is generally considered robust."],
];

const LEVELS = [
  { id: "beginner", title: "Just starting out", desc: "New to markets, or only dabbled.", icon: "seed" },
  { id: "intermediate", title: "I know the basics", desc: "Some experience — ready for structure.", icon: "trend" },
  { id: "advanced", title: "Experienced", desc: "Trading with rules; sharpening the edge.", icon: "target" },
];
const STYLES = [
  { id: "visual", title: "Show me", desc: "Charts, diagrams, and patterns first.", icon: "eye" },
  { id: "reading", title: "Teach me", desc: "Rigorous written lessons and references.", icon: "book" },
  { id: "hands", title: "Let me try", desc: "Learning by doing in the simulator.", icon: "hand" },
];

/* ============================== SHARED ============================== */
const Card = ({ children, style, className, onClick }) => (
  <div onClick={onClick} className={className} style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 8, padding: 22, ...style }}>{children}</div>
);
const Btn = ({ children, kind = "primary", style, ...rest }) => {
  const kinds = {
    primary: { background: T.emerald, color: T.bg, border: `1px solid ${T.emerald}` },
    ink: { background: T.ink, color: T.bg, border: `1px solid ${T.ink}` },
    gold: { background: T.gold, color: T.ink, border: `1px solid ${T.gold}` },
    ghost: { background: "transparent", color: T.ink, border: `1px solid ${T.line}` },
    burgundy: { background: T.burgundy, color: T.bg, border: `1px solid ${T.burgundy}` },
  };
  return <button {...rest} style={{ borderRadius: 4, padding: "14px 28px", fontWeight: 500, fontSize: 11, cursor: "pointer", letterSpacing: "0.15em", textTransform: "uppercase", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "letter-spacing .2s ease, opacity .2s ease", ...kinds[kind], ...style }}>{children}</button>;
};
const Eyebrow = ({ children, color = T.burgundy }) => <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color, marginBottom: 8, fontFamily: sans }}>{children}</div>;
const H1 = ({ children, style }) => <h1 style={{ fontFamily: serif, fontSize: 36, fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.05, margin: 0, color: T.ink, ...style }}>{children}</h1>;
const SectionLabel = ({ children }) => <div style={{ fontSize: 11.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".18em", color: T.grey, marginBottom: 12, fontFamily: sans }}>{children}</div>;
const SubNav = ({ items, active, onPick }) => (
  <div style={{ display: "inline-flex", gap: 4, background: T.bg, border: `1px solid ${T.line}`, borderRadius: 999, padding: 4, flexWrap: "wrap" }}>
    {items.map(([id, label]) => (
      <button key={id} onClick={() => onPick(id)} style={{ border: "none", borderRadius: 999, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", background: active === id ? T.ink : "transparent", color: active === id ? T.bg : T.grey }}>{label}</button>
    ))}
  </div>
);
const fmt$ = (n, d = 0) => "$" + n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });
const lbl = { fontSize: 12, color: T.grey, display: "block", marginBottom: 5, fontWeight: 700, fontFamily: sans };
const inputS = { width: "100%", padding: "12px 14px", borderRadius: 8, border: `1px solid ${T.line}`, fontSize: 15, fontFamily: mono, background: T.surface, color: T.ink };

/* Lesson visuals */
function LessonVisual({ type }) {
  const wrap = (inner) => <svg viewBox="0 0 220 80" style={{ width: "100%", maxWidth: 320, height: "auto", display: "block", margin: "4px 0 16px" }}><rect width="220" height="80" rx="10" fill={T.bgAlt} />{inner}</svg>;
  switch (type) {
    case "trend": return wrap(<><polyline points="14,62 50,50 80,56 120,34 160,40 206,16" fill="none" stroke={T.gold} strokeWidth="3.5" strokeLinecap="round" /><circle cx="206" cy="16" r="4" fill={T.burgundy} /></>);
    case "split": return wrap(<><polyline points="14,58 60,40 110,52 160,28 206,36" fill="none" stroke={T.burgundy} strokeWidth="2.5" /><polyline points="14,64 206,30" fill="none" stroke={T.gold} strokeWidth="3.5" strokeLinecap="round" /></>);
    case "orders": return wrap(<><line x1="20" y1="40" x2="200" y2="40" stroke={T.ink} strokeWidth="1.5" strokeDasharray="4 4" /><rect x="58" y="20" width="40" height="14" rx="7" fill={T.gold} /><rect x="124" y="46" width="40" height="14" rx="7" fill={T.burgundy} opacity="0.85" /></>);
    case "risk": return wrap(<>{[...Array(10)].map((_, i) => <rect key={i} x={16 + i * 19} y={i === 7 ? 18 : 34} width="12" height={i === 7 ? 44 : 28} rx="4" fill={i === 7 ? T.burgundy : T.gold} opacity={i === 7 ? 1 : 0.75} />)}</>);
    case "stop": return wrap(<><polyline points="14,28 60,38 100,32 140,48 206,58" fill="none" stroke={T.ink} strokeWidth="2.5" /><line x1="14" y1="52" x2="206" y2="52" stroke={T.burgundy} strokeWidth="2.5" strokeDasharray="5 4" /><circle cx="155" cy="52" r="5" fill={T.burgundy} /></>);
    case "pie": return wrap(<><circle cx="60" cy="40" r="26" fill={T.gold} /><path d="M60 40 L60 14 A26 26 0 0 1 84 48 Z" fill={T.burgundy} opacity="0.9" /><path d="M60 40 L84 48 A26 26 0 0 1 48 63 Z" fill={T.ink} opacity="0.85" /><rect x="110" y="22" width="90" height="8" rx="4" fill={T.ink} opacity="0.18" /><rect x="110" y="38" width="70" height="8" rx="4" fill={T.ink} opacity="0.18" /><rect x="110" y="54" width="80" height="8" rx="4" fill={T.ink} opacity="0.18" /></>);
    case "journal": return wrap(<><rect x="60" y="12" width="100" height="58" rx="8" fill={T.card} stroke={T.ink} strokeWidth="1.5" /><line x1="74" y1="28" x2="146" y2="28" stroke={T.gold} strokeWidth="4" strokeLinecap="round" /><line x1="74" y1="42" x2="132" y2="42" stroke={T.ink} strokeWidth="2.5" opacity="0.25" strokeLinecap="round" /><line x1="74" y1="54" x2="140" y2="54" stroke={T.ink} strokeWidth="2.5" opacity="0.25" strokeLinecap="round" /></>);
    case "rr": return wrap(<><rect x="40" y="44" width="46" height="20" rx="5" fill={T.burgundy} opacity="0.9" /><rect x="120" y="14" width="46" height="50" rx="5" fill={T.gold} /><text x="63" y="58" textAnchor="middle" fontSize="11" fontWeight="800" fill={T.bg} fontFamily={sans}>1R</text><text x="143" y="44" textAnchor="middle" fontSize="11" fontWeight="800" fill={T.ink} fontFamily={sans}>2R+</text></>);
    case "candle": return wrap(<>{[[30, 28, 18, 50, 1], [70, 22, 14, 44, 0], [110, 30, 12, 40, 1], [150, 18, 22, 52, 0], [186, 26, 16, 46, 1]].map(([x, y, bh, wh, up], i) => <g key={i}><line x1={x} y1={y - 6} x2={x} y2={y + wh} stroke={T.ink} strokeWidth="1.5" /><rect x={x - 7} y={y} width="14" height={bh} rx="2" fill={up ? T.gold : T.burgundy} /></g>)}</>);
    case "rules": return wrap(<><rect x="76" y="12" width="68" height="56" rx="8" fill={T.card} stroke={T.ink} strokeWidth="1.5" /><circle cx="110" cy="32" r="10" fill={T.burgundy} opacity="0.9" /><rect x="104" y="30.5" width="12" height="3" rx="1.5" fill={T.card} /><line x1="90" y1="52" x2="130" y2="52" stroke={T.ink} strokeWidth="2.5" opacity="0.25" strokeLinecap="round" /></>);
    case "brain": return wrap(<><circle cx="110" cy="40" r="24" fill={T.gold} /><path d="M98 40 q6 -12 12 0 q6 12 12 0" fill="none" stroke={T.ink} strokeWidth="2.5" strokeLinecap="round" /><circle cx="166" cy="26" r="3" fill={T.burgundy} /><circle cx="54" cy="54" r="3" fill={T.burgundy} /></>);
    default: return null;
  }
}

/* ============================== CANDLE CHART ============================== */
function genCandles(n = 36, start = 84) {
  const out = []; let c = start;
  for (let i = 0; i < n; i++) {
    const o = c; c = Math.max(8, o + (Math.random() - 0.49) * 1.8);
    out.push({ o, h: Math.max(o, c) + Math.random() * 0.7, l: Math.min(o, c) - Math.random() * 0.7, c });
  }
  return out;
}
function CandleChart({ candles, stopLine, avgLine, targetLine }) {
  const W = 680, H = 230, pad = 8;
  const lo = Math.min(...candles.map((k) => k.l), stopLine || Infinity) - 0.6;
  const hi = Math.max(...candles.map((k) => k.h), targetLine || -Infinity, avgLine || -Infinity) + 0.6;
  const y = (v) => H - pad - ((v - lo) / (hi - lo)) * (H - pad * 2);
  const cw = W / candles.length;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
      {[0.25, 0.5, 0.75].map((f) => <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} stroke={T.line} strokeWidth="1" />)}
      {candles.map((k, i) => {
        const up = k.c >= k.o, x = i * cw + cw / 2;
        return (<g key={i}>
          <line x1={x} x2={x} y1={y(k.h)} y2={y(k.l)} stroke={up ? T.goldDeep : T.burgundy} strokeWidth="1.4" />
          <rect x={x - cw * 0.32} y={y(Math.max(k.o, k.c))} width={cw * 0.64} height={Math.max(2, Math.abs(y(k.o) - y(k.c)))} rx="2" fill={up ? T.gold : T.burgundy} />
        </g>);
      })}
      {avgLine && <line x1="0" x2={W} y1={y(avgLine)} y2={y(avgLine)} stroke={T.ink} strokeWidth="1.4" strokeDasharray="2 5" opacity="0.55" />}
      {targetLine && <line x1="0" x2={W} y1={y(targetLine)} y2={y(targetLine)} stroke={T.gold} strokeWidth="1.6" strokeDasharray="6 4" />}
      {stopLine && <line x1="0" x2={W} y1={y(stopLine)} y2={y(stopLine)} stroke={T.burgundy} strokeWidth="1.6" strokeDasharray="6 4" />}
    </svg>
  );
}

/* ============================== ONBOARDING ============================== */
function Logo({ size = 36 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.28, background: T.gold, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg viewBox="0 0 24 24" width={size * 0.58} height={size * 0.58}>
        <path d="M4 17 L10 10 L14 13 L20 5" fill="none" stroke={T.ink} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 5 H20 V10" fill="none" stroke={T.ink} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function Welcome({ onNext, embedded }) {
  return (
    <div style={{ minHeight: embedded ? "calc(100vh - 68px)" : "100vh", background: T.bg, display: "flex", flexDirection: "column" }}>
      {!embedded && (
        <div style={{ padding: "24px 28px", display: "flex", alignItems: "center", gap: 11 }}>
          <Logo /><span style={{ fontWeight: 600, fontSize: 18, letterSpacing: "-0.04em" }}>TradeAid</span>
        </div>
      )}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 24px 80px", textAlign: "center" }}>
        <div className="rise" style={{ maxWidth: 720 }}>
          <Eyebrow>Learn first. Trade later.</Eyebrow>
          <h1 style={{ fontFamily: serif, fontSize: "clamp(44px, 7vw, 76px)", fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.02, margin: "0 0 24px", color: T.ink }}>
            The market is a skill,<br />not a <em style={{ fontStyle: "italic", color: T.goldDeep, fontWeight: 400 }}>slot machine</em>.
          </h1>
          <p style={{ fontSize: 16.5, color: T.grey, lineHeight: 1.65, margin: "0 auto 30px", maxWidth: 460 }}>
            A research-grounded curriculum on investing and trading best practices — peer-reviewed evidence, a coached simulator, and a professional toolkit. No real money at risk.
          </p>
          <Btn onClick={onNext} style={{ padding: "15px 42px", fontSize: 15.5 }}>Get started <Icon name="arrowR" size={16} /></Btn>
        </div>
        <div className="rise3" style={{ display: "flex", gap: 30, marginTop: 54, flexWrap: "wrap", justifyContent: "center" }}>
          {[["19", "lessons across 3 modules"], ["12", "papers in the library"], ["7", "professional tools"]].map(([n, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: mono, fontSize: 23, fontWeight: 600 }}>{n}</div>
              <div style={{ fontSize: 12.5, color: T.grey }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AuthScreen({ onAuth, intent }) {
  const [mode, setMode] = useState(null);
  const [name, setName] = useState(""); const [email, setEmail] = useState("");
  const [touched, setTouched] = useState({ name: false, email: false });
  const [sending, setSending] = useState(false);
  const nameOk = name.trim().length >= 2;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const canContinue = nameOk && emailOk;

  const submitEmail = async () => {
    if (!canContinue) { setTouched({ name: true, email: true }); return; }
    setSending(true);
    // Sign-in intent: fire the security notice now. Sign-up: welcome is sent later
    // once we know the learning style (handled by the main TradeAid shell).
    if (intent === "signin") {
      try {
        await fetch("/api/send-signin-notice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), email: email.trim() }),
        });
      } catch (_) { /* non-blocking */ }
    }
    setSending(false);
    onAuth({ name: name.trim(), email: email.trim(), provider: "email" });
  };
  const providers = [
    { id: "apple", label: "Continue with Apple", bg: T.ink, fg: T.bg, glyph: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M16.4 12.9c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.9-1.6 0-3.1 1-4 2.4-1.7 2.9-.4 7.3 1.2 9.7.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.1-1.2 2.9-2.4.9-1.4 1.3-2.7 1.3-2.8-.1 0-2.4-1-2.4-3.7zM14 5.6c.7-.8 1.1-1.9 1-3-1 0-2.1.6-2.8 1.4-.6.7-1.2 1.9-1 3 1 .1 2.1-.6 2.8-1.4z"/></svg> },
    { id: "google", label: "Continue with Google", bg: T.card, fg: T.ink, border: true, glyph: <svg width="17" height="17" viewBox="0 0 24 24"><path fill="#4285F4" d="M23 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.2c-.3 1.4-1.1 2.6-2.3 3.4v2.8h3.7C21.7 18.6 23 15.7 23 12.3z"/><path fill="#34A853" d="M12 23c3.1 0 5.7-1 7.6-2.8l-3.7-2.8c-1 .7-2.4 1.1-3.9 1.1-3 0-5.5-2-6.4-4.7H1.8v3C3.7 20.5 7.6 23 12 23z"/><path fill="#FBBC05" d="M5.6 13.8c-.2-.7-.4-1.4-.4-2.2s.1-1.5.4-2.2v-3H1.8C1 8.1.5 10 .5 11.6s.5 3.5 1.3 5.2l3.8-3z"/><path fill="#EA4335" d="M12 4.7c1.7 0 3.2.6 4.4 1.7L19.7 3C17.7 1.2 15.1 0 12 0 7.6 0 3.7 2.5 1.8 6.4l3.8 3C6.5 6.7 9 4.7 12 4.7z"/></svg> },
    { id: "facebook", label: "Continue with Facebook", bg: T.ink, fg: T.bg, glyph: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12a12 12 0 1 0-13.9 11.9v-8.4h-3V12h3V9.4c0-3 1.8-4.7 4.6-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.3l-.5 3.5h-2.8v8.4A12 12 0 0 0 24 12z"/></svg> },
  ];
  const fieldS = { width: "100%", padding: "16px 18px", borderRadius: 4, border: `1px solid ${T.line}`, fontSize: 14, fontFamily: sans, fontWeight: 300, background: T.bg, color: T.ink };
  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 24px" }}>
      <div className="rise" style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: T.burgundy, marginBottom: 18 }}>{intent === "signup" ? "Create an account" : intent === "signin" ? "Sign in" : "Welcome"}</div>
          <h1 style={{ fontFamily: serif, fontSize: 44, fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.05, margin: 0, color: T.ink }}>{intent === "signup" ? <>Start your <em style={{ fontStyle: "italic", color: T.goldDeep, fontWeight: 400 }}>practice</em>.</> : intent === "signin" ? "Welcome back." : "Welcome to TradeAid."}</h1>
          <p style={{ color: T.grey, fontSize: 15, lineHeight: 1.7, fontWeight: 300, margin: "18px auto 0", maxWidth: 380 }}>{intent === "signup" ? "Create your profile — name and email required." : "One profile. Your curriculum, progress, and tools — saved to you."}</p>
        </div>
        {!mode ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {providers.map((p) => (
              <button key={p.id} onClick={() => onAuth({ name: "", provider: p.id })}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "14px", borderRadius: 4, fontWeight: 500, fontSize: 13, cursor: "pointer", background: p.bg, color: p.fg, border: p.border ? `1px solid ${T.line}` : `1px solid ${p.bg}`, fontFamily: sans }}>
                {p.glyph}{p.label}
              </button>
            ))}
            <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "12px 0 6px" }}>
              <div style={{ flex: 1, height: 1, background: T.line }} /><span style={{ fontSize: 10, color: T.greyLight, letterSpacing: "0.18em", textTransform: "uppercase" }}>or</span><div style={{ flex: 1, height: 1, background: T.line }} />
            </div>
            <Btn kind="ghost" onClick={() => setMode("email")} style={{ width: "100%" }}>Continue with email</Btn>
            <button onClick={() => onAuth({ name: "", provider: "guest" })} style={{ background: "none", border: "none", color: T.grey, fontSize: 12, cursor: "pointer", marginTop: 14, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500 }}>
              Just exploring? Continue as guest
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                style={{ ...fieldS, borderColor: touched.name && !nameOk ? T.burgundy : T.line }} />
              {touched.name && !nameOk && <div style={{ color: T.burgundy, fontSize: 12, marginTop: 6, fontWeight: 300 }}>Enter your name (2 characters minimum).</div>}
            </div>
            <div>
              <input placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                style={{ ...fieldS, borderColor: touched.email && !emailOk ? T.burgundy : T.line }} />
              {touched.email && !emailOk && <div style={{ color: T.burgundy, fontSize: 12, marginTop: 6, fontWeight: 300 }}>Enter a valid email address.</div>}
            </div>
            <Btn onClick={submitEmail} disabled={sending}
              style={{ marginTop: 6, width: "100%", opacity: canContinue && !sending ? 1 : 0.5, cursor: canContinue && !sending ? "pointer" : "not-allowed" }}>{sending ? "Sending…" : "Continue"}</Btn>
            <button onClick={() => setMode(null)} style={{ background: "none", border: "none", color: T.grey, fontSize: 12, cursor: "pointer", marginTop: 6, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500 }}>← Back</button>
          </div>
        )}
        <p style={{ textAlign: "center", fontSize: 12, color: T.greyLight, marginTop: 32, lineHeight: 1.7, fontWeight: 300 }}>
          Demo experience — no real account is created and nothing leaves this page.
        </p>
      </div>
    </div>
  );
}

function PickScreen({ eyebrow, title, sub, items, onPick, step }) {
  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 24px" }}>
      <div className="rise" style={{ width: "100%", maxWidth: 520 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 36 }}>
          {[1, 2, 3].map((s) => <div key={s} style={{ flex: 1, height: 2, background: s <= step ? T.emerald : T.line, transition: "background .3s ease" }} />)}
        </div>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: T.burgundy, marginBottom: 18 }}>{eyebrow}</div>
          <h1 style={{ fontFamily: serif, fontSize: 40, fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.1, margin: 0, color: T.ink }}>{title}</h1>
          <p style={{ color: T.grey, fontSize: 15, fontWeight: 300, margin: "18px auto 0", lineHeight: 1.7, maxWidth: 420 }}>{sub}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map((it) => (
            <button key={it.id} onClick={() => onPick(it.id)} className="hoverlift"
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.emerald; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.line; }}
              style={{ display: "flex", alignItems: "center", gap: 18, textAlign: "left", background: T.bg, border: `1px solid ${T.line}`, borderRadius: 4, padding: "20px 22px", cursor: "pointer", fontFamily: sans, transition: "border-color .2s ease" }}>
              <span style={{ width: 44, height: 44, borderRadius: 4, background: T.emeraldSoft, display: "flex", alignItems: "center", justifyContent: "center", color: T.emerald, flexShrink: 0 }}>
                <Icon name={it.icon} size={20} color={T.emerald} />
              </span>
              <span style={{ flex: 1 }}>
                <span style={{ display: "block", fontFamily: serif, fontWeight: 400, fontSize: 20, color: T.ink, lineHeight: 1.2 }}>{it.title}</span>
                <span style={{ display: "block", fontSize: 13.5, color: T.grey, marginTop: 4, fontWeight: 300, lineHeight: 1.55 }}>{it.desc}</span>
              </span>
              <Icon name="arrowR" size={16} color={T.greyLight} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function NameScreen({ onDone, initial }) {
  const [name, setName] = useState(initial || "");
  const [touched, setTouched] = useState(false);
  const ok = name.trim().length >= 2;
  const submit = () => { if (ok) onDone(name.trim()); else setTouched(true); };
  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 24px" }}>
      <div className="rise" style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 36 }}>
          {[1, 2, 3].map((s) => <div key={s} style={{ flex: 1, height: 2, background: s <= 1 ? T.emerald : T.line }} />)}
        </div>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: T.burgundy, marginBottom: 18 }}>Your profile</div>
          <h1 style={{ fontFamily: serif, fontSize: 40, fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.1, margin: 0, color: T.ink }}>What should we call you?</h1>
        </div>
        <input autoFocus placeholder="First name" value={name} onChange={(e) => setName(e.target.value)} onBlur={() => setTouched(true)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          style={{ width: "100%", padding: "18px 20px", borderRadius: 4, border: `1px solid ${touched && !ok ? T.burgundy : T.line}`, fontSize: 16, fontFamily: sans, fontWeight: 300, background: T.bg, color: T.ink, marginBottom: touched && !ok ? 6 : 16 }} />
        {touched && !ok && <div style={{ color: T.burgundy, fontSize: 12, marginBottom: 12, fontWeight: 300 }}>Please enter your name to continue.</div>}
        <Btn onClick={submit} style={{ width: "100%", opacity: ok ? 1 : 0.5, cursor: ok ? "pointer" : "not-allowed" }}>Continue</Btn>
      </div>
    </div>
  );
}

/* ============================== HOME ============================== */
function ProgressRing({ pct, size = 60 }) {
  const r = (size - 6) / 2, circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={T.line} strokeWidth="3" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={T.emerald} strokeWidth="3" strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)} transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{ transition: "stroke-dashoffset .6s ease" }} />
      <text x="50%" y="55%" textAnchor="middle" fontSize="13" fontWeight="500" fill={T.ink} fontFamily={sans}>{pct}%</text>
    </svg>
  );
}

function Home({ user, completed, xp, streak, go }) {
  const track = TRACKS[user.level];
  const next = track.lessons.find((l) => !completed.includes(l.id));
  const pct = Math.round((track.lessons.filter((l) => completed.includes(l.id)).length / track.lessons.length) * 100);
  const hints = {
    visual: { label: "Pattern recognition lab", desc: "Visual-first: drill candlestick patterns until identification is instant.", tab: "practice", icon: "eye" },
    reading: { label: "Continue the curriculum", desc: "Your next lesson — with the research evidence behind it — is queued.", tab: "learn", icon: "book" },
    hands: { label: "Coached simulator", desc: "Hands-on: take a paper trade and let the coach grade your process.", tab: "practice", icon: "hand" },
  };
  const hint = hints[user.style];

  const styleHero = {
    visual: { eyebrow: "You learn by seeing", copy: "We'll open your session with charts, patterns, and diagrams — the language your brain reads fastest." },
    reading: { eyebrow: "You learn by reading", copy: "Every lesson is anchored to peer-reviewed evidence — start with the paper, then the practice." },
    hands: { eyebrow: "You learn by doing", copy: "Skip the theory queue — the simulator and coached drills are your fastest path to skill." },
  };
  const heroCopy = styleHero[user.style] || styleHero.reading;
  return (
    <div>
      <div className="rise" style={{ marginBottom: 36 }}>
        <Eyebrow>{heroCopy.eyebrow} · {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</Eyebrow>
        <h1 style={{ fontFamily: serif, fontSize: 56, fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.02, margin: "4px 0 12px", color: T.ink }}>Welcome back{user.name ? <>, <em style={{ fontStyle: "italic", color: T.goldDeep, fontWeight: 400 }}>{user.name}</em></> : ""}.</h1>
        <p style={{ color: T.grey, fontSize: 16, fontWeight: 300, lineHeight: 1.7, margin: 0, maxWidth: 620 }}>{heroCopy.copy}</p>
      </div>

      <div className="grid2 rise2" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
        <div style={{ background: T.emerald, color: T.bg, position: "relative", overflow: "hidden", borderRadius: 4, padding: 32 }}>
          <div style={{ position: "absolute", right: -60, top: -60, width: 220, height: 220, borderRadius: "50%", background: T.emeraldMid, opacity: 0.6 }} />
          <div style={{ position: "relative" }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: T.goldSoft, marginBottom: 16 }}>Up next · {track.label} module</div>
            <div style={{ fontFamily: serif, fontSize: 28, fontWeight: 300, letterSpacing: "-0.01em", lineHeight: 1.2, margin: "0 0 10px" }}>
              {next ? next.title : "Module complete — sit the examination"}
            </div>
            <p style={{ fontSize: 13, color: "rgba(250,250,248,.65)", margin: "0 0 26px", fontWeight: 300, letterSpacing: "0.04em" }}>
              {next ? `${next.minutes} min · lecture ${track.lessons.indexOf(next) + 1} of ${track.lessons.length}` : "Then advance to the next module."}
            </p>
            <button onClick={() => go(next ? "learn" : "quiz")} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "transparent", color: T.bg, border: `1px solid rgba(250,250,248,.5)`, borderRadius: 4, padding: "12px 22px", fontFamily: sans, fontSize: 11, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>
              {next ? "Continue" : "Take the quiz"} <Icon name="arrowR" size={14} color={T.bg} />
            </button>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: T.bg, border: `1px solid ${T.line}`, borderRadius: 4, padding: 22, display: "flex", gap: 18, alignItems: "center" }}>
            <ProgressRing pct={pct} />
            <div>
              <div style={{ fontFamily: serif, fontWeight: 400, fontSize: 18, color: T.ink }}>{track.label} module</div>
              <div style={{ fontSize: 12, color: T.grey, letterSpacing: "0.05em", marginTop: 2 }}>{pct}% complete</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ flex: 1, background: T.bg, border: `1px solid ${T.line}`, borderRadius: 4, padding: "20px 16px", textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 8, color: T.emerald }}><Icon name="bolt" size={15} color={T.emerald} /></div>
              <div style={{ fontFamily: serif, fontSize: 32, fontWeight: 300, color: T.ink, lineHeight: 1 }}>{xp}</div>
              <div style={{ fontSize: 10, color: T.grey, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", marginTop: 8 }}>XP earned</div>
            </div>
            <div style={{ flex: 1, background: streak > 1 ? T.emeraldSoft : T.bg, border: `1px solid ${streak > 1 ? T.emerald : T.line}`, borderRadius: 4, padding: "20px 16px", textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 8, color: T.burgundy }}><Icon name="flame" size={15} color={T.burgundy} /></div>
              <div style={{ fontFamily: serif, fontSize: 32, fontWeight: 300, color: T.ink, lineHeight: 1 }}>{streak}</div>
              <div style={{ fontSize: 10, color: T.grey, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", marginTop: 8 }}>Streak</div>
            </div>
          </div>
        </div>
      </div>

      <button className="rise3 hoverlift" onClick={() => go(hint.tab)} style={{ width: "100%", marginTop: 16, display: "flex", alignItems: "center", gap: 20, cursor: "pointer", background: T.bg, border: `1px solid ${T.line}`, borderRadius: 4, padding: "22px 24px", textAlign: "left", fontFamily: sans }}>
        <div style={{ width: 48, height: 48, borderRadius: 4, background: T.emeraldSoft, display: "flex", alignItems: "center", justifyContent: "center", color: T.emerald, flexShrink: 0 }}>
          <Icon name={hint.icon} size={20} color={T.emerald} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: serif, fontWeight: 400, fontSize: 20, color: T.ink, lineHeight: 1.2 }}>For your learning style: {hint.label}</div>
          <div style={{ fontSize: 13.5, color: T.grey, marginTop: 4, fontWeight: 300, lineHeight: 1.55 }}>{hint.desc}</div>
        </div>
        <span style={{ color: T.emerald }}><Icon name="arrowR" size={16} color={T.emerald} /></span>
      </button>

      <div className="rise3" style={{ marginTop: 40 }}>
        <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: T.grey, marginBottom: 18 }}>The non-negotiables</div>
        <div className="grid2" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[["1%", "Maximum account risk per trade. Survival precedes profit.", T.emerald], ["2:1", "Minimum reward-to-risk before an entry is considered.", T.goldDeep], ["0", "Trades permitted outside the written plan.", T.burgundy]].map(([n, d, color]) => (
            <div key={n} style={{ background: T.bg, border: `1px solid ${T.line}`, borderRadius: 4, padding: "24px 22px" }}>
              <div style={{ fontFamily: serif, fontSize: 44, fontWeight: 300, color, lineHeight: 1, letterSpacing: "-0.02em" }}>{n}</div>
              <div style={{ fontSize: 13, color: T.grey, lineHeight: 1.65, marginTop: 14, fontWeight: 300 }}>{d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================== LEARN ============================== */
function Learn({ user, completed, complete }) {
  const [sub, setSub] = useState("curriculum");
  const [trackId, setTrackId] = useState(user.level);
  const [open, setOpen] = useState(null);
  const track = TRACKS[trackId];
  return (
    <div>
      <div className="rise" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
        <div><Eyebrow>Department of Market Studies</Eyebrow><H1 style={{ fontSize: 28 }}>Learn</H1></div>
        <SubNav items={[["curriculum", "Curriculum"], ["library", "Research Library"]]} active={sub} onPick={setSub} />
      </div>

      {sub === "library" ? (
        <div>
          <p className="rise" style={{ color: T.grey, fontSize: 14, lineHeight: 1.65, maxWidth: 620, margin: "0 0 18px" }}>
            The primary literature behind this curriculum. Each entry links to Google Scholar, where most papers are freely accessible. Reading even three of these puts you ahead of the vast majority of market participants.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {LIBRARY.map((p, i) => (
              <Card key={i} className="rise2" style={{ padding: "18px 20px" }}>
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{ width: 38, height: 38, borderRadius: 11, background: T.bgAlt, display: "flex", alignItems: "center", justifyContent: "center", color: T.grey, flexShrink: 0, marginTop: 2 }}>
                    <Icon name="doc" size={18} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: serif, fontSize: 16.5, fontWeight: 600, lineHeight: 1.4 }}>{p.t}</div>
                    <div style={{ fontSize: 12.5, color: T.grey, margin: "3px 0 8px" }}>{p.a} ({p.y}) · <em>{p.j}</em></div>
                    <p style={{ fontSize: 13.5, color: T.ink, lineHeight: 1.65, margin: "0 0 10px", fontFamily: serif }}>{p.note}</p>
                    <a href={sch(`${p.t} ${p.a.split(",")[0]}`)} target="_blank" rel="noreferrer" style={{ fontSize: 12.5, display: "inline-flex", alignItems: "center", gap: 6 }}>
                      Find on Google Scholar <Icon name="arrowR" size={13} />
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="rise" style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
            {Object.entries(TRACKS).map(([id, t]) => (
              <button key={id} onClick={() => { setTrackId(id); setOpen(null); }}
                style={{ display: "flex", alignItems: "center", gap: 7, border: `1.5px solid ${trackId === id ? T.ink : T.line}`, background: trackId === id ? T.goldSoft : T.card, color: trackId === id ? T.ink : T.grey, borderRadius: 999, padding: "8px 16px", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>
                <Icon name={t.icon} size={14} />{t.label}{id === user.level && " · yours"}
              </button>
            ))}
          </div>
          <p className="rise" style={{ color: T.grey, fontSize: 14, margin: "0 0 18px", maxWidth: 580, fontFamily: serif, fontStyle: "italic" }}>{track.blurb}</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {track.lessons.map((l, i) => {
              const isOpen = open === l.id, isDone = completed.includes(l.id);
              return (
                <Card key={l.id} className="rise2" style={{ padding: 0, overflow: "hidden", borderColor: isOpen ? T.gold : T.line, borderWidth: isOpen ? 2 : 1 }}>
                  <button onClick={() => setOpen(isOpen ? null : l.id)}
                    style={{ width: "100%", background: "transparent", border: "none", cursor: "pointer", padding: "17px 20px", display: "flex", alignItems: "center", gap: 15, textAlign: "left" }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12.5, background: isDone ? T.gold : T.bgAlt, color: T.ink, border: `1.5px solid ${isDone ? T.goldDeep : T.line}` }}>
                      {isDone ? <Icon name="check" size={17} /> : `${i + 1}`}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", color: T.greyLight, marginBottom: 2 }}>Lecture {trackId[0].toUpperCase()}{i + 1} · {l.minutes} min</div>
                      <div style={{ fontWeight: 800, fontSize: 15.5, color: T.ink, letterSpacing: "-0.01em" }}>{l.title}</div>
                    </div>
                    <span style={{ color: T.greyLight, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }}><Icon name="chevron" size={18} /></span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: "0 22px 24px 69px" }}>
                      <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: 14.5, color: T.grey, lineHeight: 1.7, margin: "0 0 16px", paddingBottom: 14, borderBottom: `1px solid ${T.line}` }}>
                        <strong style={{ fontStyle: "normal", color: T.ink }}>Abstract. </strong>{l.abstract}
                      </p>
                      {user.style === "visual" && <LessonVisual type={l.visual} />}
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {l.points.map((p, j) => (
                          <div key={j} style={{ fontSize: 14.5, lineHeight: 1.75, color: T.ink, paddingLeft: 14, borderLeft: `3px solid ${T.gold}`, fontFamily: serif }}>{p}</div>
                        ))}
                      </div>
                      <div style={{ marginTop: 18, background: T.bgAlt, borderRadius: 8, padding: "16px 18px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                          <Icon name="cap" size={16} color={T.burgundy} />
                          <span style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: ".09em", textTransform: "uppercase", color: T.burgundy }}>What the research shows</span>
                        </div>
                        {l.research.map((r, j) => (
                          <p key={j} style={{ fontFamily: serif, fontSize: 13.5, lineHeight: 1.7, margin: j ? "10px 0 0" : 0 }}>
                            {r.f} <span style={{ color: T.grey, whiteSpace: "nowrap" }}>— {r.c}</span>
                          </p>
                        ))}
                      </div>
                      <div style={{ marginTop: 14, padding: "12px 16px", background: T.burgundySoft, borderRadius: 8, fontSize: 14, fontWeight: 700, color: T.burgundy }}>{l.takeaway}</div>
                      <div style={{ marginTop: 14 }}>
                        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".09em", textTransform: "uppercase", color: T.greyLight, marginBottom: 6 }}>Selected references</div>
                        {l.refs.map((r, j) => (
                          <div key={j} style={{ fontSize: 12.5, color: T.grey, lineHeight: 1.6, fontFamily: serif }}>
                            {r.a} ({r.y}). "{r.t}." <em>{r.j}</em>. <a href={sch(`${r.t} ${r.a.split(",")[0]}`)} target="_blank" rel="noreferrer" style={{ fontSize: 12 }}>Scholar</a>
                          </div>
                        ))}
                      </div>
                      {!isDone && (
                        <Btn onClick={() => complete(l.id)} style={{ marginTop: 18, padding: "11px 22px", fontSize: 13.5 }}>
                          Mark complete · +50 XP
                        </Btn>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================== PRACTICE ============================== */
function Practice({ user, addXp, onSimTrade, onPattern }) {
  const [sub, setSub] = useState(user.style === "visual" ? "patterns" : "sim");
  return (
    <div>
      <div className="rise" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
        <div><Eyebrow>Applied training</Eyebrow><H1 style={{ fontSize: 28 }}>Practice</H1></div>
        <SubNav items={[["sim", "Simulator"], ["patterns", "Patterns"], ["cards", "Flashcards"]]} active={sub} onPick={setSub} />
      </div>
      {sub === "sim" && <Simulator addXp={addXp} onSimTrade={onSimTrade} />}
      {sub === "patterns" && <PatternTrainer addXp={addXp} onPattern={onPattern} />}
      {sub === "cards" && <Flashcards />}
    </div>
  );
}

function Simulator({ addXp, onSimTrade }) {
  const START = 25000;
  const [candles, setCandles] = useState(() => genCandles());
  const tickRef = useRef(0);
  const [cash, setCash] = useState(START);
  const [shares, setShares] = useState(0);
  const [avg, setAvg] = useState(0);
  const [stop, setStop] = useState("");
  const [qty, setQty] = useState("20");
  const [log, setLog] = useState([]);
  const [record, setRecord] = useState({ w: 0, l: 0 });
  const [coach, setCoach] = useState({ tone: "neutral", msg: "Set the stop first; size the position from it. The coach grades process — discipline earns XP, luck never does." });
  const price = candles[candles.length - 1].c;
  const equity = cash + shares * price;
  const pnl = equity - START;
  const dayLimit = -START * 0.03;
  const locked = pnl <= dayLimit;

  useEffect(() => {
    const t = setInterval(() => {
      setCandles((cs) => {
        const next = [...cs];
        const last = { ...next[next.length - 1] };
        last.c = Math.max(8, last.c + (Math.random() - 0.49) * 0.6);
        last.h = Math.max(last.h, last.c); last.l = Math.min(last.l, last.c);
        next[next.length - 1] = last;
        tickRef.current++;
        if (tickRef.current % 5 === 0) { next.push({ o: last.c, h: last.c, l: last.c, c: last.c }); if (next.length > 40) next.shift(); }
        return next;
      });
    }, 850);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const s = parseFloat(stop);
    if (shares > 0 && s && price <= s) {
      const gain = (price - avg) * shares;
      setCash((c) => c + shares * price);
      setRecord((r) => ({ ...r, l: r.l + 1 }));
      setLog((lg) => [{ side: "STOP", qty: shares, px: price, note: "Auto-exit at the stop. Planned loss taken — the system working as designed." }, ...lg]);
      setShares(0); setAvg(0); setStop("");
      setCoach({ tone: "good", msg: "Stop fired. A small planned loss instead of a large emotional one — that is the entire skill, automated. +20 XP for discipline." });
      addXp(20); onSimTrade(gain >= 0);
    }
  }, [price]); // eslint-disable-line

  const s = parseFloat(stop);
  const q = Math.max(0, Math.floor(Number(qty) || 0));
  const previewRisk = s && s < price && q ? (price - s) * q : null;
  const previewPct = previewRisk != null ? (previewRisk / equity) * 100 : null;
  const onePctShares = s && s < price ? Math.floor((equity * 0.01) / (price - s)) : null;
  const target = s && s < price ? price + 2 * (price - s) : null;

  function buy() {
    if (locked) return;
    if (!q) return;
    const cost = q * price;
    if (cost > cash) { setCoach({ tone: "bad", msg: "Insufficient simulated cash. Wanting more size than capital allows is the margin itch — the professional beginner never scratches it." }); return; }
    let verdict;
    if (!s || s >= price) {
      verdict = { tone: "warn", msg: "Entry without a valid stop below price. The exit is decided before the entry — set the stop, then derive size from it." };
    } else {
      const totalRisk = (price - s) * q, limit = equity * 0.01;
      if (totalRisk > limit) {
        verdict = { tone: "bad", msg: `This risks ${fmt$(totalRisk)} (${((totalRisk / equity) * 100).toFixed(1)}% of equity). The 1% rule allows ${fmt$(limit)} → ${Math.floor(limit / (price - s))} shares at this stop. Use Size to 1%.` };
      } else {
        verdict = { tone: "good", msg: `Disciplined entry: ${fmt$(totalRisk, 2)} at risk (${((totalRisk / equity) * 100).toFixed(2)}%). 2R target: $${(price + 2 * (price - s)).toFixed(2)} — now drawn on the chart. +15 XP.` };
        addXp(15);
      }
    }
    setCoach(verdict);
    setAvg((shares * avg + q * price) / (shares + q));
    setShares(shares + q); setCash(cash - cost);
    setLog((lg) => [{ side: "BUY", qty: q, px: price, note: verdict.tone === "good" ? "Disciplined entry" : "Against best practice" }, ...lg]);
  }

  function sell() {
    if (!shares) return;
    const gain = (price - avg) * shares;
    setCash(cash + shares * price);
    setRecord((r) => gain >= 0 ? { ...r, w: r.w + 1 } : { ...r, l: r.l + 1 });
    setLog((lg) => [{ side: "SELL", qty: shares, px: price, note: `${gain >= 0 ? "+" : "−"}${fmt$(Math.abs(gain), 2)} realized` }, ...lg]);
    setCoach(gain >= 0
      ? { tone: "good", msg: `Closed +${fmt$(gain, 2)}. Journal question: did the plan say exit, or did the nerves? Winners cut early are the silent leak in retail accounts.` }
      : { tone: "warn", msg: `Closed −${fmt$(Math.abs(gain), 2)}. Planned and small: grade A. Panic exit: that is the thing to fix — not the loss itself.` });
    setShares(0); setAvg(0); setStop(""); onSimTrade(gain >= 0);
  }

  const tones = { good: [T.goldSoft, T.gold], warn: [T.goldSoft, T.goldDeep], bad: [T.burgundySoft, T.burgundy], neutral: [T.bgAlt, T.grey] };
  const total = record.w + record.l;

  return (
    <div>
      {locked && (
        <Card className="pop" style={{ background: T.burgundySoft, borderColor: T.burgundy, marginBottom: 14, display: "flex", gap: 14, alignItems: "center" }}>
          <span style={{ color: T.burgundy }}><Icon name="shield" size={22} /></span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 14.5, color: T.burgundy }}>Daily loss limit reached (−3%)</div>
            <div style={{ fontSize: 13, color: T.ink, marginTop: 2 }}>Buying is disabled. This is the circuit breaker from Lecture A4 — unconditional by design. Close positions, journal the session, return tomorrow.</div>
          </div>
        </Card>
      )}
      <div className="grid2" style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 14 }}>
        <Card className="rise">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <span style={{ fontWeight: 800, fontSize: 15 }}>PRCTC</span>
              <span style={{ fontFamily: mono, fontSize: 26, fontWeight: 600 }}>${price.toFixed(2)}</span>
            </div>
            <span style={{ fontFamily: mono, fontSize: 13.5, fontWeight: 600, color: pnl >= 0 ? T.gold : T.burgundy, background: pnl >= 0 ? T.goldSoft : T.burgundySoft, padding: "4px 12px", borderRadius: 99 }}>
              {pnl >= 0 ? "▲" : "▼"} {fmt$(Math.abs(pnl), 2)}
            </span>
          </div>
          <CandleChart candles={candles} stopLine={s && s < price * 1.4 ? s : null} avgLine={shares > 0 ? avg : null} targetLine={shares > 0 && target ? target : null} />
          <div style={{ display: "flex", gap: 22, marginTop: 14, flexWrap: "wrap" }}>
            {[["Equity", fmt$(equity, 2)], ["Cash", fmt$(cash, 2)], ["Position", shares ? `${shares} @ $${avg.toFixed(2)}` : "—"], ["Record", total ? `${record.w}W–${record.l}L (${Math.round((record.w / total) * 100)}%)` : "—"]].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontSize: 10.5, color: T.greyLight, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".07em" }}>{k}</div>
                <div style={{ fontFamily: mono, fontSize: 14.5, fontWeight: 600 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.greyLight, fontWeight: 700, marginBottom: 4 }}>
              <span>Daily loss limit</span><span>{fmt$(Math.abs(dayLimit))} (3%)</span>
            </div>
            <div style={{ height: 5, background: T.bgAlt, borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.min(100, Math.max(0, (pnl < 0 ? -pnl : 0) / -dayLimit * 100))}%`, background: T.burgundy, borderRadius: 99, transition: "width .4s" }} />
            </div>
          </div>
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Card className="rise2">
            <SectionLabel>Order ticket</SectionLabel>
            <label style={lbl}>Stop loss price <span style={{ color: T.burgundy }}>(set first)</span></label>
            <input value={stop} onChange={(e) => setStop(e.target.value.replace(/[^\d.]/g, ""))} placeholder={`e.g. ${(price * 0.985).toFixed(2)}`} style={inputS} />
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end", marginTop: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={lbl}>Shares</label>
                <input value={qty} onChange={(e) => setQty(e.target.value.replace(/[^\d]/g, ""))} style={inputS} />
              </div>
              {onePctShares != null && (
                <button onClick={() => setQty(String(Math.max(1, onePctShares)))} style={{ border: `1.5px solid ${T.goldDeep}`, background: T.goldSoft, color: T.ink, borderRadius: 8, padding: "11px 12px", fontSize: 12, fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap" }}>
                  Size to 1%
                </button>
              )}
            </div>
            <div style={{ marginTop: 12, padding: "10px 13px", background: T.bgAlt, borderRadius: 11, fontSize: 12.5, lineHeight: 1.6, color: previewRisk == null ? T.greyLight : previewPct > 1 ? T.burgundy : T.grey }}>
              {previewRisk == null
                ? "Risk preview appears once a valid stop is set."
                : <>This order risks <strong style={{ fontFamily: mono }}>{fmt$(previewRisk, 2)}</strong> ({previewPct.toFixed(2)}% of equity){previewPct > 1 ? " — over the 1% cap." : "."} 2R target ${target.toFixed(2)}.</>}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <Btn kind="butter" onClick={buy} style={{ flex: 1, padding: "12px 0", opacity: locked ? 0.35 : 1, cursor: locked ? "default" : "pointer" }}>Buy</Btn>
              <Btn kind="crimson" onClick={sell} style={{ flex: 1, padding: "12px 0", opacity: shares ? 1 : 0.35, cursor: shares ? "pointer" : "default" }}>Sell all</Btn>
            </div>
          </Card>
          <Card className="pop" key={coach.msg} style={{ background: tones[coach.tone][0], borderColor: tones[coach.tone][1] }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
              <Icon name="cap" size={15} color={tones[coach.tone][1]} />
              <span style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".09em", color: tones[coach.tone][1] }}>Coach</span>
            </div>
            <div style={{ fontSize: 13.5, lineHeight: 1.6 }}>{coach.msg}</div>
          </Card>
        </div>
      </div>

      {log.length > 0 && (
        <Card style={{ marginTop: 14 }}>
          <SectionLabel>Session journal</SectionLabel>
          {log.slice(0, 7).map((e, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "baseline", fontSize: 13, padding: "7px 0", borderBottom: i < Math.min(log.length, 7) - 1 ? `1px solid ${T.line}` : "none", flexWrap: "wrap" }}>
              <span style={{ fontFamily: mono, fontWeight: 600, width: 46, color: e.side === "BUY" ? T.goldDeep : T.burgundy }}>{e.side}</span>
              <span style={{ fontFamily: mono }}>{e.qty} @ ${e.px.toFixed(2)}</span>
              <span style={{ color: T.grey, fontSize: 12.5 }}>{e.note}</span>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

/* Pattern trainer */
function PatternCandles({ candles }) {
  const W = 240, H = 130, pad = 10;
  const all = candles.flat();
  const lo = Math.min(...all) - 3, hi = Math.max(...all) + 3;
  const y = (v) => H - pad - ((v - lo) / (hi - lo)) * (H - pad * 2);
  const cw = W / candles.length;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: 300, height: "auto", display: "block", margin: "0 auto" }}>
      <rect width={W} height={H} rx="12" fill={T.bgAlt} />
      {candles.map(([o, h, l, c], i) => {
        const up = c >= o, x = i * cw + cw / 2;
        return (<g key={i}>
          <line x1={x} x2={x} y1={y(h)} y2={y(l)} stroke={up ? T.goldDeep : T.burgundy} strokeWidth="2" />
          <rect x={x - cw * 0.26} y={y(Math.max(o, c))} width={cw * 0.52} height={Math.max(3, Math.abs(y(o) - y(c)))} rx="2.5" fill={up ? T.gold : T.burgundy} />
        </g>);
      })}
    </svg>
  );
}

function PatternTrainer({ addXp, onPattern }) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState({ c: 0, t: 0 });
  const [streak, setStreak] = useState(0);
  const [hint, setHint] = useState(false);
  const p = PATTERNS[idx % PATTERNS.length];

  function pick(i) {
    if (picked != null) return;
    setPicked(i);
    const ok = i === p.answer;
    setScore((s) => ({ c: s.c + (ok ? 1 : 0), t: s.t + 1 }));
    setStreak((s) => ok ? s + 1 : 0);
    if (ok) addXp(15);
    onPattern(ok);
  }
  function next() { setPicked(null); setHint(false); setIdx((i) => i + 1); }

  return (
    <Card className="rise" style={{ maxWidth: 560, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span style={{ fontSize: 13, fontWeight: 800, color: T.grey }}>Identify the pattern</span>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {streak >= 2 && <span className="pop" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 800, color: T.burgundy, background: T.burgundySoft, padding: "4px 11px", borderRadius: 99 }}><Icon name="flame" size={12} />{streak}</span>}
          <span style={{ fontFamily: mono, fontSize: 13, color: T.grey }}>{score.c}/{score.t}</span>
        </div>
      </div>
      <PatternCandles candles={p.candles} />
      {!picked && (
        <div style={{ textAlign: "center", marginTop: 10, minHeight: 22 }}>
          {hint
            ? <span className="pop" style={{ fontSize: 12.5, color: T.goldDeep, fontWeight: 700 }}>{p.hint}</span>
            : <button onClick={() => setHint(true)} style={{ background: "none", border: "none", color: T.greyLight, fontSize: 12.5, fontWeight: 700, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3 }}>Need a hint?</button>}
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginTop: 12 }}>
        {p.options.map((opt, i) => {
          let bg = "#fff", border = T.line, color = T.ink;
          if (picked != null) {
            if (i === p.answer) { bg = T.goldSoft; border = T.goldDeep; }
            else if (i === picked) { bg = T.burgundySoft; border = T.burgundy; color = T.burgundy; }
          }
          return (
            <button key={i} onClick={() => pick(i)} style={{ background: bg, border: `1.5px solid ${border}`, color, borderRadius: 8, padding: "13px 10px", fontWeight: 700, fontSize: 13.5, cursor: picked == null ? "pointer" : "default" }}>{opt}</button>
          );
        })}
      </div>
      {picked != null && (
        <div className="pop">
          <div style={{ marginTop: 14, padding: "13px 16px", background: T.bgAlt, borderRadius: 8, fontSize: 13.5, lineHeight: 1.65, fontFamily: serif }}>
            <strong style={{ color: picked === p.answer ? T.goldDeep : T.burgundy, fontFamily: sans }}>{picked === p.answer ? "Correct · +15 XP. " : `It's a ${p.name.toLowerCase()}. `}</strong>{p.why}
          </div>
          <Btn onClick={next} style={{ marginTop: 14, width: "100%" }}>Next pattern</Btn>
        </div>
      )}
      <p style={{ fontSize: 12, color: T.greyLight, marginTop: 14, lineHeight: 1.6, textAlign: "center" }}>
        Lecture I3 applies: a pattern's location is its meaning. At a key level it's information; mid-range it's noise (Lo, Mamaysky & Wang, 2000).
      </p>
    </Card>
  );
}

function Flashcards() {
  const [order, setOrder] = useState(() => GLOSSARY.map((_, i) => i));
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState([]);
  const cur = order[i % order.length];
  const [term, def] = GLOSSARY[cur];
  function shuffle() {
    const a = [...order];
    for (let k = a.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [a[k], a[j]] = [a[j], a[k]]; }
    setOrder(a); setI(0); setFlipped(false);
  }
  return (
    <div className="rise" style={{ maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
      <button onClick={() => setFlipped(!flipped)}
        style={{ width: "100%", minHeight: 230, background: flipped ? T.ink : T.gold, color: flipped ? T.bg : T.ink, border: "none", borderRadius: 22, padding: 30, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, boxShadow: "0 10px 30px rgba(27,26,22,.1)" }}>
        <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".13em", textTransform: "uppercase", opacity: 0.6 }}>{flipped ? "Definition" : "Term · tap to flip"}</span>
        <span style={{ fontSize: flipped ? 15.5 : 25, fontWeight: flipped ? 500 : 800, lineHeight: 1.55, letterSpacing: "-0.01em", maxWidth: 380, fontFamily: flipped ? serif : sans }}>{flipped ? def : term}</span>
        {known.includes(cur) && <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase", opacity: 0.55, display: "inline-flex", alignItems: "center", gap: 5 }}><Icon name="check" size={13} /> known</span>}
      </button>
      <div style={{ display: "flex", gap: 9, justifyContent: "center", marginTop: 18, flexWrap: "wrap" }}>
        <Btn kind="ghost" onClick={() => { setI((v) => (v - 1 + order.length) % order.length); setFlipped(false); }}>Prev</Btn>
        <Btn kind="ghost" onClick={() => setKnown((k) => k.includes(cur) ? k.filter((x) => x !== cur) : [...k, cur])}>
          {known.includes(cur) ? "Unmark" : "I know this"}
        </Btn>
        <Btn onClick={() => { setI((v) => v + 1); setFlipped(false); }}>Next</Btn>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 12, fontFamily: mono, fontSize: 12.5, color: T.greyLight }}>
        <span>{(i % order.length) + 1} / {order.length}</span>
        <span>{known.length} known</span>
        <button onClick={shuffle} style={{ background: "none", border: "none", color: T.burgundy, fontFamily: mono, fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>shuffle</button>
      </div>
    </div>
  );
}

/* ============================== QUIZ ============================== */
function Quiz({ user, addXp, onQuizDone }) {
  const [level, setLevel] = useState(user.level);
  const bank = QUIZ_BANK[level];
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const q = bank[idx];
  const score = answers.filter((a) => a.ok).length;

  function reset(lv) { setLevel(lv); setIdx(0); setPicked(null); setAnswers([]); setFinished(false); }
  function pick(i) {
    if (picked != null) return;
    setPicked(i);
    const ok = i === q.answer;
    setAnswers((a) => [...a, { q: q.q, ok, correct: q.options[q.answer] }]);
    if (ok) addXp(10);
  }
  function next() {
    if (idx === bank.length - 1) { setFinished(true); onQuizDone(score + (picked === q.answer ? 0 : 0), bank.length); }
    else { setIdx(idx + 1); setPicked(null); }
  }

  if (finished) {
    const pct = Math.round((score / bank.length) * 100);
    const missed = answers.filter((a) => !a.ok);
    return (
      <div style={{ maxWidth: 560, margin: "20px auto" }}>
        <Card className="pop" style={{ textAlign: "center", padding: 36 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: pct >= 80 ? T.goldSoft : T.burgundySoft, display: "flex", alignItems: "center", justifyContent: "center", color: pct >= 80 ? T.goldDeep : T.burgundy }}>
              <Icon name={pct >= 80 ? "award" : "book"} size={30} />
            </div>
          </div>
          <div style={{ fontFamily: mono, fontSize: 38, fontWeight: 600, color: pct >= 80 ? T.goldDeep : T.burgundy }}>{score}/{bank.length}</div>
          <p style={{ color: T.grey, fontSize: 14.5, lineHeight: 1.65, maxWidth: 400, margin: "8px auto 22px" }}>
            {pct >= 80 ? "Strong command of the material. Next milestone: 50 journaled simulator trades — knowledge counts only when it survives contact with a live chart."
              : "Worth revisiting the lectures behind the questions below; the market charges full tuition for these."}
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <Btn onClick={() => reset(level)}>Retake</Btn>
            {level !== "advanced" && <Btn kind="ghost" onClick={() => reset(level === "beginner" ? "intermediate" : "advanced")}>Next level</Btn>}
          </div>
        </Card>
        {missed.length > 0 && (
          <Card className="rise2" style={{ marginTop: 14 }}>
            <SectionLabel>Review: missed questions</SectionLabel>
            {missed.map((m, i) => (
              <div key={i} style={{ padding: "10px 0", borderBottom: i < missed.length - 1 ? `1px solid ${T.line}` : "none" }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, lineHeight: 1.5 }}>{m.q}</div>
                <div style={{ fontSize: 13, color: T.gold, marginTop: 4, display: "flex", gap: 6, alignItems: "center" }}><Icon name="check" size={14} /> {m.correct}</div>
              </div>
            ))}
          </Card>
        )}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 620, margin: "0 auto" }}>
      <div className="rise" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div><Eyebrow>Examination</Eyebrow><H1 style={{ fontSize: 28 }}>Quiz</H1></div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {Object.keys(QUIZ_BANK).map((lv) => (
            <button key={lv} onClick={() => reset(lv)} style={{ border: `1.5px solid ${level === lv ? T.ink : T.line}`, background: level === lv ? T.ink : "#fff", color: level === lv ? T.bg : T.grey, borderRadius: 999, padding: "7px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", textTransform: "capitalize" }}>{lv}</button>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 1, display: "flex", gap: 5 }}>
          {bank.map((_, i) => <div key={i} style={{ flex: 1, height: 4, borderRadius: 99, background: i < answers.length ? (answers[i].ok ? T.gold : T.burgundy) : i === idx ? T.ink : T.line, transition: "background .3s" }} />)}
        </div>
        <span style={{ fontFamily: mono, fontSize: 12.5, color: T.grey, whiteSpace: "nowrap" }}>{score} correct</span>
      </div>
      <Card className="rise2" key={idx}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", color: T.greyLight, marginBottom: 8 }}>Question {idx + 1} of {bank.length}</div>
        <p style={{ fontSize: 17, fontWeight: 800, lineHeight: 1.5, marginTop: 0, letterSpacing: "-0.01em" }}>{q.q}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {q.options.map((opt, i) => {
            let bg = T.bgAlt, border = "transparent", color = T.ink;
            if (picked != null) {
              if (i === q.answer) { bg = T.goldSoft; border = T.goldDeep; }
              else if (i === picked) { bg = T.burgundySoft; border = T.burgundy; color = T.burgundy; }
            }
            return (
              <button key={i} onClick={() => pick(i)} style={{ textAlign: "left", background: bg, border: `1.5px solid ${border}`, color, borderRadius: 8, padding: "14px 16px", fontSize: 14.5, fontWeight: 600, cursor: picked == null ? "pointer" : "default", lineHeight: 1.5 }}>{opt}</button>
            );
          })}
        </div>
        {picked != null && (
          <div className="pop">
            <div style={{ marginTop: 14, padding: "13px 16px", background: T.bgAlt, borderRadius: 8, fontSize: 13.5, lineHeight: 1.65, color: T.grey, fontFamily: serif }}>
              <strong style={{ color: picked === q.answer ? T.goldDeep : T.burgundy, fontFamily: sans }}>{picked === q.answer ? "Correct · +10 XP. " : "Not quite. "}</strong>{q.why}
            </div>
            <Btn onClick={next} style={{ marginTop: 14 }}>{idx === bank.length - 1 ? "See results" : "Next"} <Icon name="arrowR" size={15} /></Btn>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ============================== TOOLS ============================== */
function Field({ label, value, set, suffix }) {
  return (
    <div style={{ marginBottom: 13 }}>
      <label style={lbl}>{label}</label>
      <div style={{ position: "relative" }}>
        <input value={value} onChange={(e) => set(e.target.value.replace(/[^\d.]/g, ""))} style={inputS} />
        {suffix && <span style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", fontSize: 12.5, color: T.greyLight, fontWeight: 700 }}>{suffix}</span>}
      </div>
    </div>
  );
}
function Stat({ k, v, color, big }) {
  return (
    <div>
      <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase", opacity: 0.6 }}>{k}</div>
      <div style={{ fontFamily: mono, fontSize: big ? 36 : 17, fontWeight: 600, color }}>{v}</div>
    </div>
  );
}

function GrowthChart({ series, contribSeries }) {
  const W = 320, H = 130, pad = 8;
  const max = Math.max(...series) * 1.04;
  const pts = (arr) => arr.map((v, i) => `${(i / (arr.length - 1)) * W},${H - pad - (v / max) * (H - pad * 2)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
      <polygon points={`0,${H} ${pts(series)} ${W},${H}`} fill={T.gold} opacity="0.3" />
      <polyline points={pts(series)} fill="none" stroke={T.goldDeep} strokeWidth="2.5" />
      <polyline points={pts(contribSeries)} fill="none" stroke={T.ink} strokeWidth="1.6" strokeDasharray="3 4" opacity="0.5" />
    </svg>
  );
}

function Tools() {
  const [tool, setTool] = useState("size");
  return (
    <div>
      <div className="rise" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
        <div><Eyebrow>Professional toolkit</Eyebrow><H1 style={{ fontSize: 28 }}>Tools</H1></div>
        <SubNav items={[["size", "Position Size"], ["expect", "Expectancy"], ["compound", "Compound Growth"], ["retire", "Retirement"]]} active={tool} onPick={setTool} />
      </div>
      {tool === "size" && <PositionTool />}
      {tool === "expect" && <ExpectancyTool />}
      {tool === "compound" && <CompoundTool />}
      {tool === "retire" && <RetireTool />}
    </div>
  );
}

function PositionTool() {
  const [acct, setAcct] = useState("25000"); const [entry, setEntry] = useState("50.00");
  const [stopP, setStopP] = useState("48.50"); const [riskPct, setRiskPct] = useState("1");
  const a = +acct || 0, e = +entry || 0, s = +stopP || 0, r = +riskPct || 0;
  const rps = e - s, valid = a > 0 && e > 0 && s > 0 && s < e && r > 0;
  const maxRisk = (a * r) / 100, sh = valid ? Math.floor(maxRisk / rps) : 0;
  return (
    <div className="grid2" style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 14 }}>
      <Card className="rise">
        <SectionLabel>Inputs</SectionLabel>
        <Field label="Account size" value={acct} set={setAcct} suffix="USD" />
        <Field label="Entry price" value={entry} set={setEntry} suffix="USD" />
        <Field label="Stop loss price" value={stopP} set={setStopP} suffix="USD" />
        <Field label="Risk per trade" value={riskPct} set={setRiskPct} suffix="%" />
        {r > 2 && <div style={{ padding: "11px 14px", background: T.burgundySoft, border: `1.5px solid ${T.burgundy}`, borderRadius: 8, fontSize: 13, color: T.burgundy, fontWeight: 700 }}>Above 2% per trade, drawdown math turns hostile fast. Professionals live at 1% or below.</div>}
      </Card>
      <Card className="rise2" style={{ background: valid ? T.ink : T.card, color: valid ? T.bg : T.ink, border: "none", display: "flex", flexDirection: "column", justifyContent: "center", gap: 18 }}>
        {valid ? (<>
          <Stat k="Maximum shares" v={sh.toLocaleString()} color={T.gold} big />
          <div style={{ display: "flex", gap: 26, flexWrap: "wrap" }}>
            <Stat k="Position value" v={fmt$(sh * e)} />
            <Stat k="Capital at risk" v={fmt$(maxRisk, 2)} />
            <Stat k="Risk / share" v={`$${rps.toFixed(2)}`} />
          </div>
          <div style={{ display: "flex", gap: 26, flexWrap: "wrap" }}>
            <Stat k="2R target" v={`$${(e + 2 * rps).toFixed(2)}`} color={T.gold} />
            <Stat k="3R target" v={`$${(e + 3 * rps).toFixed(2)}`} color={T.gold} />
            <Stat k="% of account" v={`${((sh * e) / a * 100).toFixed(1)}%`} />
          </div>
          <div style={{ fontSize: 13, opacity: 0.75, lineHeight: 1.65, borderTop: "1px solid rgba(253,251,245,.15)", paddingTop: 13 }}>
            As a sentence: "Buy <strong style={{ color: T.gold }}>{sh.toLocaleString()} shares</strong> at <strong>${e.toFixed(2)}</strong>; exit at <strong style={{ color: "#FF8A99" }}>${s.toFixed(2)}</strong> if wrong; target <strong style={{ color: T.gold }}>${(e + 2 * rps).toFixed(2)}+</strong> if right."
          </div>
        </>) : (
          <div style={{ color: T.grey, fontSize: 14, lineHeight: 1.65 }}>Enter your numbers. The stop must sit below the entry — if you cannot state where you'd exit a loser, the position has no business existing.</div>
        )}
      </Card>
    </div>
  );
}

function ExpectancyTool() {
  const [win, setWin] = useState("45"); const [avgW, setAvgW] = useState("250");
  const [avgL, setAvgL] = useState("100"); const [tpm, setTpm] = useState("20");
  const w = (+win || 0) / 100, aw = +avgW || 0, al = +avgL || 0, n = +tpm || 0;
  const exp = w * aw - (1 - w) * al;
  const pf = (1 - w) * al > 0 ? (w * aw) / ((1 - w) * al) : 0;
  const rr = al > 0 ? aw / al : 0;
  const be = rr > 0 ? (1 / (1 + rr)) * 100 : 0;
  return (
    <div className="grid2" style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 14 }}>
      <Card className="rise">
        <SectionLabel>Your strategy's statistics</SectionLabel>
        <Field label="Win rate" value={win} set={setWin} suffix="%" />
        <Field label="Average winning trade" value={avgW} set={setAvgW} suffix="USD" />
        <Field label="Average losing trade" value={avgL} set={setAvgL} suffix="USD" />
        <Field label="Trades per month" value={tpm} set={setTpm} />
        <p style={{ fontSize: 12.5, color: T.greyLight, lineHeight: 1.6, margin: "4px 0 0" }}>Pull these from your trading journal after 30+ trades — assumed numbers are fiction.</p>
      </Card>
      <Card className="rise2" style={{ background: T.ink, color: T.bg, border: "none", display: "flex", flexDirection: "column", justifyContent: "center", gap: 18 }}>
        <Stat k="Expectancy per trade" v={`${exp >= 0 ? "+" : "−"}${fmt$(Math.abs(exp), 2)}`} color={exp >= 0 ? T.gold : "#FF8A99"} big />
        <div style={{ display: "flex", gap: 26, flexWrap: "wrap" }}>
          <Stat k="Profit factor" v={pf.toFixed(2)} color={pf >= 1.5 ? T.gold : pf >= 1 ? T.bg : "#FF8A99"} />
          <Stat k="Reward : risk" v={`${rr.toFixed(2)} : 1`} />
          <Stat k="Est. monthly" v={`${exp * n >= 0 ? "+" : "−"}${fmt$(Math.abs(exp * n))}`} />
        </div>
        <div style={{ fontSize: 13, opacity: 0.78, lineHeight: 1.65, borderTop: "1px solid rgba(253,251,245,.15)", paddingTop: 13 }}>
          At {rr.toFixed(1)}:1 reward-to-risk, the break-even win rate is <strong style={{ color: T.gold }}>{be.toFixed(0)}%</strong>. {w * 100 >= be ? "You clear it — verify the inputs come from a real journal, not optimism." : "You are below break-even: this strategy loses money as described."} Lecture I2: win rate is vanity; expectancy is sanity.
        </div>
      </Card>
    </div>
  );
}

function CompoundTool() {
  const [init, setInit] = useState("10000"); const [monthly, setMonthly] = useState("500");
  const [rate, setRate] = useState("8"); const [years, setYears] = useState("20");
  const P = +init || 0, C = +monthly || 0, r = (+rate || 0) / 100 / 12, n = Math.min(60, Math.max(1, +years || 1)) * 12;
  const series = [], contrib = [];
  let bal = P, put = P;
  for (let m = 0; m <= n; m++) {
    if (m > 0) { bal = bal * (1 + r) + C; put += C; }
    if (m % 12 === 0) { series.push(bal); contrib.push(put); }
  }
  const fv = series[series.length - 1], totalPut = contrib[contrib.length - 1], growth = fv - totalPut;
  return (
    <div className="grid2" style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 14 }}>
      <Card className="rise">
        <SectionLabel>Inputs</SectionLabel>
        <Field label="Starting amount" value={init} set={setInit} suffix="USD" />
        <Field label="Monthly contribution" value={monthly} set={setMonthly} suffix="USD" />
        <Field label="Annual return (assumed)" value={rate} set={setRate} suffix="%" />
        <Field label="Years (max 60)" value={years} set={setYears} />
        <p style={{ fontSize: 12.5, color: T.greyLight, lineHeight: 1.6, margin: "4px 0 0" }}>Historical broad-market averages are often cited near 7–10% nominal — past performance never guarantees the future.</p>
      </Card>
      <Card className="rise2" style={{ background: T.ink, color: T.bg, border: "none" }}>
        <Stat k={`Projected value in ${Math.round(n / 12)} years`} v={fmt$(fv)} color={T.gold} big />
        <div style={{ margin: "14px 0" }}><GrowthChart series={series} contribSeries={contrib} /></div>
        <div style={{ display: "flex", gap: 26, flexWrap: "wrap" }}>
          <Stat k="Total contributed" v={fmt$(totalPut)} />
          <Stat k="Growth (compounding)" v={fmt$(growth)} color={T.gold} />
          <Stat k="Growth share" v={`${fv > 0 ? Math.round((growth / fv) * 100) : 0}%`} />
        </div>
        <div style={{ fontSize: 12.5, opacity: 0.7, lineHeight: 1.6, marginTop: 13, borderTop: "1px solid rgba(253,251,245,.15)", paddingTop: 12 }}>
          Solid line: balance. Dashed: your contributions. The widening gap is compounding — Lecture B6's entire argument, drawn.
        </div>
      </Card>
    </div>
  );
}

function RetireTool() {
  const [age, setAge] = useState("25"); const [rAge, setRAge] = useState("65");
  const [cur, setCur] = useState("15000"); const [monthly, setMonthly] = useState("600"); const [rate, setRate] = useState("7");
  const a = +age || 0, ra = +rAge || 0, P = +cur || 0, C = +monthly || 0, r = (+rate || 0) / 100 / 12;
  const n = Math.max(0, Math.min(70, ra - a)) * 12;
  let bal = P;
  for (let m = 0; m < n; m++) bal = bal * (1 + r) + C;
  const income = (bal * 0.04) / 12;
  return (
    <div className="grid2" style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 14 }}>
      <Card className="rise">
        <SectionLabel>Inputs</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Current age" value={age} set={setAge} />
          <Field label="Retirement age" value={rAge} set={setRAge} />
        </div>
        <Field label="Current savings" value={cur} set={setCur} suffix="USD" />
        <Field label="Monthly contribution" value={monthly} set={setMonthly} suffix="USD" />
        <Field label="Annual return (assumed)" value={rate} set={setRate} suffix="%" />
      </Card>
      <Card className="rise2" style={{ background: T.ink, color: T.bg, border: "none", display: "flex", flexDirection: "column", justifyContent: "center", gap: 18 }}>
        <Stat k={`Projected at age ${ra}`} v={fmt$(bal)} color={T.gold} big />
        <div style={{ display: "flex", gap: 26, flexWrap: "wrap" }}>
          <Stat k="Years of compounding" v={`${Math.round(n / 12)}`} />
          <Stat k="Est. monthly income (4% rule)" v={fmt$(income)} color={T.gold} />
        </div>
        <div style={{ fontSize: 12.5, opacity: 0.72, lineHeight: 1.65, borderTop: "1px solid rgba(253,251,245,.15)", paddingTop: 13 }}>
          The 4% guideline estimates sustainable withdrawals from a diversified portfolio; it is a planning heuristic, not a promise. Tax-advantaged accounts (401(k) match, IRA) come before any taxable trading — Lecture B6. This is an educational projection, not financial advice.
        </div>
      </Card>
    </div>
  );
}

/* ============================== PROFILE ============================== */
function Profile({ user, setUser, xp, completed, stats, activity, onSignOut }) {
  const lvl = Math.floor(xp / 200) + 1;
  const lvlPct = Math.round(((xp % 200) / 200) * 100);
  const totalLessons = Object.values(TRACKS).reduce((n, t) => n + t.lessons.length, 0);
  const quizAcc = stats.quizT ? Math.round((stats.quizC / stats.quizT) * 100) : null;
  const patAcc = stats.patT ? Math.round((stats.patC / stats.patT) * 100) : null;
  const badges = [
    { label: "First lecture", earned: completed.length >= 1, icon: "book", desc: "Complete one lesson" },
    { label: "Scholar", earned: completed.length >= 5, icon: "cap", desc: "Complete five lessons" },
    { label: "Module complete", earned: Object.values(TRACKS).some((t) => t.lessons.every((l) => completed.includes(l.id))), icon: "award", desc: "Finish an entire module" },
    { label: "Disciplined", earned: stats.sim >= 5, icon: "shield", desc: "Close five simulator trades" },
    { label: "Chartist", earned: stats.patC >= 5, icon: "eye", desc: "Identify five patterns" },
    { label: "Charged", earned: xp >= 500, icon: "bolt", desc: "Earn 500 XP" },
  ];
  const finishedTrack = Object.entries(TRACKS).find(([, t]) => t.lessons.every((l) => completed.includes(l.id)));

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <Card className="rise" style={{ padding: 28 }}>
        <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: T.gold, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, flexShrink: 0 }}>
            {(user.name || "T")[0].toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 21, fontWeight: 800 }}>{user.name || "Trader"}</div>
            <div style={{ fontSize: 13, color: T.grey, marginTop: 2, textTransform: "capitalize" }}>
              {user.level} track · {user.provider === "guest" ? "guest session" : `signed in with ${user.provider}`}
            </div>
            <div style={{ marginTop: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, fontWeight: 800, color: T.grey, marginBottom: 4 }}>
                <span>Level {lvl}</span><span>{xp % 200}/200 XP to level {lvl + 1}</span>
              </div>
              <div style={{ height: 6, background: T.bgAlt, borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${lvlPct}%`, background: T.gold, borderRadius: 99, transition: "width .5s" }} />
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="rise2" style={{ marginTop: 14 }}>
        <SectionLabel>Statistics</SectionLabel>
        <div className="statgrid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {[["Lessons", `${completed.length}/${totalLessons}`], ["Quiz accuracy", quizAcc == null ? "—" : `${quizAcc}%`], ["Sim trades", `${stats.sim}`], ["Pattern accuracy", patAcc == null ? "—" : `${patAcc}%`]].map(([k, v]) => (
            <div key={k} style={{ background: T.bgAlt, borderRadius: 8, padding: "14px 12px", textAlign: "center" }}>
              <div style={{ fontFamily: mono, fontSize: 19, fontWeight: 600 }}>{v}</div>
              <div style={{ fontSize: 10.5, color: T.grey, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase", marginTop: 3 }}>{k}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 18 }}>
          <SectionLabel>Module progress</SectionLabel>
          {Object.entries(TRACKS).map(([id, t]) => {
            const p = Math.round((t.lessons.filter((l) => completed.includes(l.id)).length / t.lessons.length) * 100);
            return (
              <div key={id} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, fontWeight: 700, marginBottom: 4 }}>
                  <span style={{ display: "inline-flex", gap: 7, alignItems: "center", color: T.ink }}><Icon name={t.icon} size={13} />{t.label}</span>
                  <span style={{ color: T.grey, fontFamily: mono }}>{p}%</span>
                </div>
                <div style={{ height: 5, background: T.bgAlt, borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${p}%`, background: id === user.level ? T.gold : T.greyLight, borderRadius: 99 }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {finishedTrack && (
        <Card className="pop" style={{ marginTop: 14, border: `2px solid ${T.gold}`, background: T.goldSoft, textAlign: "center", padding: 28 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 8, color: T.goldDeep }}><Icon name="award" size={30} /></div>
          <div style={{ fontFamily: serif, fontSize: 13, color: T.grey, letterSpacing: ".05em" }}>TradeAid · Department of Market Studies</div>
          <div style={{ fontFamily: serif, fontSize: 21, fontWeight: 600, margin: "6px 0 2px" }}>Certificate of Completion</div>
          <div style={{ fontSize: 14, color: T.ink }}>awarded to <strong>{user.name || "Trader"}</strong> for completing the <strong style={{ textTransform: "capitalize" }}>{finishedTrack[0]}</strong> module</div>
          <div style={{ fontFamily: mono, fontSize: 11.5, color: T.greyLight, marginTop: 8 }}>{new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</div>
        </Card>
      )}

      <Card className="rise3" style={{ marginTop: 14 }}>
        <SectionLabel>Achievements</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
          {badges.map((b) => (
            <div key={b.label} style={{ display: "flex", gap: 11, alignItems: "center", padding: "11px 13px", borderRadius: 8, background: b.earned ? T.goldSoft : T.bgAlt, border: `1.5px solid ${b.earned ? T.gold : "transparent"}`, opacity: b.earned ? 1 : 0.55 }}>
              <span style={{ color: b.earned ? T.goldDeep : T.greyLight }}><Icon name={b.icon} size={19} /></span>
              <span>
                <span style={{ display: "block", fontSize: 12.5, fontWeight: 800 }}>{b.label}</span>
                <span style={{ display: "block", fontSize: 10.5, color: T.grey }}>{b.desc}</span>
              </span>
            </div>
          ))}
        </div>
      </Card>

      {activity.length > 0 && (
        <Card className="rise3" style={{ marginTop: 14 }}>
          <SectionLabel>Recent activity</SectionLabel>
          {activity.slice(0, 6).map((a, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "8px 0", borderBottom: i < Math.min(activity.length, 6) - 1 ? `1px solid ${T.line}` : "none" }}>
              <span style={{ color: T.grey }}><Icon name={a.icon} size={15} /></span>
              <span style={{ flex: 1, fontSize: 13.5 }}>{a.label}</span>
              <span style={{ fontFamily: mono, fontSize: 11.5, color: T.greyLight }}>{a.time}</span>
            </div>
          ))}
        </Card>
      )}

      <Card className="rise3" style={{ marginTop: 14 }}>
        <SectionLabel>Preferences</SectionLabel>
        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Experience level</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {LEVELS.map((l) => (
              <button key={l.id} onClick={() => setUser({ ...user, level: l.id })}
                style={{ display: "inline-flex", alignItems: "center", gap: 7, border: `1.5px solid ${user.level === l.id ? T.ink : T.line}`, background: user.level === l.id ? T.ink : "#fff", color: user.level === l.id ? T.bg : T.grey, borderRadius: 999, padding: "8px 15px", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>
                <Icon name={l.icon} size={13} />{l.title}
              </button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={lbl}>Learning style</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {STYLES.map((st) => (
              <button key={st.id} onClick={() => setUser({ ...user, style: st.id })}
                style={{ display: "inline-flex", alignItems: "center", gap: 7, border: `1.5px solid ${user.style === st.id ? T.ink : T.line}`, background: user.style === st.id ? T.ink : "#fff", color: user.style === st.id ? T.bg : T.grey, borderRadius: 999, padding: "8px 15px", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>
                <Icon name={st.icon} size={13} />{st.title}
              </button>
            ))}
          </div>
        </div>
        <button onClick={onSignOut} style={{ display: "inline-flex", alignItems: "center", gap: 8, border: `1.5px solid ${T.line}`, background: T.card, color: T.burgundy, borderRadius: 999, padding: "10px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          <Icon name="logout" size={15} /> Sign out
        </button>
      </Card>
    </div>
  );
}

/* ============================== APP SHELL ============================== */
export default function TradeAid({ embedded = false, entryStage = "welcome", authIntent = null } = {}) {
  const [stage, setStage] = useState(entryStage);
  const [user, setUser] = useState({ name: "", provider: "", level: "beginner", style: "reading" });
  const [tab, setTab] = useState("home");
  const [completed, setCompleted] = useState([]);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(1);
  const [stats, setStats] = useState({ quizC: 0, quizT: 0, sim: 0, simW: 0, patC: 0, patT: 0 });
  const [activity, setActivity] = useState([]);

  const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const logAct = (label, icon) => setActivity((a) => [{ label, icon, time: now() }, ...a].slice(0, 12));
  const addXp = (n) => setXp((x) => x + n);
  const complete = (id) => {
    if (completed.includes(id)) return;
    setCompleted((c) => [...c, id]); addXp(50);
    setStreak((s) => s + (completed.length % 3 === 2 ? 1 : 0));
    const lesson = Object.values(TRACKS).flatMap((t) => t.lessons).find((l) => l.id === id);
    logAct(`Completed lecture: ${lesson?.title}`, "book");
  };
  const onSimTrade = (won) => { setStats((s) => ({ ...s, sim: s.sim + 1, simW: s.simW + (won ? 1 : 0) })); };
  const onPattern = (ok) => setStats((s) => ({ ...s, patC: s.patC + (ok ? 1 : 0), patT: s.patT + 1 }));
  const onQuizDone = (score, total) => { setStats((s) => ({ ...s, quizC: s.quizC + score, quizT: s.quizT + total })); logAct(`Finished a quiz: ${score}/${total}`, "check"); };

  if (stage === "welcome") return <><GlobalStyle /><Welcome embedded={embedded} onNext={() => setStage("auth")} /></>;
  if (stage === "auth") return <><GlobalStyle /><AuthScreen intent={authIntent} onAuth={(u) => { setUser({ ...user, ...u }); setStage(u.name ? "level" : "name"); }} /></>;
  if (stage === "name") return <><GlobalStyle /><NameScreen initial={user.name} onDone={(name) => { setUser({ ...user, name }); setStage("level"); }} /></>;
  if (stage === "level") return <><GlobalStyle /><PickScreen step={2} eyebrow="Personalize" title="How experienced are you?" sub="Your curriculum opens at the right depth. Switch modules anytime." items={LEVELS} onPick={(id) => { setUser({ ...user, level: id }); setStage("style"); }} /></>;
  if (stage === "style") return <><GlobalStyle /><PickScreen step={3} eyebrow="Personalize" title="How do you learn best?" sub="TradeAid adapts: visual learners see diagrams inside lessons; doers get routed to the simulator." items={STYLES} onPick={(id) => {
    const nextUser = { ...user, style: id };
    setUser(nextUser);
    // Fire the personalized welcome email once we know their learning style.
    // Only for accounts with an email on file and signup intent (not signin).
    if (nextUser.email && authIntent !== "signin") {
      fetch("/api/send-welcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nextUser.name, email: nextUser.email, style: id }),
      }).catch(() => {});
    }
    setStage("app");
  }} /></>;

  const NAV = [["home", "Home", "home"], ["learn", "Learn", "book"], ["practice", "Practice", "chart"], ["quiz", "Quiz", "check"], ["tools", "Tools", "calc"], ["profile", "Profile", "user"]];

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.ink, fontFamily: sans }}>
      <GlobalStyle />
      <header style={{ position: "sticky", top: embedded ? 68 : 0, zIndex: 10, background: "rgba(253,251,245,.93)", backdropFilter: "blur(10px)", borderBottom: `1px solid ${T.line}`, padding: "12px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", visibility: embedded ? "hidden" : "visible", width: embedded ? 0 : "auto" }} onClick={() => setTab("home")}>
          <Logo size={31} /><span style={{ fontWeight: 800, fontSize: 16.5, letterSpacing: "-0.02em" }}>TradeAid</span>
        </div>
        <nav style={{ display: "flex", gap: 4 }}>
          {NAV.map(([id, label, icon]) => (
            <button key={id} onClick={() => setTab(id)}
              style={{ display: "flex", alignItems: "center", gap: 8, border: "none", background: "transparent", color: tab === id ? T.emerald : T.grey, borderRadius: 0, padding: "10px 14px", fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer", borderBottom: `1px solid ${tab === id ? T.emerald : "transparent"}`, fontFamily: sans, transition: "color .15s ease, border-color .15s ease" }}>
              <Icon name={icon} size={14} color={tab === id ? T.emerald : T.grey} /><span className="navlabel">{label}</span>
            </button>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: sans, fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", background: T.emeraldSoft, border: `1px solid ${T.emerald}`, borderRadius: 4, padding: "8px 14px", whiteSpace: "nowrap", color: T.emerald }}>
          <Icon name="bolt" size={12} color={T.emerald} />{xp} XP
        </div>
      </header>

      <main style={{ maxWidth: 980, margin: "0 auto", padding: "28px 20px 70px" }}>
        {tab === "home" && <Home user={user} completed={completed} xp={xp} streak={streak} go={setTab} />}
        {tab === "learn" && <Learn user={user} completed={completed} complete={complete} />}
        {tab === "practice" && <Practice user={user} addXp={addXp} onSimTrade={onSimTrade} onPattern={onPattern} />}
        {tab === "quiz" && <Quiz user={user} addXp={addXp} onQuizDone={onQuizDone} />}
        {tab === "tools" && <Tools />}
        {tab === "profile" && <Profile user={user} setUser={setUser} xp={xp} completed={completed} stats={stats} activity={activity} onSignOut={() => { setStage("welcome"); setTab("home"); }} />}
      </main>

      <footer style={{ borderTop: `1px solid ${T.line}`, padding: "18px 22px 26px", fontSize: 12, color: T.greyLight, lineHeight: 1.65, maxWidth: 980, margin: "0 auto" }}>
        TradeAid is an educational demonstration. Nothing here constitutes financial, investment, or tax advice; the market data and sign-in are simulated, and projections are illustrative. Trading involves substantial risk of loss. Consult a licensed financial professional before making investment decisions.
      </footer>
    </div>
  );
}
