import { folders } from './charactersData';
import { Pull, FolderName, ImageData } from './types';

const SSR_FOLDER: FolderName = 'ssr';
const SR_FOLDER: FolderName = 'sr';

function getSSRChance(pityCounter: number): number {
  if (pityCounter < 50) return 0;
  const softMax = 15; // 15%
  const progress = pityCounter - 50;
  return Math.min(softMax, Math.log1p(progress) / Math.log1p(29) * softMax) / 100;
}

function getRandomFolderName(rates: Record<FolderName, number>, pityCounter: number): FolderName {
  const baseSSRRate = folders.find(f => f.name === SSR_FOLDER)!.rate;
  const softPityRate = getSSRChance(pityCounter);
  const adjustedRates = { ...rates };
  adjustedRates[SSR_FOLDER] += softPityRate;

  const total = Object.values(adjustedRates).reduce((a, b) => a + b, 0);
  const rand = Math.random() * total;
  let acc = 0;

  for (const [folder, rate] of Object.entries(adjustedRates)) {
    acc += rate;
    if (rand <= acc) return folder as FolderName;
  }

  return 'r';
}

function getRandomImage(folderName: FolderName): ImageData {
  const folder = folders.find(f => f.name === folderName)!;
  return folder.images[Math.floor(Math.random() * folder.images.length)];
}

export function performSinglePull(pityCounter: number): { pull: Pull; newPity: number } {
  let pityType: Pull['pityType'] = 'no pity';

  // Hard pity
  if (pityCounter >= 79) {
    const image = getRandomImage(SSR_FOLDER);
    return {
      pull: {
        folder: SSR_FOLDER,
        image,
        timestamp: Date.now(),
        pityType: 'hard pity',
      },
      newPity: 0,
    };
  }

  const folderName = getRandomFolderName(
    Object.fromEntries(folders.map(f => [f.name, f.rate])) as Record<FolderName, number>,
    pityCounter
  );

  const image = getRandomImage(folderName);

  if (folderName === SSR_FOLDER) {
    pityType = pityCounter >= 50 ? 'soft pity' : 'no pity';
  }

  const newPity = folderName === SSR_FOLDER ? 0 : pityCounter + 1;

  return {
    pull: {
      folder: folderName,
      image,
      timestamp: Date.now(),
      pityType,
    },
    newPity,
  };
}

export function performMultiPull(pityCounter: number): { pulls: Pull[]; newPity: number } {
  const pulls: Pull[] = [];
  let pity = pityCounter;

  for (let i = 0; i < 10; i++) {
    const result = performSinglePull(pity);
    pulls.push(result.pull);
    pity = result.newPity;
  }

  const hasSRorAbove = pulls.some(p => p.folder === SSR_FOLDER || p.folder === SR_FOLDER);

  if (!hasSRorAbove) {
    // Replace one R pull with SR
    const rIndex = pulls.findIndex(p => p.folder === 'r');
    if (rIndex !== -1) {
      const image = getRandomImage(SR_FOLDER);
      pulls[rIndex] = {
        folder: SR_FOLDER,
        image,
        timestamp: Date.now(),
        pityType: 'no pity',
      };
    }
  }

  return { pulls, newPity: pity };
}
