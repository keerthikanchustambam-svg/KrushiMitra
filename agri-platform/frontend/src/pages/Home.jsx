import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import LoginModal from '../components/LoginModal';

export default function Home() {
    const { t } = useLanguage();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    const handleProtectedClick = (path) => {
        if (!currentUser) {
            setIsLoginOpen(true);
        } else {
            navigate(path);
        }
    };

    const [activeCrop, setActiveCrop] = useState(null);
    const [cropDetails, setCropDetails] = useState(null);

    React.useEffect(() => {
        const saved = localStorage.getItem('activeCrop');
        if (saved) {
            const cropData = JSON.parse(saved);
            setActiveCrop(cropData);

            // Fetch AI hints from backend
            fetch(`http://localhost:5000/api/crop-info/${cropData.crop}`)
                .then(res => res.json())
                .then(details => setCropDetails(details))
                .catch(err => console.error(err));
        }
    }, []);

    return (
        <div style={{ paddingTop: '80px', paddingBottom: '40px' }}>
            {/* Hero Section */}
            <section className="container" style={{ textAlign: 'center', margin: '60px 0' }}>
                <h1 style={{ fontSize: '3.5rem', color: 'var(--color-primary)', marginBottom: '20px' }}>
                    {t('subtitle')}
                </h1>
                <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '600px', margin: '0 auto 40px' }}>
                    {t('desc')}
                </p>
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                    <button onClick={() => handleProtectedClick('/start-farming')} className="btn-primary" style={{ textDecoration: 'none', border: 'none', fontSize: '1rem', cursor: 'pointer' }}>{t('startFarming')}</button>
                </div>
            </section>

            {/* Tracking Dashboard */}
            {activeCrop && (
                <section className="container" style={{ marginBottom: '60px' }}>
                    <div className="card" style={{ borderLeft: '10px solid var(--color-secondary)' }}>
                        <h2 style={{ color: 'var(--color-primary)', marginBottom: '20px' }}>🚀 {t('trackingHero')}: {activeCrop.crop}</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                            <div className="card" style={{ background: '#f8fafc' }}>
                                <h4 style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>{t('cropProgress')}</h4>
                                {(() => {
                                    const start = new Date(activeCrop.startDate);
                                    const now = new Date();
                                    const diffDays = Math.floor((now - start) / (1000 * 60 * 60 * 24));
                                    const totalDays = activeCrop.targetDays || 120;
                                    const progress = Math.min(100, Math.round((diffDays / totalDays) * 100)) || 5; // Min 5% to show start

                                    return (
                                        <>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{progress}%</div>
                                            <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', marginTop: '10px' }}>
                                                <div style={{ width: `${progress}%`, height: '100%', background: 'var(--color-secondary)', borderRadius: '3px' }}></div>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>
                            <div className="card" style={{ background: '#f8fafc' }}>
                                <h4 style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>{t('diseasesWatch')}</h4>
                                <ul style={{ fontSize: '0.9rem', paddingLeft: '15px', color: '#e11d48' }}>
                                    {cropDetails?.diseases.split(',').map(d => <li key={d}>{d.trim()}</li>) || <li>Checking for alerts...</li>}
                                </ul>
                            </div>
                            <div className="card" style={{ background: '#f8fafc' }}>
                                <h4 style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>{t('pesticideGuide')}</h4>
                                <p style={{ fontSize: '0.9rem', color: '#059669' }}>{cropDetails?.pesticides || 'Fetching recommendations...'}</p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

            {/* Feature Grid */}
            <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                {['crops', 'weather', 'market', 'seeds', 'sell', 'schemes'].map(feature => (
                    <div
                        key={feature}
                        onClick={() => handleProtectedClick(`/${feature === 'home' ? '' : feature}`)}
                        className="card"
                        style={{ textDecoration: 'none', color: 'inherit', display: 'block', cursor: 'pointer', transition: 'transform 0.2s' }}
                    >
                        <div style={{ fontSize: '2rem', marginBottom: '10px' }}>
                            {feature === 'crops' ? '🌾' :
                                feature === 'weather' ? '🌦' :
                                    feature === 'market' ? '📊' :
                                        feature === 'seeds' ? '🌽' :
                                            feature === 'sell' ? '💰' :
                                                '🏛'}
                        </div>
                        <h3 style={{ textTransform: 'capitalize', color: 'var(--color-primary)', marginBottom: '10px' }}>{t(feature)}</h3>
                        <p style={{ fontSize: '0.9rem', color: '#666' }}>
                            {feature === 'seeds' ? t('marketTrendsDesc') :
                                feature === 'sell' ? t('sellDesc') :
                                    t(feature + 'Desc') || t('desc')}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
