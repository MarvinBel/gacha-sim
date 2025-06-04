import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar: React.FC = () => {
  
  return (
    <nav
      style={{
        display: 'flex',
        gap: '1rem',
        padding: '1rem',
        borderBottom: '1px solid #ddd',
        backgroundColor: window.localStorage.getItem('theme') === 'dark' ? '#222' : '#eee',
        color: window.localStorage.getItem('theme') === 'dark' ? '#fff' : '#000',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      {[
        { label: 'Characters', path: '/characters' },
        { label: 'Summon', path: '/summons' },
        { label: 'My pulls', path: '/mysummons' },
        { label: 'TierMaker', path: '/tierMaker' },
        { label: 'TeamMaker', path: '/teamMaker' },
        { label: 'Countdown', path: '/countdown' },
        { label: 'How Much To', path: '/howMuchTo' },
      ].map(({ label, path }) => (
        <NavLink
          key={path}
          to={path}
          style={({ isActive }) => ({
            padding: '0.5rem 1rem',
            borderRadius: 4,
            textDecoration: 'none',
            color: isActive ? 'white' : window.localStorage.getItem('theme') === 'dark' ? 'white' : '#333',
            backgroundColor: isActive ? '#007bff' : 'transparent',
            fontWeight: isActive ? 'bold' : 'normal',
            border: isActive ? 'none' : '1px solid transparent',
          })}
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
};

export default Navbar;
