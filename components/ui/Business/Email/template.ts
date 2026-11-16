/**
 * Plain HTML + text emails for the contact and booking forms.
 * Inline styles only: email clients ignore Tailwind classes.
 */

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export type EmailRow = [label: string, value: string | undefined];

export function renderEmail(heading: string, rows: EmailRow[]) {
  const filled = rows.filter(([, v]) => v && v.trim());
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#1a1a1a;max-width:560px">
  <h2 style="margin:0 0 16px;color:#e8590c">${escapeHtml(heading)}</h2>
  <table cellpadding="6" style="border-collapse:collapse;width:100%">
    ${filled
      .map(
        ([k, v]) =>
          `<tr><td style="vertical-align:top;color:#666;white-space:nowrap;width:110px">${escapeHtml(k)}</td><td style="white-space:pre-wrap">${escapeHtml(v!)}</td></tr>`,
      )
      .join("\n    ")}
  </table>
  <p style="margin-top:20px;font-size:12px;color:#888">Reply to this email to answer directly.</p>
</div>`;
  const text = [heading, "", ...filled.map(([k, v]) => `${k}: ${v}`)].join("\n");
  return { html, text };
}
