// src/app.jsx
var { useState, useEffect, useRef, useCallback, useMemo } = React;
var COPY = {
  friendName: "abhi",
  forLine: "for Abhi & Sanjeeveni",
  greetWedding: "so... wedding eh?",
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
  salt: "EB/28ExMWZu59ZmHWNUsxw==",
  iv: "Sd7GdZH9iVYfZUz7",
  ct: "K9R7+0HN/JTWsX4YnThTLO1gUYxt4PNPRm6ekaXW954c+dAZ0Jl8hdJ3izZJ/snNvRDQYlZqYTbosdr7Gh71HvCaamKLH2jwuTNYc489UNuQydXFUqBZcLmpJmQSR9gFX7TpWf1Pn2IKaPV5RBhIib+2Q4+CnFpaNnY0syHZtO8en8f7ODEjInUGzHTrFP2r+at54H3lPo2IjvuXThi2vByN9YPy5CkTnRSDv1xD4IHVKE+MTtf+4RUBW3SozW6X5KM11zH52jjGgUAdirkeai9ABPc7k+HFhYF+n47hs82Sdk4Js2rAx8HTjHxlv7QxUqDy9ecs7BSMigHw6TE4AZtT7kj0cOYfV3dJgco5fpe0RGGVrDiNSI/HUYD4Tw/fOjZ5bcoupCcdNHt2Lb9GJitHk8szP79P05qZOqFpAab6J+wI+yvqN7v/zX6zwldzbPz1BCtdreNcETCAVpiVn+IDq6dbVpJdCu5+QrFOyd5OrgoHlalorDcoC/fIj/lYYydfLPGgPsD/A0J/UGGtQH0H9Vye9zbhBxL7TJ8t2PTMuSH+a4M9rJ0/gcsRGmlGwAe+qt3g4BzoOWe2VH5/J+ApDBfjsVJetTKAVin5K3399uSIShA8u0HLEkQzjDoXf+qKl7XzUN01hZzH1rS35n6U5uGjL0bC7bEDbE6yiaSrbctQBBA6OyeV56JVEQoHA3SRuK/e2zEaF34uTmvFBDQt5dnCLQFDVujTasC/zvt5B28aRbo6JfLKUFS5dgUuT8904PC1segPH4fy8UYgs5CGbl5b2XAbCzPLk8YJ9b4tlxqy5TzRrVJylaEtGnV6WDv00n488aNmKYHTd9E5OLwMZL1YuVH6a6+4xGUyb1547wQgY7BX2HV/WjE+TrO+X/m7aEFgBGeLIZ5d3oEHfPQ/ipteHy0HHPJRm/ZuEDPIvaBMvBTMMl1srWzsDiw05mSaYGo0QSH4O6T55EqtEJS6IetnqT7LJGwPro85XqSPIUNN4QLfnISQEipWZyYUlEW8It6rPpRo+uioNBACEer0fDJUJlw5p9EoyMva3u/xqoLZfwCUcMDLciwl7qSy9Ic1uMp11byCV5VZkogsOoFhBPzVRWlFISq8T8X6tt1E7ticAoDrRspKdslIdDVNDsOO5G/5g4ILc5rj7fBfjfDya3V2aFwRt8h+x0j9jcUW3Yy927YyUi6X3wMuxqQ5LsyzxPisg4wLluu0VJECwdocYyM9VpLl7QXTf3ggkLCEgIet/Kz7UFCH0YIL086xnESzI5yxym/YntNLX6PWdP9g4dethn0gH1M/fAfzdSRm04RvgGmPtSK0WKaZLu/cOcKIWvmduGe/mEVc1/7nMs/CAy3kWclQpdjOdJLTiJ2LtN3M0qFO4WpP2th7X5NeksbXiHhgj90i5avM03jPnTrbJGXd/CK/IOwIl+7saiFmfyla++9xxe6fGrfgqU9oFgTronuKJQxv3VWavvv+0DchE703DoBVEUuo4dChg4+4bLedJPyJ1j3NXBW3OPwjja6wIMeRkqpJE9xFWmJtZ20cM5qE/2zBj+ZPpo8M6xqWYeYwmn5tev+U2NYi1JHLnxcyWCjiFqUehFOJLLeuPke04r+vMO0CeO4Kqg6AZ1JtX22iTkllLKLjEuS/siCZK/RZ8u/RYX841Uh/gecn6j8uys6JADMzi++Lrx5vxBrexPSqRBpX/QqKNC/p3JOhQQt5OIqKlDUqUpyah6K5mAQbEdmq2kmwBBUDZQ0ZJe4pA5SCAg30YlcZ75KH/qI3l9DzK47NN23wKpaFBUViEf+UzqhEf7NDMkXSvsODucCagZ9Tc9/CEjbR8WtcaKHDgkMXI2gaAk1F4rWcrmOVbiLy8jBbzkVNfSuhdSA/Zo/ZX7tNbutKveAoV9b091lk8+j71DW7fk8qhkGDDmlYsmBk09y8CzXi2zEEx3Q7xZRO3fVC0GILmBV/ihPop+3Uh+xD0UT3C/Lp7R8xutRfTMdXKCiQ2yW7H/hqgni3enIX7tJgJUOT9FkpRQriExEmU3Px+g9cRcZOpd5ezaq4ZpHljM8v5J5C6NZemwySIQf8y1YK6OgXMR/yS5sx7fLqUtHNm/428MUQG2ymGJlG/BiLWle/IFHNsQ6awaL0bqfJ25/hELSjwSk/5X5xbqj+78LpXElEq+5nt9joLxbeBppYW5gs2JsfRkyUEam4cQIbSb28t2NOXBnypLKyDdwg4WFx7He40EnRCm2PICjXlqGFMd8Jw/OS99ndJRNUvqzxwSGiGH9uNtmTDqk160sol/1ZV2IjWlcm6paYd1SZqT2cuVpNzlAEud7TNLSqx8ksxQt2JaNettWNlPfRJza2CxFkdLFlPqhWF9cZjFz3+hbaIlOtOlDinnAHto/5tSCMqb0HCoYZ8p/VYoZKsUpatHWYV+kZURLwg0fLJT6ZjWmEzJ3VbWg6pzIUUehMTr+hXrN8VRMsS1VqKRZLyoZPMZFIKjdv0NjYPabeTO+DVFUmHyatzt9z9O9OhU+FR9dI6T7eEFGkm5lbTY9/PALiQhH3mdAtMPtLJCw7rW6mu9SDpRNPjiPoZ1fOwXqe14x3EUaBODFUqGS2KKwgh45sMG3BWmMVtYLlu5b7EzHt+4r01n2nukiCxuONs3MCijRsNkblKUa4csfJGu4/s98DK6OenTBDY/PSO3Rj0kbZVdJGuELQZaPvjeBrXPl1RytRkY2qjvc4tq4N0oPofWK5r+WJlmKpK0t7AAqkDawSdfLLSh/uyDfxtMC2wRm2tpVansqTPcCi2w7Td7cjHe1eFXEZS3akghX7P737Sc3bYTwY7mhCvVtzE+pKbIqdFl8KXhAn5nGMGbuNW4EKe6D4yC8FppdIK07nx9YOyfdgnduKLR5I4svA97XjJm8Imw3331VPRe3zV7zOlcDljj3UNE7kZW9j1gsXk/SPrNF1Xx/i3B1imW353c3gqE3PtWLYfxR8FuFP9P+gpBB6r4wY+alZGBD+9aNPTPD3aWtGZhGVBpfJU54XII6l/PKB1LxvuJjVza9/b2d53LfXJZTXhoEeQku6K2m4vnLC3Ok+D5xDHt7tFN1Tq/ohbQCSfHNjXsrodo1IPCzqkRBdj9ziVsDQ2vTwZeeVUNpdu6Iqtr2XsbkwgauYKknqsdtopNk25e5BV/WsxE8J0Lpp9O7TV7dJyuRTqi9TaFt5pZiB2fTzrq/qu+k9",
  iter: 600000
};
var QR_BLOB = {
  salt: "cCpq9uCMrhcG4iaUNcMCDg==",
  iv: "N9Mzae+5dPhS2CLu",
  ct: "MsqwzNJymFWaFV6UwMIOpE4yG9ooKQstbI5bIKH8bl+PTEU8OC5gJDVnoYX3+oe2Xq9fNC5vmUNp3Z17fQ67BdmceABAElKxuBlq5Ie0K58nKXes6raHwbngR5CQVe7yl+Zh3DNaVQ==",
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
