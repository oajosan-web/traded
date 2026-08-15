import { Resend } from "resend";
import { emailShell, styles as s } from "./_emailTemplate.js";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM || "TradeAid <onboarding@resend.dev>";

const styleCopy = {
  visual: {
    line: "You picked <em style=\"font-style:italic;\">by seeing</em> as your way in — we'll open your first session at the pattern lab, where the market's shapes become second nature.",
    action: "Open the pattern lab",
  },
  reading: {
    line: "You picked <em style=\"font-style:italic;\">by reading</em> as your way in — every lesson is anchored to peer-reviewed evidence, so you learn the why before the how.",
    action: "Start with lesson one",
  },
  hands: {
    line: "You picked <em style=\"font-style:italic;\">by doing</em> as your way in — the simulator is ready whenever you have twenty minutes to spare.",
    action: "Take your first paper trade",
  },
  default: {
    line: "Your account is ready. Small reps, every session — that is the entire secret.",
    action: "Open TradeAid",
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, style } = req.body || {};

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return res.status(400).json({ error: "A valid name is required." });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "A valid email is required." });
  }

  const first = name.trim().split(/\s+/)[0];
  const copy = styleCopy[style] || styleCopy.default;
  const appUrl = process.env.APP_URL || "https://traded-three.vercel.app";

  const body = `
    <div style="${s.eyebrow}">Welcome</div>
    <h1 style="${s.h1}">Welcome to <em style="${s.italic}">TradeAid</em>, ${first}.</h1>
    <p style="${s.p}">${copy.line}</p>
    <p style="${s.p}">The market is a skill, not a slot machine. We'll help you build that skill deliberately, without hype, and without a cent at risk.</p>
    <p style="margin:32px 0;">
      <a href="${appUrl}" style="${s.button}">${copy.action}</a>
    </p>
    <p style="${s.pMuted}">If you have a question or find something confusing, just reply to this email — someone reads them.</p>
  `;

  const html = emailShell({
    preheader: `Welcome to TradeAid, ${first}. Your account is ready.`,
    body,
  });

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: [email],
      subject: "Welcome to TradeAid",
      html,
      replyTo: process.env.REPLY_TO || undefined,
    });
    if (error) {
      return res.status(500).json({ error: error.message || "Send failed" });
    }
    return res.status(200).json({ id: data?.id, ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
