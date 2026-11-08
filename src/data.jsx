export const T = {
  bg: "#F8F5EC",
  surface: "#EFE9DA",
  card: "#EFE9DA",
  line: "#DBD1B6",
  ink: "#1A1A1A",
  text: "#6B5F4E",
  textSoft: "#8E8369",
  gold: "#B8860B",
  goldDeep: "#8B6023",
  burgundy: "#7A2E2E",
  burgundySoft: "#E8D5CF",
  terracotta: "#6B2929",
  terracottaSoft: "#E8D5CF",
  emerald: "#1D2E28",
  emeraldSoft: "#D5DCD1",
  emeraldMid: "#2F4A40",
  black: "#0D0D0D",
};

export const SITE = {
  name: "TradeAid",
  tagline: "Learn the market before you trade it.",
  description:
    "Scholar-led lessons, simulation practice, and trading tools built to teach sound capital preservation and better decision-making.",
};

export const FEATURES = [
  {
    title: "Scholar-backed curriculum",
    subtitle: "Evidence, citations, and market research built into every lesson.",
    accent: "Research-first",
  },
  {
    title: "Practice with feedback",
    subtitle: "Simulated trades, risk rules, and discipline drills that teach real behavior change.",
    accent: "Action-oriented",
  },
  {
    title: "Built for confident decisions",
    subtitle: "Clear charts, risk math, and tools designed for investors and active retail traders.",
    accent: "Clarity over noise",
  },
];

import React from "react";

const em = (text) => <em style={{ fontStyle: "italic", color: "#8B6023", fontWeight: 400 }}>{text}</em>;
const emGold = (text) => <em style={{ fontStyle: "italic", color: "#D4A954", fontWeight: 400 }}>{text}</em>;

export const MODULES = [
  {
    id: "beginner",
    label: "Beginner",
    headline: <>Start with the <em style={{ fontStyle: "italic", color: "#8B6023", fontWeight: 400 }}>fundamentals</em>.</>,
    description:
      "Understand what securities are, how orders work, and why risk management is the first skill every trader needs — before anything else.",
    outcomes: [
      "Explain the business behind every stock.",
      "Use limit and stop orders with purpose.",
      "Protect capital with the 1% rule.",
    ],
  },
  {
    id: "intermediate",
    label: "Intermediate",
    headline: <>Build real <em style={{ fontStyle: "italic", color: "#D4A954", fontWeight: 400 }}>discipline</em>.</>,
    description:
      "Move from curiosity to consistent process: expectancy, trade sizing, chart literacy, and the honest psychology of losses.",
    outcomes: [
      "Compute expectancy and risk-reward.",
      "Read price action with discipline.",
      "Use evidence instead of emotion.",
    ],
  },
  {
    id: "advanced",
    label: "Advanced",
    headline: <>Translate skill into <em style={{ fontStyle: "italic", color: "#8B6023", fontWeight: 400 }}>edge</em>.</>,
    description:
      "Practice simulator workflows, portfolio rules, and process checks that professionals use before risking a cent of real capital.",
    outcomes: [
      "Journal simulated trades with feedback.",
      "Measure skill with repeatable metrics.",
      "Design a resilient plan for real market stress.",
    ],
  },
];

export const LIBRARY = [
  {
    author: "H. Markowitz",
    year: 1952,
    title: "Portfolio Selection",
    note: "The foundation of modern portfolio theory and why diversification is the only free lunch.",
  },
  {
    author: "E. Fama",
    year: 1970,
    title: "Efficient Capital Markets",
    note: "Evidence that prices absorb available public information quickly, shaping risk-aware market behavior.",
  },
  {
    author: "D. Kahneman & A. Tversky",
    year: 1979,
    title: "Prospect Theory",
    note: "Explains the behavioral biases that cause investors to sell winners too early and hold losers too long.",
  },
  {
    author: "B. Barber & T. Odean",
    year: 2000,
    title: "Trading Is Hazardous to Your Wealth",
    note: "A real-world study showing active retail trading often underperforms after costs and emotional mistakes.",
  },
];
