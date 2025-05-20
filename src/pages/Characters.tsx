// src/pages/Characters.tsx
import React, { useState } from 'react';
import mlImages from '../data/ml.json';
import ssrImages from '../data/ssr.json';
import srImages from '../data/sr.json';
import rImages from '../data/r.json';

const folders = [
  { name: 'ml', images: mlImages },
  { name: 'ssr', images: ssrImages },
  { name: 'sr', images: srImages },
  { name: 'r', images: rImages },
];

const IMAGE_SIZE_PX = 72;

const Characters: React.FC = () => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    ml: true,
    ssr: true,
    sr: true,
    r: true,
  });

  const toggleSection = (name: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <div style={{ padding: '1rem' }}>
      {folders.map(({ name, images }) => (
        <section
          key={name}
          style={{
            border: '1px solid #ccc',
            borderRadius: 8,
            padding: '0.5rem',
            marginBottom: '1rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              userSelect: 'none',
              marginBottom: '0.5rem',
            }}
            onClick={() => toggleSection(name)}
          >
            <button
              aria-label={`${openSections[name] ? 'Fermer' : 'Ouvrir'} la section ${name}`}
              style={{
                marginRight: 8,
                fontSize: '1.25rem',
                lineHeight: 1,
                width: 28,
                height: 28,
                borderRadius: 4,
                border: '1px solid #888',
                background: 'white',
                cursor: 'pointer',
              }}
            >
              {openSections[name] ? '−' : '+'}
            </button>
            <h2 style={{ margin: 0 }}>{name.toUpperCase()}</h2>
          </div>

          {openSections[name] && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                maxHeight: 'calc(100vh - 150px)',
                overflowY: 'auto',
                justifyContent: 'center',
              }}
            >
              {images.map(({ filename, title }) => (
                <div
                  key={filename}
                  style={{
                    width: IMAGE_SIZE_PX,
                    textAlign: 'center',
                  }}
                >
                  <img
                    src={`/characters/${name}/${filename}`}
                    alt={title}
                    style={{
                      width: IMAGE_SIZE_PX,
                      height: IMAGE_SIZE_PX,
                      borderRadius: 8,
                      objectFit: 'contain',
                    }}
                  />
                  <p
                    style={{
                      fontSize: '0.65rem',
                      marginTop: 4,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    title={title}
                  >
                    {title}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
};

export default Characters;
