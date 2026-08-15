import React, { useState, useMemo } from "react";
import { T } from "./data";
import { CATEGORY_ASSETS, PREDICTIONS } from "./marketsData";
import AssetDetail from "./AssetDetail";

const fonts = {
  sans: "'DM Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  serif: "'Cormorant Garamond', Georgia, serif",
  mono: "'IBM Plex Mono', 'SF Mono', Consolas, monospace",
};

/* ---------------- Mock market data ---------------- */
const INDICES = [
  { sym: "S&P 500", val: "4,782.15", chg: "+19.72", pct: "+0.41%", up: true },
  { sym: "NASDAQ", val: "16,891.03", chg: "+52.11", pct: "+0.31%", up: true },
  { sym: "DOW", val: "38,109.43", chg: "-42.06", pct: "-0.11%", up: false },
  { sym: "RUSSELL 2K", val: "2,027.55", chg: "+3.98", pct: "+0.20%", up: true },
  { sym: "VIX", val: "13.48", chg: "-0.32", pct: "-2.32%", up: false },
  { sym: "10Y YIELD", val: "4.128%", chg: "+0.04", pct: "+0.98%", up: true },
];

const CATEGORIES = [
  { id: "equities", label: "Equities" },
  { id: "etfs", label: "ETFs" },
  { id: "crypto", label: "Crypto" },
  { id: "prediction", label: "Prediction" },
  { id: "forex", label: "Forex" },
  { id: "commodities", label: "Commodities" },
];

