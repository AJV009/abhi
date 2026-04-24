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
  celebrateHead:  "Yay! ur gift should be in your account any moment!",          // state 4, big line
  psUnlocked:     "So enjoy bro, have fun. Hope this helps ease out your wedding expenses.", // state 4, p.s.
  errWrong:       "hmm, not quite. re-read the long note.",            // on wrong password
};

const GIFT_READY = "2026-05-01T05:00:00+05:30";
const NOTIFY_URL = "https://ntfy.sh/abhi-unlock-alert";
// ────────────────────────────────────────────────────────────────────────────

// Ciphertext blobs — stay empty in source. `build.sh` injects real values
// into app.js after every bundle. Do not edit these by hand.
var MSG_BLOB   = { salt: "", iv: "", ct: "", iter: 600000 };
var PROOF_BLOB = { salt: "", iv: "", ct: "", iter: 600000 };

// ─── crypto ─────────────────────────────────────────────────────────────────
function b64decode(s) {
  const bin = atob(s);
  const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  return u8;
}

function notify(body) {
  fetch(NOTIFY_URL, {
    method: "POST",
    body,
    headers: { Title: "abhi unlocked the gift", Priority: "high", Tags: "tada" },
  }).catch(() => {});
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

  useEffect(() => { inputRef.current?.focus({ preventScroll: true }); }, []);

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
    const proof = await tryDecrypt(PROOF_BLOB, pw);
    onUnlock(proof);
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

function Incoming() {
  const rotations = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <svg className="incoming" viewBox="0 0 180 180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      {rotations.map((r) => (
        <ellipse
          key={r}
          className="incoming-petal"
          cx="90" cy="50" rx="12" ry="22"
          style={{ "--r": `${r}deg`, "--d": `${r / 360 * 0.4}s` }}
        />
      ))}
      <circle className="incoming-center" cx="90" cy="90" r="14"/>
    </svg>
  );
}

function Celebrate() {
  return (
    <div className="celebrate">
      <p className="celebrate-head">{COPY.celebrateHead}</p>
      <Incoming />
    </div>
  );
}

function HeartsBackground() {
  const hearts = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 28; i++) {
      arr.push({
        x:     Math.random() * 100,
        s:     10 + Math.random() * 9,
        d:     Math.random() * 14,
        size:  10 + Math.random() * 9,
        drift: -28 + Math.random() * 56,
        peak:  0.09 + Math.random() * 0.09,
      });
    }
    return arr;
  }, []);

  return (
    <div className="hearts-bg" aria-hidden="true">
      {hearts.map((h, i) => (
        <svg key={i} viewBox="0 0 42 38" xmlns="http://www.w3.org/2000/svg" style={{
          left: `${h.x}%`,
          width: `${h.size}px`,
          "--s": `${h.s}s`,
          "--d": `-${h.d}s`,
          "--drift": h.drift,
          "--peak": h.peak,
        }}>
          <path d="M21 35 C21 35 3 23 3 13 C3 7 8 3 13 3 C17 3 19 5 21 8 C23 5 25 3 29 3 C34 3 39 7 39 13 C39 23 21 35 21 35 Z" fill="currentColor"/>
        </svg>
      ))}
    </div>
  );
}

function UnlockedState({ msg, onRevealed }) {
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
        ? <Celebrate />
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

  return (
    <div data-accent="terracotta">
      <HeartsBackground />
      <main className="page">
        <div className="state-layer idle" key={state}>
          {state === "weddingGate" && <WeddingGate onUnlock={onWeddingUnlock} />}
          {state === "message"     && <MessageState msg={msg} onCountdownDone={onCountdownDone} />}
          {state === "locked"      && <LockedState msg={msg} onUnlock={onGiftUnlock} />}
          {state === "unlocked"    && <UnlockedState msg={msg} onRevealed={onRevealed} />}
        </div>
      </main>
      {state !== "unlocked" && <div className="seal" aria-hidden="true">A</div>}
      <Confetti trigger={fireConfetti} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
