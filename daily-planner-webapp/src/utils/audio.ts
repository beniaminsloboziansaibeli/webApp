export const playChime = (freq = 880, duration = 0.18) => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'
    o.frequency.value = freq
    g.gain.value = 0.0001
    o.connect(g)
    g.connect(ctx.destination)
    const now = ctx.currentTime
    g.gain.exponentialRampToValueAtTime(0.2, now + 0.01)
    o.start(now)
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration)
    o.stop(now + duration + 0.02)
    // close context shortly
    setTimeout(() => { try { ctx.close() } catch {} }, (duration + 0.2) * 1000)
  } catch (e) {
    // fallback noop
  }
}