const _UNUSED_DATA = {
  equities: [
    { sym: "NVDA", name: "NVIDIA Corp.", price: 892.14, chg: 12.43, pct: 1.41, mcap: "2.19T", spark: [860, 855, 862, 858, 865, 870, 878, 875, 882, 885, 890, 892] },
    { sym: "AAPL", name: "Apple Inc.", price: 227.83, chg: 1.91, pct: 0.85, mcap: "3.48T", spark: [222, 224, 223, 225, 226, 225, 227, 226, 228, 227, 227, 228] },
    { sym: "MSFT", name: "Microsoft Corp.", price: 421.09, chg: -2.55, pct: -0.60, mcap: "3.13T", spark: [426, 424, 425, 423, 424, 422, 423, 421, 422, 421, 420, 421] },
    { sym: "META", name: "Meta Platforms", price: 512.44, chg: 8.11, pct: 1.61, mcap: "1.30T", spark: [500, 502, 504, 501, 505, 508, 506, 510, 509, 511, 512, 512] },
    { sym: "TSLA", name: "Tesla Inc.", price: 189.22, chg: -4.66, pct: -2.40, mcap: "601B", spark: [198, 196, 195, 194, 192, 193, 191, 192, 190, 189, 190, 189] },
    { sym: "GOOGL", name: "Alphabet Inc.", price: 152.19, chg: 0.87, pct: 0.57, mcap: "1.89T", spark: [151, 152, 151, 152, 151, 152, 151, 152, 152, 152, 152, 152] },
    { sym: "AMZN", name: "Amazon.com", price: 178.35, chg: 2.14, pct: 1.21, mcap: "1.86T", spark: [175, 176, 174, 176, 177, 175, 177, 176, 178, 177, 178, 178] },
    { sym: "JPM", name: "JPMorgan Chase", price: 199.05, chg: 0.44, pct: 0.22, mcap: "573B", spark: [197, 198, 197, 198, 199, 198, 198, 199, 198, 199, 199, 199] },
  ],
  etfs: [
    { sym: "SPY", name: "SPDR S&P 500 ETF", price: 478.52, chg: 1.97, pct: 0.41, mcap: "512B", spark: [473, 474, 475, 474, 476, 477, 476, 477, 478, 477, 478, 479] },
    { sym: "QQQ", name: "Invesco QQQ Trust", price: 411.27, chg: 1.29, pct: 0.31, mcap: "273B", spark: [408, 409, 410, 409, 410, 411, 410, 411, 411, 411, 411, 411] },
    { sym: "VTI", name: "Vanguard Total Market", price: 245.68, chg: 0.98, pct: 0.40, mcap: "402B", spark: [243, 244, 243, 244, 245, 244, 245, 245, 245, 245, 246, 246] },
    { sym: "IWM", name: "iShares Russell 2000", price: 202.75, chg: 0.40, pct: 0.20, mcap: "58B", spark: [201, 202, 201, 202, 202, 203, 202, 203, 202, 203, 202, 203] },
    { sym: "GLD", name: "SPDR Gold Shares", price: 218.44, chg: 1.62, pct: 0.75, mcap: "68B", spark: [215, 216, 215, 216, 217, 216, 217, 217, 218, 217, 218, 218] },
    { sym: "TLT", name: "20+ Year Treasury", price: 89.13, chg: -0.44, pct: -0.49, mcap: "51B", spark: [90, 90, 89, 90, 89, 90, 89, 89, 89, 89, 89, 89] },
  ],
  crypto: [
    { sym: "BTC", name: "Bitcoin", price: 96482.30, chg: 1284.12, pct: 1.35, mcap: "1.91T", spark: [94500, 95000, 94800, 95200, 95500, 95300, 95800, 96000, 95900, 96200, 96400, 96500] },
    { sym: "ETH", name: "Ethereum", price: 3421.55, chg: -22.10, pct: -0.64, mcap: "412B", spark: [3450, 3440, 3445, 3430, 3435, 3425, 3430, 3420, 3425, 3420, 3421, 3422] },
    { sym: "SOL", name: "Solana", price: 189.44, chg: 5.21, pct: 2.83, mcap: "89B", spark: [183, 184, 185, 184, 186, 187, 186, 188, 187, 188, 189, 189] },
    { sym: "DOGE", name: "Dogecoin", price: 0.3421, chg: 0.0084, pct: 2.52, mcap: "50B", spark: [0.33, 0.335, 0.334, 0.336, 0.338, 0.337, 0.339, 0.34, 0.341, 0.34, 0.342, 0.342] },
    { sym: "ADA", name: "Cardano", price: 0.9812, chg: -0.0122, pct: -1.23, mcap: "34B", spark: [0.99, 0.995, 0.99, 0.985, 0.988, 0.983, 0.985, 0.98, 0.982, 0.98, 0.981, 0.981] },
    { sym: "LINK", name: "Chainlink", price: 18.44, chg: 0.32, pct: 1.77, mcap: "11B", spark: [18.1, 18.2, 18.1, 18.2, 18.3, 18.2, 18.3, 18.4, 18.3, 18.4, 18.4, 18.4] },
  ],
  forex: [
    { sym: "EUR/USD", name: "Euro / US Dollar", price: 1.0854, chg: 0.0021, pct: 0.19, mcap: "—", spark: [1.083, 1.084, 1.083, 1.084, 1.085, 1.084, 1.085, 1.085, 1.085, 1.085, 1.085, 1.085] },
    { sym: "GBP/USD", name: "Pound / Dollar", price: 1.2712, chg: -0.0034, pct: -0.27, mcap: "—", spark: [1.275, 1.274, 1.273, 1.274, 1.272, 1.273, 1.271, 1.272, 1.271, 1.271, 1.271, 1.271] },
    { sym: "USD/JPY", name: "Dollar / Yen", price: 154.32, chg: 0.44, pct: 0.29, mcap: "—", spark: [153.8, 153.9, 154, 153.9, 154.1, 154.2, 154.1, 154.2, 154.3, 154.2, 154.3, 154.3] },
    { sym: "USD/CAD", name: "Dollar / Canadian", price: 1.3654, chg: -0.0012, pct: -0.09, mcap: "—", spark: [1.367, 1.366, 1.367, 1.366, 1.365, 1.366, 1.365, 1.365, 1.365, 1.365, 1.365, 1.365] },
  ],
  commodities: [
    { sym: "GOLD", name: "Gold Spot", price: 2352.44, chg: 15.20, pct: 0.65, mcap: "—", spark: [2330, 2335, 2338, 2340, 2342, 2345, 2348, 2346, 2350, 2349, 2352, 2352] },
    { sym: "SILVER", name: "Silver Spot", price: 30.14, chg: 0.41, pct: 1.38, mcap: "—", spark: [29.6, 29.7, 29.8, 29.75, 29.9, 30, 29.95, 30.05, 30.1, 30.05, 30.14, 30.14] },
    { sym: "WTI", name: "Crude Oil", price: 78.44, chg: -0.66, pct: -0.83, mcap: "—", spark: [79.5, 79.3, 79.4, 79, 79.1, 78.9, 79, 78.7, 78.6, 78.5, 78.4, 78.4] },
    { sym: "COPPER", name: "Copper", price: 4.512, chg: 0.031, pct: 0.69, mcap: "—", spark: [4.48, 4.49, 4.48, 4.49, 4.5, 4.49, 4.5, 4.51, 4.5, 4.51, 4.51, 4.51] },
  ],
};

