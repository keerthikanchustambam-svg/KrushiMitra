import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Seeds() {
    const { t } = useLanguage();
    const [seeds, setSeeds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cartMessage, setCartMessage] = useState('');

    useEffect(() => {
        fetch('http://localhost:5000/api/seeds')
            .then(res => res.json())
            .then(data => {
                setSeeds(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch seeds", err);
                setLoading(false);
            });
    }, []);

    const handleBuy = (seedName) => {
        setCartMessage(`${seedName} ${t('addedToCart')}`);
        setTimeout(() => setCartMessage(''), 3000);
    };

    if (loading) return (
        <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>
            <h2>{t('loadingSeeds')}</h2>
        </div>
    );

    return (
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '60px' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                <h1 style={{ color: 'var(--color-primary)', fontSize: '2.5rem', marginBottom: '10px' }}>{t('seeds')}</h1>
                <p style={{ color: '#666', fontSize: '1.2rem' }}>{t('seedsGallery')}</p>
            </div>

            {cartMessage && (
                <div style={{
                    position: 'fixed',
                    top: '100px',
                    right: '20px',
                    backgroundColor: 'var(--color-secondary)',
                    color: 'white',
                    padding: '15px 25px',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-md)',
                    zIndex: 2000,
                    animation: 'fadeIn 0.3s ease'
                }}>
                    ✅ {cartMessage}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
                {seeds.map(seed => (
                    <div key={seed.id} className="card" style={{ display: 'flex', flexDirection: 'column', transition: 'transform 0.3s ease' }}>
                        <div style={{ fontSize: '4rem', textAlign: 'center', padding: '30px', backgroundColor: '#f0f4f8', borderRadius: '12px', marginBottom: '20px' }}>
                            {seed.category === 'Cereals' ? '🌾' : seed.category === 'Fiber' ? '🧶' : seed.category === 'Rice' ? '🍚' : '🌱'}
                        </div>
                        <h3 style={{ marginBottom: '10px' }}>{seed.name}</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <span style={{ fontSize: '0.9rem', color: '#888' }}>{t('category')}: {seed.category}</span>
                            <span style={{ fontSize: '0.9rem', color: seed.stock === 'Limited' ? 'red' : 'green', fontWeight: 600 }}>{seed.stock}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                            <div>
                                <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-primary)' }}>{seed.price}</span>
                                <div style={{ fontSize: '0.8rem', color: '#fbbf24' }}>
                                    {'⭐'.repeat(Math.floor(seed.rating))} ({seed.rating})
                                </div>
                            </div>
                            <button onClick={() => handleBuy(seed.name)} className="btn-primary" style={{ padding: '8px 16px' }}>
                                {t('buyNow')}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
