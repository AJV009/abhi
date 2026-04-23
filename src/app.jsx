/* global React, ReactDOM */
const { useState, useEffect, useRef, useCallback, useMemo } = React;

const GIFT_READY  = "2026-05-05T09:00:00+05:30";
const FRIEND_NAME = "abhi";
const AMOUNT      = "₹5,000";
const CLOSING     = "congrats brother. now go get something you'd actually enjoy. love you.";
const PW_HINT     = "the date that started everything.";

// Re-encrypt this blob with tools/encrypt-gift.mjs before deploying phase 2.
const GIFT_BLOB = /*GIFT_BLOB_BEGIN*/{
  "salt": "HQlZgfDpj6N5l5dK+F4q5g==",
  "iv":   "tyEGjjVAazOrqfzm",
  "ct":   "kgNpmJZE71RsfHItXYJjjIP17Za3gdEFYVEozJW09QLTMLdRefWPtfw3j2jpCkR6oOOW/0yKZpSAcUIRrAlNc7Mhp4SQrAMFO2SSXmXxcV6vsRp07ee57nuTsgMfokcEbkLN5rXvGRyM0sWuQyDBKTxYOH8yIk6Q1D1mbdxn3pzcFEKJOV9nJ2b44HYOYWxixYZjdKc83A5apOfhsHzTXXB3n0nJeFO1y5IwrcwSzIIdF+7+W9/0",
  "iter": 600000
}/*GIFT_BLOB_END*/;

function b64decode(s) {
  const bin = atob(s);
  const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  return u8;
}

async function tryDecrypt(password) {
  const enc  = new TextEncoder();
  const salt = b64decode(GIFT_BLOB.salt);
  const iv   = b64decode(GIFT_BLOB.iv);
  const ct   = b64decode(GIFT_BLOB.ct);
  const baseKey = await crypto.subtle.importKey(
    "raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]
  );
  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: GIFT_BLOB.iter, hash: "SHA-256" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );
  const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct);
  return JSON.parse(new TextDecoder().decode(pt));
}

function useCountdown(iso) {
  const target = useMemo(() => new Date(iso).getTime(), [iso]);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target - now);
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    done:    diff === 0,
  };
}

function Confetti({ trigger }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!trigger) return;
    setOn(true);
    const t = setTimeout(() => setOn(false), 1400);
    return () => clearTimeout(t);
  }, [trigger]);

  const pieces = useMemo(() => {
    const colors = ["var(--accent)", "#1a1613", "#e8c28a", "#f0d9b6"];
    const arr = [];
    for (let i = 0; i < 28; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist  = 120 + Math.random() * 260;
      arr.push({
        bg: colors[i % colors.length],
        to: `translate(${(Math.cos(angle) * dist).toFixed(0)}px, ${(Math.sin(angle) * dist - 60).toFixed(0)}px)`,
        rot: (Math.random() * 360).toFixed(0),
        delay: (Math.random() * 120).toFixed(0),
        w: 4 + Math.random() * 6,
        h: 8 + Math.random() * 8,
      });
    }
    return arr;
  }, [trigger]);

  return (
    <div className={"confetti" + (on ? " go" : "")} aria-hidden="true">
      {pieces.map((p, i) => (
        <span key={i} style={{
          background: p.bg, width: p.w, height: p.h,
          "--to": p.to, transform: `rotate(${p.rot}deg)`,
          animationDelay: `${p.delay}ms`,
        }}/>
      ))}
    </div>
  );
}

function Placeholder() {
  const cd = useCountdown(GIFT_READY);
  return (
    <div className="sheet">
      <h1 className="hello serif">hey {FRIEND_NAME}<span className="dot">.</span></h1>
      <p className="lede">
        your gift was <em>supposed to be</em> here on the 28th.
        it'll be here on the 5th. same gift, same love,
        slightly late paycheck.
      </p>
      <div className="countdown" aria-label="countdown to gift reveal">
        <div className="cd-unit">
          <span className="cd-num">{String(cd.days).padStart(2, "0")}</span>
          <span className="cd-label">days</span>
        </div>
        <span className="cd-sep">·</span>
        <div className="cd-unit">
          <span className="cd-num">{String(cd.hours).padStart(2, "0")}</span>
          <span className="cd-label">hrs</span>
        </div>
        <span className="cd-sep">·</span>
        <div className="cd-unit">
          <span className="cd-num">{String(cd.minutes).padStart(2, "0")}</span>
          <span className="cd-label">min</span>
        </div>
      </div>
      <p className="ps">
        <span className="prefix">p.s.</span>
        there's a password coming. it's in the letter.
      </p>
    </div>
  );
}

