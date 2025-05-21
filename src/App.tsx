import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Router from './router';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  localStorage.setItem("summonCount", "0");
  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ paddingTop: 8 }}>
        <Router />
      </div>
    </BrowserRouter>
  );
};

export default App;
