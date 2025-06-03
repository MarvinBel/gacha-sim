import React, { useEffect, useState } from 'react';
import { performSinglePull, performMultiPull, perform85Pull, performCustomPull } from '../utils/pullLogic';
import { saveSummon, getSummons, clearSummons, getSummonCount, setSummonCount, incrementSummonCount, resetSummonCount } from '../services/StorageService';
import { Summon } from '../types/types';
import Cookies from 'js-cookie';


const Summons: React.FC = () => {
  const [currentPulls, setCurrentPulls] = useState<Summon[]>([]);
  const [pityCounter, setPityCounter] = useState<number>(0);
  const [srPityCounter, setSRPityCounter] = useState<number>(0);
  const [selectedType, setSelectedType] = useState<string | null>("Perma");
  const [custom, setCustom] = useState<number>(300);
  const [showSSRAndMLOnly, setShowSSRAndMLOnly] = useState(false);
  const [showSROnly, setShowSROnly] = useState(false);
  



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
    const { pull, newPity } = performSinglePull(pityCounter, banner, srPityCounter);
    setCurrentPulls([pull]);
    setPityCounter(newPity);
    saveToCookie([pull]);
  };

  const handlePullX10 = () => {
    const { pulls, newPity } = performMultiPull(pityCounter, srPityCounter,banner);
    setCurrentPulls(pulls);
    setPityCounter(newPity);
    saveToCookie(pulls);
  };

  const handlePullX85 = () => {
    const { pulls, newPity } = perform85Pull(pityCounter, srPityCounter, banner);
    setCurrentPulls(pulls);
    setPityCounter(newPity);
    saveToCookie(pulls);
  };

  const handlePullCustom = () => {
    const { pulls, newPity } = performCustomPull(pityCounter, srPityCounter, banner, custom);
    setCurrentPulls(pulls);
    setPityCounter(newPity);
    saveToCookie(pulls);
  };

const saveToCookie = (summons: Summon[]) => {
  summons.forEach(summon => saveSummon(summon));
  incrementSummonCount(summons.length);
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
    resetSummonCount();
  };


  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <aside style={{
        width: '10%', padding: '1rem', backgroundColor: window.localStorage.getItem('theme') === 'dark' ? '#222' : '#eee',
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
      height: '100px', // tu peux ajuster la hauteur
      fontSize: '1rem',
      borderRadius: 6,
      backgroundImage: `url(/banners/${type.toLowerCase()}.png)`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      border: selectedType === type ? '2px solid yellow' : 'none',
      cursor: 'pointer',
      color: 'white',
      fontWeight: 'bold',
      textShadow: '0 0 4px black',
    }}
  >
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
            <p>Total summon count : {getSummonCount()}</p>
            <p style={{ marginBottom: '1rem', fontWeight: 'bold', fontSize: '1.1rem' }}>
              Pity counter : {pityCounter}
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
                Delete all summons
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
              {showSSRAndMLOnly ? 'Display all summons' : 'Display only SSR and ML'}
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
              {showSROnly ? 'Display all summons' : 'Display only SR'}
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
          <p>Select a banner on the left</p>
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
