import { Summon } from '../types/types';
import { getPity, incrementPity } from './StorageService';
import { saveSummon } from './StorageService';

export function performSinglePull(pityCount: number): { pull: Summon; newPity: number } {
  const newPity = pityCount + 1;

  const character: Summon['character'] = {
    filename: 'character1.png',
    title: 'Character 1',
    folder: 'ssr',
  };

  const result: Summon = {
    character,
    banner: 'perma',
    pityCount: newPity,
    pityType: determinePityType(newPity),
    timestamp: Date.now(),
  };

  saveSummon(result);

  return { pull: result, newPity };
}

export function performMultiPull(pityCount: number): { pulls: Summon[]; newPity: number } {
  let newPity = pityCount;
  const pulls: Summon[] = [];

  for (let i = 0; i < 10; i++) {
    newPity++;

    const character: Summon['character'] = {
      filename: `character${i + 1}.png`,
      title: `Character ${i + 1}`,
      folder: i === 9 ? 'ssr' : 'sr',
    };

    pulls.push({
      character,
      banner: 'perma',
      pityCount: newPity,
      pityType: determinePityType(newPity),
      timestamp: Date.now(),
    });
  }

  pulls.forEach(summon => saveSummon(summon));

  return { pulls, newPity };
}

function determinePityType(pityCount: number): 'no pity' | 'soft pity' | 'hard pity' {
  if (pityCount >= 80) return 'hard pity';
  if (pityCount >= 50) return 'soft pity';
  return 'no pity';
}
