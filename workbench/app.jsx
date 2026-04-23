/* global React, ReactDOM, TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakToggle, TweakButton, TweakText */

const { useState, useEffect, useRef, useCallback, useMemo } = React;

// —————— Ciphertext baked into the page ——————
// Placeholder password for dev preview: 28112015
// Swap this whole blob by re-running the encryption with your real password+payload.
const GIFT_BLOB = /*EDITMODE-BEGIN*/{
  "accent": "terracotta",
  "forceState": "auto",
  "giftReadyDate": "2026-05-05T09:00:00+05:30",
  "weddingDate":   "2026-04-28T09:00:00+05:30",
  "friendName":    "abhi",
  "amount":        "₹5,000",
  "closingNote":   "congrats brother. now go get something you'd actually enjoy. love you.",
  "passwordHint":  "the date that started everything.",
  "salt": "HQlZgfDpj6N5l5dK+F4q5g==",
  "iv":   "tyEGjjVAazOrqfzm",
  "ct":   "kgNpmJZE71RsfHItXYJjjIP17Za3gdEFYVEozJW09QLTMLdRefWPtfw3j2jpCkR6oOOW/0yKZpSAcUIRrAlNc7Mhp4SQrAMFO2SSXmXxcV6vsRp07ee57nuTsgMfokcEbkLN5rXvGRyM0sWuQyDBKTxYOH8yIk6Q1D1mbdxn3pzcFEKJOV9nJ2b44HYOYWxixYZjdKc83A5apOfhsHzTXXB3n0nJeFO1y5IwrcwSzIIdF+7+W9/0",
  "iter": 600000
}/*EDITMODE-END*/;

// —————— crypto helpers ——————
function b64decode(s) {
  const bin = atob(s);
  const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  return u8;
}

async function tryDecrypt(password) {
  const enc = new TextEncoder();
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
  const text = new TextDecoder().decode(pt);
  return JSON.parse(text);
}

// —————— countdown ——————
function useCountdown(iso) {
  const target = useMemo(() => new Date(iso).getTime(), [iso]);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000); // every 30s is plenty for day+hour
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return { days: d, hours: h, minutes: m, done: diff === 0 };
}

// —————— confetti ——————
function Confetti({ trigger }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!trigger) return;
    setOn(true);
    const t = setTimeout(() => setOn(false), 1400);
    return () => clearTimeout(t);
  }, [trigger]);

  const pieces = useMemo(() => {
    const arr = [];
    const colors = ["var(--accent)", "#1a1613", "#e8c28a", "#f0d9b6"];
    for (let i = 0; i < 28; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const dist = 120 + Math.random() * 260;
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist - 60; // bias up
      arr.push({
        bg: colors[i % colors.length],
        to: `translate(${tx.toFixed(0)}px, ${ty.toFixed(0)}px)`,
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
          background: p.bg,
          width: p.w, height: p.h,
          "--to": p.to,
          transform: `rotate(${p.rot}deg)`,
          animationDelay: `${p.delay}ms`,
        }}/>
      ))}
    </div>
  );
}

// —————— states ——————