// PREDICTIONS + CATEGORY_ASSETS imported from marketsData.js
const DATA = CATEGORY_ASSETS;

/* ---------------- Helpers ---------------- */
const fmtPrice = (n) => {
  if (n < 1) return n.toFixed(4);
  if (n < 100) return n.toFixed(2);
  if (n < 10000) return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

function Sparkline({ data, up, width = 92, height = 32 }) {
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
  const stepX = width / (data.length - 1);
  const points = data.map((v, i) => `${(i * stepX).toFixed(1)},${(height - ((v - min) / range) * height).toFixed(1)}`).join(" ");
  const color = up ? T.emerald : T.burgundy;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block" }}>
      <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  );
}

/* ---------------- Sub-components ---------------- */
function IndexStrip() {
  return (
    <div style={{ borderTop: `1px solid ${T.line}`, borderBottom: `1px solid ${T.line}`, background: T.bg, overflow: "hidden" }}>
      <div style={{ display: "flex", gap: 0, overflowX: "auto", maxWidth: 1280, margin: "0 auto" }}>
        {INDICES.map((idx) => (
          <div key={idx.sym} style={{ flex: "1 1 auto", minWidth: 180, padding: "18px 24px", borderRight: `1px solid ${T.line}`, whiteSpace: "nowrap" }}>
            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: T.text, marginBottom: 6 }}>{idx.sym}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <span style={{ fontFamily: fonts.mono, fontSize: 18, fontWeight: 500, color: T.ink }}>{idx.val}</span>
              <span style={{ fontFamily: fonts.mono, fontSize: 12, color: idx.up ? T.emerald : T.burgundy }}>{idx.pct}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoryTabs({ active, setActive }) {
  return (
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", borderBottom: `1px solid ${T.line}`, marginBottom: 40 }}>
      {CATEGORIES.map((c) => (
        <button key={c.id} onClick={() => setActive(c.id)}
          style={{ background: "transparent", border: "none", padding: "16px 20px", fontFamily: fonts.sans, fontSize: 11, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: active === c.id ? T.emerald : T.text, cursor: "pointer", borderBottom: `2px solid ${active === c.id ? T.emerald : "transparent"}`, marginBottom: -1, transition: "color .15s ease, border-color .15s ease" }}>
          {c.label}
        </button>
      ))}
    </div>
  );
}

function AssetRow({ a, onClick }) {
  const up = a.chg >= 0;
  return (
    <div onClick={onClick} style={{ display: "grid", gridTemplateColumns: "1.4fr 2fr 1.2fr 1fr 1fr 1.2fr", alignItems: "center", padding: "20px 24px", borderBottom: `1px solid ${T.line}`, background: T.bg, transition: "background .15s ease", cursor: "pointer" }}
      onMouseEnter={(e) => e.currentTarget.style.background = T.surface}
      onMouseLeave={(e) => e.currentTarget.style.background = T.bg}>
      <div style={{ fontFamily: fonts.mono, fontSize: 14, fontWeight: 500, color: T.ink, letterSpacing: "0.02em" }}>{a.sym}</div>
      <div style={{ fontFamily: fonts.serif, fontSize: 16, fontWeight: 400, color: T.ink }}>{a.name}</div>
      <div style={{ fontFamily: fonts.mono, fontSize: 14, color: T.ink, textAlign: "right" }}>{fmtPrice(a.price)}</div>
      <div style={{ fontFamily: fonts.mono, fontSize: 13, color: up ? T.emerald : T.burgundy, textAlign: "right" }}>{up ? "+" : ""}{a.pct.toFixed(2)}%</div>
      <div style={{ fontFamily: fonts.mono, fontSize: 12, color: T.text, textAlign: "right" }}>{a.mcap}</div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}><Sparkline data={a.spark} up={up} /></div>
    </div>
  );
}

function AssetTable({ assets, onPick }) {
  return (
    <div style={{ border: `1px solid ${T.line}`, borderRadius: 4, overflow: "hidden", background: T.bg }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 2fr 1.2fr 1fr 1fr 1.2fr", padding: "14px 24px", background: T.surface, borderBottom: `1px solid ${T.line}` }}>
        {["Symbol", "Name", "Price", "Change", "Market cap", "Trend"].map((h, i) => (
          <div key={h} style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: T.text, textAlign: i >= 2 && i <= 4 ? "right" : (i === 5 ? "right" : "left") }}>{h}</div>
        ))}
      </div>
      {assets.map((a) => <AssetRow key={a.sym} a={a} onClick={() => onPick(a)} />)}
    </div>
  );
}

function PredictionCard({ p, onClick }) {
  return (
    <article onClick={onClick} style={{ background: T.bg, border: `1px solid ${T.line}`, borderRadius: 4, padding: 24, display: "flex", flexDirection: "column", gap: 16, cursor: "pointer", transition: "border-color .15s ease" }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = T.emerald}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = T.line}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: T.burgundy }}>{p.cat}</div>
        <div style={{ fontFamily: fonts.mono, fontSize: 11, color: T.text }}>Closes {p.exp}</div>
      </div>
      <h3 style={{ fontFamily: fonts.serif, fontSize: 20, fontWeight: 400, color: T.ink, margin: 0, lineHeight: 1.3 }}>{p.q}</h3>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontFamily: fonts.mono, fontSize: 12, color: T.text }}>
          <span>YES {p.yes}¢</span><span>NO {100 - p.yes}¢</span>
        </div>
        <div style={{ height: 6, background: T.surface, borderRadius: 4, overflow: "hidden", display: "flex" }}>
          <div style={{ width: `${p.yes}%`, background: T.emerald }}></div>
          <div style={{ width: `${100 - p.yes}%`, background: T.burgundy, opacity: 0.6 }}></div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: `1px solid ${T.line}` }}>
        <div style={{ fontSize: 11, color: T.text, letterSpacing: "0.05em" }}>Volume · {p.vol}</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ background: T.emeraldSoft, color: T.emerald, border: `1px solid ${T.emerald}`, borderRadius: 4, padding: "8px 16px", fontFamily: fonts.sans, fontSize: 10, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>Buy YES</button>
          <button style={{ background: "transparent", color: T.burgundy, border: `1px solid ${T.burgundy}`, borderRadius: 4, padding: "8px 16px", fontFamily: fonts.sans, fontSize: 10, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>Buy NO</button>
        </div>
      </div>
    </article>
  );
}

