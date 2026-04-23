import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { label: 'Home',          path: '/'             },
  { label: 'Business',      path: '/business'     },
  { label: 'Entertainment', path: '/entertainment'},
  { label: 'Health',        path: '/health'       },
  { label: 'Science',       path: '/science'      },
  { label: 'Sports',        path: '/sports'       },
  { label: 'Technology',    path: '/technology'   },
];

const NavBar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setOpen(false); }, [location]);

  return (
    <nav
      className="navbar fixed-top navbar-expand-lg"
      style={{
        background: scrolled
          ? 'rgba(8, 10, 26, 0.92)'
          : 'rgba(10, 12, 30, 0.75)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.5)' : 'none',
        transition: 'background 0.3s, box-shadow 0.3s',
        padding: '0.55rem 1.5rem',
      }}
    >
      {/* Brand */}
      <Link
        className="navbar-brand"
        to="/"
        style={{
          fontWeight: 700,
          fontSize: '1.4rem',
          letterSpacing: '0.5px',
          background: 'linear-gradient(90deg, #4f9eff, #a78bfa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textDecoration: 'none',
        }}
      >
        BharatNewz
      </Link>

      {/* Hamburger */}
      <button
        className="navbar-toggler"
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation"
        style={{
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '8px',
          padding: '6px 10px',
          background: 'rgba(255,255,255,0.05)',
        }}
      >
        <span
          style={{
            display: 'block',
            width: '20px',
            height: '2px',
            background: '#e8eaf6',
            margin: '4px 0',
            transition: 'all 0.3s',
          }}
        />
        <span
          style={{
            display: 'block',
            width: '20px',
            height: '2px',
            background: '#e8eaf6',
            margin: '4px 0',
            transition: 'all 0.3s',
          }}
        />
        <span
          style={{
            display: 'block',
            width: '20px',
            height: '2px',
            background: '#e8eaf6',
            margin: '4px 0',
            transition: 'all 0.3s',
          }}
        />
      </button>

      {/* Links */}
      <div
        className={`collapse navbar-collapse ${open ? 'show' : ''}`}
        id="navbarNav"
      >
        <ul className="navbar-nav ms-auto gap-1 py-2 py-lg-0">
          {navLinks.map(({ label, path }) => {
            const isActive = location.pathname === path;
            return (
              <li className="nav-item" key={path}>
                <Link
                  className="nav-link"
                  to={path}
                  style={{
                    color: isActive ? '#fff' : 'rgba(232,234,246,0.65)',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.88rem',
                    letterSpacing: '0.3px',
                    padding: '0.4rem 0.85rem',
                    borderRadius: '8px',
                    background: isActive
                      ? 'rgba(79,158,255,0.15)'
                      : 'transparent',
                    border: isActive
                      ? '1px solid rgba(79,158,255,0.3)'
                      : '1px solid transparent',
                    transition: 'all 0.2s',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#fff';
                      e.currentTarget.style.background = 'rgba(79,158,255,0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'rgba(232,234,246,0.65)';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