function Placeholder({ giftReadyDate, friendName }) {
  const cd = useCountdown(giftReadyDate);
  return (
    <div className="sheet">
      <h1 className="hello serif">hey {friendName}<span className="dot">.</span></h1>

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

function Locked({ onUnlock, passwordHint }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [shake, setShake] = useState(false);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const submit = useCallback(async () => {
    if (!pw || busy) return;
    setBusy(true);
    setErr("");
    try {
      const payload = await tryDecrypt(pw);
      // tiny pause so the fade feels considered, not abrupt
      setTimeout(() => onUnlock(payload), 120);
    } catch (e) {
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
        {passwordHint} <span className="fmt">ddmmyyyy</span>
      </p>

      <div className={"pw-wrap" + (shake ? " shake" : "")} ref={wrapRef}>
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
        {err || "\u00A0"}
      </div>

      <div className="pw-hint-key">
        press <kbd>return</kbd> when ready
      </div>
    </div>
  );
}

function Unlocked({ payload, friendName, amount, closingNote }) {
  const qrRef = useRef(null);
  const [qrMarkup, setQrMarkup] = useState("");

  useEffect(() => {
    if (!payload?.qrPayload || !window.qrSvg) return;
    const svg = window.qrSvg(payload.qrPayload, { size: 320, margin: 3, fg: "#111", bg: "#fff" });
    setQrMarkup(svg);
  }, [payload]);

  const downloadQr = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    // rasterize to PNG for broad compat
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
        a.download = `gift-for-${friendName}.png`;
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
        for <strong>{friendName}</strong> · <span className="amount">{amount}</span>
      </p>
      <p className="gift-note">
        {closingNote}
      </p>

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

// —————— app shell ——————

function App() {
  const [tw, setTweak] = useTweaks(GIFT_BLOB);

  // state auto-picked by date; "auto" = placeholder until giftReadyDate passes
  const autoState = useMemo(() => {
    const ready = new Date(tw.giftReadyDate).getTime();
    return Date.now() >= ready ? "locked" : "placeholder";
  }, [tw.giftReadyDate]);

  const forced = tw.forceState && tw.forceState !== "auto" ? tw.forceState : null;
  const [actualState, setActualState] = useState(() => forced || autoState);
  const [payload, setPayload] = useState(null);
  const [fireConfetti, setFireConfetti] = useState(0);

  // when tweak forces a state, honor it (but don't clobber unlocked payload on re-render)
  useEffect(() => {
    if (forced) setActualState(forced);
    else setActualState(autoState);
  }, [forced, autoState]);

  const handleUnlock = useCallback((p) => {
    setPayload(p);
    setActualState("unlocked");
    setFireConfetti((n) => n + 1);
  }, []);

  // demo payload for forced "unlocked" preview without a password
  useEffect(() => {
    if (forced === "unlocked" && !payload) {
      setPayload({
        qrPayload: "https://www.amazon.in/gc/redeem?claimCode=ABHI-XXXX-PLACEHOLDER",
        amount: tw.amount,
        brand: "Amazon",
        note: "preview",
      });
      setFireConfetti((n) => n + 1);
    }
  }, [forced, payload, tw.amount]);

  return (
    <div data-accent={tw.accent}>
      <main className="page">
        <div className="state-layer idle" key={actualState}>
          {actualState === "placeholder" && (
            <Placeholder giftReadyDate={tw.giftReadyDate} friendName={tw.friendName} />
          )}
          {actualState === "locked" && (
            <Locked onUnlock={handleUnlock} passwordHint={tw.passwordHint} />
          )}
          {actualState === "unlocked" && payload && (
            <Unlocked
              payload={payload}
              friendName={tw.friendName}
              amount={tw.amount}
              closingNote={tw.closingNote}
            />
          )}
        </div>
      </main>

      {actualState !== "unlocked" && (
        <div className="seal" aria-hidden="true">A</div>
      )}

      <Confetti trigger={fireConfetti} />

      <TweaksPanel title="Tweaks">
        <TweakSection label="preview state" />
        <TweakRadio
          label="state"
          value={tw.forceState}
          onChange={(v) => setTweak("forceState", v)}
          options={["auto", "placeholder", "locked", "unlocked"]}
        />

        <TweakSection label="accent" />
        <TweakRadio
          label="color"
          value={tw.accent}
          onChange={(v) => setTweak("accent", v)}
          options={["terracotta", "marigold", "rose", "ink"]}
        />

        <TweakSection label="copy" />
        <TweakText label="friend's name" value={tw.friendName}   onChange={(v) => setTweak("friendName", v)} />
        <TweakText label="amount"        value={tw.amount}       onChange={(v) => setTweak("amount", v)} />
        <TweakText label="hint"          value={tw.passwordHint} onChange={(v) => setTweak("passwordHint", v)} />
        <TweakText label="closing"       value={tw.closingNote}  onChange={(v) => setTweak("closingNote", v)} />

        <TweakSection label="unlock (dev)" />
        <div style={{ fontSize: 11, color: "#888", lineHeight: 1.5, padding: "6px 2px" }}>
          preview password: <code style={{ fontFamily: "monospace", background: "#f4efe6", padding: "1px 5px", borderRadius: 3 }}>28112015</code><br/>
          re-encrypt <code>GIFT_BLOB</code> before shipping.
        </div>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
