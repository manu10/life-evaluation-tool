// Shared alarm audio service to ensure audio context is primed on a user gesture
// and reused later (e.g., when the timer ends) without another tap.

let audioCtx = null;
let osc = null;
let gain = null;
let patternTimer = null;

function ensureContext() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) audioCtx = new Ctx();
  return audioCtx;
}

export function primeAlarmAudio() {
  try {
    const ctx = ensureContext();
    if (!ctx) return false;
    if (ctx.state === 'suspended' && ctx.resume) ctx.resume();
    // Create gain if missing and connect to destination
    if (!gain) {
      gain = ctx.createGain();
      gain.gain.value = 0; // start muted
      gain.connect(ctx.destination);
    }
    return true;
  } catch {
    return false;
  }
}

function buildOscillator(ctx, soundType) {
  const o = ctx.createOscillator();
  if (soundType === 'bell') { o.type = 'triangle'; o.frequency.value = 660; }
  else if (soundType === 'chime') { o.type = 'square'; o.frequency.value = 1200; }
  else { o.type = 'sine'; o.frequency.value = 880; }
  return o;
}

export function playAlarmPattern(soundType = 'beep') {
  try {
    const ctx = ensureContext();
    if (!ctx) return;
    if (ctx.state === 'suspended' && ctx.resume) ctx.resume();
    // Build chain if needed
    if (!gain) {
      gain = ctx.createGain();
      gain.gain.value = 0;
      gain.connect(ctx.destination);
    }
    if (osc) { try { osc.stop(); } catch {} osc = null; }
    osc = buildOscillator(ctx, soundType);
    osc.connect(gain);
    osc.start();
    // Attention pattern: 500ms on, 250ms off, repeating
    const amplitude = soundType === 'chime' ? 0.06 : soundType === 'bell' ? 0.08 : 0.1;
    if (patternTimer) { clearInterval(patternTimer); patternTimer = null; }
    let on = false;
    const periodMs = 750; // total cycle
    patternTimer = setInterval(() => {
      on = !on;
      gain.gain.setTargetAtTime(on ? amplitude : 0, ctx.currentTime, 0.005);
    }, periodMs / 2); // toggle every 375ms => approx 500/250 perceived due to envelope
  } catch {}
}

export function stopAlarmPattern() {
  try {
    if (patternTimer) { clearInterval(patternTimer); patternTimer = null; }
    if (gain) { try { gain.gain.value = 0; } catch {} }
    if (osc) { try { osc.stop(); } catch {} try { osc.disconnect(); } catch {} osc = null; }
    // Keep context and gain alive for reuse; do not close ctx
  } catch {}
}


