import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Characters from './pages/Characters';
import Summons from './pages/Summons';
import MySummons from './pages/MySummons';
import TierMaker from './pages/TierMaker/TierMaker';
import TeamMaker from './pages/TeamMaker';
import Countdown from './pages/CountdownPage';
import HowMuchTo from './pages/HowMuchTo';

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/characters" replace />} />
      <Route path="/characters" element={<Characters />} />
      <Route path="/summons" element={<Summons />} />
      <Route path="/mysummons" element={<MySummons />} />
      <Route path="/tierMaker" element={<TierMaker />} />
      <Route path="/teammaker" element={<TeamMaker />} />
      <Route path="/Countdown" element={<h1><Countdown /></h1>} />
      <Route path="/HowMuchTo" element={<h1><HowMuchTo /></h1>} />
      <Route path="*" element={<h1>404 - Page not found</h1>} />
    </Routes>
  );
};

export default Router;
