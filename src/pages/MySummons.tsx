import React, { useEffect, useState } from 'react';
import { getSummons, clearSummons, getSummonCount, resetSummonCount } from '../services/StorageService';
import { Summon } from '../types/types';

const MySummons: React.FC = () => {
  const [summons, setSummons] = useState<(Summon & { pullNumber: number })[]>([]);
  const [onlyRare, setOnlyRare] = useState(false);

  useEffect(() => {
    const data = getSummons();
    const summNum = data.map((s, i) => ({
      ...s,
      pullNumber: data.length - i,
    }));
    setSummons(summNum);
  }, []);

  const handleClear = () => {
    clearSummons();
    resetSummonCount();
    setSummons([]);
  };

  const filtered = onlyRare
    ? summons.filter(summon => ['ssr', 'ml'].includes(summon.character.folder))
    : summons;
  const theme = localStorage.getItem('theme');
  const isDark = theme === 'dark';

  return (
    <div className="p-5">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">My Summons</h1>
        <h2 className="text-lg font-semibold">Total: {getSummonCount()}</h2>
      </div>

      <div className="flex gap-4 mb-5 flex-wrap">
        <button
          onClick={() => setOnlyRare(prev => !prev)}
          className={`px-4 py-2 rounded font-semibold text-sm transition-colors duration-200 ${
            onlyRare
              ? 'bg-blue-600 text-white'
              : isDark
              ? 'bg-black text-gray-300 border border-gray-300'
              : 'bg-gray-300 text-black'
          }`}
        >
          {onlyRare ? 'Show All' : 'Only SSR & ML'}
        </button>

        <button
          onClick={handleClear}
          className="px-4 py-2 rounded bg-red-600 text-white font-semibold text-sm cursor-pointer"
        >
          Clear All
        </button>
      </div>

      {filtered.length === 0 ? (
        <p>No summons yet.</p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {filtered.map((s, i) => {
            const border =
              s.pityType === 'hard pity'
                ? 'border-red-500'
                : s.pityType === 'soft pity'
                ? 'border-orange-500'
                : 'border-gray-400';
            const bg =
              s.character.folder === 'ssr'
                ? 'bg-yellow-200'
                : s.character.folder === 'ml'
                ? 'bg-pink-200'
                : s.character.folder === 'sr'
                ? 'bg-violet-200'
                : 'bg-blue-200';
            return (
              <div
                key={i}
                className={`w-[120px] h-[200px] flex flex-col justify-between text-center rounded p-2 border-2 shadow-sm ${border} ${bg}`}
              >
                <img
                  src={`/characters/${s.character.folder}/${s.character.filename}`}
                  alt={s.character.title}
                  className="w-full h-[100px] object-contain rounded"
                />
                <p className="font-bold my-1 text-sm text-black">{s.character.title}</p>
                {s.pityType !== 'no pity' && (
                  <p
                    className={`text-xs font-semibold capitalize text-black ${
                      s.pityType === 'hard pity'
                        ? 'text-red-500'
                        : s.pityType === 'soft pity'
                        ? 'text-orange-500'
                        : ''
                    }`}
                  >
                    {s.pityType}
                  </p>
                )}
                <p className="text-[0.7rem] font-bold bg-white px-2 py-1 rounded shadow-sm text-black">
                  #{s.pullNumber}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MySummons;
