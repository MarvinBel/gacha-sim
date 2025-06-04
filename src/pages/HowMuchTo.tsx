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

const HowMuchTo: React.FC = () => {
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [pullCount, setPullCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [showSSRAndMLOnly, setShowSSRAndMLOnly] = useState(false);
  const [showSROnly, setShowSROnly] = useState(false);
  const [foundCharacters, setFoundCharacters] = useState<string[]>([]);

  if (showSSRAndMLOnly && showSROnly) setShowSROnly(false);

  const toggleCharacter = (title: string) => {
    setSelectedCharacters((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const handleStart = () => {
    if (selectedCharacters.length === 0) return;
    setLoading(true);

    let found: string[] = [];
    let allPulls: any[] = [];
    let pity = 0;
    let srPity = 0;

    while (found.length < selectedCharacters.length) {
      const { pull, newPity } = performSinglePull(pity, "perma", srPity);
      pity = newPity;
      allPulls.push({ ...pull, pullNumber: allPulls.length + 1 });

      const title = pull.character.title;
      if (selectedCharacters.includes(title) && !found.includes(title)) {
        found.push(title);
      }
    }

    setResults(allPulls);
    setFoundCharacters(found);
    setPullCount(allPulls.length);
    setLoading(false);
  };

  return (
    <div className="flex h-screen">
      {/* Drawer */}
      <div
        className={`transition-all duration-300 bg-black-100 dark:bg-gray-900 border-r border-gray-300 dark:border-gray-700 overflow-y-auto ${
          drawerOpen ? "w-72 p-4" : "w-0 p-0"
        }`}
      >
        {drawerOpen && (
          <>
            <h2 className="text-lg font-bold mb-2 text-center">
              Select characters
            </h2>

            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full mb-4 p-2 rounded border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white"
            />

            <div className="grid grid-cols-2 gap-2">
              {folders.map(({ name, images }) =>
                images
                  .filter(
                    (char) =>
                      !["Lian", "Hoyan"].includes(char.title) &&
                      char.title.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((char) => (
                    <button
                      key={char.title}
                      onClick={() => toggleCharacter(char.title)}
                      className={`rounded border p-1 text-xs ${
                        selectedCharacters.includes(char.title)
                          ? "border-yellow-500"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={`/characters/${name}/${char.filename}`}
                        alt={char.title}
                        className="w-16 h-16 object-contain mx-auto"
                      />
                      <p className="text-[0.7rem]">{char.title}</p>
                    </button>
                  ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 overflow-y-auto text-center">
        {/* Top Buttons */}
        <div className="flex flex-wrap gap-2 justify-center items-center mb-4">
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="bg-gray-800 text-white px-3 py-2 rounded hover:bg-gray-700"
          >
            {drawerOpen ? "Hide Characters" : "Show Characters"}
          </button>

          <button
            onClick={handleStart}
            disabled={loading || selectedCharacters.length === 0}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Summoning..." : "Start"}
          </button>

          <button
            onClick={() => {
              setShowSSRAndMLOnly(!showSSRAndMLOnly);
              if (!showSSRAndMLOnly && showSROnly) setShowSROnly(false);
            }}
            className={`px-4 py-2 rounded border ${
              showSSRAndMLOnly
                ? "bg-yellow-400 text-black font-semibold"
                : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
            }`}
          >
            {showSSRAndMLOnly ? "Show All" : "Only SSR & ML"}
          </button>

          <button
            onClick={() => {
              setShowSROnly(!showSROnly);
              if (!showSROnly && showSSRAndMLOnly) setShowSSRAndMLOnly(false);
            }}
            className={`px-4 py-2 rounded border ${
              showSROnly
                ? "bg-violet-400 text-black font-semibold"
                : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
            }`}
          >
            {showSROnly ? "Show All" : "Only SR"}
          </button>
        </div>

        {/* Result */}
        {pullCount > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">
              Total Pulls: {pullCount}
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {results
                .filter((pull) => {
                  if (showSSRAndMLOnly)
                    return (
                      pull.character.folder === "ssr" ||
                      pull.character.folder === "ml"
                    );
                  if (showSROnly) return pull.character.folder === "sr";
                  return true;
                })
                .map((pull, i) => {
                  const pityColor =
                    pull.pityType === "hard pity"
                      ? "border-red-500"
                      : pull.pityType === "soft pity"
                      ? "border-orange-400"
                      : "border-gray-300";
                  const bg =
                    pull.character.folder === "ssr"
                      ? "bg-yellow-200"
                      : pull.character.folder === "ml"
                      ? "bg-pink-200"
                      : pull.character.folder === "sr"
                      ? "bg-violet-200"
                      : "bg-blue-100";

                  const isTargetFound =
                    selectedCharacters.includes(pull.character.title) &&
                    foundCharacters.includes(pull.character.title);

                  return (
                    <div
                      key={`${pull.timestamp}-${i}`}
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
                          src={`/characters/${pull.character.folder}/${pull.character.filename}`}
                          alt={pull.character.title}
                          className="w-full h-24 object-contain rounded"
                        />
                        <p className="text-xs font-bold">
                          {pull.character.title}
                        </p>
                        {pull.pityType !== "no pity" && (
                          <p className="text-xs capitalize text-red-500 font-semibold">
                            {pull.pityType}
                          </p>
                        )}
                        <p style={{
                          fontSize: "0.7rem",
                          fontWeight: "bold",
                          background: "#fff",
                          padding: "2px 6px",
                          borderRadius: 4,
                          boxShadow: "0 0 2px rgba(0,0,0,0.2)",
                          color: "black",
                        }}>
                          Pull #{pull.pullNumber}
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
};

export default HowMuchTo;
