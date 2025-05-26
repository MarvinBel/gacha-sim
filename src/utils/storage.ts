// src/utils/storage.ts

import { TeamData } from "../types/types";

const STORAGE_KEY = "team_data";

export const getTeamsFromStorage = (): TeamData => {
  if (typeof window === "undefined") return {};
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
};

export const saveTeamsToStorage = (teams: TeamData) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(teams));
};
