/* ==========================================================
   PUMPFONE — script.js
   Плейн JS, без зависимостей.
   ЧТО МЕНЯТЬ ПРИ ЗАПУСКЕ ТОКЕНА → объект CONFIG ниже.
   ========================================================== */

const CONFIG = {
  // Вставь контракт (CA) — copy-кнопки и live-статы с DexScreener включатся сами
  CA: "",                 // например: "5xY...pump"
  CHART_URL: "",          // https://dexscreener.com/solana/<pair>
  BUY_URL: "",            // https://pump.fun/coin/<ca> или jup.ag ссылка
  X_URL: "",              // https://x.com/...
  TELEGRAM_URL: ""        // https://t.me/...
};

/* ---------------- helpers ---------------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

/* ---------------- sound (off by default) ---------------- */
let audioCtx = null, soundOn = false;
function beep(freq = 440, dur = 0.09, type = "square", vol = 0.05) {
  if (!soundOn) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
    o.connect(g); g.connect(audioCtx.destination);
    o.start(); o.stop(audioCtx.currentTime + dur);
  } catch (e) { /* no audio, no problem */ }
}
function popSound() { beep(760, 0.06, "square", 0.06); setTimeout(() => beep(340, 0.09, "triangle", 0.05), 55); }

$("#soundBtn").addEventListener("click", () => {
  soundOn = !soundOn;
  $("#soundBtn").textContent = soundOn ? "🔊" : "🔇";
  if (soundOn) { beep(660, 0.08); toast("SOUND ON"); }
});

/* ---------------- boot ---------------- */
document.body.classList.add("locked");
function enterSite() {
  const b = $("#boot");
  if (!b || b.classList.contains("gone")) return;
  popSound();
  b.classList.add("gone");
  document.body.classList.remove("locked");
  setTimeout(() => b.remove(), 600);
}
$("#bootBtn").addEventListener("click", enterSite);
$("#bootBottle").addEventListener("click", () => { popSound(); toast("shake it harder"); });

/* ---------------- ticker + strips ---------------- */
const TICKER = [
  "💊 <b>$PUMPFONE</b> 500mg",
  "TAKE 1 CAPSULE PER CANDLE",
  "0% TAX",
  "LP BURNED",
  "CONTRACT RENOUNCED",
  "SIDE EFFECTS: <b>GAINS, COPE, SCREEN TIME</b>",
  "KEEP OUT OF REACH OF PAPER HANDS",
  "NOT A MEDICINE. NOT ADVICE. JUST A CAPSULE WITH LEGS.",
  "DO NOT EXCEED 9999 DOSES PER DAY"
];
$("#tickerTrack").innerHTML = [...TICKER, ...TICKER].map(t => `<span>${t}</span>`).join("");

const STRIP1 = ["TAKE ONE.", "CHECK CHART.", "REPEAT.", "💊", "TAKE ONE.", "CHECK CHART.", "REPEAT.", "💊"];
const STRIP2 = ["SHAKE WELL BEFORE USE", "★", "SWALLOW WHOLE", "★", "DO NOT TOUCH GRASS", "★", "SHAKE WELL BEFORE USE", "★", "SWALLOW WHOLE", "★", "DO NOT TOUCH GRASS", "★"];
$("#stripTrack1").innerHTML = [...STRIP1, ...STRIP1].map(t => `<span>${t}</span>`).join("");
$("#stripTrack2").innerHTML = [...STRIP2, ...STRIP2].map(t => `<span>${t}</span>`).join("");

/* ---------------- hero bubble ---------------- */
const BUBBLES = [
  "gm. still up 0%",
  "one more refresh then bed",
  "it's dipping. it's fine.",
  "who put legs on me",
  "i'll go outside after this candle",
  "battery 3% — worth it",
  "my doctor doesn't understand liquidity",
  "just took another one 💊",
  "chart looks the same as 4 seconds ago"
];
let bi = 0;
setInterval(() => {
  bi = (bi + 1) % BUBBLES.length;
  const el = $("#heroBubble");
  el.style.opacity = 0;
  setTimeout(() => { el.textContent = BUBBLES[bi]; el.style.opacity = 1; }, 220);
}, 3600);
$("#heroBubble").style.transition = "opacity .22s ease";

