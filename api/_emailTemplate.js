/* Shared TradeAid email chrome — matches VOICE.md and the site's editorial palette.
   Uses table layout + inline styles for maximum email-client compatibility. */

const T = {
  bg: "#FAFAF8",
  ink: "#1A1A1A",
  grey: "#6B6B6B",
  line: "#E8E4DF",
  emerald: "#1D2E28",
  burgundy: "#8B3A3A",
  goldDeep: "#8B6023",
};

const serif = "'Cormorant Garamond', Georgia, 'Times New Roman', serif";
const sans = "'Helvetica Neue', Helvetica, Arial, sans-serif";

export function emailShell({ preheader, body }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="light only">
    <title>TradeAid</title>
  </head>
  <body style="margin:0;padding:0;background:${T.bg};font-family:${sans};color:${T.ink};">
    <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0;">${preheader}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${T.bg};padding:40px 20px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:${T.bg};">
            <tr>
              <td style="padding:0 0 32px;font-family:${serif};font-size:22px;font-weight:400;color:${T.ink};letter-spacing:-0.01em;">
                TradeAid
              </td>
            </tr>
            <tr>
              <td style="padding:0 0 32px;border-top:1px solid ${T.line};"></td>
            </tr>
            <tr>
              <td style="padding:0 0 40px;">
                ${body}
              </td>
            </tr>
            <tr>
              <td style="padding:24px 0 0;border-top:1px solid ${T.line};font-family:${sans};font-size:12px;line-height:1.7;color:${T.grey};">
                <div style="font-family:${serif};font-size:15px;color:${T.ink};margin-bottom:8px;">The TradeAid team</div>
                <div>Educational simulation only. No real orders, no money at risk.</div>
                <div style="margin-top:14px;">
                  <a href="https://traded-three.vercel.app" style="color:${T.emerald};text-decoration:none;">traded-three.vercel.app</a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export const styles = {
  eyebrow: `font-family:${sans};font-size:11px;font-weight:500;letter-spacing:0.18em;text-transform:uppercase;color:${T.burgundy};margin:0 0 18px;`,
  h1: `font-family:${serif};font-size:34px;font-weight:300;letter-spacing:-0.02em;line-height:1.1;color:${T.ink};margin:0 0 20px;`,
  italic: `font-style:italic;color:${T.goldDeep};font-weight:400;`,
  p: `font-family:${sans};font-size:15px;line-height:1.7;color:${T.ink};margin:0 0 18px;font-weight:300;`,
  pMuted: `font-family:${sans};font-size:14px;line-height:1.7;color:${T.grey};margin:0 0 24px;font-weight:300;`,
  button: `display:inline-block;background:${T.emerald};color:${T.bg};text-decoration:none;padding:14px 32px;border-radius:4px;font-family:${sans};font-size:11px;font-weight:500;letter-spacing:0.15em;text-transform:uppercase;`,
  divider: `border-top:1px solid ${T.line};padding-top:20px;margin-top:24px;`,
};
