export type BingoLetter = 'B' | 'I' | 'N' | 'G' | 'O';

export type GamePhase = 'OPENING' | 'CALLING' | 'ENDED';

export type AppLanguage = 'en' | 'am' | 'om';

export type VoicePresetId =
  | 'classic_host'
  | 'serious_narrator'
  | 'stern_commander'
  | 'slow_solemn'
  | 'rapid_blitz'
  | 'turbo_auctioneer'
  | 'iron_judge'
  | 'midnight_radio'
  | 'grand_arena'
  | 'news_anchor'
  | 'velvet_baritone'
  | 'hype_mc'
  | 'royal_herald'
  | 'whisper_tension'
  | 'vintage_gramophone'
  | 'drill_sergeant'
  | 'calm_zen'
  | 'cyber_android'
  | 'golden_gala'
  | 'lightning_caller';

export interface VoicePresetDefinition {
  id: VoicePresetId;
  number: number;
  name: string;
  styleTag: string;
  description: string;
  tempo: number;
  pitch: number;
  bassDb: number;
  midHz: number;
  midDb: number;
  highDb: number;
  lowPassHz?: number;
  highPassHz?: number;
  drive: number;
  compress: boolean;
  echoDelayMs?: number;
  echoMix?: number;
  preferMale?: boolean;
}