function Locked({ onUnlock }) {
  const [pw, setPw]       = useState("");
  const [err, setErr]     = useState("");
  const [shake, setShake] = useState(false);
  const [busy, setBusy]   = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const submit = useCallback(async () => {
    if (!pw || busy) return;
    setBusy(true);
    setErr("");
    try {
      const payload = await tryDecrypt(pw);
      setTimeout(() => onUnlock(payload), 120);
    } catch {
      setBusy(false);
      setErr("hmm, not quite. re-read the letter.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setTimeout(() => inputRef.current?.select(), 550);
    }
  }, [pw, busy, onUnlock]);

  return (
    <div className="sheet">
      <h1 className="hello serif">okay<span className="dot">.</span> it's time<span className="dot">.</span></h1>
      <p className="hint">
        {PW_HINT} <span className="fmt">ddmmyyyy</span>
      </p>
      <div className={"pw-wrap" + (shake ? " shake" : "")}>
        <input
          ref={inputRef}
          className="pw-input"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          spellCheck={false}
          maxLength={8}
          placeholder="••••••••"
          value={pw}
          onChange={(e) => {
            const clean = e.target.value.replace(/\D/g, "").slice(0, 8);
            setPw(clean);
            if (err) setErr("");
          }}
          onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
          aria-label="password"
          disabled={busy}
        />
        <button
          className="pw-submit"
          onClick={submit}
          disabled={!pw || busy}
          aria-label="submit password"
          title="submit"
        >
          {busy ? (
            <svg viewBox="0 0 24 24" width="18" height="18" style={{animation:"breathe 1.2s ease-in-out infinite"}}>
              <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeDasharray="8 40" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h13" />
              <path d="M13 6l6 6-6 6" />
            </svg>
          )}
        </button>
      </div>
      <div className={"pw-error" + (err ? " show" : "")} role="status" aria-live="polite">
        {err || " "}
      </div>
      <div className="pw-hint-key">
        press <kbd>return</kbd> when ready
      </div>
    </div>
  );
}

function Unlocked({ payload }) {
  const qrRef = useRef(null);
  const [qrMarkup, setQrMarkup] = useState("");

  useEffect(() => {
    if (!payload?.qrPayload || !window.qrSvg) return;
    setQrMarkup(window.qrSvg(payload.qrPayload, { size: 320, margin: 3, fg: "#111", bg: "#fff" }));
  }, [payload]);

  const downloadQr = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    const xml = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    const svgUrl = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(xml)));
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = 640; c.height = 640;
      const ctx = c.getContext("2d");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, 640, 640);
      ctx.drawImage(img, 0, 0, 640, 640);
      c.toBlob((blob) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `gift-for-${FRIEND_NAME}.png`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      }, "image/png");
    };
    img.src = svgUrl;
  };

  return (
    <div className="sheet">
      <h1 className="reveal-head serif">there it is.<span className="em">🎉</span></h1>
      <div className="qr-card" ref={qrRef}>
        <div
          className="qr-svg"
          dangerouslySetInnerHTML={{ __html: qrMarkup }}
          aria-label="gift QR code"
          role="img"
        />
      </div>
      <p className="gift-meta">
        for <strong>{FRIEND_NAME}</strong> · <span className="amount">{AMOUNT}</span>
      </p>
      <p className="gift-note">{CLOSING}</p>
      <button className="download-btn" onClick={downloadQr}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v12"/>
          <path d="M7 10l5 5 5-5"/>
          <path d="M5 21h14"/>
        </svg>
        save image
      </button>
    </div>
  );
}

function App() {
  const initialState = useMemo(() => {
    return Date.now() >= new Date(GIFT_READY).getTime() ? "locked" : "placeholder";
  }, []);
  const [state, setState] = useState(initialState);
  const [payload, setPayload] = useState(null);
  const [fireConfetti, setFireConfetti] = useState(0);

  const handleUnlock = useCallback((p) => {
    setPayload(p);
    setState("unlocked");
    setFireConfetti((n) => n + 1);
  }, []);

  return (
    <div data-accent="terracotta">
      <main className="page">
        <div className="state-layer idle" key={state}>
          {state === "placeholder" && <Placeholder />}
          {state === "locked"      && <Locked onUnlock={handleUnlock} />}
          {state === "unlocked" && payload && <Unlocked payload={payload} />}
        </div>
      </main>
      {state !== "unlocked" && <div className="seal" aria-hidden="true">A</div>}
      <Confetti trigger={fireConfetti} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
