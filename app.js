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
  salt: "uxNLR9bBTASzp/sLC7QXOA==",
  iv: "wTeguFT8tYtW7zFT",
  ct: "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",
  iter: 600000
};
var PROOF_BLOB = {
  salt: "ASLWB78y6aAV6URNxa5a/Q==",
  iv: "JXntEctJ8HPTF606",
  ct: "e0pbtrJz4EQl5IZMFa9vNJkHmBf/PToX8i8QmZ21r+vM21ZBrDNwmlKuguT+XYBE",
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
    onUnlock(proof, pw);
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
function PhotosBackground({ pics }) {
  const items = useMemo(() => {
    if (!pics || pics.length === 0)
      return [];
    const arr = [];
    for (let i = 0;i < 14; i++) {
      const w = 110 + Math.random() * 70;
      const h = w * (1.15 + Math.random() * 0.25);
      arr.push({
        src: pics[Math.floor(Math.random() * pics.length)],
        x: Math.random() * 100,
        s: 22 + Math.random() * 14,
        d: Math.random() * 30,
        w,
        h,
        drift: -60 + Math.random() * 120,
        peak: 0.92 + Math.random() * 0.08,
        r0: -14 + Math.random() * 28,
        r1: -10 + Math.random() * 20
      });
    }
    return arr;
  }, [pics]);
  return /* @__PURE__ */ React.createElement("div", {
    className: "photos-bg",
    "aria-hidden": "true"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "veil-text"
  }), items.map((p, i) => /* @__PURE__ */ React.createElement("div", {
    key: i,
    className: "pic",
    style: {
      left: `${p.x}%`,
      "--w": `${p.w}px`,
      "--h": `${p.h}px`,
      "--s": `${p.s}s`,
      "--d": `-${p.d}s`,
      "--drift": p.drift,
      "--peak": p.peak,
      "--r0": `${p.r0}deg`,
      "--r1": `${p.r1}deg`
    }
  }, /* @__PURE__ */ React.createElement("img", {
    src: p.src,
    alt: "",
    loading: "lazy"
  }))));
}
function UnlockedState({ msg, pics, onRevealed }) {
  const [revealed, setRevealed] = useState(false);
  const handleDone = useCallback(() => {
    setRevealed(true);
    onRevealed?.();
  }, [onRevealed]);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, pics && pics.length > 0 && /* @__PURE__ */ React.createElement(PhotosBackground, {
    pics
  }), /* @__PURE__ */ React.createElement("div", {
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
  }, "p.s."), COPY.psUnlocked)));
}
async function loadPics(password) {
  try {
    const res = await fetch("pics.blob");
    if (!res.ok)
      return [];
    const blob = await res.json();
    const json = await tryDecrypt(blob, password);
    return JSON.parse(json);
  } catch {
    return [];
  }
}
function App() {
  const [state, setState] = useState("weddingGate");
  const [msg, setMsg] = useState(null);
  const [pics, setPics] = useState([]);
  const [fireConfetti, setFireConfetti] = useState(0);
  const pickPostWedding = useCallback(() => {
    return Date.now() >= new Date(GIFT_READY).getTime() ? "locked" : "message";
  }, []);
  const onWeddingUnlock = useCallback((text) => {
    setMsg(text);
    setState(pickPostWedding());
  }, [pickPostWedding]);
  const onGiftUnlock = useCallback((proof, pw) => {
    notify(proof);
    setState("unlocked");
    loadPics(pw).then(setPics);
  }, []);
  const onRevealed = useCallback(() => {
    setFireConfetti((n) => n + 1);
  }, []);
  const onCountdownDone = useCallback(() => {
    setState("locked");
  }, []);
  return /* @__PURE__ */ React.createElement("div", {
    "data-accent": "terracotta",
    className: state === "unlocked" ? "photos-mode" : ""
  }, state !== "unlocked" && /* @__PURE__ */ React.createElement(HeartsBackground, null), /* @__PURE__ */ React.createElement("main", {
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
    pics,
    onRevealed
  }))), state !== "unlocked" && /* @__PURE__ */ React.createElement("div", {
    className: "seal",
    "aria-hidden": "true"
  }, "A"), /* @__PURE__ */ React.createElement(Confetti, {
    trigger: fireConfetti
  }));
}
ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(App, null));
