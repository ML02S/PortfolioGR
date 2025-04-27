"use client";

import { useState } from 'react';
import { worksReversed } from '../data/works';
import { RightArrow, UpRightArrow } from './arrows';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mobile-menu">
      <button 
        className="menu-button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          background: 'rgba(255, 255, 255, 0.9)',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          cursor: 'pointer',
          fontSize: '1.2em'
        }}
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {isOpen && (
        <div 
          className="menu-content"
          style={{
            position: 'fixed',
            bottom: '70px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '8px',
            padding: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            zIndex: 999,
            maxHeight: '60vh',
            overflowY: 'auto',
            width: '70vw',
            maxWidth: '250px'
          }}
        >
          <h3 style={{ 
            margin: '0 0 8px 0', 
            fontSize: '0.9em',
            fontWeight: '600'
          }}>Projects</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {worksReversed.map((item) => (
              <a
                key={item.id}
                href={item.url}
                className="menu-item"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 8px',
                  textDecoration: 'none',
                  color: 'inherit',
                  borderRadius: '4px',
                  fontSize: '0.85em'
                }}
              >
                <span>{item.id}</span>
                {item.external ? <UpRightArrow /> : <RightArrow />}
              </a>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .menu-item:hover {
          background-color: rgba(0,0,0,0.05);
        }
      `}</style>
    </div>
  );
} 