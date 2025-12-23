import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function SellCrops() {
    const { t } = useLanguage();
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sellMessage, setSellMessage] = useState('');

    useEffect(() => {
        fetch('http://localhost:5000/api/marketplace')
            .then(res => res.json())
            .then(data => {
                setPrices(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleSell = (crop) => {
        setSellMessage(`${crop} ${t('adSuccess')}`);
        setTimeout(() => setSellMessage(''), 3000);
    };

    if (loading) return <div className="container" style={{ paddingTop: '120px' }}>{t('loadingPrices')}</div>;

    return (
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '60px' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                <h1 style={{ color: 'var(--color-primary)', fontSize: '2.5rem', marginBottom: '10px' }}>{t('priceListHero')}</h1>
                <p style={{ color: '#666' }}>{t('sellDesc')}</p>
            </div>

            {sellMessage && (
                <div style={{ padding: '15px', background: '#dcfce7', color: '#166534', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', fontWeight: 600 }}>
                    ✅ {sellMessage}
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {prices.map(item => (
                    <div key={item.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'transform 0.2s' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <div style={{ fontSize: '2rem' }}>{item.crop === 'Rice' ? '🌾' : item.crop === 'Cotton' ? '🧶' : '🌽'}</div>
                            <div>
                                <h3 style={{ margin: 0 }}>{item.crop}</h3>
                                <span style={{ color: item.trend === 'up' ? 'green' : item.trend === 'down' ? 'red' : '#666', fontSize: '0.9rem' }}>
                                    {item.trend === 'up' ? '▲ Rising' : item.trend === 'down' ? '▼ Falling' : '● Stable'}
                                </span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{item.price}</div>
                                <div style={{ fontSize: '0.7rem', color: '#888' }}>{t('lastUpdatedHeader')}: 2h ago</div>
                            </div>
                            <button onClick={() => handleSell(item.crop)} className="btn-primary" style={{ padding: '10px 25px' }}>
                                {t('sellThis')}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '50px', textAlign: 'center' }}>
                <button className="btn-primary" style={{ padding: '12px 30px', background: 'transparent', border: '2px solid var(--color-primary)', color: 'var(--color-primary)' }}>
                    {t('postAd')} (Manual Listing)
                </button>
            </div>
        </div>
    );
}
