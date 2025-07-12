export class AudioManager {
  private audioContext: AudioContext;
  private gainNode: GainNode;
  private musicGainNode: GainNode;
  private sfxGainNode: GainNode;
  private backgroundOscillators: OscillatorNode[] = [];
  private isEnabled = true;
  private musicVolume = 0.2;
  private sfxVolume = 0.3;

  constructor() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Master gain
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.value = 1.0;
      
      // Music gain
      this.musicGainNode = this.audioContext.createGain();
      this.musicGainNode.connect(this.gainNode);
      this.musicGainNode.gain.value = this.musicVolume;
      
      // SFX gain
      this.sfxGainNode = this.audioContext.createGain();
      this.sfxGainNode.connect(this.gainNode);
      this.sfxGainNode.gain.value = this.sfxVolume;
      
      this.createSpaceAmbient();
    } catch (error) {
      console.warn('Audio not supported:', error);
      this.isEnabled = false;
    }
  }

  private createSpaceAmbient() {
    if (!this.isEnabled || !this.audioContext) return;

    try {
      // Create deep space ambient layers
      const layers = [
        { freq: 30, type: 'sine' as OscillatorType, gain: 0.015, lfoFreq: 0.03 },
        { freq: 45, type: 'triangle' as OscillatorType, gain: 0.012, lfoFreq: 0.05 },
        { freq: 60, type: 'sine' as OscillatorType, gain: 0.010, lfoFreq: 0.04 },
        { freq: 90, type: 'sawtooth' as OscillatorType, gain: 0.008, lfoFreq: 0.07 }
      ];
      
      layers.forEach((layer, index) => {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        oscillator.frequency.value = layer.freq;
        oscillator.type = layer.type;
        
        filter.type = 'lowpass';
        filter.frequency.value = 200 + index * 50;
        filter.Q.value = 0.5;
        
        gainNode.gain.value = layer.gain;
        
        // LFO for subtle modulation
        const lfo = this.audioContext.createOscillator();
        const lfoGain = this.audioContext.createGain();
        lfo.frequency.value = layer.lfoFreq;
        lfoGain.gain.value = 0.3 + index * 0.1;
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.musicGainNode);
        
        lfo.connect(lfoGain);
        lfoGain.connect(oscillator.frequency);
        
        oscillator.start();
        lfo.start();
        
        this.backgroundOscillators.push(oscillator);
      });

      // Add ethereal high-frequency sparkles
      this.createEtherealLayer();
    } catch (error) {
      console.warn('Failed to create ambient audio:', error);
    }
  }

  private createEtherealLayer() {
    if (!this.isEnabled || !this.audioContext) return;

    const etherealFreqs = [220, 330, 440, 660];
    
    etherealFreqs.forEach((freq, index) => {
      try {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        oscillator.frequency.value = freq;
        oscillator.type = 'sine';
        
        filter.type = 'highpass';
        filter.frequency.value = 300;
        filter.Q.value = 1.0;
        
        gainNode.gain.value = 0;
        
        const sparkle = () => {
          if (!this.isEnabled || !this.audioContext) return;
          
          try {
            const now = this.audioContext.currentTime;
            const duration = 0.5 + Math.random() * 1;
            const maxGain = 0.002 + Math.random() * 0.001;
            
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(maxGain, now + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);
            
            setTimeout(sparkle, 2000 + Math.random() * 4000);
          } catch (error) {
            console.warn('Sparkle effect error:', error);
          }
        };
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.musicGainNode);
        
        oscillator.start();
        this.backgroundOscillators.push(oscillator);
        
        setTimeout(sparkle, Math.random() * 2000);
      } catch (error) {
        console.warn('Ethereal layer error:', error);
      }
    });
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.1) {
    if (!this.isEnabled || !this.audioContext) return;
    
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      const filter = this.audioContext.createBiquadFilter();
      
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.sfxGainNode);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      
      filter.type = 'lowpass';
      filter.frequency.value = frequency * 2;
      
      gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, this.audioContext.currentTime + duration);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (error) {
      console.warn('Tone playback error:', error);
    }
  }

  public playShoot() {
    this.playTone(800, 0.1, 'square', 0.02);
    setTimeout(() => this.playTone(1200, 0.05, 'sine', 0.015), 20);
  }

  public playMissile() {
    this.playTone(120, 0.3, 'sawtooth', 0.04);
    setTimeout(() => this.playTone(100, 0.2, 'triangle', 0.03), 100);
  }

  public playLaser() {
    this.playTone(1500, 0.12, 'sine', 0.03);
    setTimeout(() => this.playTone(1800, 0.08, 'square', 0.02), 40);
  }

  public playExplosion() {
    this.playTone(60, 0.4, 'sawtooth', 0.08);
    setTimeout(() => this.playTone(45, 0.3, 'square', 0.06), 50);
    setTimeout(() => this.playTone(30, 0.2, 'triangle', 0.04), 150);
  }

  public playPowerUp() {
    const notes = [262, 330, 392, 523, 659];
    notes.forEach((note, index) => {
      setTimeout(() => this.playTone(note, 0.12, 'sine', 0.04), index * 50);
    });
  }

  public playHit() {
    this.playTone(200, 0.15, 'sawtooth', 0.05);
    setTimeout(() => this.playTone(150, 0.1, 'square', 0.04), 60);
  }

  public playEnemyDestroyed() {
    this.playTone(300, 0.12, 'triangle', 0.05);
    setTimeout(() => this.playTone(250, 0.08, 'sine', 0.03), 60);
  }

  public playBossHit() {
    this.playTone(80, 0.5, 'sawtooth', 0.1);
    setTimeout(() => this.playTone(60, 0.3, 'square', 0.08), 150);
  }

  public playLevelComplete() {
    const melody = [262, 330, 392, 523, 659, 784, 1047];
    melody.forEach((note, index) => {
      setTimeout(() => this.playTone(note, 0.2, 'sine', 0.06), index * 100);
    });
  }

  public playBossSpawn() {
    this.playTone(40, 1.5, 'sawtooth', 0.08);
    setTimeout(() => this.playTone(35, 1, 'triangle', 0.06), 400);
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (this.gainNode) {
      this.gainNode.gain.value = enabled ? 1.0 : 0;
    }
    
    if (!enabled) {
      this.backgroundOscillators.forEach(osc => {
        try { osc.stop(); } catch (e) {}
      });
      this.backgroundOscillators = [];
    } else if (this.backgroundOscillators.length === 0) {
      this.createSpaceAmbient();
    }
  }

  public setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.musicGainNode) {
      this.musicGainNode.gain.value = this.musicVolume;
    }
  }

  public setSfxVolume(volume: number) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    if (this.sfxGainNode) {
      this.sfxGainNode.gain.value = this.sfxVolume;
    }
  }

  public dispose() {
    this.backgroundOscillators.forEach(osc => {
      try { osc.stop(); } catch (e) {}
    });
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}