import {
  AppLanguage,
  VoicePresetDefinition,
  VoicePresetId,
  getAmharicCallText,
  getAudioFilename,
  getBallLetter,
  getOromoCallText,
  getVoicePreset,
  normalizeVoicePreset,
} from '../../shared/bingo';

interface ActiveNodesHandle {
  source: AudioBufferSourceNode;
  stop: () => void;
}

class SoundEngine {
  private ctx: AudioContext | null = null;
  private clipAvailableCache = new Map<string, boolean>();
  private decodedCache = new Map<string, AudioBuffer>();
  private processedCache = new Map<string, AudioBuffer>();
  private activeVoiceHandle: ActiveNodesHandle | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private cachedVoices: SpeechSynthesisVoice[] = [];
  private activePlaybackId = 0;
  private currentVoicePresetId: VoicePresetId = 'classic_host';

  constructor() {
    if (typeof window !== 'undefined') {
      const unlock = () => {
        this.ensureContext();
      };
      window.addEventListener('pointerdown', unlock, { passive: true, once: true });
      window.addEventListener('touchstart', unlock, { passive: true, once: true });
      window.addEventListener('keydown', unlock, { passive: true, once: true });

      if ('speechSynthesis' in window) {
        this.refreshVoices();
        window.speechSynthesis.addEventListener?.('voiceschanged', () => {
          this.refreshVoices();
        });
      }
    }
  }

  public setVoicePreset(id: unknown) {
    this.currentVoicePresetId = normalizeVoicePreset(id);
  }

  public getVoicePresetId(): VoicePresetId {
    return this.currentVoicePresetId;
  }

  private refreshVoices(): SpeechSynthesisVoice[] {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
    const list = window.speechSynthesis.getVoices();
    if (list.length > 0) {
      this.cachedVoices = list;
    }
    return this.cachedVoices;
  }

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public stopAllVoice() {
    this.activePlaybackId += 1;
    this.stopCurrentVoice();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
  }