/* ---------------- CA + links ---------------- */
const caShown = CONFIG.CA || "NOT MINTED YET";
$("#caText").textContent = caShown;
$("#caTextFoot").textContent = caShown;

function copyCA() {
  if (!CONFIG.CA) { toast("NO CONTRACT YET 💊"); return; }
  navigator.clipboard.writeText(CONFIG.CA)
    .then(() => { popSound(); toast("PRESCRIPTION COPIED"); })
    .catch(() => toast("COPY FAILED — SELECT IT MANUALLY"));
}
$("#caCopy").addEventListener("click", copyCA);
$("#caCopyFoot").addEventListener("click", copyCA);

function wire(id, url, name) {
  const el = $(id);
  if (!el) return;
  if (url) { el.href = url; el.target = "_blank"; el.rel = "noopener"; }
  else {
    el.href = "#";
    el.addEventListener("click", e => { e.preventDefault(); toast(name + " — COMING SOON"); });
  }
}
wire("#btnBuy", CONFIG.BUY_URL, "BUY");
wire("#btnChart", CONFIG.CHART_URL, "CHART");
wire("#btnX", CONFIG.X_URL, "X");
wire("#btnTg", CONFIG.TELEGRAM_URL, "TELEGRAM");
wire("#btnXFoot", CONFIG.X_URL, "X");
wire("#btnTgFoot", CONFIG.TELEGRAM_URL, "TELEGRAM");
wire("#btnChartFoot", CONFIG.CHART_URL, "CHART");

/* ---------------- burger ---------------- */
const navLinks = $("#navLinks");
$("#burger").addEventListener("click", () => { navLinks.classList.toggle("open"); beep(520, 0.05); });
$$("#navLinks a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("open")));

/* ---------------- ingredients ---------------- */
const INGREDIENTS = [
  { name: "Hopium hydrochloride", mg: "420 mg", pct: 92, color: "var(--mint)", desc: "The bit that makes you say “it's still early”." },
  { name: "Screen-time citrate", mg: "68 mg", pct: 78, color: "var(--pink)", desc: "Binds to the thumb. Never lets go." },
  { name: "Cope sulfate", mg: "11 mg", pct: 55, color: "var(--lilac)", desc: "Activates automatically at −40%." },
  { name: "Refined copium", mg: "0.9 mg", pct: 34, color: "var(--sky)", desc: "Trace amounts. Extremely potent." },
  { name: "Due diligence", mg: "0.0001 mg", pct: 3, color: "var(--yellow)", desc: "Present, technically." },
  { name: "Sleep", mg: "0 mg", pct: 0, color: "#ff5c5c", desc: "Removed during manufacturing." }
];
$("#ingList").innerHTML = INGREDIENTS.map(i => `
  <div class="ing">
    <div class="ing-top"><span class="ing-name">${i.name}</span><span class="ing-mg">${i.mg}</span></div>
    <div class="ing-bar"><div class="ing-fill" data-w="${i.pct}" style="background:${i.color}"></div></div>
    <p class="ing-desc">${i.desc}</p>
  </div>`).join("");

const barObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.style.width = e.target.dataset.w + "%"; barObserver.unobserve(e.target); }
  });
}, { threshold: 0.4 });
$$(".ing-fill").forEach(b => barObserver.observe(b));

