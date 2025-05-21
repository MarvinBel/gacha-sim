import React, { useState, useEffect } from 'react';
import { getSummons, clearSummons } from '../services/StorageService';
import { Summon } from '../types/types';

const MySummons: React.FC = () => {
  const [summons, setSummons] = useState<Summon[]>([]);
  const [showSSRAndMLOnly, setShowSSRAndMLOnly] = useState(false);

  useEffect(() => {
    const savedSummons = getSummons();
    setSummons(savedSummons);
  }, []);

  const displayedSummons = showSSRAndMLOnly
    ? summons.filter(s => s.character.folder === 'ssr' || s.character.folder === 'ml')
    : summons;

  const handleClearSummons = () => {
    clearSummons();
    setSummons([]);
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', gap: "20%"}}>
      <h1>Mes Summons</h1>
      <h1>Total summon : {window.localStorage.getItem("summonCount")}</h1>
      </div>
      <div style={{ marginBottom: 20, display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setShowSSRAndMLOnly(!showSSRAndMLOnly)}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 6,
            cursor: 'pointer',
            backgroundColor: showSSRAndMLOnly ? '#007bff' : window.localStorage.getItem('theme') === 'dark' ? "black" :'#ddd',
            border: window.localStorage.getItem('theme') === 'dark' ? "2px solid #ddd" : "none",
            color:  window.localStorage.getItem('theme') === 'dark' ? "#ddd" :'black',
            flexGrow: 1,
          }}
        >
          {showSSRAndMLOnly ? 'Afficher tous les summons' : 'Afficher seulement SSR & ML'}
        </button>

        <button
          onClick={handleClearSummons}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 6,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: '#dc3545',
            color: 'white',
            flexGrow: 1,
          }}
        >
          Supprimer tous les summons
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {displayedSummons.length === 0 && <p>Aucun summon trouvé.</p>}

        {displayedSummons.map((summon, idx) => {
          let pityColor = '#000';
          if (summon.pityType === 'soft pity') pityColor = 'orange';
          else if (summon.pityType === 'hard pity') pityColor = 'red';
          

          const showPityLabel = summon.pityType !== 'no pity';

          return (
            <div
              key={`${summon.timestamp}-${idx}`}
              style={{
                width: 120,
                textAlign: 'center',
                border: `2px solid ${showPityLabel ? pityColor : '#ddd'}`,
                backgroundColor : (summon.character.folder === "ssr") || (summon.character.folder === "ml") ? "yellow" : "lightblue",
                color:  'black',
                borderRadius: 8,
                padding: 8,
                boxShadow: '1px 1px 5px rgba(0,0,0,0.1)',
              }}
            >
              <img
                src={`/characters/${summon.character.folder}/${summon.character.filename}`}
                alt={summon.character.title}
                style={{ width: '100%', height: 120, objectFit: 'contain', borderRadius: 6 }}
              />
              <p
                style={{
                  margin: 4,
                  color: showPityLabel ? "black" : undefined,
                  fontWeight: showPityLabel ? 'bold' : undefined,
                }}
              >
                {summon.character.title}
              </p>
              {showPityLabel && (
                <p
                  style={{
                    marginTop: 6,
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    color: "black",
                    textTransform: 'capitalize',
                  }}
                >
                  {summon.pityType}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MySummons;
