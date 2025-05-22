import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import Router from "./router";
import Navbar from "./components/Navbar";
import Changelog from "./components/Changelog";

const App: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [changelogOpen, setChangelogOpen] = useState(false); // état modale changelog

  useEffect(() => {
    if (!localStorage.getItem("summonCount")) {
      localStorage.setItem("summonCount", "0");
    }
    if (!localStorage.getItem("theme")) {
      localStorage.setItem("theme", "dark");
    }
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
      document.body.className = savedTheme;
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.className = newTheme;
  };

  const openChangelog = () => setChangelogOpen(true);
  const closeChangelog = () => setChangelogOpen(false);

  return (
    <BrowserRouter>
      <Navbar />
      
      <button
        onClick={openChangelog}
        aria-label="Display changelog"
        style={{
          position: "fixed",
          top: 16,
          right: 80,
          width: 44,
          height: 44,
          borderRadius: "50%",
          border: "none",
          backgroundColor: theme === "light" ? "#f0f0f0" : "#333",
          color: theme === "light" ? "#222" : "#f0f0f0",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          transition: "background-color 0.3s ease, color 0.3s ease",
          zIndex: 9999,
        }}
      >
        {"📝"}
      </button>

      {/* Bouton toggle thème */}
      <button
        onClick={toggleTheme}
        aria-label="Toggle dark mode"
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          width: 44,
          height: 44,
          borderRadius: "50%",
          border: "none",
          backgroundColor: theme === "light" ? "#f0f0f0" : "#333",
          color: theme === "light" ? "#222" : "#f0f0f0",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          transition: "background-color 0.3s ease, color 0.3s ease",
          zIndex: 9999,
        }}
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>

      {/* Modale changelog */}
      <Changelog open={changelogOpen} handleClose={closeChangelog} />

      <div style={{ paddingTop: 8 }}>
        <Router />
      </div>
    </BrowserRouter>
  );
};

export default App;
