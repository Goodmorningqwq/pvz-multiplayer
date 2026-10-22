import React, { useState } from 'react';
import GameSettings, { Difficulty } from '../GameSettings/GameSettings';

// Must match LEVEL_SPAWNS.length in the backend's levelSpawns.ts. The server
// rejects anything outside 1..LEVEL_COUNT by falling back to the difficulty
// preset, so a mismatch shows up as "level N plays like Medium", not a crash.
export const LEVEL_COUNT = 10;

type SoloView = 'choose' | 'levels' | 'custom';

type SoloSelectProps = {
  onBack: () => void;
  onPlayZen: () => void;
  onStartLevel: (level: number) => void;
  onStartCustom: (difficulty: Difficulty) => void;
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
};

// The singleplayer entry screen: Zen, Levels or Custom. Levels opens a grid of
// the campaign levels; Custom is the original easy/medium/hard picker.
export default function SoloSelect({
  onBack, onPlayZen, onStartLevel, onStartCustom, difficulty, onDifficultyChange,
}: SoloSelectProps) {
  const [view, setView] = useState<SoloView>('choose');

  if (view === 'custom') {
    return (
      <GameSettings
        mode="singleplayer"
        onBack={() => setView('choose')}
        onStartSolo={onStartCustom}
        onStartMultiplayer={() => {}}
        difficulty={difficulty}
        onDifficultyChange={onDifficultyChange}
      />
    );
  }

  if (view === 'levels') {
    return (
      <div className="menu-backdrop">
        <div className="menu-card">
          <h1 className="menu-title">Levels</h1>
          <p className="menu-subtitle">Pick a level</p>

          <div className="level-grid">
            {Array.from({ length: LEVEL_COUNT }, (_, index) => index + 1).map((level) => (
              <button key={level} type="button" className="level-button" onClick={() => onStartLevel(level)}>
                {level}
              </button>
            ))}
          </div>

          <button className="menu-link-button" type="button" onClick={() => setView('choose')}>
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-backdrop">
      <div className="menu-card">
        <h1 className="menu-title">Singleplayer</h1>
        <p className="menu-subtitle">Choose a mode</p>

        <div className="solo-mode-list">
          <button className="menu-secondary-button" type="button" onClick={onPlayZen}>
            Zen
          </button>
          <button className="menu-secondary-button" type="button" onClick={() => setView('levels')}>
            Levels
          </button>
          <button className="menu-secondary-button" type="button" onClick={() => setView('custom')}>
            Custom
          </button>
        </div>

        <button className="menu-link-button" type="button" onClick={onBack}>
          Back
        </button>
      </div>
    </div>
  );
}
