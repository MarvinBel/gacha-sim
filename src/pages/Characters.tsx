import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";

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

const roleColors: Record<string, string> = {
  support: "#4fc3f7",
  dps: "#ef5350",
  debuff: "#ab47bc",
  sustain: "#66bb6a",
};

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: window.localStorage.getItem("theme") === "dark" ? theme.palette.common.white : theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: window.localStorage.getItem("theme") === "dark" ? theme.palette.common.white : theme.palette.common.black,
    color: window.localStorage.getItem("theme") === "dark"? "black" : "white",
    fontSize: 11,
    padding: "6px 10px",
    borderRadius: 6,
    maxWidth: 220,
  },
}));

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

  const isDark = window.localStorage.getItem("theme") === "dark";

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
              {images.map(({ filename, title, color, tags = [], role = [] }) => (
                <BootstrapTooltip
                  key={filename}
                  title={
                    tags.length > 0 ? tags.join(", ") : "Aucun tag"
                  }
                  placement="top"
                >
                  <div
                    style={{
                      width: IMAGE_SIZE_PX,
                      textAlign: "center",
                      position: "relative",
                      fontSize: "0.6rem",
                      cursor: "default",
                    }}
                  >
                    {/* Image personnage */}
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

                    {/* Élément en haut à droite */}
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
                        backgroundColor: isDark ? "#222" : "white",
                        padding: 1,
                      }}
                    />

                    {/* Nom du personnage */}
                    <p
                      style={{
                        fontSize: "0.65rem",
                        margin: "2px 0 0 0",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontWeight: 600,
                        color: isDark ? "#eee" : "#222",
                      }}
                      title={title}
                    >
                      {title}
                    </p>

                    {/* Rôles */}
                    {role.length > 0 && (
                      <div style={{ marginTop: 2 }}>
                        {role.map((r) => (
                          <span
                            key={r}
                            style={{
                              display: "inline-block",
                              backgroundColor:
                                roleColors[r] || (isDark ? "#444" : "#ccc"),
                              color: isDark ? "#fff" : "#000",
                              padding: "2px 6px",
                              borderRadius: "999px",
                              fontSize: "0.55rem",
                              fontWeight: 600,
                              boxShadow: "0 0 2px rgba(0, 0, 0, 0.3)",
                              marginTop: 2,
                              textTransform: "capitalize",
                            }}
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </BootstrapTooltip>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
};

export default Characters;
