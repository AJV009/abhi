// src/app.jsx
var { useState, useEffect, useRef, useCallback, useMemo } = React;
var COPY = {
  friendName: "abhi",
  forLine: "for Abhi & Sanjeeveni",
  greetWedding: "so... married eh?",
  hintWedding: "Obviously your day!",
  fmtWedding: "ddmmyyyy",
  psMessage: "There is another password coming, its in the note above...",
  hintGift: "Can you find/recall the date you first commented on my post? It was a Feb, 6yrs ago :)",
  fmtGift: "ddmmyyyy",
  celebrateHead: "Yay! ur gift should be in your account any moment!",
  psUnlocked: "So enjoy bro, have fun. Hope this helps ease out your wedding expenses.",
  errWrong: "hmm, not quite. re-read the long note."
};
var GIFT_READY = "2026-05-01T05:00:00+05:30";
var NOTIFY_URL = "https://ntfy.sh/abhi-unlock-alert";
var MSG_BLOB = {
  salt: "uQqxJ79kaqFGVd4bC7wu5Q==",
  iv: "sKHMTHxDru3xiJsM",
  ct: "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",
  iter: 600000
};
var PROOF_BLOB = {
  salt: "hYf6YgpHXAOd+KT/XWMWZQ==",
  iv: "X+sNBCJOa5OXiuLD",
  ct: "O0PCNhsthk21Xl+LKVKM7ELixU94/LGDDkCWqtg1PoY1kv71RGKuQMqTqp7kWKL2",
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
