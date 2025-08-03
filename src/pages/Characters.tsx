// Version Tailwind CSS du composant Characters
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";

import mlImages from "../data/ml.json";
import ssrImages from "../data/ssr.json";
import srImages from "../data/sr.json";
import rImages from "../data/r.json";

const folders = [
  { name: "ml", images: mlImages },
  { name: "ssr", images: ssrImages },
  { name: "sr", images: srImages },
  { name: "r", images: rImages },
];

const IMAGE_SIZE_PX = 72;

const roleColors: Record<string, string> = {
  support: "bg-sky-400",
  dps: "bg-red-400",
  debuff: "bg-purple-400",
  sustain: "bg-green-400",
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
    color:
      window.localStorage.getItem("theme") === "dark"
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

  return (
    <div className="p-4">
      <div className="mb-4 text-center">
        <strong>Filtrer par élément :</strong>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setSelectedColor(null)}
            className={`px-3 py-1 rounded border text-sm font-bold ${selectedColor === null ? "bg-white text-black border-gray-600" : "bg-gray-800 text-white border-gray-600"}`}
          >
            Tous
          </button>
          {elementColors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`p-1 rounded-full border ${selectedColor === color ? "bg-white border-gray-700" : "bg-gray-800 border-gray-300"}`}
            >
              <img
                src={`/element/${color}.jpg`}
                alt={color}
                className="w-8 h-8 rounded-full bg-white"
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 text-center">
        <strong>Filtrer par rôle :</strong>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setSelectedRole(null)}
            className={`px-3 py-1 rounded border text-sm font-bold ${selectedRole === null ? "bg-gray-700 text-white" : "bg-gray-100 text-black"}`}
          >
            Tous
          </button>
          {roleKeys.map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-2 py-1 rounded font-semibold capitalize border ${selectedRole === role ? `${roleColors[role]} text-white border-transparent` : "bg-white text-black border-gray-300"}`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {folders.map(({ name, images }) => (
        <section key={name} className="mb-6">
          <div
            className="flex items-center gap-2 cursor-pointer border-b pb-1"
            onClick={() => toggleSection(name)}
          >
            <button className="text-xl font-bold">{openSections[name] ? "−" : "+"}</button>
            <h2 className="text-lg font-semibold uppercase m-0">{name}</h2>
          </div>

          {openSections[name] && (
            <div className="flex flex-wrap gap-2 max-h-[calc(100vh-150px)] overflow-y-auto justify-center mt-2">
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
                    <div className="w-[72px] text-center relative text-xs cursor-default">
                      <img
                        src={`/characters/${name}/${filename}`}
                        alt={title}
                        className="w-[72px] h-[72px] rounded object-contain"
                      />
                      <img
                        src={`/element/${color}.jpg`}
                        alt={color}
                        className={`absolute top-0 right-0 w-5 h-5 rounded-full p-0.5 ${isDark ? "bg-gray-800" : "bg-white"}`}
                      />
                      <p
                        className={`text-[0.65rem] mt-1 font-semibold truncate ${isDark ? "text-gray-200" : "text-gray-800"}`}
                        title={title}
                      >
                        {title}
                      </p>
                      {role.length > 0 && (
                        <div className="mt-1 flex flex-wrap justify-center gap-0.5">
                          {role.map((r) => (
                            <span
                              key={r}
                              className={`inline-block px-2 py-0.5 rounded-full text-[0.55rem] font-semibold capitalize shadow-sm ${roleColors[r] || (isDark ? "bg-gray-700 text-white" : "bg-gray-300 text-black")}`}
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
