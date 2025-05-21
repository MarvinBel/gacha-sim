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

export function performSinglePull(pityCount: number, banner: Banner): PullResult {
  let baseSSR = 0.0075;
  let baseML = 0.0025;

  if (banner === 'ml') {
    baseSSR = 0;
    baseML = 0.01;
  }

  const baseSR = 0.15;
  const baseR = 1 - (baseSSR + baseML + baseSR);

  const softPityBonus = getSoftPityBonus(pityCount);

  const totalBase = baseSSR + baseML;
  let softSSR = 0;
  let softML = 0;

  if (totalBase > 0) {
    softSSR = softPityBonus * (baseSSR / totalBase);
    softML = softPityBonus * (baseML / totalBase);
  } else {
    softSSR = 0;
    softML = softPityBonus;
  }

  const finalSSR = baseSSR + softSSR;
  const finalML = baseML + softML;
  const finalSR = baseSR;
  const finalR = baseR;

  const weights = [finalSSR, finalML, finalSR, finalR];

  const ssrChars = folders.find(f => f.name === 'ssr')!.images;
  const mlChars = folders.find(f => f.name === 'ml')!.images;
  const srChars = folders.find(f => f.name === 'sr')!.images;
  const rChars = folders.find(f => f.name === 'r')!.images;

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

  const selectedPool = pools[folderIndex];
  const character = selectedPool[Math.floor(Math.random() * selectedPool.length)];

  let pityType: PityType = 'no pity';
  if (pityCount >= 80) {
    pityType = 'hard pity';
    pityCount = 0;
  } else if (pityCount >= 50 && (folderIndex === 0 || folderIndex === 1)) {
    pityType = 'soft pity';
  }

  const isSSRorML = folderIndex === 0 || folderIndex === 1;
  let newPity = pityCount;

  if ((pityType === 'soft pity' || pityType === 'hard pity') && isSSRorML) {
    newPity = 0;
  } else {
    newPity++;
  }

  const pull: Summon = {
    character,
    banner,
    pityCount: newPity,
    pityType,
    timestamp: Date.now(),
  };

  return { pull, newPity };
}

export function performMultiPull(pityCount: number, banner: Banner): { pulls: Summon[]; newPity: number } {
  let pulls: Summon[] = [];
  let newPity = pityCount;

  for (let i = 0; i < 10; i++) {
    const { pull, newPity: updatedPity } = performSinglePull(newPity, banner);
    pulls.push(pull);
    newPity = updatedPity;
  }

  return { pulls, newPity };
}

export function perform85Pull(pityCount: number, banner: Banner): { pulls: Summon[]; newPity: number } {
  let pulls: Summon[] = [];
  let newPity = pityCount;

  for (let i = 0; i < 85; i++) {
    const { pull, newPity: updatedPity } = performSinglePull(newPity, banner);
    pulls.push(pull);
    newPity = updatedPity;
  }

  return { pulls, newPity };
}

export function performCustomPull(pityCount: number, banner: Banner, custom: number): { pulls: Summon[]; newPity: number } {
  let pulls: Summon[] = [];
  let newPity = pityCount;

  for (let i = 0; i < custom; i++) {
    const { pull, newPity: updatedPity } = performSinglePull(newPity, banner);
    pulls.push(pull);
    newPity = updatedPity;
  }

  return { pulls, newPity };
}