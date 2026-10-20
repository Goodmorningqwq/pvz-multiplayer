import { RoomDifficulty, ZombieType } from '../types.js';

// ---------------------------------------------------------------------------
// LevelSpawn: the format every zombie script is written in.
//
//   LevelSpawn
//   └─ waves[]            played in order; a wave ends only when every zombie
//      │                  it spawned is dead (see advanceLevelSpawn in
//      │                  defaultGameEngine.ts), then the next wave's break starts
//      ├─ breakBefore     seconds of quiet before this wave's first spawn
//      └─ chunks[]        bursts inside the wave, played back to back
//         ├─ zombies[]    { type, count, lane? } spawned in list order;
//         │               lane is 0-4 (top to bottom), omit it for a random lane
//         ├─ seconds      the chunk's zombies are spread evenly over this long
//         │               (this is the spawn rate: 6 zombies over 12s = 1 every 2s)
//         └─ pauseAfter   optional seconds before the next chunk starts
//
// Every zombie is tagged with the wave and chunk that spawned it, which is what
// lets a wave wait for its own zombies rather than for an empty board.
// ---------------------------------------------------------------------------

export type LevelSpawnGroup = { type: ZombieType; count: number; lane?: number };

export type LevelSpawnChunk = {
  zombies: LevelSpawnGroup[];
  seconds: number;
  pauseAfter?: number;
};

export type LevelSpawnWave = {
  breakBefore: number;
  chunks: LevelSpawnChunk[];
};

export type LevelSpawn = {
  id: string;
  name: string;
  waves: LevelSpawnWave[];
};

// The original easy/medium/hard scripts, carried over from the old
// orchestrationSteps.ts. Each old 'time' step became the breakBefore of the
// wave after it. The one real change is that a break now starts only once the
// previous wave is dead, so these play slower than they used to.
export const DIFFICULTY_SPAWNS: Record<RoomDifficulty, LevelSpawn> = {
  easy: {
    id: 'easy',
    name: 'Easy',
    waves: [
      { breakBefore: 8, chunks: [{ zombies: [{ type: 'shambler', count: 2 }], seconds: 20 }] },
      { breakBefore: 10, chunks: [{ zombies: [{ type: 'shambler', count: 3 }], seconds: 22 }] },
      { breakBefore: 10, chunks: [{ zombies: [{ type: 'shambler', count: 3 }, { type: 'runner', count: 1 }], seconds: 22 }] },
      { breakBefore: 12, chunks: [{ zombies: [{ type: 'brute', count: 1 }], seconds: 6 }] },
    ],
  },
  medium: {
    id: 'medium',
    name: 'Medium',
    waves: [
      { breakBefore: 6, chunks: [{ zombies: [{ type: 'shambler', count: 3 }], seconds: 18 }] },
      { breakBefore: 8, chunks: [{ zombies: [{ type: 'shambler', count: 4 }, { type: 'runner', count: 2 }], seconds: 20 }] },
      { breakBefore: 8, chunks: [{ zombies: [{ type: 'shambler', count: 3 }, { type: 'runner', count: 5 }], seconds: 20 }] },
      { breakBefore: 10, chunks: [{ zombies: [{ type: 'runner', count: 3 }, { type: 'brute', count: 1 }], seconds: 10 }] },
    ],
  },
  hard: {
    id: 'hard',
    name: 'Hard',
    waves: [
      { breakBefore: 4, chunks: [{ zombies: [{ type: 'shambler', count: 4 }, { type: 'runner', count: 2 }], seconds: 16 }] },
      { breakBefore: 5, chunks: [{ zombies: [{ type: 'shambler', count: 5 }, { type: 'runner', count: 4 }], seconds: 18 }] },
      { breakBefore: 5, chunks: [{ zombies: [{ type: 'shambler', count: 4 }, { type: 'runner', count: 8 }], seconds: 18 }] },
      { breakBefore: 6, chunks: [{ zombies: [{ type: 'runner', count: 6 }, { type: 'brute', count: 2 }], seconds: 14 }] },
    ],
  },
};

