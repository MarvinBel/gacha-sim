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

export type Summon = {
  character: Character;
  banner: string;
  pityType: 'soft pity' | 'hard pity' | 'no pity';
  pityCount: number;
  timestamp: string;
};

export type PityHistory = {
  banner: string;
  pulls: number;
  date: string;
};
