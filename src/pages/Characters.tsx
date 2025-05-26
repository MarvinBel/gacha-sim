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

const elementColors = ["red", "green", "blue", "yellow", "violet"];

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color:
      window.localStorage.getItem("theme") === "dark"
        ? theme.palette.common.white
        : theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor:
      window.localStorage.getItem("theme") === "dark"
        ? theme.palette.common.white
        : theme.palette.common.black,
    color: window.localStorage.getItem("theme") === "dark"
      ? "black"
      : "white",
    fontSize: 11,
    padding: "6px 10px",
    borderRadius: 6,
    maxWidth: 220,
  },
}));

const roleKeys = Object.keys(roleColors);

const Characters: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
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

  const handleFilterColor = (color: string | null) => {
    setSelectedColor(color);
  };

  const handleFilterRole = (role: string | null) => {
    setSelectedRole(role);
  };

  return (
    <div style={{ padding: "1rem" }}>
      {/* Element filter */}
      <div style={{ marginBottom: "1rem", textAlign: "center" }}>
        <strong>Filtrer par élément :</strong>
        <div
          style={{
            marginTop: 8,
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <button
            onClick={() => handleFilterColor(null)}
            style={{
              padding: "4px 12px",
              borderRadius: 8,
              border: "1px solid #999",
              backgroundColor: selectedColor === null ? "white" : "#333",
              color: selectedColor === null ? "black" : "white",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "0.8rem",
            }}
          >
            Tous
          </button>
          {elementColors.map((color) => (
            <button
              key={color}
              onClick={() => handleFilterColor(color)}
              style={{
                border: selectedColor === color ? "px solid #333" : "1px solid #ccc",
                borderRadius: "50%",
                padding: 4,
                backgroundColor: selectedColor === color ? "white": "#333",
                cursor: "pointer",
              }}
            >
              <img
                src={`/element/${color}.jpg`}
                alt={color}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  backgroundColor: "#fff",
                }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Role filter */}
      <div style={{ marginBottom: "1rem", textAlign: "center" }}>
        <strong>Filtrer par rôle :</strong>
        <div
          style={{
            marginTop: 8,
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <button
            onClick={() => handleFilterRole(null)}
            style={{
              padding: "4px 12px",
              borderRadius: 8,
              border: "1px solid #999",
              backgroundColor: selectedRole === null ? "#555" : "#eee",
              color: selectedRole === null ? "white" : "black",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "0.8rem",
            }}
          >
            Tous
          </button>
          {roleKeys.map((role) => (
            <button
              key={role}
              onClick={() => handleFilterRole(role)}
              style={{
                border: selectedRole === role ? `2px solid ${roleColors[role]}` : "1px solid #ccc",
                borderRadius: 8,
                padding: "4px 10px",
                backgroundColor: selectedRole === role ? roleColors[role] : "#fff",
                color: selectedRole === role ? "#fff" : "#000",
                cursor: "pointer",
                fontWeight: "600",
                textTransform: "capitalize",
              }}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

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
              {images
                .filter(({ color, role }) =>
                  (!selectedColor || color === selectedColor) &&
                  (!selectedRole || (role && role.includes(selectedRole)))
                )
                .map(({ filename, title, color, tags = [], role = [] }) => (
                  <BootstrapTooltip
                    key={filename}
                    title={tags.length > 0 ? tags.join(", ") : "Aucun tag"}
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
                      {/* Char pic */}
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

                      {/* Char Elem */}
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

                      {/* Char name */}
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

                      {/* Roles */}
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
