import { folders } from './charactersData';
import type { Summon, Character } from '../types/types';

type Banner = 'perma' | 'ml' | 'limited';
type PityType = 'no pity' | 'soft pity' | 'hard pity';

interface PullResult {
  pull: Summon;
  newPity: number;
}

function getSoftPityBonus(pityCount: number): number {
  if (pityCount < 50 || pityCount >= 80) return 0;
  const x = pityCount - 50;
  const maxSoftPity = 0.15;
  const rate = (Math.log(1 + x) / Math.log(30)) * maxSoftPity;
  return Math.min(rate, maxSoftPity);
}

function getCharactersByFolderName(name: string): Character[] {
  const folder = folders.find(f => f.name === name);
  if (!folder) throw new Error(`Folder "${name}" not found`);
  return folder.images;
}

function randomItem<T>(array: T[]): T {
  if (!array || array.length === 0) {
    throw new Error("Attempted to pick random item from empty or undefined array");
  }
  return array[Math.floor(Math.random() * array.length)];
}

export function performSinglePull(pityCount: number, banner: Banner): PullResult {
  let character: Character;
  let pityType: PityType = 'no pity';

  const ssrChars = getCharactersByFolderName('ssr');
  const mlChars = getCharactersByFolderName('ml');
  const srChars = getCharactersByFolderName('sr');
  const rChars = getCharactersByFolderName('r');

  const freya = ssrChars.find(c => c.title === 'Freya');
  if (!freya) throw new Error('Freya not found in SSR characters');

  if (banner === 'limited') {
    const baseFreya = 0.01;
    const srRate = 0.15;

    const bonusFreya = getSoftPityBonus(pityCount); // max +15%
    const finalFreya = baseFreya + bonusFreya;

    const rRate = 1 - finalFreya - srRate;

    if (pityCount >= 80) {
      character = freya;
      pityType = 'hard pity';
      pityCount = 0;
    } else {
      const rand = Math.random();
      if (rand < finalFreya) {
        character = freya;
        pityType = pityCount >= 50 ? 'soft pity' : 'no pity';
        pityCount = 0;
      } else if (rand < finalFreya + srRate) {
        character = randomItem(srChars);
        pityCount++;
      } else {
        character = randomItem(rChars);
        pityCount++;
      }
    }
  } else {
    // perma / ml logic
    let baseSSR = 0.0075;
    let baseML = 0.0025;
    const baseSR = 0.15;
    const baseR = 1 - (baseSSR + baseML + baseSR);

    if (banner === 'ml') {
      baseSSR = 0;
      baseML = 0.01;
    }

    const softPityBonus = getSoftPityBonus(pityCount);
    const totalBase = baseSSR + baseML;

    let softSSR = 0;
    let softML = 0;

    if (totalBase > 0) {
      softSSR = softPityBonus * (baseSSR / totalBase);
      softML = softPityBonus * (baseML / totalBase);
    } else {
      softML = softPityBonus;
    }

    const finalSSR = baseSSR + softSSR;
    const finalML = baseML + softML;

    const weights = [finalSSR, finalML, baseSR, baseR];
    const pools = [ssrChars, mlChars, srChars, rChars];

    const totalWeight = weights.reduce((a, b) => a + b, 0);
    const rand = Math.random() * totalWeight;

    let cumWeight = 0;
    let folderIndex = 3;

    for (let i = 0; i < weights.length; i++) {
      cumWeight += weights[i];
      if (rand < cumWeight) {
        folderIndex = i;
        break;
      }
    }

    if (banner === 'ml' && pityCount >= 80) {
      character = randomItem(mlChars);
      pityType = 'hard pity';
      pityCount = 0;
    } else if (banner === 'perma' && pityCount >= 80) {
      const hardPityPool = ssrChars.concat(mlChars);
      character = randomItem(hardPityPool);
      pityType = 'hard pity';
      pityCount = 0;
    } else {
      character = randomItem(pools[folderIndex]);

      if (pityCount >= 50 && (folderIndex === 0 || folderIndex === 1)) {
        pityType = 'soft pity';
        pityCount = 0;
      } else if (folderIndex === 0 || folderIndex === 1) {
        pityCount = 0;
      } else {
        pityCount += 1;
      }
    }
  }

  const pull: Summon = {
    character,
    banner,
    pityCount,
    pityType,
    timestamp: Date.now(),
  };

  const count = parseInt(localStorage.getItem('summonCount') || '0', 10);
  localStorage.setItem('summonCount', (count + 1).toString());

  return { pull, newPity: pityCount };
}


export function performMultiPull(pityCount: number, banner: Banner): { pulls: Summon[]; newPity: number } {
  const pulls: Summon[] = [];
  let newPity = pityCount;
  for (let i = 0; i < 10; i++) {
    const { pull, newPity: updated } = performSinglePull(newPity, banner);
    pulls.push(pull);
    newPity = updated;
  }
  return { pulls, newPity };
}

export function perform85Pull(pityCount: number, banner: Banner): { pulls: Summon[]; newPity: number } {
  const pulls: Summon[] = [];
  let newPity = pityCount;
  for (let i = 0; i < 85; i++) {
    const { pull, newPity: updated } = performSinglePull(newPity, banner);
    pulls.push(pull);
    newPity = updated;
  }
  return { pulls, newPity };
}

export function performCustomPull(pityCount: number, banner: Banner, custom: number): { pulls: Summon[]; newPity: number } {
  const pulls: Summon[] = [];
  let newPity = pityCount;
  for (let i = 0; i < custom; i++) {
    const { pull, newPity: updated } = performSinglePull(newPity, banner);
    pulls.push(pull);
    newPity = updated;
  }
  return { pulls, newPity };
}
