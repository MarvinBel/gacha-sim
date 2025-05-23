import React, { useState } from "react";
import mlImages from "../data/ml.json";
import ssrImages from "../data/ssr.json";
import srImages from "../data/sr.json";
import rImages from "../data/r.json";

import "./Characters.css";

const folders = [
  { name: "ml", images: mlImages },
  { name: "ssr", images: ssrImages },
  { name: "sr", images: srImages },
  { name: "r", images: rImages },
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
  console.log("folders : ", folders[0].images[0].color);
  return (
    <div style={{ padding: "1rem" }}>
      {folders.map(({ name, images }) => (
        <section key={name} className="charBorders">
          <div
            className="charSectionTitleCont"
            onClick={() => toggleSection(name)}
          >
            <button
              aria-label={`${
                openSections[name] ? "Fermer" : "Ouvrir"
              } la section ${name}`}
              className="charDrawerButton"
            >
              {openSections[name] ? "−" : "+"}
            </button>
            <h2 style={{ margin: 0 }}>{name.toUpperCase()}</h2>
          </div>

          {openSections[name] && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
                maxHeight: "calc(100vh - 150px)",
                overflowY: "auto",
                justifyContent: "center",
              }}
            >
              {images.map(({ filename, title, color }) => (
                <div
                  key={filename}
                  style={{
                    width: IMAGE_SIZE_PX,
                    textAlign: "center",
                    position: "relative",
                  }}
                >
                  <img
                    src={`/characters/${name}/${filename}`}
                    alt={title}
                    style={{
                      width: IMAGE_SIZE_PX,
                      height: IMAGE_SIZE_PX,
                      borderRadius: 8,
                      objectFit: "contain",
                    }}
                  />

                  <img
                    src={`/element/${color}.jpg`}
                    alt={color}
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      backgroundColor: "white",
                      padding: 1,
                    }}
                  />

                  <p
                    style={{
                      fontSize: "0.65rem",
                      marginTop: 4,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
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
