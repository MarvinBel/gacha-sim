import { Character } from "../types/types";
import { folders } from "./charactersData";

export function getSoftPityBonus(pityCount: number): number {
  if (pityCount < 50 || pityCount >= 80) return 0;
  const x = pityCount - 50;
  const maxBonus = 0.15;
  return Math.min((Math.log(1 + x) / Math.log(30)) * maxBonus, maxBonus);
}

export function getCharactersByFolderName(name: string): Character[] {
  const folder = folders.find(f => f.name === name);
  if (!folder) throw new Error(`Folder "${name}" not found`);
  return folder.images;
}

export function randomItem<T>(arr: T[]): T {
  if (!arr.length) throw new Error('Empty array in randomItem');
  return arr[Math.floor(Math.random() * arr.length)];
}

export function weightedRandom<T>(items: T[], weights: number[]): T {
  const total = weights.reduce((a, b) => a + b, 0);
  const r = Math.random() * total;
  let acc = 0;
  for (let i = 0; i < items.length; i++) {
    acc += weights[i];
    if (r < acc) return items[i];
  }
  return items[items.length - 1];
}