  private stopCurrentVoice() {
    if (this.activeVoiceHandle) {
      try {
        this.activeVoiceHandle.stop();
      } catch {
        // ignore
      }
      this.activeVoiceHandle = null;
    }
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {
        // ignore
      }
      this.currentAudio = null;
    }
  }

  public playBallPop() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = 'sine';
    clickOsc.frequency.setValueAtTime(320, now);
    clickOsc.frequency.exponentialRampToValueAtTime(620, now + 0.055);
    clickGain.gain.setValueAtTime(0.001, now);
    clickGain.gain.exponentialRampToValueAtTime(0.075, now + 0.012);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    clickOsc.connect(clickGain);
    clickGain.connect(ctx.destination);
    clickOsc.start(now);
    clickOsc.stop(now + 0.11);
  }

  public playDaub() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.065);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  public playCountdownTick() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(740, now);
    gain.gain.setValueAtTime(0.055, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  public playBingoFanfare() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
    const now = ctx.currentTime;
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = i === notes.length - 1 ? 'sine' : 'triangle';
      const t = now + i * 0.085;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.exponentialRampToValueAtTime(0.15, t + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.56);
    });
  }

  /**
   * Decouples tempo and pitch cleanly using SOLA (Synchronized Overlap-Add)
   * time-stretching by `stretch = pitch / tempo` so when subsequently played at
   * `playbackRate = pitch`, both exact tempo and exact pitch are preserved.
   */
  private getTransformedBuffer(
    ctx: AudioContext,
    path: string,
    srcBuffer: AudioBuffer,
    preset: VoicePresetDefinition
  ): AudioBuffer {
    const tempo = Math.min(1.6, Math.max(0.65, preset.tempo || 1));
    const pitch = Math.min(1.4, Math.max(0.68, preset.pitch || 1));
    if (Math.abs(tempo - pitch) < 0.04) {
      return srcBuffer;
    }

    const cacheKey = `${path}::${preset.id}`;
    const cached = this.processedCache.get(cacheKey);
    if (cached) return cached;

    const stretch = pitch / tempo;
    const sampleRate = srcBuffer.sampleRate;
    const srcLen = srcBuffer.length;
    const channels = srcBuffer.numberOfChannels;
    if (srcLen < Math.floor(sampleRate * 0.08)) {
      return srcBuffer;
    }

    const winSize = Math.max(512, Math.round(sampleRate * 0.042)); // ~42ms speech frame
    const halfWin = Math.floor(winSize / 2);
    const outHop = halfWin;
    const inHopExact = outHop / stretch;
    const maxSeek = Math.min(halfWin - 1, Math.round(sampleRate * 0.008));

    const outLen = Math.max(winSize, Math.round(srcLen * stretch));
    const outBuffer = ctx.createBuffer(channels, outLen, sampleRate);

    // Precompute symmetric Hann window
    const hann = new Float32Array(winSize);
    for (let i = 0; i < winSize; i++) {
      hann[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (winSize - 1)));
    }

    const refIn = srcBuffer.getChannelData(0);
    // Compute best input offset sequence once on channel 0 so stereo channels stay phase-locked
    const frameStarts: Array<{ inPos: number; outPos: number }> = [];
    let outPos = 0;
    let inPosFloat = 0;

    while (outPos + winSize <= outLen) {
      let bestIn = Math.min(Math.max(0, Math.round(inPosFloat)), Math.max(0, srcLen - winSize));
      if (outPos > 0 && maxSeek > 0) {
        const refOverlapStart = frameStarts[frameStarts.length - 1].inPos + outHop;
        if (refOverlapStart + halfWin < srcLen) {
          let bestCorr = -Infinity;
          let chosenOffset = 0;
          const baseIn = bestIn;
          for (let delta = -maxSeek; delta <= maxSeek; delta += 4) {
            const cand = baseIn + delta;
            if (cand < 0 || cand + halfWin >= srcLen) continue;
            let dot = 0;
            for (let k = 0; k < halfWin; k += 4) {
              dot += refIn[refOverlapStart + k] * refIn[cand + k];
            }
            if (dot > bestCorr) {
              bestCorr = dot;
              chosenOffset = delta;
            }
          }
          bestIn = Math.min(Math.max(0, baseIn + chosenOffset), Math.max(0, srcLen - winSize));
        }
      }
      frameStarts.push({ inPos: bestIn, outPos });
      outPos += outHop;
      inPosFloat += inHopExact;
    }

    const norm = new Float32Array(outLen);
    for (const f of frameStarts) {
      for (let i = 0; i < winSize; i++) {
        norm[f.outPos + i] += hann[i];
      }
    }

    for (let ch = 0; ch < channels; ch++) {
      const srcData = srcBuffer.getChannelData(ch);
      const dstData = outBuffer.getChannelData(ch);
      for (const f of frameStarts) {
        const ip = f.inPos;
        const op = f.outPos;
        for (let i = 0; i < winSize; i++) {
          dstData[op + i] += srcData[ip + i] * hann[i];
        }
      }
      for (let i = 0; i < outLen; i++) {
        if (norm[i] > 1e-4) {
          dstData[i] = Math.max(-1, Math.min(1, dstData[i] / norm[i]));
        }
      }
    }

    if (this.processedCache.size > 240) {
      const oldest = this.processedCache.keys().next().value;
      if (oldest) this.processedCache.delete(oldest);
    }
    this.processedCache.set(cacheKey, outBuffer);
    return outBuffer;
  }

  private createSoftSaturationCurve(drive: number): Float32Array<ArrayBuffer> {
    const samples = 256;
    const buffer = new ArrayBuffer(samples * 4);
    const curve = new Float32Array(buffer);
    const k = Math.max(0.01, drive * 18);
    const denom = Math.tanh(k);
    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1;
      curve[i] = Math.tanh(k * x) / denom;
    }
    return curve;
  }

  private playBufferWithPreset(
    ctx: AudioContext,
    rawBuffer: AudioBuffer,
    path: string,
    preset: VoicePresetDefinition
  ): ActiveNodesHandle {
    const buffer = this.getTransformedBuffer(ctx, path, rawBuffer, preset);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = Math.min(1.45, Math.max(0.68, preset.pitch || 1));

    const nodesToDisconnect: AudioNode[] = [source];
    let head: AudioNode = source;

    if (preset.highPassHz && preset.highPassHz > 20) {
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = preset.highPassHz;
      head.connect(hp);
      head = hp;
      nodesToDisconnect.push(hp);
    }

    if (preset.bassDb !== 0) {
      const lowShelf = ctx.createBiquadFilter();
      lowShelf.type = 'lowshelf';
      lowShelf.frequency.value = 190;
      lowShelf.gain.value = preset.bassDb;
      head.connect(lowShelf);
      head = lowShelf;
      nodesToDisconnect.push(lowShelf);
    }

    if (preset.midDb !== 0) {
      const midPeak = ctx.createBiquadFilter();
      midPeak.type = 'peaking';
      midPeak.frequency.value = preset.midHz || 1500;
      midPeak.Q.value = 1.15;
      midPeak.gain.value = preset.midDb;
      head.connect(midPeak);
      head = midPeak;
      nodesToDisconnect.push(midPeak);
    }

    if (preset.highDb !== 0) {
      const highShelf = ctx.createBiquadFilter();
      highShelf.type = 'highshelf';
      highShelf.frequency.value = 3400;
      highShelf.gain.value = preset.highDb;
      head.connect(highShelf);
      head = highShelf;
      nodesToDisconnect.push(highShelf);
    }

    if (preset.lowPassHz && preset.lowPassHz < 18000) {
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = preset.lowPassHz;
      head.connect(lp);
      head = lp;
      nodesToDisconnect.push(lp);
    }

    if (preset.drive > 0) {
      const shaper = ctx.createWaveShaper();
      shaper.curve = this.createSoftSaturationCurve(preset.drive);
      shaper.oversample = '2x';
      head.connect(shaper);
      head = shaper;
      nodesToDisconnect.push(shaper);
    }

    if (preset.compress) {
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -20;
      comp.knee.value = 14;
      comp.ratio.value = 5.5;
      comp.attack.value = 0.004;
      comp.release.value = 0.14;
      head.connect(comp);
      head = comp;
      nodesToDisconnect.push(comp);
    }

    const masterGain = ctx.createGain();
    // Compensate perceived loudness slightly for darker/whisper presets
    masterGain.gain.value = preset.id === 'whisper_tension' ? 0.85 : 1.05;
    nodesToDisconnect.push(masterGain);

    head.connect(masterGain);

    if (preset.echoDelayMs && preset.echoMix && preset.echoMix > 0) {
      const delay = ctx.createDelay(0.5);
      delay.delayTime.value = Math.min(0.45, Math.max(0.015, preset.echoDelayMs / 1000));
      const wetGain = ctx.createGain();
      wetGain.gain.value = Math.min(0.45, preset.echoMix);
      const fbGain = ctx.createGain();
      fbGain.gain.value = 0.18;

      head.connect(delay);
      delay.connect(fbGain);
      fbGain.connect(delay);
      delay.connect(wetGain);
      wetGain.connect(masterGain);
      nodesToDisconnect.push(delay, wetGain, fbGain);
    }

    masterGain.connect(ctx.destination);
    source.start(0);

    const handle: ActiveNodesHandle = {
      source,
      stop: () => {
        try {
          source.stop();
        } catch {
          // already stopped
        }
        for (const n of nodesToDisconnect) {
          try {
            n.disconnect();
          } catch {
            // ignore
          }
        }
      },
    };

    source.onended = () => {
      if (this.activeVoiceHandle === handle) {
        this.activeVoiceHandle = null;
      }
      for (const n of nodesToDisconnect) {
        try {
          n.disconnect();
        } catch {
          // ignore
        }
      }
    };

    return handle;
  }

  private async tryPlayClip(
    path: string,
    playbackId: number,
    preset: VoicePresetDefinition
  ): Promise<boolean> {
    if (this.clipAvailableCache.get(path) === false) return false;

    const ctx = this.ensureContext();
    if (ctx) {
      try {
        let buffer = this.decodedCache.get(path);
        if (!buffer) {
          const res = await fetch(path);
          if (!res.ok) {
            this.clipAvailableCache.set(path, false);
            return false;
          }
          const arr = await res.arrayBuffer();
          buffer = await ctx.decodeAudioData(arr);
          this.decodedCache.set(path, buffer);
          this.clipAvailableCache.set(path, true);
        }

        if (playbackId !== this.activePlaybackId) return true;
        if (ctx.state === 'suspended') {
          await ctx.resume().catch(() => {});
        }
        if (ctx.state === 'running') {
          this.stopCurrentVoice();
          this.activeVoiceHandle = this.playBufferWithPreset(ctx, buffer, path, preset);
          return true;
        }
      } catch {
        // Fall through to HTMLAudioElement fallback
      }
    }

    try {
      if (playbackId !== this.activePlaybackId) return true;
      this.stopCurrentVoice();
      const audio = new Audio(path);
      audio.playbackRate = Math.min(2.0, Math.max(0.55, preset.tempo || 1));
      this.currentAudio = audio;
      await audio.play();
      this.clipAvailableCache.set(path, true);
      return true;
    } catch {
      this.clipAvailableCache.set(path, false);
      return false;
    }
  }

  private pickVoiceForPreset(
    voices: SpeechSynthesisVoice[],
    prefix: string,
    preset: VoicePresetDefinition
  ): SpeechSynthesisVoice | undefined {
    const matching = voices.filter((v) => v.lang.toLowerCase().startsWith(prefix));
    if (matching.length === 0) return undefined;
    const isLikelyFemale = (name: string) =>
      /mekdes|ava|emma|aria|jenny|michelle|sonia|libby|maisie|samantha|victoria|zira|hazel|susan|heera|female/i.test(
        name
      );
    const isLikelyMale = (name: string) =>
      /ameha|muuse|andrew|brian|guy|christopher|eric|steffan|roger|daniel|ryan|thomas|david|mark|alex|male/i.test(
        name
      );

    const preferredPool =
      preset.preferMale === false
        ? matching.filter((v) => isLikelyFemale(v.name))
        : matching.filter((v) => !isLikelyFemale(v.name) || isLikelyMale(v.name));

    const pool = preferredPool.length > 0 ? preferredPool : matching;
    return pool[(preset.number - 1) % pool.length] || pool[0];
  }

  public async speakBall(num: number, lang: AppLanguage, presetOverride?: VoicePresetId): Promise<'clip' | 'tts' | 'none'> {
    const playbackId = ++this.activePlaybackId;
    const preset = getVoicePreset(presetOverride ?? this.currentVoicePresetId);
    const filename = getAudioFilename(num);
    if (filename) {
      if (await this.tryPlayClip(`/audio/${lang}/${filename}?v=3`, playbackId, preset)) return 'clip';
      if (lang === 'am' && (await this.tryPlayClip(`/audio/${filename}?v=3`, playbackId, preset))) {
        return 'clip';
      }
    }

    if (playbackId !== this.activePlaybackId) return 'none';
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return 'none';
    try {
      window.speechSynthesis.cancel();
      const voices = this.refreshVoices();
      const letter = getBallLetter(num);
      let text = `${letter}, ${num}`;
      let voice = this.pickVoiceForPreset(voices, 'en', preset);
      let langTag = voice?.lang || 'en-US';

      if (lang === 'am') {
        const am = getAmharicCallText(num);
        const amVoice = this.pickVoiceForPreset(voices, 'am', preset);
        if (amVoice) {
          text = am.native.replace(' ', '፣ ');
          voice = amVoice;
          langTag = amVoice.lang;
        } else {
          text = am.phonetic;
          langTag = 'am-ET';
        }
      } else if (lang === 'om') {
        const om = getOromoCallText(num);
        const omVoice =
          this.pickVoiceForPreset(voices, 'om', preset) ||
          this.pickVoiceForPreset(voices, 'so', preset);
        if (omVoice) {
          text = om.native.replace(' ', ', ');
          voice = omVoice;
          langTag = omVoice.lang;
        } else {
          text = om.phonetic;
          langTag = 'om-ET';
        }
      }

      const utter = new SpeechSynthesisUtterance(text);
      if (voice) utter.voice = voice;
      utter.lang = langTag;
      utter.rate = Math.min(1.75, Math.max(0.65, preset.tempo));
      utter.pitch = Math.min(1.6, Math.max(0.55, preset.pitch));
      utter.volume = preset.id === 'whisper_tension' ? 0.8 : 0.98;
      window.speechSynthesis.speak(utter);
      return 'tts';
    } catch {
      return 'none';
    }
  }

  public async speakWinner(
    _winnerName: string,
    _prizeAmount: number,
    lang: AppLanguage,
    presetOverride?: VoicePresetId
  ): Promise<'clip' | 'tts' | 'none'> {
    const playbackId = ++this.activePlaybackId;
    const preset = getVoicePreset(presetOverride ?? this.currentVoicePresetId);
    if (await this.tryPlayClip(`/audio/${lang}/bingo.mp3?v=3`, playbackId, preset)) return 'clip';
    if (playbackId !== this.activePlaybackId) return 'none';
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return 'none';
    try {
      window.speechSynthesis.cancel();
      const voices = this.refreshVoices();
      const voice =
        this.pickVoiceForPreset(voices, lang, preset) ||
        this.pickVoiceForPreset(voices, 'en', preset);
      const utter = new SpeechSynthesisUtterance(
        lang === 'am' ? 'ቢንጎ! አሸናፊ አለን!' : lang === 'om' ? 'Biingoo! Moo’ataan argameera!' : 'Bingo! We have a winner!'
      );
      if (voice) utter.voice = voice;
      utter.lang = voice?.lang || 'en-US';
      utter.rate = Math.min(1.75, Math.max(0.65, preset.tempo));
      utter.pitch = Math.min(1.6, Math.max(0.55, preset.pitch));
      utter.volume = 0.98;
      window.speechSynthesis.speak(utter);
      return 'tts';
    } catch {
      return 'none';
    }
  }

  public async previewVoice(
    presetId: VoicePresetId,
    lang: AppLanguage,
    mode: 'ball' | 'winner' = 'ball',
    sampleNum = 24
  ): Promise<'clip' | 'tts' | 'none'> {
    if (mode === 'winner') {
      return this.speakWinner('Sample Winner', 500, lang, presetId);
    }
    return this.speakBall(sampleNum, lang, presetId);
  }
}

export const soundEngine = new SoundEngine();
