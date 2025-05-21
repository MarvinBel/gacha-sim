import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Router from './router';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  React.useEffect(() => {
    if (!localStorage.getItem("summonCount")) {
      localStorage.setItem("summonCount", "0");
    }
  }, []);

  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

useEffect(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || savedTheme === 'light') {
    setTheme(savedTheme);
    document.body.className = savedTheme;
  }
}, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.className = newTheme;
  };

  return (
    <BrowserRouter>
      <Navbar />
      <button
  onClick={toggleTheme}
  aria-label="Toggle dark mode"
  style={{
    position: 'fixed',
    top: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: '50%',
    border: 'none',
    backgroundColor: theme === 'light' ? '#f0f0f0' : '#333',
    color: theme === 'light' ? '#222' : '#f0f0f0',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    transition: 'background-color 0.3s ease, color 0.3s ease',
    zIndex: 9999,
  }}
>
  {theme === 'light' ? '🌙' : '☀️'}
</button>


      <div style={{ paddingTop: 8 }}>
        <Router />
      </div>
    </BrowserRouter>
  );
};

export default App;
