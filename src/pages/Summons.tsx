// Version mise à jour pour être compatible avec la nouvelle logique de pullLogic
import React, { useEffect, useState } from 'react';
import {
  performSinglePull,
  performMultiPull,
  perform85Pull,
  performCustomPull
} from '../utils/pullLogic';
import {
  saveSummon,
  clearSummons
} from '../services/StorageService';
import { Summon } from '../types/types';

const Summons: React.FC = () => {
  const [currentPulls, setCurrentPulls] = useState<Summon[]>([]);
  const [pityCounter, setPityCounter] = useState<number>(0);
  const [srPityCounter, setSrPityCounter] = useState<number>(0);
  const [selectedType, setSelectedType] = useState<string | null>('Perma');
  const [custom, setCustom] = useState<number>(300);
  const [showSSRAndMLOnly, setShowSSRAndMLOnly] = useState(false);
  const [showSROnly, setShowSROnly] = useState(false);

  const banner =
    selectedType === 'Perma' || selectedType === 'ML' || selectedType === 'Limited'
      ? selectedType.toLowerCase() as 'perma' | 'ml' | 'limited'
      : 'perma';

  const displayedSummons = showSSRAndMLOnly
    ? currentPulls.filter((s) => s.character.folder === 'ssr' || s.character.folder === 'ml')
    : showSROnly
    ? currentPulls.filter((s) => s.character.folder === 'sr')
    : currentPulls;

  useEffect(() => {
    if (showSSRAndMLOnly && showSROnly) setShowSROnly(false);
  }, [showSSRAndMLOnly]);

  useEffect(() => {
    if (showSSRAndMLOnly && showSROnly) setShowSSRAndMLOnly(false);
  }, [showSROnly]);

  const handlePull = (type: 'x1' | 'x10' | 'x85' | 'custom') => {
    let pulls: Summon[] = [];
    let newPity = pityCounter;
    let newSrPity = srPityCounter;

    if (type === 'x1') {
      const result = performSinglePull(newPity, newSrPity, banner);
      pulls = [result.pull];
      newPity = result.newPity;
      newSrPity = result.newSrPity;
    } else if (type === 'x10') {
      const result = performMultiPull(newPity, newSrPity, banner);
      pulls = result.pulls;
      newPity = result.newPity;
      newSrPity = result.newSrPity;
    } else if (type === 'x85') {
      const result = perform85Pull(newPity, newSrPity, banner);
      pulls = result.pulls;
      newPity = result.newPity;
      newSrPity = result.newSrPity;
    } else {
      const result = performCustomPull(newPity, newSrPity, banner, custom);
      pulls = result.pulls;
      newPity = result.newPity;
      newSrPity = result.newSrPity;
    }

    setCurrentPulls(pulls);
    setPityCounter(newPity);
    setSrPityCounter(newSrPity);
    pulls.forEach(saveSummon);
  };

  const handleChangeCustom = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numberValue = parseInt(e.target.value, 10);
    if (!isNaN(numberValue)) setCustom(numberValue);
    else if (e.target.value === '') setCustom(0);
  };

  const handleClearSummons = () => {
    clearSummons();
    setCurrentPulls([]);
    setPityCounter(0);
    setSrPityCounter(0);
  };

  const isDark = localStorage.getItem('theme') === 'dark';

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className={`w-[5%] p-4 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
        {['Limited', 'Perma', 'ML'].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`block mb-4 px-4 py-3 w-full text-base rounded ${
              selectedType === type
                ? 'border-2 border-blue-600'
                : 'border border-gray-300'
            } ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}
          >
            {type}
          </button>
        ))}
      </aside>

      <main className="w-[95%] p-4 flex flex-col items-center overflow-y-auto">
        {selectedType ? (
          <>
            <h2 className="text-xl font-bold mb-2">{selectedType} Summon</h2>
            <p>Compteur de summon total : {localStorage.getItem('summonCount')}</p>
            <p className="mb-4 font-bold text-lg">Compteur de pity actuel : {pityCounter}</p>

            <div className="flex flex-wrap gap-4 mb-4">
              <button onClick={() => handlePull('x1')} className="px-6 py-2 rounded bg-blue-600 text-white">Pull x1</button>
              <button onClick={() => handlePull('x10')} className="px-6 py-2 rounded bg-green-600 text-white">Pull x10</button>
              <button onClick={() => handlePull('x85')} className="px-6 py-2 rounded bg-red-600 text-white">Pull x85</button>
              <input
                type="number"
                value={custom}
                onChange={handleChangeCustom}
                min={0}
                className="w-20 px-2 py-1 border border-gray-400 rounded"
              />
              <button onClick={() => handlePull('custom')} className="px-6 py-2 rounded bg-red-600 text-white">
                Pull {custom}
              </button>
              <button onClick={handleClearSummons} className="px-6 py-2 rounded bg-red-700 text-white flex-grow">
                Supprimer tous les summons
              </button>
            </div>

            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setShowSSRAndMLOnly(!showSSRAndMLOnly)}
                className={`px-4 py-2 rounded ${
                  showSSRAndMLOnly
                    ? 'bg-blue-600 text-white'
                    : isDark
                    ? 'bg-black text-gray-300 border border-gray-300'
                    : 'bg-gray-300 text-black'
                }`}
              >
                {showSSRAndMLOnly ? 'Afficher tous les summons' : 'Afficher seulement SSR & ML'}
              </button>
              <button
                onClick={() => setShowSROnly(!showSROnly)}
                className={`px-4 py-2 rounded ${
                  showSROnly
                    ? 'bg-blue-600 text-white'
                    : isDark
                    ? 'bg-black text-gray-300 border border-gray-300'
                    : 'bg-gray-300 text-black'
                }`}
              >
                {showSROnly ? 'Afficher tous les summons' : 'Afficher seulement SR'}
              </button>
            </div>

            {displayedSummons.length > 0 && (
              <div className="flex flex-wrap gap-4 justify-center">
                {displayedSummons.map((pull, idx) => {
                  const pityColor =
                    pull.pityType === 'soft pity'
                      ? 'border-orange-500'
                      : pull.pityType === 'hard pity'
                      ? 'border-red-500'
                      : 'border-gray-300';

                  const bgColor =
                    pull.character.folder === 'ssr'
                      ? 'bg-yellow-200'
                      : pull.character.folder === 'ml'
                      ? 'bg-pink-200'
                      : pull.character.folder === 'sr'
                      ? 'bg-violet-200'
                      : 'bg-blue-200';

                  return (
                    <div
                      key={`${pull.timestamp}-${idx}`}
                      className={`w-[120px] text-center border-2 ${pityColor} ${bgColor} text-black rounded p-2 shadow`}
                    >
                      <img
                        src={`/characters/${pull.character.folder}/${pull.character.filename}`}
                        alt={pull.character.title}
                        className="w-full h-[120px] object-contain rounded"
                      />
                      <p className="mt-1 font-medium text-sm">{pull.character.title}</p>
                      {pull.pityType !== 'no pity' && (
                        <p className="mt-2 font-bold text-lg capitalize">
                          {pull.pityType}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <p>Sélectionne un type de summon à gauche</p>
        )}
      </main>
    </div>
  );
};

export default Summons;
