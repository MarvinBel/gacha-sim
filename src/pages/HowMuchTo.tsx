import React, { useState } from "react";
import { performSinglePull } from "../utils/pullLogic";
import ssrImages from "../data/ssr.json";
import srImages from "../data/sr.json";
import rImages from "../data/r.json";
import mlImages from "../data/ml.json";

const folders = [
  { name: "ml", images: mlImages },
  { name: "ssr", images: ssrImages },
  { name: "sr", images: srImages },
  { name: "r", images: rImages },
];

interface Character {
  title: string;
  filename: string;
}

interface PullResult {
  character: {
    title: string;
    folder: string;
    filename: string;
  };
  pityType: "soft pity" | "hard pity" | "no pity";
  pullNumber: number;
}

type FilterCategory = "all" | "ssr" | "ml" | "sr";

export default function HowMuchTo() {
  const allCharacters: { folder: string; title: string; filename: string }[] = folders.flatMap(
    (folder) =>
      folder.images.map((char: Character) => ({
        folder: folder.name,
        title: char.title,
        filename: char.filename,
      }))
  );

  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [pullResults, setPullResults] = useState<PullResult[]>([]);
  const [foundCharacters, setFoundCharacters] = useState<string[]>([]);
  const [maxPulls, setMaxPulls] = useState<number>(
    parseInt(localStorage.getItem("howMuchToMax") || "500", 10)
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [leftFilter, setLeftFilter] = useState<FilterCategory>("all");
  const [rightFilter, setRightFilter] = useState<FilterCategory>("all");

  const filteredCharacters = allCharacters.filter((char) => {
    if (leftFilter !== "all" && char.folder !== leftFilter) return false;
    return char.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSelectCharacter = (title: string) => {
    setSelectedCharacters((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    );
  };

  const handleStart = async () => {
    const pulls: PullResult[] = [];
    const found: string[] = [];
    let pity = 0;
    let srPity = 0;
    let count = 0;

    while (found.length < selectedCharacters.length && count < maxPulls) {
      const { pull, newPity, newSrPity } = performSinglePull(pity, srPity, "perma");
      pity = newPity;
      srPity = newSrPity;
      count++;

      if (
        pull.character &&
        selectedCharacters.includes(pull.character.title) &&
        !found.includes(pull.character.title)
      ) {
        found.push(pull.character.title);
      }

      pulls.push({ ...pull, pullNumber: count });
    }

    setFoundCharacters(found);
    setPullResults(pulls);
  };

  const handleReset = () => {
    setPullResults([]);
    setFoundCharacters([]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setMaxPulls(value);
      localStorage.setItem("howMuchToMax", value.toString());
    }
  };

  return (
    <div className="p-4 flex h-[80vh] gap-4">
      {/* Partie gauche */}
      <div className="w-48 overflow-y-auto border rounded p-2 flex flex-col">
        <h2 className="text-xl font-bold mb-4">Choisis tes persos</h2>
        <div className="mb-2 flex flex-wrap gap-1">
          {(["all", "ssr", "ml", "sr"] as FilterCategory[]).map((cat) => (
            <button
              key={cat}
              className={`px-2 py-1 rounded text-sm font-semibold border ${
                leftFilter === cat
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
              onClick={() => setLeftFilter(cat)}
            >
              {cat === "all" ? "Tous" : cat.toUpperCase()}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Rechercher..."
          className="mb-3 px-2 py-1 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-2 flex-1 overflow-y-auto">
          {filteredCharacters.map((char) => (
            <button
              key={char.title}
              onClick={() => handleSelectCharacter(char.title)}
              className={`flex flex-col items-center border-2 rounded p-1 transition duration-200 ${
                selectedCharacters.includes(char.title)
                  ? "border-blue-500"
                  : "border-transparent"
              }`}
            >
              <img
                src={`/characters/${char.folder}/${char.filename}`}
                alt={char.title}
                className="w-16 h-16 object-contain rounded"
              />
              <span className="text-xs font-medium mt-1 text-center">{char.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Partie droite */}
      <div className="flex-1 flex flex-col">
        <div className="mb-4 flex items-center gap-2">
          <label htmlFor="maxPulls">Max pulls :</label>
          <input
            id="maxPulls"
            type="number"
            className="w-20 border rounded px-2 py-1 text-black"
            value={maxPulls}
            onChange={handleMaxChange}
          />
          <button
            onClick={handleStart}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Start
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Reset
          </button>
        </div>
        <label htmlFor="maxPulls">Filters :</label>
          <div className="mb-4 flex items-center gap-2">
          {(["all", "ssr", "ml", "sr"] as FilterCategory[]).map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded text-sm font-semibold border ${
                rightFilter === cat
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
              onClick={() => setRightFilter(cat)}
            >
              {cat === "all" ? "Tous" : cat.toUpperCase()}
            </button>
          ))}
        </div>

        {pullResults.length > 0 && (
          <div className="overflow-auto flex-1">
            <h3 className="text-xl font-semibold mb-2">Résultats :</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {pullResults
                .filter(
                  (pull) =>
                    rightFilter === "all" || pull.character.folder === rightFilter
                )
                .map((pull, i) => {
                  if (!pull?.character) return null;
                  const { character, pityType, pullNumber } = pull;
                  const { folder, filename, title } = character;

                  const pityColor =
                    pityType === "hard pity"
                      ? "border-red-500"
                      : pityType === "soft pity"
                      ? "border-orange-400"
                      : "border-gray-300";

                  const bg =
                    folder === "ssr"
                      ? "bg-yellow-200"
                      : folder === "ml"
                      ? "bg-pink-200"
                      : folder === "sr"
                      ? "bg-violet-200"
                      : "bg-blue-100";

                  const isTargetFound =
                    selectedCharacters.includes(title) &&
                    foundCharacters.includes(title);

                  return (
                    <div
                      key={`${title}-${i}`}
                      className={`relative border-2 ${pityColor} ${bg} rounded p-2 w-28 overflow-hidden`}
                    >
                      {isTargetFound && (
                        <div
                          className="absolute inset-0 z-0 pointer-events-none"
                          style={{
                            backgroundImage:
                              "linear-gradient(135deg, red, orange, yellow, green, cyan, blue, violet)",
                            backgroundSize: "400% 400%",
                            animation: "rainbowShift 3s ease infinite",
                            opacity: 0.3,
                          }}
                        />
                      )}
                      <div className="relative z-10">
                        <img
                          src={`/characters/${folder}/${filename}`}
                          alt={title}
                          className="w-full h-24 object-contain rounded"
                        />
                        <p className="text-xs font-bold text-black mt-1">{title}</p>
                        {pityType !== "no pity" && (
                          <p className="text-xs capitalize text-red-500 font-semibold">
                            {pityType}
                          </p>
                        )}
                        <p
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: "bold",
                            background: "#fff",
                            padding: "2px 6px",
                            borderRadius: 4,
                            boxShadow: "0 0 2px rgba(0,0,0,0.2)",
                            color: "black",
                          }}
                        >
                          Pull #{pullNumber}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
