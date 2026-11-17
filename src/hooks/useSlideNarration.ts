import { useCallback, useEffect, useRef, useState } from 'react';

export type NarrationVoiceId = 'Kore' | 'Zephyr' | 'Charon' | 'Puck';
export type NarrationIntonationId = 'cercana' | 'natural' | 'periodistica' | 'pausada';
export type NarrationPaceId = 'lenta' | 'normal' | 'agil';
export type AudioEngineMode = 'gemini' | 'browser' | 'loading';

export const NARRATION_VOICES: { id: NarrationVoiceId; label: string }[] = [
  { id: 'Kore', label: 'Sofía (Neural)' },
  { id: 'Zephyr', label: 'Camila (Neural)' },
  { id: 'Charon', label: 'Martín (Neural)' },
  { id: 'Puck', label: 'Diego (Neural)' },
];

export const NARRATION_INTONATIONS: { id: NarrationIntonationId; label: string }[] = [
  { id: 'cercana', label: 'Tono: Cercano' },
  { id: 'natural', label: 'Tono: Natural' },
  { id: 'periodistica', label: 'Tono: Informativo' },
  { id: 'pausada', label: 'Tono: Pausado' },
];

// Minimal 1-sample silent PCM WAV to unlock HTMLAudioElement inside user gesture
const SILENT_WAV_DATA_URI =
  'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';

interface UseSlideNarrationOptions {
  script: string;
  slideKey: string;
  nextScript?: string;
  nextSlideKey?: string;
  onNarrationEnd?: () => void;
}

const blobUrlCache = new Map<string, string>();
const inFlightAudioFetches = new Map<string, Promise<string>>();

const STATIC_AUDIO_VERSION = '20261115b';
const VALID_STATIC_KORE_TRACKS = new Set([
  'ecosistema-0',
  'ecosistema-1',
  'ecosistema-2',
  'ecosistema-4',
  'ecosistema-5',
  'ecosistema-6',
  'ecosistema-7',
  'ecosistema-8',
  'benchmark-0',
  'benchmark-1',
  'benchmark-3',
  'benchmark-4',
  'benchmark-5',
]);

function hashScript(text: string): string {
  let h = 0;
  for (let i = 0; i < text.length; i++) {
    h = (Math.imul(31, h) + text.charCodeAt(i)) | 0;
  }
  return `${text.length}_${h >>> 0}`;
}

function rateToPace(rate: number): NarrationPaceId {
  if (rate <= 0.96) return 'lenta';
  if (rate >= 1.06) return 'agil';
  return 'normal';
}

function getCacheKey(
  voice: NarrationVoiceId,
  slideKey: string,
  text: string,
  intonation: NarrationIntonationId,
  pace: NarrationPaceId
) {
  return `${voice}::${intonation}::${pace}::${slideKey}::${hashScript(text)}`;
}

async function fetchStaticOrNeuralAudioUrl(
  slideKey: string,
  text: string,
  voiceName: NarrationVoiceId,
  intonation: NarrationIntonationId,
  pace: NarrationPaceId
): Promise<string> {
  const key = getCacheKey(voiceName, slideKey, text, intonation, pace);
  const existing = blobUrlCache.get(key);
  if (existing) return existing;

  const inflight = inFlightAudioFetches.get(key);
  if (inflight) return inflight;

  const promise = (async () => {
    // 1. Try pre-generated static Gemini Neural MP3 only for verified unchanged tracks
    if (
      voiceName === 'Kore' &&
      intonation === 'cercana' &&
      pace === 'normal' &&
      VALID_STATIC_KORE_TRACKS.has(slideKey)
    ) {
      try {
        const staticRes = await fetch(
          `/audio/${voiceName}/${slideKey}.mp3?v=${STATIC_AUDIO_VERSION}`,
          { cache: 'no-cache' }
        );
        const contentType = staticRes.headers.get('content-type')?.toLowerCase() ?? '';
        if (staticRes.ok && contentType.includes('audio')) {
          const mp3Blob = await staticRes.blob();
          if (mp3Blob.size > 1024) {
            const url = URL.createObjectURL(mp3Blob);
            blobUrlCache.set(key, url);
            return url;
          }
        }
      } catch {
        // Static track not present for this voice; proceed to live Gemini TTS API
      }
    }

    // 2. Dynamically synthesize via server-side Gemini 3.8 Neural TTS (with 1 retry on transient error)
    let res: Response | null = null;
    let apiContentType = '';
    let lastErrMsg = 'Servicio de voz no disponible.';

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slideKey, text, voiceName, intonation, pace }),
        });
        apiContentType = res.headers.get('content-type')?.toLowerCase() ?? '';
        if (res.ok && apiContentType.includes('audio')) {
          break;
        }
        lastErrMsg = `Servicio de voz no disponible (${res.status})`;
        if (apiContentType.includes('application/json')) {
          try {
            const errJson = (await res.json()) as { error?: string };
            if (errJson?.error) lastErrMsg = errJson.error;
          } catch {
            // Ignore JSON parse errors
          }
        }
        if (res.status === 400 || res.status === 401 || res.status === 403 || res.status === 503) {
          throw new Error(lastErrMsg);
        }
      } catch (err) {
        lastErrMsg = err instanceof Error ? err.message : lastErrMsg;
        if (attempt === 1) throw new Error(lastErrMsg);
      }
      await new Promise((r) => setTimeout(r, 650));
    }

    if (!res || !res.ok || !apiContentType.includes('audio')) {
      throw new Error(lastErrMsg);
    }

    const wavBlob = await res.blob();
    const url = URL.createObjectURL(wavBlob);
    blobUrlCache.set(key, url);
    return url;
  })();

  inFlightAudioFetches.set(key, promise);
  try {
    return await promise;
  } finally {
    inFlightAudioFetches.delete(key);
  }
}

