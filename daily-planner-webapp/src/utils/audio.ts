const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random()*arr.length)]

export const playChime = (opts?: { volume?: number }) => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const now = ctx.currentTime
    const scale = [440, 523.25, 659.25, 783.99, 987.77] // A4, C5, E5, G5, B5
    const root = pick(scale)
    const durations = [0.12, 0.16, 0.2]
    const chords = [ [0,2,4], [0,3,4], [0,2] ]
    const chord = pick(chords)
  const gain = ctx.createGain()
  gain.gain.value = opts?.volume ?? 0.12
    gain.connect(ctx.destination)
    chord.forEach((step, i) => {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = root * Math.pow(1.12246, step*2) // approx interval
      const g = ctx.createGain()
      g.gain.value = 0.0001
      osc.connect(g)
      g.connect(gain)
      const dur = pick(durations)
      g.gain.exponentialRampToValueAtTime(0.14, now + 0.01 + i*0.02)
      osc.start(now + i*0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, now + dur + i*0.02)
      osc.stop(now + dur + i*0.04)
    })
    setTimeout(() => { try { ctx.close() } catch {} }, 1000)
  } catch (e) {
    // noop
  }
}

export const playRandomSound = (volume?: number) => playChime({ volume: volume ?? 0.12 })
