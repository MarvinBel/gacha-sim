import { incrementSummonCount } from '../services/StorageService';
import type { Summon, Character } from '../types/types';
import { getSoftPityBonus, getCharactersByFolderName, weightedRandom, randomItem } from './pullUtils';

type Banner = 'perma' | 'ml' | 'limited';
type PityType = 'no pity' | 'soft pity' | 'hard pity';

interface PullResult {
  pull: Summon;
  newPity: number;
  newSrPity: number;
}

export function performSinglePull(pityCount: number,  srPityCount: number, banner: Banner): PullResult {
  const pssr = getCharactersByFolderName('ssr').filter(character => character.title !== 'Lian');
  const ssr = pssr.filter(character => character.title !== 'Hoyan');
  const ml = getCharactersByFolderName('ml');
  const sr = getCharactersByFolderName('sr');
  const r = getCharactersByFolderName('r');

  const freya = ssr.find(c => c.title === 'Freya');
  if (!freya) throw new Error('Freya not found');

  const rareSRs = sr.slice(0, 6);

  let character: Character | undefined;
  let pityType: PityType = 'no pity';

  if (banner === 'limited') {
    const baseSSR = 0.01;
    const softPityBonus = getSoftPityBonus(pityCount);
    const finalSSR = baseSSR + softPityBonus;
    const srRate = 0.09;

    if (pityCount >= 80) {
      character = freya;
      pityType = 'hard pity';
      pityCount = 0;
      srPityCount++;
    } else {
      const rand = Math.random();
      if (rand < finalSSR) {
        character = freya;
        pityType = pityCount >= 50 ? 'soft pity' : 'no pity';
        pityCount = 0;
        srPityCount++;
      } else if (srPityCount >= 9) {
        character = weightedRandom(sr, sr.map((_, i) => i < 6 ? 0.0225 : 0.0675));
        pityCount++;
        srPityCount = 0;
      } else if (rand < finalSSR + srRate) {
        character = weightedRandom(sr, sr.map((_, i) => i < 6 ? 0.0225 : 0.0675));
        pityCount++;
        srPityCount = 0;
      } else {
        character = randomItem(r);
        pityCount++;
        srPityCount++;
      }
    }
  }

  else if (banner === 'ml') {
    const baseML = 0.01;
    const baseSR = 0.09;

    if (pityCount >= 80) {
      character = randomItem(ml);
      pityType = 'hard pity';
      pityCount = 0;
      srPityCount++;
    } else {
      const rand = Math.random();
      if (rand < baseML) {
        character = randomItem(ml);
        pityType = pityCount >= 50 ? 'soft pity' : 'no pity';
        pityCount = 0;
        srPityCount++;
      } else if (srPityCount >= 9 || rand < baseML + baseSR) {
        character = randomItem(rareSRs);
        pityCount++;
        srPityCount = 0;
      } else {
        character = randomItem(r);
        pityCount++;
        srPityCount++;
      }
    }
  }

  else if (banner === 'perma') {
    const baseSSR = 0.0075;
    const baseML = 0.0025;
    const baseSR = 0.09;
    const baseR = 1 - baseSSR - baseML - baseSR;

    const softPityBonus = getSoftPityBonus(pityCount);
    const totalBase = baseSSR + baseML;
    const bonusSSR = softPityBonus * (baseSSR / totalBase);
    const bonusML = softPityBonus * (baseML / totalBase);

    const finalSSR = baseSSR + bonusSSR;
    const finalML = baseML + bonusML;
    const finalSR = baseSR;
    const finalR = baseR;

    if (pityCount >= 80) {
      character = randomItem([...ssr, ...ml]);
      pityType = 'hard pity';
      pityCount = 0;
      srPityCount++;
    } else {
      const rand = Math.random();
      if (rand < finalSSR) {
        character = randomItem(ssr);
        pityType = pityCount >= 50 ? 'soft pity' : 'no pity';
        pityCount = 0;
        srPityCount++;
      } else if (rand < finalSSR + finalML) {
        character = randomItem(ml);
        pityType = pityCount >= 50 ? 'soft pity' : 'no pity';
        pityCount = 0;
        srPityCount++;
      } else if (srPityCount >= 9 || rand < finalSSR + finalML + finalSR) {
        character = weightedRandom(sr, sr.map((_, i) => i < 6 ? 0.0225 : 0.0675));
        pityCount++;
        srPityCount = 0;
      } else {
        character = randomItem(r);
        pityCount++;
        srPityCount++;
      }
    }
  } else {
    character = randomItem(r);
    pityType = 'no pity';
    pityCount++;
    srPityCount++;
  }

  const pull: Summon = {
    character: character!,
    banner,
    pityCount,
    pityType,
    timestamp: Date.now(),
  };

  incrementSummonCount(1)

  return { pull, newPity: pityCount, newSrPity: srPityCount };
}

export function performMultiPull(pityCount: number, srPityCount: number, banner: Banner): { pulls: Summon[]; newPity: number; newSrPity: number } {
  const pulls: Summon[] = [];
  let newPity = pityCount;
  let newSrPity = srPityCount;
  for (let i = 0; i < 10; i++) {
    const { pull, newPity: updatedPity, newSrPity: updatedSR } = performSinglePull(newPity, newSrPity, banner);
    pulls.push(pull);
    newPity = updatedPity;
    newSrPity = updatedSR;
  }
  return { pulls, newPity, newSrPity };
}

export function perform85Pull(pityCount: number, srPityCount: number, banner: Banner): { pulls: Summon[]; newPity: number; newSrPity: number } {
  const pulls: Summon[] = [];
  let newPity = pityCount;
  let newSrPity = srPityCount;
  for (let i = 0; i < 85; i++) {
    const { pull, newPity: updatedPity, newSrPity: updatedSR } = performSinglePull(newPity, newSrPity, banner);
    pulls.push(pull);
    newPity = updatedPity;
    newSrPity = updatedSR;
  }
  return { pulls, newPity, newSrPity };
}

export function performCustomPull(pityCount: number, srPityCount: number, banner: Banner, custom: number): { pulls: Summon[]; newPity: number; newSrPity: number } {
  const pulls: Summon[] = [];
  let newPity = pityCount;
  let newSrPity = srPityCount;
  for (let i = 0; i < custom; i++) {
    const { pull, newPity: updatedPity, newSrPity: updatedSR } = performSinglePull(newPity, newSrPity, banner);
    pulls.push(pull);
    newPity = updatedPity;
    newSrPity = updatedSR;
  }
  return { pulls, newPity, newSrPity };
}
