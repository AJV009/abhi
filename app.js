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
  celebrateSub: "Thanks for being a friend — and well, good job at figuring out the date!",
  psUnlocked: "So enjoy bro, have fun. Hope this helps ease out your wedding expenses.",
  errWrong: "hmm, not quite. re-read the long note."
};
var GIFT_READY = "2026-05-01T05:00:00+05:30";
var NOTIFY_URL = "https://ntfy.sh/abhi-unlock-alert";
var MSG_BLOB = {
  salt: "VXcXY6J2ZAZosjI+7QNRUA==",
  iv: "5F5te6EBnu2kFZPu",
  ct: "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",
  iter: 600000
};
var PROOF_BLOB = {
  salt: "CSIEfkSSoDMnK9p2uk/uMA==",
  iv: "IKQXNvASt45AlaH8",
  ct: "uCCtJIUCtrBW7w+FGd2I3cagbOpkdjH3cA17/XVLDN0vHN50Dd2492xjrOgyrVxy",
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
    inputRef.current?.focus();
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
  return /* @__PURE__ */ React.createElement("div", {
    className: "incoming",
    "aria-hidden": "true"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "incoming-ring"
  }), /* @__PURE__ */ React.createElement("div", {
    className: "incoming-ring"
  }), /* @__PURE__ */ React.createElement("div", {
    className: "incoming-ring"
  }), /* @__PURE__ */ React.createElement("div", {
    className: "incoming-core"
  }));
}
function Celebrate() {
  return /* @__PURE__ */ React.createElement("div", {
    className: "celebrate"
  }, /* @__PURE__ */ React.createElement("p", {
    className: "celebrate-head"
  }, COPY.celebrateHead), /* @__PURE__ */ React.createElement(Incoming, null), /* @__PURE__ */ React.createElement("p", {
    className: "celebrate-sub"
  }, COPY.celebrateSub));
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
  }, /* @__PURE__ */ React.createElement("main", {
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
