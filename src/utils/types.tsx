export type FolderName = 'ml' | 'ssr' | 'sr' | 'r';

export type ImageData = {
  filename: string;
  title: string;
  folder: "ml" | "ssr" | "sr" | "r";

};

export type Folder = {
  name: FolderName;
  images: ImageData[];
  rate: number;
};

export type Pull = {
  folder: FolderName;
  image: ImageData;
  timestamp: number;
  pityType: 'soft pity' | 'hard pity' | 'no pity';
};
