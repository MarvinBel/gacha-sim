import Cookies from "js-cookie";
import { Summon, PityHistory } from '../types/types';
import { TeamData } from "../types/types";


export const getPity = (banner: string): number => {
  const data = Cookies.get(`pity-${banner}`);
  return data ? parseInt(data, 10) : 0;
};

export const incrementPity = (banner: string) => {
  const current = getPity(banner);
  Cookies.set(`pity-${banner}`, (current + 1).toString(), { expires: 30 });
};

export const resetPity = (banner: string) => {
  Cookies.set(`pity-${banner}`, '0', { expires: 30 });
};

export const savePity = (value: number, banner: string) => {
  const data = Cookies.get('pity-history');
  const history: PityHistory[] = data ? JSON.parse(data) : [];
  history.unshift({ banner, pulls: value, date: new Date().toISOString() });
  Cookies.set('pity-history', JSON.stringify(history), { expires: 30 });
};

export const getPityHistory = (): PityHistory[] => {
  const data = Cookies.get('pity-history');
  return data ? JSON.parse(data) : [];
};

export async function loadAllSummons(): Promise<Summon[]> {
  try {
    const data = Cookies.get('summons');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erreur lors du chargement des summons :', error);
    return [];
  }
}

const SUMMON_COUNT_KEY = "summonCount";

export const getSummonCount = (): number => {
  const value = Cookies.get(SUMMON_COUNT_KEY);
  return value ? parseInt(value, 10) : 0;
};

export const setSummonCount = (count: number) => {
  Cookies.set(SUMMON_COUNT_KEY, count.toString(), { expires: 30 });
};

export const incrementSummonCount = (by: number = 1) => {
  const current = getSummonCount();
  setSummonCount(current + by);
};

export const resetSummonCount = () => {
  setSummonCount(0);
};


const COOKIE_KEY = "team_data";

export const getTeamsFromCookies = (): TeamData => {
  const data = Cookies.get(COOKIE_KEY);
  return data ? JSON.parse(data) : {};
};

export const saveTeamsToCookies = (teams: TeamData) => {
  Cookies.set(COOKIE_KEY, JSON.stringify(teams), {
    expires: 30,
    sameSite: "strict",
  });
};

export const getSummons = (): Summon[] => {
  const data = localStorage.getItem('summons');
  return data ? JSON.parse(data) : [];
};

export const saveSummon = (summon: Summon) => {
  const current = getSummons();
  const updated = [summon, ...current];
  localStorage.setItem('summons', JSON.stringify(updated));
};

export function clearSummons() {
  localStorage.removeItem('summons');
  Cookies.set("summonCount", "0", { expires: 30 });
}


export function getSSRStats() {
  const summons = getSummons();

  if (!summons.length) {
    return { average: 0, totalSSR: 0, totalPulls: 0 };
  }

  const ssrCount = summons.filter(s => s.character.folder === "ssr").length;
  const total = summons.length;
  const average = +(ssrCount / total).toFixed(4); // Ex: 0.0125 = 1.25 %

  return {
    average,
    totalSSR: ssrCount,
    totalPulls: total,
  };
}