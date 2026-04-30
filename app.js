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
var GIFT_READY = "2026-05-01T05:00:00+05:30";
var NOTIFY_URL = "https://ntfy.sh/abhi-unlock-alert";
var MSG_BLOB = {
  salt: "hYvuP3WDIb+77cjYqMW0fQ==",
  iv: "C71IoJf28btzmOdW",
  ct: "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",
  iter: 600000
};
var PROOF_BLOB = {
  salt: "y9GyR0jRLuFV/v443KieUQ==",
  iv: "chaKUDTGSXiwLvIq",
  ct: "hWKAYRy7BLIU23C965F4LM5PYx1evdAdpEbXreWTtGplSnX3IS7jZ/ofnem+fv+k",
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
