// src/app.jsx
var { useState, useEffect, useRef, useCallback, useMemo } = React;
var COPY = {
  friendName: "abhi",
  forLine: "for Abhi & Sanjeeveni",
  greetWedding: "so... married eh?",
  hintWedding: "Obviously your day!",
  fmtWedding: "ddmmyyyy",
  psMessage: "Come back to this page after the above timer hits zero, there is another password coming, its in the note above...",
  hintGift: "Can you find/recall the date you first commented on my post? It was a Feb, 6yrs ago :)",
  fmtGift: "ddmmyyyy",
  celebrateHead: "Yay! ur gift should be in your account any moment!",
  psUnlocked: "So enjoy bro, have fun. Hope this helps ease out your wedding expenses I couldn't think of a better gift than helping financially. I have always known how expensive these weddings can be!",
  errWrong: "hmm, not quite. re-read the long note."
};
var GIFT_READY = "2026-05-04T05:00:00+05:30";
var NOTIFY_URL = "https://ntfy.sh/abhi-unlock-alert";
var MSG_BLOB = {
  salt: "3cd1tP899xKEnsTolvb6Dw==",
  iv: "xheqICVMp9MUddo4",
  ct: "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",
  iter: 600000
};
var PROOF_BLOB = {
  salt: "jLWq3wV0mIMnR2tEJ0m5mQ==",
  iv: "pwmqkg6JgHogQM2Q",
  ct: "/s37XWzzOsJM0thkvDJXZJyY+i+Q2rcFj6t5Bh5NjZPZWi3IhxdQBn48RkTs+pD+",
  iter: 600000
};
function b64decode(s) {
  const bin = atob(s);
  const u8 = new Uint8Array(bin.length);
  for (let i = 0;i < bin.length; i++)
    u8[i] = bin.charCodeAt(i);
  return u8;
}
function notify(body) {
  fetch(NOTIFY_URL, {
    method: "POST",
    body,
    headers: { Title: "abhi unlocked the gift", Priority: "high", Tags: "tada" }
  }).catch(() => {});
}
async function tryDecrypt(blob, password) {
  const enc = new TextEncoder;
  const salt = b64decode(blob.salt);
  const iv = b64decode(blob.iv);
  const ct = b64decode(blob.ct);
  const baseKey = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
  const key = await crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: blob.iter, hash: "SHA-256" }, baseKey, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
  const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct);
  return new TextDecoder().decode(pt);
}
function useCountdown(iso) {
  const target = useMemo(() => new Date(iso).getTime(), [iso]);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target - now);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor(diff % 86400000 / 3600000),
    minutes: Math.floor(diff % 3600000 / 60000),
    seconds: Math.floor(diff % 60000 / 1000),
    done: diff === 0
  };
}
function Confetti({ trigger }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!trigger)
      return;
    setOn(true);
    const t = setTimeout(() => setOn(false), 1400);
    return () => clearTimeout(t);
  }, [trigger]);
  const pieces = useMemo(() => {
    const colors = ["var(--accent)", "#1a1613", "#e8c28a", "#f0d9b6"];
    const arr = [];
    for (let i = 0;i < 28; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 120 + Math.random() * 260;
      arr.push({
        bg: colors[i % colors.length],
        to: `translate(${(Math.cos(angle) * dist).toFixed(0)}px, ${(Math.sin(angle) * dist - 60).toFixed(0)}px)`,
        rot: (Math.random() * 360).toFixed(0),
        delay: (Math.random() * 120).toFixed(0),
        w: 4 + Math.random() * 6,
        h: 8 + Math.random() * 8
      });
    }
    return arr;
  }, [trigger]);
  return /* @__PURE__ */ React.createElement("div", {
    className: "confetti" + (on ? " go" : ""),
    "aria-hidden": "true"
  }, pieces.map((p, i) => /* @__PURE__ */ React.createElement("span", {
    key: i,
    style: {
      background: p.bg,
      width: p.w,
      height: p.h,
      "--to": p.to,
      transform: `rotate(${p.rot}deg)`,
      animationDelay: `${p.delay}ms`
    }
  })));
}
function renderInline(text) {
  const parts = text.split(/(~~[^~]+~~)/g);
  return parts.map((part, i) => part.startsWith("~~") && part.endsWith("~~") ? /* @__PURE__ */ React.createElement("s", {
    key: i
  }, part.slice(2, -2)) : part);
}
function Letter({ text }) {
  const paragraphs = text.split(/\n+/).map((p) => p.trim()).filter(Boolean);
  return /* @__PURE__ */ React.createElement("div", {
    className: "letter"
  }, paragraphs.map((p, i) => /* @__PURE__ */ React.createElement("p", {
    key: i,
    className: "letter-p"
  }, renderInline(p))));
}
function CountdownBar() {
  const cd = useCountdown(GIFT_READY);
  return /* @__PURE__ */ React.createElement("div", {
    className: "countdown",
    "aria-label": "countdown to gift reveal"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "cd-unit"
  }, /* @__PURE__ */ React.createElement("span", {
    className: "cd-num"
  }, String(cd.days).padStart(2, "0")), /* @__PURE__ */ React.createElement("span", {
    className: "cd-label"
  }, "days")), /* @__PURE__ */ React.createElement("span", {
    className: "cd-sep"
  }, "·"), /* @__PURE__ */ React.createElement("div", {
    className: "cd-unit"
  }, /* @__PURE__ */ React.createElement("span", {
    className: "cd-num"
  }, String(cd.hours).padStart(2, "0")), /* @__PURE__ */ React.createElement("span", {
    className: "cd-label"
  }, "hrs")), /* @__PURE__ */ React.createElement("span", {
    className: "cd-sep"
  }, "·"), /* @__PURE__ */ React.createElement("div", {
    className: "cd-unit"
  }, /* @__PURE__ */ React.createElement("span", {
    className: "cd-num"
  }, String(cd.minutes).padStart(2, "0")), /* @__PURE__ */ React.createElement("span", {
    className: "cd-label"
  }, "min")), /* @__PURE__ */ React.createElement("span", {
    className: "cd-sep"
  }, "·"), /* @__PURE__ */ React.createElement("div", {
    className: "cd-unit"
  }, /* @__PURE__ */ React.createElement("span", {
    className: "cd-num cd-sec"
  }, String(cd.seconds).padStart(2, "0")), /* @__PURE__ */ React.createElement("span", {
    className: "cd-label"
  }, "sec")));
}
function PasswordField({ onSubmit, maxLen = 8 }) {
  const [pw, setPw] = useState("");
  const [shake, setShake] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(false);
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);
  const submit = useCallback(async () => {
    if (!pw || busy)
      return;
    setBusy(true);
    try {
      await onSubmit(pw);
    } catch {
      setBusy(false);
      setErr(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setTimeout(() => inputRef.current?.select(), 550);
    }
  }, [pw, busy, onSubmit]);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    className: "pw-wrap" + (shake ? " shake" : "") + (err ? " errored" : "")
  }, /* @__PURE__ */ React.createElement("input", {
    ref: inputRef,
    className: "pw-input",
    type: "text",
    inputMode: "numeric",
    pattern: "[0-9]*",
    autoComplete: "off",
    spellCheck: false,
    maxLength: maxLen,
    placeholder: "•".repeat(maxLen),
    value: pw,
    onChange: (e) => {
      const clean = e.target.value.replace(/\D/g, "").slice(0, maxLen);
      setPw(clean);
      if (err)
        setErr(false);
    },
    onKeyDown: (e) => {
      if (e.key === "Enter")
        submit();
    },
    "aria-label": "password",
    disabled: busy
  }), /* @__PURE__ */ React.createElement("button", {
    className: "pw-submit",
    onClick: submit,
    disabled: !pw || busy,
    "aria-label": "submit password",
    title: "submit"
  }, busy ? /* @__PURE__ */ React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "18",
    height: "18",
    style: { animation: "breathe 1.2s ease-in-out infinite" }
  }, /* @__PURE__ */ React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "8",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeDasharray: "8 40",
    strokeLinecap: "round"
  })) : /* @__PURE__ */ React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "18",
    height: "18",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /* @__PURE__ */ React.createElement("path", {
    d: "M5 12h13"
  }), /* @__PURE__ */ React.createElement("path", {
    d: "M13 6l6 6-6 6"
  })))), /* @__PURE__ */ React.createElement("div", {
    className: "pw-error" + (err ? " show" : ""),
    role: "status",
    "aria-live": "polite"
  }, err ? COPY.errWrong : " "));
}
var REVEAL_STEPS = ["₹", "1", "2", "3", "4", "5"];
var REVEAL_STEP_MS = 1000;
function RevealSequence({ onDone }) {
  const [step, setStep] = useState(0);
  const prefersReduced = useMemo(() => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches, []);
  useEffect(() => {
    if (prefersReduced) {
      onDone?.();
      return;
    }
    if (step >= REVEAL_STEPS.length) {
      onDone?.();
      return;
    }
    const t = setTimeout(() => setStep((s) => s + 1), REVEAL_STEP_MS);
    return () => clearTimeout(t);
  }, [step, prefersReduced, onDone]);
  if (prefersReduced || step >= REVEAL_STEPS.length)
    return null;
  return /* @__PURE__ */ React.createElement("div", {
    className: "reveal-seq",
    "aria-hidden": "true"
  }, /* @__PURE__ */ React.createElement("span", {
    key: step,
    className: "reveal-digit"
  }, REVEAL_STEPS[step]));
}
function WeddingGate({ onUnlock }) {
  const handleSubmit = useCallback(async (pw) => {
    const text = await tryDecrypt(MSG_BLOB, pw);
    onUnlock(text);
  }, [onUnlock]);
  return /* @__PURE__ */ React.createElement("div", {
    className: "sheet"
  }, /* @__PURE__ */ React.createElement("h1", {
    className: "hello serif"
  }, COPY.greetWedding), /* @__PURE__ */ React.createElement(PasswordField, {
    onSubmit: handleSubmit
  }), /* @__PURE__ */ React.createElement("p", {
    className: "hint"
  }, COPY.hintWedding, " ", /* @__PURE__ */ React.createElement("span", {
    className: "fmt"
  }, COPY.fmtWedding)));
}
function MessageState({ msg, onCountdownDone }) {
  const cd = useCountdown(GIFT_READY);
  useEffect(() => {
    if (cd.days === 0 && cd.hours === 0 && cd.minutes === 0)
      onCountdownDone?.();
  }, [cd.days, cd.hours, cd.minutes, onCountdownDone]);
  return /* @__PURE__ */ React.createElement("div", {
    className: "sheet"
  }, /* @__PURE__ */ React.createElement("h1", {
    className: "hello serif"
  }, "hey ", COPY.friendName, /* @__PURE__ */ React.createElement("span", {
    className: "dot"
  }, ".")), /* @__PURE__ */ React.createElement(Letter, {
    text: msg
  }), /* @__PURE__ */ React.createElement(CountdownBar, null), /* @__PURE__ */ React.createElement("p", {
    className: "ps"
  }, /* @__PURE__ */ React.createElement("span", {
    className: "prefix"
  }, "p.s."), COPY.psMessage));
}
function LockedState({ msg, onUnlock }) {
  const handleSubmit = useCallback(async (pw) => {
    const proof = await tryDecrypt(PROOF_BLOB, pw);
    onUnlock(proof);
  }, [onUnlock]);
  return /* @__PURE__ */ React.createElement("div", {
    className: "sheet"
  }, /* @__PURE__ */ React.createElement("h1", {
    className: "hello serif"
  }, "hey ", COPY.friendName, /* @__PURE__ */ React.createElement("span", {
    className: "dot"
  }, ".")), /* @__PURE__ */ React.createElement(Letter, {
    text: msg
  }), /* @__PURE__ */ React.createElement(PasswordField, {
    onSubmit: handleSubmit
  }), /* @__PURE__ */ React.createElement("p", {
    className: "hint"
  }, COPY.hintGift, " ", /* @__PURE__ */ React.createElement("span", {
    className: "fmt"
  }, COPY.fmtGift)));
}
function Incoming() {
  const rotations = [0, 45, 90, 135, 180, 225, 270, 315];
  return /* @__PURE__ */ React.createElement("svg", {
    className: "incoming",
    viewBox: "0 0 180 180",
    "aria-hidden": "true",
    xmlns: "http://www.w3.org/2000/svg"
  }, rotations.map((r) => /* @__PURE__ */ React.createElement("ellipse", {
    key: r,
    className: "incoming-petal",
    cx: "90",
    cy: "50",
    rx: "12",
    ry: "22",
    style: { "--r": `${r}deg`, "--d": `${r / 360 * 0.4}s` }
  })), /* @__PURE__ */ React.createElement("circle", {
    className: "incoming-center",
    cx: "90",
    cy: "90",
    r: "14"
  }));
}
function Celebrate() {
  return /* @__PURE__ */ React.createElement("div", {
    className: "celebrate"
  }, /* @__PURE__ */ React.createElement("p", {
    className: "celebrate-head"
  }, COPY.celebrateHead), /* @__PURE__ */ React.createElement(Incoming, null));
}
function HeartsBackground() {
  const hearts = useMemo(() => {
    const arr = [];
    for (let i = 0;i < 28; i++) {
      arr.push({
        x: Math.random() * 100,
        s: 10 + Math.random() * 9,
        d: Math.random() * 14,
        size: 10 + Math.random() * 9,
        drift: -28 + Math.random() * 56,
        peak: 0.09 + Math.random() * 0.09
      });
    }
    return arr;
  }, []);
  return /* @__PURE__ */ React.createElement("div", {
    className: "hearts-bg",
    "aria-hidden": "true"
  }, hearts.map((h, i) => /* @__PURE__ */ React.createElement("svg", {
    key: i,
    viewBox: "0 0 42 38",
    xmlns: "http://www.w3.org/2000/svg",
    style: {
      left: `${h.x}%`,
      width: `${h.size}px`,
      "--s": `${h.s}s`,
      "--d": `-${h.d}s`,
      "--drift": h.drift,
      "--peak": h.peak
    }
  }, /* @__PURE__ */ React.createElement("path", {
    d: "M21 35 C21 35 3 23 3 13 C3 7 8 3 13 3 C17 3 19 5 21 8 C23 5 25 3 29 3 C34 3 39 7 39 13 C39 23 21 35 21 35 Z",
    fill: "currentColor"
  }))));
}
function UnlockedState({ msg, onRevealed }) {
  const [revealed, setRevealed] = useState(false);
  const handleDone = useCallback(() => {
    setRevealed(true);
    onRevealed?.();
  }, [onRevealed]);
  return /* @__PURE__ */ React.createElement("div", {
    className: "sheet"
  }, /* @__PURE__ */ React.createElement("h1", {
    className: "hello serif"
  }, "hey ", COPY.friendName, /* @__PURE__ */ React.createElement("span", {
    className: "dot"
  }, ".")), /* @__PURE__ */ React.createElement(Letter, {
    text: msg
  }), revealed ? /* @__PURE__ */ React.createElement(Celebrate, null) : /* @__PURE__ */ React.createElement(RevealSequence, {
    onDone: handleDone
  }), /* @__PURE__ */ React.createElement("p", {
    className: "ps"
  }, /* @__PURE__ */ React.createElement("span", {
    className: "prefix"
  }, "p.s."), COPY.psUnlocked));
}
function App() {
  const [state, setState] = useState("weddingGate");
  const [msg, setMsg] = useState(null);
  const [fireConfetti, setFireConfetti] = useState(0);
  const pickPostWedding = useCallback(() => {
    return Date.now() >= new Date(GIFT_READY).getTime() ? "locked" : "message";
  }, []);
  const onWeddingUnlock = useCallback((text) => {
    setMsg(text);
    setState(pickPostWedding());
  }, [pickPostWedding]);
  const onGiftUnlock = useCallback((proof) => {
    notify(proof);
    setState("unlocked");
  }, []);
  const onRevealed = useCallback(() => {
    setFireConfetti((n) => n + 1);
  }, []);
  const onCountdownDone = useCallback(() => {
    setState("locked");
  }, []);
  return /* @__PURE__ */ React.createElement("div", {
    "data-accent": "terracotta"
  }, /* @__PURE__ */ React.createElement(HeartsBackground, null), /* @__PURE__ */ React.createElement("main", {
    className: "page"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "state-layer idle",
    key: state
  }, state === "weddingGate" && /* @__PURE__ */ React.createElement(WeddingGate, {
    onUnlock: onWeddingUnlock
  }), state === "message" && /* @__PURE__ */ React.createElement(MessageState, {
    msg,
    onCountdownDone
  }), state === "locked" && /* @__PURE__ */ React.createElement(LockedState, {
    msg,
    onUnlock: onGiftUnlock
  }), state === "unlocked" && /* @__PURE__ */ React.createElement(UnlockedState, {
    msg,
    onRevealed
  }))), state !== "unlocked" && /* @__PURE__ */ React.createElement("div", {
    className: "seal",
    "aria-hidden": "true"
  }, "A"), /* @__PURE__ */ React.createElement(Confetti, {
    trigger: fireConfetti
  }));
}
ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(App, null));
