import React, { useState, useMemo } from "react";
import { T } from "./data";
import { series } from "./marketsData";

const fonts = {
  sans: "'DM Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  serif: "'Cormorant Garamond', Georgia, serif",
  mono: "'IBM Plex Mono', 'SF Mono', Consolas, monospace",
};

const RANGES = [
  { id: "1D", points: 78, vol: 0.004 },
  { id: "1W", points: 168, vol: 0.008 },
  { id: "1M", points: 130, vol: 0.015 },
  { id: "3M", points: 195, vol: 0.02 },
  { id: "1Y", points: 252, vol: 0.03 },
  { id: "ALL", points: 500, vol: 0.045 },
];

function BigChart({ sym, price, up, range }) {
  const cfg = RANGES.find((r) => r.id === range) || RANGES[2];
  const data = useMemo(() => series(sym + range, cfg.points, price, cfg.vol), [sym, range, price, cfg.points, cfg.vol]);
  const W = 800, H = 320, pad = 8;
  const min = Math.min(...data), max = Math.max(...data), rng = max - min || 1;
  const stepX = (W - pad * 2) / (data.length - 1);
  const points = data.map((v, i) => `${(pad + i * stepX).toFixed(1)},${(H - pad - ((v - min) / rng) * (H - pad * 2)).toFixed(1)}`).join(" ");
  const color = up ? T.emerald : T.burgundy;
  const areaPoints = `${pad},${H - pad} ${points} ${W - pad},${H - pad}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 320, display: "block" }}>
      <defs>
        <linearGradient id={`grad-${sym}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon fill={`url(#grad-${sym})`} points={areaPoints} />
      <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  );
}

