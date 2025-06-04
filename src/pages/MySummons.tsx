import React, { useEffect, useState } from 'react';
import { getSummons, clearSummons, getSummonCount, resetSummonCount } from '../services/StorageService';
import { Summon } from '../types/types';

const MySummons: React.FC = () => {
  const [summons, setSummons] = useState<(Summon & { pullNumber: number })[]>([]);
  const [showSSRAndMLOnly, setShowSSRAndMLOnly] = useState(false);

  useEffect(() => {
    const stored = getSummons();
    const enriched = stored.map((s, i) => ({
      ...s,
      pullNumber: stored.length - i,
    }));
    setSummons(enriched);
  }, []);

  const handleClearSummons = () => {
    clearSummons();
    resetSummonCount();
    setSummons([]);
  };

  const filteredSummons = showSSRAndMLOnly
    ? summons.filter(s => ['ssr', 'ml'].includes(s.character.folder))
    : summons;

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>My Summons</h1>
        <h2>Total summons: {getSummonCount()}</h2>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: 20 }}>
        <button
          onClick={() => setShowSSRAndMLOnly(prev => !prev)}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 6,
            cursor: 'pointer',
            backgroundColor: showSSRAndMLOnly ? '#007bff' : '#ddd',
            color: showSSRAndMLOnly ? 'white' : 'black',
            border: 'none'
          }}
        >
          {showSSRAndMLOnly ? 'Show All' : 'Only SSR & ML'}
        </button>

        <button
          onClick={handleClearSummons}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 6,
            cursor: 'pointer',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none'
          }}
        >
          Clear All Summons
        </button>
      </div>

      {filteredSummons.length === 0 ? (
        <p>No summons found.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {filteredSummons.map((s, idx) => {
            const pityColor =
              s.pityType === 'hard pity' ? 'red' :
              s.pityType === 'soft pity' ? 'orange' : '#aaa';

            const bgColor =
              s.character.folder === 'ssr' ? 'yellow' :
              s.character.folder === 'ml' ? 'pink' :
              s.character.folder === 'sr' ? 'violet' : 'lightblue';

            return (
              <div
                key={`${s.timestamp}-${idx}`}
                style={{
                  width: 120,
                  textAlign: 'center',
                  border: `2px solid ${pityColor}`,
                  backgroundColor: bgColor,
                  borderRadius: 8,
                  padding: 8,
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: 200,
                }}
              >
                <div>
                  <img
                    src={`/characters/${s.character.folder}/${s.character.filename}`}
                    alt={s.character.title}
                    style={{ width: '100%', height: 100, objectFit: 'contain', borderRadius: 6 }}
                  />
                  <p style={{ fontWeight: 'bold', margin: 4 }}>{s.character.title}</p>
                  {s.pityType !== 'no pity' && (
                    <p style={{ fontSize: '0.9rem', color: pityColor }}>{s.pityType}</p>
                  )}
                </div>
                <p
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: "bold",
                          background: "#fff",
                          padding: "2px 6px",
                          borderRadius: 4,
                          boxShadow: "0 0 2px rgba(0,0,0,0.2)",
                          color: "black",
                        }}
                      >
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
