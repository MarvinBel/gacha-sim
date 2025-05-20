import { Summon, PityHistory } from '../types/types';

export const getSummons = (): Summon[] => {
  const data = localStorage.getItem('summons');
  return data ? JSON.parse(data) : [];
};

export const saveSummon = (summon: Summon) => {
  const current = getSummons();
  localStorage.setItem('summons', JSON.stringify([summon, ...current]));
};

export const getPity = (banner: string): number => {
  const data = localStorage.getItem(`pity-${banner}`);
  return data ? parseInt(data, 10) : 0;
};

export const incrementPity = (banner: string) => {
  const current = getPity(banner);
  localStorage.setItem(`pity-${banner}`, (current + 1).toString());
};

export const resetPity = (banner: string) => {
  localStorage.setItem(`pity-${banner}`, '0');
};

export const savePity = (value: number, banner: string) => {
  const data = localStorage.getItem('pity-history');
  const history: PityHistory[] = data ? JSON.parse(data) : [];
  history.unshift({ banner, pulls: value, date: new Date().toISOString() });
  localStorage.setItem('pity-history', JSON.stringify(history));
};

export const getPityHistory = (): PityHistory[] => {
  const data = localStorage.getItem('pity-history');
  return data ? JSON.parse(data) : [];
};
