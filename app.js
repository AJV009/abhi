// src/app.jsx
var { useState, useEffect, useRef, useCallback, useMemo } = React;
var COPY = {
  friendName: "abhi",
  forLine: "for Abhi & Sanjeeveni",
  greetWedding: "so... wedding aye?",
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
  salt: "lUy5XBfo4E4tipYCY34Xxw==",
  iv: "SLpa8swXzz2lBXaY",
  ct: "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",
  iter: 600000
};
var QR_BLOB = {
  salt: "V+4FOWj+NJpugte604xYtw==",
  iv: "pYPHV2V3WnkWmWBS",
  ct: "nCe4R5hgQPV0QFwzwlbi+ix3WFaI1BFHBGUHM96b4zN4J3kw6Ki3Yl4LpRLWdn4cO+hgxJavHwE6YpQMgQmRBsrXuKYWoITDudUVZ9FKVBtcOPcKfjcdrp6K4IMzZ/fDPOgwp4aACQ==",
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
