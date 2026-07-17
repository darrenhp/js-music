import * as Tone from 'tone'

/**
 * 统一音频引擎：封装 AudioContext 解锁、合成器与播放工具。
 * 所有发声必须经用户手势触发（浏览器自动播放策略）。
 */
class AudioEngine {
  private started = false
  private synth: Tone.PolySynth | null = null
  private pluck: Tone.PolySynth | null = null

  /** 在用户手势中调用，解锁 AudioContext 并惰性创建合成器 */
  async ensureStarted() {
    if (!this.started) {
      await Tone.start()
      this.started = true
    }
    if (!this.synth) {
      this.synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.01, decay: 0.25, sustain: 0.25, release: 0.6 },
      }).toDestination()
      this.synth.volume.value = -10

      this.pluck = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'fatsawtooth', spread: 20, count: 3 },
        envelope: { attack: 0.005, decay: 0.2, sustain: 0.1, release: 0.4 },
      }).toDestination()
      this.pluck.volume.value = -12
    }
  }

  get isStarted() {
    return this.started
  }

  /** 播放单个音（如 "C4"） */
  async playNote(note: string, dur: string = '4n') {
    await this.ensureStarted()
    this.synth!.triggerAttackRelease(note, dur)
  }

  /** 同时播放多个音（和弦 / 琶音根） */
  async playNotes(notes: string[], dur: string = '2n') {
    await this.ensureStarted()
    this.synth!.triggerAttackRelease(notes, dur)
  }

  /** 播放音程：依次两个音 */
  async playInterval(low: string, high: string, gap: string = '8n') {
    await this.ensureStarted()
    const now = Tone.now()
    this.synth!.triggerAttackRelease(low, '4n', now)
    this.synth!.triggerAttackRelease(high, '2n', now + Tone.Time(gap).toSeconds())
  }

  /** 吉他拨弦质感（多音同时发声，模拟和弦按法） */
  async pluckNotes(notes: string[]) {
    await this.ensureStarted()
    this.pluck!.triggerAttackRelease(notes, '4n')
  }

  /** 顺序播放一串和弦（用于和弦进行听辨），各和弦间隔 gap 秒 */
  async playChords(chords: string[][], dur: string = '2n', gap = 0.55) {
    await this.ensureStarted()
    const now = Tone.now()
    chords.forEach((c, i) => {
      this.synth!.triggerAttackRelease(c, dur, now + i * gap)
    })
  }

  /** 极短节拍器点击声 */
  async click(pitch = 'C6') {
    await this.ensureStarted()
    this.synth!.triggerAttackRelease(pitch, '32n')
  }

  /** 短音效（游戏判定） */
  async blip(ok: boolean) {
    await this.ensureStarted()
    const now = Tone.now()
    if (ok) {
      this.synth!.triggerAttackRelease(['E5', 'B5'], '16n', now)
    } else {
      this.synth!.triggerAttackRelease('A2', '8n', now)
    }
  }
}

export const audio = new AudioEngine()
