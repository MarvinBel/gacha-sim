import { folders } from './charactersData';
import { Summon } from '../types/types';

type PityType = "no pity" | "soft pity" | "hard pity";

/**
 * Tirage pondéré d'un folder selon son taux.
 */
function getRandomFolder(): typeof folders[number] {
  const rand = Math.random();
  let cumulative = 0;

  for (const folder of folders) {
    cumulative += folder.rate;
    if (rand < cumulative) {
      return folder;
    }
  }

  // En cas de problème (arrondi), retourner le dernier folder par défaut
  return folders[folders.length - 1];
}

/**
 * Tirage aléatoire d'un personnage dans un folder donné.
 */
function getRandomCharacterFromFolder(folder: typeof folders[number]): Summon['character'] {
  const chars = folder.images;
  const idx = Math.floor(Math.random() * chars.length);
  return chars[idx];
}

export function performSinglePull(pityCount: number): { pull: Summon; newPity: number } {
  const newPity = pityCount + 1;

  const folder = getRandomFolder();
  const character = getRandomCharacterFromFolder(folder);

  const pull: Summon = {
    character,
    banner: 'perma',
    pityCount: newPity,
    pityType: determinePityType(newPity),
    timestamp: Date.now(),
  };

  return { pull, newPity };
}

export function performMultiPull(pityCount: number): { pulls: Summon[]; newPity: number } {
  let newPity = pityCount;
  const pulls: Summon[] = [];

  for (let i = 0; i < 10; i++) {
    newPity++;

    const folder = getRandomFolder();
    const character = getRandomCharacterFromFolder(folder);

    pulls.push({
      character,
      banner: 'perma',
      pityCount: newPity,
      pityType: determinePityType(newPity),
      timestamp: Date.now(),
    });
  }

  return { pulls, newPity };
}

function determinePityType(pityCount: number): PityType {
  if (pityCount >= 80) return "hard pity";
  if (pityCount >= 50) return "soft pity";
  return "no pity";
}
