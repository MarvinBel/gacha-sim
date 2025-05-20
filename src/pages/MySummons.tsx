import React, { useState, useEffect } from 'react';
import { Summon } from '../types/types';
import { getSummons } from '../services/StorageService';

const MySummons: React.FC = () => {
  const [summons, setSummons] = useState<Summon[]>([]);

  useEffect(() => {
    const data = getSummons();
    if (data) {
      setSummons(data);
    }
  }, []);

  return (
    <div>
      <h2>My Summons History</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {summons.map((summon, idx) => (
          <div
            key={`${summon.timestamp ?? idx}`}
            style={{
              textAlign: 'center',
              width: 120,
              border: getPityBorder(summon.pityType),
              padding: 4,
              margin: 4,
              borderRadius: 8,
            }}
          >
            <img
              src={`/characters/${summon.character.folder}/${summon.character.filename}`}
              alt={summon.character.title}
              style={{ width: 120, height: 120, objectFit: 'contain', borderRadius: 8 }}
            />
            <p style={{ margin: 4 }}>{summon.character.title}</p>
            <small style={{ fontStyle: 'italic', color: getPityColor(summon.pityType) }}>{summon.pityType}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

function getPityColor(pityType: string) {
  if (pityType === 'soft pity') return 'orange';
  if (pityType === 'hard pity') return 'red';
  return '#555';
}

function getPityBorder(pityType: string) {
  if (pityType === 'soft pity') return '2px solid orange';
  if (pityType === 'hard pity') return '2px solid red';
  return 'none';
}

export default MySummons;