function splitIntoShortSentences(text: string, maxLen = 130): string[] {
  const rawSentences = text
    .split(/(?<=[.!?…])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  for (const sentence of rawSentences) {
    if (sentence.length <= maxLen) {
      chunks.push(sentence);
    } else {
      const subParts = sentence.split(/(?<=[,;—])\s+/);
      let current = '';
      for (const part of subParts) {
        if ((current + ' ' + part).trim().length <= maxLen) {
          current = (current + ' ' + part).trim();
        } else {
          if (current) chunks.push(current);
          current = part;
        }
      }
      if (current) chunks.push(current);
    }
  }
  return chunks.length ? chunks : [text];
}

function pickBestSpanishBrowserVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!voices.length) return null;
  const spanishVoices = voices.filter((v) => v.lang.toLowerCase().startsWith('es'));
  if (!spanishVoices.length) return null;

  const scoreVoice = (v: SpeechSynthesisVoice) => {
    let score = 0;
    const lang = v.lang.toLowerCase();
    const name = v.name.toLowerCase();
    if (lang === 'es-cl') score += 50;
    else if (lang === 'es-419') score += 40;
    else if (lang === 'es-mx' || lang === 'es-es') score += 30;
    else score += 20;

    if (name.includes('natural') || name.includes('online')) score += 45;
    if (name.includes('google')) score += 35;
    if (name.includes('microsoft')) score += 25;
    return score;
  };

  return [...spanishVoices].sort((a, b) => scoreVoice(b) - scoreVoice(a))[0];
}

