/* Deterministic price walk generator — same ticker always produces the same shape */
function seed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 16777619); }
  return () => { h += 0x6D2B79F5; let t = h; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
export function series(sym, points, base, vol = 0.02) {
  const rnd = seed(sym);
  const out = [base];
  for (let i = 1; i < points; i++) {
    const drift = (rnd() - 0.48) * vol * base;
    const v = Math.max(out[i - 1] + drift, base * 0.4);
    out.push(v);
  }
  return out;
}

/* Full catalog */
export const EQUITIES = [
  { sym: "NVDA", name: "NVIDIA Corp.", price: 892.14, chg: 12.43, pct: 1.41, mcap: "2.19T", vol: "48.2M", pe: 74.3, high52: 974.00, low52: 373.56, sector: "Semiconductors", desc: "Designer of GPUs and accelerated-computing platforms powering AI, gaming, and data-center workloads worldwide." },
  { sym: "AAPL", name: "Apple Inc.", price: 227.83, chg: 1.91, pct: 0.85, mcap: "3.48T", vol: "52.1M", pe: 35.6, high52: 237.23, low52: 164.08, sector: "Consumer Electronics", desc: "Designs and sells consumer devices, wearables, and services including iPhone, Mac, iPad, and the App Store." },
  { sym: "MSFT", name: "Microsoft Corp.", price: 421.09, chg: -2.55, pct: -0.60, mcap: "3.13T", vol: "22.8M", pe: 36.4, high52: 468.35, low52: 309.45, sector: "Software", desc: "Cloud (Azure), productivity (Office 365), Windows, gaming (Xbox), and AI infrastructure at hyperscale." },
  { sym: "META", name: "Meta Platforms", price: 512.44, chg: 8.11, pct: 1.61, mcap: "1.30T", vol: "16.4M", pe: 28.1, high52: 544.23, low52: 279.40, sector: "Social Media", desc: "Operates Facebook, Instagram, WhatsApp, and Reality Labs; monetizes primarily through advertising." },
  { sym: "TSLA", name: "Tesla Inc.", price: 189.22, chg: -4.66, pct: -2.40, mcap: "601B", vol: "94.3M", pe: 47.9, high52: 299.29, low52: 152.37, sector: "Auto Manufacturers", desc: "Electric vehicles, energy storage, solar, and autonomous-driving software; also invests in humanoid robotics." },
  { sym: "GOOGL", name: "Alphabet Inc.", price: 152.19, chg: 0.87, pct: 0.57, mcap: "1.89T", vol: "24.1M", pe: 25.7, high52: 164.44, low52: 115.83, sector: "Internet Content", desc: "Google Search, YouTube, Android, Google Cloud, and Waymo autonomous driving." },
  { sym: "AMZN", name: "Amazon.com", price: 178.35, chg: 2.14, pct: 1.21, mcap: "1.86T", vol: "38.7M", pe: 51.2, high52: 191.70, low52: 118.35, sector: "E-Commerce & Cloud", desc: "Marketplace, Prime, AWS cloud, advertising, and Kuiper satellite internet." },
  { sym: "JPM", name: "JPMorgan Chase", price: 199.05, chg: 0.44, pct: 0.22, mcap: "573B", vol: "8.9M", pe: 12.1, high52: 208.00, low52: 135.19, sector: "Diversified Banking", desc: "Largest U.S. bank by assets; consumer & community banking, investment banking, asset management." },
  { sym: "V", name: "Visa Inc.", price: 274.52, chg: 1.12, pct: 0.41, mcap: "552B", vol: "5.2M", pe: 30.4, high52: 290.96, low52: 227.65, sector: "Credit Services", desc: "Global payments network processing over $14T in payments volume annually." },
  { sym: "BRK.B", name: "Berkshire Hathaway", price: 411.20, chg: 0.88, pct: 0.21, mcap: "886B", vol: "3.1M", pe: 15.6, high52: 435.05, low52: 322.42, sector: "Diversified Holdings", desc: "Warren Buffett's holding company; owns GEICO, BNSF, and stakes in Apple, Coca-Cola, and more." },
  { sym: "UNH", name: "UnitedHealth Group", price: 522.16, chg: -3.24, pct: -0.62, mcap: "482B", vol: "3.4M", pe: 22.8, high52: 630.73, low52: 436.42, sector: "Healthcare Insurance", desc: "Largest U.S. health insurer; also operates Optum health-services division." },
  { sym: "XOM", name: "Exxon Mobil", price: 114.03, chg: -0.55, pct: -0.48, mcap: "504B", vol: "13.6M", pe: 14.5, high52: 123.75, low52: 95.77, sector: "Oil & Gas Integrated", desc: "One of the largest publicly traded oil & gas majors; upstream, downstream, and chemicals." },
  { sym: "WMT", name: "Walmart Inc.", price: 71.94, chg: 0.31, pct: 0.43, mcap: "578B", vol: "12.4M", pe: 30.1, high52: 74.45, low52: 49.85, sector: "Discount Stores", desc: "World's largest retailer by revenue; groceries, general merchandise, e-commerce, and Sam's Club." },
  { sym: "PG", name: "Procter & Gamble", price: 168.44, chg: 0.42, pct: 0.25, mcap: "397B", vol: "5.2M", pe: 27.3, high52: 172.28, low52: 141.45, sector: "Consumer Staples", desc: "Tide, Pampers, Gillette, Charmin — global household and personal-care giant." },
  { sym: "LLY", name: "Eli Lilly & Co.", price: 782.11, chg: 5.66, pct: 0.73, mcap: "743B", vol: "3.8M", pe: 129.0, high52: 968.98, low52: 550.10, sector: "Pharmaceuticals", desc: "Maker of Mounjaro/Zepbound GLP-1 diabetes and obesity drugs; deep oncology pipeline." },
  { sym: "COST", name: "Costco Wholesale", price: 924.55, chg: 3.11, pct: 0.34, mcap: "410B", vol: "1.9M", pe: 55.4, high52: 954.00, low52: 606.55, sector: "Discount Warehouses", desc: "Membership-based warehouse retailer with industry-leading loyalty and low-markup model." },
  { sym: "MA", name: "Mastercard Inc.", price: 468.32, chg: 1.20, pct: 0.26, mcap: "431B", vol: "2.5M", pe: 36.9, high52: 490.00, low52: 375.36, sector: "Credit Services", desc: "Global payments network competing with Visa; card, real-time, and cross-border payments." },
  { sym: "AVGO", name: "Broadcom Inc.", price: 172.83, chg: 2.43, pct: 1.43, mcap: "804B", vol: "22.1M", pe: 45.2, high52: 185.16, low52: 106.30, sector: "Semiconductors", desc: "Semiconductor and infrastructure software company; VMware, custom AI ASICs for hyperscalers." },
  { sym: "HD", name: "The Home Depot", price: 344.20, chg: -1.32, pct: -0.38, mcap: "341B", vol: "3.1M", pe: 23.5, high52: 396.87, low52: 274.26, sector: "Home Improvement", desc: "Largest home-improvement retailer in the U.S.; pro contractor + DIY channels." },
  { sym: "CRM", name: "Salesforce Inc.", price: 288.16, chg: 4.24, pct: 1.50, mcap: "277B", vol: "5.4M", pe: 47.8, high52: 318.71, low52: 193.68, sector: "Enterprise Software", desc: "CRM cloud, Data Cloud, Slack, and Agentforce AI agents for enterprise workflows." },
];

export const ETFS = [
  { sym: "SPY", name: "SPDR S&P 500 ETF", price: 478.52, chg: 1.97, pct: 0.41, mcap: "512B", vol: "62M", pe: null, high52: 486.24, low52: 401.44, sector: "US Large-Cap", desc: "Tracks the S&P 500 index — the 500 largest US companies. The single most-traded ETF in the world." },
  { sym: "QQQ", name: "Invesco QQQ Trust", price: 411.27, chg: 1.29, pct: 0.31, mcap: "273B", vol: "38M", pe: null, high52: 420.11, low52: 342.60, sector: "US Tech (Nasdaq)", desc: "Tracks the Nasdaq-100 — 100 largest non-financial companies on the Nasdaq exchange." },
  { sym: "VTI", name: "Vanguard Total Market", price: 245.68, chg: 0.98, pct: 0.40, mcap: "402B", vol: "3.4M", pe: null, high52: 251.44, low52: 208.10, sector: "US Total Market", desc: "Holds essentially every publicly traded US stock — the broadest single-fund US exposure." },
  { sym: "IWM", name: "iShares Russell 2000", price: 202.75, chg: 0.40, pct: 0.20, mcap: "58B", vol: "42M", pe: null, high52: 226.09, low52: 168.62, sector: "US Small-Cap", desc: "Tracks the Russell 2000 — the 2,000 smallest members of the Russell 3000 large index." },
  { sym: "GLD", name: "SPDR Gold Shares", price: 218.44, chg: 1.62, pct: 0.75, mcap: "68B", vol: "9.4M", pe: null, high52: 224.32, low52: 172.28, sector: "Commodities · Gold", desc: "Physically-backed gold ETF; each share represents ~1/10 oz of gold held in London vaults." },
  { sym: "TLT", name: "20+ Year Treasury", price: 89.13, chg: -0.44, pct: -0.49, mcap: "51B", vol: "40M", pe: null, high52: 108.63, low52: 82.42, sector: "Long-Duration Bonds", desc: "Tracks US Treasury bonds with 20+ years to maturity; highly sensitive to interest-rate moves." },
  { sym: "VOO", name: "Vanguard S&P 500", price: 439.66, chg: 1.81, pct: 0.41, mcap: "428B", vol: "5.6M", pe: null, high52: 447.34, low52: 368.55, sector: "US Large-Cap", desc: "Vanguard's flagship S&P 500 tracker — extremely low expense ratio (0.03%)." },
  { sym: "SCHD", name: "Schwab US Dividend", price: 78.44, chg: 0.24, pct: 0.31, mcap: "58B", vol: "7.2M", pe: null, high52: 82.30, low52: 68.06, sector: "US Dividend", desc: "Screens for high-quality dividend-paying US stocks; a core income holding." },
  { sym: "EEM", name: "iShares Emerging Markets", price: 43.15, chg: 0.28, pct: 0.65, mcap: "18B", vol: "40M", pe: null, high52: 46.56, low52: 37.85, sector: "Emerging Markets Equity", desc: "Exposure to large- and mid-cap stocks in emerging markets including China, India, Brazil, Taiwan." },
  { sym: "VNQ", name: "Vanguard Real Estate", price: 89.22, chg: -0.15, pct: -0.17, mcap: "35B", vol: "5.2M", pe: null, high52: 96.51, low52: 76.13, sector: "US Real Estate", desc: "Broad exposure to US REITs — office, retail, industrial, residential, data centers." },
  { sym: "ARKK", name: "ARK Innovation ETF", price: 48.34, chg: 0.66, pct: 1.38, mcap: "6.2B", vol: "18M", pe: null, high52: 54.72, low52: 34.44, sector: "Disruptive Innovation", desc: "Actively managed by Cathie Wood; concentrated bets on AI, biotech, robotics, blockchain, and fintech." },
  { sym: "IEFA", name: "iShares MSCI EAFE", price: 78.15, chg: 0.19, pct: 0.24, mcap: "115B", vol: "10.4M", pe: null, high52: 82.02, low52: 68.65, sector: "Developed Ex-US", desc: "Large- and mid-cap stocks from Europe, Australasia, and the Far East excluding the US and Canada." },
  { sym: "USO", name: "US Oil Fund", price: 78.44, chg: -0.42, pct: -0.53, mcap: "1.6B", vol: "6.1M", pe: null, high52: 87.05, low52: 62.86, sector: "Commodities · Oil", desc: "Tracks the daily price movements of West Texas Intermediate crude oil futures." },
  { sym: "BND", name: "Vanguard Total Bond", price: 72.88, chg: -0.11, pct: -0.15, mcap: "112B", vol: "5.9M", pe: null, high52: 74.45, low52: 68.35, sector: "US Total Bond Market", desc: "Broad exposure to investment-grade US bonds — Treasuries, corporates, mortgage-backed." },
  { sym: "XLE", name: "Energy Select SPDR", price: 87.55, chg: -0.42, pct: -0.48, mcap: "37B", vol: "18M", pe: null, high52: 98.68, low52: 78.36, sector: "US Energy", desc: "S&P 500 energy-sector companies including Exxon, Chevron, ConocoPhillips." },
];

export const CRYPTO = [
  { sym: "BTC", name: "Bitcoin", price: 96482.30, chg: 1284.12, pct: 1.35, mcap: "1.91T", vol: "42B", pe: null, high52: 108135.00, low52: 41935.00, sector: "Layer 1", desc: "The first and largest cryptocurrency; fixed supply of 21M coins, secured by proof-of-work." },
  { sym: "ETH", name: "Ethereum", price: 3421.55, chg: -22.10, pct: -0.64, mcap: "412B", vol: "18B", pe: null, high52: 4093.00, low52: 2166.15, sector: "Smart Contracts", desc: "Programmable blockchain; powers DeFi, NFTs, L2 rollups, and thousands of tokens." },
  { sym: "SOL", name: "Solana", price: 189.44, chg: 5.21, pct: 2.83, mcap: "89B", vol: "3.4B", pe: null, high52: 259.96, low52: 79.42, sector: "High-Perf Layer 1", desc: "High-throughput L1 known for DEX activity, memecoins, and consumer crypto apps." },
  { sym: "DOGE", name: "Dogecoin", price: 0.3421, chg: 0.0084, pct: 2.52, mcap: "50B", vol: "1.8B", pe: null, high52: 0.4832, low52: 0.0629, sector: "Memecoin", desc: "The original memecoin; started as a joke, now widely held as a payments/tipping token." },
  { sym: "ADA", name: "Cardano", price: 0.9812, chg: -0.0122, pct: -1.23, mcap: "34B", vol: "980M", pe: null, high52: 1.32, low52: 0.279, sector: "Smart Contracts", desc: "Research-driven L1 built on peer-reviewed academic work; proof-of-stake since 2020." },
  { sym: "LINK", name: "Chainlink", price: 18.44, chg: 0.32, pct: 1.77, mcap: "11B", vol: "580M", pe: null, high52: 23.11, low52: 10.20, sector: "Oracle Network", desc: "Decentralized oracle network providing real-world data feeds to smart contracts." },
  { sym: "XRP", name: "Ripple", price: 2.32, chg: 0.058, pct: 2.57, mcap: "132B", vol: "4.1B", pe: null, high52: 2.91, low52: 0.386, sector: "Payments", desc: "Focus on cross-border payments and CBDC infrastructure; used by financial institutions." },
  { sym: "AVAX", name: "Avalanche", price: 38.44, chg: -0.44, pct: -1.13, mcap: "15.8B", vol: "620M", pe: null, high52: 65.54, low52: 20.20, sector: "Layer 1", desc: "Subnet-based L1 focused on custom EVM chains for enterprise and gaming." },
  { sym: "MATIC", name: "Polygon", price: 0.512, chg: 0.011, pct: 2.20, mcap: "5.1B", vol: "340M", pe: null, high52: 0.836, low52: 0.298, sector: "Layer 2 Scaling", desc: "Ethereum scaling ecosystem; PoS chain, zkEVM, and CDK for custom L2 chains." },
  { sym: "DOT", name: "Polkadot", price: 8.42, chg: 0.16, pct: 1.94, mcap: "12.4B", vol: "310M", pe: null, high52: 12.20, low52: 3.98, sector: "Multi-chain", desc: "Interoperable multi-chain architecture with parachains and shared security." },
  { sym: "UNI", name: "Uniswap", price: 12.32, chg: 0.44, pct: 3.70, mcap: "7.6B", vol: "590M", pe: null, high52: 17.15, low52: 5.63, sector: "DeFi · DEX", desc: "Largest decentralized exchange by volume; automated market-maker model." },
  { sym: "ATOM", name: "Cosmos", price: 6.11, chg: -0.11, pct: -1.77, mcap: "2.4B", vol: "180M", pe: null, high52: 12.30, low52: 4.10, sector: "Interchain", desc: "Framework for building app-specific blockchains that communicate via IBC." },
];

export const FOREX = [
  { sym: "EUR/USD", name: "Euro / US Dollar", price: 1.0854, chg: 0.0021, pct: 0.19, mcap: "—", vol: "$1.3T daily", pe: null, high52: 1.1276, low52: 1.0356, sector: "Major Pair", desc: "The most-traded currency pair in the world, accounting for ~28% of daily forex volume." },
  { sym: "GBP/USD", name: "Pound / Dollar", price: 1.2712, chg: -0.0034, pct: -0.27, mcap: "—", vol: "$630B daily", pe: null, high52: 1.3141, low52: 1.2036, sector: "Major Pair", desc: "Cable — the British Pound against the US Dollar. Sensitive to BoE and Fed policy divergence." },
  { sym: "USD/JPY", name: "Dollar / Yen", price: 154.32, chg: 0.44, pct: 0.29, mcap: "—", vol: "$1.1T daily", pe: null, high52: 161.95, low52: 140.25, sector: "Major Pair", desc: "US Dollar vs. Japanese Yen — the classic carry trade pair, sensitive to rate differentials." },
  { sym: "USD/CAD", name: "Dollar / Canadian", price: 1.3654, chg: -0.0012, pct: -0.09, mcap: "—", vol: "$220B daily", pe: null, high52: 1.4180, low52: 1.3175, sector: "Major Pair", desc: "Loonie pair — heavily influenced by crude oil prices and Bank of Canada policy." },
  { sym: "AUD/USD", name: "Aussie / Dollar", price: 0.6612, chg: 0.0021, pct: 0.32, mcap: "—", vol: "$260B daily", pe: null, high52: 0.6942, low52: 0.6270, sector: "Commodity Pair", desc: "Australian Dollar vs. USD — proxy for global risk sentiment and China commodity demand." },
  { sym: "USD/CHF", name: "Dollar / Franc", price: 0.8842, chg: -0.0015, pct: -0.17, mcap: "—", vol: "$180B daily", pe: null, high52: 0.9224, low52: 0.8332, sector: "Safe-Haven Pair", desc: "Swiss Franc — traditional safe haven; the pair moves opposite to EUR/USD historically." },
  { sym: "USD/CNH", name: "Dollar / Yuan", price: 7.1854, chg: 0.0212, pct: 0.30, mcap: "—", vol: "$140B daily", pe: null, high52: 7.3450, low52: 7.0125, sector: "Managed Float", desc: "Offshore Chinese Yuan against USD; watched as a barometer for US-China policy." },
  { sym: "NZD/USD", name: "Kiwi / Dollar", price: 0.6021, chg: -0.0018, pct: -0.30, mcap: "—", vol: "$68B daily", pe: null, high52: 0.6377, low52: 0.5772, sector: "Commodity Pair", desc: "New Zealand Dollar — commodity-linked (dairy), sensitive to RBNZ policy and Australia." },
];

export const COMMODITIES = [
  { sym: "GOLD", name: "Gold Spot", price: 2352.44, chg: 15.20, pct: 0.65, mcap: "—", vol: "180K contracts", pe: null, high52: 2790.00, low52: 1810.00, sector: "Precious Metals", desc: "Global reserve asset and hedge against currency debasement; priced per troy ounce in USD." },
  { sym: "SILVER", name: "Silver Spot", price: 30.14, chg: 0.41, pct: 1.38, mcap: "—", vol: "68K contracts", pe: null, high52: 34.86, low52: 21.94, sector: "Precious Metals", desc: "Dual role as monetary metal and industrial input (solar, EVs); more volatile than gold." },
  { sym: "WTI", name: "WTI Crude Oil", price: 78.44, chg: -0.66, pct: -0.83, mcap: "—", vol: "480K contracts", pe: null, high52: 87.55, low52: 65.27, sector: "Energy · Crude", desc: "West Texas Intermediate — the benchmark for North American crude oil; priced per barrel." },
  { sym: "BRENT", name: "Brent Crude", price: 82.11, chg: -0.55, pct: -0.66, mcap: "—", vol: "380K contracts", pe: null, high52: 91.75, low52: 70.24, sector: "Energy · Crude", desc: "The international crude oil benchmark; sourced from the North Sea, priced per barrel." },
  { sym: "COPPER", name: "Copper", price: 4.512, chg: 0.031, pct: 0.69, mcap: "—", vol: "82K contracts", pe: null, high52: 5.199, low52: 3.581, sector: "Industrial Metals", desc: "Dr. Copper — leading indicator of global economic health; heavily used in construction, EVs, grid." },
  { sym: "NATGAS", name: "Natural Gas", price: 2.412, chg: 0.081, pct: 3.48, mcap: "—", vol: "195K contracts", pe: null, high52: 3.784, low52: 1.575, sector: "Energy · Gas", desc: "US Henry Hub natural gas benchmark; heating, power generation, and LNG exports." },
  { sym: "WHEAT", name: "Wheat", price: 5.912, chg: -0.032, pct: -0.54, mcap: "—", vol: "58K contracts", pe: null, high52: 7.286, low52: 5.144, sector: "Agriculture", desc: "Chicago SRW wheat futures per bushel; global food staple, sensitive to weather and geopolitics." },
  { sym: "CORN", name: "Corn", price: 4.234, chg: 0.024, pct: 0.57, mcap: "—", vol: "245K contracts", pe: null, high52: 5.115, low52: 3.855, sector: "Agriculture", desc: "The most-traded grain futures contract; used for food, animal feed, and ethanol." },
  { sym: "PLATINUM", name: "Platinum", price: 942.55, chg: 8.44, pct: 0.90, mcap: "—", vol: "12K contracts", pe: null, high52: 1105.00, low52: 890.30, sector: "Precious Metals", desc: "Rare precious metal; automotive catalysts, jewelry, and industrial uses." },
  { sym: "COFFEE", name: "Coffee", price: 3.115, chg: 0.062, pct: 2.03, mcap: "—", vol: "22K contracts", pe: null, high52: 3.485, low52: 1.578, sector: "Soft Commodities", desc: "Arabica coffee futures — heavily impacted by Brazilian weather and global demand shifts." },
];

export const PREDICTIONS = [
  { id: "fed-jul", q: "Fed cuts rates at July FOMC meeting?", yes: 34, vol: "$2.14M", exp: "Jul 30, 2026", cat: "Macro", desc: "Resolves YES if the Federal Open Market Committee announces a rate cut of at least 25 bps at its July 30 meeting." },
  { id: "spx-6000", q: "S&P 500 closes above 6,000 in 2026?", yes: 71, vol: "$8.91M", exp: "Dec 31, 2026", cat: "Markets", desc: "Resolves YES if the S&P 500 closes above 6,000.00 on any trading day in 2026." },
  { id: "btc-150k", q: "Bitcoin reaches $150,000 before 2027?", yes: 42, vol: "$14.22M", exp: "Dec 31, 2026", cat: "Crypto", desc: "Resolves YES if BTC/USD (Coinbase spot) trades above $150,000 at any point before Jan 1, 2027." },
  { id: "recession-26", q: "US recession declared by NBER in 2026?", yes: 18, vol: "$3.45M", exp: "Dec 31, 2026", cat: "Macro", desc: "Resolves YES if the National Bureau of Economic Research declares a recession beginning in 2026." },
  { id: "openai-ipo", q: "OpenAI files S-1 for IPO in 2026?", yes: 27, vol: "$1.88M", exp: "Dec 31, 2026", cat: "Tech", desc: "Resolves YES if OpenAI files an S-1 registration statement with the SEC before Dec 31, 2026." },
  { id: "tsla-300", q: "Tesla stock closes above $300 by year end?", yes: 44, vol: "$4.12M", exp: "Dec 31, 2026", cat: "Stocks", desc: "Resolves YES if TSLA closes above $300.00 on any trading day before Dec 31, 2026." },
  { id: "eth-6k", q: "Ethereum crosses $6,000 in 2026?", yes: 38, vol: "$2.94M", exp: "Dec 31, 2026", cat: "Crypto", desc: "Resolves YES if ETH/USD trades above $6,000 at any point in 2026." },
  { id: "usdjpy-160", q: "USD/JPY trades above 160 again in 2026?", yes: 52, vol: "$1.22M", exp: "Dec 31, 2026", cat: "Forex", desc: "Resolves YES if USD/JPY prints above 160.00 on any trading day in 2026." },
  { id: "spacex-ipo", q: "SpaceX or Starlink IPO in 2026?", yes: 22, vol: "$2.15M", exp: "Dec 31, 2026", cat: "Tech", desc: "Resolves YES if SpaceX or a Starlink-related entity begins trading publicly in 2026." },
  { id: "gold-3k", q: "Gold spot closes above $3,000 in 2026?", yes: 58, vol: "$1.72M", exp: "Dec 31, 2026", cat: "Commodities", desc: "Resolves YES if gold spot price closes above $3,000/oz on any day in 2026." },
  { id: "nvda-1500", q: "NVIDIA reaches $1,500 pre-split-adjusted?", yes: 31, vol: "$3.88M", exp: "Dec 31, 2026", cat: "Stocks", desc: "Resolves YES if NVDA equivalent (split-adjusted) reaches the $1,500 pre-split price level." },
  { id: "election-margin", q: "US midterm margin under 3%?", yes: 48, vol: "$5.44M", exp: "Nov 3, 2026", cat: "Politics", desc: "Resolves YES if the aggregate popular vote margin in the 2026 US midterms is under 3 percentage points." },
];

export const CATEGORY_ASSETS = {
  equities: EQUITIES,
  etfs: ETFS,
  crypto: CRYPTO,
  forex: FOREX,
  commodities: COMMODITIES,
};

/* Enrich every asset with an inline sparkline (12 pts) for the table */
Object.values(CATEGORY_ASSETS).forEach((list) => {
  list.forEach((a) => {
    if (!a.spark) a.spark = series(a.sym, 12, a.price, 0.015);
  });
});
