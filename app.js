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
  salt: "h1aRT8k/It5Xh23MRyj1EA==",
  iv: "nzTchX0Dn8R85rbw",
  ct: "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",
  iter: 600000
};
var PROOF_BLOB = {
  salt: "Dg3xZLSXT+/EFJQuXQqjfg==",
  iv: "VlhZksG8DgSkDg0U",
  ct: "poEu1vh4kdZdrSCNCfqLkGJTpibAi4IYfe9SPfbLIv2OHQTwCjZ6374K1lJ+7qdd",
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
function Letter({ text }) {
  const paragraphs = text.split(/\n+/).map((p) => p.trim()).filter(Boolean);
  return /* @__PURE__ */ React.createElement("div", {
    className: "letter"
  }, paragraphs.map((p, i) => /* @__PURE__ */ React.createElement("p", {
    key: i,
    className: "letter-p"
  }, p)));
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
