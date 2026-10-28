// Romantic & Serene Web Audio ambient music generator
// Royalty-free, 100% self-contained, no external network requests needed.

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying: boolean = false;
  private timer: NodeJS.Timeout | null = null;
  private chordIndex: number = 0;

  // Gentle, nostalgic pentatonic chords (frequencies in Hz)
  private chordProgressions: number[][] = [
    // Fmaj9 (warm, hopeful)
    [174.61, 220.0, 261.63, 329.63, 392.0],
    // Cmaj9 (comforting, home)
    [130.81, 196.0, 246.94, 261.63, 329.63],
    // Dm9 (tender, emotional)
    [146.83, 220.0, 261.63, 329.63, 349.23],
    // Am9 (intimate, deep)
    [110.0, 164.81, 220.0, 261.63, 329.63],
    // Bbmaj7#11 (magical realism, cinematic wonder)
    [116.54, 174.61, 233.08, 293.66, 370.0],
  ];

  private initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  private playTone(freq: number, duration: number, delay: number, volume: number = 0.08) {
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime + delay;

    // Dual oscillator for rich warmth (sine + warm triangle)
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = "sine";
    osc2.type = "triangle";

    // Slight detune for lush cinematic shimmer
    osc1.frequency.setValueAtTime(freq, now);
    osc2.frequency.setValueAtTime(freq * 1.002, now);

    // Warm low-pass filter to sound like an intimate acoustic felt piano / cello pad
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(480 + freq * 0.5, now);
    filter.Q.setValueAtTime(1.2, now);

    // Envelope: gentle soft attack, long velvet sustain, gentle release
    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.exponentialRampToValueAtTime(volume, now + 1.2);
    noteGain.gain.exponentialRampToValueAtTime(volume * 0.6, now + duration * 0.6);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc1.connect(noteGain);
    osc2.connect(noteGain);
    noteGain.connect(filter);
    filter.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration + 0.1);
    osc2.stop(now + duration + 0.1);
  }

  private scheduleNextArpeggio() {
    if (!this.isPlaying || !this.ctx) return;

    const chord = this.chordProgressions[this.chordIndex];
    this.chordIndex = (this.chordIndex + 1) % this.chordProgressions.length;

    // Play chord tones with subtle staggered timing (arpeggiated harp/piano feel)
    chord.forEach((freq, idx) => {
      const delay = idx * 0.7 + (Math.random() * 0.15);
      const duration = 5.5 + Math.random() * 1.5;
      const vol = (idx === 0 ? 0.06 : 0.04) + Math.random() * 0.02;
      this.playTone(freq, duration, delay, vol);
    });

    // Schedule next chord
    this.timer = setTimeout(() => {
      this.scheduleNextArpeggio();
    }, 4200);
  }

  public async start(): Promise<boolean> {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return false;

      if (this.ctx.state === "suspended") {
        await this.ctx.resume();
      }

      this.isPlaying = true;
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      // Smooth fade in over 2 seconds
      this.masterGain.gain.exponentialRampToValueAtTime(0.35, now + 2.0);

      this.scheduleNextArpeggio();
      return true;
    } catch {
      this.isPlaying = false;
      return false;
    }
  }

  public stop() {
    if (!this.ctx || !this.masterGain || !this.isPlaying) return;

    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    // Smooth fade out
    this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const ambientSound = new AmbientSoundEngine();
