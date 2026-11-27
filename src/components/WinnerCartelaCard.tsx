import React from 'react';
import { Check, Star } from 'lucide-react';
import {
  BINGO_LETTERS,
  RoundWinner,
  checkWinningPattern,
  getBallLetter,
} from '../../shared/bingo';
import { Translations } from '../utils/i18n';
import { RankBadge } from './RankBadge';

interface WinnerCartelaCardProps {
  winner: RoundWinner;
  calledNumbers: number[];
  isCurrentPlayer: boolean;
  t: Translations;
  compact?: boolean;
}

const COLUMN_COLORS = [
  'bg-pink-600 text-white',
  'bg-amber-400 text-purple-950',
  'bg-fuchsia-600 text-white',
  'bg-purple-600 text-white',
  'bg-yellow-400 text-purple-950',
];

export const WinnerCartelaCard: React.FC<WinnerCartelaCardProps> = ({
  winner,
  calledNumbers,
  isCurrentPlayer,
  t,
  compact = false,
}) => {
  const calledSet = React.useMemo(() => new Set<number>(calledNumbers), [calledNumbers]);
  const hasValidGrid = Array.isArray(winner.grid) && winner.grid.length === 5 && winner.grid.every((row) => Array.isArray(row) && row.length === 5);

  const fallbackWin = React.useMemo(() => {
    if (!hasValidGrid) return null;
    if (Array.isArray(winner.winningCells) && winner.winningCells.length > 0) return null;
    return checkWinningPattern(winner.grid, calledNumbers);
  }, [hasValidGrid, winner.winningCells, winner.grid, calledNumbers]);

  const winningCells = React.useMemo<[number, number][]>(() => {
    if (Array.isArray(winner.winningCells) && winner.winningCells.length > 0) {
      return winner.winningCells;
    }
    return fallbackWin?.winningCells ?? [];
  }, [winner.winningCells, fallbackWin]);

  const patternName = winner.patternName || fallbackWin?.patternName || '';
  const winningNumber = winner.winningNumber ?? fallbackWin?.winningNumber ?? null;

  const winningCoordSet = React.useMemo(() => {
    const s = new Set<string>();
    for (const [r, c] of winningCells) {
      s.add(`${r},${c}`);
    }
    return s;
  }, [winningCells]);

  // Compute SVG winning line coordinates (in 0..100 viewBox space)
  const lineSegment = React.useMemo(() => {
    if (winningCells.length === 5) {
      const [r0, c0] = winningCells[0];
      const [r4, c4] = winningCells[4];
      return {
        type: 'line' as const,
        x1: 10 + c0 * 20,
        y1: 10 + r0 * 20,
        x2: 10 + c4 * 20,
        y2: 10 + r4 * 20,
      };
    }
    if (winningCells.length === 4) {
      return { type: 'corners' as const };
    }
    return null;
  }, [winningCells]);

  return (
    <div
      className={`rounded-3xl border-2 backdrop-blur-md shadow-2xl overflow-hidden text-left ${
        isCurrentPlayer
          ? 'bg-gradient-to-b from-amber-500/20 via-white/10 to-purple-950/60 border-amber-300 ring-2 ring-amber-300/50'
          : 'bg-white/10 border-amber-400/70'
      } ${compact ? 'p-3.5 sm:p-4 space-y-2.5' : 'p-4 sm:p-5 space-y-3'}`}
    >
      {/* Winner Summary: Player Name, Cartela Number, Amount Won */}
      <div className="flex flex-col items-center text-center gap-1.5">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {isCurrentPlayer && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-400 text-purple-950 text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
              {t.youWonBadge}
            </span>
          )}
          <span
            className={`font-display font-extrabold text-white break-words leading-tight ${
              compact ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'
            }`}
          >
            {winner.playerName}
          </span>
          {winner.playerRank && <RankBadge rank={winner.playerRank} size="sm" />}
        </div>

        <div
          className={`font-mono font-extrabold text-amber-300 tabular-nums leading-none ${
            compact ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'
          }`}
        >
          +{winner.prizeAmount} {t.birr}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold text-fuchsia-100/95">
          <span className="px-2.5 py-0.5 rounded-lg bg-white/15 border border-white/20 text-white font-bold">
            {winner.isCustom ? t.customCartela : `${t.cartelaNum} #${winner.cartelaNumber}`}
          </span>
          {patternName && (
            <span className="px-2.5 py-0.5 rounded-lg bg-amber-400/20 border border-amber-300/40 text-amber-200 font-bold">
              {patternName}
            </span>
          )}
          {winningNumber !== null && (
            <span className="px-2 py-0.5 rounded-lg bg-emerald-400/20 border border-emerald-300/40 text-emerald-200 font-mono text-xs font-bold">
              {t.winningBall}: {getBallLetter(winningNumber)}-{winningNumber}
            </span>
          )}
        </div>
      </div>

      {/* Winning Cartela 5x5 Grid with Highlighted Winning Line */}
      {hasValidGrid && (
        <div
          className={`mx-auto w-full rounded-2xl bg-white/95 dark:bg-[#15072E]/95 text-purple-950 dark:text-purple-50 border border-amber-300/70 shadow-xl overflow-hidden ${
            compact ? 'max-w-[235px] sm:max-w-[260px]' : 'max-w-[265px] sm:max-w-[300px]'
          }`}
        >
          {/* Mini Cartela Header */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-[#FFF5FA] dark:bg-[#1F0B3F] border-b border-pink-200 dark:border-purple-500/30">
            <span className="font-display text-xs font-extrabold tracking-tight truncate">
              {winner.isCustom ? t.customCartela : `${t.cartelaNum} #${winner.cartelaNumber}`}
            </span>
            {patternName && (
              <span className="text-[10px] font-bold text-emerald-700 dark:text-amber-300 truncate">
                {patternName}
              </span>
            )}
          </div>

          {/* B-I-N-G-O Header */}
          <div className="grid grid-cols-5 gap-1 px-2 pt-2">
            {BINGO_LETTERS.map((letter, idx) => (
              <div
                key={letter}
                className={`h-5 sm:h-6 rounded-md flex items-center justify-center font-display font-extrabold text-[11px] sm:text-xs tracking-wider ${COLUMN_COLORS[idx]}`}
              >
                {letter}
              </div>
            ))}
          </div>

          {/* 5x5 Cells + SVG Winning Line */}
          <div className="relative p-2">
            {lineSegment && (
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
                className="absolute inset-2 w-[calc(100%-1rem)] h-[calc(100%-1rem)] pointer-events-none z-20"
              >
                {lineSegment.type === 'line' ? (
                  <>
                    <line
                      x1={lineSegment.x1}
                      y1={lineSegment.y1}
                      x2={lineSegment.x2}
                      y2={lineSegment.y2}
                      stroke="#10b981"
                      strokeOpacity="0.45"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                    <line
                      x1={lineSegment.x1}
                      y1={lineSegment.y1}
                      x2={lineSegment.x2}
                      y2={lineSegment.y2}
                      stroke="#ffffff"
                      strokeOpacity="0.7"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </>
                ) : (
                  <rect
                    x="10"
                    y="10"
                    width="80"
                    height="80"
                    rx="4"
                    fill="none"
                    stroke="#10b981"
                    strokeOpacity="0.55"
                    strokeWidth="2.4"
                    strokeDasharray="5 4"
                  />
                )}
              </svg>
            )}

            <div className="grid grid-cols-5 gap-1 relative z-10">
              {winner.grid.map((row, r) =>
                row.map((num, c) => {
                  const isFree = r === 2 && c === 2;
                  const isWinningCell = winningCoordSet.has(`${r},${c}`);
                  const isCalled = isFree || calledSet.has(num);

                  return (
                    <div
                      key={`${r}-${c}`}
                      className={`relative aspect-square rounded-md flex items-center justify-center font-mono font-bold select-none tabular-nums ${
                        compact ? 'text-[11px] sm:text-xs' : 'text-xs sm:text-sm'
                      } ${
                        isWinningCell
                          ? 'bg-gradient-to-br from-amber-300 via-yellow-300 to-amber-400 text-purple-950 ring-2 ring-emerald-500 shadow-sm'
                          : isFree
                            ? 'bg-gradient-to-br from-pink-500 via-fuchsia-600 to-purple-700 text-white'
                            : isCalled
                              ? 'bg-[#FFF5FA] dark:bg-[#1F0B3F] text-white border border-pink-200 dark:border-purple-500/35'
                              : 'bg-[#FFF5FA] dark:bg-[#1F0B3F] text-purple-950/75 dark:text-purple-200/75 border border-pink-200/80 dark:border-purple-500/25'
                      }`}
                    >
                      {isFree ? (
                        <div className="flex flex-col items-center justify-center leading-none">
                          <Star
                            className={`w-3 h-3 ${
                              isWinningCell ? 'fill-purple-950 text-purple-950' : 'fill-amber-300 text-amber-300'
                            }`}
                          />
                          <span className="text-[6px] sm:text-[7px] font-sans font-extrabold tracking-wider mt-0.5">
                            {t.free}
                          </span>
                        </div>
                      ) : (
                        <>
                          {isCalled && !isWinningCell && (
                            <span
                              aria-hidden="true"
                              className="absolute inset-0.5 sm:inset-1 rounded-full bg-gradient-to-br from-pink-500 via-fuchsia-600 to-purple-600"
                            />
                          )}
                          <span className="relative z-10">{num}</span>
                          {isWinningCell && (
                            <span
                              aria-hidden="true"
                              className="absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-600 text-white flex items-center justify-center"
                            >
                              <Check className="w-1.5 h-1.5 stroke-[3]" />
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
