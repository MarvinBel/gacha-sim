export type FolderName = 'ml' | 'ssr' | 'sr' | 'r';

export type Character = {
  filename: string;
  title: string;
  folder: FolderName;
};

export type FolderData = {
  name: FolderName;
  images: Character[];
  rate: number;
};

export interface Summon {
  character: Character;
  banner: string;
  pityType: 'soft pity' | 'hard pity' | 'no pity';
  timestamp?: number;
  pityCount?: number;
}

export type PityHistory = {
  banner: string;
  pulls: number;
  date: string;
};

export type TeamCharacter = {
  filename: string;
  title: string;
  folder: FolderName;
  color: string;
  tags: string[];
  role: string[];
};


export type Team = TeamCharacter[];

export type TeamData = {
  [key: string]: Team;
};

export type TeamKey = `${string}-${string}`;