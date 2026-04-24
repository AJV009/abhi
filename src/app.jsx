/* global React, ReactDOM */
const { useState, useEffect, useRef, useCallback, useMemo } = React;

// ─── edit these freely ──────────────────────────────────────────────────────
const COPY = {
  friendName:     "abhi",
  forLine:        "for Abhi & Sanjeeveni",

  greetWedding:   "so... married eh?",
  hintWedding:    "Obviously your day!",              // state 1, under input
  fmtWedding:     "ddmmyyyy",                         // pill next to hint

  psMessage:      "There is another password coming, its in the note above...",  // state 2
  hintGift:       "Can you find/recall the date you first commented on my post? It was a Feb, 6yrs ago :)",  // state 3, under input
  fmtGift:        "ddmmyyyy",
  psUnlocked:     "So enjoy bro, have fun. Hope this helps ease out your wedding expenses.", // state 4
  errWrong:       "hmm, not quite. re-read the long note.",            // on wrong password
};

const GIFT_READY = "2026-05-01T05:00:00+05:30";
// ────────────────────────────────────────────────────────────────────────────

// Ciphertext blobs — stay empty in source. `build.sh` injects real values
// into app.js after every bundle. Do not edit these by hand.
var MSG_BLOB = { salt: "", iv: "", ct: "", iter: 600000 };
var QR_BLOB  = { salt: "", iv: "", ct: "", iter: 600000 };

// ─── crypto ─────────────────────────────────────────────────────────────────
function b64decode(s) {
  const bin = atob(s);
  const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  return u8;
}

async function tryDecrypt(blob, password) {
  const enc  = new TextEncoder();
  const salt = b64decode(blob.salt);
  const iv   = b64decode(blob.iv);
  const ct   = b64decode(blob.ct);
  const baseKey = await crypto.subtle.importKey(
    "raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]
  );
  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: blob.iter, hash: "SHA-256" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );
  const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct);
  return new TextDecoder().decode(pt);
}

// ─── countdown ──────────────────────────────────────────────────────────────
function useCountdown(iso) {
  const target = useMemo(() => new Date(iso).getTime(), [iso]);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target - now);
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    done:    diff === 0,
  };
}

// ─── confetti ───────────────────────────────────────────────────────────────
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

// ─── shared bits ────────────────────────────────────────────────────────────
function Letter({ text }) {
  const paragraphs = text.split(/\n+/).map(p => p.trim()).filter(Boolean);
  return (
    <div className="letter">
      {paragraphs.map((p, i) => <p key={i} className="letter-p">{p}</p>)}
    </div>
  );
}

function CountdownBar() {
  const cd = useCountdown(GIFT_READY);
  return (
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
      <span className="cd-sep">·</span>
      <div className="cd-unit">
        <span className="cd-num cd-sec">{String(cd.seconds).padStart(2, "0")}</span>
        <span className="cd-label">sec</span>
      </div>
    </div>
  );
}

