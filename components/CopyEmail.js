"use client";

import { useState } from "react";

/** mailto: fails silently for people without a mail client; copying never does. */
export default function CopyEmail({ email }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const field = document.createElement("textarea");
      field.value = email; document.body.appendChild(field); field.select();
      try { document.execCommand("copy"); } finally { field.remove(); }
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }
  return <button type="button" className={`copy-email${copied ? " is-copied" : ""}`} onClick={copy}
    aria-label={`Copy email address ${email}`}>
    <span>{email}</span>
    <span className="copy-email-state" aria-hidden="true">{copied ? "Copied ✓" : "Copy"}</span>
    <span className="visually-hidden" role="status" aria-live="polite">{copied ? "Email address copied" : ""}</span>
  </button>;
}
