import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { t, language, setLanguage } = useLanguage();
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  return (
    <>
      <nav className="glass-panel" style={{ position: 'fixed', top: 20, left: '2%', right: '2%', zIndex: 1000, padding: '10px 20px' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ color: 'var(--color-primary)', fontSize: '1.5rem', fontWeight: 700 }}>KrushiMitra 🌾</h1>

          {/* Desktop Menu */}
          <div className="desktop-menu" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {['home', 'crops', 'weather', 'market', 'seeds', 'sell', 'schemes'].map((key) => (
              <Link key={key} to={`/${key === 'home' ? '' : key}`} style={{ fontWeight: 500, color: 'var(--color-text-main)', textDecoration: 'none' }}>
                {t(key)}
              </Link>
            ))}

            {/* Language Switcher */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
            >
              <option value="en">English</option>
              <option value="te">తెలుగు</option>
            </select>

            {/* Auth Button */}
            {currentUser ? (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                  {t('welcome').replace('!', '')} {currentUser.displayName || currentUser.email.split('@')[0]}
                </span>
                <button onClick={handleLogout} className="btn-primary" style={{ padding: '8px 16px', backgroundColor: '#e74c3c' }}>{t('logout')}</button>
              </div>
            ) : (
              <button onClick={() => setIsLoginOpen(true)} className="btn-primary" style={{ padding: '8px 16px' }}>{t('login')}</button>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="mobile-toggle" onClick={() => setIsOpen(!isOpen)} style={{ display: 'none', cursor: 'pointer' }}>
            ☰
          </div>
        </div>

        {/* Basic Mobile Menu Implementation */}
        {isOpen && (
          <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', padding: '20px', borderRadius: '16px', marginTop: '10px', boxShadow: 'var(--shadow-lg)' }}>
            {['home', 'crops', 'weather', 'market', 'seeds', 'sell', 'schemes'].map((key) => (
              <Link key={key} to={`/${key === 'home' ? '' : key}`} style={{ display: 'block', padding: '10px 0', borderBottom: '1px solid #eee', color: 'inherit', textDecoration: 'none' }}>
                {t(key)}
              </Link>
            ))}
            <div style={{ padding: '10px 0' }}>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{ padding: '5px', width: '100%' }}
              >
                <option value="en">English</option>
                <option value="te">తెలుగు</option>
              </select>
            </div>
            {currentUser ? (
              <button onClick={handleLogout} style={{ width: '100%', padding: '10px', marginTop: '10px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px' }}>{t('logout')}</button>
            ) : (
              <button onClick={() => setIsLoginOpen(true)} style={{ width: '100%', padding: '10px', marginTop: '10px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '5px' }}>{t('login')}</button>
            )}
          </div>
        )}
        <style>{`
          @media (max-width: 768px) {
            .desktop-menu { display: none !important; }
            .mobile-toggle { display: block !important; }
          }
        `}</style>
      </nav>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
