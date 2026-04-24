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
  salt: "qXQBRK2eA8vvHZKjxZruAA==",
  iv: "fjjI8t8q3J/XVch4",
  ct: "ww+86mPp1lbUn4lQ/q8ip0Ue3AN/vR5f8P524sBd3cuiGBBN5A2+P086SzLGdwOfNMZkngsmjcEit12QZt5NwsuzqSDd19FaqDowJRYmpihVciMxUqiWgWryCPC19MJ3Wc5cf6nj79m+qOKt9To55gUKB6Oz0wRPEet7pDgA8/RRhixIx4ATO0HePJpj0Hnb5nMJtVeiZroWc86ORYlNvZz1nB4SEwXKo7gkidP2fmTfK2zJhS4x998c4sBklQJsRG3glySu5b+HHmvchBWnWeQZwS2LFtE02Hvt+aNLQJRLbHHI1QZfL3aDjE7SQIY3NAKM1KX5behwI5XT9sBgT99gPwoqbRRy7/7Fmh/LtphgPNVRcSvxepg07HcxYZEP6yTFNAmnfXdKTe7VaeKkQvSBNluyfZPhaAurl5tIhelPJky7J5Zas/rFjOoZegjEnmp/GaPcFWD0ROB32hAzFonaZb5wX/9aTKZZ4a4n+PdujSy/iK99EePC/DvGu4QR692WRdW7L2YpH/+aKUEgtD8rURi3oTA4FQtQleqBV8sb8TAQCQCmdnvfYrB/nqQHRr2mJEL4d9E4VnekSizTICWYKAnc5GD8tpOSuEypggiEr1Xvmp7YXRAEpFHnjpE5qIdDt31/reE7SgMCgMharl9PBICNbno2Na1vPvDXSwxFBYgJQ0I/zsNsT40tKi+WZU64dQjKtIIQFnAx8XPJaWpkHQW6Z4cKWyIwBIjSXecGoyY3ZGJsqhRdKWIPAcQYlnPlGTo2fjPIPMfg2EawZtjiFcOPTPap1V916vQgbNXmUeVJ+kVF5IFaGXLTUP8SVkY/QzlLt+3mPxzGg3FumDVOy/mA/Kpl/k+YiFtJBU54CfLKAmWjX2Y9mMdqlMlVx7NWXIjo1aWVv19N8X0heDBuHKaClbiWJT/Bnj6q/t+CAJSkJPoFY7F6imIzL34UjA9i1PCO4CdGaqP/7wzGSz1i7cR7tkzq5+ozVlh0T+K9USa3GaatBI5AiOR2A9casQNQqIH4rZ+y0VMP1VjSPf2n5rrXv34YXJcmysweqW0L2IG4SnHZVxC8JkLqJNz3SGSiBdJQt6myWVQLK2X2ye1QGnYdqcosA3sPjNl/wxOHetFwxwMncDio53I/2qtogPYy1zG4LNiU7DKrkxRJaIH7yKNxMgloJwqkByYcHMkFMmSmFg3TB2auXZ60tyKjBx+j0Xia6t5yZ7RDiEuXlFxZicf+xSIDWm+i13jlbLldizhDdFvmzpr+WK8bKDkAnvJEupGa/qQoLAZwM1GCCZ5WpAN2dw0j/inxcMj4D2Y3xmKxVD/tgzosZb9DFWn0pG5/HMSO4HzGRiTOiNkr4r8QGY9cpBOyHB7FUDVA9uCQAUn8cLa3HGtp5sHG3B/32gquMTOCv+KHI2FR7/WipllDv/Jz3Zj/F5VKa6WQJUCFXguljpTx2b1dpSGRtTcOXxZB+BbXMGgPSYdpD5UgVE8OsREzYyGO8p9PX7zCEfaKV92uR1cdjXIyxiXDTS3fjDjdCR3OW2STYtdPRVDcjqaiNsLx+mtFpQkqXGyhquxwt01RWRjhW1lwboD4nFiphrYpvOFCX/AHuXa1om7AfUQYrSRU6v8a0ALV9HfYNWKjJo/J8r+Fval6yvJTw7GBAj2xhcoKI1NmDj0ogg7y7v0KrISSuw5Wgmn3mEWcHrzezt1YDIfducFRVpaLwaYF8k59mc+ML729FTpDBSydcJTGHom92AnA89J5dgaIQKsQ3gz+vC1Nks7dxyq1Rjcq4/1Y1t8fwgV6ZLtepLXVcqTQm8k6N94xu96WLxt7HRW2MlPKBEuV8AzF/uT/0aWaEX03FQCSaX7PT+C8OL4py6dEJyjg1xkBZXf/3WzHORVcCVsLL1MnSAUFcdeCcLKjGhxmc4Gzbb+WZPbiXgEUYEqONicGqEyGTciWxiTmF1yRW5JbFQ+yX2qTObpirpjdBGyEwrJaz6OGM+e7W60+WUKDtjny9KBIWQP5K1bXjxkc24A4RlDoZhMN02AuWdgr3gvsEzfLXn5yxBeicmIp0HVtUm6V9yhN+aQaOuyHVO3l1AbbITxvczIdkq9aVEYweszHcgC4a+GALFdXi39lmy6eO7FKBhkrtSQUTN61VA3kmOVU8di7rGJMOGp/cFBjMh4s/TAjG7iSBBomsXzCJHAs+rhJ3P8883aqMteM4ritHkdOppATFltHxbUrih8QfqpzaVwJKfWNgKX9FtmxXWeEm8Kdc2YXEoChqibRSidrjRuq1J01/EHqe2O26EYeS6OfD30ciNW9JiPwGoMOSG9Vm681QQpluhNMYi8oDlsUREo+M/oMAC4vGwQXmfPXK/A8HPoUXRwJ7n1Rjs79BV+u9Gns4curVb1KOi2+Vy0TVL9flTObNT2fYG2TvRYbpO0Auxv2cA9ZmVWJVpizWCX3yAoM3VPc6uwyiYrovV4uaO82b7rXcuLhDlhMD1fH499eUl48gHmZppE6hnUVXz2xNt60aZWderKlfax+7m/WBAVuUtXni+hvepKyNALmSy0Lkuy5eQBjE4OVFeP4zpUOaCbrJyOkR8e9psI/XfzAMqjmaXyp51dQOHd+jS6jTLIFfbYU+e4FlNvTY2hMEpUmzXCfG4otZ1xNEsxgblhdztWAIVv05BiynZxgHpTjG/yIFlYoKoHAkMvFL0gFCnz/vYauv/ZwKHXR5b0HoeL8bbKBEL3e+fnLWFKK44M00Vi4svXnr2JOLP61aaux2/baJWBdDQjhYwZ3P9l6/flwqna54gf57PjWqZY5eRrOqRKq01CzxhBPHQ8zzMSqmHQyDkR1VjlfIJ6X4VAwnQc7WYcup35o0/N0JDANc0hL6j0TZy7cg24X4y+l19DXxXBGbtSiDgveDkHWYptVkdqdFrbQEuldPVOmmTXomDkqpslbRKGXqwOy8V26tXYl7c2cGg8OK76+2ciX/ygxesw1lh7ietaOPLayCDqBwdgv/BqsRUovxUoDKkcjbk43GbO+E6Sn/pHuDUW5+HTu+lH+zQRDL2imWOH7+AAJKf/alxnaOUHSf9EVdGavaM6BEll8OiHcS0wakba6jNU6bnHtiOY9IYWNFKyIFzE/Pi/QVYOrrFoWlb+oMJrVEgJigaezHdsAoq6vLWvOvnDvsybBkfO2Q4qt+h7Fbf4N5DfOMphUwGAIhtLM/I7Sm1kMrd2sihrES+k=",
  iter: 600000
};
var QR_BLOB = {
  salt: "02aPEAWpQsoJXP4wySAVqQ==",
  iv: "niKVJLvuWJhcy9qL",
  ct: "Tb6cmGoiVhJ9FeBi90lNM2AEftthuJIGrJuHoUNMuLL6VbAng+VrRzzwnatZ6G/sIMqh27w/wrRBWrXFfcHWqgg3jTOJQcnOB5QbV9d5DXOMZAVgVhxQ6krviukE7aJHyni3AfjOBw==",
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