export const VOICE_PRESETS: VoicePresetDefinition[] = [
  {
    id: 'classic_host',
    number: 1,
    name: 'Classic Bingo Host',
    styleTag: 'Balanced',
    description: 'Clean, natural hall pacing and clear midrange.',
    tempo: 1.0,
    pitch: 1.0,
    bassDb: 1,
    midHz: 1400,
    midDb: 1,
    highDb: 1,
    drive: 0,
    compress: false,
    preferMale: true,
  },
  {
    id: 'serious_narrator',
    number: 2,
    name: 'Serious Narrator',
    styleTag: 'Serious · Slower',
    description: 'Measured documentary cadence with deep studio chest warmth.',
    tempo: 0.85,
    pitch: 0.86,
    bassDb: 7,
    midHz: 950,
    midDb: -2,
    highDb: -2,
    lowPassHz: 5200,
    highPassHz: 70,
    drive: 0.08,
    compress: true,
    preferMale: true,
  },
  {
    id: 'stern_commander',
    number: 3,
    name: 'Stern Commander',
    styleTag: 'More Stern',
    description: 'Commanding low tone, sharp articulation, zero nonsense.',
    tempo: 0.94,
    pitch: 0.84,
    bassDb: 6,
    midHz: 2300,
    midDb: 5,
    highDb: 2,
    highPassHz: 95,
    drive: 0.18,
    compress: true,
    preferMale: true,
  },
  {
    id: 'slow_solemn',
    number: 4,
    name: 'Slow & Solemn',
    styleTag: 'Slowest',
    description: 'Slow, heavy, deliberate delivery for high-stakes tension.',
    tempo: 0.77,
    pitch: 0.88,
    bassDb: 6,
    midHz: 750,
    midDb: 1,
    highDb: -5,
    lowPassHz: 3900,
    drive: 0.05,
    compress: true,
    preferMale: true,
  },
  {
    id: 'rapid_blitz',
    number: 5,
    name: 'Fast Blitz Caller',
    styleTag: 'Faster',
    description: 'Brisk rapid-fire pacing with energetic lift.',
    tempo: 1.28,
    pitch: 1.06,
    bassDb: -2,
    midHz: 2100,
    midDb: 4,
    highDb: 4,
    highPassHz: 140,
    drive: 0.05,
    compress: true,
    preferMale: false,
  },
  {
    id: 'turbo_auctioneer',
    number: 6,
    name: 'Turbo Auctioneer',
    styleTag: 'Fastest',
    description: 'Ultra-fast auction rhythm with tight dry punch.',
    tempo: 1.38,
    pitch: 1.02,
    bassDb: -3,
    midHz: 2600,
    midDb: 6,
    highDb: 5,
    highPassHz: 180,
    drive: 0.12,
    compress: true,
    preferMale: true,
  },
  {
    id: 'iron_judge',
    number: 7,
    name: 'Iron Judge',
    styleTag: 'Ultra Stern',
    description: 'Gravelly ultra-deep authority with hard broadcast limiting.',
    tempo: 0.88,
    pitch: 0.79,
    bassDb: 9,
    midHz: 1850,
    midDb: 4,
    highDb: -3,
    lowPassHz: 4600,
    highPassHz: 65,
    drive: 0.28,
    compress: true,
    preferMale: true,
  },
  {
    id: 'midnight_radio',
    number: 8,
    name: 'Midnight FM Host',
    styleTag: 'Smooth · Deep',
    description: 'Silky late-night radio bass warmth and unhurried tempo.',
    tempo: 0.9,
    pitch: 0.89,
    bassDb: 8,
    midHz: 1100,
    midDb: -3,
    highDb: 2,
    lowPassHz: 5600,
    highPassHz: 60,
    drive: 0.04,
    compress: true,
    preferMale: true,
  },
  {
    id: 'grand_arena',
    number: 9,
    name: 'Grand Stadium PA',
    styleTag: 'Arena Hall',
    description: 'Booming hall projection with subtle live arena echo.',
    tempo: 0.95,
    pitch: 0.92,
    bassDb: 4,
    midHz: 1700,
    midDb: 5,
    highDb: 2,
    highPassHz: 110,
    drive: 0.14,
    compress: true,
    echoDelayMs: 68,
    echoMix: 0.24,
    preferMale: true,
  },
  {
    id: 'news_anchor',
    number: 10,
    name: 'Prime News Anchor',
    styleTag: 'Crisp · Brisk',
    description: 'Broadcast journalism precision, crisp highs, steady drive.',
    tempo: 1.14,
    pitch: 1.02,
    bassDb: 0,
    midHz: 2400,
    midDb: 5,
    highDb: 4,
    highPassHz: 130,
    drive: 0.03,
    compress: true,
    preferMale: true,
  },
  {
    id: 'velvet_baritone',
    number: 11,
    name: 'Deep Baritone',
    styleTag: 'Sub-Bass · Slow',
    description: 'Ultra-low velvet register with relaxed serious gravitas.',
    tempo: 0.83,
    pitch: 0.77,
    bassDb: 10,
    midHz: 850,
    midDb: -4,
    highDb: -4,
    lowPassHz: 4200,
    drive: 0.06,
    compress: true,
    preferMale: true,
  },
  {
    id: 'hype_mc',
    number: 12,
    name: 'Party Hype MC',
    styleTag: 'Fast · Bright',
    description: 'High-energy bright club host with quick upbeat cadence.',
    tempo: 1.22,
    pitch: 1.12,
    bassDb: 1,
    midHz: 2200,
    midDb: 3,
    highDb: 6,
    highPassHz: 150,
    drive: 0.08,
    compress: true,
    echoDelayMs: 42,
    echoMix: 0.14,
    preferMale: false,
  },
  {
    id: 'royal_herald',
    number: 13,
    name: 'Royal Court Herald',
    styleTag: 'Regal · Slow',
    description: 'Ceremonial palace announcement tone with rich hall depth.',
    tempo: 0.84,
    pitch: 0.94,
    bassDb: 4,
    midHz: 1350,
    midDb: 4,
    highDb: 1,
    drive: 0.04,
    compress: true,
    echoDelayMs: 85,
    echoMix: 0.26,
    preferMale: true,
  },
  {
    id: 'whisper_tension',
    number: 14,
    name: 'Suspense Whisper',
    styleTag: 'Soft · Slow',
    description: 'Hushed, close-mic breathy delivery for tense finales.',
    tempo: 0.81,
    pitch: 1.04,
    bassDb: -6,
    midHz: 1500,
    midDb: -3,
    highDb: 7,
    highPassHz: 240,
    drive: 0.02,
    compress: false,
    preferMale: false,
  },
  {
    id: 'vintage_gramophone',
    number: 15,
    name: 'Vintage AM Radio',
    styleTag: 'Retro Warm',
    description: 'Classic mid-focused broadcast horn with warm analog grit.',
    tempo: 0.98,
    pitch: 0.98,
    bassDb: -5,
    midHz: 1450,
    midDb: 8,
    highDb: -7,
    lowPassHz: 2900,
    highPassHz: 340,
    drive: 0.3,
    compress: true,
    preferMale: true,
  },
  {
    id: 'drill_sergeant',
    number: 16,
    name: 'Strict Sergeant',
    styleTag: 'Fast & Stern',
    description: 'Snappy, barked military cadence with punchy forward bite.',
    tempo: 1.18,
    pitch: 0.9,
    bassDb: 3,
    midHz: 1950,
    midDb: 7,
    highDb: 3,
    highPassHz: 170,
    drive: 0.34,
    compress: true,
    preferMale: true,
  },
  {
    id: 'calm_zen',
    number: 17,
    name: 'Calm Lounge Guide',
    styleTag: 'Gentle · Slow',
    description: 'Soothing, soft-edged tone at an easy unhurried pace.',
    tempo: 0.84,
    pitch: 1.03,
    bassDb: 2,
    midHz: 900,
    midDb: -2,
    highDb: -4,
    lowPassHz: 4500,
    drive: 0,
    compress: false,
    preferMale: false,
  },
  {
    id: 'cyber_android',
    number: 18,
    name: 'Cyber AI Core',
    styleTag: 'Synthetic',
    description: 'Precision futuristic metallic resonance with tight slapback.',
    tempo: 1.07,
    pitch: 0.95,
    bassDb: 0,
    midHz: 2050,
    midDb: 6,
    highDb: 5,
    highPassHz: 210,
    drive: 0.16,
    compress: true,
    echoDelayMs: 24,
    echoMix: 0.28,
    preferMale: true,
  },
  {
    id: 'golden_gala',
    number: 19,
    name: 'Golden Gala MC',
    styleTag: 'Stage Sparkle',
    description: 'Polished tuxedo stage presenter with bright studio shimmer.',
    tempo: 0.97,
    pitch: 1.05,
    bassDb: 2,
    midHz: 1650,
    midDb: 2,
    highDb: 5,
    highPassHz: 90,
    drive: 0.04,
    compress: true,
    echoDelayMs: 52,
    echoMix: 0.15,
    preferMale: false,
  },
  {
    id: 'lightning_caller',
    number: 20,
    name: 'Lightning Express',
    styleTag: 'Fast & Deep',
    description: 'Fast pro speed paired with a grounded lower register.',
    tempo: 1.26,
    pitch: 0.91,
    bassDb: 5,
    midHz: 2250,
    midDb: 4,
    highDb: 2,
    highPassHz: 100,
    drive: 0.12,
    compress: true,
    preferMale: true,
  },
];

