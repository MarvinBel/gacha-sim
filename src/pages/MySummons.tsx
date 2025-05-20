import React, { useState, useEffect } from 'react';
import { Summon, PityHistory } from '../types/types';
import { getSummons, getPityHistory } from '../services/storageService';

const MySummons: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'summons' | 'pity'>('summons');
  const [summons, setSummons] = useState<Summon[]>([]);
  const [pityHistory, setPityHistory] = useState<PityHistory[]>([]);

  useEffect(() => {
    setSummons(getSummons());
    setPityHistory(getPityHistory());
  }, []);

  const labelColor = (pityType: string) => {
    if (pityType === 'soft pity') return '#FFA500'; // orange
    if (pityType === 'hard pity') return '#FF0000'; // rouge
    return '#888'; // gris neutre
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Mes Tirages</h1>
      <div style={{ display: 'flex', marginBottom: 20 }}>
        <button
          style={{
            flex: 1,
            padding: 10,
            backgroundColor: activeTab === 'summons' ? '#ddd' : '#fff',
            border: '1px solid #ccc',
            cursor: 'pointer',
          }}
          onClick={() => setActiveTab('summons')}
        >
          Historique Tirages
        </button>
        <button
          style={{
            flex: 1,
            padding: 10,
            backgroundColor: activeTab === 'pity' ? '#ddd' : '#fff',
            border: '1px solid #ccc',
            cursor: 'pointer',
          }}
          onClick={() => setActiveTab('pity')}
        >
          Historique Pity
        </button>
      </div>

      {activeTab === 'summons' && (
        <div>
          {summons.length === 0 && <p>Aucun tirage pour le moment.</p>}
          {summons.map((summon, idx) => {
  if (!summon.character) {
    console.log("Summon : ", JSON.stringify(summons[0]));
    return (
      <div key={idx} style={{ color: 'red' }}>
        Erreur : tirage corrompu (aucun personnage).
      </div>
    );
  }

  const color = labelColor(summon.pityType);
  return (
    <div
      key={idx}
      style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: 10,
        border: summon.pityType !== 'no pity' ? `2px solid ${color}` : '2px solid transparent',
        padding: 5,
        borderRadius: 5,
      }}
    >
      <img
        src={`/images/${summon.character.folder}/${summon.character.filename}`}
        alt={summon.character.title}
        width={64}
        height={64}
        style={{ borderRadius: 5 }}
      />
      <div style={{ marginLeft: 10 }}>
        <div style={{ fontWeight: 'bold' }}>{summon.character.title}</div>
        <div style={{ color }}>{summon.pityType}</div>
        <div style={{ fontSize: 12, color: '#666' }}>Bannière: {summon.banner}</div>
      </div>
    </div>
  );
})}

        </div>
      )}

      {activeTab === 'pity' && (
        <div>
          {pityHistory.length === 0 && <p>Aucun historique pity pour le moment.</p>}
          {pityHistory.map((entry, idx) => (
            <div
              key={idx}
              style={{
                borderLeft: '4px solid #666',
                paddingLeft: 10,
                marginBottom: 8,
              }}
            >
              <div>
                <strong>Bannière:</strong> {entry.banner}
              </div>
              <div>
                <strong>Pulls au pity:</strong> {entry.pulls}
              </div>
              <div style={{ fontSize: 12, color: '#666' }}>
                <strong>Date:</strong> {new Date(entry.date).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MySummons;
