import type { Character } from '../types/types';
import ml from '../data/ml.json';
import ssr from '../data/ssr.json';
import sr from '../data/sr.json';
import r from '../data/r.json';

// Utilise un helper pour typer correctement chaque tableau
function tagFolder<T extends Omit<Character, 'folder'>>(arr: T[], folder: Character['folder']): Character[] {
  return arr.map(c => ({ ...c, folder }));
}

export default {
  ml: tagFolder(ml, 'ml'),
  ssr: tagFolder(ssr, 'ssr'),
  sr: tagFolder(sr, 'sr'),
  r: tagFolder(r, 'r'),
};
