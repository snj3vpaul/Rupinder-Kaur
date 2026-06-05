"use client";

import { useEffect, useState } from "react";

export default function Typewriter({ words = [] }) {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!words.length) return;
    const full = words[i % words.length];
    let delay = deleting ? 45 : 90;

    if (!deleting && text === full) {
      delay = 1500; // pause at full word
      const t = setTimeout(() => setDeleting(true), delay);
      return () => clearTimeout(t);
    }
    if (deleting && text === "") {
      setDeleting(false);
      setI((p) => p + 1);
      return;
    }
    const t = setTimeout(() => {
      setText(full.substring(0, deleting ? text.length - 1 : text.length + 1));
    }, delay);
    return () => clearTimeout(t);
  }, [text, deleting, i, words]);

  return (
    <div className="hero-typewriter" aria-label={words.join(", ")}>
      {text}
      <span className="cursor">&nbsp;</span>
    </div>
  );
}
