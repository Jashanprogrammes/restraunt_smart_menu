/**
 * SAVOR Sound Effects Engine
 * Pure Web Audio API synthesis - zero external audio asset dependencies!
 * Muted by default per specification.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    // Check localStorage, default to true (muted by default)
    const saved = localStorage.getItem('savor_audio_muted');
    this.isMuted = saved !== null ? saved === 'true' : true;
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.init();
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem('savor_audio_muted', this.isMuted);
    } catch (e) {}
    if (!this.isMuted) {
      this.playTap();
    }
    return this.isMuted;
  }

  setMute(state) {
    this.isMuted = Boolean(state);
    try {
      localStorage.setItem('savor_audio_muted', this.isMuted);
    } catch (e) {}
  }

  _canPlay() {
    if (this.isMuted) return false;
    this.init();
    return this.ctx && this.ctx.state === 'running';
  }

  // Gentle UI tap / button click
  playTap() {
    if (!this._canPlay()) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {}
  }

  // Adding item to cart / favorite toggle
  playAddCart() {
    if (!this._canPlay()) return;
    try {
      const t = this.ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.06);

        gain.gain.setValueAtTime(0.09, t + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.06 + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t + idx * 0.06);
        osc.stop(t + idx * 0.06 + 0.12);
      });
    } catch (e) {}
  }

  // Card flip in memory match
  playCardFlip() {
    if (!this._canPlay()) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(640, this.ctx.currentTime + 0.07);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.07);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.07);
    } catch (e) {}
  }

  // Card match found
  playMatch() {
    if (!this._canPlay()) return;
    try {
      const t = this.ctx.currentTime;
      [440, 554.37, 659.25, 880].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + i * 0.07);

        gain.gain.setValueAtTime(0.08, t + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.07 + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t + i * 0.07);
        osc.stop(t + i * 0.07 + 0.18);
      });
    } catch (e) {}
  }

  // Burger ingredient drop (solid thud)
  playDrop() {
    if (!this._canPlay()) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(240, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch (e) {}
  }

  // Perfect drop in Burger Stack (reward chime)
  playPerfect() {
    if (!this._canPlay()) return;
    try {
      const t = this.ctx.currentTime;
      [587.33, 880, 1174.66].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + i * 0.05);

        gain.gain.setValueAtTime(0.09, t + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.05 + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t + i * 0.05);
        osc.stop(t + i * 0.05 + 0.22);
      });
    } catch (e) {}
  }

  // Catch food in arcade
  playCatch(isBonus = false) {
    if (!this._canPlay()) return;
    try {
      const baseFreq = isBonus ? 784 : 523.25;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {}
  }

  // Bomb/Chili hit in Catch The Food
  playBomb() {
    if (!this._canPlay()) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(70, this.ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch (e) {}
  }

  // Game over sound
  playGameOver() {
    if (!this._canPlay()) return;
    try {
      const t = this.ctx.currentTime;
      [349.23, 311.13, 261.63, 196].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + i * 0.12);

        gain.gain.setValueAtTime(0.09, t + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.12 + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t + i * 0.12);
        osc.stop(t + i * 0.12 + 0.2);
      });
    } catch (e) {}
  }

  // Victory fanfare
  playWin() {
    if (!this._canPlay()) return;
    try {
      const t = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + i * 0.09);

        gain.gain.setValueAtTime(0.1, t + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.09 + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t + i * 0.09);
        osc.stop(t + i * 0.09 + 0.28);
      });
    } catch (e) {}
  }
}

window.SavorAudio = new SoundEngine();
