import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Play, Square, Volume2 } from 'lucide-react';
import {
  VOICE_PRESETS,
  normalizeVoicePreset,
  type AppLanguage,
  type VoicePresetId,
} from '../../../shared/bingo';
import { soundEngine } from '../../../src/utils/sound';

interface Props {
  activeVoicePreset: string | undefined;
  busy: boolean;
  onSelectVoice: (voicePreset: VoicePresetId) => Promise<void>;
}

type VoiceFilter = 'all' | 'serious_slow' | 'stern' | 'fast' | 'fx';

const SAMPLE_OPTIONS: Array<{ id: string; label: string; mode: 'ball' | 'winner'; ball: number }> = [
  { id: 'b7', label: 'Ball B-7', mode: 'ball', ball: 7 },
  { id: 'i24', label: 'Ball I-24', mode: 'ball', ball: 24 },
  { id: 'n38', label: 'Ball N-38', mode: 'ball', ball: 38 },
  { id: 'g52', label: 'Ball G-52', mode: 'ball', ball: 52 },
  { id: 'o69', label: 'Ball O-69', mode: 'ball', ball: 69 },
  { id: 'bingo', label: 'BINGO Winner!', mode: 'winner', ball: 0 },
];

export const VoiceStudioPanel: React.FC<Props> = ({ activeVoicePreset, busy, onSelectVoice }) => {
  const currentId = normalizeVoicePreset(activeVoicePreset);
  const [filter, setFilter] = useState<VoiceFilter>('all');
  const [sampleId, setSampleId] = useState('i24');
  const [playingKey, setPlayingKey] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      soundEngine.stopAllVoice();
    };
  }, []);

  const currentSample = useMemo(
    () => SAMPLE_OPTIONS.find((s) => s.id === sampleId) || SAMPLE_OPTIONS[1],
    [sampleId]
  );

  const filteredPresets = useMemo(() => {
    if (filter === 'all') return VOICE_PRESETS;
    if (filter === 'serious_slow') {
      return VOICE_PRESETS.filter(
        (v) =>
          v.tempo < 0.96 ||
          /serious|narrator|solemn|baritone|calm|herald|midnight|whisper/i.test(`${v.name} ${v.styleTag}`)
      );
    }
    if (filter === 'stern') {
      return VOICE_PRESETS.filter((v) =>
        /stern|judge|sergeant|commander|strict/i.test(`${v.name} ${v.styleTag}`)
      );
    }
    if (filter === 'fast') {
      return VOICE_PRESETS.filter((v) => v.tempo >= 1.12);
    }
    return VOICE_PRESETS.filter(
      (v) => Boolean(v.echoDelayMs) || v.drive >= 0.14 || Boolean(v.lowPassHz && v.lowPassHz <= 3500)
    );
  }, [filter]);

  const handlePreview = async (presetId: VoicePresetId, lang: AppLanguage) => {
    const key = `${presetId}:${lang}`;
    setPlayingKey(key);
    await soundEngine.previewVoice(presetId, lang, currentSample.mode, currentSample.ball || 24);
  };

  const handleStop = () => {
    soundEngine.stopAllVoice();
    setPlayingKey(null);
  };

  const formatTempo = (t: number) => {
    if (t >= 1.25) return `${t.toFixed(2)}x Fast`;
    if (t <= 0.86) return `${t.toFixed(2)}x Slow`;
    return `${t.toFixed(2)}x`;
  };

  const formatPitch = (p: number) => {
    const pct = Math.round((p - 1) * 100);
    if (pct === 0) return 'Natural Pitch';
    return `${pct > 0 ? '+' : ''}${pct}% Pitch`;
  };

  return (
    <div className="space-y-6">
      {/* Header & Sample Selector */}
      <section className="bg-white/95 dark:bg-[#0D162E]/90 backdrop-blur-md border border-blue-200/80 dark:border-blue-500/25 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-blue-100 dark:border-blue-500/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/25">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Caller Voice Studio — 20 Distinct Voices (EN / አማ / OM)
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                Preview all 20 vocal styles in English, Amharic, and Afaan Oromo, then activate any voice for every live bingo room.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleStop}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-blue-50 dark:bg-[#070E20] hover:bg-blue-100 dark:hover:bg-blue-500/15 border border-blue-200 dark:border-blue-500/30 rounded-xl cursor-pointer whitespace-nowrap"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            Stop Audio
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: 'all', label: 'All 20 Voices' },
                { id: 'serious_slow', label: 'Serious & Slower' },
                { id: 'stern', label: 'More Stern' },
                { id: 'fast', label: 'Faster' },
                { id: 'fx', label: 'Radio & Hall FX' },
              ] as Array<{ id: VoiceFilter; label: string }>
            ).map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                  filter === f.id
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-blue-500 shadow-sm'
                    : 'bg-blue-50/70 dark:bg-[#070E20] text-slate-700 dark:text-slate-200 border-blue-200 dark:border-blue-500/25 hover:bg-blue-100 dark:hover:bg-blue-500/15'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap">
              Preview Sample:
            </label>
            <select
              value={sampleId}
              onChange={(e) => setSampleId(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold bg-blue-50/70 dark:bg-[#070E20] border border-blue-200 dark:border-blue-500/25 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            >
              {SAMPLE_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* 20 Voice Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredPresets.map((preset) => {
          const isActive = currentId === preset.id;
          return (
            <div
              key={preset.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between gap-4 transition-all backdrop-blur-md ${
                isActive
                  ? 'bg-blue-50/90 dark:bg-[#0B224B]/90 border-blue-500 dark:border-cyan-400 shadow-md dark:shadow-[0_0_24px_rgba(34,211,238,0.22)]'
                  : 'bg-white/95 dark:bg-[#0D162E]/90 border-blue-200/80 dark:border-blue-500/25 shadow-sm'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-slate-900 dark:bg-cyan-500/20 text-white dark:text-cyan-300 font-mono-num text-xs font-bold flex items-center justify-center shrink-0 border border-slate-700 dark:border-cyan-400/30">
                      {preset.number}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {preset.name}
                      </h3>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-400/30 shrink-0">
                    {preset.styleTag}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {preset.description}
                </p>

                <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono-num text-slate-500 dark:text-slate-400">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#070E20] border border-slate-200 dark:border-blue-500/20">
                    {formatTempo(preset.tempo)}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#070E20] border border-slate-200 dark:border-blue-500/20">
                    {formatPitch(preset.pitch)}
                  </span>
                  {preset.echoDelayMs ? (
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#070E20] border border-slate-200 dark:border-blue-500/20">
                      Echo
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-blue-100 dark:border-blue-500/20">
                <div className="grid grid-cols-3 gap-1.5">
                  {(
                    [
                      { lang: 'en', label: 'EN' },
                      { lang: 'am', label: 'አማ (AM)' },
                      { lang: 'om', label: 'OM' },
                    ] as Array<{ lang: AppLanguage; label: string }>
                  ).map((item) => {
                    const isPlaying = playingKey === `${preset.id}:${item.lang}`;
                    return (
                      <button
                        key={item.lang}
                        type="button"
                        onClick={() => void handlePreview(preset.id, item.lang)}
                        className={`inline-flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                          isPlaying
                            ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                            : 'bg-blue-50/70 dark:bg-[#070E20] text-blue-700 dark:text-cyan-300 border-blue-200 dark:border-blue-500/25 hover:bg-blue-100 dark:hover:bg-blue-500/20'
                        }`}
                      >
                        <Play className="w-3 h-3 fill-current shrink-0" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  disabled={busy || isActive}
                  onClick={() => void onSelectVoice(preset.id)}
                  className={`w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
                    isActive
                      ? 'bg-emerald-600/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 cursor-default'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:brightness-110 disabled:opacity-50 shadow-sm cursor-pointer'
                  }`}
                >
                  {isActive ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Active Live Caller Voice
                    </>
                  ) : (
                    <span>Use This Voice Live</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