const VOICE_PRESET_MAP = new Map<string, VoicePresetDefinition>(
  VOICE_PRESETS.map((v) => [v.id, v])
);

export function getVoicePreset(id: unknown): VoicePresetDefinition {
  if (typeof id === 'string') {
    const found = VOICE_PRESET_MAP.get(id);
    if (found) return found;
  }
  return VOICE_PRESETS[0];
}

export function normalizeVoicePreset(raw: unknown): VoicePresetId {
  if (typeof raw === 'string' && VOICE_PRESET_MAP.has(raw)) {
    return raw as VoicePresetId;
  }
  return 'classic_host';
}

export const BINGO_LETTERS: BingoLetter[] = ['B', 'I', 'N', 'G', 'O'];

export const TOTAL_CARTELAS = 400;
export const MIN_CARTELAS = 100;
export const MAX_CARTELAS_LIMIT = 600;
export const SELECTION_DURATION_SEC = 30;
export const DEFAULT_CALL_INTERVAL_MS = 3500;
export const ENDED_DURATION_SEC = 4;
export const DEFAULT_STAKES = [10, 20];
export const INITIAL_DEPOSIT_BIRR = 100;

export type RankTierId = 'bronze' | 'silver' | 'gold' | 'diamond' | 'platinum';

export interface RankThresholds {
  bronze: number;
  silver: number;
  gold: number;
  diamond: number;
  platinum: number;
}

export const DEFAULT_RANK_THRESHOLDS: RankThresholds = {
  bronze: 0,
  silver: 500,
  gold: 2000,
  diamond: 5000,
  platinum: 15000,
};

export function computeRankTier(
  totalDepositedBirr: number,
  thresholds: RankThresholds = DEFAULT_RANK_THRESHOLDS
): RankTierId {
  const amt = Number(totalDepositedBirr) || 0;
  if (amt >= (thresholds.platinum ?? 15000)) return 'platinum';
  if (amt >= (thresholds.diamond ?? 5000)) return 'diamond';
  if (amt >= (thresholds.gold ?? 2000)) return 'gold';
  if (amt >= (thresholds.silver ?? 500)) return 'silver';
  return 'bronze';
}

