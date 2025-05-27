import React, { useState, useEffect } from "react";
import { TeamCharacter, TeamData, FolderName } from "../types/types";
import { getTeamsFromCookies, saveTeamsToCookies } from "../utils/storage";

import mlImages from "../data/ml.json";
import ssrImages from "../data/ssr.json";
import srImages from "../data/sr.json";
import rImages from "../data/r.json";
import mobImages from "../data/mobs.json";

const folders = [
  { name: "ml", images: mlImages },
  { name: "ssr", images: ssrImages },
  { name: "sr", images: srImages },
  { name: "r", images: rImages },
];

const elementColors = ["red", "blue", "green", "yellow", "violet"];

const TeamMakerPage = () => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedRarity, setSelectedRarity] = useState<string[]>(["r", "sr", "ssr", "ml"]);
  const [teams, setTeams] = useState<TeamData>({});
  const [selectedMode, setSelectedMode] = useState<string>("Stuff");
  const [selectedContent, setSelectedContent] = useState<string>("Terrormaton");

  const contentsByMode: Record<string, string[]> = {
    Stuff: ["Terrormaton", "Dokidoki", "Aurora"],
    PVP: ["AFK", "RTA"],
    Shell: ["Febian", "Whitney"],
  };

  const teamKey = `${selectedMode}-${selectedContent}`;
  const team = teams[teamKey] || [];

  useEffect(() => {
    const loadedTeams = getTeamsFromCookies();
    setTeams(loadedTeams);
  }, []);

  const handleCharacterClick = (char: TeamCharacter) => {
    const currentTeam = teams[teamKey] || [];
    if (currentTeam.find((c) => c.filename === char.filename)) return;
    if (currentTeam.length >= 5 && selectedMode === "Stuff") return;
    if (currentTeam.length >= 4 && selectedMode !== "Stuff") return;
    const newTeam = [...currentTeam, char];
    const newTeams = { ...teams, [teamKey]: newTeam };
    setTeams(newTeams);
    saveTeamsToCookies(newTeams);
  };

  const handleRemoveCharacter = (char: TeamCharacter) => {
    const currentTeam = teams[teamKey] || [];
    const newTeam = currentTeam.filter((c) => c.filename !== char.filename);
    const newTeams = { ...teams, [teamKey]: newTeam };
    setTeams(newTeams);
    saveTeamsToCookies(newTeams);
  };

  const getTeamTags = (): Record<string, number> => {
    const tagCount: Record<string, number> = {};
    team.forEach((char) => {
      char.tags.forEach((tag) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });
    return tagCount;
  };

  const allCharacters = folders.flatMap(({ name, images }) =>
    images.map((char) => ({ ...char, folder: name as FolderName }))
  );

  const allTags = Array.from(new Set(allCharacters.flatMap((char) => char.tags)));
  const allRoles = Array.from(new Set(allCharacters.flatMap((char) => char.role)));

  const filteredCharacters = allCharacters.filter(
    (char) =>
      selectedRarity.includes(char.folder) &&
      (!selectedColor || char.color === selectedColor) &&
      (selectedRoles.length === 0 || selectedRoles.some((r) => char.role.includes(r))) &&
      (selectedTags.length === 0 || selectedTags.every((t) => char.tags.includes(t)))
  );

  const getBackgroundImage = (mode: string, content: string): string | undefined => {
    const folder = mode.toLowerCase();
    const file = `${content}.jpg`;
    return `/mobIllus/${folder}/${file}`;
  };

  const currentBackground = getBackgroundImage(selectedMode, selectedContent + "_big");
  console.log("Current Background:", currentBackground);
  return (
    <div
      className="p-4 flex gap-4 min-h-screen"
      style={{
        backgroundImage: `url(${currentBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="flex-1">
        <h2 className="text-lg mt-6">Type de contenu</h2>
        <div className="flex overflow-x-auto space-x-2 mb-2 space-evenly justify-center">
          {Object.keys(contentsByMode).map((mode) => (
            <button
              key={mode}
              className={`px-20 py-10 rounded text-black ${
                selectedMode === mode ? "bg-blue-800" : "bg-blue-500"
              }`}
              onClick={() => {
                setSelectedMode(mode);
                setSelectedContent(contentsByMode[mode][0]);
              }}
            >
              {mode}
            </button>
          ))}
        </div>
        <h2 className="text-lg mt-6">Mob</h2>
        <div className="flex overflow-x-auto space-x-2 mb-4 justify-center">
          {contentsByMode[selectedMode].map((content) => {
            const bgImage = getBackgroundImage(selectedMode, content);
            return (
              <button
                key={content}
                className={`px-20 py-10 rounded text-black relative overflow-hidden ${
                  selectedContent === content ? "bg-orange-600" : "bg-orange-400"
                }`}
                style={{
                  backgroundImage: `url(${bgImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
                }}
                onClick={() => setSelectedContent(content)}
              >
                <div className="z-10 relative">{content}</div>
              </button>
            );
          })}
        </div>
        <h2 className="text-xl font-bold mb-2">Team</h2>
        <div className="flex space-x-2 mb-4 min-h-[100px] justify-center">
          {team.map((char) => (
            <div key={char.filename} className="relative">
              <img
                src={`/characters/${char.folder}/${char.filename}`}
                alt={char.title}
                className="w-24 h-24 object-cover border-4 border-red-500"
                onClick={() => handleRemoveCharacter(char)}
              />
            </div>
          ))}
        </div>
        <h2 className="text-lg mt-6">Team Tags</h2>
        <div className="flex flex-wrap mt-2 bg-purple-200 p-2 rounded-lg">
          {Object.entries(getTeamTags()).map(([tag, count]) => {
            const color = count > 1 ? "bg-green-400" : "bg-orange-400";
            return (
              <span
                key={tag}
                className={`px-2 py-1 m-1 rounded text-black ${color}`}
              >
                {tag}
              </span>
            );
          })}
        </div>
      </div>

      <div className="flex-1 max-w-[360px]">
        <h2 className="text-lg font-semibold mb-2">Filtres</h2>
        <div className="bg-yellow-100 border p-3 rounded mb-4">
          <div className="flex flex-wrap gap-2 mb-2">
            {elementColors.map((color) => (
              <img
                key={color}
                src={`/element/${color}.jpg`}
                alt={color}
                onClick={() =>
                  setSelectedColor(color === selectedColor ? null : color)
                }
                className={`w-8 h-8 cursor-pointer border ${
                  selectedColor === color ? "ring-2 ring-black" : ""
                }`}
              />
            ))}
          </div>

          <h3 className="text-sm font-bold mt-4 text-black">Rareté</h3>
          <div className="flex flex-wrap gap-2 mt-1">
            {["r", "sr", "ssr", "ml"].map((rarity) => (
              <button
                key={rarity}
                onClick={() =>
                  setSelectedRarity((prev) =>
                    prev.includes(rarity)
                      ? prev.filter((r) => r !== rarity)
                      : [...prev, rarity]
                  )
                }
                className={`text-xs px-2 py-1 border rounded ${
                  selectedRarity.includes(rarity)
                    ? "bg-blue-600 text-black"
                    : "bg-white text-black"
                }`}
              >
                {rarity.toUpperCase()}
              </button>
            ))}
          </div>

          <h3 className="text-sm font-bold mt-4 text-black">Rôles</h3>
          <div className="flex flex-wrap gap-2 mt-1">
            {allRoles.map((role) => (
              <button
                key={role}
                onClick={() =>
                  setSelectedRoles((prev) =>
                    prev.includes(role)
                      ? prev.filter((r) => r !== role)
                      : [...prev, role]
                  )
                }
                className={`text-xs px-2 py-1 border rounded ${
                  selectedRoles.includes(role)
                    ? "bg-purple-600 text-black"
                    : "bg-white text-black"
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          <h3 className="text-sm font-bold mt-4 text-black">Tags</h3>
          <div className="flex flex-wrap gap-2 mt-1 max-h-24 overflow-y-auto">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() =>
                  setSelectedTags((prev) =>
                    prev.includes(tag)
                      ? prev.filter((t) => t !== tag)
                      : [...prev, tag]
                  )
                }
                className={`text-xs px-2 py-1 border rounded ${
                  selectedTags.includes(tag)
                    ? "bg-green-600 text-black"
                    : "bg-white text-black"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-green-100 border p-3 rounded h-[600px] overflow-y-auto w-full">
          <h3 className="font-bold mb-2 text-black">Personnages</h3>
          <div className="grid grid-cols-3 gap-2">
            {filteredCharacters.map((char) => (
              <img
                key={char.filename}
                src={`/characters/${char.folder}/${char.filename}`}
                alt={char.title}
                className="w-full h-16 object-cover cursor-pointer transition-transform border border-gray-400 hover:scale-105"
                onClick={() => handleCharacterClick(char)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMakerPage;