// The 10 campaign levels, easiest first. Each one adds a single new idea:
//   1-2  shamblers, then runners
//   3-4  coneheads, then mixed waves
//   5    first brute
//   6    lane-targeted pushes (the `lane` field)
//   7-9  more waves, shorter breaks, faster chunks
//   10   two brutes behind a full escort
// Breaks shrink from ~12s to ~4s across the run, and the opening break (time to
// plant the first sunflowers) from 15s to 8s.
export const LEVEL_SPAWNS: LevelSpawn[] = [
  {
    id: 'level-1',
    name: 'Front Lawn',
    waves: [
      { breakBefore: 15, chunks: [{ zombies: [{ type: 'shambler', count: 2 }], seconds: 20 }] },
      { breakBefore: 12, chunks: [{ zombies: [{ type: 'shambler', count: 3 }], seconds: 20 }] },
      { breakBefore: 12, chunks: [{ zombies: [{ type: 'shambler', count: 4 }], seconds: 20 }] },
    ],
  },
  {
    id: 'level-2',
    name: 'Picket Fence',
    waves: [
      { breakBefore: 15, chunks: [{ zombies: [{ type: 'shambler', count: 3 }], seconds: 20 }] },
      { breakBefore: 12, chunks: [{ zombies: [{ type: 'shambler', count: 3 }, { type: 'runner', count: 1 }], seconds: 20 }] },
      {
        breakBefore: 12,
        chunks: [
          { zombies: [{ type: 'shambler', count: 3 }], seconds: 12, pauseAfter: 4 },
          { zombies: [{ type: 'runner', count: 2 }], seconds: 6 },
        ],
      },
    ],
  },
  {
    id: 'level-3',
    name: 'Cone Zone',
    waves: [
      { breakBefore: 14, chunks: [{ zombies: [{ type: 'shambler', count: 3 }], seconds: 18 }] },
      { breakBefore: 12, chunks: [{ zombies: [{ type: 'shambler', count: 2 }, { type: 'conehead', count: 1 }], seconds: 18 }] },
      {
        breakBefore: 11,
        chunks: [
          { zombies: [{ type: 'shambler', count: 3 }, { type: 'runner', count: 1 }], seconds: 14, pauseAfter: 3 },
          { zombies: [{ type: 'conehead', count: 2 }], seconds: 8 },
        ],
      },
    ],
  },
  {
    id: 'level-4',
    name: 'Mixed Company',
    waves: [
      { breakBefore: 13, chunks: [{ zombies: [{ type: 'shambler', count: 4 }], seconds: 18 }] },
      { breakBefore: 11, chunks: [{ zombies: [{ type: 'shambler', count: 3 }, { type: 'runner', count: 2 }], seconds: 18 }] },
      { breakBefore: 10, chunks: [{ zombies: [{ type: 'conehead', count: 2 }, { type: 'shambler', count: 3 }], seconds: 18 }] },
      {
        breakBefore: 10,
        chunks: [
          { zombies: [{ type: 'shambler', count: 4 }, { type: 'conehead', count: 2 }], seconds: 16, pauseAfter: 3 },
          { zombies: [{ type: 'runner', count: 3 }], seconds: 6 },
        ],
      },
    ],
  },
  {
    id: 'level-5',
    name: 'Heavy Footsteps',
    waves: [
      { breakBefore: 12, chunks: [{ zombies: [{ type: 'shambler', count: 4 }, { type: 'runner', count: 1 }], seconds: 18 }] },
      { breakBefore: 10, chunks: [{ zombies: [{ type: 'conehead', count: 2 }, { type: 'shambler', count: 3 }, { type: 'runner', count: 2 }], seconds: 18 }] },
      { breakBefore: 10, chunks: [{ zombies: [{ type: 'conehead', count: 3 }, { type: 'runner', count: 3 }], seconds: 16 }] },
      // First boss. The long break telegraphs it.
      {
        breakBefore: 14,
        chunks: [
          { zombies: [{ type: 'shambler', count: 3 }], seconds: 6, pauseAfter: 2 },
          { zombies: [{ type: 'brute', count: 1 }], seconds: 1 },
        ],
      },
    ],
  },
  {
    id: 'level-6',
    name: 'Flank Attack',
    waves: [
      { breakBefore: 12, chunks: [{ zombies: [{ type: 'shambler', count: 5 }], seconds: 16 }] },
      // Lane pushes: a column of coneheads down one lane, then the other edge.
      {
        breakBefore: 10,
        chunks: [
          { zombies: [{ type: 'conehead', count: 3, lane: 0 }], seconds: 8, pauseAfter: 4 },
          { zombies: [{ type: 'conehead', count: 3, lane: 4 }], seconds: 8 },
        ],
      },
      { breakBefore: 9, chunks: [{ zombies: [{ type: 'shambler', count: 4 }, { type: 'runner', count: 4 }], seconds: 16 }] },
      {
        breakBefore: 9,
        chunks: [
          { zombies: [{ type: 'runner', count: 4, lane: 2 }], seconds: 6, pauseAfter: 3 },
          { zombies: [{ type: 'conehead', count: 3 }, { type: 'shambler', count: 4 }], seconds: 14 },
        ],
      },
    ],
  },
  {
    id: 'level-7',
    name: 'Night Shift',
    waves: [
      { breakBefore: 11, chunks: [{ zombies: [{ type: 'shambler', count: 5 }, { type: 'runner', count: 1 }], seconds: 16 }] },
      { breakBefore: 9, chunks: [{ zombies: [{ type: 'conehead', count: 3 }, { type: 'shambler', count: 3 }], seconds: 15 }] },
      { breakBefore: 8, chunks: [{ zombies: [{ type: 'runner', count: 6 }, { type: 'conehead', count: 2 }], seconds: 14 }] },
      {
        breakBefore: 8,
        chunks: [
          { zombies: [{ type: 'conehead', count: 2, lane: 1 }, { type: 'conehead', count: 2, lane: 3 }], seconds: 8, pauseAfter: 3 },
          { zombies: [{ type: 'shambler', count: 5 }, { type: 'runner', count: 3 }], seconds: 12 },
        ],
      },
      {
        breakBefore: 12,
        chunks: [
          { zombies: [{ type: 'runner', count: 4 }], seconds: 6, pauseAfter: 2 },
          { zombies: [{ type: 'brute', count: 1 }], seconds: 1 },
        ],
      },
    ],
  },
  {
    id: 'level-8',
    name: 'Rush Hour',
    waves: [
      { breakBefore: 10, chunks: [{ zombies: [{ type: 'shambler', count: 4 }, { type: 'runner', count: 3 }], seconds: 14 }] },
      { breakBefore: 8, chunks: [{ zombies: [{ type: 'conehead', count: 4 }, { type: 'runner', count: 3 }], seconds: 14 }] },
      {
        breakBefore: 7,
        chunks: [
          { zombies: [{ type: 'runner', count: 6 }], seconds: 6, pauseAfter: 3 },
          { zombies: [{ type: 'conehead', count: 4 }, { type: 'shambler', count: 3 }], seconds: 12 },
        ],
      },
      { breakBefore: 7, chunks: [{ zombies: [{ type: 'shambler', count: 6 }, { type: 'conehead', count: 3 }, { type: 'runner', count: 4 }], seconds: 16 }] },
      {
        breakBefore: 10,
        chunks: [
          { zombies: [{ type: 'conehead', count: 4 }, { type: 'runner', count: 4 }], seconds: 10, pauseAfter: 2 },
          { zombies: [{ type: 'brute', count: 1 }], seconds: 1 },
        ],
      },
    ],
  },
  {
    id: 'level-9',
    name: 'No Rest',
    waves: [
      { breakBefore: 9, chunks: [{ zombies: [{ type: 'shambler', count: 5 }, { type: 'conehead', count: 2 }], seconds: 14 }] },
      { breakBefore: 6, chunks: [{ zombies: [{ type: 'runner', count: 6 }, { type: 'conehead', count: 3 }], seconds: 12 }] },
      {
        breakBefore: 6,
        chunks: [
          { zombies: [{ type: 'conehead', count: 3, lane: 0 }, { type: 'conehead', count: 3, lane: 4 }], seconds: 10, pauseAfter: 2 },
          { zombies: [{ type: 'runner', count: 5 }], seconds: 6 },
        ],
      },
      { breakBefore: 5, chunks: [{ zombies: [{ type: 'shambler', count: 6 }, { type: 'conehead', count: 4 }, { type: 'runner', count: 5 }], seconds: 15 }] },
      {
        breakBefore: 9,
        chunks: [
          { zombies: [{ type: 'conehead', count: 4 }, { type: 'runner', count: 4 }], seconds: 10, pauseAfter: 2 },
          { zombies: [{ type: 'brute', count: 1 }], seconds: 1, pauseAfter: 6 },
          { zombies: [{ type: 'runner', count: 4 }], seconds: 6 },
        ],
      },
    ],
  },
  {
    id: 'level-10',
    name: 'Last Stand',
    waves: [
      { breakBefore: 8, chunks: [{ zombies: [{ type: 'shambler', count: 6 }, { type: 'runner', count: 3 }], seconds: 14 }] },
      { breakBefore: 6, chunks: [{ zombies: [{ type: 'conehead', count: 5 }, { type: 'runner', count: 4 }], seconds: 13 }] },
      {
        breakBefore: 5,
        chunks: [
          { zombies: [{ type: 'runner', count: 4, lane: 1 }, { type: 'runner', count: 4, lane: 3 }], seconds: 8, pauseAfter: 2 },
          { zombies: [{ type: 'conehead', count: 5 }], seconds: 8 },
        ],
      },
      { breakBefore: 5, chunks: [{ zombies: [{ type: 'shambler', count: 6 }, { type: 'conehead', count: 5 }, { type: 'runner', count: 6 }], seconds: 15 }] },
      {
        breakBefore: 6,
        chunks: [
          { zombies: [{ type: 'conehead', count: 6 }], seconds: 8, pauseAfter: 2 },
          { zombies: [{ type: 'brute', count: 1 }], seconds: 1 },
        ],
      },
      // Finale: two brutes, staggered, each behind an escort heavy enough that
      // it can't be ignored while the brute is focused down.
      {
        breakBefore: 12,
        chunks: [
          { zombies: [{ type: 'runner', count: 5 }, { type: 'conehead', count: 3 }], seconds: 10, pauseAfter: 2 },
          { zombies: [{ type: 'brute', count: 1 }], seconds: 1, pauseAfter: 8 },
          { zombies: [{ type: 'conehead', count: 4 }, { type: 'runner', count: 3 }], seconds: 8, pauseAfter: 2 },
          { zombies: [{ type: 'brute', count: 1 }], seconds: 1 },
        ],
      },
    ],
  },
];

export const LEVEL_COUNT = LEVEL_SPAWNS.length;

// Levels are numbered from 1 on the wire and in the UI.
export function getLevelSpawn(level: number): LevelSpawn | undefined {
  return Number.isInteger(level) ? LEVEL_SPAWNS[level - 1] : undefined;
}
