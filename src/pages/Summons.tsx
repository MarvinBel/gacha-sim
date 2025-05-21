import React, { useEffect, useState } from 'react';
import { performSinglePull, performMultiPull, perform85Pull, performCustomPull } from '../utils/pullLogic';
import { saveSummon, getSummons, clearSummons } from '../services/StorageService';
import { Summon } from '../types/types';

const Summons: React.FC = () => {
  const [currentPulls, setCurrentPulls] = useState<Summon[]>([]);
  const [pityCounter, setPityCounter] = useState<number>(0);
  const [selectedType, setSelectedType] = useState<string | null>("Perma");
  const [custom, setCustom] = useState<number>(300);
  const [showSSRAndMLOnly, setShowSSRAndMLOnly] = useState(false);
  const [showSROnly, setShowSROnly] = useState(false);



  // Convertit la sélection en banner valide pour le pull
  const banner = (selectedType === 'Perma' || selectedType === 'ML' || selectedType === 'Limited')
    ? selectedType.toLowerCase() as 'perma' | 'ml' | 'limited'
    : 'perma';

  const displayedSummons = showSSRAndMLOnly
    ? currentPulls.filter(s => s.character.folder === 'ssr' || s.character.folder === 'ml')
    : showSROnly
    ? currentPulls.filter(s => s.character.folder === 'sr')
    : currentPulls;

    useEffect(() => {
      if (showSSRAndMLOnly && showSROnly)
        setShowSROnly(!showSROnly);
    }, [showSSRAndMLOnly]);

    useEffect(() => {
      if (showSSRAndMLOnly && showSROnly)
        setShowSSRAndMLOnly(!showSSRAndMLOnly);
    }, [showSROnly]);

  const handlePullX1 = () => {
    const { pull, newPity } = performSinglePull(pityCounter, banner);
    setCurrentPulls([pull]);
    setPityCounter(newPity);
    saveToLocalStorage([pull]);
  };

  const handlePullX10 = () => {
    const { pulls, newPity } = performMultiPull(pityCounter, banner);
    setCurrentPulls(pulls);
    setPityCounter(newPity);
    saveToLocalStorage(pulls);
  };

  const handlePullX85 = () => {
    const { pulls, newPity } = perform85Pull(pityCounter, banner);
    setCurrentPulls(pulls);
    setPityCounter(newPity);
    saveToLocalStorage(pulls);
  };

  const handlePullCustom = () => {
    const { pulls, newPity } = performCustomPull(pityCounter, banner, custom);
    setCurrentPulls(pulls);
    setPityCounter(newPity);
    saveToLocalStorage(pulls);
  };

  const saveToLocalStorage = (summons: Summon[]) => {
    summons.forEach(summon => saveSummon(summon));
  };

  const handleChangeCustom = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    const numberValue = parseInt(value, 10);
    if (!isNaN(numberValue)) {
      setCustom(numberValue);
    } else if (value === '') {
      setCustom(0);
    }
  };
  const handleClearSummons = () => {
    clearSummons();
    setCurrentPulls([]);
    setPityCounter(0);
  };


  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <aside style={{
        width: '5%', padding: '1rem', backgroundColor: window.localStorage.getItem('theme') === 'dark' ? '#222' : '#eee',
        color: window.localStorage.getItem('theme') === 'dark' ? '#fff' : '#000',
      }}>
        {['Limited', 'Perma', 'ML'].map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            style={{
              display: 'block',
              marginBottom: '1rem',
              padding: '0.75rem 1rem',
              width: '100%',
              fontSize: '1rem',
              borderRadius: 6,
              border: selectedType === type ? '2px solid #007bff' : '1px solid #ccc',
              backgroundColor: window.localStorage.getItem('theme') === 'dark' ? '#222' : '#eee',
              color: window.localStorage.getItem('theme') === 'dark' ? '#fff' : '#000',
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
            <p>Compteur de summon total : {window.localStorage.getItem("summonCount")}</p>
            <p style={{ marginBottom: '1rem', fontWeight: 'bold', fontSize: '1.1rem' }}>
              Compteur de pity actuel : {pityCounter}
            </p>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <button onClick={handlePullX1} style={buttonStyle}>Pull x1</button>
              <button onClick={handlePullX10} style={{ ...buttonStyle, backgroundColor: '#28a745' }}>
                Pull x10
              </button>
              <button onClick={handlePullX85} style={{ ...buttonStyle, backgroundColor: 'red' }}>
                Pull x85
              </button>
              <input
                type="number"
                value={custom}
                onChange={handleChangeCustom}
                min={0}
                style={{ width: '80px' }}
              />
              <button onClick={handlePullCustom} style={{ ...buttonStyle, backgroundColor: 'red' }}>
                Pull {custom}
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
            <button
              onClick={() => setShowSSRAndMLOnly(!showSSRAndMLOnly)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 6,
                cursor: 'pointer',
                backgroundColor: showSSRAndMLOnly ? '#007bff' : window.localStorage.getItem('theme') === 'dark' ? "black" : '#ddd',
                border: window.localStorage.getItem('theme') === 'dark' ? "2px solid #ddd" : "none",
                color: window.localStorage.getItem('theme') === 'dark' ? "#ddd" : 'black',
              }}
            >
              {showSSRAndMLOnly ? 'Afficher tous les summons' : 'Afficher seulement SSR & ML'}
            </button>
            <button
              onClick={() => setShowSROnly(!showSROnly)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 6,
                cursor: 'pointer',
                backgroundColor: showSROnly ? '#007bff' : window.localStorage.getItem('theme') === 'dark' ? "black" : '#ddd',
                border: window.localStorage.getItem('theme') === 'dark' ? "2px solid #ddd" : "none",
                color: window.localStorage.getItem('theme') === 'dark' ? "#ddd" : 'black',
              }}
            >
              {showSROnly ? 'Afficher tous les summons' : 'Afficher seulement SR'}
            </button>
            {displayedSummons.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', overflowY: 'auto' }}>
                {displayedSummons.map((pull, idx) => {
                  let pityColor = '#000';
                  if (pull.pityType === 'soft pity') pityColor = 'orange';
                  else if (pull.pityType === 'hard pity') pityColor = 'red';

                  const showPityLabel = pull.pityType !== 'no pity';

                  return (
                    <div
                      key={`${pull.timestamp}-${idx}`}
                      style={{
                        width: 120,
                        textAlign: 'center',
                        border: `2px solid ${showPityLabel ? pityColor : '#ddd'}`,
                        backgroundColor: (pull.character.folder === "ssr") || (pull.character.folder === "ml") ? "yellow" : (pull.character.folder === "sr") ? "violet" : 'lightblue',
                        color:  'black',
                        borderRadius: 8,
                        padding: 8,
                        boxShadow: '1px 1px 5px rgba(0,0,0,0.1)',

                      }}
                    >
                      <img
                        src={`/characters/${pull.character.folder}/${pull.character.filename}`}
                        alt={pull.character.title}
                        style={{ width: '100%', height: 120, objectFit: 'contain', borderRadius: 6 }}
                      />
                      <p
                        style={{
                          margin: 4,
                          color: showPityLabel ? pityColor : undefined,
                          fontWeight: showPityLabel ? 'bold' : undefined,
                        }}
                      >
                        {pull.character.title}
                      </p>
                      {showPityLabel && (
                        <p
                          style={{
                            marginTop: 6,
                            fontWeight: 'bold',
                            fontSize: '1.2rem',
                            color: pityColor,
                            textTransform: 'capitalize',
                          }}
                        >
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

const buttonStyle = {
  padding: '1rem 2rem',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
};

export default Summons;
