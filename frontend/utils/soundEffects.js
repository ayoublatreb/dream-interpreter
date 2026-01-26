// Sound Effects Utility
// Creates interactive sound effects for buttons and interactions

class SoundEffects {
  constructor() {
    this.audioContext = null;
    this.enabled = true;
    this.volume = 0.3; // 30% volume
    this.init();
  }

  init() {
    try {
      // Check if window is available (client-side)
      if (typeof window === 'undefined') {
        this.enabled = false;
        return;
      }
      // Create AudioContext (works in modern browsers)
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.warn('AudioContext not supported:', error);
      this.enabled = false;
    }
  }

  // Play a tone with specific frequency and duration
  playTone(frequency, duration = 0.1, type = 'sine') {
    if (!this.enabled || !this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(this.volume, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (error) {
      console.warn('Error playing sound:', error);
    }
  }

  // Button click sound
  playClick() {
    this.playTone(800, 0.05, 'sine');
  }

  // Button hover sound (subtle)
  playHover() {
    this.playTone(600, 0.03, 'sine');
  }

  // Success sound
  playSuccess() {
    this.playTone(523.25, 0.1, 'sine'); // C5
    setTimeout(() => this.playTone(659.25, 0.1, 'sine'), 50); // E5
    setTimeout(() => this.playTone(783.99, 0.15, 'sine'), 100); // G5
  }

  // Start recording sound
  playRecordStart() {
    this.playTone(440, 0.15, 'sine'); // A4
    setTimeout(() => this.playTone(554.37, 0.15, 'sine'), 100); // C#5
  }

  // Stop recording sound
  playRecordStop() {
    this.playTone(554.37, 0.1, 'sine'); // C#5
    setTimeout(() => this.playTone(440, 0.15, 'sine'), 80); // A4
  }

  // Tab switch sound
  playTabSwitch() {
    this.playTone(600, 0.08, 'sine');
  }

  // Loading/processing sound
  playProcessing() {
    this.playTone(400, 0.2, 'triangle');
  }

  // Error sound
  playError() {
    this.playTone(200, 0.2, 'sawtooth');
    setTimeout(() => this.playTone(150, 0.2, 'sawtooth'), 100);
  }

  // Magic/sparkle sound
  playMagic() {
    this.playTone(880, 0.1, 'sine'); // A5
    setTimeout(() => this.playTone(1108.73, 0.1, 'sine'), 50); // C#6
    setTimeout(() => this.playTone(1318.51, 0.15, 'sine'), 100); // E6
  }

  // Enable/disable sounds
  setEnabled(enabled) {
    this.enabled = enabled;
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }
}

// Create singleton instance
const soundEffects = new SoundEffects();

export default soundEffects;