import { Resend } from "resend";
import { emailShell, styles as s } from "./_emailTemplate.js";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM || "TradeAid <onboarding@resend.dev>";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email } = req.body || {};

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return res.status(400).json({ error: "A valid name is required." });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "A valid email is required." });
  }

  const first = name.trim().split(/\s+/)[0];
  const now = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  });
  const ip = (req.headers["x-forwarded-for"] || "unknown").toString().split(",")[0].trim();
  const ua = (req.headers["user-agent"] || "unknown device").toString();
  const uaShort = ua.length > 60 ? ua.slice(0, 60) + "…" : ua;
  const appUrl = process.env.APP_URL || "https://traded-three.vercel.app";

  const body = `
    <div style="${s.eyebrow}">Security</div>
    <h1 style="${s.h1}">A new sign-in on your <em style="${s.italic}">account</em>.</h1>
    <p style="${s.p}">${first} — we noticed a sign-in to your TradeAid account.</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:24px 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;line-height:1.7;color:#1A1A1A;font-weight:300;border:1px solid #E8E4DF;border-radius:4px;">
      <tr><td style="padding:14px 20px;border-bottom:1px solid #E8E4DF;"><span style="color:#6B6B6B;">When · </span>${now} UTC</td></tr>
      <tr><td style="padding:14px 20px;border-bottom:1px solid #E8E4DF;"><span style="color:#6B6B6B;">Device · </span>${uaShort}</td></tr>
      <tr><td style="padding:14px 20px;"><span style="color:#6B6B6B;">Address · </span>${ip}</td></tr>
    </table>
    <p style="${s.p}">If that was you, no action needed — this note is here so you always know when your account is used.</p>
    <p style="${s.p}">If it wasn't, secure your account right away:</p>
    <p style="margin:24px 0;">
      <a href="${appUrl}" style="${s.button}">Review activity</a>
    </p>
    <p style="${s.pMuted}">Reply to this email if anything looks wrong — someone will read it.</p>
  `;

  const html = emailShell({
    preheader: `A sign-in to your TradeAid account was just recorded.`,
    body,
  });

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: [email],
      subject: "New sign-in to your TradeAid account",
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
