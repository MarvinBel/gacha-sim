import React, { useEffect, useState } from "react";
import {
  performSinglePull,
  performMultiPull,
  perform85Pull,
  performCustomPull,
} from "../utils/pullLogic";
import {
  saveSummon,
  getSummons,
  clearSummons,
  getSummonCount,
  incrementSummonCount,
  resetSummonCount,
  getSSRStats,
  getPity,
  setPity,
} from "../services/StorageService";
import { Summon } from "../types/types";

const PITY_KEYS = {
  perma: "pityCounter_perma",
  ml: "pityCounter_ml",
  limited: "pityCounter_limited",
};

type SummonWithNumber = Summon & { pullNumber: number };

const Summons: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string | null>("Perma");
  const banner =
    selectedType === "Perma" ||
    selectedType === "ML" ||
    selectedType === "Limited"
      ? (selectedType.toLowerCase() as "perma" | "ml" | "limited")
      : "perma";

  const [pityCounter, setPityCounter] = useState<number>(() => getPity(banner));
  const [srPityCounter, setSRPityCounter] = useState<number>(0);
  const [currentPulls, setCurrentPulls] = useState<SummonWithNumber[]>([]);
  const [custom, setCustom] = useState<number>(300);
  const [showSSRAndMLOnly, setShowSSRAndMLOnly] = useState(false);
  const [showSROnly, setShowSROnly] = useState(false);
  const { average, totalSSR, totalPulls } = getSSRStats();

  const displayedSummons = showSSRAndMLOnly
    ? currentPulls.filter(
        (s) => s.character.folder === "ssr" || s.character.folder === "ml"
      )
    : showSROnly
    ? currentPulls.filter((s) => s.character.folder === "sr")
    : currentPulls;

  useEffect(() => {
    if (showSSRAndMLOnly && showSROnly) setShowSROnly(false);
  }, [showSSRAndMLOnly]);

  useEffect(() => {
    if (showSSRAndMLOnly && showSROnly) setShowSSRAndMLOnly(false);
  }, [showSROnly]);

  useEffect(() => {
    setPityCounter(getPity(banner));
  }, [banner]);

  const handlePullX1 = () => {
    const { pull, newPity } = performSinglePull(
      pityCounter,
      banner,
      srPityCounter
    );
    const pullNumber = getSummonCount() + 1;
    const enriched = { ...pull, pullNumber };
    setCurrentPulls([enriched]);
    setPityCounter(newPity);
    setPity(banner, newPity);
    saveToCookie([enriched]);
  };

  const handleGenericMultiPull = (pulls: Summon[], newPity: number) => {
    const startIndex = getSummonCount() + 1;
    const enrichedPulls = pulls.map((p, i) => ({
      ...p,
      pullNumber: startIndex + i,
    }));
    setCurrentPulls(enrichedPulls);
    setPityCounter(newPity);
    setPity(banner, newPity);
    saveToCookie(enrichedPulls);
  };

  const handlePullX10 = () => {
    const { pulls, newPity } = performMultiPull(
      pityCounter,
      srPityCounter,
      banner
    );
    handleGenericMultiPull(pulls, newPity);
  };

  const handlePullX85 = () => {
    const { pulls, newPity } = perform85Pull(
      pityCounter,
      srPityCounter,
      banner
    );
    handleGenericMultiPull(pulls, newPity);
  };

  const handlePullCustom = () => {
    const { pulls, newPity } = performCustomPull(
      pityCounter,
      srPityCounter,
      banner,
      custom
    );
    handleGenericMultiPull(pulls, newPity);
  };

  const saveToCookie = (summons: SummonWithNumber[]) => {
    summons.forEach((summon) => saveSummon(summon));
    incrementSummonCount(summons.length);
  };

  const handleChangeCustom = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numberValue = parseInt(value, 10);
    setCustom(!isNaN(numberValue) ? numberValue : 0);
  };

  const handleClearSummons = () => {
    clearSummons();
    setCurrentPulls([]);
    setPityCounter(0);
    setPity(banner, 0);
    resetSummonCount();
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <aside
        style={{
          width: "10%",
          padding: "1rem",
          backgroundColor:
            window.localStorage.getItem("theme") === "dark" ? "#222" : "#eee",
          color:
            window.localStorage.getItem("theme") === "dark" ? "#fff" : "#000",
        }}
      >
        {["Limited", "Perma", "ML"].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            style={{
              display: "block",
              marginBottom: "1rem",
              padding: "0.75rem 1rem",
              width: "100%",
              height: "100px",
              fontSize: "1rem",
              borderRadius: 6,
              backgroundImage: `url(/banners/${type.toLowerCase()}.png)`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              border: selectedType === type ? "2px solid yellow" : "none",
              cursor: "pointer",
              color: "white",
              fontWeight: "bold",
              textShadow: "0 0 4px black",
            }}
          />
        ))}
      </aside>

      <main
        style={{
          width: "80%",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {selectedType ? (
          <>
            <h2>{selectedType} Summon</h2>
            <p>Total summon count : {getSummonCount()}</p>
            <p>
              SSR average : {totalSSR} / {totalPulls} pulls ({(average * 100).toFixed(2)}%)
            </p>
            <p
              style={{
                marginBottom: "1rem",
                fontWeight: "bold",
                fontSize: "1.1rem",
              }}
            >
              Pity counter : {pityCounter}
            </p>

            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
              <button onClick={handlePullX1} style={buttonStyle}>
                Pull x1
              </button>
              <button
                onClick={handlePullX10}
                style={{ ...buttonStyle, backgroundColor: "#28a745" }}
              >
                Pull x10
              </button>
              <button
                onClick={handlePullX85}
                style={{ ...buttonStyle, backgroundColor: "red" }}
              >
                Pull x85
              </button>
              <input
                type="number"
                value={custom}
                onChange={handleChangeCustom}
                min={0}
                style={{ width: "80px", color: "black"}}
              />
              <button
                onClick={handlePullCustom}
                style={{ ...buttonStyle, backgroundColor: "red" }}
              >
                Pull {custom}
              </button>
              <button
                onClick={handleClearSummons}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: 6,
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: "#dc3545",
                  color: "white",
                  flexGrow: 1,
                }}
              >
                Delete all summons
              </button>
            </div>

            <button
              onClick={() => setShowSSRAndMLOnly(!showSSRAndMLOnly)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: 6,
                cursor: "pointer",
                backgroundColor: showSSRAndMLOnly
                  ? "#007bff"
                  : window.localStorage.getItem("theme") === "dark"
                  ? "black"
                  : "#ddd",
                border:
                  window.localStorage.getItem("theme") === "dark"
                    ? "2px solid #ddd"
                    : "none",
                color:
                  window.localStorage.getItem("theme") === "dark"
                    ? "#ddd"
                    : "black",
              }}
            >
              {showSSRAndMLOnly
                ? "Display all summons"
                : "Display only SSR and ML"}
            </button>

            <button
              onClick={() => setShowSROnly(!showSROnly)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: 6,
                cursor: "pointer",
                backgroundColor: showSROnly
                  ? "#007bff"
                  : window.localStorage.getItem("theme") === "dark"
                  ? "black"
                  : "#ddd",
                border:
                  window.localStorage.getItem("theme") === "dark"
                    ? "2px solid #ddd"
                    : "none",
                color:
                  window.localStorage.getItem("theme") === "dark"
                    ? "#ddd"
                    : "black",
              }}
            >
              {showSROnly ? "Display all summons" : "Display only SR"}
            </button>

            {displayedSummons.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "1rem",
                  justifyContent: "center",
                  overflowY: "auto",
                }}
              >
                {displayedSummons.map((pull, idx) => {
                  const pityColor =
                    pull.pityType === "soft pity"
                      ? "orange"
                      : pull.pityType === "hard pity"
                      ? "red"
                      : "#000";

                  return (
                    <div
                      key={`${pull.timestamp}-${idx}`}
                      style={{
                        width: 120,
                        textAlign: "center",
                        border: `2px solid ${pityColor}`,
                        backgroundColor:
                          pull.character.folder === "ssr" ||
                          pull.character.folder === "ml"
                            ? "yellow"
                            : pull.character.folder === "sr"
                            ? "violet"
                            : "lightblue",
                        color: "black",
                        borderRadius: 8,
                        padding: 8,
                        boxShadow: "1px 1px 5px rgba(0,0,0,0.1)",
                      }}
                    >
                      <img
                        src={`/characters/${pull.character.folder}/${pull.character.filename}`}
                        alt={pull.character.title}
                        style={{
                          width: "100%",
                          height: 120,
                          objectFit: "contain",
                          borderRadius: 6,
                        }}
                      />
                      <p
                        style={{
                          margin: 4,
                          color: pityColor,
                          fontWeight:
                            pull.pityType !== "no pity" ? "bold" : undefined,
                        }}
                      >
                        {pull.character.title}
                      </p>
                      {pull.pityType !== "no pity" && (
                        <p
                          style={{
                            marginTop: 6,
                            fontWeight: "bold",
                            fontSize: "1.2rem",
                            color: pityColor,
                            textTransform: "capitalize",
                          }}
                        >
                          {pull.pityType}
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
                        Pull #{pull.pullNumber}
                      </p>
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
  padding: "1rem 2rem",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

export default Summons;
