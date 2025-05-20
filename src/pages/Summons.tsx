import React, { useState, useEffect } from 'react';
import { performSinglePull, performMultiPull } from '../utils/pullLogic';
import { saveSummon } from '../services/storageService';
import { FolderName, Summon } from '../types/types';


type SummonType = 'Limited' | 'Perma' | 'ML';

const LOCAL_PITY_KEY = 'summonPity';

const Summons: React.FC = () => {
  const [selectedType, setSelectedType] = useState<SummonType | null>(null);
  const [currentPulls, setCurrentPulls] = useState<Summon[]>([]);
  const [pityCounter, setPityCounter] = useState<number>(0);

  useEffect(() => {
    const storedPity = parseInt(localStorage.getItem(LOCAL_PITY_KEY) || '0', 10);
    setPityCounter(storedPity);
  }, []);

const saveToLocalStorage = (pulls: Summon[], newPity: number) => {
  pulls.forEach(pull => {
    // Construire un Summon complet à partir du pull
    const summon: Summon = {
      character: {
        filename: pull.image.filename,
        title: pull.image.title,
        folder: pull.folder as FolderName, // en supposant que folder correspond
      },
      banner: selectedType?.toLowerCase() || 'unknown', // ou autre source
      pityType: pull.pityType,
      pityCount: newPity,
      timestamp: pull.timestamp,
    };
    saveSummon(summon);
  });
  localStorage.setItem(LOCAL_PITY_KEY, newPity.toString());
};

  const handlePullX1 = () => {
    if (!selectedType) return;

    const { pull, newPity } = performSinglePull(pityCounter);
    setCurrentPulls([pull]);
    setPityCounter(newPity);
    saveToLocalStorage([pull], newPity);
  };

  const handlePullX10 = () => {
    if (!selectedType) return;

    const { pulls, newPity } = performMultiPull(pityCounter);
    setCurrentPulls(pulls);
    setPityCounter(newPity);
    saveToLocalStorage(pulls, newPity);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <aside style={{ width: '20%', padding: '1rem', backgroundColor: '#f0f0f0' }}>
        {['Limited', 'Perma', 'ML'].map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type as SummonType)}
            style={{
              display: 'block',
              marginBottom: '1rem',
              padding: '0.75rem 1rem',
              width: '100%',
              fontSize: '1rem',
              borderRadius: 6,
              border: selectedType === type ? '2px solid #007bff' : '1px solid #ccc',
              backgroundColor: selectedType === type ? '#cce4ff' : 'white',
              cursor: 'pointer',
            }}
          >
            {type}
          </button>
        ))}
      </aside>

      <main
        style={{
          width: '80%',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {selectedType ? (
          <>
            <h2>{selectedType} Summon</h2>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <button onClick={handlePullX1} style={buttonStyle}>Pull x1</button>
              <button onClick={handlePullX10} style={{ ...buttonStyle, backgroundColor: '#28a745' }}>
                Pull x10
              </button>
            </div>
            {currentPulls.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
                {currentPulls.map((pull, idx) => (
                  <div key={`${pull.timestamp}-${idx}`} style={{ textAlign: 'center', width: 120 }}>
                    <img
                      src={`/characters/${pull.folder}/${pull.image.filename}`}
                      alt={pull.image.title}
                      style={{ width: 120, height: 120, objectFit: 'contain', borderRadius: 8 }}
                    />
                    <p style={{ margin: 4 }}>{pull.image.title}</p>
                    <small style={{ fontStyle: 'italic', color: '#555' }}>{pull.pityType}</small>
                  </div>
                ))}
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

const buttonStyle = {
  padding: '1rem 2rem',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
};

export default Summons;
