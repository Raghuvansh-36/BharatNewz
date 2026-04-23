import React from 'react';

const Spinner = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2.5rem 0',
      gap: '1rem',
    }}>
      {/* Animated ring */}
      <div style={{
        width: '48px',
        height: '48px',
        border: '3px solid rgba(79, 158, 255, 0.15)',
        borderTop: '3px solid #4f9eff',
        borderRight: '3px solid #a78bfa',
        borderRadius: '50%',
        animation: 'spinRing 0.85s linear infinite',
      }} />
      <span style={{
        fontSize: '0.78rem',
        color: 'rgba(232,234,246,0.5)',
        letterSpacing: '0.5px',
      }}>
        Loading news…
      </span>

      {/* Inject keyframe once */}
      <style>{`
        @keyframes spinRing {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Spinner;