/* ---------------- blister pack ---------------- */
const DOSES = [
  ["DAY 1", "Took one capsule. Felt nothing. Checked the chart just in case."],
  ["DAY 2", "Checked the chart 41 times. Doctor says that's “within range”. It is not."],
  ["DAY 3", "Told my barber about supply mechanics. He has stopped making eye contact."],
  ["DAY 5", "Slept 20 minutes between candle closes. Feel incredible. Cannot feel my face."],
  ["DAY 8", "Named my phone charger. Its name is Liquidity."],
  ["DAY 11", "Went outside. Brought the chart. Outside is just a place with worse signal."],
  ["DAY 14", "Blinked once. Missed a green candle. Will not repeat this mistake."],
  ["DAY 19", "My screen time report arrived as a legal document."],
  ["DAY 23", "Explained the roadmap to a pigeon. The pigeon aped straight in."],
  ["DAY 30", "Woke up mint on the bottom, white on top. Small hands. Very small hands."],
  ["DAY 31", "I have legs now. Thin ones. Slightly shiny. Still holding."],
  ["DAY ???", "I am the capsule. The capsule is checking the chart. Nothing has changed. gm."]
];
const pack = $("#blisterPack");
let popped = 0;

function buildPack() {
  popped = 0;
  $("#poppedCount").textContent = "0";
  $("#doseLog").innerHTML = '<span class="dose-log-empty">↑ pop a capsule</span>';
  pack.innerHTML = DOSES.map((_, i) => `<button class="cell" data-i="${i}" aria-label="Capsule ${i + 1}"><span class="cap"></span></button>`).join("");
}
buildPack();

pack.addEventListener("click", e => {
  const cell = e.target.closest(".cell");
  if (!cell) return;
  const i = +cell.dataset.i;
  $$(".cell", pack).forEach(c => c.classList.remove("active"));
  cell.classList.add("active");
  if (!cell.classList.contains("popped")) {
    cell.classList.add("popped");
    popped++;
    $("#poppedCount").textContent = popped;
    popSound();
  }
  $("#doseLog").innerHTML = `<span class="dl-date">DOSE DIARY — ${DOSES[i][0]}</span>${DOSES[i][1]}`;
  if (popped === DOSES.length) {
    setTimeout(() => {
      toast("PACK EMPTY. TAKE ANOTHER ONE. 💊");
      $("#doseLog").innerHTML = `<span class="dl-date">PHARMACIST'S NOTE</span>Pack finished. Patient asked for a refill before finishing the sentence. Prognosis: bullish.`;
    }, 450);
  }
});
$("#refillBtn").addEventListener("click", () => { buildPack(); beep(600, 0.07); toast("PACK REFILLED"); });

/* ---------------- vitals ---------------- */
const fmtUsd = n => {
  n = Number(n);
  if (!isFinite(n)) return "—";
  if (n >= 1e9) return "$" + (n / 1e9).toFixed(2) + "B";
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return "$" + (n / 1e3).toFixed(1) + "K";
  return "$" + n.toFixed(2);
};

async function loadStats() {
  if (!CONFIG.CA) return;
  try {
    const r = await fetch("https://api.dexscreener.com/latest/dex/tokens/" + CONFIG.CA);
    const d = await r.json();
    const p = d && d.pairs && d.pairs[0];
    if (!p) return;
    $("#vPrice").textContent = p.priceUsd ? "$" + Number(p.priceUsd).toPrecision(4) : "—";
    $("#vMcap").textContent = fmtUsd(p.marketCap || p.fdv);
    $("#vLiq").textContent = fmtUsd(p.liquidity && p.liquidity.usd);
    $("#vVol").textContent = fmtUsd(p.volume && p.volume.h24);
  } catch (e) { /* API недоступен — оставляем прочерки */ }
}
loadStats();
setInterval(loadStats, 45000);

// joke stats
const start = Date.now();
setInterval(() => {
  const s = Math.floor((Date.now() - start) / 1000) + 41283; // patient already had a head start
  const hh = String(Math.floor(s / 3600)).padStart(2, "0");
  const mm = String(Math.floor(s / 60) % 60).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  $("#vScreen").textContent = `${hh}:${mm}:${ss}`;
}, 1000);

let checks = 1207;
setInterval(() => {
  checks += 1 + Math.floor(Math.random() * 3);
  $("#vChecks").textContent = checks.toLocaleString("en-US") + "×";
}, 1400);

