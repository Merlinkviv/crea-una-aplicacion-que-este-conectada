/**
 * InstaViral AI - High Performance 9:16 Vertical Video & Audio Engine
 * Renders generative dynamic scenes at 60fps on HTML5 Canvas
 * Synchronizes procedural Lo-Fi / Synthwave audio tracks + Web Speech API voiceover
 * Generates dynamic Hormozi/Karaoke-style animated subtitles word by word
 */

export class VideoRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    this.isPlaying = false;
    this.currentTime = 0;
    this.duration = 15; // default 15s reel
    this.currentReel = null;
    this.animationFrameId = null;
    this.lastTimestamp = null;
    this.audioContext = null;
    this.bgMusicPlaying = false;
    this.musicGain = null;
    this.activeOscillators = [];
    this.voiceUtterance = null;
    this.onTimeUpdate = null;
    this.onEnded = null;

    // Generative particles for visual themes
    this.particles = [];
    this.initParticles(80);
  }

  initParticles(count) {
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 1.5,
        speedY: (Math.random() - 0.5) * 1.5 - 0.5,
        color: Math.random() > 0.5 ? '#FD1D1D' : '#833AB4',
        opacity: Math.random() * 0.7 + 0.3,
        pulseSpeed: Math.random() * 0.05 + 0.02,
        pulseOffset: Math.random() * Math.PI * 2
      });
    }
  }

  loadReel(reel) {
    this.currentReel = reel;
    this.currentTime = 0;
    this.duration = reel.duration || 16;
    this.stopAudio();
    this.renderFrame(0);
  }

  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.lastTimestamp = performance.now();
    this.startAudio();
    this.loop(this.lastTimestamp);
  }

  pause() {
    this.isPlaying = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.pauseAudio();
  }

  seek(time) {
    this.currentTime = Math.max(0, Math.min(time, this.duration));
    this.renderFrame(this.currentTime);
    if (this.isPlaying) {
      this.restartVoiceFrom(this.currentTime);
    }
    if (this.onTimeUpdate) {
      this.onTimeUpdate(this.currentTime, this.duration);
    }
  }

  loop(timestamp) {
    if (!this.isPlaying) return;
    const delta = (timestamp - this.lastTimestamp) / 1000;
    this.lastTimestamp = timestamp;

    this.currentTime += delta;
    if (this.currentTime >= this.duration) {
      this.currentTime = this.duration;
      this.isPlaying = false;
      this.stopAudio();
      this.renderFrame(this.currentTime);
      if (this.onEnded) this.onEnded();
      return;
    }

    this.renderFrame(this.currentTime);

    if (this.onTimeUpdate) {
      this.onTimeUpdate(this.currentTime, this.duration);
    }

    this.animationFrameId = requestAnimationFrame((t) => this.loop(t));
  }

  // Visual Themes Rendering
  renderFrame(time) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const theme = (this.currentReel && this.currentReel.theme) || 'cyberpunk';

    ctx.clearRect(0, 0, w, h);

    // 1. Draw Background Theme
    switch (theme) {
      case 'luxury-gold':
        this.drawLuxuryGold(ctx, w, h, time);
        break;
      case 'synthwave':
        this.drawSynthwave(ctx, w, h, time);
        break;
      case 'minimal-bold':
        this.drawMinimalBold(ctx, w, h, time);
        break;
      case 'emerald-matrix':
        this.drawEmeraldMatrix(ctx, w, h, time);
        break;
      case 'cyberpunk':
      default:
        this.drawCyberpunk(ctx, w, h, time);
        break;
    }

    // 2. Dynamic particles
    this.drawParticles(ctx, w, h, time);

    // 3. Audio visualizer wave bar overlay (at bottom-middle)
    this.drawVisualizerWaves(ctx, w, h, time);

    // 4. Kinetic Subtitles / Hooks
    if (this.currentReel) {
      this.drawKineticSubtitles(ctx, w, h, time);
    }

    // 5. Safe-Zone subtle guides (optional or Instagram header gradient)
    this.drawInstagramVignette(ctx, w, h);
  }

  drawCyberpunk(ctx, w, h, time) {
    // Dark cyber gradient with pulsing neon accents
    const grad = ctx.createLinearGradient(0, 0, w, h);
    const pulse = Math.sin(time * 2) * 0.1;
    grad.addColorStop(0, '#090814');
    grad.addColorStop(0.5, '#130d2e');
    grad.addColorStop(1, '#07050d');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Cyber grid lines
    ctx.save();
    ctx.strokeStyle = `rgba(131, 58, 180, ${0.15 + pulse})`;
    ctx.lineWidth = 1.5;
    const gridSpacing = 48;
    const offset = (time * 30) % gridSpacing;

    for (let x = 0; x < w; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = offset; y < h; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Glowing geometric shapes
    const glowX = w / 2 + Math.sin(time * 1.5) * 80;
    const glowY = h / 3 + Math.cos(time * 1.2) * 60;
    const radial = ctx.createRadialGradient(glowX, glowY, 10, glowX, glowY, 180);
    radial.addColorStop(0, 'rgba(253, 29, 29, 0.28)');
    radial.addColorStop(0.5, 'rgba(131, 58, 180, 0.15)');
    radial.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = radial;
    ctx.beginPath();
    ctx.arc(glowX, glowY, 180, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawLuxuryGold(ctx, w, h, time) {
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#0b0906');
    grad.addColorStop(0.5, '#1a140a');
    grad.addColorStop(1, '#080603');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Floating gold rings
    ctx.save();
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      const radius = 90 + i * 55 + Math.sin(time * 1.5 + i) * 15;
      ctx.strokeStyle = `rgba(247, 177, 55, ${0.18 - i * 0.04})`;
      ctx.beginPath();
      ctx.arc(w / 2, h * 0.38, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawSynthwave(ctx, w, h, time) {
    // Synthwave purple-pink sunset
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#12042b');
    grad.addColorStop(0.65, '#3b0b54');
    grad.addColorStop(1, '#ff3366');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Digital Sun
    const sunY = h * 0.42;
    const sunGrad = ctx.createRadialGradient(w / 2, sunY, 10, w / 2, sunY, 110);
    sunGrad.addColorStop(0, '#ffe600');
    sunGrad.addColorStop(0.7, '#ff3366');
    sunGrad.addColorStop(1, 'rgba(255,51,102,0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(w / 2, sunY, 110, 0, Math.PI * 2);
    ctx.fill();

    // Perspective wireframe grid floor
    ctx.save();
    const horizon = h * 0.52;
    ctx.strokeStyle = 'rgba(0, 247, 255, 0.35)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 12; i++) {
      const x = (w / 11) * i;
      ctx.beginPath();
      ctx.moveTo(w / 2, horizon);
      ctx.lineTo((x - w / 2) * 3 + w / 2, h);
      ctx.stroke();
    }
    const offset = (time * 50) % 25;
    for (let y = horizon; y < h; y += (y - horizon + 10) * 0.3 + offset) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawEmeraldMatrix(ctx, w, h, time) {
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#021008');
    grad.addColorStop(0.5, '#052414');
    grad.addColorStop(1, '#010904');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Digital streaming rain
    ctx.save();
    ctx.font = '13px monospace';
    ctx.fillStyle = 'rgba(0, 255, 136, 0.28)';
    const cols = Math.floor(w / 22);
    for (let c = 0; c < cols; c++) {
      const speed = (c % 5 + 1) * 60;
      const yPos = (time * speed + c * 80) % h;
      const char = String.fromCharCode(0x30A0 + (Math.floor(time * 10 + c) % 90));
      ctx.fillText(char, c * 22 + 6, yPos);
    }
    ctx.restore();
  }

  drawMinimalBold(ctx, w, h, time) {
    // Ultra-clean high contrast dark slate with subtle kinetic dots
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);

    const pulse = (Math.sin(time * 3) + 1) / 2;
    const accentGrad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, 240);
    accentGrad.addColorStop(0, `rgba(59, 130, 246, ${0.15 + pulse * 0.1})`);
    accentGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = accentGrad;
    ctx.fillRect(0, 0, w, h);
  }

  drawParticles(ctx, w, h, time) {
    ctx.save();
    for (const p of this.particles) {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      const alpha = p.opacity * (0.6 + 0.4 * Math.sin(time * 3 + p.pulseOffset));
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  drawVisualizerWaves(ctx, w, h, time) {
    ctx.save();
    const bars = 24;
    const barWidth = 4;
    const gap = 3;
    const totalW = bars * (barWidth + gap);
    const startX = (w - totalW) / 2;
    const baseY = h * 0.88;

    for (let i = 0; i < bars; i++) {
      const height = Math.abs(Math.sin(time * 6 + i * 0.4)) * 26 + 6;
      const grad = ctx.createLinearGradient(0, baseY, 0, baseY - height);
      grad.addColorStop(0, '#FD1D1D');
      grad.addColorStop(1, '#F77737');
      ctx.fillStyle = grad;
      ctx.fillRect(startX + i * (barWidth + gap), baseY - height, barWidth, height);
    }
    ctx.restore();
  }

  drawInstagramVignette(ctx, w, h) {
    // Dark gradient at the top (for clock & icons) and bottom (for captions/buttons)
    ctx.save();
    const topGrad = ctx.createLinearGradient(0, 0, 0, 110);
    topGrad.addColorStop(0, 'rgba(0,0,0,0.65)');
    topGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = topGrad;
    ctx.fillRect(0, 0, w, 110);

    const btmGrad = ctx.createLinearGradient(0, h - 160, 0, h);
    btmGrad.addColorStop(0, 'rgba(0,0,0,0)');
    btmGrad.addColorStop(1, 'rgba(0,0,0,0.85)');
    ctx.fillStyle = btmGrad;
    ctx.fillRect(0, h - 160, w, 160);
    ctx.restore();
  }

  drawKineticSubtitles(ctx, w, h, time) {
    const reel = this.currentReel;
    if (!reel) return;

    const style = reel.subtitleStyle || 'hormozi'; // 'hormozi' | 'neon-green' | 'bold-white' | 'karaoke'
    const scriptSegments = reel.segments || this.generateDefaultSegments(reel.script, this.duration);

    // Find active segment
    const activeSeg = scriptSegments.find(s => time >= s.start && time < s.end);
    if (!activeSeg) return;

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Hook phase (first 3 seconds) has dramatic big badge
    if (time < 3.2) {
      // Top hook pill
      ctx.save();
      ctx.fillStyle = '#ff0055';
      const badgeText = reel.hookBadge || '🔥 VIRAL HOOK';
      ctx.font = 'bold 12px sans-serif';
      const bWidth = ctx.measureText(badgeText).width + 24;
      ctx.beginPath();
      ctx.roundRect((w - bWidth) / 2, h * 0.18, bWidth, 26, 13);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillText(badgeText, w / 2, h * 0.18 + 13);
      ctx.restore();
    }

    // Subtitle positioning in upper-center (Reels safe zone: between 25% and 65% of screen)
    const centerY = h * 0.44;

    const words = activeSeg.text.split(' ');
    const segDuration = activeSeg.end - activeSeg.start;
    const progressInSeg = (time - activeSeg.start) / segDuration;
    const activeWordIdx = Math.min(words.length - 1, Math.floor(progressInSeg * words.length));

    // Measure line wrapping
    ctx.font = '900 24px "Space Grotesk", "Plus Jakarta Sans", sans-serif';
    const lines = [];
    let currentLine = [];

    for (let i = 0; i < words.length; i++) {
      const testLine = [...currentLine, words[i]].join(' ');
      if (ctx.measureText(testLine).width > w - 48 && currentLine.length > 0) {
        lines.push(currentLine);
        currentLine = [words[i]];
      } else {
        currentLine.push(words[i]);
      }
    }
    if (currentLine.length > 0) lines.push(currentLine);

    const lineHeight = 38;
    const startY = centerY - ((lines.length - 1) * lineHeight) / 2;

    let globalWordCounter = 0;

    lines.forEach((lineWords, lineIdx) => {
      const lineY = startY + lineIdx * lineHeight;
      const fullLineText = lineWords.join(' ');
      const lineWidth = ctx.measureText(fullLineText).width;
      let curX = (w - lineWidth) / 2;

      lineWords.forEach((word) => {
        const wordWidth = ctx.measureText(word + ' ').width;
        const isCurrentWord = globalWordCounter === activeWordIdx;
        const wordCenterX = curX + wordWidth / 2;

        if (style === 'hormozi') {
          // Alex Hormozi style: High contrast black/yellow box + scale bounce
          if (isCurrentWord) {
            ctx.save();
            ctx.fillStyle = '#ffe600'; // energetic yellow
            const boxPadding = 6;
            ctx.beginPath();
            ctx.roundRect(curX - 2, lineY - 14, wordWidth + 4, 30, 5);
            ctx.fill();

            ctx.fillStyle = '#000000';
            ctx.fillText(word, wordCenterX - ctx.measureText(' ').width / 2, lineY);
            ctx.restore();
          } else {
            // White text with strong black outline
            ctx.save();
            ctx.lineWidth = 5;
            ctx.strokeStyle = '#000000';
            ctx.strokeText(word, wordCenterX - ctx.measureText(' ').width / 2, lineY);
            ctx.fillStyle = '#ffffff';
            ctx.fillText(word, wordCenterX - ctx.measureText(' ').width / 2, lineY);
            ctx.restore();
          }
        } else if (style === 'neon-green') {
          ctx.save();
          if (isCurrentWord) {
            ctx.shadowColor = '#00ff88';
            ctx.shadowBlur = 18;
            ctx.fillStyle = '#00ff88';
          } else {
            ctx.fillStyle = '#ffffff';
          }
          ctx.lineWidth = 4;
          ctx.strokeStyle = '#000000';
          ctx.strokeText(word, wordCenterX - ctx.measureText(' ').width / 2, lineY);
          ctx.fillText(word, wordCenterX - ctx.measureText(' ').width / 2, lineY);
          ctx.restore();
        } else {
          // Modern bold white
          ctx.save();
          if (isCurrentWord) {
            ctx.fillStyle = '#38bdf8';
          } else {
            ctx.fillStyle = '#ffffff';
          }
          ctx.lineWidth = 4;
          ctx.strokeStyle = 'rgba(0,0,0,0.8)';
          ctx.strokeText(word, wordCenterX - ctx.measureText(' ').width / 2, lineY);
          ctx.fillText(word, wordCenterX - ctx.measureText(' ').width / 2, lineY);
          ctx.restore();
        }

        curX += wordWidth;
        globalWordCounter++;
      });
    });

    ctx.restore();
  }

  generateDefaultSegments(scriptText, totalDuration) {
    if (!scriptText) return [];
    // Split into readable chunks of 4-6 words
    const words = scriptText.trim().split(/\s+/);
    const chunkSize = 5;
    const chunks = [];
    for (let i = 0; i < words.length; i += chunkSize) {
      chunks.push(words.slice(i, i + chunkSize).join(' '));
    }
    const chunkDuration = totalDuration / chunks.length;
    return chunks.map((chunk, idx) => ({
      start: idx * chunkDuration,
      end: (idx + 1) * chunkDuration,
      text: chunk
    }));
  }

  // Audio Engine: Procedural Synth Lo-Fi Beats & Web Speech API Voiceover
  initAudioContext() {
    if (!this.audioContext) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioContext = new AudioContextClass();
      }
    }
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  startAudio() {
    this.initAudioContext();
    this.startBackgroundMusic();
    this.startVoiceover();
  }

  startBackgroundMusic() {
    if (!this.audioContext || this.bgMusicPlaying) return;
    this.bgMusicPlaying = true;

    // Procedural Lo-Fi chord sequence with gentle filter
    const ctx = this.audioContext;
    this.musicGain = ctx.createGain();
    this.musicGain.gain.setValueAtTime(0.08, ctx.currentTime);
    this.musicGain.connect(ctx.destination);

    // Chords: Dm9, G13, Cmaj7, Am7 (classic viral Lo-Fi progression)
    const chords = [
      [293.66, 349.23, 440.0, 523.25], // Dm9
      [196.00, 246.94, 349.23, 440.0], // G
      [261.63, 329.63, 392.0, 493.88], // Cmaj7
      [220.00, 261.63, 329.63, 392.0]  // Am7
    ];

    const chordDuration = 3.75; // 4 chords = 15s loop

    this.activeOscillators = [];

    chords.forEach((chordFreqs, chordIndex) => {
      const startTime = ctx.currentTime + chordIndex * chordDuration;
      chordFreqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        // Soft envelope
        noteGain.gain.setValueAtTime(0.001, startTime);
        noteGain.gain.exponentialRampToValueAtTime(0.03, startTime + 0.3);
        noteGain.gain.exponentialRampToValueAtTime(0.015, startTime + chordDuration - 0.2);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + chordDuration);

        osc.connect(noteGain);
        noteGain.connect(this.musicGain);

        osc.start(startTime);
        osc.stop(startTime + chordDuration);
        this.activeOscillators.push(osc);
      });
    });
  }

  startVoiceover() {
    if (!('speechSynthesis' in window) || !this.currentReel) return;
    window.speechSynthesis.cancel();

    const script = this.currentReel.script || '';
    if (!script) return;

    this.voiceUtterance = new SpeechSynthesisUtterance(script);
    this.voiceUtterance.lang = 'es-ES';
    this.voiceUtterance.rate = 1.15; // upbeat, dynamic viral reel pacing
    this.voiceUtterance.pitch = 1.05;

    // Try finding natural Spanish voice if available
    const voices = window.speechSynthesis.getVoices();
    const esVoice = voices.find(v => v.lang.startsWith('es') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Monica') || v.name.includes('Jorge')));
    if (esVoice) {
      this.voiceUtterance.voice = esVoice;
    }

    // Voice ducking: Lower background music slightly while speaking
    this.voiceUtterance.onstart = () => {
      if (this.musicGain && this.audioContext) {
        this.musicGain.gain.setValueAtTime(0.04, this.audioContext.currentTime);
      }
    };
    this.voiceUtterance.onend = () => {
      if (this.musicGain && this.audioContext) {
        this.musicGain.gain.setValueAtTime(0.08, this.audioContext.currentTime);
      }
    };

    window.speechSynthesis.speak(this.voiceUtterance);
  }

  restartVoiceFrom(time) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (!this.isPlaying || !this.currentReel) return;

    // Approximate remaining script from current time
    const ratio = time / this.duration;
    const words = (this.currentReel.script || '').split(' ');
    const wordIdx = Math.floor(ratio * words.length);
    const remainingText = words.slice(wordIdx).join(' ');

    if (remainingText.trim()) {
      this.voiceUtterance = new SpeechSynthesisUtterance(remainingText);
      this.voiceUtterance.lang = 'es-ES';
      this.voiceUtterance.rate = 1.15;
      window.speechSynthesis.speak(this.voiceUtterance);
    }
  }

  pauseAudio() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
    this.stopOscillators();
  }

  stopAudio() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.stopOscillators();
  }

  stopOscillators() {
    this.activeOscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // already stopped
      }
    });
    this.activeOscillators = [];
    this.bgMusicPlaying = false;
  }
}