export type SeasonThemeId = 'none' | 'christmas' | 'enkutatash' | 'golden' | 'cyber';

export type SpecialEventThemeId =
  | 'christmas'
  | 'enkutatash'
  | 'football'
  | 'golden'
  | 'cyber'
  | 'emerald'
  | 'sunset'
  | 'amethyst'
  | 'diamond_ice'
  | 'rose_gold';

export interface SpecialEvent {
  id: string;
  name: string;
  descriptionText: string;
  themeKey: SpecialEventThemeId;
  entryBirr: number;
  bonusPrizeBirr: number;
  minPlayers: number;
  endsAt: string | null;
  isActive: boolean;
}

export type MissionType =
  | 'play_rounds'
  | 'win_rounds'
  | 'win_pattern'
  | 'invite_friends'
  | 'deposit_birr';

export interface DailyMission {
  id: string;
  title: string;
  missionType: MissionType;
  targetCount: number;
  patternFilter: string;
  rewardBirr: number;
  isActive: boolean;
  sortOrder: number;
}

export interface PlayerMissionState {
  date: string;
  missions: DailyMission[];
  progressMap: Record<string, number>;
  claimedIds: string[];
  allBonusClaimed: boolean;
  completionBonusBirr: number;
}

export type PresetBankKey =
  | 'telebirr'
  | 'cbe'
  | 'cbe_birr'
  | 'abyssinia'
  | 'awash'
  | 'kaffi'
  | 'ebirr'
  | 'coop';

export interface PresetBankDefinition {
  key: PresetBankKey;
  sortOrder: number;
  names: Record<AppLanguage, string>;
}

export const PRESET_BANKS: PresetBankDefinition[] = [
  { key: 'telebirr', sortOrder: 1, names: { en: 'Telebirr', am: 'ቴሌብር', om: 'Telebirr' } },
  { key: 'cbe', sortOrder: 2, names: { en: 'CBE', am: 'ሲቢኢ (CBE)', om: 'CBE' } },
  { key: 'cbe_birr', sortOrder: 3, names: { en: 'CBE Birr', am: 'ሲቢኢ ብር', om: 'CBE Birr' } },
  { key: 'abyssinia', sortOrder: 4, names: { en: 'Abyssinia Bank', am: 'አቢሲኒያ ባንክ', om: 'Baankii Abyssinia' } },
  { key: 'awash', sortOrder: 5, names: { en: 'Awash Bank', am: 'አዋሽ ባንክ', om: 'Baankii Awash' } },
  { key: 'kaffi', sortOrder: 6, names: { en: 'Kaffi', am: 'ካፊ', om: 'Kaffi' } },
  { key: 'ebirr', sortOrder: 7, names: { en: 'E-Birr', am: 'ኢ-ብር', om: 'E-Birr' } },
  { key: 'coop', sortOrder: 8, names: { en: 'Coop', am: 'ኩፕ (Coop)', om: 'Baankii Coop' } },
];

export function getBallLetter(num: number): BingoLetter {
  if (num <= 15) return 'B';
  if (num <= 30) return 'I';
  if (num <= 45) return 'N';
  if (num <= 60) return 'G';
  return 'O';
}

export function getAudioFilename(num: number): string | null {
  if (!Number.isInteger(num) || num < 1 || num > 75) return null;
  const letter = getBallLetter(num).toLowerCase();
  return `${letter}${num}.mp3`;
}