function TradePanel({ asset, kind }) {
  const [side, setSide] = useState("buy");   // buy · sell · short · cover
  const [type, setType] = useState("market"); // market · limit · stop
  const [qty, setQty] = useState("");
  const [limit, setLimit] = useState("");
  const [stop, setStop] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);

  const px = type === "limit" ? Number(limit) || asset.price : type === "stop" ? Number(stop) || asset.price : asset.price;
  const cost = (Number(qty) || 0) * px;
  const canSubmit = Number(qty) > 0 && (type !== "limit" || Number(limit) > 0) && (type !== "stop" || Number(stop) > 0);

  const SIDES = kind === "crypto"
    ? [["buy", "Buy"], ["sell", "Sell"]]
    : [["buy", "Buy long"], ["sell", "Sell"], ["short", "Short"], ["cover", "Cover"]];
  const TYPES = [["market", "Market"], ["limit", "Limit"], ["stop", "Stop"]];

  if (done) {
    return (
      <div style={{ background: T.bg, border: `1px solid ${T.emerald}`, borderRadius: 4, padding: 32, textAlign: "center" }}>
        <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: T.emerald, marginBottom: 14 }}>Order simulated</div>
        <h3 style={{ fontFamily: fonts.serif, fontSize: 26, fontWeight: 300, color: T.ink, margin: "0 0 14px" }}>Filled at ${px.toFixed(2)}</h3>
        <p style={{ color: T.text, fontSize: 14, lineHeight: 1.7, fontWeight: 300, margin: "0 0 22px" }}>{side.toUpperCase()} · {qty} {asset.sym} · Notional ${cost.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
        <button onClick={() => { setDone(false); setConfirming(false); setQty(""); }} style={{ background: T.emerald, color: T.bg, border: "none", borderRadius: 4, padding: "12px 26px", fontFamily: fonts.sans, fontSize: 11, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>New order</button>
      </div>
    );
  }

  return (
    <div style={{ background: T.bg, border: `1px solid ${T.line}`, borderRadius: 4, padding: 28, position: "sticky", top: 92 }}>
      <div style={{ color: T.burgundy, textTransform: "uppercase", letterSpacing: "0.18em", fontSize: 10, marginBottom: 10, fontFamily: fonts.sans, fontWeight: 500 }}>Simulator</div>
      <h3 style={{ fontFamily: fonts.serif, fontSize: 22, fontWeight: 400, color: T.ink, margin: "0 0 22px" }}>Practice this trade</h3>

      {/* Side */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${SIDES.length}, 1fr)`, gap: 4, marginBottom: 18, border: `1px solid ${T.line}`, borderRadius: 4, padding: 3 }}>
        {SIDES.map(([id, label]) => (
          <button key={id} onClick={() => setSide(id)} style={{ background: side === id ? T.emerald : "transparent", color: side === id ? T.bg : T.ink, border: "none", borderRadius: 3, padding: "10px 6px", fontFamily: fonts.sans, fontSize: 10, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", transition: "all .15s ease" }}>{label}</button>
        ))}
      </div>

      {/* Type */}
      <div style={{ display: "flex", gap: 12, marginBottom: 18, fontFamily: fonts.sans, fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        {TYPES.map(([id, label]) => (
          <button key={id} onClick={() => setType(id)} style={{ background: "transparent", border: "none", borderBottom: `1px solid ${type === id ? T.ink : "transparent"}`, color: type === id ? T.ink : T.text, padding: "6px 2px", cursor: "pointer" }}>{label}</button>
        ))}
      </div>

      {/* Quantity */}
      <label style={{ display: "block", fontSize: 10, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: T.text, marginBottom: 8 }}>Quantity</label>
      <input value={qty} onChange={(e) => setQty(e.target.value.replace(/[^0-9.]/g, ""))} placeholder="0"
        style={{ width: "100%", padding: "14px 16px", borderRadius: 4, border: `1px solid ${T.line}`, background: T.bg, fontFamily: fonts.mono, fontSize: 18, color: T.ink, marginBottom: 16 }} />

      {type === "limit" && (
        <>
          <label style={{ display: "block", fontSize: 10, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: T.text, marginBottom: 8 }}>Limit price</label>
          <input value={limit} onChange={(e) => setLimit(e.target.value.replace(/[^0-9.]/g, ""))} placeholder={asset.price.toFixed(2)}
            style={{ width: "100%", padding: "14px 16px", borderRadius: 4, border: `1px solid ${T.line}`, background: T.bg, fontFamily: fonts.mono, fontSize: 15, color: T.ink, marginBottom: 16 }} />
        </>
      )}

      {type === "stop" && (
        <>
          <label style={{ display: "block", fontSize: 10, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: T.text, marginBottom: 8 }}>Stop price</label>
          <input value={stop} onChange={(e) => setStop(e.target.value.replace(/[^0-9.]/g, ""))} placeholder={asset.price.toFixed(2)}
            style={{ width: "100%", padding: "14px 16px", borderRadius: 4, border: `1px solid ${T.line}`, background: T.bg, fontFamily: fonts.mono, fontSize: 15, color: T.ink, marginBottom: 16 }} />
        </>
      )}

      {/* Summary */}
      <div style={{ background: T.surface, borderRadius: 4, padding: 16, marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: T.text, marginBottom: 6 }}>
          <span>Order</span><span style={{ color: T.ink, fontFamily: fonts.mono }}>{side.toUpperCase()} {type.toUpperCase()}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: T.text, marginBottom: 6 }}>
          <span>Est. price</span><span style={{ color: T.ink, fontFamily: fonts.mono }}>${px.toFixed(2)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: T.ink, borderTop: `1px solid ${T.line}`, paddingTop: 10, marginTop: 6 }}>
          <span style={{ fontWeight: 500 }}>Notional</span><span style={{ fontFamily: fonts.mono, fontWeight: 500 }}>${cost.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
        </div>
      </div>

      {!confirming ? (
        <button disabled={!canSubmit} onClick={() => setConfirming(true)}
          style={{ width: "100%", background: canSubmit ? T.ink : T.line, color: canSubmit ? T.bg : T.text, border: "none", borderRadius: 4, padding: "16px", fontFamily: fonts.sans, fontSize: 11, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", cursor: canSubmit ? "pointer" : "not-allowed" }}>
          Preview order
        </button>
      ) : (
        <div style={{ display: "grid", gap: 8 }}>
          <button onClick={() => setDone(true)} style={{ background: T.emerald, color: T.bg, border: "none", borderRadius: 4, padding: "16px", fontFamily: fonts.sans, fontSize: 11, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>Confirm simulation</button>
          <button onClick={() => setConfirming(false)} style={{ background: "transparent", color: T.text, border: `1px solid ${T.line}`, borderRadius: 4, padding: "12px", fontFamily: fonts.sans, fontSize: 10, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>Cancel</button>
        </div>
      )}

      <p style={{ fontSize: 11, color: T.textSoft, lineHeight: 1.65, marginTop: 18, fontWeight: 300 }}>Educational simulation only — no real order is placed, no money at risk.</p>
    </div>
  );
}

function PredictionPanel({ p }) {
  const [side, setSide] = useState("yes");
  const [action, setAction] = useState("buy");
  const [qty, setQty] = useState("");
  const [done, setDone] = useState(false);

  const priceYes = p.yes;
  const priceNo = 100 - p.yes;
  const px = side === "yes" ? priceYes : priceNo;
  const cost = ((Number(qty) || 0) * px) / 100;
  const potential = (Number(qty) || 0) * 1.00 - cost;

  if (done) {
    return (
      <div style={{ background: T.bg, border: `1px solid ${T.emerald}`, borderRadius: 4, padding: 32, textAlign: "center" }}>
        <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: T.emerald, marginBottom: 14 }}>Position simulated</div>
        <h3 style={{ fontFamily: fonts.serif, fontSize: 26, fontWeight: 300, color: T.ink, margin: "0 0 14px" }}>{action.toUpperCase()} {qty} {side.toUpperCase()} shares</h3>
        <p style={{ color: T.text, fontSize: 14, lineHeight: 1.7, fontWeight: 300, margin: "0 0 8px" }}>Paid ${cost.toFixed(2)} · Max payout ${(Number(qty) * 1).toFixed(2)}</p>
        <p style={{ color: T.emerald, fontSize: 14, fontFamily: fonts.mono, margin: "0 0 22px" }}>+${potential.toFixed(2)} potential profit</p>
        <button onClick={() => { setDone(false); setQty(""); }} style={{ background: T.emerald, color: T.bg, border: "none", borderRadius: 4, padding: "12px 26px", fontFamily: fonts.sans, fontSize: 11, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>New position</button>
      </div>
    );
  }

  return (
    <div style={{ background: T.bg, border: `1px solid ${T.line}`, borderRadius: 4, padding: 28, position: "sticky", top: 92 }}>
      <div style={{ color: T.burgundy, textTransform: "uppercase", letterSpacing: "0.18em", fontSize: 10, marginBottom: 10, fontFamily: fonts.sans, fontWeight: 500 }}>Simulator</div>
      <h3 style={{ fontFamily: fonts.serif, fontSize: 22, fontWeight: 400, color: T.ink, margin: "0 0 22px" }}>Take a position</h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, marginBottom: 14, border: `1px solid ${T.line}`, borderRadius: 4, padding: 3 }}>
        <button onClick={() => setSide("yes")} style={{ background: side === "yes" ? T.emerald : "transparent", color: side === "yes" ? T.bg : T.ink, border: "none", borderRadius: 3, padding: "12px 6px", fontFamily: fonts.sans, fontSize: 11, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>YES {priceYes}¢</button>
        <button onClick={() => setSide("no")} style={{ background: side === "no" ? T.burgundy : "transparent", color: side === "no" ? T.bg : T.ink, border: "none", borderRadius: 3, padding: "12px 6px", fontFamily: fonts.sans, fontSize: 11, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>NO {priceNo}¢</button>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 18, fontFamily: fonts.sans, fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        {[["buy", "Buy"], ["sell", "Sell"]].map(([id, label]) => (
          <button key={id} onClick={() => setAction(id)} style={{ background: "transparent", border: "none", borderBottom: `1px solid ${action === id ? T.ink : "transparent"}`, color: action === id ? T.ink : T.text, padding: "6px 2px", cursor: "pointer" }}>{label}</button>
        ))}
      </div>

      <label style={{ display: "block", fontSize: 10, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: T.text, marginBottom: 8 }}>Shares</label>
      <input value={qty} onChange={(e) => setQty(e.target.value.replace(/[^0-9]/g, ""))} placeholder="0"
        style={{ width: "100%", padding: "14px 16px", borderRadius: 4, border: `1px solid ${T.line}`, background: T.bg, fontFamily: fonts.mono, fontSize: 18, color: T.ink, marginBottom: 16 }} />

      <div style={{ background: T.surface, borderRadius: 4, padding: 16, marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: T.text, marginBottom: 6 }}>
          <span>Cost</span><span style={{ color: T.ink, fontFamily: fonts.mono }}>${cost.toFixed(2)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: T.text, marginBottom: 6 }}>
          <span>Payout if right</span><span style={{ color: T.emerald, fontFamily: fonts.mono }}>${(Number(qty) * 1 || 0).toFixed(2)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: T.ink, borderTop: `1px solid ${T.line}`, paddingTop: 10, marginTop: 6 }}>
          <span style={{ fontWeight: 500 }}>Potential profit</span><span style={{ fontFamily: fonts.mono, fontWeight: 500, color: T.emerald }}>+${potential.toFixed(2)}</span>
        </div>
      </div>

      <button disabled={!Number(qty)} onClick={() => setDone(true)}
        style={{ width: "100%", background: Number(qty) ? T.ink : T.line, color: Number(qty) ? T.bg : T.text, border: "none", borderRadius: 4, padding: "16px", fontFamily: fonts.sans, fontSize: 11, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", cursor: Number(qty) ? "pointer" : "not-allowed" }}>
        Simulate position
      </button>

      <p style={{ fontSize: 11, color: T.textSoft, lineHeight: 1.65, marginTop: 18, fontWeight: 300 }}>Prediction market shares pay $1.00 if the outcome resolves in your favor, $0 otherwise.</p>
    </div>
  );
}

/* -------- Main -------- */
export default function AssetDetail({ asset, kind, onBack }) {
  const [range, setRange] = useState("1M");

  if (kind === "prediction") {
    return (
      <div style={{ background: T.bg, minHeight: "100vh" }}>
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 28px 20px" }}>
          <button onClick={onBack} style={{ background: "transparent", border: "none", cursor: "pointer", color: T.text, fontFamily: fonts.sans, fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", padding: 0, marginBottom: 32 }}>← Back to markets</button>
          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 40 }}>
            <div>
              <div style={{ color: T.burgundy, textTransform: "uppercase", letterSpacing: "0.18em", fontSize: 11, marginBottom: 14, fontFamily: fonts.sans, fontWeight: 500 }}>{asset.cat} · Prediction market</div>
              <h1 style={{ fontFamily: fonts.serif, fontSize: 44, lineHeight: 1.1, fontWeight: 300, letterSpacing: "-0.02em", margin: 0, color: T.ink }}>{asset.q}</h1>

              <div style={{ display: "flex", gap: 24, marginTop: 32, padding: "24px 28px", background: T.surface, borderRadius: 4 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: T.text, marginBottom: 6 }}>YES probability</div>
                  <div style={{ fontFamily: fonts.serif, fontSize: 48, fontWeight: 300, color: T.emerald, lineHeight: 1 }}>{asset.yes}%</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: T.text, marginBottom: 6 }}>NO probability</div>
                  <div style={{ fontFamily: fonts.serif, fontSize: 48, fontWeight: 300, color: T.burgundy, lineHeight: 1 }}>{100 - asset.yes}%</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: T.text, marginBottom: 6 }}>Volume</div>
                  <div style={{ fontFamily: fonts.mono, fontSize: 22, color: T.ink }}>{asset.vol}</div>
                  <div style={{ fontSize: 12, color: T.text, marginTop: 4 }}>Closes {asset.exp}</div>
                </div>
              </div>

              <div style={{ marginTop: 32 }}>
                <div style={{ color: T.burgundy, textTransform: "uppercase", letterSpacing: "0.18em", fontSize: 11, marginBottom: 12, fontFamily: fonts.sans, fontWeight: 500 }}>Resolution</div>
                <p style={{ fontFamily: fonts.serif, fontSize: 18, lineHeight: 1.7, color: T.ink, fontWeight: 300, margin: 0 }}>{asset.desc}</p>
              </div>
            </div>
            <div>
              <PredictionPanel p={asset} />
            </div>
          </div>
        </section>
      </div>
    );
  }

  const up = asset.chg >= 0;
  const fmtPrice = asset.price < 1 ? asset.price.toFixed(4) : asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const stats = [
    { l: "Market cap", v: asset.mcap },
    { l: "Volume", v: asset.vol },
    { l: "52-week high", v: `$${asset.high52.toLocaleString(undefined, { maximumFractionDigits: 2 })}` },
    { l: "52-week low", v: `$${asset.low52.toLocaleString(undefined, { maximumFractionDigits: 2 })}` },
    ...(asset.pe ? [{ l: "P/E ratio", v: asset.pe.toFixed(1) }] : []),
    { l: "Sector", v: asset.sector },
  ];

  return (
    <div style={{ background: T.bg, minHeight: "100vh" }}>
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 28px 20px" }}>
        <button onClick={onBack} style={{ background: "transparent", border: "none", cursor: "pointer", color: T.text, fontFamily: fonts.sans, fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", padding: 0, marginBottom: 32 }}>← Back to markets</button>

        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 40, alignItems: "start" }}>
          <div>
            {/* Header */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ color: T.burgundy, textTransform: "uppercase", letterSpacing: "0.18em", fontSize: 11, marginBottom: 12, fontFamily: fonts.sans, fontWeight: 500 }}>{asset.sector}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 20, flexWrap: "wrap" }}>
                <h1 style={{ fontFamily: fonts.serif, fontSize: 52, lineHeight: 1, fontWeight: 300, letterSpacing: "-0.02em", margin: 0, color: T.ink }}>{asset.name}</h1>
                <span style={{ fontFamily: fonts.mono, fontSize: 15, color: T.text, letterSpacing: "0.05em" }}>{asset.sym}</span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginTop: 22 }}>
                <span style={{ fontFamily: fonts.serif, fontSize: 56, fontWeight: 300, color: T.ink, letterSpacing: "-0.02em", lineHeight: 1 }}>${fmtPrice}</span>
                <span style={{ fontFamily: fonts.mono, fontSize: 16, color: up ? T.emerald : T.burgundy }}>{up ? "+" : ""}{asset.chg.toFixed(2)} · {up ? "+" : ""}{asset.pct.toFixed(2)}%</span>
              </div>
            </div>

            {/* Chart */}
            <div style={{ border: `1px solid ${T.line}`, borderRadius: 4, padding: 24, background: T.bg, marginBottom: 32 }}>
              <BigChart sym={asset.sym} price={asset.price} up={up} range={range} />
              <div style={{ display: "flex", gap: 4, marginTop: 20, justifyContent: "center" }}>
                {RANGES.map((r) => (
                  <button key={r.id} onClick={() => setRange(r.id)} style={{ background: range === r.id ? T.ink : "transparent", color: range === r.id ? T.bg : T.text, border: "none", borderRadius: 4, padding: "8px 16px", fontFamily: fonts.sans, fontSize: 10, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", transition: "all .15s ease" }}>{r.id}</button>
                ))}
              </div>
            </div>

            {/* Key stats */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ color: T.burgundy, textTransform: "uppercase", letterSpacing: "0.18em", fontSize: 11, marginBottom: 16, fontFamily: fonts.sans, fontWeight: 500 }}>Key statistics</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: T.line, border: `1px solid ${T.line}`, borderRadius: 4, overflow: "hidden" }}>
                {stats.map((s) => (
                  <div key={s.l} style={{ padding: "18px 20px", background: T.bg }}>
                    <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: T.text, marginBottom: 6 }}>{s.l}</div>
                    <div style={{ fontFamily: fonts.mono, fontSize: 16, color: T.ink }}>{s.v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* About */}
            <div>
              <div style={{ color: T.burgundy, textTransform: "uppercase", letterSpacing: "0.18em", fontSize: 11, marginBottom: 12, fontFamily: fonts.sans, fontWeight: 500 }}>About</div>
              <p style={{ fontFamily: fonts.serif, fontSize: 20, lineHeight: 1.6, color: T.ink, fontWeight: 300, margin: 0, maxWidth: 680 }}>{asset.desc}</p>
            </div>
          </div>

          <TradePanel asset={asset} kind={kind} />
        </div>
      </section>

      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 28px 60px" }}>
        <div style={{ borderTop: `1px solid ${T.line}`, paddingTop: 32, fontSize: 12, color: T.textSoft, lineHeight: 1.7, maxWidth: 800 }}>
          Prices, statistics, and orders shown are simulated for educational purposes. TradeAid does not execute real trades or provide investment advice.
        </div>
      </section>
    </div>
  );
}
