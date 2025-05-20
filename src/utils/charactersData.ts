import mlImages from '../data/ml.json';
import ssrImages from '../data/ssr.json';
import srImages from '../data/sr.json';
import rImages from '../data/r.json';
import type { FolderName, Character} from '../types/types';

type Folder = {
  name: FolderName;
  rate: number;
  images: Character[];
};

export const folders: Folder[] = [
  {
    name: 'ml',
    rate: 0.0025,
    images: mlImages.map(img => ({
      ...img,
      folder: 'ml' as FolderName,
    })),
  },
  {
    name: 'ssr',
    rate: 0.015,
    images: ssrImages.map(img => ({
      ...img,
      folder: 'ssr' as FolderName,
    })),
  },
  {
    name: 'sr',
    rate: 0.18,
    images: srImages.map(img => ({
      ...img,
      folder: 'sr' as FolderName,
    })),
  },
  {
    name: 'r',
    rate: 0.8025,
    images: rImages.map(img => ({
      ...img,
      folder: 'r' as FolderName,
    })),
  },
];