export function getAmharicCallText(num: number): { native: string; phonetic: string } {
  const letter = getBallLetter(num);
  const letterAm: Record<BingoLetter, { am: string; ph: string }> = {
    B: { am: 'ቢ', ph: 'Bee' },
    I: { am: 'አይ', ph: 'Eye' },
    N: { am: 'ኤን', ph: 'En' },
    G: { am: 'ጂ', ph: 'Jee' },
    O: { am: 'ኦ', ph: 'Oh' },
  };

  const unitsAm = ['', 'አንድ', 'ሁለት', 'ሶስት', 'አራት', 'አምስት', 'ስድስት', 'ሰባት', 'ስምንት', 'ዘጠኝ'];
  const unitsPh = ['', 'and', 'hulet', 'sost', 'arat', 'amist', 'sidist', 'sebat', 'simint', 'zetegn'];

  const tensMap: Record<number, { am: string; amPrefix: string; ph: string }> = {
    10: { am: 'አስር', amPrefix: 'አስራ', ph: 'asir' },
    20: { am: 'ሀያ', amPrefix: 'ሀያ', ph: 'haya' },
    30: { am: 'ሰላሳ', amPrefix: 'ሰላሳ', ph: 'selasa' },
    40: { am: 'አርባ', amPrefix: 'አርባ', ph: 'arba' },
    50: { am: 'ሀምሳ', amPrefix: 'ሀምሳ', ph: 'hamsa' },
    60: { am: 'ስልሳ', amPrefix: 'ስልሳ', ph: 'silsa' },
    70: { am: 'ሰባ', amPrefix: 'ሰባ', ph: 'seba' },
  };

  let numAm = '';
  let numPh = '';

  if (num < 10) {
    numAm = unitsAm[num];
    numPh = unitsPh[num];
  } else {
    const tens = Math.floor(num / 10) * 10;
    const unit = num % 10;
    const t = tensMap[tens];
    if (unit === 0) {
      numAm = t.am;
      numPh = t.ph;
    } else if (tens === 10) {
      numAm = `${t.amPrefix} ${unitsAm[unit]}`;
      numPh = `asra ${unitsPh[unit]}`;
    } else {
      numAm = `${t.amPrefix} ${unitsAm[unit]}`;
      numPh = `${t.ph} ${unitsPh[unit]}`;
    }
  }

  return {
    native: `${letterAm[letter].am} ${numAm}`,
    phonetic: `${letterAm[letter].ph}, ${numPh}`,
  };
}

export function getOromoCallText(num: number): { native: string; phonetic: string } {
  const letter = getBallLetter(num);
  const letterOm: Record<BingoLetter, { om: string; ph: string }> = {
    B: { om: 'Bii', ph: 'Bee' },
    I: { om: 'Ay', ph: 'Eye' },
    N: { om: 'En', ph: 'En' },
    G: { om: 'Jii', ph: 'Jee' },
    O: { om: 'Oo', ph: 'Oh' },
  };

  const unitsOm = ['', 'tokko', 'lama', 'sadii', 'afur', 'shan', "ja'a", 'torba', 'saddeet', 'sagal'];
  const unitsPh = ['', 'tokko', 'lama', 'sadi', 'afur', 'shan', 'jaha', 'torba', 'saddeet', 'sagal'];

  const tensExactOm: Record<number, { om: string; prefixOm: string; phPrefix: string }> = {
    10: { om: 'kudhan', prefixOm: 'kudha', phPrefix: 'kudha' },
    20: { om: 'digdama', prefixOm: 'digdamii', phPrefix: 'digdami' },
    30: { om: 'soddoma', prefixOm: 'soddomii', phPrefix: 'soddomi' },
    40: { om: 'afurtama', prefixOm: 'afurtamii', phPrefix: 'afurtami' },
    50: { om: 'shantama', prefixOm: 'shantamii', phPrefix: 'shantami' },
    60: { om: 'jaatama', prefixOm: 'jaatamii', phPrefix: 'jatami' },
    70: { om: 'torbaatama', prefixOm: 'torbaatamii', phPrefix: 'torbatami' },
  };

  let numOm = '';
  let numPh = '';

  if (num < 10) {
    numOm = unitsOm[num];
    numPh = unitsPh[num];
  } else {
    const tens = Math.floor(num / 10) * 10;
    const unit = num % 10;
    const t = tensExactOm[tens];
    if (unit === 0) {
      numOm = t.om;
      numPh = t.om;
    } else {
      numOm = `${t.prefixOm} ${unitsOm[unit]}`;
      numPh = `${t.phPrefix} ${unitsPh[unit]}`;
    }
  }

  return {
    native: `${letterOm[letter].om} ${numOm}`,
    phonetic: `${letterOm[letter].ph}, ${numPh}`,
  };
}

