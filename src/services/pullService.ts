// src/services/pullService.tsx

import characters from '../utils/allCharacters';
import { getPity, resetPity, incrementPity, saveSummon, savePity } from './StorageService';

// Importer les types depuis types/types.ts
import type { Character, Summon } from '../types/types';

const getRandom = (arr: Character[]) => arr[Math.floor(Math.random() * arr.length)];

const getRatePool = (banner: string): { pool: Character[]; rate: number; folder: Character['folder'] }[] => {
  if (banner === 'limited') {
    return [
      { pool: characters.ssr.filter(c => c.title.toLowerCase() === 'freya'), rate: 1, folder: 'ssr' },
    ];
  }
  if (banner === 'ml') {
    return [
      { pool: characters.ml, rate: 0.01, folder: 'ml' },
      { pool: characters.r, rate: 0.99, folder: 'r' },
    ];
  }
  return [
    { pool: characters.ssr, rate: 0.0075, folder: 'ssr' },
    { pool: characters.sr, rate: 0.15, folder: 'sr' },
    { pool: characters.r, rate: 0.8425, folder: 'r' },
  ];
};

const getSoftPityRate = (count: number) => {
  if (count < 50) return 0;
  if (count >= 80) return 1;
  const maxSoftPity = 0.15;
  const ratio = (count - 50) / 30;
  return ratio * maxSoftPity;
};

export const pullOne = (banner: string): Summon => {
  let pityCount = getPity(banner);
  const ratePools = getRatePool(banner);
  const softPityRate = (banner === 'perma' || banner === 'ml') ? getSoftPityRate(pityCount) : 0;

  let selected: Character | null = null;
  let pityType: Summon['pityType'] = 'no pity';

  if ((banner === 'perma' || banner === 'ml') && pityCount >= 79) {
    selected = getRandom(characters.ssr);
    pityType = 'hard pity';
  } else if (banner === 'limited' && pityCount >= 99) {
    selected = getRandom(characters.ssr.filter(c => c.title.toLowerCase() === 'freya'));
    pityType = 'hard pity';
  } else if (softPityRate && Math.random() < softPityRate) {
    selected = getRandom(characters.ssr);
    pityType = 'soft pity';
  }

  if (!selected) {
    let roll = Math.random();
    for (let { pool: poolGroup, rate } of ratePools) {
      if (roll < rate) {
        selected = getRandom(poolGroup);
        break;
      } else {
        roll -= rate;
      }
    }
  }

  if (!selected) selected = getRandom(characters.r);

  if (selected.folder === 'ssr') {
    savePity(pityCount, banner);
    resetPity(banner);
  } else {
    incrementPity(banner);
  }

  const result: Summon = {
    character: selected,
    pityType,
    banner,
    pityCount,
    timestamp: new Date().toISOString(),
  };

  saveSummon(result);
  return result;
};

export const pullTen = (banner: string): Summon[] => {
  const pulls = Array.from({ length: 10 }, () => pullOne(banner));
  const hasSSR = pulls.some(p => p.character.folder === 'ssr');
  const hasSR = pulls.some(p => p.character.folder === 'sr');

  if (!hasSSR && !hasSR) {
    const srPull: Summon = {
      character: getRandom(characters.sr),
      pityType: 'no pity',
      banner,
      pityCount: getPity(banner),
      timestamp: new Date().toISOString(),
    };
    pulls[9] = srPull;
    incrementPity(banner);
    saveSummon(srPull);
  }

  return pulls;
};
