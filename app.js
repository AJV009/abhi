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
  psUnlocked: "So enjoy bro, have fun. Hope this helps ease out your wedding expenses.",
  errWrong: "hmm, not quite. re-read the long note."
};
var GIFT_READY = "2026-05-01T05:00:00+05:30";
var MSG_BLOB = {
  salt: "Y0xOxpWNUCrAJUUlbxBwfQ==",
  iv: "2qXcry4+58i6qdHw",
  ct: "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",
  iter: 600000
};
var QR_BLOB = {
  salt: "MCSTcIh+Wk5Yc/FB6E+Q7w==",
  iv: "Bm+uKiMF8/0G9Xls",
  ct: "d8hWWv1sOpyZ/2kpuZomYl4RmUuM2Xwt/OEYxjiWNRapsk2sdFA0CLIqba3KcFx6oHuds1hIMpTzybscBsS+qDeK8MSbDnQ9F0RuTL8VvrNh5eUBmUFGuvjOHyRlhyr4dSY/QkYiNQ==",
  iter: 600000
};
function b64decode(s) {
  const bin = atob(s);
  const u8 = new Uint8Array(bin.length);
  for (let i = 0;i < bin.length; i++)
    u8[i] = bin.charCodeAt(i);
  return u8;
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
function QrReveal({ payload }) {
  const qrRef = useRef(null);
  const [qrMarkup, setQrMarkup] = useState("");
  useEffect(() => {
    if (!payload || !window.qrSvg)
      return;
    setQrMarkup(window.qrSvg(payload, { size: 320, margin: 3, fg: "#111", bg: "#fff" }));
  }, [payload]);
  const downloadQr = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg)
      return;
    const xml = new XMLSerializer().serializeToString(svg);
    const img = new Image;
    const svgUrl = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(xml)));
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = 640;
      c.height = 640;
      const ctx = c.getContext("2d");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, 640, 640);
      ctx.drawImage(img, 0, 0, 640, 640);
      c.toBlob((blob) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `gift-for-${COPY.friendName}.png`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      }, "image/png");
    };
    img.src = svgUrl;
  };
  return /* @__PURE__ */ React.createElement("div", {
    className: "qr-reveal"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "qr-card",
    ref: qrRef
  }, /* @__PURE__ */ React.createElement("div", {
    className: "qr-svg",
    dangerouslySetInnerHTML: { __html: qrMarkup },
    "aria-label": "gift QR code",
    role: "img"
  })), /* @__PURE__ */ React.createElement("p", {
    className: "gift-meta"
  }, COPY.forLine), /* @__PURE__ */ React.createElement("button", {
    className: "download-btn",
    onClick: downloadQr
  }, /* @__PURE__ */ React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /* @__PURE__ */ React.createElement("path", {
    d: "M12 3v12"
  }), /* @__PURE__ */ React.createElement("path", {
    d: "M7 10l5 5 5-5"
  }), /* @__PURE__ */ React.createElement("path", {
    d: "M5 21h14"
  })), "save image"));
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
    const url = await tryDecrypt(QR_BLOB, pw);
    onUnlock(url);
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
function UnlockedState({ msg, qrUrl, onRevealed }) {
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
  }), revealed ? /* @__PURE__ */ React.createElement(QrReveal, {
    payload: qrUrl
  }) : /* @__PURE__ */ React.createElement(RevealSequence, {
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
  const [qrUrl, setQrUrl] = useState(null);
  const [fireConfetti, setFireConfetti] = useState(0);
  const pickPostWedding = useCallback(() => {
    return Date.now() >= new Date(GIFT_READY).getTime() ? "locked" : "message";
  }, []);
  const onWeddingUnlock = useCallback((text) => {
    setMsg(text);
    setState(pickPostWedding());
  }, [pickPostWedding]);
  const onGiftUnlock = useCallback((url) => {
    setQrUrl(url);
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
  }), state === "unlocked" && qrUrl && /* @__PURE__ */ React.createElement(UnlockedState, {
    msg,
    qrUrl,
    onRevealed
  }))), state !== "unlocked" && /* @__PURE__ */ React.createElement("div", {
    className: "seal",
    "aria-hidden": "true"
  }, "A"), /* @__PURE__ */ React.createElement(Confetti, {
    trigger: fireConfetti
  }));
}
ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(App, null));
