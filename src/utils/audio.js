// Web Audio API ambient noise generator & chimes (Zero external audio file dependencies)

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.ambientSource = null;
    this.ambientGain = null;
    this.currentAmbientType = null;
    this.isPlayingAmbient = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Pleasant notification bell chime when a Pomodoro timer ends or assignment is completed
  playChime(type = 'success') {
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      if (type === 'success') {
        // High harmonic ascending chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.12); // E5
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.25); // G5
        osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.38); // C6

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.35, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        osc.start(now);
        osc.stop(now + 1.25);
      } else if (type === 'bell') {
        // Soft meditative singing bowl bell
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

        osc.start(now);
        osc.stop(now + 2.5);
      }
    } catch (e) {
      console.warn('Audio playChime error:', e);
    }
  }

  // Synthesizes ambient noise: 'rain', 'white_noise', 'binaural_alpha'
  startAmbient(type = 'rain', volume = 0.2) {
    try {
      this.stopAmbient();
      this.init();
      if (!this.ctx) return;

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(volume, this.ctx.currentTime);
      this.ambientGain.connect(this.ctx.destination);
      this.currentAmbientType = type;

      const bufferSize = 2 * this.ctx.sampleRate;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);

      if (type === 'rain') {
        // Pink/brown filtered noise simulating rain
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.07;
          b6 = white * 0.115926;
        }
      } else if (type === 'white_noise') {
        for (let i = 0; i < bufferSize; i++) {
          output[i] = (Math.random() * 2 - 1) * 0.05;
        }
      } else if (type === 'binaural_alpha') {
        // 10 Hz alpha wave rhythm carrier
        for (let i = 0; i < bufferSize; i++) {
          const t = i / this.ctx.sampleRate;
          output[i] = Math.sin(2 * Math.PI * 220 * t) * Math.sin(2 * Math.PI * 10 * t) * 0.08;
        }
      }

      this.ambientSource = this.ctx.createBufferSource();
      this.ambientSource.buffer = buffer;
      this.ambientSource.loop = true;
      this.ambientSource.connect(this.ambientGain);
      this.ambientSource.start();
      this.isPlayingAmbient = true;
    } catch (e) {
      console.warn('startAmbient error:', e);
    }
  }

  setAmbientVolume(vol) {
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime);
    }
  }

  stopAmbient() {
    try {
      if (this.ambientSource) {
        this.ambientSource.stop();
        this.ambientSource.disconnect();
        this.ambientSource = null;
      }
      this.isPlayingAmbient = false;
      this.currentAmbientType = null;
    } catch (e) {
      console.warn('stopAmbient error:', e);
    }
  }
}

export const soundEngine = new SoundEngine();