/* ---------------- flying pill field (canvas) ---------------- */
(function pillField() {
  const cv = $("#pillfield");
  const ctx = cv.getContext("2d");
  const COLORS = ["#19d3a2", "#ff2d92", "#ffd93d", "#9b6bff", "#4cc9ff"];
  let W, H, pills = [], dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    W = cv.width = innerWidth * dpr;
    H = cv.height = innerHeight * dpr;
    cv.style.width = innerWidth + "px";
    cv.style.height = innerHeight + "px";
    const count = innerWidth < 760 ? 14 : 30;
    pills = Array.from({ length: count }, () => spawn(true));
  }
  function spawn(anywhere) {
    const size = (18 + Math.random() * 30) * dpr;
    return {
      x: Math.random() * W,
      y: anywhere ? Math.random() * H : H + size * 2,
      w: size, h: size * 2.1,
      vy: -(0.25 + Math.random() * 0.75) * dpr,
      vx: (Math.random() - 0.5) * 0.5 * dpr,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.02,
      color: COLORS[(Math.random() * COLORS.length) | 0],
      alpha: 0.35 + Math.random() * 0.45
    };
  }
  function capsule(p) {
    const w = p.w, h = p.h, r = w / 2;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = p.alpha;
    // bottom (coloured) half
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.moveTo(-r, 0);
    ctx.lineTo(-r, h / 2 - r);
    ctx.arc(0, h / 2 - r, r, Math.PI, 0, true);
    ctx.lineTo(r, 0);
    ctx.closePath();
    ctx.fill();
    // top (white) half
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(-r, 0);
    ctx.lineTo(-r, -h / 2 + r);
    ctx.arc(0, -h / 2 + r, r, Math.PI, 0, false);
    ctx.lineTo(r, 0);
    ctx.closePath();
    ctx.fill();
    // outline
    ctx.strokeStyle = "rgba(13,20,24,.75)";
    ctx.lineWidth = 2 * dpr;
    ctx.beginPath();
    if (ctx.roundRect) { ctx.roundRect(-r, -h / 2, w, h, r); }
    else { ctx.rect(-r, -h / 2, w, h); }
    ctx.stroke();
    ctx.restore();
  }
  function loop() {
    ctx.clearRect(0, 0, W, H);
    pills.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      if (p.y < -p.h * 2) pills[i] = spawn(false);
      capsule(p);
    });
    requestAnimationFrame(loop);
  }
  addEventListener("resize", resize);
  resize();
  loop();
})();

/* ---------------- pill trail on cursor (desktop) ---------------- */
if (matchMedia("(hover:hover) and (pointer:fine)").matches) {
  let last = 0;
  addEventListener("mousemove", e => {
    const now = Date.now();
    if (now - last < 90) return;
    last = now;
    const d = document.createElement("div");
    d.style.cssText = `position:fixed;left:${e.clientX - 5}px;top:${e.clientY - 9}px;width:10px;height:19px;border-radius:9px;
      border:2px solid #0d1418;background:linear-gradient(180deg,#fff 0 48%,#19d3a2 48% 100%);
      pointer-events:none;z-index:1400;transform:rotate(${Math.random() * 360}deg);transition:transform .7s ease,opacity .7s ease;`;
    document.body.appendChild(d);
    requestAnimationFrame(() => {
      d.style.transform = `rotate(${Math.random() * 360}deg) translateY(26px) scale(.4)`;
      d.style.opacity = "0";
    });
    setTimeout(() => d.remove(), 750);
  });
}

/* ---------------- konami-ish: click the mascot ---------------- */
let mascotClicks = 0;
$("#mascot").addEventListener("click", () => {
  mascotClicks++;
  popSound();
  const lines = ["not now, chart", "leave me alone", "i'm working", "ok fine, one more dose", "you're just like me"];
  toast(lines[Math.min(mascotClicks, lines.length) - 1]);
  const m = $("#mascot");
  m.classList.remove("hit");
  void m.offsetWidth;
  m.classList.add("hit");
  setTimeout(() => m.classList.remove("hit"), 400);
});