export function useSlideNarration({
  script,
  slideKey,
  nextScript,
  nextSlideKey,
  onNarrationEnd,
}: UseSlideNarrationOptions) {
  const browserTtsSupported =
    typeof window !== 'undefined' && 'speechSynthesis' in window;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [autoNarrate, setAutoNarrate] = useState(false);
  const [rate, setRate] = useState<number>(1.0);
  const [voice, setVoice] = useState<NarrationVoiceId>('Kore');
  const [intonation, setIntonation] = useState<NarrationIntonationId>('cercana');
  const [showCaption, setShowCaption] = useState(false);
  const [engineMode, setEngineMode] = useState<AudioEngineMode>('gemini');
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [browserVoices, setBrowserVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const unlockAudioElRef = useRef<HTMLAudioElement | null>(null);
  const unlockedRef = useRef<boolean>(false);
  const unlockPromiseRef = useRef<Promise<void> | null>(null);
  const watchdogRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<number | null>(null);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const fallbackStartTimerRef = useRef<number | null>(null);
  const activeSessionRef = useRef<number>(0);
  const pausedSlideKeyRef = useRef<string | null>(null);
  const pausedMetaRef = useRef<{
    voice: NarrationVoiceId;
    intonation: NarrationIntonationId;
    rate: number;
    engine: AudioEngineMode;
    chunkIdx: number;
  } | null>(null);
  const onNarrationEndRef = useRef(onNarrationEnd);
  const voiceRef = useRef<NarrationVoiceId>(voice);
  const rateRef = useRef<number>(rate);
  const intonationRef = useRef<NarrationIntonationId>(intonation);

  useEffect(() => {
    onNarrationEndRef.current = onNarrationEnd;
  }, [onNarrationEnd]);

  useEffect(() => {
    voiceRef.current = voice;
  }, [voice]);

  useEffect(() => {
    rateRef.current = rate;
  }, [rate]);

  useEffect(() => {
    intonationRef.current = intonation;
  }, [intonation]);

  useEffect(() => {
    voiceRef.current = voice;
  }, [voice]);

  useEffect(() => {
    rateRef.current = rate;
  }, [rate]);

  useEffect(() => {
    if (!browserTtsSupported) return;
    const load = () => {
      const list = window.speechSynthesis.getVoices();
      if (list.length) setBrowserVoices(list);
    };
    load();
    window.speechSynthesis.addEventListener('voiceschanged', load);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load);
  }, [browserTtsSupported]);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.setAttribute('playsinline', 'true');
    audioRef.current = audio;

    const unlockEl = new Audio();
    unlockEl.preload = 'auto';
    unlockEl.setAttribute('playsinline', 'true');
    unlockAudioElRef.current = unlockEl;

    return () => {
      audio.pause();
      audio.removeAttribute('src');
      audioRef.current = null;
      unlockEl.pause();
      unlockEl.removeAttribute('src');
      unlockAudioElRef.current = null;
    };
  }, []);

  const clearWatchdog = useCallback(() => {
    if (watchdogRef.current) {
      window.clearTimeout(watchdogRef.current);
      watchdogRef.current = null;
    }
  }, []);

  const clearProgressInterval = useCallback(() => {
    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const clearFallbackStartTimer = useCallback(() => {
    if (fallbackStartTimerRef.current) {
      window.clearTimeout(fallbackStartTimerRef.current);
      fallbackStartTimerRef.current = null;
    }
  }, []);

  // Synchronously unlock audio inside a user click/keypress without touching the playback element
  const unlockAudio = useCallback(() => {
    const unlockEl = unlockAudioElRef.current;
    if (!unlockEl || unlockedRef.current) return;
    if (unlockPromiseRef.current) return;

    unlockEl.src = SILENT_WAV_DATA_URI;
    unlockEl.volume = 0;
    const p = unlockEl
      .play()
      .then(() => {
        unlockEl.pause();
        unlockedRef.current = true;
        setAutoplayBlocked(false);
      })
      .catch(() => {
        // Silent unlock may be blocked before first real user interaction
      })
      .finally(() => {
        unlockPromiseRef.current = null;
      });
    unlockPromiseRef.current = p;
  }, []);

  const stop = useCallback(() => {
    activeSessionRef.current += 1;
    clearWatchdog();
    clearProgressInterval();
    clearFallbackStartTimer();
    activeUtteranceRef.current = null;
    pausedSlideKeyRef.current = null;
    pausedMetaRef.current = null;

    const audio = audioRef.current;
    if (audio) {
      audio.onended = null;
      audio.onerror = null;
      audio.onloadedmetadata = null;
      audio.pause();
      try {
        audio.currentTime = 0;
      } catch {
        // Ignore seek errors
      }
    }

    if (browserTtsSupported) {
      window.speechSynthesis.cancel();
    }

    setIsLoadingAudio(false);
    setIsSpeaking(false);
    setIsPaused(false);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
  }, [browserTtsSupported, clearFallbackStartTimer, clearProgressInterval, clearWatchdog]);

  const speakWithBrowserFallback = useCallback(
    (sessionId: number, textToSpeak: string, playbackRate: number, startChunkIdx = 0) => {
      if (!browserTtsSupported || !textToSpeak || activeSessionRef.current !== sessionId) {
        if (activeSessionRef.current === sessionId) {
          setIsSpeaking(false);
          setIsPaused(false);
          onNarrationEndRef.current?.();
        }
        return;
      }

      setEngineMode('browser');
      setIsSpeaking(true);
      setIsPaused(false);
      setShowCaption(true);

      const chunks = splitIntoShortSentences(textToSpeak, 130);
      const liveVoices = window.speechSynthesis.getVoices();
      const best = pickBestSpanishBrowserVoice(liveVoices.length ? liveVoices : browserVoices);
      let chunkIdx = Math.max(0, Math.min(chunks.length - 1, startChunkIdx));
      let chunkStartedAt = performance.now();
      let chunkEstMs = 4000;
      const totalEstSec = Math.max(
        4,
        Math.round((textToSpeak.length / 13) / Math.max(0.75, playbackRate))
      );
      setDuration(totalEstSec);

      clearProgressInterval();
      progressIntervalRef.current = window.setInterval(() => {
        if (activeSessionRef.current !== sessionId) return;
        const elapsed = performance.now() - chunkStartedAt;
        const intraChunk = Math.min(0.95, elapsed / Math.max(1000, chunkEstMs));
        const pct = Math.min(1, (chunkIdx + intraChunk) / Math.max(1, chunks.length));
        setProgress(pct);
        setCurrentTime(pct * totalEstSec);
        if (pausedMetaRef.current) {
          pausedMetaRef.current.chunkIdx = chunkIdx;
        }
      }, 140);

      const finishChunk = () => {
        if (activeSessionRef.current !== sessionId) return;
        clearWatchdog();
        activeUtteranceRef.current = null;
        chunkIdx += 1;
        if (chunkIdx < chunks.length) {
          speakNextChunk();
        } else {
          clearProgressInterval();
          setProgress(1);
          setCurrentTime(totalEstSec);
          setIsSpeaking(false);
          setIsPaused(false);
          pausedSlideKeyRef.current = null;
          pausedMetaRef.current = null;
          onNarrationEndRef.current?.();
        }
      };

      const speakNextChunk = () => {
        if (activeSessionRef.current !== sessionId) return;
        const chunkText = chunks[chunkIdx];
        const utterance = new SpeechSynthesisUtterance(chunkText);
        utterance.lang = best?.lang || 'es-CL';
        if (best) utterance.voice = best;
        utterance.rate = Math.max(0.88, Math.min(1.06, playbackRate * 0.96));
        utterance.pitch = 1.04;

        // Keep strong ref to avoid GC dropping onend in Chrome/Safari mobile
        activeUtteranceRef.current = utterance;

        chunkStartedAt = performance.now();
        chunkEstMs = Math.max(1800, Math.round((chunkText.length / 13) * 1000 / playbackRate));

        let settled = false;
        const settle = () => {
          if (settled) return;
          settled = true;
          finishChunk();
        };

        utterance.onend = settle;
        utterance.onerror = settle;

        const estimatedMs = Math.max(4500, Math.round((chunkText.length / 11) * 1000 / playbackRate) + 4000);
        clearWatchdog();
        watchdogRef.current = window.setTimeout(() => {
          if (activeSessionRef.current === sessionId) {
            window.speechSynthesis.cancel();
            settle();
          }
        }, estimatedMs);

        window.speechSynthesis.speak(utterance);
      };

      window.speechSynthesis.cancel();
      clearFallbackStartTimer();
      // Small delay after cancel() avoids Chrome dropping the next speak() call silently
      fallbackStartTimerRef.current = window.setTimeout(() => {
        if (activeSessionRef.current === sessionId) {
          speakNextChunk();
        }
      }, 45);
    },
    [browserTtsSupported, browserVoices, clearFallbackStartTimer, clearProgressInterval, clearWatchdog]
  );

  const speakCurrent = useCallback(
    async (
      customRate?: number,
      customVoice?: NarrationVoiceId,
      customIntonation?: NarrationIntonationId
    ) => {
      if (!script) return;

      unlockAudio();
      stop();
      const sessionId = activeSessionRef.current;
      const targetVoice = customVoice ?? voiceRef.current;
      const targetRate = customRate ?? rateRef.current;
      const targetIntonation = customIntonation ?? intonationRef.current;
      const targetPace = rateToPace(targetRate);

      setErrorNotice(null);
      setAutoplayBlocked(false);
      setShowCaption(true);

      const cacheKey = getCacheKey(targetVoice, slideKey, script, targetIntonation, targetPace);
      const isCached = blobUrlCache.has(cacheKey);
      if (!isCached) {
        setIsLoadingAudio(true);
        setEngineMode('loading');
      }

      try {
        if (unlockPromiseRef.current) {
          await unlockPromiseRef.current;
        }
        const audioUrl = await fetchStaticOrNeuralAudioUrl(
          slideKey,
          script,
          targetVoice,
          targetIntonation,
          targetPace
        );
        if (activeSessionRef.current !== sessionId) return;

        // Pre-fetch next slide/chapter gently after current track begins playing
        if (nextSlideKey && nextScript) {
          window.setTimeout(() => {
            if (activeSessionRef.current === sessionId) {
              fetchStaticOrNeuralAudioUrl(
                nextSlideKey,
                nextScript,
                targetVoice,
                targetIntonation,
                targetPace
              ).catch(() => {});
            }
          }, 1500);
        }

        const audio = audioRef.current;
        if (!audio) return;

        setIsLoadingAudio(false);
        setEngineMode('gemini');

        const isStaticTrack =
          targetVoice === 'Kore' &&
          targetIntonation === 'cercana' &&
          targetPace === 'normal' &&
          VALID_STATIC_KORE_TRACKS.has(slideKey);
        const effectivePlaybackRate = isStaticTrack ? targetRate : 1.0;

        const finishAudio = () => {
          if (activeSessionRef.current === sessionId) {
            clearWatchdog();
            clearProgressInterval();
            const finalDur =
              Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 0;
            setProgress(1);
            if (finalDur > 0) {
              setDuration(finalDur);
              setCurrentTime(finalDur);
            }
            setIsSpeaking(false);
            setIsPaused(false);
            pausedSlideKeyRef.current = null;
            pausedMetaRef.current = null;
            onNarrationEndRef.current?.();
          }
        };

        const armDurationWatchdog = () => {
          if (activeSessionRef.current !== sessionId) return;
          clearWatchdog();
          const hasDur = Number.isFinite(audio.duration) && audio.duration > 0;
          if (hasDur) {
            setDuration(audio.duration);
          }
          const remainingSec = hasDur
            ? Math.max(0.5, audio.duration - (audio.currentTime || 0))
            : Math.max(18, Math.round((script.length / 11) / targetRate) + 4);
          const safeMs = Math.round(((remainingSec / effectivePlaybackRate) + 4) * 1000);
          watchdogRef.current = window.setTimeout(finishAudio, safeMs);
        };

        // Bind event listeners BEFORE assigning audio.src so cached blob URLs never miss metadata events
        audio.onloadedmetadata = armDurationWatchdog;
        audio.onended = finishAudio;
        audio.onerror = () => {
          if (activeSessionRef.current === sessionId) {
            clearWatchdog();
            clearProgressInterval();
            setIsSpeaking(false);
            setIsLoadingAudio(false);
            speakWithBrowserFallback(sessionId, script, targetRate);
          }
        };

        audio.volume = 1;
        audio.src = audioUrl;
        audio.playbackRate = effectivePlaybackRate;
        audio.load();
        armDurationWatchdog();

        clearProgressInterval();
        setProgress(0);
        setCurrentTime(0);
        setDuration(0);
        setIsPaused(false);
        pausedSlideKeyRef.current = slideKey;
        pausedMetaRef.current = {
          voice: targetVoice,
          intonation: targetIntonation,
          rate: targetRate,
          engine: 'gemini',
          chunkIdx: 0,
        };

        progressIntervalRef.current = window.setInterval(() => {
          if (activeSessionRef.current !== sessionId) return;
          if (Number.isFinite(audio.duration) && audio.duration > 0) {
            setDuration(audio.duration);
            setCurrentTime(audio.currentTime);
            setProgress(Math.min(1, Math.max(0, audio.currentTime / audio.duration)));
          }
        }, 120);

        setIsSpeaking(true);
        await audio.play();
        if (activeSessionRef.current !== sessionId) return;
        audio.playbackRate = effectivePlaybackRate;
        armDurationWatchdog();
        unlockedRef.current = true;
      } catch (err) {
        if (activeSessionRef.current !== sessionId) return;
        clearWatchdog();
        clearProgressInterval();
        setIsLoadingAudio(false);

        const errName = (err as { name?: string })?.name || '';
        const errMsg = err instanceof Error ? err.message : String(err);

        // If browser blocked autoplay (NotAllowedError), keep neural audio and prompt 1 click instead of robotic fallback
        if (errName === 'NotAllowedError' || /not allowed|user didn't interact/i.test(errMsg)) {
          setIsSpeaking(false);
          setEngineMode('gemini');
          setAutoplayBlocked(true);
          return;
        }

        // Ignore transient AbortError only if session already changed; otherwise fall back cleanly
        setErrorNotice(errMsg);
        speakWithBrowserFallback(sessionId, script, targetRate);
      }
    },
    [clearProgressInterval, clearWatchdog, nextScript, nextSlideKey, script, slideKey, speakWithBrowserFallback, stop, unlockAudio]
  );

  const pause = useCallback(() => {
    if (!isSpeaking) return;
    clearWatchdog();
    clearProgressInterval();
    clearFallbackStartTimer();

    const audio = audioRef.current;
    if (engineMode === 'gemini' && audio && audio.src) {
      audio.pause();
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
        setCurrentTime(audio.currentTime);
        setProgress(Math.min(1, Math.max(0, audio.currentTime / audio.duration)));
      }
      pausedSlideKeyRef.current = slideKey;
      pausedMetaRef.current = {
        voice: voiceRef.current,
        intonation: intonationRef.current,
        rate: rateRef.current,
        engine: 'gemini',
        chunkIdx: 0,
      };
    } else if (browserTtsSupported) {
      activeSessionRef.current += 1;
      window.speechSynthesis.cancel();
      pausedSlideKeyRef.current = slideKey;
      if (!pausedMetaRef.current) {
        pausedMetaRef.current = {
          voice: voiceRef.current,
          intonation: intonationRef.current,
          rate: rateRef.current,
          engine: 'browser',
          chunkIdx: 0,
        };
      } else {
        pausedMetaRef.current.engine = 'browser';
      }
    }

    setIsSpeaking(false);
    setIsPaused(true);
  }, [browserTtsSupported, clearFallbackStartTimer, clearProgressInterval, clearWatchdog, engineMode, isSpeaking, slideKey]);

  const resume = useCallback(async () => {
    unlockAudio();
    const audio = audioRef.current;
    const meta = pausedMetaRef.current;
    const canResumeGemini =
      isPaused &&
      pausedSlideKeyRef.current === slideKey &&
      meta?.engine === 'gemini' &&
      meta.voice === voiceRef.current &&
      meta.intonation === intonationRef.current &&
      audio &&
      Boolean(audio.src);

    if (canResumeGemini && audio) {
      const sessionId = activeSessionRef.current;
      const isStaticTrack =
        voiceRef.current === 'Kore' &&
        intonationRef.current === 'cercana' &&
        rateToPace(rateRef.current) === 'normal' &&
        VALID_STATIC_KORE_TRACKS.has(slideKey);
      const effectivePlaybackRate = isStaticTrack ? rateRef.current : 1.0;

      setIsPaused(false);
      setIsSpeaking(true);
      setShowCaption(true);
      audio.playbackRate = effectivePlaybackRate;

      clearProgressInterval();
      progressIntervalRef.current = window.setInterval(() => {
        if (activeSessionRef.current !== sessionId) return;
        if (Number.isFinite(audio.duration) && audio.duration > 0) {
          setDuration(audio.duration);
          setCurrentTime(audio.currentTime);
          setProgress(Math.min(1, Math.max(0, audio.currentTime / audio.duration)));
        }
      }, 120);

      clearWatchdog();
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        const remainingSec = Math.max(0.5, audio.duration - audio.currentTime);
        watchdogRef.current = window.setTimeout(() => {
          if (activeSessionRef.current === sessionId) {
            clearWatchdog();
            clearProgressInterval();
            setProgress(1);
            setCurrentTime(audio.duration);
            setIsSpeaking(false);
            setIsPaused(false);
            pausedSlideKeyRef.current = null;
            pausedMetaRef.current = null;
            onNarrationEndRef.current?.();
          }
        }, Math.round(((remainingSec / effectivePlaybackRate) + 4) * 1000));
      }

      try {
        await audio.play();
      } catch (err) {
        if (activeSessionRef.current !== sessionId) return;
        const errName = (err as { name?: string })?.name || '';
        const errMsg = err instanceof Error ? err.message : String(err);
        if (errName === 'NotAllowedError' || /not allowed|user didn't interact/i.test(errMsg)) {
          setIsSpeaking(false);
          setIsPaused(true);
          setAutoplayBlocked(true);
        }
      }
      return;
    }

    if (isPaused && pausedSlideKeyRef.current === slideKey && meta?.engine === 'browser') {
      const sessionId = ++activeSessionRef.current;
      speakWithBrowserFallback(sessionId, script, rateRef.current, meta.chunkIdx);
      return;
    }

    await speakCurrent();
  }, [clearProgressInterval, clearWatchdog, isPaused, script, slideKey, speakCurrent, speakWithBrowserFallback, unlockAudio]);

  const seekTo = useCallback(
    (fraction: number) => {
      const clamped = Math.min(0.995, Math.max(0, fraction));
      const audio = audioRef.current;
      if (
        engineMode === 'gemini' &&
        audio &&
        audio.src &&
        Number.isFinite(audio.duration) &&
        audio.duration > 0
      ) {
        const nextTime = clamped * audio.duration;
        try {
          audio.currentTime = nextTime;
        } catch {
          // Ignore seek errors
        }
        setCurrentTime(nextTime);
        setDuration(audio.duration);
        setProgress(clamped);
      }
    },
    [engineMode]
  );

  const togglePlay = useCallback(() => {
    unlockAudio();
    if (isLoadingAudio) {
      stop();
    } else if (isSpeaking) {
      pause();
    } else if (isPaused) {
      void resume();
    } else {
      void speakCurrent();
    }
  }, [isLoadingAudio, isPaused, isSpeaking, pause, resume, speakCurrent, stop, unlockAudio]);

  const setAutoNarrateWithUnlock = useCallback(
    (value: boolean) => {
      if (value) unlockAudio();
      setAutoNarrate(value);
    },
    [unlockAudio]
  );

  // Automatically narrate when slideKey changes if autoNarrate is enabled
  useEffect(() => {
    if (autoNarrate) {
      const t = window.setTimeout(() => {
        void speakCurrent();
      }, 240);
      return () => {
        window.clearTimeout(t);
        stop();
      };
    } else {
      stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideKey, autoNarrate]);

  useEffect(() => stop, [stop]);

  const cycleRate = useCallback(() => {
    unlockAudio();
    const next = rate === 1.0 ? 0.94 : rate === 0.94 ? 1.12 : 1.0;
    setRate(next);
    rateRef.current = next;
    const isStaticTrack =
      voiceRef.current === 'Kore' &&
      intonationRef.current === 'cercana' &&
      VALID_STATIC_KORE_TRACKS.has(slideKey);
    const audio = audioRef.current;
    if (audio && isSpeaking && engineMode === 'gemini' && isStaticTrack) {
      audio.playbackRate = next;
    } else if (isSpeaking || isLoadingAudio) {
      void speakCurrent(next);
    }
  }, [engineMode, isLoadingAudio, isSpeaking, rate, slideKey, speakCurrent, unlockAudio]);

  const cycleVoice = useCallback(() => {
    unlockAudio();
    const idx = NARRATION_VOICES.findIndex((v) => v.id === voice);
    const nextVoice = NARRATION_VOICES[(idx + 1) % NARRATION_VOICES.length].id;
    setVoice(nextVoice);
    voiceRef.current = nextVoice;
    if (isSpeaking || isLoadingAudio || autoNarrate) {
      void speakCurrent(undefined, nextVoice);
    }
  }, [autoNarrate, isLoadingAudio, isSpeaking, speakCurrent, unlockAudio, voice]);

  const cycleIntonation = useCallback(() => {
    unlockAudio();
    const idx = NARRATION_INTONATIONS.findIndex((t) => t.id === intonation);
    const nextIntonation = NARRATION_INTONATIONS[(idx + 1) % NARRATION_INTONATIONS.length].id;
    setIntonation(nextIntonation);
    intonationRef.current = nextIntonation;
    if (isSpeaking || isLoadingAudio || autoNarrate) {
      void speakCurrent(undefined, undefined, nextIntonation);
    }
  }, [autoNarrate, intonation, isLoadingAudio, isSpeaking, speakCurrent, unlockAudio]);

  return {
    isSupported: true,
    isSpeaking,
    isPaused,
    isLoadingAudio,
    autoplayBlocked,
    autoNarrate,
    setAutoNarrate: setAutoNarrateWithUnlock,
    rate,
    cycleRate,
    voice,
    voiceLabel: NARRATION_VOICES.find((v) => v.id === voice)?.label ?? 'Sofía (Neural)',
    cycleVoice,
    intonation,
    intonationLabel:
      NARRATION_INTONATIONS.find((t) => t.id === intonation)?.label ?? 'Tono: Cercano',
    cycleIntonation,
    engineMode,
    errorNotice,
    progress,
    currentTime,
    duration,
    seekTo,
    showCaption,
    setShowCaption,
    unlockAudio,
    togglePlay,
    pause,
    resume,
    speakCurrent,
    stop,
    activeScript: script,
  };
}