function PasswordField({ onSubmit, maxLen = 8 }) {
  const [pw, setPw] = useState("");
  const [shake, setShake] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const submit = useCallback(async () => {
    if (!pw || busy) return;
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

  return (
    <>
    <div className={"pw-wrap" + (shake ? " shake" : "") + (err ? " errored" : "")}>
      <input
        ref={inputRef}
        className="pw-input"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="off"
        spellCheck={false}
        maxLength={maxLen}
        placeholder={"•".repeat(maxLen)}
        value={pw}
        onChange={(e) => {
          const clean = e.target.value.replace(/\D/g, "").slice(0, maxLen);
          setPw(clean);
          if (err) setErr(false);
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
      {err ? COPY.errWrong : " "}
    </div>
    </>
  );
}

const REVEAL_STEPS = ["₹", "1", "2", "3", "4", "5"];
const REVEAL_STEP_MS = 1000;

function RevealSequence({ onDone }) {
  const [step, setStep] = useState(0);
  const prefersReduced = useMemo(
    () => typeof window !== "undefined" &&
          window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    []
  );

  useEffect(() => {
    if (prefersReduced) { onDone?.(); return; }
    if (step >= REVEAL_STEPS.length) { onDone?.(); return; }
    const t = setTimeout(() => setStep((s) => s + 1), REVEAL_STEP_MS);
    return () => clearTimeout(t);
  }, [step, prefersReduced, onDone]);

  if (prefersReduced || step >= REVEAL_STEPS.length) return null;
  return (
    <div className="reveal-seq" aria-hidden="true">
      <span key={step} className="reveal-digit">{REVEAL_STEPS[step]}</span>
    </div>
  );
}

function QrReveal({ payload }) {
  const qrRef = useRef(null);
  const [qrMarkup, setQrMarkup] = useState("");

  useEffect(() => {
    if (!payload || !window.qrSvg) return;
    setQrMarkup(window.qrSvg(payload, { size: 320, margin: 3, fg: "#111", bg: "#fff" }));
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
        a.download = `gift-for-${COPY.friendName}.png`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      }, "image/png");
    };
    img.src = svgUrl;
  };

  return (
    <div className="qr-reveal">
      <div className="qr-card" ref={qrRef}>
        <div
          className="qr-svg"
          dangerouslySetInnerHTML={{ __html: qrMarkup }}
          aria-label="gift QR code"
          role="img"
        />
      </div>
      <p className="gift-meta">{COPY.forLine}</p>
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

// ─── states ─────────────────────────────────────────────────────────────────

function WeddingGate({ onUnlock }) {
  const handleSubmit = useCallback(async (pw) => {
    const text = await tryDecrypt(MSG_BLOB, pw);
    onUnlock(text);
  }, [onUnlock]);

  return (
    <div className="sheet">
      <h1 className="hello serif">{COPY.greetWedding}</h1>
      <PasswordField onSubmit={handleSubmit} />
      <p className="hint">
        {COPY.hintWedding} <span className="fmt">{COPY.fmtWedding}</span>
      </p>
    </div>
  );
}

function MessageState({ msg, onCountdownDone }) {
  const cd = useCountdown(GIFT_READY);
  useEffect(() => {
    if (cd.days === 0 && cd.hours === 0 && cd.minutes === 0) onCountdownDone?.();
  }, [cd.days, cd.hours, cd.minutes, onCountdownDone]);

  return (
    <div className="sheet">
      <h1 className="hello serif">hey {COPY.friendName}<span className="dot">.</span></h1>
      <Letter text={msg} />
      <CountdownBar />
      <p className="ps">
        <span className="prefix">p.s.</span>
        {COPY.psMessage}
      </p>
    </div>
  );
}

function LockedState({ msg, onUnlock }) {
  const handleSubmit = useCallback(async (pw) => {
    const url = await tryDecrypt(QR_BLOB, pw);
    onUnlock(url);
  }, [onUnlock]);

  return (
    <div className="sheet">
      <h1 className="hello serif">hey {COPY.friendName}<span className="dot">.</span></h1>
      <Letter text={msg} />
      <PasswordField onSubmit={handleSubmit} />
      <p className="hint">
        {COPY.hintGift} <span className="fmt">{COPY.fmtGift}</span>
      </p>
    </div>
  );
}

function UnlockedState({ msg, qrUrl, onRevealed }) {
  const [revealed, setRevealed] = useState(false);
  const handleDone = useCallback(() => {
    setRevealed(true);
    onRevealed?.();
  }, [onRevealed]);

  return (
    <div className="sheet">
      <h1 className="hello serif">hey {COPY.friendName}<span className="dot">.</span></h1>
      <Letter text={msg} />
      {revealed
        ? <QrReveal payload={qrUrl} />
        : <RevealSequence onDone={handleDone} />}
      <p className="ps">
        <span className="prefix">p.s.</span>
        {COPY.psUnlocked}
      </p>
    </div>
  );
}

// ─── app shell ──────────────────────────────────────────────────────────────

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

  return (
    <div data-accent="terracotta">
      <main className="page">
        <div className="state-layer idle" key={state}>
          {state === "weddingGate" && <WeddingGate onUnlock={onWeddingUnlock} />}
          {state === "message"     && <MessageState msg={msg} onCountdownDone={onCountdownDone} />}
          {state === "locked"      && <LockedState msg={msg} onUnlock={onGiftUnlock} />}
          {state === "unlocked" && qrUrl && <UnlockedState msg={msg} qrUrl={qrUrl} onRevealed={onRevealed} />}
        </div>
      </main>
      {state !== "unlocked" && <div className="seal" aria-hidden="true">A</div>}
      <Confetti trigger={fireConfetti} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