export function getLocalizedCallText(num: number, lang: AppLanguage): { display: string; speak: string; speechLang: string } {
  const letter = getBallLetter(num);
  if (lang === 'am') {
    const am = getAmharicCallText(num);
    return { display: am.native, speak: am.native.replace(' ', '፣ '), speechLang: 'am-ET' };
  }
  if (lang === 'om') {
    const om = getOromoCallText(num);
    return { display: om.native, speak: om.native.replace(' ', ', '), speechLang: 'om-ET' };
  }
  return { display: `${letter}-${num}`, speak: `${letter}, ${num}`, speechLang: 'en-US' };
}

export function getColumnRange(col: number): [number, number] {
  const min = col * 15 + 1;
  const max = col * 15 + 15;
  return [min, max];
}

// Exact deterministic PRNG matching offline-game.js (seededRandom(id * 7919))
function seededRandom(seed: number): () => number {
  let value = seed | 0;
  return () => {
    value |= 0;
    value = (value + 0x6d2b79f5) | 0;
    let next = Math.imul(value ^ (value >>> 15), 1 | value);
    next = (next + Math.imul(next ^ (next >>> 7), 61 | next)) ^ next;
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateCartelaGrid(cartelaId: number): number[][] {
  const random = seededRandom(Number(cartelaId) * 7919);
  const columns: number[][] = [];

  for (let col = 0; col < 5; col++) {
    const [low, high] = getColumnRange(col);
    const pool = Array.from({ length: high - low + 1 }, (_, i) => low + i);
    const picked: number[] = [];
    for (let i = 0; i < 5; i++) {
      picked.push(pool.splice(Math.floor(random() * pool.length), 1)[0]);
    }
    picked.sort((a, b) => a - b);
    columns.push(picked);
  }

  return Array.from({ length: 5 }, (_, row) =>
    Array.from({ length: 5 }, (__, col) => (row === 2 && col === 2 ? 0 : columns[col][row]))
  );
}

export function validateCustomGrid(grid: number[][]): { valid: boolean; reason?: string } {
  if (!Array.isArray(grid) || grid.length !== 5) {
    return { valid: false, reason: 'Grid must have 5 rows.' };
  }
  const seen = new Set<number>();
  for (let r = 0; r < 5; r++) {
    if (!Array.isArray(grid[r]) || grid[r].length !== 5) {
      return { valid: false, reason: 'Each row must have 5 cells.' };
    }
    for (let c = 0; c < 5; c++) {
      const val = grid[r][c];
      if (r === 2 && c === 2) {
        if (val !== 0) return { valid: false, reason: 'Center cell must be FREE (0).' };
        continue;
      }
      const [min, max] = getColumnRange(c);
      if (!Number.isInteger(val) || val < min || val > max) {
        return {
          valid: false,
          reason: `Column ${BINGO_LETTERS[c]} must contain integers from ${min} to ${max}.`,
        };
      }
      if (seen.has(val)) {
        return { valid: false, reason: `Duplicate number ${val} in cartela.` };
      }
      seen.add(val);
    }
  }
  return { valid: true };
}

export interface WinCheckResult {
  won: boolean;
  patternName: string;
  winningCells: [number, number][];
  winningNumber: number | null;
}

export function checkWinningPattern(
  grid: number[][],
  calledNumbers: number[] | Set<number>
): WinCheckResult {
  const calledList = Array.isArray(calledNumbers) ? calledNumbers : Array.from(calledNumbers);
  const calledSet = calledNumbers instanceof Set ? calledNumbers : new Set(calledList);

  const isMarked = (r: number, c: number): boolean => {
    if (r === 2 && c === 2) return true;
    return calledSet.has(grid[r][c]);
  };

  const findWinningBall = (cells: [number, number][]): number | null => {
    for (let i = calledList.length - 1; i >= 0; i--) {
      const num = calledList[i];
      if (cells.some(([r, c]) => !(r === 2 && c === 2) && grid[r][c] === num)) {
        return num;
      }
    }
    return calledList.length > 0 ? calledList[calledList.length - 1] : null;
  };

  for (let r = 0; r < 5; r++) {
    if ([0, 1, 2, 3, 4].every((c) => isMarked(r, c))) {
      const cells: [number, number][] = [0, 1, 2, 3, 4].map((c) => [r, c]);
      return {
        won: true,
        patternName: `Row ${r + 1}`,
        winningCells: cells,
        winningNumber: findWinningBall(cells),
      };
    }
  }

  for (let c = 0; c < 5; c++) {
    if ([0, 1, 2, 3, 4].every((r) => isMarked(r, c))) {
      const cells: [number, number][] = [0, 1, 2, 3, 4].map((r) => [r, c]);
      return {
        won: true,
        patternName: `Column ${BINGO_LETTERS[c]}`,
        winningCells: cells,
        winningNumber: findWinningBall(cells),
      };
    }
  }

  if ([0, 1, 2, 3, 4].every((i) => isMarked(i, i))) {
    const cells: [number, number][] = [0, 1, 2, 3, 4].map((i) => [i, i]);
    return {
      won: true,
      patternName: 'Main Diagonal',
      winningCells: cells,
      winningNumber: findWinningBall(cells),
    };
  }

  if ([0, 1, 2, 3, 4].every((i) => isMarked(i, 4 - i))) {
    const cells: [number, number][] = [0, 1, 2, 3, 4].map((i) => [i, 4 - i]);
    return {
      won: true,
      patternName: 'Reverse Diagonal',
      winningCells: cells,
      winningNumber: findWinningBall(cells),
    };
  }

  const corners: [number, number][] = [
    [0, 0],
    [0, 4],
    [4, 0],
    [4, 4],
  ];
  if (corners.every(([r, c]) => isMarked(r, c))) {
    return {
      won: true,
      patternName: 'Four Corners',
      winningCells: corners,
      winningNumber: findWinningBall(corners),
    };
  }

  return { won: false, patternName: '', winningCells: [], winningNumber: null };
}

export interface PlayerIdentity {
  id: string;
  name: string;
  username?: string;
  isTelegram: boolean;
}

export interface PlayerWallet {
  depositedBalance: number;
  wonBalance: number;
  totalDeposited?: number;
  rankTier?: RankTierId;
  isBanned?: boolean;
}

export interface CartelaEntry {
  entryId: string;
  cartelaNumber: number;
  isCustom: boolean;
  isHouseReserved?: boolean;
  grid: number[][];
  playerId: string;
  playerName: string;
  playerRank?: RankTierId;
  paidFromDeposit: number;
  paidFromWon: number;
  autoClaim: boolean;
  selectedAt: number;
}

export interface RoundWinner {
  playerId: string;
  playerName: string;
  playerRank?: RankTierId;
  cartelaNumber: number;
  isCustom: boolean;
  patternName: string;
  winningCells: [number, number][];
  winningNumber: number | null;
  prizeAmount: number;
  stakeBirr: number;
  grid: number[][];
  callsCount: number;
  roundNumber: number;
  wonAt: number;
}

export interface LeaderboardEntry {
  playerId: string;
  playerName: string;
  playerRank?: RankTierId;
  wins: number;
  totalBirrWon: number;
  lastWonAt: number;
}

export interface RoomSummary {
  stakeBirr: number;
  roundNumber: number;
  gamesPlayed: number;
  phase: GamePhase;
  isPaused: boolean;
  secondsRemaining: number;
  entriesCount: number;
  uniquePlayersCount: number;
  displayedPlayersCount: number;
  displayedPlayersOverride: number | null;
  adminTakeCount: number;
  playersInRoom: number;
  prizePool: number;
  grossPool: number;
  calledCount: number;
  currentBall: number | null;
}

export interface HouseSettings {
  stakes: number[];
  commissionPercent: number;
  callIntervalSeconds: number;
  maxCartelas: number;
  seasonTheme: SeasonThemeId;
  voicePreset?: VoicePresetId;
  rankThresholds: RankThresholds;
  missionCompletionBonus: number;
  onlineCountOverride: number | null;
}

export interface PublicGameState {
  stakeBirr: number;
  roundNumber: number;
  gamesPlayed: number;
  phase: GamePhase;
  isPaused: boolean;
  phaseStartedAt: number;
  phaseEndsAt: number;
  secondsRemaining: number;
  calledNumbers: number[];
  currentBall: number | null;
  remainingBallCount: number;
  entries: CartelaEntry[];
  uniquePlayersCount: number;
  displayedPlayersCount: number;
  displayedPlayersOverride: number | null;
  adminTakeCount: number;
  onlineCount: number;
  playersInRoom: number;
  commissionPercent: number;
  prizePool: number;
  grossPool: number;
  callIntervalMs: number;
  winners: RoundWinner[];
  recentWinners: RoundWinner[];
  leaderboard: LeaderboardEntry[];
  botConfigured: boolean;
  settings: HouseSettings;
  activeSpecialEvent?: SpecialEvent | null;
  serverTime: number;
}

export interface LobbySnapshot {
  rooms: RoomSummary[];
  specialEvents: SpecialEvent[];
  settings: HouseSettings;
  onlineCount: number;
  botConfigured: boolean;
  serverTime: number;
}

export type ClientMessage =
  | { type: 'auth'; player: PlayerIdentity; token?: string; autoClaim?: boolean; language?: AppLanguage }
  | { type: 'set_language'; language: AppLanguage }
  | { type: 'join_room'; stakeBirr: number }
  | { type: 'join_special_event'; eventId: string }
  | { type: 'leave_room' }
  | { type: 'set_auto_claim'; autoClaim: boolean }
  | { type: 'select_cartela'; cartelaNumber: number }
  | { type: 'select_custom_cartela'; grid: number[][] }
  | { type: 'release_cartela'; entryId: string }
  | { type: 'claim_bingo'; entryId: string }
  | { type: 'claim_mission'; missionId: string }
  | { type: 'claim_all_missions' }
  // Admin-only commands
  | { type: 'admin_auth'; pin: string }
  | { type: 'admin_pause'; stakeBirr: number; paused: boolean }
  | { type: 'admin_stop_round'; stakeBirr: number }
  | { type: 'admin_end_round'; stakeBirr: number }
  | { type: 'admin_queue_numbers'; stakeBirr: number; numbers: number[] }
  | { type: 'admin_call_now'; stakeBirr: number; number?: number }
  | { type: 'admin_update_settings'; commissionPercent: number; callIntervalSeconds: number; maxCartelas?: number; seasonTheme?: SeasonThemeId }
  | { type: 'admin_set_online_count'; count: number | null }
  | { type: 'admin_set_room_players_count'; stakeBirr: number; count: number | null }
  | { type: 'admin_set_take_cartelas'; stakeBirr: number; count: number }
  | { type: 'admin_reset_rounds'; stakeBirr: number | 'all'; roundNumber?: number; gamesPlayed?: number }
  | { type: 'admin_set_winners'; recentWinners: RoundWinner[] | null; leaderboard: LeaderboardEntry[] | null }
  | { type: 'admin_add_stake'; stakeBirr: number }
  | { type: 'admin_remove_stake'; stakeBirr: number }
  | { type: 'admin_topup_wallet'; playerId: string; amount: number }
  | { type: 'admin_toggle_ban'; playerId: string; isBanned: boolean }
  | { type: 'admin_manage_admins'; adminIds: string[] };

export type ServerMessage =
  | { type: 'lobby:sync'; lobby: LobbySnapshot }
  | { type: 'wallet:sync'; wallet: PlayerWallet }
  | { type: 'language:sync'; language: AppLanguage }
  | { type: 'missions:sync'; missions: PlayerMissionState }
  | { type: 'state:sync'; state: PublicGameState }
  | { type: 'phase:changed'; state: PublicGameState }
  | { type: 'ball:called'; stakeBirr: number; ball: number; calledNumbers: number[]; remainingBallCount: number; serverTime: number }
  | { type: 'entries:updated'; stakeBirr: number; entries: CartelaEntry[]; uniquePlayersCount: number; displayedPlayersCount: number; prizePool: number; grossPool: number }
  | { type: 'presence:updated'; onlineCount: number; playersInRoom?: number }
  | { type: 'round:ended'; state: PublicGameState }
  | {
      type: 'admin:status';
      isAdmin: boolean;
      queuedByRoom: Record<number, number[]>;
      calledByRoom?: Record<number, number[]>;
      wallets?: Array<{ playerId: string; name: string; wallet: PlayerWallet; isBanned?: boolean }>;
      adminIds?: string[];
      recentWinners?: RoundWinner[];
      leaderboard?: LeaderboardEntry[];
      isCustomWinners?: boolean;
      isCustomLeaderboard?: boolean;
      message?: string;
    }
  | { type: 'action:error'; message: string }
  | { type: 'action:ok'; message: string };