/* ---------------- Main page ---------------- */
export default function Markets() {
  const [cat, setCat] = useState("equities");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null); // { asset, kind }

  const filtered = useMemo(() => {
    if (cat === "prediction") return [];
    const list = DATA[cat] || [];
    if (!query.trim()) return list;
    const q = query.toLowerCase();
    return list.filter((a) => a.sym.toLowerCase().includes(q) || a.name.toLowerCase().includes(q));
  }, [cat, query]);

  const gainers = useMemo(() => {
    const all = Object.values(DATA).flat();
    return [...all].sort((a, b) => b.pct - a.pct).slice(0, 3);
  }, []);
  const losers = useMemo(() => {
    const all = Object.values(DATA).flat();
    return [...all].sort((a, b) => a.pct - b.pct).slice(0, 3);
  }, []);

  if (selected) {
    return <AssetDetail asset={selected.asset} kind={selected.kind} onBack={() => { setSelected(null); window.scrollTo({ top: 0, behavior: "instant" }); }} />;
  }

  return (
    <div style={{ background: T.bg, minHeight: "100vh" }}>
      {/* Hero */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 28px 40px" }}>
        <div style={{ color: T.burgundy, textTransform: "uppercase", letterSpacing: "0.18em", fontSize: 11, marginBottom: 18, fontFamily: fonts.sans, fontWeight: 500 }}>Markets</div>
        <h1 style={{ fontFamily: fonts.serif, fontSize: "clamp(48px, 6vw, 72px)", lineHeight: 1.02, fontWeight: 300, letterSpacing: "-0.02em", margin: 0, color: T.ink, maxWidth: 900 }}>
          The world's <em style={{ fontStyle: "italic", color: T.goldDeep, fontWeight: 400 }}>pulse</em>, without the noise.
        </h1>
        <p style={{ fontFamily: fonts.sans, fontSize: 16, fontWeight: 300, color: T.text, lineHeight: 1.75, maxWidth: 620, marginTop: 24 }}>
          Equities, ETFs, crypto, forex, commodities, and prediction markets — measured, contextual, and slow enough to think.
        </p>
        <div style={{ marginTop: 32, maxWidth: 480, position: "relative" }}>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search a ticker or name…"
            style={{ width: "100%", padding: "14px 18px 14px 44px", borderRadius: 4, border: `1px solid ${T.line}`, background: T.bg, fontFamily: fonts.sans, fontSize: 14, fontWeight: 300, color: T.ink }} />
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ position: "absolute", left: 16, top: 16, color: T.text }}>
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" /><line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>
      </section>

      <IndexStrip />

      {/* Movers strip */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 28px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
          <div>
            <div style={{ color: T.burgundy, textTransform: "uppercase", letterSpacing: "0.18em", fontSize: 11, marginBottom: 16, fontFamily: fonts.sans, fontWeight: 500 }}>Top gainers</div>
            <div style={{ border: `1px solid ${T.line}`, borderRadius: 4 }}>
              {gainers.map((a, i) => (
                <div key={a.sym} onClick={() => { const kind = Object.entries(DATA).find(([, list]) => list.includes(a))?.[0] || "equities"; setSelected({ asset: a, kind }); }} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: i < 2 ? `1px solid ${T.line}` : "none", cursor: "pointer", transition: "background .15s ease" }} onMouseEnter={(e) => e.currentTarget.style.background = T.surface} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  <div>
                    <div style={{ fontFamily: fonts.mono, fontSize: 13, fontWeight: 500, color: T.ink }}>{a.sym}</div>
                    <div style={{ fontFamily: fonts.serif, fontSize: 15, color: T.text, marginTop: 2 }}>{a.name}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: fonts.mono, fontSize: 14, color: T.ink }}>{fmtPrice(a.price)}</div>
                    <div style={{ fontFamily: fonts.mono, fontSize: 12, color: T.emerald, marginTop: 2 }}>+{a.pct.toFixed(2)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ color: T.burgundy, textTransform: "uppercase", letterSpacing: "0.18em", fontSize: 11, marginBottom: 16, fontFamily: fonts.sans, fontWeight: 500 }}>Top losers</div>
            <div style={{ border: `1px solid ${T.line}`, borderRadius: 4 }}>
              {losers.map((a, i) => (
                <div key={a.sym} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: i < losers.length - 1 ? `1px solid ${T.line}` : "none" }}>
                  <div>
                    <div style={{ fontFamily: fonts.mono, fontSize: 13, fontWeight: 500, color: T.ink }}>{a.sym}</div>
                    <div style={{ fontFamily: fonts.serif, fontSize: 15, color: T.text, marginTop: 2 }}>{a.name}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: fonts.mono, fontSize: 14, color: T.ink }}>{fmtPrice(a.price)}</div>
                    <div style={{ fontFamily: fonts.mono, fontSize: 12, color: T.burgundy, marginTop: 2 }}>{a.pct.toFixed(2)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 28px 20px" }}>
        <div style={{ color: T.burgundy, textTransform: "uppercase", letterSpacing: "0.18em", fontSize: 11, marginBottom: 24, fontFamily: fonts.sans, fontWeight: 500 }}>Explore</div>
        <CategoryTabs active={cat} setActive={setCat} />

        {cat === "prediction" ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 20 }}>
            {PREDICTIONS.map((p) => <PredictionCard key={p.id} p={p} onClick={() => setSelected({ asset: p, kind: "prediction" })} />)}
          </div>
        ) : (
          <AssetTable assets={filtered} onPick={(a) => setSelected({ asset: a, kind: cat })} />
        )}

        {cat !== "prediction" && filtered.length === 0 && (
          <div style={{ padding: 60, textAlign: "center", color: T.text, fontFamily: fonts.serif, fontSize: 20, fontStyle: "italic" }}>Nothing matches "{query}".</div>
        )}
      </section>

      {/* Disclaimer */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 28px 60px" }}>
        <div style={{ borderTop: `1px solid ${T.line}`, paddingTop: 32, fontSize: 12, color: T.textSoft, lineHeight: 1.7, maxWidth: 800 }}>
          Market data displayed is illustrative and intended for educational purposes only. TradeAid does not provide investment advice, and prices shown are simulated snapshots. Consult a licensed financial professional before making any investment decision.
        </div>
      </section>
    </div>
  );
}
